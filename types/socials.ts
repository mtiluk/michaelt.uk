export const PLATFORMS = ["github", "letterboxd", "x", "linkedin"] as const;

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

export type Social = GithubSocial | LetterboxdSocial | XSocial | LinkedinSocial;

export function isPlatform(value: unknown): value is Platform {
  return typeof value === "string" && (PLATFORMS as readonly string[]).includes(value);
}
