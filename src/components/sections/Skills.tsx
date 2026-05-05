import { motion } from 'framer-motion';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(40, 0.7, 0.1);

export function Skills() {
  return (
    <section id="skills" className="bg-secondary/20 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Toolbox
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-14 text-4xl md:text-5xl"
        >
          Skills &amp; Technologies
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {config.skills.map((group, i) => (
            <motion.div
              key={group.category}
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="border-border bg-card rounded-2xl border p-6"
              data-testid={`skills-group-${group.category.toLowerCase()}`}
            >
              <p className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase">
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill, j) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.06 + j * 0.04,
                      ease: 'easeOut',
                    }}
                    className="bg-secondary text-secondary-foreground border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary cursor-default rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
                    data-testid={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
