export type PaletteName = "ember" | "frost" | "acka" | "moss" | "plum";

export type Palette = {
  label: string;
  background: string;
  foreground: string;
  foregroundDiv: string;
  textHighlight: string;
  highlight: string;
  activeStatus: string;
};

export const PALETTE_STORAGE_KEY = "palette";
export const DEFAULT_PALETTE: PaletteName = "ember";

export const PALETTES: Record<PaletteName, Palette> = {
  ember: {
    label: "Ember",
    background: "#0c0504",
    foreground: "#d1c5ad99",
    foregroundDiv: "#1c0b09",
    textHighlight: "#d1c5ad",
    highlight: "#ff003c",
    activeStatus: "#5e6c32",
  },
  frost: {
    label: "Frost",
    background: "#05080c",
    foreground: "#adc2d999",
    foregroundDiv: "#0b1420",
    textHighlight: "#c6d8e8",
    highlight: "#3ba9ff",
    activeStatus: "#2f6c6a",
  },
  acka: {
    label: "Acka",
    background: "#0e0307",
    foreground: "#e4a2bc99",
    foregroundDiv: "#240611",
    textHighlight: "#f0bed2",
    highlight: "#ff3ba4",
    activeStatus: "#7c1f5d",
  },
  moss: {
    label: "Moss",
    background: "#050a06",
    foreground: "#b6cdb199",
    foregroundDiv: "#0d1a11",
    textHighlight: "#cde0c6",
    highlight: "#57d97f",
    activeStatus: "#4d6c32",
  },
  plum: {
    label: "Plum",
    background: "#0a0510",
    foreground: "#cbbcd999",
    foregroundDiv: "#170c20",
    textHighlight: "#ddd0e6",
    highlight: "#c857ff",
    activeStatus: "#5c3f7a",
  },
};

export const PALETTE_ORDER = Object.keys(PALETTES) as PaletteName[];

export function paletteVars(palette: Palette): Record<string, string> {
  return {
    "--background": palette.background,
    "--foreground": palette.foreground,
    "--foreground-div": palette.foregroundDiv,
    "--text-highlight": palette.textHighlight,
    "--highlight": palette.highlight,
    "--active-status": palette.activeStatus,
  };
}

export function isPaletteName(value: unknown): value is PaletteName {
  return typeof value === "string" && value in PALETTES;
}
