# Copilot instructions for git-vitae.github.io

Purpose: short, actionable repository guidance for Copilot sessions (build/test/lint commands, high-level architecture, and repository-specific conventions).

---

## Build, test, and lint commands
Use pnpm (project uses pnpm in README). Typical flow:

- Install: pnpm install
- Dev server (local preview): pnpm dev
- Production build: pnpm build
  - Note: build runs scripts/generate-resume.mjs before Vite build.
- Preview built site: pnpm serve

Quality tools:
- Lint: pnpm lint  (runs `eslint .`)
- Format check: pnpm format-check (prettier -c)
- Format files: pnpm format
- Typecheck: pnpm typecheck (tsc -p tsconfig.json)

Config/validation scripts:
- Validate portfolio config: pnpm check-config
- Auto-fix config: pnpm fix-config
- Generate resume artifacts only: pnpm generate:resume
- Upgrade template helper: pnpm upgrade-template

Tests:
- There is no test runner or test scripts included in this template. (If tests are added later, prefer adding a script like `test:unit` so Copilot can show how to run a single test.)

---

## High-level architecture (big picture)
- Single-source config: portfolio.config.yaml is the authoritative content source. The site renders entirely from that YAML; most contributors only edit that file.
- Frontend: React + Vite + TypeScript + Tailwind CSS. Code lives under src/ and is structured into `components/sections/` (one file per portfolio section) and `components/ui/` (shared primitives).
- Build-time helpers: scripts/*.mjs include config validation (check-config) and resume generation (generate-resume). The `build` script runs generate-resume before the Vite build.
- Vite config (vite.config.ts) injects metadata, builds an RSS feed from blog/ Markdown, preloads critical fonts, and emits the static site to dist/public.
- GitHub Actions: .github/workflows/deploy.yml builds and deploys to GitHub Pages; .github/workflows/sync-template.yml helps upstream updates.
- Content: blog/ (optional) provides Markdown posts; any .md added becomes a blog post and RSS entry.
- Client-side AI: recent releases add an in-browser WebLLM chat widget (see CHANGELOG). The model runs client-side and is bundled/downloaded by the site when enabled.

---

## Key conventions and repository-specific patterns
- Single editable file: end-user/owner edits only portfolio.config.yaml — everything else is template code.
- Section components: each portfolio section has a self-contained component under src/components/sections/ and reads directly from the parsed YAML config.
- Types + validation: TypeScript types for the YAML shape live in src/portfolio.config.ts and structural validation is in scripts/check-config.mjs. When adding config fields, update both.
- Build order: resume assets are regenerated before the site build (build runs generate-resume). Do not assume resume outputs exist prior to `pnpm build`.
- Vite root and base: Vite is configured with base './' and outDir dist/public — relative paths and asset injection assume static hosting under a subpath (username.github.io or username.github.io/repo).
- Alias: "@" resolves to src/ — prefer it for imports (vite.config.ts alias).
- FS strict: Vite server fs.strict = true; keep imports inside the project root.
- Blog frontmatter: posts must include YAML frontmatter (title, date); the RSS generator extracts frontmatter to build the feed.
- Formatting/linting: `prettier-plugin-tailwindcss` + ESLint are used; run `pnpm format` and `pnpm lint` before PRs.

---

## Other assistant/A.I. configs found
- No CLAUDE.md, AGENTS.md, AIDER_CONVENTIONS.md, .cursorrules, or similar assistant rules were found in the repo root. (If added later, merge key guidance here.)

---

If modifications are needed (more detail about internal modules, component locations, or test runner addition), mention which area to expand.
