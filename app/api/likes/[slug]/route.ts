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
    const [total, userLikes] = await Promise.all([
      redis.get(`likes:${slug}:total`),
      redis.hget(`likes:${slug}`, userId),
    ]);

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
    const current = Number((await redis.hget(`likes:${slug}`, userId)) ?? 0);
    const applied = Math.min(requested, MAX_LIKES_PER_USER - current);

    if (applied > 0) {
      await redis
        .multi()
        .hincrby(`likes:${slug}`, userId, applied)
        .incrby(`likes:${slug}:total`, applied)
        .exec();
    }

    const total = Number((await redis.get(`likes:${slug}:total`)) ?? 0);

    return NextResponse.json({ total, userLikes: current + applied, max: MAX_LIKES_PER_USER });
  } catch {
    return NextResponse.json({ error: "storage unavailable" }, { status: 503 });
  }
}
