import type { LeetcodeSolved } from "@/types/socials";

const GRAPHQL = "https://leetcode.com/graphql";
const REVALIDATE = 3600;

const QUERY = `query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    profile { ranking }
    submitStatsGlobal {
      acSubmissionNum { difficulty count }
    }
  }
}`;

type LeetcodeStats = {
  ranking?: number;
  solved: LeetcodeSolved;
};

export async function getLeetcodeStats(username: string): Promise<LeetcodeStats | null> {
  try {
    const response = await fetch(GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      next: { revalidate: REVALIDATE },
    });

    if (!response.ok) {
      console.warn(`[socials] no leetcode data for ${username}`);
      return null;
    }

    const payload = await response.json();
    const user = payload?.data?.matchedUser;
    if (!user) {
      console.warn(`[socials] no leetcode data for ${username}`);
      return null;
    }

    const counts: Record<string, number> = {};
    for (const entry of user.submitStatsGlobal?.acSubmissionNum ?? []) {
      counts[entry.difficulty] = entry.count;
    }

    return {
      ranking: user.profile?.ranking,
      solved: {
        total: counts.All ?? 0,
        easy: counts.Easy ?? 0,
        medium: counts.Medium ?? 0,
        hard: counts.Hard ?? 0,
      },
    };
  } catch (error) {
    console.warn(`[socials] leetcode fetch failed for ${username}`, error);
    return null;
  }
}
