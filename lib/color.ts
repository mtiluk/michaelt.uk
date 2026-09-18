function parseHex(hex: string) {
  let h = hex.trim().replace("#", "");
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  const alpha = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], alpha };
}

export function mixHex(from: string, to: string, t: number) {
  const a = parseHex(from).rgb;
  const b = parseHex(to).rgb;
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

export function blendOver(base: string, color: string, opacity: number) {
  return mixHex(base, color, parseHex(color).alpha * opacity);
}
