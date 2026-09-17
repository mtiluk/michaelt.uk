"use client";
import { useSyncExternalStore, type ReactNode } from "react";

const DESKTOP_QUERY = "(min-width: 64rem)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => null,
  );
}

export function DesktopOnly({ children }: { children: ReactNode }) {
  return useIsDesktop() === true ? children : null;
}

export function MobileOnly({ children }: { children: ReactNode }) {
  return useIsDesktop() === false ? children : null;
}
