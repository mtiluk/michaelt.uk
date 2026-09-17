import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { isPlatform, type DiscordSocial, type Social, type SocialsLiveData } from "@/types/socials";
import { getContributions } from "./github";
import { getLeetcodeStats } from "./leetcode";
import { getLanyardPresence } from "./lanyard";

const socialsFile = path.join(process.cwd(), "content/socials.yaml");

export function getSocials(): Social[] {
  let raw: string;
  try {
    raw = fs.readFileSync(socialsFile, "utf8");
  } catch {
    return [];
  }

  const entries = (parse(raw) ?? []) as unknown[];

  return entries.filter((entry): entry is Social => {
    if (typeof entry !== "object" || entry === null) return false;
    const candidate = entry as Record<string, unknown>;
    return (
      isPlatform(candidate.platform) &&
      typeof candidate.href === "string" &&
      typeof candidate.handle === "string"
    );
  });
}

export async function getSocialsLiveData(): Promise<SocialsLiveData> {
  const socials = getSocials();
  const github = socials.find((social) => social.platform === "github");
  const leetcode = socials.find((social) => social.platform === "leetcode");
  const discord = socials.find((social): social is DiscordSocial => social.platform === "discord");

  const [contributions, leetcodeStats, presence] = await Promise.all([
    github ? getContributions(github.handle) : null,
    leetcode ? getLeetcodeStats(leetcode.handle) : null,
    discord ? getLanyardPresence(discord.discordId) : null,
  ]);

  return {
    ...(contributions && {
      github: { contributions: contributions.total, weeks: contributions.weeks },
    }),
    ...(leetcodeStats && {
      leetcode: { ranking: leetcodeStats.ranking, solved: leetcodeStats.solved },
    }),
    ...(presence && {
      discord: {
        status: presence.status,
        customStatus: presence.customStatus,
        activity: presence.activity,
        spotify: presence.spotify,
      },
    }),
  };
}
