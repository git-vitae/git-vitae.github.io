import { useState, useEffect, useRef } from 'react';
import {
  Moon,
  Sun,
  Download,
  Menu,
  X,
  Share2,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from '@/portfolio.config';
import { ShareModal } from '@/components/ShareModal';

interface NavbarProps {
  theme: string;
  onToggleTheme: () => void;
  topOffset: number;
}

const SECTION_LABELS: Record<string, string> = {
  about: 'About',
  stats: 'Stats',
  skills: 'Skills',
  languages: 'Languages',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
  publications: 'Publications',
  testimonials: 'Testimonials',
  contact: 'Contact',
};

const allNavLinks = config.sections
  .filter((s) => s.show)
  .map((s) => ({
    label: SECTION_LABELS[s.id] ?? s.id,
    href: `#${s.id}`,
    id: s.id,
  }));

const MAX_PRIMARY = 5;
const primaryLinks = allNavLinks.slice(0, MAX_PRIMARY);
const moreLinks = allNavLinks.slice(MAX_PRIMARY);
const sectionIds = allNavLinks.map((l) => l.id);

const blogEnabled = config.blog?.enabled ?? false;

export function Navbar({ theme, onToggleTheme, topOffset }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [shareOpen, setShareOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Single scroll-position tracker — no IntersectionObserver lag
  useEffect(() => {
    const sync = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      setScrolled(scrollY > 20);

      // Near page bottom → force contact active.
      // Guard with scrollY > 0 so this never fires on the initial layout pass
      // before the DOM has fully rendered (docH may equal windowH at that point).
      if (
        scrollY > 0 &&
        scrollY + windowH >= docH - 60 &&
        sectionIds.includes('contact')
      ) {
        setActiveSection('contact');
        return;
      }

      // Pick the last section whose absolute top has crossed 40% down the viewport.
      // Use getBoundingClientRect() + scrollY instead of offsetTop — offsetTop is
      // relative to the nearest positioned ancestor, which breaks when sections are
      // wrapped in `position:relative` SectionWrapper divs (all would read as 0).
      const trigger = windowH * 0.4;
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= trigger) current = id;
      }
      setActiveSection(current);
    };

    // Defer the initial sync one frame so the browser has finished layout;
    // without this, scrollHeight may equal windowHeight and Contact gets
    // incorrectly flagged as "near bottom" on every cold load.
    let raf = requestAnimationFrame(sync);
    window.addEventListener('scroll', sync, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', sync);
    };
  }, []);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Lenis intercepts this click at document level and handles smooth scrolling.
    // Calling scrollIntoView here would conflict with Lenis and cause jerky scroll
    // on production builds (GitHub Pages). Lenis owns all anchor scrolling.
    setMobileOpen(false);
    setMoreOpen(false);
  };

  const linkClass = (isActive: boolean) =>
    `relative px-3 py-2 text-xs font-medium tracking-widest uppercase rounded-md transition-colors whitespace-nowrap ${
      isActive
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
    }`;

  return (
    <nav
      data-testid="navbar"
      style={{ top: `${topOffset}px` }}
      className={`fixed right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/85 border-border/60 border-b shadow-sm backdrop-blur-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Wordmark */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e)}
          className="text-foreground hover:text-primary flex-shrink-0 font-serif text-2xl font-light tracking-wide transition-colors"
          data-testid="nav-logo"
        >
          {(() => {
            const first = config.name.split(' ')[0];
            return first.length > 8
              ? config.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 3)
                  .toUpperCase()
              : first;
          })()}
          <span className="text-primary font-normal">.</span>
        </a>

        {/* Desktop links */}
        <div className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
          {primaryLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e)}
                className={linkClass(isActive)}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="bg-secondary absolute inset-0 rounded-md"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="bg-primary absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                {link.label}
              </a>
            );
          })}

          {/* More dropdown */}
          {moreLinks.length > 0 && (
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen((o) => !o)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-xs font-medium tracking-widest uppercase transition-colors ${
                  moreOpen || moreLinks.some((l) => activeSection === l.id)
                    ? 'text-foreground bg-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                More
                <motion.span
                  animate={{ rotate: moreOpen ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ChevronDown size={12} />
                </motion.span>
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="bg-background border-border absolute top-full left-1/2 z-50 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-xl border py-1 shadow-lg shadow-black/10"
                  >
                    {moreLinks.map((link) => {
                      const isActive = activeSection === link.id;
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleNavClick(e)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium tracking-widest uppercase transition-colors ${
                            isActive
                              ? 'text-foreground bg-secondary'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                          }`}
                        >
                          {isActive && (
                            <span className="bg-primary h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                          )}
                          {!isActive && (
                            <span className="h-1.5 w-1.5 flex-shrink-0" />
                          )}
                          {link.label}
                        </a>
                      );
                    })}
                    {blogEnabled && (
                      <a
                        href="#/blog"
                        className="text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium tracking-widest uppercase transition-colors"
                      >
                        <span className="h-1.5 w-1.5 flex-shrink-0" />
                        Blog
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Blog link (when it fits directly) */}
          {blogEnabled && moreLinks.length === 0 && (
            <a
              href="#/blog"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary relative rounded-md px-3 py-2 text-xs font-medium tracking-widest whitespace-nowrap uppercase transition-colors"
            >
              Blog
            </a>
          )}
        </div>

        {/* Right actions */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            onClick={() => setShareOpen(true)}
            className="border-border hover:border-primary/40 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-full border p-2 transition-all"
            aria-label="Share portfolio"
            data-testid="button-share-nav"
          >
            <Share2 size={16} />
          </button>

          <button
            onClick={onToggleTheme}
            className="border-border hover:border-primary/40 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground overflow-hidden rounded-full border p-2 transition-all"
            aria-label="Toggle theme"
            data-testid="button-toggle-theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, y: 8 }}
                  animate={{ rotate: 0, opacity: 1, y: 0 }}
                  exit={{ rotate: 90, opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="block"
                >
                  <Sun size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, y: 8 }}
                  animate={{ rotate: 0, opacity: 1, y: 0 }}
                  exit={{ rotate: -90, opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="block"
                >
                  <Moon size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {config.resumeUrl ? (
            <a
              href={config.resumeUrl}
              download={config.resumeFileName || 'resume.pdf'}
              className="bg-primary text-primary-foreground hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-90 md:flex"
              data-testid="button-download-resume-nav"
            >
              <Download size={13} />
              Resume
            </a>
          ) : (
            <a
              href="#/resume"
              className="bg-primary text-primary-foreground hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-90 md:flex"
              data-testid="button-download-resume-nav"
            >
              <Download size={13} />
              Resume
            </a>
          )}

          <button
            className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md p-2 transition-colors md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-testid="button-mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="bg-background/95 border-border overflow-hidden border-b backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {allNavLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e)}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-3 text-xs font-medium tracking-widest uppercase transition-colors ${
                      isActive
                        ? 'text-foreground bg-secondary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${isActive ? 'bg-primary' : ''}`}
                    />
                    {link.label}
                  </a>
                );
              })}
              {blogEnabled && (
                <a
                  href="#/blog"
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center gap-2.5 rounded-md px-3 py-3 text-xs font-medium tracking-widest uppercase transition-colors"
                >
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                  Blog
                </a>
              )}
              {config.resumeUrl ? (
                <a
                  href={config.resumeUrl}
                  download={config.resumeFileName || 'resume.pdf'}
                  className="text-primary hover:bg-accent flex items-center gap-2 rounded-md px-3 py-3 text-xs font-medium tracking-widest uppercase transition-colors"
                >
                  <Download size={13} /> Download Resume
                </a>
              ) : (
                <a
                  href="#/resume"
                  onClick={() => setMobileOpen(false)}
                  className="text-primary hover:bg-accent flex items-center gap-2 rounded-md px-3 py-3 text-xs font-medium tracking-widest uppercase transition-colors"
                >
                  <Download size={13} /> View Resume
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </nav>
  );
}
