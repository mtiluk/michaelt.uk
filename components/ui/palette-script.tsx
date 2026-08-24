import { PALETTES, PALETTE_STORAGE_KEY, paletteVars } from "@/lib/palettes";

const VAR_MAP = Object.fromEntries(
  Object.entries(PALETTES).map(([name, palette]) => [name, paletteVars(palette)]),
);

const SCRIPT = `(function(){try{var n=localStorage.getItem(${JSON.stringify(
  PALETTE_STORAGE_KEY,
)});var m=${JSON.stringify(VAR_MAP)};var v=m[n];if(!v)return;var r=document.documentElement;for(var k in v){r.style.setProperty(k,v[k]);}}catch(e){}})();`;

export default function PaletteScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
