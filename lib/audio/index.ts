"use client";
import { useCallback } from "react";
import { play, type SoundName } from "./synth";

export { play };
export type { SoundName };

export function useSound(name: SoundName) {
  return useCallback(() => play(name), [name]);
}
