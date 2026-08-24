"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  DEFAULT_PALETTE,
  PALETTES,
  PALETTE_ORDER,
  PALETTE_STORAGE_KEY,
  isPaletteName,
  paletteVars,
  type PaletteName,
} from "@/lib/palettes";

const TOAST_MS = 1400;

type PaletteContextValue = {
  name: PaletteName;
  palette: (typeof PALETTES)[PaletteName];
  setPalette: (name: PaletteName) => void;
  cyclePalette: () => void;
};

const PaletteContext = createContext<PaletteContextValue>({
  name: DEFAULT_PALETTE,
  palette: PALETTES[DEFAULT_PALETTE],
  setPalette: () => {},
  cyclePalette: () => {},
});

export function usePalette() {
  return useContext(PaletteContext);
}

export default function PaletteProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState<PaletteName>(DEFAULT_PALETTE);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(PALETTE_STORAGE_KEY);
    if (isPaletteName(stored)) setName(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(paletteVars(PALETTES[name]))) {
      root.style.setProperty(key, value);
    }
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, name);
    } catch {}
  }, [name]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const setPalette = useCallback((next: PaletteName) => {
    setName(next);
    setToast(PALETTES[next].label);
  }, []);

  const cyclePalette = useCallback(() => {
    setName((current) => {
      const next = PALETTE_ORDER[(PALETTE_ORDER.indexOf(current) + 1) % PALETTE_ORDER.length];
      setToast(PALETTES[next].label);
      return next;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "b") return;
      e.preventDefault();
      cyclePalette();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [cyclePalette]);

  return (
    <PaletteContext.Provider value={{ name, palette: PALETTES[name], setPalette, cyclePalette }}>
      {children}

      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="pointer-events-none fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1.5 text-[11px] text-text-highlight shadow-lg shadow-black/30 ring-1 ring-foreground/10 backdrop-blur-md"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </PaletteContext.Provider>
  );
}
