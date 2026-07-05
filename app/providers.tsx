"use client";
import { useState, type ReactNode } from "react";
import { SoundProvider } from "@web-kits/audio/react";

export default function Providers({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.8);

  return (
    <SoundProvider enabled={enabled} volume={volume} onEnabledChange={setEnabled} onVolumeChange={setVolume}>
      {children}
    </SoundProvider>
  );
}
