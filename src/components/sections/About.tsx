import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe } from 'lucide-react';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(48, 0.8, 0.12);

const LEVEL_STYLE: Record<string, string> = {
  native: 'bg-primary text-primary-foreground border-primary',
  fluent: 'bg-primary/15 text-primary border-primary/30',
  conversational: 'bg-secondary text-foreground border-border',
  professional: 'bg-secondary text-foreground border-border',
  basic: 'bg-secondary/60 text-muted-foreground border-border',
  elementary: 'bg-secondary/60 text-muted-foreground border-border',
};

function levelStyle(level: string) {
  return (
    LEVEL_STYLE[level.toLowerCase()] ??
    'bg-secondary text-foreground border-border'
  );
}

// ── Animated counter card ───────────────────────────────────────────────────

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function StatCard({
  stat,
  delay,
}: {
  stat: {
    label: string;
    value: number | string;
    prefix?: string;
    suffix?: string;
  };
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState<number | string>(
    typeof stat.value === 'number' ? 0 : stat.value
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || typeof stat.value !== 'number') return;

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated) return;
        setHasAnimated(true);
        observer.disconnect();

        const target = stat.value as number;
        const duration = 1600; // ms
        let start: number | null = null;

        const step = (timestamp: number) => {
          if (start === null) start = timestamp;
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          setDisplayed(Math.round(easeOutQuart(progress) * target));
          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, stat.value]);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="border-border bg-card card-hover rounded-2xl border p-6"
      data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <p className="gradient-text mb-2 font-serif text-4xl font-light">
        {stat.prefix ?? ''}
        {displayed}
        {stat.suffix ?? ''}
      </p>
      <p className="text-muted-foreground text-xs tracking-wide">
        {stat.label}
      </p>
    </motion.div>
  );
}

// ── About section ───────────────────────────────────────────────────────────

export function About() {
  const ref = useRef<HTMLElement>(null);

  const hasLanguages = config.languages && config.languages.length > 0;

  const stats =
    config.stats.length > 0
      ? config.stats.slice(0, 4)
      : [
          { label: 'Years Experience', value: 5, prefix: '', suffix: '+' },
          { label: 'Projects Shipped', value: 20, prefix: '', suffix: '+' },
          {
            label: 'Technologies',
            value: config.skills.reduce((acc, s) => acc + s.items.length, 0),
            prefix: '',
            suffix: '+',
          },
          {
            label: 'Cups of Coffee',
            value: '∞' as unknown as number,
            prefix: '',
            suffix: '',
          },
        ];

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden px-6 py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left col */}
          <div>
            <motion.p
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
            >
              About Me
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="section-heading text-foreground mb-6 text-4xl leading-tight md:text-5xl"
            >
              The person behind
              <br />
              <em className="font-light not-italic">the keyboard.</em>
            </motion.h2>
            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="mb-8 h-px w-12"
              style={{
                background:
                  'linear-gradient(90deg, hsl(var(--primary)), transparent)',
              }}
            />
            <motion.p
              variants={fadeUp}
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="text-muted-foreground text-base leading-relaxed font-light whitespace-pre-line"
            >
              {config.about}
            </motion.p>

            {config.email && (
              <motion.a
                variants={fadeUp}
                custom={4}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                href={`mailto:${config.email}`}
                className="text-primary mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
                data-testid="link-email"
              >
                <Mail size={14} />
                {config.email}
              </motion.a>
            )}

            {hasLanguages && (
              <motion.div
                variants={fadeUp}
                custom={5}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="border-border mt-8 border-t pt-6"
              >
                <div className="text-muted-foreground mb-3 flex items-center gap-1.5 font-mono text-xs font-medium tracking-widest uppercase">
                  <Globe size={12} />
                  Languages
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.languages.map((lang) => (
                    <span
                      key={lang.name}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${levelStyle(lang.level)}`}
                    >
                      {lang.name}
                      <span className="font-normal opacity-60">·</span>
                      <span className="font-normal opacity-75">
                        {lang.level}
                      </span>
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right col — animated stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
