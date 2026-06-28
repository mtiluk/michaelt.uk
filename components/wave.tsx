"use client";
import { DitheredWaves } from "ditherwave";

export default function Wave() {
  return (
    <div className="w-screen h-[39vh] absolute">
      <DitheredWaves
        waveColor="#ff003c"
        baseColor="#0B0504"
        pixelSize={3}
        colorNum={8}
        waveSpeed={0.02}
        waveFrequency={3.2}
        waveAmplitude={0.5}
        enableMouseInteraction={false}
      />
    </div>
  );
}
