import { BsGithub, BsLinkedin, BsTwitterX, FaLetterboxd, SiLeetcode } from "@/components/icons/brand";
import { SiDiscord } from "@/components/icons/tech";
import type { Platform } from "@/types/socials";

type PlatformMeta = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

export const REGISTRY: Record<Platform, PlatformMeta> = {
  github: { icon: BsGithub, label: "GitHub" },
  letterboxd: { icon: FaLetterboxd, label: "Letterboxd" },
  x: { icon: BsTwitterX, label: "X" },
  linkedin: { icon: BsLinkedin, label: "LinkedIn" },
  leetcode: { icon: SiLeetcode, label: "LeetCode" },
  discord: { icon: SiDiscord, label: "Discord" },
};
