# Contributing to GitVitae

Thanks for wanting to help. GitVitae is intentionally simple — the goal is that any developer
can understand the whole codebase in an afternoon. Contributions that keep it simple are
especially welcome.

---

## Ways to contribute

| Type | How |
|------|-----|
| Found a bug | Open a **Bug report** issue |
| Want a new feature | Open a **Feature request** issue |
| List your portfolio | Open an **Add me to the registry** issue |
| Fix something small | Open a PR directly — no issue needed for typos / docs |
| Larger changes | Open an issue first so we can discuss the approach |

---

## Running locally

```bash
git clone https://github.com/gitvitae/gitvitae.github.io
cd gitvitae.github.io
pnpm install
pnpm dev          # http://localhost:3000
```

Validate your config at any time:

```bash
pnpm check-config
```

---

## Project structure

```
portfolio.config.yaml     ← the only file end-users touch
src/
  components/
    sections/             ← one file per portfolio section (About, Skills, …)
    ui/                   ← shared low-level UI primitives
  pages/
    resume/               ← /resume route — printable one-pager
  lib/
    animation.ts          ← shared Framer Motion variants
scripts/
  check-config.mjs        ← YAML validator (run before deploying)
  generate-resume.mjs     ← builds plain-text + JSON Resume outputs
.github/
  workflows/
    deploy.yml            ← GitHub Actions: build → GitHub Pages
```

---

## Adding a new config field

1. Add the field and a comment explaining it to `portfolio.config.yaml`
2. Add the TypeScript type to `src/portfolio.config.ts`
3. Add a validation check in `scripts/check-config.mjs`
4. Render it in the relevant section component in `src/components/sections/`
5. Update the config reference table in `README.md`

---

## Code style

- TypeScript everywhere — no `any` unless unavoidable
- Tailwind for all styles — no inline `style={}` except for dynamic values
- Framer Motion for animations — use the shared `fadeUpVariants()` from `src/lib/animation.ts`
- Keep section components self-contained — they read directly from the config

---

## Commit messages

Plain English is fine. Keep the subject line under 72 chars.

```
fix: testimonials overflow on mobile
feat: add publications section
docs: clarify avatarUrl in README
```

---

## Getting updates from upstream

If you've forked or templated this repo and want to pull in new features:

```bash
git remote add gitvitae https://github.com/gitvitae/gitvitae.github.io
git fetch gitvitae
git merge gitvitae/main --allow-unrelated-histories
# resolve any conflicts — they'll only be in files you've changed
```

---

*Questions? Open an issue — there are no dumb questions here.*
