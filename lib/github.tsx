import type { ContributionDay } from "@/types/socials";

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
