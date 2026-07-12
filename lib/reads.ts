import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

export type ReadType = "book" | "article" | "blog";

export type Read = {
  type: ReadType;
  title: string;
  url: string;
  author?: string;
  note?: string;
  favorite?: boolean;
  status?: "reading";
  source: string;
};

const readsFile = path.join(process.cwd(), "content/reads.yaml");

export function getReads(): Read[] {
  let raw: string;
  try {
    raw = fs.readFileSync(readsFile, "utf8");
  } catch {
    return [];
  }

  const entries = (parse(raw) ?? []) as Omit<Read, "source">[];

  return (
    entries
      .map((entry) => ({
        ...entry,
        source:
          entry.author ??
          (() => {
            try {
              return new URL(entry.url).hostname.replace(/^www\./, "");
            } catch {
              return "";
            }
          })(),
      }))
      .sort(
        (a, b) =>
          Number(b.status === "reading") - Number(a.status === "reading"),
      )
  );
}
