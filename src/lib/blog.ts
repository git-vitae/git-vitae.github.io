/**
 * Blog post loader.
 * Vite's import.meta.glob picks up all markdown files in /blog/ at build time.
 * No server, no database — just files.
 */

export interface Post {
  slug: string;
  title: string;
  date: string; // ISO date string, e.g. "2025-01-15"
  tags: string[];
  excerpt: string;
  cover?: string; // optional cover image URL
  readingTime: number; // estimated minutes
  content: string; // raw markdown body (after frontmatter)
}

// ── Vite build-time import ────────────────────────────────────────────────────

// Picks up posts from blog/YYYY/MM/slug.md and any other depth
const rawFiles = import.meta.glob('/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// ── Frontmatter parser ────────────────────────────────────────────────────────

interface RawMeta {
  title?: string;
  date?: string;
  tags?: string[] | string;
  excerpt?: string;
  cover?: string;
}

function parseFrontmatter(raw: string): { meta: RawMeta; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx < 1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim();

    if (val.startsWith('[') && val.endsWith(']')) {
      // Inline array: [tag1, tag2]
      meta[key] = val
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      meta[key] = val.replace(/^["']|["']$/g, '');
    }
  }

  return { meta: meta as RawMeta, body: match[2] };
}

function estimateReadingTime(text: string): number {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

function slugFromPath(filepath: string): string {
  // /blog/hello-world.md → hello-world
  return filepath.replace(/^.*\//, '').replace(/\.md$/, '');
}

// ── Exported posts list ───────────────────────────────────────────────────────

export const allPosts: Post[] = Object.entries(rawFiles)
  .map(([filepath, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    const slug = slugFromPath(filepath);
    const tags = Array.isArray(meta.tags)
      ? meta.tags
      : typeof meta.tags === 'string'
        ? [meta.tags]
        : [];
    const excerpt =
      meta.excerpt ??
      body
        .replace(/^#+\s.*/gm, '')
        .replace(/[*`_[\]]/g, '')
        .trim()
        .slice(0, 180) + '…';

    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? '',
      tags,
      excerpt,
      cover: meta.cover,
      readingTime: estimateReadingTime(body),
      content: body,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export const allTags: string[] = [
  ...new Set(allPosts.flatMap((p) => p.tags)),
].sort();
