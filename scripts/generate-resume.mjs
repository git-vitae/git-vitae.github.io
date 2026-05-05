/**
 * generate-resume.mjs
 *
 * Reads portfolio.config.yaml and writes two AI-friendly resume formats:
 *   public/resume.json  — JSON Resume spec (https://jsonresume.org/schema/)
 *   public/resume.md    — Clean Markdown (LLM-friendly)
 *
 * Run:  node scripts/generate-resume.mjs
 * Auto-runs before every build via the "build" npm script.
 */

/* global console */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const config = yaml.load(
  readFileSync(join(ROOT, "portfolio.config.yaml"), "utf8")
);

// ── helpers ───────────────────────────────────────────────────────────────────

/** Parse "2022 – Present"  →  { startDate: "2022", endDate: "" } */
function parsePeriod(period = "") {
  const parts = period.split(/\s*[–—-]\s*/);
  const start = parts[0]?.trim() ?? "";
  const end   = parts[1]?.trim() ?? "";
  return {
    startDate: start,
    endDate: end.toLowerCase() === "present" ? "" : end,
  };
}

/** "San Francisco, CA"  →  { city: "San Francisco", region: "CA" } */
function parseLocation(str = "") {
  const [city, region] = str.split(",").map((s) => s.trim());
  return { city: city ?? str, region: region ?? "" };
}

/** Build JSON Resume profiles array from social map */
function buildProfiles(social = {}) {
  const map = { github: "GitHub", linkedin: "LinkedIn", twitter: "Twitter", website: "Website" };
  return Object.entries(map)
    .filter(([key]) => social[key])
    .map(([key, network]) => ({
      network,
      url: social[key],
      username: social[key].replace(/.*\//, ""),
    }));
}

// ── JSON Resume ───────────────────────────────────────────────────────────────

const resume = {
  $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics: {
    name:     config.name      ?? "",
    label:    config.title     ?? "",
    image:    config.avatarUrl ?? "",
    email:    config.email     ?? "",
    phone:    config.phone     ?? "",
    summary:  config.about     ?? "",
    location: parseLocation(config.location),
    profiles: buildProfiles(config.social),
  },
  work: (config.experience ?? []).map((exp) => {
    const { startDate, endDate } = parsePeriod(exp.period);
    return { name: exp.company, position: exp.role, startDate, endDate, summary: exp.description, highlights: exp.highlights ?? [] };
  }),
  education: (config.education ?? []).map((edu) => {
    const { startDate, endDate } = parsePeriod(edu.period);
    return { institution: edu.institution, area: edu.degree, studyType: "", startDate, endDate };
  }),
  skills:       (config.skills        ?? []).map((s) => ({ name: s.category, keywords: s.items ?? [] })),
  projects:     (config.projects      ?? []).map((p) => ({ name: p.name, description: p.description, keywords: p.tags ?? [], url: p.liveUrl || p.repoUrl || "" })),
  certificates: (config.certifications ?? []).map((c) => ({ name: c.title, issuer: c.issuer, date: c.date, url: c.credentialUrl || "" })),
  languages:    (config.languages     ?? []).map((l) => ({ language: l.name, fluency: l.level })),
};

// ── Markdown resume ───────────────────────────────────────────────────────────

const socialLinks = Object.entries(config.social ?? {})
  .filter(([, url]) => url)
  .map(([key, url]) => `[${key.charAt(0).toUpperCase() + key.slice(1)}](${url})`)
  .join(" · ");

const skillsBlock = (config.skills ?? [])
  .map((s) => `**${s.category}:** ${s.items.join(", ")}`)
  .join("\n");

const experienceBlock = (config.experience ?? [])
  .map((exp) =>
    `### ${exp.role} — ${exp.company}\n_${exp.period}_\n\n${exp.description}\n\n${
      exp.highlights?.length ? exp.highlights.map((h) => `- ${h}`).join("\n") : ""
    }`
  )
  .join("\n\n");

const projectsBlock = (config.projects ?? [])
  .map((p) => {
    const link  = p.liveUrl || p.repoUrl;
    const title = link ? `[${p.name}](${link})` : p.name;
    return `### ${title}\n${p.description}\n\n**Tags:** ${p.tags?.join(", ") ?? ""}`;
  })
  .join("\n\n");

const educationBlock = (config.education ?? [])
  .map((edu) => `**${edu.degree}** — ${edu.institution} _(${edu.period})_`)
  .join("\n");

const certsBlock = (config.certifications ?? [])
  .map((c) => {
    const link = c.credentialUrl ? ` ([verify](${c.credentialUrl}))` : "";
    return `- **${c.title}** — ${c.issuer}, ${c.date}${link}`;
  })
  .join("\n");

const languagesBlock = (config.languages ?? [])
  .map((l) => `${l.name} (${l.level})`)
  .join(", ");

const locationStr = config.location ? `${config.location} · ` : "";
const emailStr    = config.email    ? `${config.email} · `    : "";
const phoneStr    = config.phone    ? `${config.phone} · `    : "";

const markdown = `# ${config.name}
**${config.title}**

${locationStr}${phoneStr}${emailStr}${socialLinks}

${config.openToWork ? "> **Open to new opportunities**\n\n" : ""}## Summary

${config.about ?? ""}

## Skills

${skillsBlock}

## Experience

${experienceBlock}

## Projects

${projectsBlock}

## Education

${educationBlock}
${certsBlock ? `\n## Certifications\n\n${certsBlock}\n` : ""}${languagesBlock ? `\n## Languages\n\n${languagesBlock}\n` : ""}`;

// ── Write output ──────────────────────────────────────────────────────────────

const publicDir = join(ROOT, "public");
mkdirSync(publicDir, { recursive: true });

writeFileSync(join(publicDir, "resume.json"), JSON.stringify(resume, null, 2));
writeFileSync(join(publicDir, "resume.md"),   markdown.trim());

console.log("✓ public/resume.json  (JSON Resume spec)");
console.log("✓ public/resume.md    (Markdown)");
