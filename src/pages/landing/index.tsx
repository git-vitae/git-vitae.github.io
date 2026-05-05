import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Palette, Smartphone, Printer,
  Zap, Globe, Lock, ChevronDown, Sun, Moon,
  Github, Check, Rss, PenLine, BookOpen, Sparkles,
  Link2, LayoutTemplate,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";

const GITHUB_TEMPLATE_URL = "https://github.com/git-vitae/git-vitae.github.io/generate";
const GITHUB_REPO_URL = "https://github.com/git-vitae/git-vitae.github.io";
const SETUP_URL = "#/setup";

// ─── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    emoji: "📋",
    title: "Copy the starter",
    body: "Click one button to copy the template to your free GitHub account. No installations, no downloads, no setup.",
    note: "Need a GitHub account? Creating one is free and takes 30 seconds.",
  },
  {
    num: "02",
    emoji: "✏️",
    title: "Fill in your details",
    body: "Open one plain-text settings file and replace the placeholders with your name, job title, work experience, and links.",
    note: "It reads like a form — no coding knowledge needed.",
  },
  {
    num: "03",
    emoji: "🚀",
    title: "Your portfolio is live",
    body: "Within 2 minutes, your portfolio is online at your-name.github.io and ready to share with the world.",
    note: "Update it any time — changes go live automatically.",
  },
];

const FEATURES = [
  {
    icon: Palette,
    title: "6 colour themes",
    desc: "Indigo, emerald, rose, amber, ocean, slate — switch with a single word change in your settings file.",
  },
  {
    icon: Smartphone,
    title: "Looks great everywhere",
    desc: "Phones, tablets, laptops — your portfolio is perfectly laid out on every screen size.",
  },
  {
    icon: Printer,
    title: "PDF export built in",
    desc: "One click turns your full portfolio into a clean, recruiter-ready PDF — straight from the browser, no extra tools.",
  },
  {
    icon: Globe,
    title: "Free web address",
    desc: "Your portfolio lives at yourname.github.io. Bring your own custom domain any time — still free.",
  },
  {
    icon: Rss,
    title: "RSS feed included",
    desc: "Your blog ships with a standards-compliant RSS feed at /rss.xml — readers can subscribe with any feed reader.",
  },
  {
    icon: BookOpen,
    title: "Related posts",
    desc: "Readers who finish one post see suggestions for what to read next, based on shared tags.",
  },
  {
    icon: Moon,
    title: "Dark mode",
    desc: "Every page works in light and dark mode out of the box. No extra configuration needed.",
  },
  {
    icon: Zap,
    title: "Updates in under 2 minutes",
    desc: "Edit your settings file and your site refreshes itself. Automatically, every single time.",
  },
  {
    icon: Lock,
    title: "No ads. No fees. Ever.",
    desc: "GitVitae is open source and hosted by GitHub for free. Nothing to pay for, nothing to cancel.",
  },
];

const BLOG_MOCK_POSTS = [
  {
    tags: ["career", "mindset"],
    title: "Why I Started Building in Public",
    excerpt: "Sharing your work before it's perfect is terrifying. It's also the best career move I've made.",
    date: "Mar 10",
    mins: 2,
  },
  {
    tags: ["tools", "design"],
    title: "The Tools I Actually Use Every Day",
    excerpt: "A short, honest list — no affiliate links, no fluff.",
    date: "Feb 4",
    mins: 3,
  },
  {
    tags: ["life", "writing"],
    title: "Hello, World",
    excerpt: "Every developer eventually writes a first post. This is mine.",
    date: "Jan 20",
    mins: 2,
  },
];

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "Not at all. You fill in a plain text file — almost like filling in a form — with your name, job title, experience, and links. GitVitae handles all the design and technical parts automatically.",
  },
  {
    q: "Is it really completely free?",
    a: "Yes, forever. Your portfolio is hosted by GitHub Pages, which has been free for personal sites since 2008. There's no catch, no trial period, and no credit card required.",
  },
  {
    q: "How long does it take to set up?",
    a: "Most people are done in under 5 minutes. Creating a GitHub account takes about 30 seconds, copying the template takes 10 seconds, and filling in your details takes the rest.",
  },
  {
    q: "Can I use my own domain (like myname.com)?",
    a: "Yes. GitHub Pages supports custom domains at no extra cost. You'd need to own the domain (around €12–15/year from any registrar), but the hosting is always free.",
  },
  {
    q: "Can I write blog posts?",
    a: "Yes — and it's built in, not bolted on. You write posts in plain Markdown files and drop them in the blog/ folder. Your portfolio automatically picks them up, shows them with tags and reading time, and generates an RSS feed at /rss.xml so readers can subscribe.",
  },
  {
    q: "Will it work on GitHub Pages?",
    a: "Yes, that's exactly what it's designed for. Every feature — portfolio, blog, resume, RSS feed, dark mode, themes — is a static file that GitHub Pages serves for free. Nothing requires a server.",
  },
  {
    q: "What is GitHub?",
    a: "GitHub is a free service used by millions of people to store and share files — think of it like Google Drive, but designed for websites and code. Your portfolio files live there, and GitHub publishes them as a website for free.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left border-b border-border last:border-0 py-5 group"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-muted-foreground"
        >
          <ChevronDown size={16} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden text-sm text-muted-foreground leading-relaxed pt-2"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}

function BrowserMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden bg-background"
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <div className="flex-1 mx-3">
          <div className="bg-background border border-border rounded-lg px-3 py-1 text-[11px] text-muted-foreground font-mono text-center">
            yourname.github.io
          </div>
        </div>
      </div>
      <div className="bg-background p-6 sm:p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">
          JD
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Open to Opportunities
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-1">
          Jane Doe
        </h2>
        <p className="text-xs font-mono tracking-widest text-primary uppercase mb-4">
          UX Designer &amp; Researcher
        </p>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            View My Work
          </div>
          <div className="px-5 py-2 rounded-full border border-border text-xs font-medium text-foreground">
            View Resume
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {["Figma", "User Research", "Prototyping", "React", "Usability Testing"].map((s) => (
            <span key={s} className="text-[10px] px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function BlogMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-border shadow-xl shadow-primary/5 overflow-hidden bg-background"
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <span className="text-[11px] text-muted-foreground font-mono ml-1">yourname.github.io/#/blog</span>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-serif font-semibold text-foreground">Blog</p>
          <span className="flex items-center gap-1 text-[10px] text-primary font-medium">
            <Rss size={9} /> RSS
          </span>
        </div>
        <div className="flex gap-1.5 mb-2">
          {["All", "career", "design", "tools"].map((t, i) => (
            <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>
              {t}
            </span>
          ))}
        </div>
        {BLOG_MOCK_POSTS.map((p) => (
          <div key={p.title} className="p-3 rounded-xl border border-border bg-secondary/20 hover:border-primary/30 transition-colors">
            <div className="flex gap-1 mb-1.5">
              {p.tags.map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground text-[9px] font-medium">{t}</span>
              ))}
            </div>
            <p className="text-xs font-medium text-foreground mb-1 leading-snug">{p.title}</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-1 mb-1.5">{p.excerpt}</p>
            <div className="flex items-center justify-between text-[9px] text-muted-foreground">
              <span>{p.date} · {p.mins} min read</span>
              <span className="text-primary">Read →</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main landing page ──────────────────────────────────────────────────────────

interface LandingPageProps {
  theme: string;
  onToggleTheme: () => void;
}

export function LandingPage({ theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-3xl font-semibold tracking-tight">
            Git<span className="text-primary">Vitae</span>
          </span>
          <div className="flex items-center gap-3">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors font-mono"
            >
              <FaGithub size={24} className="text-primary" />
              Star on GitHub
            </a>
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <a
              href="#/demo"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              See demo
            </a>
            <a
              href={SETUP_URL}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Get started free
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Free · Open source · Runs on GitHub Pages
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-foreground leading-tight mb-6"
          >
            The portfolio you keep putting off —{" "}
            <em className="text-primary not-italic">done in 5 minutes.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.07 }}
            className="text-[11px] text-muted-foreground tracking-[0.2em] font-mono -mt-4 mb-6 uppercase opacity-55"
          >
            git + curriculum vitae
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto"
          >
            Fork the template. Fill in your name, experience, and links. Go live — free on
            GitHub Pages, forever. No code, no subscriptions, no excuses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <a
              href={SETUP_URL}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Build mine — it's free
              <ArrowRight size={15} />
            </a>
            <a
              href="#/demo"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              See a live example
            </a>
          </motion.div>

          {/* ── Video Section ────────────────────────────────────────────────── */}
          <section className="py-6 px-16">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="w-full max-w-2xl mx-auto"
              >
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/iUoFmcTKmW8?si=c01IKP6kemkiwY1m"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
                  ></iframe>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </section>

      {/* ── Social proof strip ───────────────────────────────────────────── */}
      <section className="py-8 px-6 border-y border-border bg-secondary/30">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
          {[
            "✓  No coding required",
            "✓  Free GitHub Pages hosting",
            "✓  Your own web address",
            "✓  Built-in blog + RSS feed",
            "✓  Printable resume page",
            "✓  Dark mode included",
            "✓  Updates automatically",
          ].map((item) => (
            <span key={item} className="font-medium">{item}</span>
          ))}
        </div>
      </section>

      {/* ── Story / Pain point ───────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xl font-mono font-medium tracking-widest text-primary uppercase mb-5">
              The problem
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-6 max-w-2xl mx-auto leading-snug">
              You're good at your work. But when someone searches for you online — there's nothing there.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
              A hiring manager loved your application. They Googled you. They found a LinkedIn from 2019
              and a half-finished portfolio you meant to complete "this weekend."
            </p>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Meanwhile, the candidate with the polished portfolio page — even if their skills are
              comparable to yours — got the callback. Not because they were better.
              Because they were <em className="text-foreground not-italic font-medium">visible.</em>
            </p>
          </motion.div>

          {/* Divider quote */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border-l-2 border-primary/30 pl-6 mb-16 max-w-xl mx-auto"
          >
            <p className="text-lg font-serif text-foreground/80 italic leading-relaxed">
              "You have the skills. GitVitae makes sure the world can see them."
            </p>
          </motion.div>

          {/* Blockers → answers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-center text-lg font-mono font-medium tracking-widest text-primary uppercase mb-8">
              Every excuse, answered
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {[
                {
                  blocker: `"I'll build it properly when I have more time."`,
                  answer:  "There's never more time. Five minutes is all GitVitae takes.",
                },
                {
                  blocker: `"I'd need to learn web design first."`,
                  answer:  "You don't. Fill in a plain-text file. GitVitae handles all the design.",
                },
                {
                  blocker: `"I don't know where to host it."`,
                  answer:  "GitHub Pages. Built into the template. Free forever — nothing to configure.",
                },
                {
                  blocker: `"I started one once, but it got too complicated."`,
                  answer:  "One file. No frameworks, no deployments, no rabbit holes.",
                },
              ].map(({ blocker, answer }) => (
                <div key={blocker} className="p-5 rounded-2xl border border-border bg-secondary/20 hover:border-primary/30 transition-colors group">
                  <p className="text-sm text-muted-foreground/50 line-through mb-3 leading-snug">{blocker}</p>
                  <p className="text-sm font-medium text-foreground flex items-start gap-2 leading-snug">
                    <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    {answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href={SETUP_URL}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Stop being invisible — it's free
                <ArrowRight size={15} />
              </a>
              <p className="mt-3 text-xs text-muted-foreground">No code · No cost · Live in 5 minutes</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground">
              Three steps. Five minutes. Done.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-calc(50%-2.5rem)] h-px bg-border" />
                )}
                <div className="text-4xl mb-4">{step.emoji}</div>
                <div className="text-sm font-mono text-primary/60 font-semibold tracking-widest mb-2">
                  STEP {step.num}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.body}</p>
                <p className="text-xs text-muted-foreground/70 italic">{step.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Settings file preview ─────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <p className="text-base font-mono font-medium tracking-widest text-primary uppercase mb-4">
                One file. Everything.
              </p>
              <h2 className="text-3xl font-serif font-medium text-foreground mb-4">
                Your entire portfolio lives in one file.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                No HTML. No CSS. No code of any kind. Every section of your portfolio — 
                bio, experience, projects, blog settings, colour theme — is controlled by 
                one plain-text YAML file. It reads like filling in a form.
              </p>
              <ul className="space-y-2">
                {[
                  "Name, title, bio, and contact",
                  "Work experience and projects",
                  "Skills, education, certifications",
                  "Colour theme (one word to change it)",
                  "Blog settings and site URL",
                  "Which sections to show or hide",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                </div>
                <span className="text-[11px] text-muted-foreground font-mono ml-1">
                  portfolio.config.yaml
                </span>
              </div>
              <div className="p-5 font-mono text-[11px] leading-relaxed text-muted-foreground space-y-1">
                <div><span className="text-primary/60"># Your identity</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">name</span>: <span className="text-green-600 dark:text-green-400">"Jane Doe"</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">title</span>: <span className="text-green-600 dark:text-green-400">"UX Designer"</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">location</span>: <span className="text-green-600 dark:text-green-400">"London, UK"</span></div>
                <div className="pt-1"><span className="text-primary/60"># Pick a theme colour</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">colorPreset</span>: <span className="text-green-600 dark:text-green-400">"emerald"</span></div>
                <div className="pt-1"><span className="text-primary/60"># Enable the blog</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">blog</span>:</div>
                <div className="pl-4"><span className="text-orange-500">enabled</span>: <span className="text-yellow-500 dark:text-yellow-400">true</span></div>
                <div className="pl-4"><span className="text-orange-500">title</span>: <span className="text-green-600 dark:text-green-400">"Jane's Notes"</span></div>
                <div className="pt-1"><span className="text-primary/60"># Your experience</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">experience</span>:</div>
                <div className="pl-4"><span className="text-orange-500">- company</span>: <span className="text-green-600 dark:text-green-400">"Acme Design"</span></div>
                <div className="pl-6"><span className="text-orange-500">role</span>: <span className="text-green-600 dark:text-green-400">"Lead Designer"</span></div>
                <div className="text-foreground/20">...</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Blog showcase ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4">
                Blog · RSS · Related posts
              </p>
              <h2 className="text-3xl font-serif font-medium text-foreground mb-4">
                Your portfolio and your blog, in one place.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Drop Markdown files into a folder and they become blog posts. 
                Tags, reading time, and related post suggestions are automatic. 
                Your readers can subscribe via the RSS feed — no third-party 
                newsletter service needed.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: PenLine, text: "Write posts in plain Markdown — no editor needed" },
                  { icon: Rss,     text: "Auto-generated RSS feed at /rss.xml" },
                  { icon: Sparkles, text: "Related posts shown at the end of each article" },
                  { icon: LayoutTemplate, text: "Tag filter on the blog index keeps posts organised" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-primary" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </motion.div>

            <BlogMockup />
          </div>
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4">
              What you get
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-foreground">
              Everything a great portfolio needs.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
              Not a stripped-down template — a complete platform, all driven from one file.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="p-6 rounded-2xl border border-border hover:border-primary/30 bg-background hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feat.icon size={17} className="text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Viral loop — "Made with GitVitae" ──────────────────────────────── */}
      <section className="py-20 px-6 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <div>
              <p className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4">
                Spread the word
              </p>
              <h2 className="text-2xl font-serif font-medium text-foreground mb-4">
                Add a badge. Help other developers discover GitVitae.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Add one optional line to your settings file and a small "Made with GitVitae" 
                badge appears in your portfolio footer. No obligations — just a nice way 
                to help other developers find a free tool they might love.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={SETUP_URL}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Get started free
                  <ArrowRight size={14} />
                </a>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github size={14} />
                  View source
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                <p className="text-[10px] font-mono text-muted-foreground mb-2">portfolio.config.yaml</p>
                <div className="font-mono text-[11px] space-y-0.5 text-muted-foreground">
                  <div><span className="text-primary/60"># Optional — show a footer badge</span></div>
                  <div><span className="text-blue-500 dark:text-blue-400">showPoweredBy</span>: <span className="text-yellow-500 dark:text-yellow-400">true</span></div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/30 px-5 py-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  yourname.github.io — portfolio footer
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground border border-border rounded-full px-3 py-1 bg-background">
                  <Link2 size={10} />
                  Made with GitVitae
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Live demo CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-secondary/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4">
            See it live
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-4">
            Not convinced? See the real thing.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            The demo portfolio was built entirely with GitVitae — the same template you'll get for free. 
            Browse the blog, download the resume, switch to dark mode.
          </p>
          <a
            href="#/demo"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            Open the live demo
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4">
              FAQ
            </p>
            <h2 className="text-3xl font-serif font-medium text-foreground">
              Honest answers to real questions.
            </h2>
          </motion.div>
          <div>
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-secondary/20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-foreground mb-6 leading-tight">
            Your next opportunity might Google you first.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto">
            Make sure what they find is worth stopping for. A complete portfolio, live in
            5 minutes, free forever — no excuses left.
          </p>
          <a
            href={SETUP_URL}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-semibold hover:opacity-90 transition-opacity"
          >
            Get my free portfolio
            <ArrowRight size={17} />
          </a>
          <p className="mt-5 text-xs text-muted-foreground">
            Free forever · No credit card · No server · Runs on GitHub Pages
          </p>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>
            <span className="text-base font-semibold text-foreground">Git<span className="text-primary">Vita</span></span>
            {" "}· Free and open source
          </span>
          <div className="flex items-center gap-6">
            <a href="#/demo" className="hover:text-foreground transition-colors">
              Live demo
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github size={13} /> GitHub
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
