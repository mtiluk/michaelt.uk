"use client";
import { usePalette } from "@/components/providers/palette-provider";
import { PALETTES, PALETTE_ORDER } from "@/lib/palettes";

const focusRing = "cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-text-highlight/50";

export default function PreferencesBar() {
  const { name, setPalette } = usePalette();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-center justify-between px-6 py-6 text-[10px] text-foreground/25 sm:px-10">
      <div className="pointer-events-auto hidden gap-3 sm:flex">
        <span>
          <kbd className="font-sans">⌘B</kbd> theme
        </span>
      </div>

      <div className="pointer-events-auto ml-auto flex items-center gap-2.5">
        {PALETTE_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setPalette(key)}
            aria-label={`${PALETTES[key].label} theme`}
            aria-pressed={key === name}
            title={PALETTES[key].label}
            style={{ backgroundColor: PALETTES[key].highlight }}
            className={`size-2.5 rounded-full transition-all duration-200 hover:scale-125 ${focusRing} ${
              key === name ? "ring-1 ring-foreground/40 ring-offset-2 ring-offset-background" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
