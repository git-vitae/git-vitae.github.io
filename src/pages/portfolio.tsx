import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Check } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Stats } from '@/components/sections/Stats';
import { GitHubStats } from '@/components/sections/GitHubStats';
import { Skills } from '@/components/sections/Skills';
import { Languages } from '@/components/sections/Languages';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Education } from '@/components/sections/Education';
import { Certifications } from '@/components/sections/Certifications';
import { Publications } from '@/components/sections/Publications';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { config } from '@/portfolio.config';
import type { SectionId } from '@/portfolio.config';

interface PortfolioPageProps {
  theme: string;
  onToggleTheme: () => void;
  topOffset: number;
}

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  about: About,
  stats: Stats,
  skills: Skills,
  languages: Languages,
  experience: Experience,
  projects: Projects,
  education: Education,
  certifications: Certifications,
  publications: Publications,
  testimonials: Testimonials,
  contact: Contact,
};

// ── Section wrapper with hover copy-link button ─────────────────────────────

function SectionWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Use config.siteUrl when set (i.e. real GitHub Pages URL), else fall back
    // to current origin. In either case append the section anchor directly —
    // in a real deployed portfolio siteMode="portfolio" there is no #/demo prefix.
    const base =
      config.siteUrl && !config.siteUrl.includes('yourusername')
        ? config.siteUrl.replace(/\/$/, '')
        : `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}`;

    // Preserve the #/demo prefix when we are currently on the demo route
    const currentHash = window.location.hash;
    const demoPrefix = currentHash.startsWith('#/demo') ? '#/demo' : '';
    const url = `${base}${demoPrefix}#${id}`;

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="group/sec relative">
      {children}
      {/* Hover copy-link button — hidden on touch screens */}
      <div className="no-print pointer-events-none absolute top-10 right-6 z-10 hidden opacity-0 transition-opacity duration-200 group-hover/sec:pointer-events-auto group-hover/sec:opacity-100 sm:block">
        <button
          onClick={handleCopy}
          className="bg-background/90 border-border text-muted-foreground hover:text-foreground hover:border-primary/40 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur transition-colors"
          aria-label={`Copy link to ${id} section`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 text-green-500"
              >
                <Check size={11} strokeWidth={2.5} />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="link"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <Link2 size={11} />
                Copy link
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export function PortfolioPage({
  theme,
  onToggleTheme,
  topOffset,
}: PortfolioPageProps) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        topOffset={topOffset}
      />
      <Hero />
      <GitHubStats />
      {config.sections
        .filter((s) => s.show)
        .map(({ id }) => {
          const Section = SECTION_COMPONENTS[id];
          if (!Section) return null;
          return (
            <SectionWrapper key={id} id={id}>
              <Section />
            </SectionWrapper>
          );
        })}
      {config.showPoweredBy && (
        <footer className="border-border border-t px-6 py-5 text-center">
          <a
            href="https://github.com/git-vitae/git-vitae.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/60 hover:text-muted-foreground inline-flex items-center gap-1.5 text-[11px] transition-colors"
          >
            <Link2 size={10} />
            Made with GitVitae
          </a>
        </footer>
      )}
    </div>
  );
}
