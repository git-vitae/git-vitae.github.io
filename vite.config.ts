import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import yaml from "@rollup/plugin-yaml";
import path from "path";
import { readFileSync, readdirSync, statSync } from "fs";
import jsYaml from "js-yaml";

const rawPort = process.env.PORT;
const rawBasePath = process.env.BASE_PATH;

const port = rawPort ? Number(rawPort) : 3000;
if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = rawBasePath ?? "/";

const portfolioConfig = jsYaml.load(
  readFileSync(new URL("./portfolio.config.yaml", import.meta.url), "utf8")
) as {
  name?: string; title?: string; about?: string; email?: string;
  location?: string; avatarUrl?: string; openToWork?: boolean;
  social?: Record<string, string>;
  siteUrl?: string;
  blog?: { enabled?: boolean; title?: string; description?: string };
};

// ── RSS feed helpers (Node.js / build context) ────────────────────────────────

function walkMd(dir: string): string[] {
  const results: string[] = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) results.push(...walkMd(full));
      else if (entry.endsWith(".md")) results.push(full);
    }
  } catch { /* blog/ folder may not exist */ }
  return results;
}

function parseFmForRss(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { title: "", date: "", excerpt: "", tags: [] as string[] };
  const data: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    const ci = line.indexOf(":");
    if (ci < 1) continue;
    const k = line.slice(0, ci).trim();
    const v = line.slice(ci + 1).trim();
    data[k] = v.startsWith("[") && v.endsWith("]")
      ? v.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      : v.replace(/^["']|["']$/g, "");
  }
  const body = raw.replace(/^---[\s\S]*?---\r?\n?/, "");
  const excerpt = (data.excerpt as string) ??
    body.replace(/^#+\s.*/gm, "").replace(/[*`_[\]]/g, "").trim().slice(0, 180) + "…";
  return {
    title:   (data.title   as string) ?? "",
    date:    (data.date    as string) ?? "",
    excerpt,
    tags:    Array.isArray(data.tags) ? (data.tags as string[]) : [],
  };
}

function buildRssXml(rootDir: string): string {
  const siteUrl     = portfolioConfig.siteUrl    ?? "";
  const blogTitle   = portfolioConfig.blog?.title       ?? portfolioConfig.name ?? "Blog";
  const blogDesc    = portfolioConfig.blog?.description ?? "";

  const files = walkMd(path.join(rootDir, "blog"));
  const posts = files
    .map((f) => {
      const raw  = readFileSync(f, "utf8");
      const meta = parseFmForRss(raw);
      const slug = path.basename(f, ".md");
      return { slug, ...meta };
    })
    .filter((p) => p.date)
    .sort((a, b) => b.date.localeCompare(a.date));

  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/#/blog/${p.slug}</link>
      <guid isPermaLink="false">${siteUrl}/#/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
      ${p.tags.map((t) => `<category>${t}</category>`).join("\n      ")}
    </item>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${blogTitle}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${blogDesc}]]></description>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}

function gitvitaRssPlugin(rootDir: string) {
  return {
    name: "gitvita-rss",
    generateBundle() {
      (this as unknown as { emitFile: (o: object) => void }).emitFile({
        type:     "asset",
        fileName: "rss.xml",
        source:   buildRssXml(rootDir),
      });
    },
    configureServer(server: { middlewares: { use: (path: string, fn: (req: unknown, res: { setHeader: (k: string, v: string) => void; end: (s: string) => void }) => void) => void } }) {
      server.middlewares.use("/rss.xml", (_req, res) => {
        res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
        res.end(buildRssXml(rootDir));
      });
    },
  };
}

// ── HTML meta + schema plugin ─────────────────────────────────────────────────

function metaAndSchemaPlugin() {
  return {
    name: "gitvita-meta-schema",
    transformIndexHtml(html: string) {
      const name     = portfolioConfig.name    ?? "Portfolio";
      const jobTitle = portfolioConfig.title   ?? "";
      const summary  = portfolioConfig.about   ?? "";
      const email    = portfolioConfig.email   ?? "";
      const social   = portfolioConfig.social  ?? {};
      const avatar   = portfolioConfig.avatarUrl ?? "";
      const siteUrl  = portfolioConfig.siteUrl  ?? "";
      const blogOn   = portfolioConfig.blog?.enabled ?? false;
      const blogTitle = portfolioConfig.blog?.title ?? "Blog";

      const pageTitle = `${name} — ${jobTitle}`;
      const sameAs    = Object.values(social).filter(Boolean);
      const ogImage   = avatar || "/opengraph.jpg";

      const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name,
        jobTitle,
        description: summary,
        email,
        ...(sameAs.length ? { sameAs } : {}),
      };

      const inject = [
        `<title>${pageTitle}</title>`,
        `<meta name="description" content="${summary.slice(0, 160).replace(/"/g, "&quot;")}">`,
        `<meta property="og:type"        content="profile">`,
        `<meta property="og:title"       content="${pageTitle}">`,
        `<meta property="og:description" content="${summary.slice(0, 200).replace(/"/g, "&quot;")}">`,
        `<meta property="og:image"       content="${ogImage}">`,
        `<meta name="twitter:card"        content="summary_large_image">`,
        `<meta name="twitter:title"       content="${pageTitle}">`,
        `<meta name="twitter:description" content="${summary.slice(0, 200).replace(/"/g, "&quot;")}">`,
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
        ...(blogOn && siteUrl
          ? [`<link rel="alternate" type="application/rss+xml" title="${name}'s ${blogTitle}" href="${siteUrl}/rss.xml">`]
          : []),
      ].map(t => `  ${t}`).join("\n");

      return html
        .replace(/<title>.*?<\/title>/, "")
        .replace("</head>", `${inject}\n  </head>`);
    },
  };
}

const isReplit = !!process.env.REPL_ID;

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    yaml(),
    metaAndSchemaPlugin(),
    gitvitaRssPlugin(path.resolve(import.meta.dirname)),
    ...(isReplit
      ? [
          (await import("@replit/vite-plugin-runtime-error-modal")).default(),
          (await import("@replit/vite-plugin-cartographer")).cartographer({
            root: path.resolve(import.meta.dirname, ".."),
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react":  ["react", "react-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-lenis":  ["lenis"],
          "vendor-router": ["wouter"],
          "vendor-icons":  ["lucide-react"],
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
