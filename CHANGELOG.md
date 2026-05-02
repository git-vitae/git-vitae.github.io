# GitVita Changelog

All notable changes are listed here. Each version brings new features you can opt into by adding a line or two to your `portfolio.config.yaml`.

---

## [1.4.0] — 2026-05-02

### New
- **Pick any colour** — Add `primaryColor: "#e11d48"` to your config to use any hex colour you like. Just Google "colour picker", choose your favourite, and paste the code. No colour theory needed — the palette for light and dark mode is generated automatically.
- **Dynamic favicon** — Your browser tab now shows your initials in your chosen colour, automatically generated from your name. No image files to create or upload.
- **Auto-sync GitHub Action** — Your repo ships with a "Sync GitVita Template" workflow. Go to Actions → Sync GitVita Template → Run workflow → type YES. Pulls in the latest template updates while always preserving your `portfolio.config.yaml`.
- **Changelog modal** — Click "What's new" at the bottom of your portfolio to see what features have been added since you set up your portfolio.

### Improved
- **Setup wizard** — Now explains both ways to copy the template ("Use this template" vs Fork) and which update method works with each.
- **Staying up to date** — The Done step now shows all three upgrade paths in order of simplicity.

---

## [1.3.0] — 2026-05-02

### New
- **Visitor analytics** — Two free options built in. GitHub's traffic insights are already there (repo → Insights → Traffic, zero setup). For more detail, add GoatCounter (privacy-friendly, free forever for personal use): `analytics:\n  goatcounterCode: yourcode`
- **Config validator** — Run `pnpm check-config` to catch placeholder values, missing fields, and invalid config before you deploy. Runs automatically in GitHub Actions and blocks broken configs from going live. `pnpm check-config --fix` auto-corrects safe structural issues.
- **Section deep-links** — Hover any portfolio section to reveal a copy-link button. Share a specific job, project, or skill set with a direct URL.
- **Share modal** — Section-specific copy-link grid and QR code for your full portfolio URL.

### Improved
- **Active nav link** — Fixed scroll tracking so the highlighted nav pill always reflects the section you're actually reading.
- **Landing page** — Redesigned narrative story section explaining the problem GitVita solves.

---

## [1.2.0] — 2026-04-15

### New
- **Blog** — Drop any `.md` file into `blog/` and it becomes a post automatically. Includes a full RSS feed at `/rss.xml`. Enable with:
  ```yaml
  blog:
    enabled: true
    title: "Blog"
  ```
- **Testimonials section** — Add endorsements from colleagues, managers, and clients. Enable with `show: true` under `id: testimonials` in your sections list.
- **Publications section** — Ideal for researchers and technical writers. Enable with `show: true` under `id: publications`.
- **PDF-ready resume** — Visit `/resume` on your portfolio for a clean, printable, ATS-friendly resume generated entirely from your YAML — two layouts included (two-column and classic).
- **Stats section** — Highlight the numbers that matter. Enable with `show: true` under `id: stats`.

### Improved
- **Section visibility** — Any section can be hidden with `show: false` in your sections list — no code changes needed.
- **Resume themes** — Choose separate color presets per layout:
  ```yaml
  resumeTheme:
    twoColumn: indigo
    classic: emerald
  ```

---

## [1.1.0] — 2026-04-01

### New
- **Dark mode** — Set `defaultTheme: dark` or let visitors toggle with the moon icon in the nav.
- **Color presets** — Six built-in accent colors. Set with `colorPreset: indigo` (options: `indigo` · `emerald` · `rose` · `amber` · `ocean` · `slate`).
- **Contact form** — Add a Formspree endpoint to `contactFormEndpoint` for a real working contact form with no backend needed.
- **Languages section** — List the languages you speak with proficiency levels (`Native` · `Fluent` · `Conversational` · `Basic`). Enable with `show: true` under `id: languages`.

---

## [1.0.0] — 2026-03-15

Initial release — portfolio-as-code for GitHub Pages.

- **YAML-driven config** — entire portfolio controlled by a single `portfolio.config.yaml` file; no code editing required
- **Sections** — About, Skills, Experience, Projects (featured + full list), Education, Certifications
- **Themes** — dark / light / system with color presets
- **Open-to-work banner** — opt-in with `openToWork: true`
- **Resume export** — PDF, JSON Resume, and Markdown from the live site
- **Auto base-path detection** — works for both `username.github.io` and subdirectory repos
- **GitHub Actions workflow** — push to `main` → live in ~2 minutes
