import { NextResponse } from "next/server";
import { getSocialsLiveData } from "@/lib/socials";

export const revalidate = 60;

export async function GET() {
  return NextResponse.json(await getSocialsLiveData(), {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" },
  });
}
