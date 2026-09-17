import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: Redis };

const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 2,
    connectTimeout: 3000,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

const MAX_LIKES_PER_USER = 5;

const ADD_LIKES = `
local current = tonumber(redis.call("HGET", KEYS[1], ARGV[1]) or "0")
local applied = math.min(tonumber(ARGV[2]), tonumber(ARGV[3]) - current)
if applied > 0 then
  redis.call("HINCRBY", KEYS[1], ARGV[1], applied)
  return { current + applied, redis.call("INCRBY", KEYS[2], applied) }
end
return { current, tonumber(redis.call("GET", KEYS[2]) or "0") }
`;

type LikesRedis = Redis & {
  addLikes(key: string, totalKey: string, userId: string, requested: number, max: number): Promise<[number, number]>;
};

if (!("addLikes" in redis)) redis.defineCommand("addLikes", { numberOfKeys: 2, lua: ADD_LIKES });

type RouteParams = { params: Promise<{ slug: string }> };

function getUserId(req: NextRequest): string {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "localhost";

  return createHash("sha256")
    .update(ip + process.env.LIKES_SALT)
    .digest("hex")
    .slice(0, 16);
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const userId = getUserId(req);

  try {
    const results = await redis
      .pipeline()
      .get(`likes:${slug}:total`)
      .hget(`likes:${slug}`, userId)
      .exec();
    if (!results || results.some(([err]) => err)) throw new Error("redis unavailable");
    const [[, total], [, userLikes]] = results;

    return NextResponse.json({
      total: Number(total ?? 0),
      userLikes: Number(userLikes ?? 0),
      max: MAX_LIKES_PER_USER,
    });
  } catch {
    return NextResponse.json({ total: 0, userLikes: 0, max: MAX_LIKES_PER_USER }, { status: 503 });
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const userId = getUserId(req);

  const body = await req.json().catch(() => ({}));
  const requested = Math.min(Math.max(Math.floor(Number(body?.count) || 1), 1), MAX_LIKES_PER_USER);

  try {
    const [userLikes, total] = await (redis as LikesRedis).addLikes(
      `likes:${slug}`,
      `likes:${slug}:total`,
      userId,
      requested,
      MAX_LIKES_PER_USER,
    );

    return NextResponse.json({ total, userLikes, max: MAX_LIKES_PER_USER });
  } catch {
    return NextResponse.json({ error: "storage unavailable" }, { status: 503 });
  }
}
