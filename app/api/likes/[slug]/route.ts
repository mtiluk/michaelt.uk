// app/api/likes/[slug]/route.ts
//
// ─── HOW THIS WORKS (the Josh Comeau approach) ──────────────────────────────
//
// Each blog post keeps a Redis hash:   likes:{slug} → { userId: count, ... }
// plus a plain counter:                likes:{slug}:total
//
// The "userId" is NOT stored in localStorage or a cookie — Josh originally
// tried client-generated IDs and someone spammed his endpoint with thousands
// of fake likes. Instead, the ID is derived on the SERVER from the visitor's
// IP address, run through SHA-256 with a secret salt. That means:
//
//   1. The same visitor always maps to the same ID  → the 5-like cap holds.
//   2. We never store a raw IP                      → privacy preserved.
//   3. The client can't forge an identity           → no spam.
//
// ─── SETUP (self-hosted Redis via Docker) ───────────────────────────────────
//
//   npm i ioredis
//
// .env needs:
//
//   REDIS_URL=redis://redis:6379        ← "redis" = the compose service name.
//                                          Use redis://localhost:6379 when
//                                          running `next dev` outside Docker
//                                          (and expose the port in compose).
//   LIKES_SALT=any-long-random-string   ← generate once, never change it
//                                          (changing it resets everyone's cap)
//
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

// ── Redis client singleton ──
// In dev, Next.js hot-reloads modules constantly; naively doing `new Redis()`
// at module scope would open a fresh connection on every reload and slowly
// exhaust them. Stashing the client on globalThis survives reloads.
// (Same pattern people use for Prisma.)
const globalForRedis = globalThis as unknown as { redis?: Redis };

const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    // Don't hang requests forever if Redis is down — fail fast instead.
    maxRetriesPerRequest: 2,
    connectTimeout: 3000,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

/** The maximum number of likes a single visitor can give one post. */
const MAX_LIKES_PER_USER = 5;

type RouteParams = {
  // Next 15: dynamic route params arrive as a Promise
  params: Promise<{ slug: string }>;
};

/**
 * Turn the visitor's IP into a stable, anonymous ID.
 *
 * Self-hosting note: `x-forwarded-for` is only trustworthy if it's set by
 * YOUR reverse proxy (nginx / Traefik / Caddy / Cloudflare) in front of the
 * container. If the app is exposed directly, a client could spoof the header
 * to reset their cap. Make sure your proxy overwrites (not appends blindly)
 * the header, or read your proxy's dedicated header (e.g. Cloudflare's
 * `cf-connecting-ip`) first.
 */
function getUserId(req: NextRequest): string {
  const ip =
    req.headers.get("cf-connecting-ip") ?? // Cloudflare, if you use it
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "localhost";

  // SHA-256(ip + secret salt) → irreversible without the salt.
  // We only keep 16 hex chars; that's ample uniqueness for this purpose
  // and keeps the Redis hash small.
  return createHash("sha256")
    .update(ip + process.env.LIKES_SALT)
    .digest("hex")
    .slice(0, 16);
}

/**
 * GET /api/likes/[slug]
 * Returns the total like count for the post, and how many likes
 * THIS visitor has already spent (so the heart renders pre-filled).
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const userId = getUserId(req);

  try {
    // ioredis returns strings (or null) — convert with Number() ourselves.
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
    // Redis unreachable → degrade gracefully; the button renders at 0
    // instead of erroring the page.
    return NextResponse.json(
      { total: 0, userLikes: 0, max: MAX_LIKES_PER_USER },
      { status: 503 },
    );
  }
}

/**
 * POST /api/likes/[slug]   body: { count: number }
 *
 * The client BATCHES clicks (see the component): if you tap the heart three
 * times quickly, it sends one request with { count: 3 } instead of three
 * requests. We apply as much of that batch as the cap allows.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const userId = getUserId(req);

  // Parse + sanitise the requested increment. Never trust the client:
  // clamp to a sane range even before applying the per-user cap.
  const body = await req.json().catch(() => ({}));
  const requested = Math.min(
    Math.max(Math.floor(Number(body?.count) || 1), 1),
    MAX_LIKES_PER_USER,
  );

  try {
    // How many likes has this visitor already spent on this post?
    const current = Number((await redis.hget(`likes:${slug}`, userId)) ?? 0);

    // Apply only what fits under the cap. If they're already at 5,
    // `applied` is 0 and nothing is written.
    const applied = Math.min(requested, MAX_LIKES_PER_USER - current);

    if (applied > 0) {
      // MULTI/EXEC = both increments applied atomically as one transaction,
      // so the per-user hash and the total can't drift apart.
      await redis
        .multi()
        .hincrby(`likes:${slug}`, userId, applied)
        .incrby(`likes:${slug}:total`, applied)
        .exec();
    }

    const total = Number((await redis.get(`likes:${slug}:total`)) ?? 0);

    return NextResponse.json({
      total,
      userLikes: current + applied,
      max: MAX_LIKES_PER_USER,
    });
  } catch {
    // Redis unreachable → tell the client nothing was saved, so its
    // optimistic update rolls back (the component handles non-OK/failed
    // responses in its catch).
    return NextResponse.json({ error: "storage unavailable" }, { status: 503 });
  }
}
