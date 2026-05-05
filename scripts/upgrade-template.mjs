#!/usr/bin/env node
/**
 * upgrade-template.mjs
 *
 * Pulls the latest GitVitae template improvements into your portfolio
 * without touching your portfolio.config.yaml.
 *
 * Usage:
 *   pnpm upgrade-template
 */

/* global process, console */

import { execSync, spawnSync } from "child_process";

const UPSTREAM_REMOTE = "git-vitae";
const UPSTREAM_URL    = "https://github.com/git-vitae/git-vitae.github.io";
const UPSTREAM_BRANCH = "main";

function run(cmd, opts = {}) {
  return spawnSync(cmd, { shell: true, stdio: "inherit", ...opts });
}

function runCapture(cmd) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch {
    return "";
  }
}

function hasUncommittedChanges() {
  const status = runCapture("git status --porcelain");
  return status.length > 0;
}

function remoteExists(name) {
  const remotes = runCapture("git remote").split("\n");
  return remotes.includes(name);
}

// ── Preflight ───────────────────────────────────────────────────────────────
console.log("\nGitVitae — upgrade template");
console.log("──────────────────────────────────────────\n");

if (hasUncommittedChanges()) {
  console.error(
    "✗  You have uncommitted changes.\n" +
    "   Commit or stash them first, then re-run:\n\n" +
    "     git add -A && git commit -m 'wip: save before upgrade'\n"
  );
  process.exit(1);
}

// ── Add upstream remote (once) ──────────────────────────────────────────────
if (!remoteExists(UPSTREAM_REMOTE)) {
  console.log(`① Adding upstream remote '${UPSTREAM_REMOTE}'...`);
  run(`git remote add ${UPSTREAM_REMOTE} ${UPSTREAM_URL}`);
  console.log(`  ✓ Added ${UPSTREAM_URL}\n`);
} else {
  console.log(`① Upstream remote '${UPSTREAM_REMOTE}' already present.\n`);
}

// ── Fetch ───────────────────────────────────────────────────────────────────
console.log(`② Fetching latest from ${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}...`);
const fetch = run(`git fetch ${UPSTREAM_REMOTE}`);
if (fetch.status !== 0) {
  console.error("\n✗  Fetch failed. Check your internet connection and try again.");
  process.exit(1);
}
console.log("  ✓ Fetched.\n");

// ── Merge ───────────────────────────────────────────────────────────────────
console.log(`③ Merging ${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}...`);
const merge = run(
  `git merge ${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH} --allow-unrelated-histories -m "chore: upgrade GitVitae template"`
);

if (merge.status !== 0) {
  console.error(`
✗  Merge conflict detected.

   This is rare and usually means a field in portfolio.config.yaml
   was renamed in the new version. Git has marked the conflict(s)
   in the file — open it, keep your values, then run:

     git add portfolio.config.yaml
     git commit
     git push
`);
  process.exit(1);
}

// ── Done ────────────────────────────────────────────────────────────────────
console.log(`
──────────────────────────────────────────
  ✓  Template upgraded successfully!

  Next steps:
    pnpm install        # install any new dependencies
    pnpm dev            # preview locally
    git push            # deploy to GitHub Pages
──────────────────────────────────────────
`);
