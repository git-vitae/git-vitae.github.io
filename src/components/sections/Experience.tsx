import { motion } from 'framer-motion';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(40, 0.75, 0.13);

export function Experience() {
  return (
    <section id="experience" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Career
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-14 text-4xl md:text-5xl"
        >
          Work Experience
        </motion.h2>

        <div className="relative">
          <div className="from-primary/40 via-border absolute top-2 bottom-2 left-0 hidden w-px bg-gradient-to-b to-transparent sm:block md:left-8" />

          <div className="flex flex-col gap-10">
            {config.experience.map((job, i) => (
              <motion.div
                key={`${job.company}-${i}`}
                variants={fadeUp}
                custom={i + 2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="relative sm:pl-24"
                data-testid={`experience-${i}`}
              >
                {/* Timeline dot */}
                <div className="bg-background border-primary/50 absolute top-6 left-4 hidden h-8 w-8 items-center justify-center rounded-full border-2 sm:flex">
                  <div className="bg-primary h-2 w-2 rounded-full" />
                </div>

                <div className="border-border bg-card card-hover rounded-2xl border p-7">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-foreground font-serif text-2xl font-light">
                        {job.role}
                      </h3>
                      <p className="text-primary mt-0.5 text-sm font-medium tracking-wide">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-muted-foreground bg-secondary border-border rounded-full border px-3 py-1 font-mono text-xs whitespace-nowrap">
                      {job.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed font-light">
                    {job.description}
                  </p>
                  {job.highlights && job.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.highlights.map((h) => (
                        <span
                          key={h}
                          className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2.5 py-1 text-xs font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
