import { defineConfig } from "vite";
import type { Plugin, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import yaml from "@rollup/plugin-yaml";
import path from "path";
import { readFileSync, readdirSync, statSync } from "fs";
import jsYaml from "js-yaml";

const rawPort = process.env.PORT;

const port = rawPort ? Number(rawPort) : 3000;
if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const portfolioConfig = jsYaml.load(
  readFileSync(new URL("./portfolio.config.yaml", import.meta.url), "utf8")
) as {
  name?: string; title?: string; about?: string; email?: string;
  location?: string; avatarUrl?: string; openToWork?: boolean;
  social?: Record<string, string>;
  siteUrl?: string;
  blog?: { enabled?: boolean; title?: string; description?: string };
};
const assetBase = "./";

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

type FrontMatter = { title: string; date: string; excerpt: string; tags: string[] };

function parseFmForRss(raw: string): FrontMatter {
  const fmMatch  = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body     = raw.replace(/^---[\s\S]*?---\r?\n?/, "");
  const data     = fmMatch ? (jsYaml.load(fmMatch[1]) as Record<string, unknown>) ?? {} : {};
  const autoExcerpt = body
    .replace(/^#+\s.*/gm, "")
    .replace(/[*`_[\]]/g, "")
    .trim()
    .slice(0, 180) + "…";
  return {
    title:   String(data.title   ?? ""),
    date:    String(data.date    ?? ""),
    excerpt: String(data.excerpt ?? autoExcerpt),
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

function gitvitaeRssPlugin(rootDir: string): Plugin {
  return {
    name: "gitvitae-rss",
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "rss.xml", source: buildRssXml(rootDir) });
    },
    configureServer(server: ViteDevServer) {
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
    name: "gitvitae-meta-schema",
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

      let avatarOrigin: string | null = null;
      try {
        if (avatar.startsWith("http")) avatarOrigin = new URL(avatar).origin;
      } catch { /* relative or empty avatar URL — no preconnect needed */ }

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
        ...(avatarOrigin ? [`<link rel="preconnect" href="${avatarOrigin}" crossorigin>`] : []),
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

// ── Font preload plugin ────────────────────────────────────────────────────────
// After the bundle is generated, collects the hashed woff2 filenames for
// above-the-fold fonts and injects <link rel="preload"> into the HTML.
// This tells the browser to start fetching the fonts before it even parses
// the CSS, shaving time off the first paint.

const PRELOAD_FONT_PATTERNS = [
  "inter-latin-400-normal",
  "inter-latin-500-normal",
  "cormorant-garamond-latin-300-normal",
  "cormorant-garamond-latin-300-italic",
];

function preloadCriticalFontsPlugin(): Plugin {
  const queue: string[] = [];

  return {
    name: "gitvitae-preload-fonts",
    generateBundle(_options, bundle) {
      for (const asset of Object.values(bundle)) {
        if (
          asset.type === "asset" &&
          "fileName" in asset &&
          typeof asset.fileName === "string" &&
          asset.fileName.endsWith(".woff2") &&
          PRELOAD_FONT_PATTERNS.some(p => asset.fileName.includes(p))
        ) {
          queue.push(asset.fileName);
        }
      }
    },
    transformIndexHtml: {
      order: "post",
      handler() {
        return queue.map(file => ({
          tag:      "link" as const,
          attrs:    { rel: "preload", href: `${assetBase}${file}`, as: "font", type: "font/woff2", crossorigin: "" },
          injectTo: "head" as const,
        }));
      },
    },
  };
}

const isReplit = !!process.env.REPL_ID;

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    yaml(),
    metaAndSchemaPlugin(),
    preloadCriticalFontsPlugin(),
    gitvitaeRssPlugin(path.resolve(import.meta.dirname)),
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
        // Separate vendor chunks so browsers can cache library code independently
        // from app code.  Libraries change far less often than the portfolio itself.
        manualChunks: {
          "vendor-react":  ["react", "react-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-lenis":  ["lenis"],
          "vendor-router": ["wouter"],
          "vendor-icons":  ["lucide-react"],
        },
        // Keep font files in a dedicated subfolder so they're easy to find in dist/.
        assetFileNames(info) {
          const name = info.names?.[0] ?? info.name ?? "";
          if (/\.(woff2?|ttf|eot)$/.test(name)) return "assets/fonts/[name][extname]";
          return "assets/[name]-[hash][extname]";
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
