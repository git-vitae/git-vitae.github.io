import { useState, useEffect } from 'react';

export interface GitHubStats {
  followers: number;
  publicRepos: number;
  totalStars: number;
  topLanguages: { name: string; count: number; percentage: number }[];
  profileUrl: string;
}

function extractUsername(url: string): string | null {
  const match = url.match(/github\.com\/([^/?#\s]+)/);
  return match ? match[1] : null;
}

export function extractGithubUsername(githubUrl: string): string | null {
  if (!githubUrl) return null;
  return extractUsername(githubUrl);
}

export function useGitHubStats(githubUrl: string) {
  const [data, setData] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const username = extractUsername(githubUrl);
    if (!username || username === 'yourusername') return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      const headers: HeadersInit = { Accept: 'application/vnd.github+json' };

      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers }),
        fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
          { headers }
        ),
      ]);

      if (userRes.status === 403 || reposRes.status === 403) {
        throw new Error('rate-limited');
      }
      if (!userRes.ok) {
        throw new Error(userRes.status === 404 ? 'not-found' : 'fetch-error');
      }

      const user = await userRes.json();
      const repos: {
        stargazers_count: number;
        language: string | null;
        fork: boolean;
      }[] = reposRes.ok ? await reposRes.json() : [];

      const ownRepos = repos.filter((r) => !r.fork);
      const totalStars = ownRepos.reduce((n, r) => n + r.stargazers_count, 0);

      const langMap: Record<string, number> = {};
      for (const r of ownRepos) {
        if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1;
      }
      const total = Object.values(langMap).reduce((a, b) => a + b, 0);
      const topLanguages = Object.entries(langMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({
          name,
          count,
          percentage: total ? Math.round((count / total) * 100) : 0,
        }));

      if (!cancelled) {
        setData({
          followers: user.followers,
          publicRepos: user.public_repos,
          totalStars,
          topLanguages,
          profileUrl: `https://github.com/${username}`,
        });
      }
    }

    load()
      .catch((err: Error) => {
        if (!cancelled) setError(err.message ?? 'fetch-error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [githubUrl]);

  return { data, loading, error };
}
