export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export function clearCache(): void {
  cache.clear();
}

export interface ReposConfig {
  username: string;
  token?: string;
}

export async function fetchGitHubRepos(
  config: ReposConfig,
): Promise<GitHubRepo[]> {
  const cacheKey = `repos:${config.username}`;
  const cached = getFromCache<GitHubRepo[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-backend",
  };

  if (config.token) {
    headers["Authorization"] = `Bearer ${config.token}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${config.username}/repos?sort=updated&per_page=30&type=public`,
    { headers },
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const repos = (await response.json()) as GitHubRepo[];

  const filtered = repos
    .filter((r) => r.description)
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage,
      topics: r.topics,
      language: r.language,
      stargazers_count: r.stargazers_count,
      updated_at: r.updated_at,
    }));

  setCache(cacheKey, filtered);
  return filtered;
}
