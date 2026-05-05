import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(36, 0.7, 0.12);

export function Education() {
  if (!config.education || config.education.length === 0) return null;

  return (
    <section id="education" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Education
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-10 text-4xl md:text-5xl"
        >
          Academic Background
        </motion.h2>

        <div className="flex flex-col gap-4">
          {config.education.map((edu, i) => (
            <motion.div
              key={`${edu.institution}-${i}`}
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="border-border bg-card card-hover flex items-center gap-6 rounded-2xl border p-6"
              data-testid={`education-${i}`}
            >
              <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <GraduationCap size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-foreground font-serif text-xl font-light">
                  {edu.degree}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-sm tracking-wide">
                  {edu.institution}
                </p>
              </div>
              <span className="text-muted-foreground bg-secondary border-border shrink-0 rounded-full border px-3 py-1 font-mono text-xs whitespace-nowrap">
                {edu.period}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
