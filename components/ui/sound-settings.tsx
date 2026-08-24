"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { SoundProvider } from "@web-kits/audio/react";

const SOUND_STORAGE_KEY = "sound";
const DEFAULT_ENABLED = false;
const DEFAULT_VOLUME = 0.8;

type SoundSettings = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
};

const SoundSettingsContext = createContext<SoundSettings>({
  enabled: DEFAULT_ENABLED,
  setEnabled: () => {},
  volume: DEFAULT_VOLUME,
  setVolume: () => {},
});

export function useSoundSettings() {
  return useContext(SoundSettingsContext);
}

export default function SoundSettingsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(DEFAULT_ENABLED);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  useEffect(() => {
    const stored = localStorage.getItem(SOUND_STORAGE_KEY);
    if (stored === "on" || stored === "off") setEnabledState(stored === "on");
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, next ? "on" : "off");
    } catch {}
  }, []);

  return (
    <SoundSettingsContext.Provider value={{ enabled, setEnabled, volume, setVolume }}>
      <SoundProvider enabled={enabled} volume={volume} onEnabledChange={setEnabled} onVolumeChange={setVolume} >
        {children}
      </SoundProvider>
    </SoundSettingsContext.Provider>
  );
}
