import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Download, Menu, X, Share2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "@/portfolio.config";
import { ShareModal } from "@/components/ShareModal";

interface NavbarProps {
  theme: string;
  onToggleTheme: () => void;
  topOffset: number;
}

const SECTION_LABELS: Record<string, string> = {
  about:          "About",
  stats:          "Stats",
  skills:         "Skills",
  languages:      "Languages",
  experience:     "Experience",
  projects:       "Projects",
  education:      "Education",
  certifications: "Certifications",
  publications:   "Publications",
  testimonials:   "Testimonials",
  contact:        "Contact",
};

const allNavLinks = config.sections
  .filter((s) => s.show)
  .map((s) => ({ label: SECTION_LABELS[s.id] ?? s.id, href: `#${s.id}`, id: s.id }));

const MAX_PRIMARY = 5;
const primaryLinks = allNavLinks.slice(0, MAX_PRIMARY);
const moreLinks    = allNavLinks.slice(MAX_PRIMARY);
const sectionIds   = allNavLinks.map((l) => l.id);

const blogEnabled = config.blog?.enabled ?? false;

export function Navbar({ theme, onToggleTheme, topOffset }: NavbarProps) {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [shareOpen, setShareOpen]         = useState(false);
  const [moreOpen, setMoreOpen]           = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Single scroll-position tracker — no IntersectionObserver lag
  useEffect(() => {
    const sync = () => {
      const scrollY  = window.scrollY;
      const windowH  = window.innerHeight;
      const docH     = document.documentElement.scrollHeight;

      setScrolled(scrollY > 20);

      // Near page bottom → force contact active
      if (scrollY + windowH >= docH - 80 && sectionIds.includes("contact")) {
        setActiveSection("contact");
        return;
      }

      // Pick the last section whose top edge is above 30% of viewport
      const trigger = scrollY + windowH * 0.3;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= trigger) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => window.removeEventListener("scroll", sync);
  }, []);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
    setMoreOpen(false);
  };

  const linkClass = (isActive: boolean) =>
    `relative px-3 py-2 text-xs font-medium tracking-widest uppercase rounded-md transition-colors whitespace-nowrap ${
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    }`;

  return (
    <nav
      data-testid="navbar"
      style={{ top: `${topOffset}px` }}
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Wordmark */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="font-serif text-xl font-light tracking-wide text-foreground hover:text-primary transition-colors flex-shrink-0"
          data-testid="nav-logo"
        >
          {(() => {
            const first = config.name.split(" ")[0];
            return first.length > 8
              ? config.name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase()
              : first;
          })()}
          <span className="text-primary font-normal">.</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {primaryLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={linkClass(isActive)}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-md bg-secondary"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
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
                className={`flex items-center gap-1 px-3 py-2 text-xs font-medium tracking-widest uppercase rounded-md transition-colors ${
                  moreOpen || moreLinks.some((l) => activeSection === l.id)
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                More
                <motion.span animate={{ rotate: moreOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
                  <ChevronDown size={12} />
                </motion.span>
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-background border border-border rounded-xl shadow-lg shadow-black/10 overflow-hidden py-1 z-50"
                  >
                    {moreLinks.map((link) => {
                      const isActive = activeSection === link.id;
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium tracking-widest uppercase transition-colors ${
                            isActive
                              ? "text-foreground bg-secondary"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                          {!isActive && <span className="w-1.5 h-1.5 flex-shrink-0" />}
                          {link.label}
                        </a>
                      );
                    })}
                    {blogEnabled && (
                      <a
                        href="#/blog"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <span className="w-1.5 h-1.5 flex-shrink-0" />
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
              className="relative px-3 py-2 text-xs font-medium tracking-widest uppercase rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary whitespace-nowrap"
            >
              Blog
            </a>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShareOpen(true)}
            className="p-2 rounded-full border border-border hover:border-primary/40 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            aria-label="Share portfolio"
            data-testid="button-share-nav"
          >
            <Share2 size={16} />
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full border border-border hover:border-primary/40 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all overflow-hidden"
            aria-label="Toggle theme"
            data-testid="button-toggle-theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span key="sun" initial={{ rotate: -90, opacity: 0, y: 8 }} animate={{ rotate: 0, opacity: 1, y: 0 }} exit={{ rotate: 90, opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="block">
                  <Sun size={16} />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 90, opacity: 0, y: 8 }} animate={{ rotate: 0, opacity: 1, y: 0 }} exit={{ rotate: -90, opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="block">
                  <Moon size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {config.resumeUrl ? (
            <a
              href={config.resumeUrl}
              download={config.resumeFileName || "resume.pdf"}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
              data-testid="button-download-resume-nav"
            >
              <Download size={13} />
              Resume
            </a>
          ) : (
            <a
              href="#/resume"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
              data-testid="button-download-resume-nav"
            >
              <Download size={13} />
              Resume
            </a>
          )}

          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-testid="button-mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} className="block">
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} className="block">
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
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {allNavLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center gap-2.5 px-3 py-3 text-xs font-medium tracking-widest uppercase rounded-md transition-colors ${
                      isActive
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-primary" : ""}`} />
                    {link.label}
                  </a>
                );
              })}
              {blogEnabled && (
                <a
                  href="#/blog"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-3 text-xs font-medium tracking-widest uppercase rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" />
                  Blog
                </a>
              )}
              {config.resumeUrl ? (
                <a href={config.resumeUrl} download={config.resumeFileName || "resume.pdf"} className="flex items-center gap-2 px-3 py-3 text-xs font-medium tracking-widest uppercase text-primary hover:bg-accent rounded-md transition-colors">
                  <Download size={13} /> Download Resume
                </a>
              ) : (
                <a href="#/resume" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-3 text-xs font-medium tracking-widest uppercase text-primary hover:bg-accent rounded-md transition-colors">
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
