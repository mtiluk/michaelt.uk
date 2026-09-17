export const PLATFORMS = ["github", "letterboxd", "x", "linkedin", "leetcode", "discord"] as const;

export type Platform = (typeof PLATFORMS)[number];

type SocialBase = {
  href: string;
  name: string;
  handle: string;
  avatar?: string;
};

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type GithubSocial = SocialBase & {
  platform: "github";
  contributions?: number;
  weeks?: ContributionDay[][];
};

export type LetterboxdFilm = {
  title: string;
  year?: number;
  rating?: number;
  poster?: string;
  slug?: string;
};

export type LetterboxdSocial = SocialBase & {
  platform: "letterboxd";
  films?: LetterboxdFilm[];
  watched?: number;
};

export type XSocial = SocialBase & {
  platform: "x";
  bio?: string;
  banner?: string;
  verified?: boolean;
  followers?: number;
};

export type LinkedinSocial = SocialBase & {
  platform: "linkedin";
  title?: string;
  location?: string;
  verified?: boolean;
};

export type LeetcodeSolved = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
};

export type LeetcodeSocial = SocialBase & {
  platform: "leetcode";
  ranking?: number;
  solved?: LeetcodeSolved;
};

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export type SpotifyActivity = {
  song: string;
  artist: string;
  albumArtUrl?: string;
};

export type DiscordSocial = SocialBase & {
  platform: "discord";
  discordId: string;
  status?: DiscordStatus;
  customStatus?: string;
  activity?: string;
  spotify?: SpotifyActivity;
};

export type Social =
  | GithubSocial
  | LetterboxdSocial
  | XSocial
  | LinkedinSocial
  | LeetcodeSocial
  | DiscordSocial;

export type SocialsLiveData = {
  github?: Pick<GithubSocial, "contributions" | "weeks">;
  leetcode?: Pick<LeetcodeSocial, "ranking" | "solved">;
  discord?: Pick<DiscordSocial, "status" | "customStatus" | "activity" | "spotify">;
};

export function isPlatform(value: unknown): value is Platform {
  return typeof value === "string" && (PLATFORMS as readonly string[]).includes(value);
}
