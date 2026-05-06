# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use `pnpm` (not npm or yarn).

```bash
pnpm install          # install dependencies
pnpm dev              # dev server on port 3000
pnpm build            # production build (runs generate-resume.mjs first, then Vite)
pnpm serve            # preview built site

pnpm lint             # ESLint
pnpm format           # Prettier auto-format
pnpm format-check     # Prettier validation (CI)
pnpm typecheck        # tsc --noEmit (strict)

pnpm check-config     # validate portfolio.config.yaml
pnpm fix-config       # auto-fix config issues
pnpm generate:resume  # regenerate JSON Resume + Markdown only
```

No test runner is included in this project.

## Architecture

**GitVitae** is a static portfolio site generator — users fork it, edit `portfolio.config.yaml`, and deploy to GitHub Pages.

### Data flow

`portfolio.config.yaml` → Vite (`@rollup/plugin-yaml`) → `src/portfolio.config.ts` (types) → section components → static site

The YAML file is the single source of truth. Section components under `src/components/sections/` each read directly from the parsed config object. The resume generation script (`scripts/generate-resume.mjs`) also reads the YAML to emit `public/resume.json` (JSON Resume spec) and `public/resume.md` before the Vite build.

### Key files

- `portfolio.config.yaml` — end-user content; the only file most contributors touch
- `src/portfolio.config.ts` — TypeScript types for the YAML shape; update this when adding config fields
- `scripts/check-config.mjs` — structural validation; also update when adding config fields
- `vite.config.ts` — custom plugins: OpenGraph/schema injection, RSS feed from `blog/*.md`, critical font preloading, code-splitting chunks

### Routing

Wouter with hash-based routing (`HashRouter`). Pages live in `src/pages/`.

### Theming

`src/lib/themes.ts` defines 6 color presets (indigo, emerald, rose, amber, sky, violet) plus a custom hex override. Theme tokens are CSS variables injected at runtime.

### Client-side AI

`src/components/SimpleChat.tsx` embeds a WebLLM chat widget. The model runs entirely in-browser via a Web Worker (`src/lib/webllm-worker.ts`). No server required.

### Blog

Markdown files in `blog/` with YAML frontmatter (`title`, `date` required) become blog posts. The Vite RSS plugin extracts frontmatter to build `feed.xml` at build time.

## Conventions

- **Import alias:** `@` resolves to `src/` — use it for all internal imports.
- **Vite base:** `'./'` with `outDir: dist/public` — all asset paths must be relative for GitHub Pages subpath hosting.
- **Build order matters:** resume artifacts are generated before the Vite build; don't assume `public/resume.json` exists without running `pnpm build` or `pnpm generate:resume` first.
- **Formatting:** `prettier-plugin-tailwindcss` sorts Tailwind classes automatically; run `pnpm format` before committing.
- **fs.strict:** Vite server has `fs.strict = true`; keep all imports inside the project root.
