"use client";
import { DitheredWaves } from "ditherwave";

export default function LogoWave({ color }: { color: string }) {
  const waveColor = color ?? "#ff003c";

  return (
    <div className="w-full h-full absolute inset-0">
      <DitheredWaves
        waveColor={waveColor}
        baseColor="#0B0504"
        pixelSize={0.5}
        colorNum={3}
        waveSpeed={0.04}
        waveFrequency={4}
        waveAmplitude={0.5}
        enableMouseInteraction={false}
      />
    </div>
  );
}
