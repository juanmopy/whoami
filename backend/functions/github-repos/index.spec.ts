import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGitHubRepos, clearCache } from "./index.js";
import type { GitHubRepo } from "./index.js";

const MOCK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: "project-one",
    description: "A cool project",
    html_url: "https://github.com/user/project-one",
    homepage: "https://project-one.dev",
    topics: ["typescript", "angular"],
    language: "TypeScript",
    stargazers_count: 42,
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "no-description",
    description: "",
    html_url: "https://github.com/user/no-description",
    homepage: null,
    topics: [],
    language: null,
    stargazers_count: 0,
    updated_at: "2024-01-02T00:00:00Z",
  },
];

describe("fetchGitHubRepos", () => {
  beforeEach(() => {
    clearCache();
    vi.restoreAllMocks();
  });

  it("should fetch and filter repos", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(MOCK_REPOS),
      }),
    );

    const repos = await fetchGitHubRepos({ username: "testuser" });

    expect(repos).toHaveLength(1);
    expect(repos[0].name).toBe("project-one");
  });

  it("should use cache on repeated calls", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_REPOS),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchGitHubRepos({ username: "testuser" });
    await fetchGitHubRepos({ username: "testuser" });

    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("should throw on API error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 403 }),
    );

    await expect(fetchGitHubRepos({ username: "testuser" })).rejects.toThrow(
      "GitHub API error: 403",
    );
  });

  it("should pass token as Authorization header", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    vi.stubGlobal("fetch", mockFetch);

    await fetchGitHubRepos({ username: "testuser", token: "mytoken" });

    const callHeaders = mockFetch.mock.calls[0][1].headers as Record<
      string,
      string
    >;
    expect(callHeaders["Authorization"]).toBe("Bearer mytoken");
  });
});
