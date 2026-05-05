import { motion } from 'framer-motion';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(40, 0.7, 0.1);

const LEVEL_DOTS: Record<string, number> = {
  native: 4,
  fluent: 3,
  conversational: 2,
  basic: 1,
};

const LEVEL_LABEL: Record<string, string> = {
  native: 'Native',
  fluent: 'Fluent',
  conversational: 'Conversational',
  basic: 'Basic',
};

function ProficiencyDots({ level }: { level: string }) {
  const key = level.toLowerCase();
  const filled = LEVEL_DOTS[key] ?? 1;
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`${level} proficiency`}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i < filled ? 'bg-primary' : 'bg-border'
          }`}
        />
      ))}
    </div>
  );
}

export function Languages() {
  const langs = config.languages ?? [];
  if (langs.length === 0) return null;

  return (
    <section id="languages" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Communication
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-14 text-4xl md:text-5xl"
        >
          Languages
        </motion.h2>

        <div className="flex flex-wrap gap-4">
          {langs.map((lang, i) => {
            const levelKey = lang.level.toLowerCase();
            return (
              <motion.div
                key={lang.name}
                variants={fadeUp}
                custom={i + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="border-border bg-card hover:border-primary/30 hover:bg-primary/5 group flex items-center gap-5 rounded-2xl border px-6 py-5 transition-all"
                data-testid={`language-${lang.name.toLowerCase()}`}
              >
                <div>
                  <p className="text-foreground mb-1 text-sm font-semibold">
                    {lang.name}
                  </p>
                  <p className="text-muted-foreground text-xs tracking-wide">
                    {LEVEL_LABEL[levelKey] ?? lang.level}
                  </p>
                </div>
                <ProficiencyDots level={lang.level} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
