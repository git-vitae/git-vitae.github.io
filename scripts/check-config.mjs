/**
 * check-config.mjs
 *
 * Validates portfolio.config.yaml before you deploy.
 * Gives friendly, plain-English error messages for every problem found.
 *
 * Run:  pnpm check-config
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Colours ───────────────────────────────────────────────────────────────────
const G = (s) => `\x1b[32m${s}\x1b[0m`;   // green
const Y = (s) => `\x1b[33m${s}\x1b[0m`;   // yellow
const R = (s) => `\x1b[31m${s}\x1b[0m`;   // red
const B = (s) => `\x1b[1m${s}\x1b[0m`;    // bold
const D = (s) => `\x1b[2m${s}\x1b[0m`;    // dim

// ── Load config ───────────────────────────────────────────────────────────────
let cfg;
try {
  cfg = yaml.load(readFileSync(join(ROOT, "portfolio.config.yaml"), "utf8"));
} catch (e) {
  console.error(R("\n✗ Could not read portfolio.config.yaml\n"));
  console.error(`  ${e.message}\n`);
  process.exit(1);
}

// ── Result counters ───────────────────────────────────────────────────────────
let passes = 0, warnings = 0, errors = 0;

function pass(field, value, note = "") {
  passes++;
  const val = String(value ?? "").slice(0, 55);
  console.log(`  ${G("✓")} ${B(field.padEnd(18))} ${D(val)}${note ? "  " + D(note) : ""}`);
}
function warn(field, message) {
  warnings++;
  console.log(`  ${Y("⚠")} ${B(field.padEnd(18))} ${Y(message)}`);
}
function fail(field, message) {
  errors++;
  console.log(`  ${R("✗")} ${B(field.padEnd(18))} ${R(message)}`);
}

// ── Reusable checks ───────────────────────────────────────────────────────────
function checkRequired(field, value, hint) {
  if (!value || (typeof value === "string" && !value.trim())) {
    fail(field, `Required but missing — ${hint}`);
  } else {
    pass(field, value);
  }
}

function checkEmail(field, value) {
  if (!value) {
    warn(field, "Not set — visitors won't be able to email you directly");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    fail(field, `"${value}" doesn't look like a valid email address`);
    return;
  }
  pass(field, value);
}

function checkUrl(field, value) {
  if (!value) {
    warn(field, "Empty — this link will be hidden");
    return;
  }
  if (!/^https?:\/\/.+/.test(value)) {
    fail(field, `"${value}" must start with https:// or http://`);
    return;
  }
  pass(field, value);
}

function checkEnum(field, value, options) {
  if (!options.includes(value)) {
    fail(field, `"${value}" is not valid — options are: ${options.join(" | ")}`);
  } else {
    pass(field, value);
  }
}

function checkBoolean(field, value) {
  if (typeof value !== "boolean") {
    fail(field, `Must be true or false, got: ${JSON.stringify(value)}`);
  } else {
    pass(field, String(value));
  }
}

// ── Checks ────────────────────────────────────────────────────────────────────
console.log(`\n${B("GitVita Config Checker")}  ${D("portfolio.config.yaml")}\n`);

// Identity
console.log(D("── Identity ─────────────────────────────────────────────────────────"));
checkRequired("name",      cfg.name,    "Your full name shown at the top of the portfolio");
checkRequired("title",     cfg.title,   'Your job title / headline e.g. "Full-Stack Engineer"');
checkRequired("tagline",   cfg.tagline, "One-line pitch shown below your name in the hero");
checkEmail("email", cfg.email);
if (cfg.location) pass("location", cfg.location);
else warn("location", "Not set — location won't be displayed");
checkBoolean("openToWork", cfg.openToWork);

// Theme
console.log(D("\n── Theme ────────────────────────────────────────────────────────────"));
checkEnum("defaultTheme", cfg.defaultTheme, ["light", "dark", "system"]);
checkEnum("colorPreset",  cfg.colorPreset,  ["indigo", "emerald", "rose", "amber", "ocean", "slate", "custom"]);

// Social
console.log(D("\n── Social links ─────────────────────────────────────────────────────"));
const s = cfg.social || {};
if (s.github)   checkUrl("social.github",   s.github);
else            warn("social.github",   "Not set — GitHub link will be hidden");
if (s.linkedin) checkUrl("social.linkedin", s.linkedin);
else            warn("social.linkedin", "Not set — LinkedIn link will be hidden");
if (s.twitter)  checkUrl("social.twitter",  s.twitter);
if (s.website)  checkUrl("social.website",  s.website);

// Content
console.log(D("\n── Content ──────────────────────────────────────────────────────────"));

if (!cfg.about) fail("about", "Empty — the About section will be blank");
else pass("about", cfg.about.trim().slice(0, 55) + "…");

const skills = cfg.skills || [];
if (skills.length === 0) warn("skills", "No categories — Skills section will be empty");
else {
  const total = skills.reduce((n, s) => n + (s.items?.length ?? 0), 0);
  pass("skills", `${skills.length} categories · ${total} items`);
}

const exp = cfg.experience || [];
if (exp.length === 0) warn("experience", "No positions — Experience section will be empty");
else pass("experience", `${exp.length} position${exp.length !== 1 ? "s" : ""}`);

const projects = cfg.projects || [];
if (projects.length === 0) warn("projects", "No entries — Projects section will be empty");
else {
  const featured = projects.filter((p) => p.featured).length;
  pass("projects", `${projects.length} total · ${featured} featured`);
  if (featured === 0) warn("projects.featured", 'No project has featured: true — none will show as highlighted');
  if (featured > 3)   warn("projects.featured", `${featured} featured projects — consider keeping to 3 max`);
}

const edu = cfg.education || [];
if (edu.length === 0) warn("education", "No entries — Education section will be hidden");
else pass("education", `${edu.length} entr${edu.length !== 1 ? "ies" : "y"}`);

const certs = cfg.certifications || [];
pass("certifications", `${certs.length} entr${certs.length !== 1 ? "ies" : "y"}`);

const testimonials = cfg.testimonials || [];
pass("testimonials", `${testimonials.length} entr${testimonials.length !== 1 ? "ies" : "y"}`);

// ── Summary ───────────────────────────────────────────────────────────────────
console.log();
console.log(D("─────────────────────────────────────────────────────────────────────"));
const parts = [
  passes   ? G(`${passes} ✓`)   : "",
  warnings ? Y(`${warnings} ⚠`) : "",
  errors   ? R(`${errors} ✗`)   : "",
].filter(Boolean);
console.log(`  ${parts.join("  ")}\n`);

if (errors > 0) {
  console.log(R(`  Fix the ${errors} error${errors !== 1 ? "s" : ""} above before deploying.\n`));
  process.exit(1);
} else if (warnings > 0) {
  console.log(Y(`  Looks good! Address the warnings above to get the most from your portfolio.\n`));
} else {
  console.log(G(`  ✓ Everything looks great — your config is fully set up!\n`));
}
