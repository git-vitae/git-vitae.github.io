import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Palette,
  Smartphone,
  Printer,
  Zap,
  Globe,
  Lock,
  ChevronDown,
  Sun,
  Moon,
  Github,
  Check,
  Rss,
  PenLine,
  BookOpen,
  Sparkles,
  Link2,
  LayoutTemplate,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

const GITHUB_TEMPLATE_URL =
  'https://github.com/git-vitae/git-vitae.github.io/generate';
const GITHUB_REPO_URL = 'https://github.com/git-vitae/git-vitae.github.io';
const SETUP_URL = '#/setup';

// ─── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: '01',
    emoji: '📋',
    title: 'Copy the starter',
    body: 'Click one button to copy the template to your free GitHub account. No installations, no downloads, no setup.',
    note: 'Need a GitHub account? Creating one is free and takes 30 seconds.',
  },
  {
    num: '02',
    emoji: '✏️',
    title: 'Fill in your details',
    body: 'Open one plain-text settings file and replace the placeholders with your name, job title, work experience, and links.',
    note: 'It reads like a form — no coding knowledge needed.',
  },
  {
    num: '03',
    emoji: '🚀',
    title: 'Your portfolio is live',
    body: 'Within 2 minutes, your portfolio is online at your-name.github.io and ready to share with the world.',
    note: 'Update it any time — changes go live automatically.',
  },
];

const FEATURES = [
  {
    icon: Palette,
    title: '6 colour themes',
    desc: 'Indigo, emerald, rose, amber, ocean, slate — switch with a single word change in your settings file.',
  },
  {
    icon: Smartphone,
    title: 'Looks great everywhere',
    desc: 'Phones, tablets, laptops — your portfolio is perfectly laid out on every screen size.',
  },
  {
    icon: Printer,
    title: 'PDF export built in',
    desc: 'One click turns your full portfolio into a clean, recruiter-ready PDF — straight from the browser, no extra tools.',
  },
  {
    icon: Globe,
    title: 'Free web address',
    desc: 'Your portfolio lives at yourname.github.io. Bring your own custom domain any time — still free.',
  },
  {
    icon: Rss,
    title: 'RSS feed included',
    desc: 'Your blog ships with a standards-compliant RSS feed at /rss.xml — readers can subscribe with any feed reader.',
  },
  {
    icon: BookOpen,
    title: 'Related posts',
    desc: 'Readers who finish one post see suggestions for what to read next, based on shared tags.',
  },
  {
    icon: Moon,
    title: 'Dark mode',
    desc: 'Every page works in light and dark mode out of the box. No extra configuration needed.',
  },
  {
    icon: Zap,
    title: 'Updates in under 2 minutes',
    desc: 'Edit your settings file and your site refreshes itself. Automatically, every single time.',
  },
  {
    icon: Lock,
    title: 'No ads. No fees. Ever.',
    desc: 'GitVitae is open source and hosted by GitHub for free. Nothing to pay for, nothing to cancel.',
  },
];

const BLOG_MOCK_POSTS = [
  {
    tags: ['career', 'mindset'],
    title: 'Why I Started Building in Public',
    excerpt:
      "Sharing your work before it's perfect is terrifying. It's also the best career move I've made.",
    date: 'Mar 10',
    mins: 2,
  },
  {
    tags: ['tools', 'design'],
    title: 'The Tools I Actually Use Every Day',
    excerpt: 'A short, honest list — no affiliate links, no fluff.',
    date: 'Feb 4',
    mins: 3,
  },
  {
    tags: ['life', 'writing'],
    title: 'Hello, World',
    excerpt: 'Every developer eventually writes a first post. This is mine.',
    date: 'Jan 20',
    mins: 2,
  },
];

const FAQS = [
  {
    q: 'Do I need to know how to code?',
    a: 'Not at all. You fill in a plain text file — almost like filling in a form — with your name, job title, experience, and links. GitVitae handles all the design and technical parts automatically.',
  },
  {
    q: 'Is it really completely free?',
    a: "Yes, forever. Your portfolio is hosted by GitHub Pages, which has been free for personal sites since 2008. There's no catch, no trial period, and no credit card required.",
  },
  {
    q: 'How long does it take to set up?',
    a: 'Most people are done in under 5 minutes. Creating a GitHub account takes about 30 seconds, copying the template takes 10 seconds, and filling in your details takes the rest.',
  },
  {
    q: 'Can I use my own domain (like myname.com)?',
    a: "Yes. GitHub Pages supports custom domains at no extra cost. You'd need to own the domain (around €12–15/year from any registrar), but the hosting is always free.",
  },
  {
    q: 'Can I write blog posts?',
    a: "Yes — and it's built in, not bolted on. You write posts in plain Markdown files and drop them in the blog/ folder. Your portfolio automatically picks them up, shows them with tags and reading time, and generates an RSS feed at /rss.xml so readers can subscribe.",
  },
  {
    q: 'Will it work on GitHub Pages?',
    a: "Yes, that's exactly what it's designed for. Every feature — portfolio, blog, resume, RSS feed, dark mode, themes — is a static file that GitHub Pages serves for free. Nothing requires a server.",
  },
  {
    q: 'What is GitHub?',
    a: 'GitHub is a free service used by millions of people to store and share files — think of it like Google Drive, but designed for websites and code. Your portfolio files live there, and GitHub publishes them as a website for free.',
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="border-border group w-full border-b py-5 text-left last:border-0"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground flex-shrink-0"
        >
          <ChevronDown size={16} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="text-muted-foreground overflow-hidden pt-2 text-sm leading-relaxed"
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
      className="border-border shadow-primary/5 bg-background mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl"
    >
      <div className="bg-secondary border-border flex items-center gap-2 border-b px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
          <div className="h-3 w-3 rounded-full bg-green-400/70" />
        </div>
        <div className="mx-3 flex-1">
          <div className="bg-background border-border text-muted-foreground rounded-lg border px-3 py-1 text-center font-mono text-[11px]">
            yourname.github.io
          </div>
        </div>
      </div>
      <div className="bg-background p-6 text-center sm:p-10">
        <div className="bg-primary/15 border-primary/20 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border text-xl font-bold">
          JD
        </div>
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Open to Opportunities
        </div>
        <h2 className="text-foreground mb-1 font-serif text-2xl font-medium sm:text-3xl">
          Jane Doe
        </h2>
        <p className="text-primary mb-4 font-mono text-xs tracking-widest uppercase">
          UX Designer &amp; Researcher
        </p>
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-xs font-medium">
            View My Work
          </div>
          <div className="border-border text-foreground rounded-full border px-5 py-2 text-xs font-medium">
            View Resume
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            'Figma',
            'User Research',
            'Prototyping',
            'React',
            'Usability Testing',
          ].map((s) => (
            <span
              key={s}
              className="bg-secondary border-border text-muted-foreground rounded-full border px-2.5 py-1 text-[10px]"
            >
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
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="border-border shadow-primary/5 bg-background overflow-hidden rounded-2xl border shadow-xl"
    >
      <div className="bg-secondary border-border flex items-center gap-2 border-b px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
        </div>
        <span className="text-muted-foreground ml-1 font-mono text-[11px]">
          yourname.github.io/#/blog
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-foreground font-serif text-sm font-semibold">
            Blog
          </p>
          <span className="text-primary flex items-center gap-1 text-[10px] font-medium">
            <Rss size={9} /> RSS
          </span>
        </div>
        <div className="mb-2 flex gap-1.5">
          {['All', 'career', 'design', 'tools'].map((t, i) => (
            <span
              key={t}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${i === 0 ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}
            >
              {t}
            </span>
          ))}
        </div>
        {BLOG_MOCK_POSTS.map((p) => (
          <div
            key={p.title}
            className="border-border bg-secondary/20 hover:border-primary/30 rounded-xl border p-3 transition-colors"
          >
            <div className="mb-1.5 flex gap-1">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="bg-accent text-accent-foreground rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-foreground mb-1 text-xs leading-snug font-medium">
              {p.title}
            </p>
            <p className="text-muted-foreground mb-1.5 line-clamp-1 text-[10px] leading-relaxed">
              {p.excerpt}
            </p>
            <div className="text-muted-foreground flex items-center justify-between text-[9px]">
              <span>
                {p.date} · {p.mins} min read
              </span>
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
    <div className="bg-background text-foreground min-h-screen">
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="text-3xl font-semibold tracking-tight">
            Git<span className="text-primary">Vitae</span>
          </span>
          <div className="flex items-center gap-3">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-muted-foreground hover:text-foreground hover:border-primary hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors sm:flex"
            >
              <FaGithub size={24} className="text-primary" />
              Star on GitHub
            </a>
            <button
              onClick={onToggleTheme}
              className="hover:bg-secondary text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <a
              href="#/demo"
              className="text-muted-foreground hover:text-foreground hidden text-xs transition-colors sm:block"
            >
              See demo
            </a>
            <a
              href={SETUP_URL}
              className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-opacity hover:opacity-90"
            >
              Get started free
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-24 pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-primary/20 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
          >
            <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
            Free · Open source · Runs on GitHub Pages
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-foreground mb-6 font-serif text-4xl leading-tight font-medium sm:text-5xl md:text-6xl"
          >
            The portfolio you keep putting off —{' '}
            <em className="text-primary not-italic">done in 5 minutes.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.07 }}
            className="text-muted-foreground -mt-4 mb-6 font-mono text-[11px] tracking-[0.2em] uppercase opacity-55"
          >
            git + curriculum vitae
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-muted-foreground mx-auto mb-8 max-w-xl text-base leading-relaxed sm:text-lg"
          >
            Fork the template. Fill in your name, experience, and links. Go live
            — free on GitHub Pages, forever. No code, no subscriptions, no
            excuses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mb-16 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href={SETUP_URL}
              className="bg-primary text-primary-foreground flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
            >
              Build mine — it's free
              <ArrowRight size={15} />
            </a>
            <a
              href="#/demo"
              className="border-border text-foreground hover:bg-secondary flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors"
            >
              See a live example
            </a>
          </motion.div>

          {/* ── Video Section ────────────────────────────────────────────────── */}
          <section className="px-16 py-6">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mx-auto w-full max-w-2xl"
              >
                <div
                  className="relative w-full"
                  style={{ paddingBottom: '56.25%' }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/iUoFmcTKmW8?si=c01IKP6kemkiwY1m"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute top-0 left-0 h-full w-full rounded-xl shadow-lg"
                  ></iframe>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </section>

      {/* ── Social proof strip ───────────────────────────────────────────── */}
      <section className="border-border bg-secondary/30 border-y px-6 py-8">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs">
          {[
            '✓  No coding required',
            '✓  Free GitHub Pages hosting',
            '✓  Your own web address',
            '✓  Built-in blog + RSS feed',
            '✓  Printable resume page',
            '✓  Dark mode included',
            '✓  Updates automatically',
          ].map((item) => (
            <span key={item} className="font-medium">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Story / Pain point ───────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <p className="text-primary mb-5 font-mono text-xl font-medium tracking-widest uppercase">
              The problem
            </p>
            <h2 className="text-foreground mx-auto mb-6 max-w-2xl font-serif text-3xl leading-snug font-medium sm:text-4xl">
              You're good at your work. But when someone searches for you online
              — there's nothing there.
            </h2>
            <p className="text-muted-foreground mx-auto mb-4 max-w-xl text-base leading-relaxed">
              A hiring manager loved your application. They Googled you. They
              found a LinkedIn from 2019 and a half-finished portfolio you meant
              to complete "this weekend."
            </p>
            <p className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed">
              Meanwhile, the candidate with the polished portfolio page — even
              if their skills are comparable to yours — got the callback. Not
              because they were better. Because they were{' '}
              <em className="text-foreground font-medium not-italic">
                visible.
              </em>
            </p>
          </motion.div>

          {/* Divider quote */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border-primary/30 mx-auto mb-16 max-w-xl border-l-2 pl-6"
          >
            <p className="text-foreground/80 font-serif text-lg leading-relaxed italic">
              "You have the skills. GitVitae makes sure the world can see them."
            </p>
          </motion.div>

          {/* Blockers → answers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-primary mb-8 text-center font-mono text-lg font-medium tracking-widest uppercase">
              Every excuse, answered
            </p>
            <div className="mb-12 grid gap-4 sm:grid-cols-2">
              {[
                {
                  blocker: `"I'll build it properly when I have more time."`,
                  answer:
                    "There's never more time. Five minutes is all GitVitae takes.",
                },
                {
                  blocker: `"I'd need to learn web design first."`,
                  answer:
                    "You don't. Fill in a plain-text file. GitVitae handles all the design.",
                },
                {
                  blocker: `"I don't know where to host it."`,
                  answer:
                    'GitHub Pages. Built into the template. Free forever — nothing to configure.',
                },
                {
                  blocker: `"I started one once, but it got too complicated."`,
                  answer:
                    'One file. No frameworks, no deployments, no rabbit holes.',
                },
              ].map(({ blocker, answer }) => (
                <div
                  key={blocker}
                  className="border-border bg-secondary/20 hover:border-primary/30 group rounded-2xl border p-5 transition-colors"
                >
                  <p className="text-muted-foreground/50 mb-3 text-sm leading-snug line-through">
                    {blocker}
                  </p>
                  <p className="text-foreground flex items-start gap-2 text-sm leading-snug font-medium">
                    <Check
                      size={14}
                      className="text-primary mt-0.5 flex-shrink-0"
                    />
                    {answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href={SETUP_URL}
                className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                Stop being invisible — it's free
                <ArrowRight size={15} />
              </a>
              <p className="text-muted-foreground mt-3 text-xs">
                No code · No cost · Live in 5 minutes
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-secondary/20 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <p className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase">
              How it works
            </p>
            <h2 className="text-foreground font-serif text-3xl font-medium sm:text-4xl">
              Three steps. Five minutes. Done.
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {i < STEPS.length - 1 && (
                  <div className="bg-border absolute top-8 right-[-calc(50%-2.5rem)] left-[calc(50%+2.5rem)] hidden h-px md:block" />
                )}
                <div className="mb-4 text-4xl">{step.emoji}</div>
                <div className="text-primary/60 mb-2 font-mono text-sm font-semibold tracking-widest">
                  STEP {step.num}
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                  {step.body}
                </p>
                <p className="text-muted-foreground/70 text-xs italic">
                  {step.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Settings file preview ─────────────────────────────────────────── */}
      <section className="bg-secondary/20 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="grid items-center gap-12 md:grid-cols-2"
          >
            <div>
              <p className="text-primary mb-4 font-mono text-base font-medium tracking-widest uppercase">
                One file. Everything.
              </p>
              <h2 className="text-foreground mb-4 font-serif text-3xl font-medium">
                Your entire portfolio lives in one file.
              </h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                No HTML. No CSS. No code of any kind. Every section of your
                portfolio — bio, experience, projects, blog settings, colour
                theme — is controlled by one plain-text YAML file. It reads like
                filling in a form.
              </p>
              <ul className="space-y-2">
                {[
                  'Name, title, bio, and contact',
                  'Work experience and projects',
                  'Skills, education, certifications',
                  'Colour theme (one word to change it)',
                  'Blog settings and site URL',
                  'Which sections to show or hide',
                ].map((item) => (
                  <li
                    key={item}
                    className="text-muted-foreground flex items-center gap-2 text-sm"
                  >
                    <Check size={14} className="text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-border bg-background overflow-hidden rounded-2xl border shadow-lg">
              <div className="bg-secondary border-border flex items-center gap-2 border-b px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                </div>
                <span className="text-muted-foreground ml-1 font-mono text-[11px]">
                  portfolio.config.yaml
                </span>
              </div>
              <div className="text-muted-foreground space-y-1 p-5 font-mono text-[11px] leading-relaxed">
                <div>
                  <span className="text-primary/60"># Your identity</span>
                </div>
                <div>
                  <span className="text-blue-500 dark:text-blue-400">name</span>
                  :{' '}
                  <span className="text-green-600 dark:text-green-400">
                    "Jane Doe"
                  </span>
                </div>
                <div>
                  <span className="text-blue-500 dark:text-blue-400">
                    title
                  </span>
                  :{' '}
                  <span className="text-green-600 dark:text-green-400">
                    "UX Designer"
                  </span>
                </div>
                <div>
                  <span className="text-blue-500 dark:text-blue-400">
                    location
                  </span>
                  :{' '}
                  <span className="text-green-600 dark:text-green-400">
                    "London, UK"
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-primary/60"># Pick a theme colour</span>
                </div>
                <div>
                  <span className="text-blue-500 dark:text-blue-400">
                    colorPreset
                  </span>
                  :{' '}
                  <span className="text-green-600 dark:text-green-400">
                    "emerald"
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-primary/60"># Enable the blog</span>
                </div>
                <div>
                  <span className="text-blue-500 dark:text-blue-400">blog</span>
                  :
                </div>
                <div className="pl-4">
                  <span className="text-orange-500">enabled</span>:{' '}
                  <span className="text-yellow-500 dark:text-yellow-400">
                    true
                  </span>
                </div>
                <div className="pl-4">
                  <span className="text-orange-500">title</span>:{' '}
                  <span className="text-green-600 dark:text-green-400">
                    "Jane's Notes"
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-primary/60"># Your experience</span>
                </div>
                <div>
                  <span className="text-blue-500 dark:text-blue-400">
                    experience
                  </span>
                  :
                </div>
                <div className="pl-4">
                  <span className="text-orange-500">- company</span>:{' '}
                  <span className="text-green-600 dark:text-green-400">
                    "Acme Design"
                  </span>
                </div>
                <div className="pl-6">
                  <span className="text-orange-500">role</span>:{' '}
                  <span className="text-green-600 dark:text-green-400">
                    "Lead Designer"
                  </span>
                </div>
                <div className="text-foreground/20">...</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Blog showcase ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase">
                Blog · RSS · Related posts
              </p>
              <h2 className="text-foreground mb-4 font-serif text-3xl font-medium">
                Your portfolio and your blog, in one place.
              </h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Drop Markdown files into a folder and they become blog posts.
                Tags, reading time, and related post suggestions are automatic.
                Your readers can subscribe via the RSS feed — no third-party
                newsletter service needed.
              </p>
              <ul className="space-y-3">
                {[
                  {
                    icon: PenLine,
                    text: 'Write posts in plain Markdown — no editor needed',
                  },
                  { icon: Rss, text: 'Auto-generated RSS feed at /rss.xml' },
                  {
                    icon: Sparkles,
                    text: 'Related posts shown at the end of each article',
                  },
                  {
                    icon: LayoutTemplate,
                    text: 'Tag filter on the blog index keeps posts organised',
                  },
                ].map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="text-muted-foreground flex items-start gap-3 text-sm"
                  >
                    <span className="bg-primary/10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg">
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
      <section className="bg-secondary/20 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <p className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase">
              What you get
            </p>
            <h2 className="text-foreground font-serif text-3xl font-medium sm:text-4xl">
              Everything a great portfolio needs.
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-md text-sm">
              Not a stripped-down template — a complete platform, all driven
              from one file.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="border-border hover:border-primary/30 bg-background hover:shadow-primary/5 rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
              >
                <div className="bg-primary/10 mb-4 flex h-9 w-9 items-center justify-center rounded-xl">
                  <feat.icon size={17} className="text-primary" />
                </div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  {feat.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Viral loop — "Made with GitVitae" ──────────────────────────────── */}
      <section className="border-border border-y px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="grid items-center gap-10 md:grid-cols-2"
          >
            <div>
              <p className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase">
                Spread the word
              </p>
              <h2 className="text-foreground mb-4 font-serif text-2xl font-medium">
                Add a badge. Help other developers discover GitVitae.
              </h2>
              <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                Add one optional line to your settings file and a small "Made
                with GitVitae" badge appears in your portfolio footer. No
                obligations — just a nice way to help other developers find a
                free tool they might love.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={SETUP_URL}
                  className="bg-primary text-primary-foreground flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Get started free
                  <ArrowRight size={14} />
                </a>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                >
                  <Github size={14} />
                  View source
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-border bg-background rounded-xl border p-4 shadow-sm">
                <p className="text-muted-foreground mb-2 font-mono text-[10px]">
                  portfolio.config.yaml
                </p>
                <div className="text-muted-foreground space-y-0.5 font-mono text-[11px]">
                  <div>
                    <span className="text-primary/60">
                      # Optional — show a footer badge
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-500 dark:text-blue-400">
                      showPoweredBy
                    </span>
                    :{' '}
                    <span className="text-yellow-500 dark:text-yellow-400">
                      true
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-border bg-secondary/30 flex items-center justify-between rounded-xl border px-5 py-4">
                <span className="text-muted-foreground text-xs">
                  yourname.github.io — portfolio footer
                </span>
                <span className="text-muted-foreground border-border bg-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px]">
                  <Link2 size={10} />
                  Made with GitVitae
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Live demo CTA ─────────────────────────────────────────────────── */}
      <section className="bg-secondary/20 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase">
            See it live
          </p>
          <h2 className="text-foreground mb-4 font-serif text-2xl font-medium sm:text-3xl">
            Not convinced? See the real thing.
          </h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            The demo portfolio was built entirely with GitVitae — the same
            template you'll get for free. Browse the blog, download the resume,
            switch to dark mode.
          </p>
          <a
            href="#/demo"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-2 rounded-full border-2 px-7 py-3.5 text-sm font-semibold transition-all duration-200"
          >
            Open the live demo
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <p className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase">
              FAQ
            </p>
            <h2 className="text-foreground font-serif text-3xl font-medium">
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
      <section className="bg-secondary/20 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-foreground mb-6 font-serif text-4xl leading-tight font-medium sm:text-5xl">
            Your next opportunity might Google you first.
          </h2>
          <p className="text-muted-foreground mx-auto mb-10 max-w-lg text-base leading-relaxed">
            Make sure what they find is worth stopping for. A complete
            portfolio, live in 5 minutes, free forever — no excuses left.
          </p>
          <a
            href={SETUP_URL}
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-opacity hover:opacity-90"
          >
            Get my free portfolio
            <ArrowRight size={17} />
          </a>
          <p className="text-muted-foreground mt-5 text-xs">
            Free forever · No credit card · No server · Runs on GitHub Pages
          </p>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-border border-t px-6 py-8">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs sm:flex-row">
          <span>
            <span className="text-foreground text-base font-semibold">
              Git<span className="text-primary">Vitae</span>
            </span>{' '}
            · Free and open source
          </span>
          <div className="flex items-center gap-6">
            <a
              href="#/demo"
              className="hover:text-foreground transition-colors"
            >
              Live demo
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <Github size={13} /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
