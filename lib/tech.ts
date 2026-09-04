import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons/brand";
import {
  SiApache,
  SiC,
  SiDiscord,
  SiElectron,
  SiFigma,
  SiGo,
  SiLaravel,
  SiNextdotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiSupabase,
  SiTelegram,
  SiTypescript,
} from "@/components/icons/tech";

export type TechEntry = {
  label: string;
  icon: ComponentType<IconProps>;
  /** Brand hex. Omitted where the brand mark is black/white and should follow badge text color instead. */
  color?: string;
};

const TECH: Record<string, TechEntry> = {
  typescript: { label: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  python: { label: "Python", icon: SiPython, color: "#3776AB" },
  php: { label: "PHP", icon: SiPhp, color: "#777BB4" },
  c: { label: "C", icon: SiC, color: "#A8B9CC" },
  nextjs: { label: "Next.js", icon: SiNextdotjs },
  supabase: { label: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
  laravel: { label: "Laravel", icon: SiLaravel, color: "#FF2D20" },
  postgresql: { label: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  apache: { label: "Apache", icon: SiApache, color: "#D22128" },
  discord: { label: "Discord", icon: SiDiscord, color: "#5865F2" },
  telegram: { label: "Telegram", icon: SiTelegram, color: "#26A5E4" },
  figma: { label: "Figma", icon: SiFigma, color: "#F24E1E" },
  go: { label: "Go", icon: SiGo, color: "#00ADD8" },
  electron: { label: "Electron", icon: SiElectron, color: "#47848F" },
};

export function getTech(name: string): TechEntry | undefined {
  return TECH[name.toLowerCase().replace(/[^a-z0-9]/g, "")];
}
