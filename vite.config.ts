import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync } from "fs";

const rawPort = process.env.PORT;
const rawBasePath = process.env.BASE_PATH;

// In CI / production builds PORT and BASE_PATH may not be set.
// Only enforce them when running the dev server.
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

const portfolioConfig = JSON.parse(
  readFileSync(new URL("./portfolio.config.json", import.meta.url), "utf8")
) as {
  name?: string; title?: string; about?: string; email?: string;
  location?: string; avatarUrl?: string; social?: Record<string, string>;
};

function schemaOrgPlugin() {
  return {
    name: "schema-org-person",
    transformIndexHtml(html: string) {
      const social = portfolioConfig.social ?? {};
      const sameAs = Object.values(social).filter(Boolean);
      const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: portfolioConfig.name ?? "",
        jobTitle: portfolioConfig.title ?? "",
        description: portfolioConfig.about ?? "",
        email: portfolioConfig.email ?? "",
        ...(sameAs.length ? { sameAs } : {}),
      };
      const tag = `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
      return html.replace("</head>", `  ${tag}\n  </head>`);
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    schemaOrgPlugin(),
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
