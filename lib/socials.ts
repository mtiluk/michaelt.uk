import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { isPlatform, type Social } from "@/types/socials";

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
