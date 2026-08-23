import { BsGithub, BsLinkedin, BsTwitterX, FaLetterboxd } from "@/components/icons/brand";
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
};
