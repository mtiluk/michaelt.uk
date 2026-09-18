import type { DiscordStatus, SpotifyActivity } from "@/types/socials";

const REVALIDATE = 60;

type LanyardPresence = {
  status: DiscordStatus;
  customStatus?: string;
  activity?: string;
  spotify?: SpotifyActivity;
};

type LanyardActivity = {
  type: number;
  name?: string;
  state?: string;
};

function describeActivity(activities: LanyardActivity[]): string | undefined {
  for (const activity of activities) {
    if (activity.type === 0 && activity.name) return `Playing ${activity.name}`;
    if (activity.type === 2 && activity.name) return `Listening to ${activity.name}`;
    if (activity.type === 3 && activity.name) return `Watching ${activity.name}`;
  }
  return undefined;
}

export async function getLanyardPresence(discordId: string): Promise<LanyardPresence | null> {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`, {
      next: { revalidate: REVALIDATE },
    });

    if (!response.ok) {
      console.warn(`[socials] no lanyard data for ${discordId}`);
      return null;
    }

    const payload = await response.json();
    if (!payload?.success || !payload.data) {
      console.warn(`[socials] no lanyard data for ${discordId}`);
      return null;
    }

    const data = payload.data;
    const activities = (data.activities as LanyardActivity[] | undefined) ?? [];
    const customStatus = activities.find((activity) => activity.type === 4)?.state;

    const spotify =
      data.listening_to_spotify && data.spotify?.song && data.spotify?.artist
        ? {
            song: data.spotify.song as string,
            artist: data.spotify.artist as string,
            albumArtUrl: data.spotify.album_art_url as string | undefined,
          }
        : undefined;

    return {
      status: data.discord_status ?? "offline",
      customStatus,
      activity: spotify ? undefined : describeActivity(activities),
      spotify,
    };
  } catch (error) {
    console.warn(`[socials] lanyard fetch failed for ${discordId}`, error);
    return null;
  }
}
