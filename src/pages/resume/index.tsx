import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  ArrowLeft,
  Columns2,
  AlignJustify,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { config } from '@/portfolio.config';
import { applyThemePalette } from '@/lib/themes';
import { ShareModal } from '@/components/ShareModal';

// ─── Types ────────────────────────────────────────────────────────────────────

type Layout = 'two-column' | 'classic';

interface ResumePageProps {
  theme: string;
  onToggleTheme: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isSectionVisible = (id: string) =>
  config.sections.find((s) => s.id === id)?.show !== false;

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResumeHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${compact ? 'mb-4' : 'mb-8'}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-foreground font-serif text-3xl leading-none font-light tracking-tight">
            {config.name}
          </h1>
          <p className="text-primary mt-1 text-sm font-medium tracking-[0.18em] uppercase">
            {config.title}
          </p>
        </div>

        {/* Contact line */}
        <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {config.email && (
            <a
              href={`mailto:${config.email}`}
              className="hover:text-primary flex items-center gap-1 transition-colors"
            >
              <Mail size={11} /> {config.email}
            </a>
          )}
          {config.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {config.location}
            </span>
          )}
          {config.social.github && (
            <a
              href={config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center gap-1 transition-colors"
            >
              <FaGithub size={11} />{' '}
              {config.social.github.replace('https://github.com/', '')}
            </a>
          )}
          {config.social.linkedin && (
            <a
              href={config.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center gap-1 transition-colors"
            >
              <FaLinkedin size={11} />{' '}
              {config.social.linkedin.replace('https://linkedin.com/in/', '')}
            </a>
          )}
          {config.social.website && (
            <a
              href={config.social.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center gap-1 transition-colors"
            >
              <Globe size={11} />{' '}
              {config.social.website.replace(/https?:\/\//, '')}
            </a>
          )}
        </div>
      </div>
      <div className="from-primary via-primary/30 mt-4 h-px bg-gradient-to-r to-transparent" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-primary mb-2.5 flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.2em] uppercase">
      {children}
      <span className="bg-border h-px flex-1" />
    </p>
  );
}

function ExperienceBlock() {
  if (!isSectionVisible('experience') || !config.experience?.length)
    return null;
  return (
    <div className="mb-6">
      <SectionLabel>Experience</SectionLabel>
      <div className="space-y-4">
        {config.experience.map((job, i) => (
          <div key={i} className="break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-foreground text-sm font-semibold">
                  {job.role}
                </span>
                <span className="text-muted-foreground text-xs">
                  {' '}
                  · {job.company}
                </span>
              </div>
              <span className="text-muted-foreground shrink-0 font-mono text-[10px] whitespace-nowrap">
                {job.period}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {job.description}
            </p>
            {(job.highlights ?? []).length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(job.highlights ?? []).map((h) => (
                  <span
                    key={h}
                    className="bg-primary/8 text-primary border-primary/15 rounded border px-1.5 py-0.5 text-[10px]"
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsBlock({ condensed = false }: { condensed?: boolean }) {
  if (!isSectionVisible('projects') || !config.projects?.length) return null;
  const shown = condensed
    ? config.projects.filter((p) => p.featured)
    : config.projects;
  if (!shown.length) return null;
  return (
    <div className="mb-6">
      <SectionLabel>Projects</SectionLabel>
      <div className="space-y-3">
        {shown.map((proj, i) => (
          <div key={i} className="break-inside-avoid">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-foreground text-sm font-semibold">
                {proj.name}
              </span>
              {(proj.liveUrl || proj.repoUrl) && (
                <a
                  href={proj.liveUrl || proj.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <ExternalLink size={10} />
                </a>
              )}
              <div className="flex flex-wrap gap-1">
                {proj.tags?.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="bg-secondary text-muted-foreground border-border rounded border px-1.5 py-0.5 text-[10px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              {proj.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsBlock() {
  if (!isSectionVisible('skills') || !config.skills?.length) return null;
  return (
    <div className="mb-5">
      <SectionLabel>Skills</SectionLabel>
      <div className="space-y-1.5">
        {config.skills.map((cat) => (
          <div
            key={cat.category}
            className="flex gap-1.5 text-xs leading-relaxed"
          >
            <span className="text-foreground min-w-[72px] shrink-0 font-medium whitespace-nowrap">
              {cat.category}
            </span>
            <span className="text-muted-foreground">
              {cat.items.join(', ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationBlock() {
  if (!isSectionVisible('education') || !config.education?.length) return null;
  return (
    <div className="mb-5">
      <SectionLabel>Education</SectionLabel>
      <div className="space-y-2">
        {config.education.map((edu, i) => (
          <div key={i} className="break-inside-avoid">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-foreground text-xs font-semibold">
                {edu.degree}
              </span>
              <span className="text-muted-foreground font-mono text-[10px]">
                {edu.period}
              </span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              {edu.institution}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsBlock() {
  if (!isSectionVisible('certifications') || !config.certifications?.length)
    return null;
  return (
    <div className="mb-5">
      <SectionLabel>Certifications</SectionLabel>
      <div className="space-y-1.5">
        {config.certifications.map((cert, i) => (
          <div key={i} className="flex break-inside-avoid items-start gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-foreground block text-xs leading-tight font-medium">
                {cert.title}
              </span>
              <span className="text-muted-foreground text-[10px]">
                {cert.issuer}
              </span>
            </div>
            <span className="text-muted-foreground shrink-0 font-mono text-[10px] whitespace-nowrap">
              {cert.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguagesBlock() {
  if (!config.languages?.length) return null;
  return (
    <div className="mb-5">
      <SectionLabel>Languages</SectionLabel>
      <div className="space-y-1">
        {config.languages.map((lang) => (
          <div
            key={lang.name}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-foreground font-medium">{lang.name}</span>
            <span className="text-muted-foreground">{lang.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicationsBlock() {
  const pubs = config.publications ?? [];
  if (!isSectionVisible('publications') || !pubs.length) return null;
  return (
    <div className="mb-6">
      <SectionLabel>Publications</SectionLabel>
      <div className="space-y-3">
        {pubs.map((pub, i) => (
          <div key={i} className="break-inside-avoid">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-xs leading-snug font-semibold">
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[10px] leading-relaxed">
                  {pub.authors && <span>{pub.authors} · </span>}
                  <span className="italic">{pub.venue}</span>
                  {pub.year && <span>, {pub.year}</span>}
                </p>
              </div>
              {pub.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-0.5 flex-shrink-0 hover:opacity-70"
                >
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutBlock() {
  if (!isSectionVisible('about') || !config.about) return null;
  return (
    <div className="mb-6">
      <SectionLabel>Summary</SectionLabel>
      <p className="text-muted-foreground text-xs leading-relaxed">
        {config.about}
      </p>
    </div>
  );
}

// ─── Two-column layout ────────────────────────────────────────────────────────

function TwoColumnLayout() {
  return (
    <div>
      <ResumeHeader />
      <div className="grid grid-cols-[200px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="border-border space-y-0 border-r pr-6">
          <SkillsBlock />
          <LanguagesBlock />
          <EducationBlock />
          <CertificationsBlock />
        </aside>
        {/* Main */}
        <main className="min-w-0 space-y-0">
          {isSectionVisible('about') && <AboutBlock />}
          <ExperienceBlock />
          <ProjectsBlock />
          <PublicationsBlock />
        </main>
      </div>
    </div>
  );
}

// ─── Classic single-column layout ─────────────────────────────────────────────

function ClassicLayout() {
  return (
    <div>
      <ResumeHeader compact />
      {isSectionVisible('about') && <AboutBlock />}
      <ExperienceBlock />
      <ProjectsBlock condensed />
      <PublicationsBlock />
      <div className="grid grid-cols-2 gap-6">
        <div>
          <SkillsBlock />
          <LanguagesBlock />
        </div>
        <div>
          <EducationBlock />
          <CertificationsBlock />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ResumePage({ theme, onToggleTheme }: ResumePageProps) {
  const [layout, setLayout] = useState<Layout>(() => {
    return (localStorage.getItem('resume-layout') as Layout) ?? 'two-column';
  });
  const [shareOpen, setShareOpen] = useState(false);

  const setAndStore = (l: Layout) => {
    setLayout(l);
    localStorage.setItem('resume-layout', l);
  };

  // Swap accent color to match the selected layout
  useEffect(() => {
    const preset =
      layout === 'two-column'
        ? config.resumeTheme.twoColumn
        : config.resumeTheme.classic;
    applyThemePalette(preset, theme === 'dark', config.customColors);
    return () => {
      applyThemePalette(
        config.colorPreset,
        theme === 'dark',
        config.customColors
      );
    };
  }, [layout, theme]);

  return (
    <div className="bg-muted/40 min-h-screen print:min-h-0 print:bg-white">
      {/* ── Toolbar (hidden on print) ───────────────────────────────── */}
      <div className="bg-background/90 border-border sticky top-0 z-50 flex items-center justify-between gap-4 border-b px-6 py-3 backdrop-blur print:hidden">
        {/* Back */}
        <a
          href="#/"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs font-medium transition-colors"
        >
          <ArrowLeft size={13} />
          Portfolio
        </a>

        {/* Layout switcher */}
        <div className="bg-secondary border-border flex items-center gap-1 rounded-lg border p-1">
          <button
            onClick={() => setAndStore('two-column')}
            aria-label="Two-column layout"
            aria-pressed={layout === 'two-column'}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              layout === 'two-column'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Columns2 size={13} />
            <span className="hidden sm:inline">Two Column</span>
          </button>
          <button
            onClick={() => setAndStore('classic')}
            aria-label="Classic layout"
            aria-pressed={layout === 'classic'}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              layout === 'classic'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <AlignJustify size={13} />
            <span className="hidden sm:inline">Classic</span>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShareOpen(true)}
            aria-label="Share resume"
            className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-opacity hover:opacity-90"
          >
            <Printer size={13} />
            Save PDF
          </button>
        </div>
      </div>

      {/* ── Resume paper ───────────────────────────────────────────── */}
      <div className="flex justify-center px-4 py-8 print:px-0 print:py-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={layout}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-background min-h-[1123px] w-full max-w-[794px] rounded-xl p-10 shadow-xl print:min-h-0 print:rounded-none print:bg-white print:p-8 print:shadow-none"
          >
            {layout === 'two-column' ? <TwoColumnLayout /> : <ClassicLayout />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Print styles (scoped) ───────────────────────────────────── */}
      <style>{`
        @media print {
          @page { margin: 1.4cm 1.6cm; size: A4 portrait; }
          body { background: white !important; }
          /* Neutralise framer-motion transforms and min-height overflows */
          [data-framer-component-type],
          [style*="transform"],
          [style*="opacity"] {
            transform: none !important;
            opacity: 1 !important;
          }
          /* Belt-and-suspenders: remove any leftover min-height on the paper */
          .resume-paper { min-height: 0 !important; }
          /* Prevent individual entries from splitting mid-page */
          .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
          /* Prevent orphan/widow lines at page breaks */
          p, li { orphans: 2; widows: 2; }
          /* Keep section labels with their first entry */
          h1, h2, h3, h4 { break-after: avoid; page-break-after: avoid; }
        }
      `}</style>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
