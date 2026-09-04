import type { ContributionDay } from "@/types/socials";
import type { Project } from "@/types/projects";

const GRAPHQL = "https://api.github.com/graphql";
const PUBLIC_API = "https://github-contributions-api.jogruber.de/v4";
const REVALIDATE = 3600;

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}`;

export type Contributions = {
  total: number;
  weeks: ContributionDay[][];
};

function toWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  let current: ContributionDay[] = [];

  for (const day of days) {
    if (new Date(day.date).getUTCDay() === 0 && current.length > 0) {
      weeks.push(current);
      current = [];
    }
    current.push(day);
  }

  if (current.length > 0) weeks.push(current);
  return weeks;
}

async function fromGraphql(login: string, token: string): Promise<Contributions | null> {
  const response = await fetch(GRAPHQL, {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
    next: { revalidate: REVALIDATE },
  });

  if (!response.ok) return null;

  const payload = await response.json();
  const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;

  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week: { contributionDays: unknown[] }) =>
      week.contributionDays.map((raw) => {
        const day = raw as { date: string; contributionCount: number; contributionLevel: string };
        return {
          date: day.date,
          count: day.contributionCount,
          level: LEVELS[day.contributionLevel] ?? 0,
        };
      }),
    ),
  };
}

async function fromPublicApi(login: string): Promise<Contributions | null> {
  const response = await fetch(`${PUBLIC_API}/${login}?y=last`, {
    next: { revalidate: REVALIDATE },
  });

  if (!response.ok) return null;

  const payload = await response.json();
  const days: ContributionDay[] | undefined = payload?.contributions;
  if (!Array.isArray(days) || days.length === 0) return null;

  const total =
    typeof payload?.total?.lastYear === "number"
      ? payload.total.lastYear
      : days.reduce((sum, day) => sum + day.count, 0);

  return { total, weeks: toWeeks(days) };
}

export async function getContributions(login: string): Promise<Contributions | null> {
  const token = process.env.GITHUB_TOKEN;

  try {
    const result = token ? await fromGraphql(login, token) : await fromPublicApi(login);
    if (!result) console.warn(`[socials] no contribution data for ${login}`);
    return result;
  } catch (error) {
    console.warn(`[socials] contribution fetch failed for ${login}`, error);
    return null;
  }
}

const REPO_STARS_QUERY = `query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    stargazerCount
  }
}`;

function parseGithubRepo(url: string): { owner: string; name: string } | null {
  try {
    const { hostname, pathname } = new URL(url);
    if (hostname !== "github.com") return null;

    const [owner, name] = pathname.replace(/^\/|\.git$/g, "").split("/");
    return owner && name ? { owner, name } : null;
  } catch {
    return null;
  }
}

async function starsFromGraphql(owner: string, name: string, token: string): Promise<number | null> {
  const response = await fetch(GRAPHQL, {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: REPO_STARS_QUERY, variables: { owner, name } }),
    next: { revalidate: REVALIDATE },
  });

  if (!response.ok) return null;

  const payload = await response.json();
  const stars = payload?.data?.repository?.stargazerCount;
  return typeof stars === "number" ? stars : null;
}

async function starsFromPublicApi(owner: string, name: string): Promise<number | null> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    next: { revalidate: REVALIDATE },
  });

  if (!response.ok) return null;

  const payload = await response.json();
  const stars = payload?.stargazers_count;
  return typeof stars === "number" ? stars : null;
}

export async function getRepoStars(url: string): Promise<number | null> {
  const repo = parseGithubRepo(url);
  if (!repo) return null;

  const token = process.env.GITHUB_TOKEN;

  try {
    const result = token
      ? await starsFromGraphql(repo.owner, repo.name, token)
      : await starsFromPublicApi(repo.owner, repo.name);
    if (result === null) console.warn(`[projects] no star count for ${url}`);
    return result;
  } catch (error) {
    console.warn(`[projects] star fetch failed for ${url}`, error);
    return null;
  }
}

export async function withStars<T extends Project>(projects: T[]): Promise<T[]> {
  return Promise.all(
    projects.map(async (project) => {
      if (!project.github) return project;
      const stars = await getRepoStars(project.github);
      return stars === null ? project : { ...project, stars };
    }),
  );
}
