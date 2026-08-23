"use client";

import { useEffect, useState } from "react";

export default function CommandHint() {
  const [key, setKey] = useState("Ctrl");

  useEffect(() => {
    if (navigator.platform.toLowerCase().includes("mac")) setKey("⌘");
  }, []);

  function open() {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true, bubbles: true }),
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open search"
      className="inline-flex items-center gap-1 rounded-md text-[11px] text-foreground/40 transition-colors hover:text-text-highlight/75 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-text-highlight/50"
    >
      <kbd className="rounded border border-foreground/15 px-1 py-0.5 font-sans text-[10px]">
        {key}K
      </kbd>
      Search
    </button>
  );
}
