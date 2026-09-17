"use client";

import { useState } from "react";
import { useSound } from "@/lib/audio";

export function useToggleSound(initial = false) {
  const [on, setOn] = useState(initial);
  const playExpand = useSound("expand");
  const playCollapse = useSound("collapse");

  function toggle() {
    (on ? playCollapse : playExpand)();
    setOn((v) => !v);
  }

  return [on, toggle] as const;
}
