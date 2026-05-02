import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Palette, Smartphone, FileText,
  Zap, Globe, Lock, ChevronDown, Sun, Moon,
  Github, Check,
} from "lucide-react";

const GITHUB_TEMPLATE_URL = "https://github.com/git-vita/git-vita.github.io/generate";

// ─── Data ─────────────────────────────────────────────────────────────────────

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
    body: "Open a simple settings file and replace the placeholder information with your name, job title, work experience, and social links.",
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
    title: "10+ beautiful themes",
    desc: "Pick a colour scheme that matches your style. Switch it any time with a single word change.",
  },
  {
    icon: Smartphone,
    title: "Looks great everywhere",
    desc: "Phones, tablets, laptops — your portfolio is perfectly laid out on every screen.",
  },
  {
    icon: FileText,
    title: "Built-in resume page",
    desc: "Print a polished, ready-to-send PDF resume straight from your portfolio. No extra tools needed.",
  },
  {
    icon: Globe,
    title: "Free web address",
    desc: "Your portfolio lives at yourname.github.io. Bring your own custom domain any time — still free.",
  },
  {
    icon: Zap,
    title: "Updates in under 2 minutes",
    desc: "Edit your details and your site refreshes itself automatically. Every single time.",
  },
  {
    icon: Lock,
    title: "No ads. No fees. Ever.",
    desc: "GitVita is open source and hosted by GitHub for free. Nothing to pay for, nothing to cancel.",
  },
];

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "Not at all. You fill in a plain text file — almost like filling in a form — with your name, job title, experience, and links. GitVita handles all the design and technical parts automatically.",
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
    q: "Can I change things later?",
    a: "Absolutely. Change your theme, colours, content, or layout any time by editing your settings file. Your site updates itself within 2 minutes. No re-deploying, no technical steps.",
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

// ─── Browser mockup preview ───────────────────────────────────────────────────

function BrowserMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden bg-background"
    >
      {/* Browser chrome */}
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

      {/* Portfolio preview */}
      <div className="bg-background p-6 sm:p-10 text-center">
        {/* Avatar placeholder */}
        <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">
          JD
        </div>
        {/* Open to work badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Open to Opportunities
        </div>
        {/* Name and title */}
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-1">
          Jane Doe
        </h2>
        <p className="text-xs font-mono tracking-widest text-primary uppercase mb-4">
          UX Designer &amp; Researcher
        </p>
        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            View My Work
          </div>
          <div className="px-5 py-2 rounded-full border border-border text-xs font-medium text-foreground">
            View Resume
          </div>
        </div>
        {/* Skill chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {["Figma", "User Research", "Prototyping", "Usability Testing", "React"].map((s) => (
            <span key={s} className="text-[10px] px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main landing page ─────────────────────────────────────────────────────────

interface LandingPageProps {
  theme: string;
  onToggleTheme: () => void;
}

export function LandingPage({ theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-base font-semibold tracking-tight">
            Git<span className="text-primary">Vita</span>
          </span>
          <div className="flex items-center gap-3">
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
              href={GITHUB_TEMPLATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Get started free
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Free · Open source · No coding required
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-foreground leading-tight mb-6"
          >
            Your portfolio website,{" "}
            <em className="text-primary not-italic">ready in 5 minutes.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto"
          >
            Fill in one simple file with your details. Get a beautiful,
            professional portfolio that lives online forever — completely free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <a
              href={GITHUB_TEMPLATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get my free portfolio
              <ArrowRight size={15} />
            </a>
            <a
              href="#/demo"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              See a live example
            </a>
          </motion.div>

          <BrowserMockup />
        </div>
      </section>

      {/* ── Social proof strip ───────────────────────────────────────────── */}
      <section className="py-8 px-6 border-y border-border bg-secondary/30">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
          {[
            "✓  No coding required",
            "✓  Free hosting, forever",
            "✓  Your own web address",
            "✓  Built-in resume page",
            "✓  Updates automatically",
          ].map((item) => (
            <span key={item} className="font-medium">{item}</span>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
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
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-calc(50%-2.5rem)] h-px bg-border" />
                )}
                <div className="text-4xl mb-4">{step.emoji}</div>
                <div className="text-xs font-mono text-primary/60 font-semibold tracking-widest mb-2">
                  STEP {step.num}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {step.body}
                </p>
                <p className="text-xs text-muted-foreground/70 italic">
                  {step.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Settings file preview ────────────────────────────────────────── */}
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
              <p className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4">
                The settings file
              </p>
              <h2 className="text-3xl font-serif font-medium text-foreground mb-4">
                It really is just filling in a form.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Your entire portfolio is controlled by one plain-text settings
                file. No HTML. No CSS. No code of any kind. Just your details.
              </p>
              <ul className="space-y-2">
                {[
                  "Your name and job title",
                  "A short bio about yourself",
                  "Your work experience",
                  "Projects you've worked on",
                  "Skills and education",
                  "Social media links",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fake settings file */}
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
                <div><span className="text-primary/60"># Your details</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">name</span>: <span className="text-green-600 dark:text-green-400">"Jane Doe"</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">title</span>: <span className="text-green-600 dark:text-green-400">"UX Designer"</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">email</span>: <span className="text-green-600 dark:text-green-400">"jane@example.com"</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">location</span>: <span className="text-green-600 dark:text-green-400">"London, UK"</span></div>
                <div className="pt-1"><span className="text-primary/60"># Your colours</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">colorPreset</span>: <span className="text-green-600 dark:text-green-400">"emerald"</span></div>
                <div className="pt-1"><span className="text-primary/60"># Your experience</span></div>
                <div><span className="text-blue-500 dark:text-blue-400">experience</span>:</div>
                <div className="pl-4"><span className="text-orange-500">- company</span>: <span className="text-green-600 dark:text-green-400">"Acme Design"</span></div>
                <div className="pl-6"><span className="text-orange-500">role</span>: <span className="text-green-600 dark:text-green-400">"Lead Designer"</span></div>
                <div className="pl-6"><span className="text-orange-500">period</span>: <span className="text-green-600 dark:text-green-400">"2022 – Now"</span></div>
                <div className="text-foreground/20">...</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
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
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="p-6 rounded-2xl border border-border hover:border-primary/30 bg-background hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feat.icon size={17} className="text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live demo CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-secondary/20 border-y border-border">
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
            The demo portfolio you're about to see was built entirely with
            GitVita — the same template you'll get for free.
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
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-foreground mb-6 leading-tight">
            Your work deserves to be seen.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            Set up your free portfolio today. It takes 5 minutes and you'll
            have something you're proud to share.
          </p>
          <a
            href={GITHUB_TEMPLATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-semibold hover:opacity-90 transition-opacity"
          >
            Get my free portfolio
            <ArrowRight size={17} />
          </a>
          <p className="mt-5 text-xs text-muted-foreground">
            Free forever · No credit card · No coding
          </p>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">Git<span className="text-primary">Vita</span></span>
            {" "}· Free and open source
          </span>
          <div className="flex items-center gap-6">
            <a href="#/demo" className="hover:text-foreground transition-colors">
              Live demo
            </a>
            <a
              href="https://github.com/git-vita/git-vita.github.io"
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
