import { useState, useEffect } from "react";
import { Moon, Sun, Download, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "@/portfolio.config";

interface NavbarProps {
  theme: string;
  onToggleTheme: () => void;
}

// All possible nav links in display order — only shown if their section is enabled
const ALL_NAV_LINKS = [
  { label: "About",          href: "#about",          section: "about"          },
  { label: "Skills",         href: "#skills",         section: "skills"         },
  { label: "Experience",     href: "#experience",     section: "experience"     },
  { label: "Projects",       href: "#projects",       section: "projects"       },
  { label: "Education",      href: "#education",      section: "education"      },
  { label: "Certifications", href: "#certifications", section: "certifications" },
  { label: "Contact",        href: "#contact",        section: "contact"        },
] as const;

// Derive visible nav links from section toggles at module level (static, no re-renders needed)
const s = config.sections;
const navLinks = ALL_NAV_LINKS.filter(
  (l) => s[l.section as keyof typeof s] !== false,
);

const sectionIds = navLinks.map((l) => l.href.slice(1));

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const visible = new Set<string>();

    const updateActive = () => {
      const ordered = sectionIds.filter((id) => visible.has(id));
      if (ordered.length > 0) setActiveSection(ordered[0]);
    };

    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
          updateActive();
        },
        { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="font-serif text-xl font-light tracking-wide text-foreground hover:text-primary transition-colors"
          data-testid="nav-logo"
        >
          {config.name.split(" ")[0]}
          <span className="text-primary font-normal">.</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-3.5 py-2 text-xs font-medium tracking-widest uppercase rounded-md transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-md bg-secondary"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="relative p-2 rounded-full border border-border hover:border-primary/40 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all overflow-hidden"
            aria-label="Toggle theme"
            data-testid="button-toggle-theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, y: 8 }}
                  animate={{ rotate: 0, opacity: 1, y: 0 }}
                  exit={{ rotate: 90, opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
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
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="block"
                >
                  <Moon size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <a
            href={config.resumeUrl}
            download={config.resumeFileName}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-widest uppercase bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            data-testid="button-download-resume-nav"
          >
            <Download size={13} />
            Resume
          </a>

          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
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
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isActive ? "bg-primary" : ""
                      }`}
                    />
                    {link.label}
                  </a>
                );
              })}
              <a
                href={config.resumeUrl}
                download={config.resumeFileName}
                className="flex items-center gap-2 px-3 py-3 text-xs font-medium tracking-widest uppercase text-primary hover:bg-accent rounded-md transition-colors"
              >
                <Download size={13} />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
