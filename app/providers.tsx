"use client";
import type { ReactNode } from "react";
import SoundSettingsProvider from "@/components/providers/sound-settings";

export default function Providers({ children }: { children: ReactNode }) {
  return <SoundSettingsProvider>{children}</SoundSettingsProvider>;
}
