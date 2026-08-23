import Image from "next/image";
import type { GithubSocial } from "@/types/socials";

const WEEKS = 53;
const DAYS = 7;
const CELL = 10;
const GAP = 3;
const LEVEL_OPACITY = [0.08, 0.3, 0.5, 0.75, 1];

function fallbackWeeks(seed: string): number[][] {
  let state = 0;
  for (const char of seed) state = (state * 31 + char.charCodeAt(0)) % 2147483647;

  return Array.from({ length: WEEKS }, () =>
    Array.from({ length: DAYS }, () => {
      state = (state * 1103515245 + 12345) % 2147483647;
      const roll = state % 100;
      if (roll < 42) return 0;
      if (roll < 66) return 1;
      if (roll < 84) return 2;
      if (roll < 95) return 3;
      return 4;
    }),
  );
}

export default function GithubCard({ social }: { social: GithubSocial }) {
  const weeks = social.weeks ?? fallbackWeeks(social.handle);
  const width = WEEKS * (CELL + GAP) - GAP;
  const height = DAYS * (CELL + GAP) - GAP;

  return (
    <div className="w-80 p-3">
      <div className="flex items-center gap-2">
        {social.avatar && (
          <Image
            src={social.avatar}
            alt={social.name}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
        )}
        <div className="min-w-0">
          <p className="truncate font-medium text-text-highlight">{social.handle}</p>
          {social.contributions !== undefined && (
            <p className="text-[11px] text-foreground/50">
              <span className="tabular-nums text-foreground/75">
                {social.contributions.toLocaleString()}
              </span>{" "}
              contributions in the last year
            </p>
          )}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-3 w-full text-[#2ea043]"
        aria-hidden
        focusable="false"
      >
        {weeks.map((week, x) =>
          week.map((level, y) => (
            <rect
              key={`${x}-${y}`}
              x={x * (CELL + GAP)}
              y={y * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={2}
              fill="currentColor"
              opacity={LEVEL_OPACITY[level] ?? 0.08}
            />
          )),
        )}
      </svg>
    </div>
  );
}
