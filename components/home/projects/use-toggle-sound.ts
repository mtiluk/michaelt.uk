"use client";

import { useState } from "react";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";

export function useToggleSound(initial = false) {
  const [on, setOn] = useState(initial);
  const playExpand = useSound(retro.expand);
  const playCollapse = useSound(retro.collapse);

  function toggle() {
    (on ? playCollapse : playExpand)();
    setOn((v) => !v);
  }

  return [on, toggle] as const;
}
