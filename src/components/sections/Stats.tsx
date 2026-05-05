import { useEffect, useRef } from 'react';
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
  useInView,
} from 'framer-motion';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(40, 0.7, 0.1);

// ─── Animated counter ─────────────────────────────────────────────────────────

function Counter({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) =>
    Math.round(v).toLocaleString()
  );
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, value, {
      duration: 2,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [isInView, value, motionVal]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      {prefix && (
        <span className="text-primary mr-0.5 text-2xl font-bold md:text-3xl">
          {prefix}
        </span>
      )}
      <motion.span>{display}</motion.span>
      {suffix && (
        <span className="text-primary ml-0.5 text-2xl font-bold md:text-3xl">
          {suffix}
        </span>
      )}
    </span>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Stats() {
  const stats = config.stats ?? [];
  if (!stats.length) return null;

  return (
    <section id="stats" className="bg-secondary/20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          By the numbers
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-14 text-4xl md:text-5xl"
        >
          At a Glance
        </motion.h2>

        <div
          className={`divide-border border-border grid gap-0 divide-y overflow-hidden rounded-2xl border md:divide-x md:divide-y-0 ${
            stats.length <= 2
              ? 'md:grid-cols-2'
              : stats.length === 3
                ? 'md:grid-cols-3'
                : 'md:grid-cols-4'
          }`}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="group bg-background hover:bg-primary/5 flex flex-col items-center justify-center px-8 py-10 text-center transition-colors duration-300"
            >
              <div className="text-foreground group-hover:text-primary mb-2 text-4xl leading-none font-bold tabular-nums transition-colors duration-300 md:text-5xl">
                <Counter
                  value={stat.value}
                  prefix={stat.prefix ?? ''}
                  suffix={stat.suffix ?? ''}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs font-medium tracking-widest uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
