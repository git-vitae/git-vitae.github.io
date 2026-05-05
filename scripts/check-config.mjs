/**
 * check-config.mjs
 *
 * Validates portfolio.config.yaml before you deploy.
 * Gives friendly, plain-English error messages for every problem found.
 *
 * Run:  pnpm check-config          — validate only
 *       pnpm check-config --fix    — validate + auto-apply safe structural defaults
 */

/* global process, console */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import yaml from "js-yaml";

const __dirname   = dirname(fileURLToPath(import.meta.url));
const ROOT        = join(__dirname, "..");
const CONFIG_PATH = join(ROOT, "portfolio.config.yaml");
const FIX_MODE    = process.argv.includes("--fix");

// ── Colours ───────────────────────────────────────────────────────────────────
const G = (s) => `\x1b[32m${s}\x1b[0m`;   // green
const Y = (s) => `\x1b[33m${s}\x1b[0m`;   // yellow
const R = (s) => `\x1b[31m${s}\x1b[0m`;   // red
const B = (s) => `\x1b[1m${s}\x1b[0m`;    // bold
const D = (s) => `\x1b[2m${s}\x1b[0m`;    // dim

// ── GitHub Actions helpers ─────────────────────────────────────────────────────
const IS_CI = !!process.env.GITHUB_ACTIONS;
const CONFIG_FILE = "portfolio.config.yaml";
const gha = {
  group:    (t)       => IS_CI && console.log(`::group::${t}`),
  endgroup: ()        => IS_CI && console.log("::endgroup::"),
  error:    (msg, f)  => IS_CI && console.log(`::error file=${CONFIG_FILE},title=${f ?? "Config Error"}::${msg}`),
  warning:  (msg, f)  => IS_CI && console.log(`::warning file=${CONFIG_FILE},title=${f ?? "Config Warning"}::${msg}`),
  notice:   (msg)     => IS_CI && console.log(`::notice file=${CONFIG_FILE}::${msg}`),
};

// ── Load config ───────────────────────────────────────────────────────────────
let cfg;
try {
  cfg = yaml.load(readFileSync(CONFIG_PATH, "utf8"));
} catch (e) {
  gha.error(`Could not parse portfolio.config.yaml — ${e.message}`, "YAML Parse Error");
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
  gha.warning(`${field}: ${message}`);
  console.log(`  ${Y("⚠")} ${B(field.padEnd(18))} ${Y(message)}`);
}
function fail(field, message) {
  errors++;
  gha.error(`${field}: ${message}`);
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
gha.group("GitVitae config validation");
console.log(`\n${B("GitVitae Config Checker")}  ${D("portfolio.config.yaml")}\n`);

// Site mode
console.log(D("── Site mode ────────────────────────────────────────────────────────"));
if (!cfg.siteMode) {
  fail("siteMode", 'Not set — add  siteMode: "portfolio"  to show your portfolio');
} else if (!["landing", "portfolio"].includes(cfg.siteMode)) {
  fail("siteMode", `"${cfg.siteMode}" is not valid — use "landing" or "portfolio"`);
} else if (cfg.siteMode === "landing") {
  warn("siteMode", '"landing" — your portfolio is hidden. Change to "portfolio" when ready to go live.');
} else {
  pass("siteMode", cfg.siteMode);
}

// siteUrl placeholder
const PLACEHOLDER_URL = "yourusername.github.io";
if (!cfg.siteUrl) {
  warn("siteUrl", 'Not set — RSS feed and section share links will use a fallback URL. Add your GitHub Pages URL.');
} else if (cfg.siteUrl.includes(PLACEHOLDER_URL)) {
  warn("siteUrl", `Still set to the placeholder "${cfg.siteUrl}" — replace "yourusername" with your GitHub username.`);
} else if (!/^https?:\/\/.+/.test(cfg.siteUrl)) {
  fail("siteUrl", `"${cfg.siteUrl}" must start with https://`);
} else {
  pass("siteUrl", cfg.siteUrl);
}

// Identity
console.log(D("\n── Identity ─────────────────────────────────────────────────────────"));
checkRequired("name",      cfg.name,    "Your full name shown at the top of the portfolio");
checkRequired("title",     cfg.title,   'Your job title / headline e.g. "Full-Stack Engineer"');
checkRequired("tagline",   cfg.tagline, "One-line pitch shown below your name in the hero");
checkEmail("email", cfg.email);
if (cfg.phone) {
  if (!/^[+\d\s()./-]{7,20}$/.test(cfg.phone)) {
    fail("phone", `"${cfg.phone}" doesn't look like a valid phone number`);
  } else {
    pass("phone", cfg.phone);
  }
}
if (cfg.location) pass("location", cfg.location);
else warn("location", "Not set — location won't be displayed");
checkBoolean("openToWork", cfg.openToWork);

// Avatar placeholder check
const DEMO_AVATAR = "api.dicebear.com";
if (!cfg.avatarUrl) {
  warn("avatarUrl", "Not set — your initials will be shown instead of a photo");
} else if (cfg.avatarUrl.includes(DEMO_AVATAR)) {
  warn("avatarUrl", "Still using the demo avatar — upload your own photo and paste the URL here");
} else {
  pass("avatarUrl", cfg.avatarUrl);
}

// Theme
console.log(D("\n── Theme ────────────────────────────────────────────────────────────"));
checkEnum("defaultTheme", cfg.defaultTheme, ["light", "dark", "system"]);
checkEnum("colorPreset",  cfg.colorPreset,  ["indigo", "emerald", "rose", "amber", "ocean", "slate", "custom"]);

if (cfg.primaryColor) {
  if (!/^#[0-9a-fA-F]{6}$/.test(String(cfg.primaryColor))) {
    fail("primaryColor", `"${cfg.primaryColor}" isn't a valid hex colour — use the format #rrggbb, e.g. #e11d48`);
  } else {
    pass("primaryColor", cfg.primaryColor, "overrides colorPreset");
  }
}

// Social
console.log(D("\n── Social links ─────────────────────────────────────────────────────"));
const s = cfg.social || {};
const PLACEHOLDER_USERNAME = "yourusername";
if (!s.github) {
  warn("social.github",   "Not set — GitHub link will be hidden");
} else if (s.github.includes(PLACEHOLDER_USERNAME)) {
  warn("social.github",   `Still contains "${PLACEHOLDER_USERNAME}" — replace with your actual GitHub username`);
} else {
  checkUrl("social.github", s.github);
}
if (!s.linkedin) {
  warn("social.linkedin", "Not set — LinkedIn link will be hidden");
} else if (s.linkedin.includes(PLACEHOLDER_USERNAME)) {
  warn("social.linkedin", `Still contains "${PLACEHOLDER_USERNAME}" — replace with your actual LinkedIn handle`);
} else {
  checkUrl("social.linkedin", s.linkedin);
}
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

const stats = cfg.stats || [];
pass("stats", `${stats.length} entr${stats.length !== 1 ? "ies" : "y"}`);

const pubs = cfg.publications || [];
pass("publications", `${pubs.length} entr${pubs.length !== 1 ? "ies" : "y"}`);

const testimonials = cfg.testimonials || [];
pass("testimonials", `${testimonials.length} entr${testimonials.length !== 1 ? "ies" : "y"}`);

// Blog
console.log(D("\n── Blog ─────────────────────────────────────────────────────────────"));
const blog = cfg.blog || {};
if (blog.enabled) {
  pass("blog.enabled", "true");
  if (!blog.title) warn("blog.title", 'Enabled but no title set — defaults to "Blog"');
  else pass("blog.title", blog.title);
} else {
  pass("blog.enabled", "false", "(blog is hidden)");
}

// Analytics
console.log(D("\n── Analytics ────────────────────────────────────────────────────────"));
const analytics = cfg.analytics || {};
if (analytics.goatcounterCode) {
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(analytics.goatcounterCode)) {
    fail("analytics.goat…", `"${analytics.goatcounterCode}" is not a valid GoatCounter code — use lowercase letters, numbers, and hyphens only`);
  } else {
    pass("analytics.goat…", analytics.goatcounterCode, `→ https://${analytics.goatcounterCode}.goatcounter.com`);
  }
} else {
  pass("analytics", "not configured", "(GitHub Insights still works — repo → Insights → Traffic)");
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log();
console.log(D("─────────────────────────────────────────────────────────────────────"));
const parts = [
  passes   ? G(`${passes} ✓`)   : "",
  warnings ? Y(`${warnings} ⚠`) : "",
  errors   ? R(`${errors} ✗`)   : "",
].filter(Boolean);
console.log(`  ${parts.join("  ")}\n`);

if (errors === 0) {
  if (warnings > 0) {
    console.log(Y(`  Looks good! Address the warnings above to get the most from your portfolio.\n`));
    gha.endgroup();
    gha.notice(`Config valid with ${warnings} warning${warnings !== 1 ? "s" : ""}. See details above.`);
  } else {
    console.log(G(`  ✓ Everything looks great — your config is fully set up!\n`));
    gha.endgroup();
  }
  process.exit(0);
}

// ── errors > 0 ────────────────────────────────────────────────────────────────
if (!FIX_MODE) {
  console.log(R(`  Fix the ${errors} error${errors !== 1 ? "s" : ""} above before deploying.\n`));
  console.log(D(`  Tip: run  pnpm check-config --fix  to auto-apply safe structural defaults.\n`));
  gha.endgroup();
  gha.error(
    `${errors} config error${errors !== 1 ? "s" : ""} found in portfolio.config.yaml — ` +
    `fix them and push again. See the "GitVitae config validation" log group above for details.`,
    "Config validation failed"
  );
  process.exit(1);
}

// ── --fix mode ────────────────────────────────────────────────────────────────
console.log(B("── Auto-fix ─────────────────────────────────────────────────────────"));

let rawYaml = readFileSync(CONFIG_PATH, "utf8");
const applied   = [];
const needsYou  = [];

// Structural fields: safe to set a default without user input
const STRUCTURAL = [
  {
    key: "defaultTheme",
    default: "system",
    valid: ["light", "dark", "system"],
    yamlVal: "system",
  },
  {
    key: "colorPreset",
    default: "indigo",
    valid: ["indigo", "emerald", "rose", "amber", "ocean", "slate", "custom"],
    yamlVal: "indigo",
  },
  {
    key: "openToWork",
    default: false,
    valid: null, // boolean check
    yamlVal: "false",
  },
];

for (const { key, default: def, valid, yamlVal } of STRUCTURAL) {
  const val = cfg[key];
  const keyLineRe = new RegExp(`^(${key}\\s*:).*$`, "m");
  const keyPresent = keyLineRe.test(rawYaml);

  const isInvalid = val === undefined || val === null ||
    (valid ? !valid.includes(val) : typeof val !== "boolean");

  if (!isInvalid) continue;

  if (keyPresent) {
    // Replace the existing (invalid) line, preserving any inline comment
    rawYaml = rawYaml.replace(keyLineRe, `$1 ${yamlVal}  # auto-fixed from: ${JSON.stringify(val)}`);
    applied.push({ key, to: def, from: val, action: "fixed" });
  } else {
    // Key is missing entirely — append
    rawYaml += `\n${key}: ${yamlVal}  # added by check-config --fix\n`;
    applied.push({ key, to: def, from: undefined, action: "added" });
  }
}

// Required user-data fields: can't guess these, but add TODO stubs if absent
const USER_REQUIRED = [
  { key: "name",    stub: "Your Name",                       hint: "your full name" },
  { key: "title",   stub: "Your Professional Title",         hint: 'your job title, e.g. "Full-Stack Engineer"' },
  { key: "tagline", stub: "One-line pitch for your hero section.", hint: "a short, punchy description" },
  { key: "email",   stub: "you@example.com",                 hint: "your contact email" },
];

let stubBlock = "";
for (const { key, stub, hint } of USER_REQUIRED) {
  const val = cfg[key];
  if (!val || (typeof val === "string" && !val.trim())) {
    stubBlock += `# ${key}: ${stub}  # TODO: replace with ${hint}\n`;
    needsYou.push(key);
  }
}

if (stubBlock) {
  rawYaml += `\n# ── TODO: fill in these required fields (pnpm check-config --fix) ──────────\n${stubBlock}`;
}

// Write changes if anything was touched
if (applied.length > 0 || needsYou.length > 0) {
  writeFileSync(CONFIG_PATH, rawYaml);
}

// Report
if (applied.length > 0) {
  console.log();
  console.log(G(`  Auto-applied ${applied.length} safe default${applied.length !== 1 ? "s" : ""}:`));
  for (const { key, to, from, action } of applied) {
    const fromStr = from !== undefined ? D(`  (was: ${JSON.stringify(from)})`) : "";
    console.log(`  ${G("✓")} ${B(key.padEnd(18))} ${action === "added" ? D("added") : D("fixed")} → ${String(to)}${fromStr}`);
  }
}

if (needsYou.length > 0) {
  console.log();
  console.log(Y(`  ${needsYou.length} required field${needsYou.length !== 1 ? "s" : ""} need your input (TODO stubs added to end of file):`));
  for (const key of needsYou) {
    console.log(`  ${Y("→")} ${B(key)}`);
  }
}

const remaining = errors - applied.length;
console.log();
if (remaining <= 0) {
  console.log(G(`  ✓ All fixable errors resolved. Run  pnpm check-config  to verify.\n`));
  gha.endgroup();
  process.exit(0);
} else {
  console.log(Y(`  ${remaining} error${remaining !== 1 ? "s" : ""} still need manual attention — see the ✗ items above.\n`));
  gha.endgroup();
  process.exit(1);
}
