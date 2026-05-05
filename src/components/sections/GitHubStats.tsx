import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Users, BookOpen, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';
import { useGitHubStats } from '@/hooks/useGitHubStats';

const fadeUp = fadeUpVariants(40, 0.7, 0.1);

// ── Language colour map ────────────────────────────────────────────────────────

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  R: '#198CE7',
  Vue: '#41B883',
  Svelte: '#ff3e00',
};

function langColor(name: string): string {
  return LANG_COLORS[name] ?? 'hsl(var(--primary))';
}

// ── Animated counter ───────────────────────────────────────────────────────────

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplayed(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return <span ref={ref}>{displayed.toLocaleString()}</span>;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-muted/50 animate-pulse rounded ${className ?? ''}`} />
  );
}

// ── Section ────────────────────────────────────────────────────────────────────

export function GitHubStats() {
  const githubUrl = (config.social as Record<string, string>)?.github ?? '';
  const { data, loading, error } = useGitHubStats(githubUrl);

  if (!githubUrl || githubUrl.includes('yourusername')) return null;
  if (error === 'not-found') return null;

  const stats = data
    ? [
        { icon: Star, label: 'Stars earned', value: data.totalStars },
        { icon: Users, label: 'Followers', value: data.followers },
        { icon: BookOpen, label: 'Public repos', value: data.publicRepos },
      ]
    : [];

  return (
    <section id="github" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Open source
        </motion.p>
        <div className="mb-14 flex flex-wrap items-start justify-between gap-4">
          <motion.h2
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="section-heading text-foreground text-4xl md:text-5xl"
          >
            GitHub Activity
          </motion.h2>
          {data && (
            <motion.a
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              href={data.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <FaGithub size={16} />
              View profile
              <ExternalLink size={12} />
            </motion.a>
          )}
        </div>

        {/* Stat cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="border-border bg-background rounded-2xl border p-8"
                >
                  <Skeleton className="mb-3 h-10 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))
            : stats.map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  custom={i + 3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  className="group border-border bg-background hover:bg-primary/5 hover:border-primary/30 rounded-2xl border p-8 transition-colors duration-300"
                >
                  <Icon
                    size={18}
                    className="text-primary mb-4 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="text-foreground mb-2 text-4xl leading-none font-bold tabular-nums md:text-5xl">
                    <Counter value={value} />
                  </div>
                  <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                    {label}
                  </p>
                </motion.div>
              ))}
        </div>

        {/* Language breakdown */}
        {(loading || (data && data.topLanguages.length > 0)) && (
          <motion.div
            variants={fadeUp}
            custom={6}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="border-border bg-background rounded-2xl border p-8"
          >
            <p className="text-muted-foreground mb-6 font-mono text-xs font-medium tracking-widest uppercase">
              Top languages
            </p>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 flex-1 rounded-full" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data!.topLanguages.map(({ name, percentage }, i) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="flex items-center gap-4"
                  >
                    <span
                      className="min-w-[7rem] text-sm font-medium"
                      style={{ color: langColor(name) }}
                    >
                      {name}
                    </span>
                    <div className="bg-secondary h-1.5 flex-1 overflow-hidden rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.07 + 0.15,
                          duration: 0.7,
                          ease: 'easeOut',
                        }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: langColor(name) }}
                      />
                    </div>
                    <span className="text-muted-foreground w-8 text-right text-xs tabular-nums">
                      {percentage}%
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Rate-limit notice */}
        {error === 'rate-limited' && (
          <p className="text-muted-foreground mt-6 text-center text-sm">
            GitHub API rate limit reached — stats will appear on next load.
          </p>
        )}
      </div>
    </section>
  );
}
