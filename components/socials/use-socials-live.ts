"use client";
import { useRef, useState } from "react";
import type { SocialsLiveData } from "@/types/socials";

const LIVE_TTL = 60_000;

export function useSocialsLive() {
  const [live, setLive] = useState<SocialsLiveData>({});
  const fresh = useRef(false);

  function load() {
    if (fresh.current) return;
    fresh.current = true;
    setTimeout(() => {
      fresh.current = false;
    }, LIVE_TTL);

    fetch("/api/socials")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: SocialsLiveData) => setLive(data))
      .catch(() => {
        fresh.current = false;
      });
  }

  return { live, load };
}
