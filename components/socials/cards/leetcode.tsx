import Image from "next/image";
import Link from "next/link";
import type { LeetcodeSocial } from "@/types/socials";

const DIFFICULTY_COLOR = {
  easy: "#00b8a3",
  medium: "#ffc01e",
  hard: "#ff375f",
} as const;

export default function LeetcodeCard({ social }: { social: LeetcodeSocial }) {
  return (
    <div className="w-72">
      <div className="h-14 bg-linear-to-r from-[#1a1a1a] to-[#2d2d2d]" />

      <div className="relative px-3 pb-3">
        {social.avatar && (
          <Image
            src={social.avatar}
            alt={social.name}
            width={48}
            height={48}
            className="absolute -top-6 size-12 rounded-full border-2 border-background object-cover"
          />
        )}

        <div className="flex items-end justify-between gap-3 pt-7">
          <div className="min-w-0">
            <Link
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-text-highlight transition-opacity hover:opacity-70"
            >
              {social.name}
            </Link>
            <p className="mt-1 text-[11px] text-foreground/60">@{social.handle}</p>
          </div>
          {social.ranking !== undefined && (
            <p className="shrink-0 text-[11px] text-foreground/40">
              Rank <span className="tabular-nums text-foreground/70">#{social.ranking.toLocaleString()}</span>
            </p>
          )}
        </div>

        {social.solved && (
          <div className="mt-3 flex items-center gap-3 text-[11px] tabular-nums">
            <span style={{ color: DIFFICULTY_COLOR.easy }}>{social.solved.easy} Easy</span>
            <span style={{ color: DIFFICULTY_COLOR.medium }}>{social.solved.medium} Med</span>
            <span style={{ color: DIFFICULTY_COLOR.hard }}>{social.solved.hard} Hard</span>
            <span className="ml-auto text-foreground/40">{social.solved.total} solved</span>
          </div>
        )}
      </div>
    </div>
  );
}
