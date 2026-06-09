"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@/components/ui/switch";
import { useSensoryUI } from "@/lib/provider";
import type { SoundRole } from "@/lib/sound-roles";

const DEFAULT_SWITCH_SOUND = "interaction.toggle" as const;

function Switch({
  sound,
  volume,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof BaseSwitch> & {
  /** Sound to play when the switch is toggled. Defaults to "interaction.toggle". Set to false to disable. */
  sound?: SoundRole | false;
  /** Per-component volume multiplier (0–1). Stacks with master volume. */
  volume?: number;
}) {
  const { playSound } = useSensoryUI();

  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      if (sound !== false) void playSound(sound ?? DEFAULT_SWITCH_SOUND, { volume });
      onCheckedChange?.(checked);
    },
    [sound, volume, playSound, onCheckedChange]
  );

  return <BaseSwitch onCheckedChange={handleCheckedChange} {...props} />;
}

export { Switch };
