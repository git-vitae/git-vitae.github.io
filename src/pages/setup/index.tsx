import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, ExternalLink, Check,
  Copy, CheckCircle, ChevronRight, Sparkles, ChevronDown, RefreshCw,
} from "lucide-react";
import bundledChangelog from "../../../CHANGELOG.md?raw";

const GITHUB_TEMPLATE_URL = "https://github.com/git-vita/git-vita.github.io/generate";
const GITHUB_SIGNUP_URL   = "https://github.com/signup";
const GITHUB_PAGES_DOCS   = "https://docs.github.com/en/pages";

// ─── Copy button ─────────────────────────────────────────────────────────────

function InlineCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-1.5 ml-1 px-2 py-0.5 rounded bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
    >
      {copied ? <CheckCircle size={11} className="text-green-500" /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ─── Step 0: Welcome ─────────────────────────────────────────────────────────

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-6">👋</div>
      <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
        Let's set up your free portfolio
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
        This takes about <strong className="text-foreground">5 minutes</strong>. We'll walk you through
        each step with clear pictures so you always know exactly where to click.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left max-w-xl mx-auto">
        {[
          { emoji: "🆓", label: "Completely free", sub: "No credit card, no trial" },
          { emoji: "🖱️", label: "No coding needed", sub: "Just fill in your details" },
          { emoji: "⚡", label: "Live in 5 minutes", sub: "Automatic publishing" },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-secondary/30">
            <span className="text-2xl leading-none">{item.emoji}</span>
            <div>
              <p className="text-xs font-semibold text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Let's get started
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

// ─── Step 1: Create GitHub account ───────────────────────────────────────────

function GitHubSignupMockup() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-lg bg-background max-w-sm mx-auto">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary border-b border-border">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1">
          <div className="bg-background border border-border rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono text-center">
            github.com/signup
          </div>
        </div>
      </div>
      {/* Page content */}
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <svg height="32" viewBox="0 0 16 16" className="fill-foreground">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-foreground text-center mb-4">Create your account</h3>
        <div className="space-y-2.5 mb-4">
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Username</label>
            <div className="w-full h-7 rounded border border-border bg-secondary text-[11px] text-muted-foreground px-2 flex items-center">
              janedoe
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Email address</label>
            <div className="w-full h-7 rounded border border-border bg-secondary text-[11px] text-muted-foreground px-2 flex items-center">
              jane@example.com
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1">Password</label>
            <div className="w-full h-7 rounded border border-border bg-secondary text-[11px] text-muted-foreground px-2 flex items-center">
              ••••••••••••
            </div>
          </div>
        </div>
        <div className="w-full py-2 rounded bg-[#2ea44f] text-white text-[11px] font-semibold text-center">
          Create account
        </div>
      </div>
    </div>
  );
}

function StepAccount({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-xs font-mono tracking-widest text-primary uppercase mb-2">Step 1 of 4</p>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-3">
          Create a free GitHub account
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          GitHub is a free service that will host your portfolio website. Think of it as the
          place where your portfolio "lives." Creating an account takes about 30 seconds.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
        <GitHubSignupMockup />

        <div className="space-y-5">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Go to GitHub.com</p>
              <p className="text-xs text-muted-foreground">Open the link below in a new tab. You'll see a simple sign-up form.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Choose a username</p>
              <p className="text-xs text-muted-foreground">
                Your username becomes part of your portfolio address:{" "}
                <span className="font-mono bg-secondary px-1 rounded text-foreground">
                  yourusername.github.io
                </span>. Choose something professional.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Verify your email</p>
              <p className="text-xs text-muted-foreground">GitHub will send you a quick verification email. Click the link inside it and you're in.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
            <p className="text-xs text-primary font-medium mb-1">💡 Tip</p>
            <p className="text-xs text-muted-foreground">
              Already have a GitHub account? Great — skip straight to the next step!
            </p>
          </div>

          <a
            href={GITHUB_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2ea44f] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Create free account at GitHub.com
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          I have an account — continue
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Copy the template ────────────────────────────────────────────────

function UseTemplateMockup() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-lg bg-background max-w-sm mx-auto">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary border-b border-border">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1">
          <div className="bg-background border border-border rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono text-center truncate">
            github.com/git-vita/git-vita.github.io
          </div>
        </div>
      </div>
      <div className="p-5">
        {/* Repo header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">GV</div>
          <span className="text-xs text-muted-foreground">git-vita / </span>
          <span className="text-xs font-semibold text-foreground">git-vita.github.io</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-4">
          A free portfolio website template — edit one file, go live in minutes.
        </p>
        {/* Action buttons */}
        <div className="flex gap-2">
          <div className="flex-1 py-1.5 text-center text-[11px] rounded border border-border text-muted-foreground bg-secondary">
            ⭐ Star
          </div>
          {/* Highlighted button */}
          <div className="flex-1 py-1.5 text-center text-[11px] rounded bg-[#2ea44f] text-white font-semibold ring-2 ring-[#2ea44f] ring-offset-2 ring-offset-background">
            Use this template ▾
          </div>
        </div>
        <div className="mt-3 p-2 rounded border-2 border-dashed border-primary/30 bg-primary/5 text-center">
          <span className="text-[10px] text-primary font-medium">👆 Click this green button</span>
        </div>
      </div>
    </div>
  );
}

function NamingMockup() {
  return (
    <div className="rounded-xl border border-border overflow-hidden shadow-md bg-background">
      <div className="px-4 py-3 border-b border-border bg-secondary">
        <p className="text-[11px] text-muted-foreground font-mono">Create a new repository from template</p>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Repository name <span className="text-red-400">*</span></label>
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-muted-foreground bg-secondary px-2 py-1.5 rounded-l border border-border">janedoe /</span>
            <div className="flex-1 bg-background border border-primary rounded-r px-2 py-1.5 font-mono text-foreground font-semibold ring-1 ring-primary">
              janedoe.github.io
            </div>
          </div>
          <p className="text-[10px] text-primary mt-1">✓ Use your own username here</p>
        </div>
        <div className="py-2 rounded bg-[#2ea44f] text-white text-[11px] font-semibold text-center">
          Create repository from template
        </div>
      </div>
    </div>
  );
}

function StepTemplate({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-xs font-mono tracking-widest text-primary uppercase mb-2">Step 2 of 4</p>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-3">
          Copy the portfolio template
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          You're going to make your own personal copy of the GitVita template. There are two ways — pick whichever feels simpler.
        </p>
      </div>

      {/* Two-path explanation */}
      <div className="w-full max-w-xl mx-auto mb-8 grid sm:grid-cols-2 gap-3 text-left">
        <div className="p-3.5 rounded-xl border-2 border-primary/30 bg-primary/5">
          <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary text-primary-foreground font-bold">Recommended</span>
            "Use this template"
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Creates a fresh copy with no git history. Cleaner and simpler for most people. Future updates via the Actions tab or <code className="text-primary bg-secondary px-1 rounded font-mono">pnpm upgrade-template</code>.
          </p>
        </div>
        <div className="p-3.5 rounded-xl border border-border">
          <p className="text-xs font-semibold text-foreground mb-1">Fork</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Links your copy back to GitVita. You get GitHub's built-in <strong className="text-foreground">"Sync fork"</strong> button for one-click updates — handy if you're already comfortable with git.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start mb-6">
        <div className="space-y-4">
          <UseTemplateMockup />
          <div className="mt-2">
            <NamingMockup />
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Open the template page</p>
              <p className="text-xs text-muted-foreground">Click the button below. You'll land on the GitVita template page on GitHub.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Click "Use this template" <span className="text-muted-foreground font-normal">or</span> "Fork"</p>
              <p className="text-xs text-muted-foreground">Green "Use this template" button → "Create a new repository" is the quickest path. Or click "Fork" in the top-right if you want the sync button later.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Name your repository</p>
              <p className="text-xs text-muted-foreground">
                In the "Repository name" box, type exactly:
              </p>
              <div className="mt-1.5 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary border border-border font-mono text-xs text-foreground">
                <span className="text-muted-foreground">yourusername</span>
                <span>.github.io</span>
                <InlineCopy text="yourusername.github.io" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Replace "yourusername" with your actual GitHub username.</p>
              {/* URL benefit callout */}
              <div className="mt-2 p-2.5 rounded-lg bg-primary/5 border border-primary/15 space-y-1">
                <p className="text-[10px] font-semibold text-primary">✨ Why this name matters</p>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <span className="font-mono text-foreground">yourusername.github.io</span>
                  <span className="text-muted-foreground">— short, clean URL</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-red-400 font-bold">✗</span>
                  <span className="font-mono text-muted-foreground line-through">yourusername.github.io/my-portfolio</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Naming it <span className="font-mono">username.github.io</span> is the only way to get the short address — any other name adds a long path at the end.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Click "Create repository"</p>
              <p className="text-xs text-muted-foreground">That's it! Your copy of the template is now ready to personalise.</p>
            </div>
          </div>

          <a
            href={GITHUB_TEMPLATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2ea44f] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Open the template on GitHub
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          I've copied the template — continue
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Edit your details ────────────────────────────────────────────────

function FileEditorMockup() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-lg bg-background max-w-sm mx-auto">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary border-b border-border">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1">
          <div className="bg-background border border-border rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono text-center truncate">
            github.com / janedoe / janedoe.github.io
          </div>
        </div>
      </div>
      {/* File browser row */}
      <div className="px-4 py-2 border-b border-border bg-secondary/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="text-primary font-medium">janedoe.github.io</span>
          <ChevronRight size={10} />
          <span className="font-mono text-foreground font-semibold">portfolio.config.yaml</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#2ea44f] text-white text-[10px] font-semibold">
          ✏️ Edit
        </div>
      </div>
      {/* File content */}
      <div className="p-4 font-mono text-[11px] leading-relaxed">
        <div className="text-primary/50"># Fill in your details below</div>
        <div className="mt-1">
          <span className="text-blue-500 dark:text-blue-400">name</span>:{" "}
          <span className="bg-yellow-200/60 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 px-1 rounded">"Alex Rivera"</span>
          <span className="text-primary/40 text-[10px] ml-1">← change this</span>
        </div>
        <div>
          <span className="text-blue-500 dark:text-blue-400">title</span>:{" "}
          <span className="bg-yellow-200/60 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 px-1 rounded">"Full-Stack Engineer"</span>
        </div>
        <div>
          <span className="text-blue-500 dark:text-blue-400">email</span>:{" "}
          <span className="bg-yellow-200/60 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 px-1 rounded">"alex@example.com"</span>
        </div>
        <div>
          <span className="text-blue-500 dark:text-blue-400">location</span>:{" "}
          <span className="text-green-600 dark:text-green-400">"San Francisco, CA"</span>
        </div>
        <div className="mt-1 text-primary/50"># Don't forget to change siteMode!</div>
        <div>
          <span className="text-blue-500 dark:text-blue-400">siteMode</span>:{" "}
          <span className="bg-yellow-200/60 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 px-1 rounded">"landing"</span>
          <span className="text-primary/40 text-[10px] ml-1">← change to "portfolio"</span>
        </div>
        <div className="mt-1 text-foreground/20">...</div>
      </div>
      <div className="px-4 pb-4">
        <div className="w-full py-1.5 rounded bg-[#2ea44f] text-white text-[11px] font-semibold text-center">
          Commit changes
        </div>
      </div>
    </div>
  );
}

function StepEdit({ onNext }: { onNext: () => void }) {
  const fields = [
    { field: "name",     desc: "Your full name",                   example: '"Jane Doe"' },
    { field: "title",    desc: "Your job title or role",           example: '"UX Designer"' },
    { field: "email",    desc: "Your email address",               example: '"jane@example.com"' },
    { field: "tagline",  desc: "One line about yourself",          example: '"I design things people love."' },
    { field: "location", desc: "Where you're based",               example: '"London, UK"' },
    { field: "siteUrl",  desc: "Your GitHub Pages URL",            example: '"https://janedoe.github.io"' },
    { field: "siteMode", desc: "Change to show your portfolio",    example: '"portfolio"' },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-xs font-mono tracking-widest text-primary uppercase mb-2">Step 4 of 4</p>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-3">
          Fill in your details
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          In your new repository, find and open the file called{" "}
          <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-foreground text-xs">
            portfolio.config.yaml
          </span>. Replace the placeholder text with your own information.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start mb-6">
        <FileEditorMockup />

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Open the settings file</p>
              <p className="text-xs text-muted-foreground">
                In your new repository, click on the file called{" "}
                <span className="font-mono bg-secondary px-1 rounded text-foreground">portfolio.config.yaml</span>.
                Then click the pencil icon (✏️) to edit it.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Replace the highlighted fields</p>
              <p className="text-xs text-muted-foreground mb-3">
                Look for lines that have a colon (<span className="font-mono">:</span>) and replace the text in quotation marks. Start with these key fields:
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-secondary border-b border-border">
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Field</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">What to put</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((f, i) => (
                      <tr key={f.field} className={i % 2 === 0 ? "" : "bg-secondary/30"}>
                        <td className="px-3 py-2 font-mono text-primary">{f.field}</td>
                        <td className="px-3 py-2 text-muted-foreground">{f.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Save your changes</p>
              <p className="text-xs text-muted-foreground">
                Scroll to the bottom and click the green{" "}
                <strong className="text-foreground">"Commit changes"</strong> button.
                Your portfolio will update automatically within 1–2 minutes.
              </p>
            </div>
          </div>

          {/* Colour theme picker */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                Pick a colour theme <span className="text-muted-foreground font-normal text-xs">(optional)</span>
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Find the <span className="font-mono bg-secondary px-1 rounded text-foreground">colorPreset</span> field and replace it with one of these names. Click a swatch to copy it.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "indigo",  label: "Indigo",  hsl: "250 84% 60%" },
                  { value: "emerald", label: "Emerald", hsl: "160 72% 40%" },
                  { value: "rose",    label: "Rose",    hsl: "340 75% 55%" },
                  { value: "amber",   label: "Amber",   hsl: "38 95% 50%"  },
                  { value: "ocean",   label: "Ocean",   hsl: "196 80% 42%" },
                  { value: "slate",   label: "Slate",   hsl: "215 30% 38%" },
                ].map((p) => (
                  <button
                    key={p.value}
                    title={`Copy: colorPreset: "${p.value}"`}
                    onClick={() => navigator.clipboard?.writeText(p.value).catch(() => {})}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:border-primary/40 bg-background hover:bg-secondary transition-all text-xs font-medium text-foreground group"
                  >
                    <span
                      className="w-3 h-3 rounded-full ring-1 ring-border group-hover:scale-125 transition-transform"
                      style={{ background: `hsl(${p.hsl})` }}
                    />
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Click any swatch to copy the preset name to your clipboard.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">⚠️ Important — siteMode</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                Change <span className="font-mono">siteMode</span> from{" "}
                <span className="font-mono">"landing"</span> to{" "}
                <span className="font-mono">"portfolio"</span> — otherwise you'll still see the
                GitVita introduction page instead of your portfolio.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">⚠️ Important — siteUrl</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                Set <span className="font-mono">siteUrl</span> to your real GitHub Pages address, e.g.{" "}
                <span className="font-mono">https://janedoe.github.io</span>. If you leave it as the
                placeholder, section share-links and your RSS feed will point to the wrong URL.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          I've saved my changes — finish!
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Enable GitHub Pages ─────────────────────────────────────────────

function GitHubPagesMockup() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-lg bg-background max-w-sm mx-auto">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary border-b border-border">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1">
          <div className="bg-background border border-border rounded px-2 py-0.5 text-[10px] text-muted-foreground font-mono text-center truncate">
            github.com/janedoe/janedoe.github.io/settings/pages
          </div>
        </div>
      </div>
      {/* Layout: sidebar + content */}
      <div className="flex divide-x divide-border text-[10px]">
        {/* Sidebar */}
        <div className="w-28 shrink-0 p-3 bg-secondary/40 space-y-0.5">
          <p className="text-muted-foreground font-medium mb-2">Settings</p>
          {["General", "Access", "Code security", "Branches"].map((item) => (
            <div key={item} className="px-2 py-1 rounded text-muted-foreground">{item}</div>
          ))}
          <div className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold ring-1 ring-primary/20">
            Pages
          </div>
          {["Integrations", "Environments"].map((item) => (
            <div key={item} className="px-2 py-1 rounded text-muted-foreground">{item}</div>
          ))}
        </div>
        {/* Main panel */}
        <div className="flex-1 p-4 space-y-3">
          <p className="font-semibold text-foreground text-[11px]">GitHub Pages</p>
          {/* Live banner */}
          <div className="p-2 rounded-lg bg-[#2ea44f]/10 border border-[#2ea44f]/30 text-[#2ea44f] font-medium space-y-0.5">
            <div>✓ Your site will be live at</div>
            <div className="font-mono">https://janedoe.github.io</div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Build and deployment · Source</p>
            <div className="flex items-center justify-between px-2 py-1.5 rounded border border-primary bg-background ring-1 ring-primary/30">
              <span className="text-foreground font-medium">GitHub Actions</span>
              <span className="text-muted-foreground">▾</span>
            </div>
            <div className="mt-1 text-primary font-medium">👆 Select this option</div>
          </div>
          <div className="py-1.5 rounded bg-[#2ea44f] text-white font-semibold text-center">
            Save
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPages({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-xs font-mono tracking-widest text-primary uppercase mb-2">Step 3 of 4</p>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-3">
          Enable GitHub Pages
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          GitHub Pages is the free hosting service that makes your portfolio visible on the internet.
          You need to switch it on once — it takes about 30 seconds.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start mb-6">
        <GitHubPagesMockup />

        <div className="space-y-5">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Open your repository settings</p>
              <p className="text-xs text-muted-foreground">
                Go to your new repository on GitHub. Click the <strong className="text-foreground">Settings</strong> tab
                near the top of the page (it has a gear ⚙️ icon).
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Click "Pages" in the sidebar</p>
              <p className="text-xs text-muted-foreground">
                In the left-hand menu, scroll down until you see <strong className="text-foreground">Pages</strong>. Click it.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Set Source to "GitHub Actions"</p>
              <p className="text-xs text-muted-foreground">
                Under <strong className="text-foreground">Build and deployment</strong>, click the Source dropdown
                and choose <strong className="text-foreground">GitHub Actions</strong>. Then click{" "}
                <strong className="text-foreground">Save</strong>.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Wait ~2 minutes</p>
              <p className="text-xs text-muted-foreground">
                GitHub will build and publish your site automatically.
                You'll see a green banner saying your site is live at{" "}
                <span className="font-mono bg-secondary px-1 rounded text-foreground">
                  yourusername.github.io
                </span> once it's done.
              </p>
            </div>
          </div>

          {/* First build fail notice */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">⚠️ The first build will fail — that's normal</p>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
              When you created the repository, GitHub tried to build it before Pages was configured.
              That first attempt fails. Once you've enabled Pages above, just make any tiny edit to
              your <span className="font-mono">portfolio.config.yaml</span> file and save it — that
              triggers a fresh build which will succeed.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
            <p className="text-xs text-primary font-medium mb-1">💡 Don't see the Pages option?</p>
            <p className="text-xs text-muted-foreground">
              If your repository is private, Pages won't appear. Make sure you created a <strong className="text-foreground">Public</strong> repository when copying the template.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Pages is enabled — continue
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── What's new panel (used in StepDone) ──────────────────────────────────────

const CHANGELOG_REMOTE_URL =
  "https://raw.githubusercontent.com/git-vita/git-vita.github.io/main/CHANGELOG.md";
const CACHE_KEY = "gitvita-changelog-v2";

function WhatsNew() {
  const [open, setOpen]           = useState(false);
  const [text, setText]           = useState<string>(bundledChangelog);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) { setText(cached); return; }
    setRefreshing(true);
    fetch(CHANGELOG_REMOTE_URL)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => { sessionStorage.setItem(CACHE_KEY, t); setText(t); })
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }, []);

  // Parse just the latest version block (first ## [...] section)
  const latest = text
    ? (() => {
        const blocks = text.split(/^## /m).filter(Boolean);
        return blocks[0] ? `## ${blocks[0]}` : null;
      })()
    : null;

  // Convert the markdown block to simple JSX — no need for full react-markdown here
  const lines = (latest ?? "").split("\n").filter((l) => l.trim());
  const versionLine = lines.find((l) => l.startsWith("## "))?.replace("## ", "") ?? "";
  const items: { heading: string; bullets: string[] }[] = [];
  let cur: { heading: string; bullets: string[] } | null = null;
  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (cur) items.push(cur);
      cur = { heading: line.replace("### ", ""), bullets: [] };
    } else if (line.startsWith("- ") && cur) {
      cur.bullets.push(line.replace(/^- /, ""));
    }
  }
  if (cur) items.push(cur);

  return (
    <div className="w-full max-w-lg mx-auto mb-8 rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/5 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles size={14} className="text-primary" />
          {versionLine ? `What's new — ${versionLine}` : "What's new in GitVita"}
          {refreshing && <RefreshCw size={11} className="text-muted-foreground animate-spin" />}
        </span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && items.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-primary/10 pt-3">
              {items.map((item) => (
                <div key={item.heading}>
                  <p className="text-[10px] font-mono font-semibold text-primary uppercase tracking-widest mb-1.5">
                    {item.heading}
                  </p>
                  <ul className="space-y-1">
                    {item.bullets.map((b, i) => {
                      const [bold, ...rest] = b.split(" — ");
                      return (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-snug">
                          <span className="mt-1 w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                          <span>
                            <strong className="text-foreground font-medium">
                              {bold.replace(/\*\*/g, "")}
                            </strong>
                            {rest.length > 0 ? ` — ${rest.join(" — ")}` : ""}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <a
                href="https://github.com/git-vita/git-vita.github.io/blob/main/CHANGELOG.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline underline-offset-2 mt-1"
              >
                Full changelog <ExternalLink size={10} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step 4: All done ─────────────────────────────────────────────────────────

function StepDone() {
  const NEXT_STEPS = [
    {
      emoji: "🎨",
      title: "Change your colour theme",
      desc: "Edit the colorPreset field in your settings file. Try: indigo, emerald, rose, amber, ocean.",
    },
    {
      emoji: "📸",
      title: "Add your photo",
      desc: "Upload a photo to your repository and paste the link in the avatarUrl field.",
    },
    {
      emoji: "📄",
      title: "Print your resume",
      desc: "Visit /resume on your portfolio to see a beautiful printable resume — all generated from your settings file.",
    },
    {
      emoji: "🔗",
      title: "Add your own domain",
      desc: 'In your repository settings, find "Pages" and add your custom domain (e.g. janedoe.com).',
    },
    {
      emoji: "📊",
      title: "See who's visiting (free)",
      desc: "GitHub already tracks your visitors — go to your repository → Insights → Traffic. For more detail, add a free GoatCounter code to your settings file.",
    },
    {
      emoji: "⬆️",
      title: "Get future updates",
      desc: 'Open your fork on GitHub and click "Sync fork" — that\'s it. Because you only edit portfolio.config.yaml, updates never cause conflicts.',
    },
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-6xl mb-6"
      >
        🎉
      </motion.div>
      <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
        You're all set!
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-md mx-auto">
        GitHub is now publishing your portfolio. This usually takes{" "}
        <strong className="text-foreground">1–2 minutes</strong>. Once it's ready,
        visit your portfolio at:
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border font-mono text-sm text-foreground mb-6">
        https://<span className="text-primary">yourusername</span>.github.io
        <InlineCopy text="https://yourusername.github.io" />
      </div>

      {/* Build status checker */}
      <div className="w-full max-w-lg mx-auto mb-10 rounded-2xl border border-border overflow-hidden text-left">
        <div className="px-4 py-3 bg-secondary border-b border-border flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Check your build status</span>
          <span className="text-xs text-muted-foreground">— is it live yet?</span>
        </div>
        <div className="p-4 space-y-3">
          {/* Step */}
          <div className="flex items-start gap-3 text-xs">
            <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">1</span>
            <p className="text-muted-foreground">
              Go to your repository on GitHub and click the{" "}
              <strong className="text-foreground">Actions</strong> tab.
            </p>
          </div>
          <div className="flex items-start gap-3 text-xs">
            <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">2</span>
            <div className="space-y-1.5">
              <p className="text-muted-foreground">Look for a workflow run. The status dot tells you everything:</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#2ea44f] shrink-0" />
                  <span className="text-foreground font-medium">Green</span>
                  <span className="text-muted-foreground">— your portfolio is live! 🎉</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0 animate-pulse" />
                  <span className="text-foreground font-medium">Yellow</span>
                  <span className="text-muted-foreground">— still building, check back in a minute</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                  <span className="text-foreground font-medium">Red</span>
                  <span className="text-muted-foreground">— first-run fail (expected). Make a small edit to your config file and save — that re-triggers the build.</span>
                </div>
              </div>
            </div>
          </div>
          {/* Badge snippet */}
          <div className="pt-1">
            <p className="text-[11px] text-muted-foreground mb-1.5">Optional: add this badge to your README so you always see the status at a glance</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border font-mono text-[10px] text-muted-foreground overflow-x-auto">
              <span>![Deploy](https://github.com/<span className="text-primary">username</span>/<span className="text-primary">username</span>.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)</span>
              <InlineCopy text="![Deploy](https://github.com/username/username.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)" />
            </div>
          </div>
        </div>
      </div>

      <WhatsNew />

      <p className="text-sm font-medium text-foreground mb-6">What to do next</p>
      <div className="grid sm:grid-cols-2 gap-4 text-left mb-10 max-w-xl mx-auto">
        {NEXT_STEPS.map((step) => (
          <div
            key={step.title}
            className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all"
          >
            <div className="text-2xl mb-2">{step.emoji}</div>
            <p className="text-xs font-semibold text-foreground mb-1">{step.title}</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Staying up to date */}
      <div className="w-full max-w-xl mx-auto mb-10 rounded-2xl border border-border overflow-hidden text-left">
        <div className="px-4 py-3 bg-secondary border-b border-border">
          <p className="text-sm font-medium text-foreground">Staying up to date</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            GitVita releases new features regularly. Here's how to pull them into your portfolio.
          </p>
        </div>
        <div className="divide-y divide-border">
          {/* Path 1 — GitHub Actions (works for both "Use template" and Fork) */}
          <div className="p-4 flex items-start gap-3">
            <span className="mt-0.5 w-6 h-6 rounded-full bg-[#2ea44f]/10 border border-[#2ea44f]/20 text-[#2ea44f] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
            <div>
              <p className="text-xs font-semibold text-foreground mb-0.5">
                Recommended — one-click from the Actions tab
                <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">(works for both "Use template" and Fork)</span>
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your repository ships with a <strong className="text-foreground">Sync GitVita Template</strong> workflow.
                Go to your repo → <strong className="text-foreground">Actions</strong> → <strong className="text-foreground">Sync GitVita Template</strong> → <strong className="text-foreground">Run workflow</strong> → type <code className="text-primary text-[10px] bg-secondary px-1 rounded font-mono">YES</code> → click the green button.
                Your <code className="text-primary text-[10px] bg-secondary px-1 rounded font-mono">portfolio.config.yaml</code> is always preserved automatically.
              </p>
            </div>
          </div>
          {/* Path 2 — Sync fork (only for forks) */}
          <div className="p-4 flex items-start gap-3">
            <span className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
            <div>
              <p className="text-xs font-semibold text-foreground mb-0.5">
                GitHub "Sync fork" button
                <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">(only if you used Fork, not "Use template")</span>
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                If you forked the repo, GitHub shows a <strong className="text-foreground">"Sync fork"</strong> banner on your repo page when there are new template commits. Click it, then <strong className="text-foreground">"Update branch"</strong>. Fastest option if you have it — but it won't appear for "Use this template" repos.
              </p>
            </div>
          </div>
          {/* Path 3 — CLI */}
          <div className="p-4 flex items-start gap-3">
            <span className="mt-0.5 w-6 h-6 rounded-full bg-secondary border border-border text-muted-foreground font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
            <div>
              <p className="text-xs font-semibold text-foreground mb-0.5">
                Terminal
                <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">(works for both)</span>
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                Clone your repo locally and run:
              </p>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border font-mono text-[11px] text-foreground">
                pnpm upgrade-template
                <InlineCopy text="pnpm upgrade-template" />
              </div>
            </div>
          </div>
          {/* Watch releases */}
          <div className="p-4 flex items-start gap-3">
            <span className="mt-0.5 w-6 h-6 rounded-full bg-secondary border border-border text-muted-foreground font-bold text-[10px] flex items-center justify-center shrink-0">★</span>
            <div>
              <p className="text-xs font-semibold text-foreground mb-0.5">Know when to update</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                On the{" "}
                <a href="https://github.com/git-vita/git-vita.github.io" target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline underline-offset-2">GitVita repository</a>
                , click <strong className="text-foreground">Watch → Custom → Releases</strong>. GitHub emails you when a new version ships.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="#/demo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          See the live demo again
        </a>
        <a
          href="https://github.com/git-vita/git-vita.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          View on GitHub
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const labels = ["Welcome", "GitHub account", "Copy template", "Enable Pages", "Your details", "Done!"];
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 relative">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i < current ? "bg-primary" : i === current ? "bg-primary/50" : "bg-border"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`text-[10px] font-medium transition-colors ${
              i === current ? "text-primary" : i < current ? "text-muted-foreground" : "text-border"
            } hidden sm:block`}
          >
            {i < current ? <Check size={10} className="inline mr-0.5" /> : null}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

const STEP_COUNT = 6;

export function SetupPage() {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const steps = [
    <StepWelcome onNext={next} />,
    <StepAccount onNext={next} />,
    <StepTemplate onNext={next} />,
    <StepPages onNext={next} />,
    <StepEdit onNext={next} />,
    <StepDone />,
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#/" className="text-base font-semibold tracking-tight hover:opacity-80 transition-opacity">
            Git<span className="text-primary">Vita</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="#/demo"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              See demo
            </a>
          </div>
        </div>
      </header>

      {/* Wizard body */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <ProgressBar current={step} total={STEP_COUNT} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        {/* Back navigation (not on welcome or done) */}
        {step > 0 && step < STEP_COUNT - 1 && (
          <div className="mt-8 flex items-center">
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={13} />
              Back
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
