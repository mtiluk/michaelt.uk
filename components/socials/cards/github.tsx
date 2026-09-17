"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { ContributionDay, GithubSocial } from "@/types/socials";

const WEEKS = 53;
const DAYS = 7;
const CELL = 10;
const GAP = 3;
const VIEW_WIDTH = WEEKS * (CELL + GAP) - GAP;
const VIEW_HEIGHT = DAYS * (CELL + GAP) - GAP;
const LEVEL_OPACITY = [0.08, 0.3, 0.5, 0.75, 1];

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type Hovered = { column: number; row: number };

function fallbackWeeks(seed: string): ContributionDay[][] {
  let state = 0;
  for (const char of seed) state = (state * 31 + char.charCodeAt(0)) % 2147483647;

  const start = new Date();
  start.setDate(start.getDate() - WEEKS * DAYS + 1);

  return Array.from({ length: WEEKS }, (_, week) =>
    Array.from({ length: DAYS }, (_, day) => {
      state = (state * 1103515245 + 12345) % 2147483647;
      const roll = state % 100;
      const level = roll < 42 ? 0 : roll < 66 ? 1 : roll < 84 ? 2 : roll < 95 ? 3 : 4;
      const date = new Date(start);
      date.setDate(start.getDate() + week * DAYS + day);
      return { date: date.toISOString().slice(0, 10), count: level * 3, level };
    }),
  );
}

function label(day: ContributionDay) {
  const count = day.count === 0 ? "No" : day.count;
  const plural = day.count === 1 ? "" : "s";
  return `${count} contribution${plural} on ${formatter.format(new Date(day.date))}`;
}

export default function GithubCard({ social }: { social: GithubSocial }) {
  const [hovered, setHovered] = useState<Hovered | null>(null);
  const weeks = useMemo(() => social.weeks ?? fallbackWeeks(social.handle), [social]);
  const hoveredDay = hovered ? weeks[hovered.column]?.[hovered.row] : undefined;

  const grid = useMemo(
    () =>
      weeks.map((week, column) =>
        week.map((day, row) => (
          <rect
            key={day.date}
            data-column={column}
            data-row={row}
            x={column * (CELL + GAP)}
            y={row * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={2}
            fill="currentColor"
            opacity={LEVEL_OPACITY[day.level] ?? 0.08}
          />
        )),
      ),
    [weeks],
  );

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const { column, row } = (e.target as SVGElement).dataset;
    if (column === undefined || row === undefined) return;
    const next = { column: Number(column), row: Number(row) };
    setHovered((prev) => (prev?.column === next.column && prev.row === next.row ? prev : next));
  }

  const x = hovered
    ? Math.min(Math.max(((hovered.column * (CELL + GAP) + CELL / 2) / VIEW_WIDTH) * 100, 18), 82)
    : 0;
  const y = hovered ? ((hovered.row * (CELL + GAP)) / VIEW_HEIGHT) * 100 : 0;

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
            <p className="truncate text-[11px] text-foreground/50">
              <span className="tabular-nums text-foreground/75">
                {social.contributions.toLocaleString()}
              </span>{" "}
              contributions in the last year
            </p>
          )}
        </div>
      </div>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full text-[#2ea043]"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHovered(null)}
        >
          {grid}
        </svg>

        <div
          aria-hidden={!hoveredDay}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            translate: "-50% calc(-100% - 6px)",
            opacity: hoveredDay ? 1 : 0,
          }}
          className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md border border-foreground/20 bg-background px-2 py-1 text-[10px] text-foreground/80 shadow-lg shadow-black/40 transition-opacity duration-100"
        >
          {hoveredDay ? label(hoveredDay) : null}
        </div>
      </div>
    </div>
  );
}
