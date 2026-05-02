import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import yaml from "@rollup/plugin-yaml";
import path from "path";
import { readFileSync } from "fs";
import jsYaml from "js-yaml";

const rawPort = process.env.PORT;
const rawBasePath = process.env.BASE_PATH;

const isDev = process.env.NODE_ENV !== "production" && !!rawPort;

if (isDev) {
  if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
  if (!rawBasePath) throw new Error("BASE_PATH environment variable is required but was not provided.");
}

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
};

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
      ].map(t => `  ${t}`).join("\n");

      return html
        .replace(/<title>.*?<\/title>/, "")
        .replace("</head>", `${inject}\n  </head>`);
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    yaml(),
    metaAndSchemaPlugin(),
    ...(process.env.NODE_ENV !== "production" && rawPort
      ? [
          (await import("@replit/vite-plugin-runtime-error-modal")).default(),
          ...(process.env.REPL_ID !== undefined
            ? [
                await import("@replit/vite-plugin-cartographer").then((m) =>
                  m.cartographer({ root: path.resolve(import.meta.dirname, "..") }),
                ),
              ]
            : []),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
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
