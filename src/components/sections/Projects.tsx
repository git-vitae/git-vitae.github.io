import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(44, 0.75, 0.12);

export function Projects() {
  const featured = config.projects.filter((p) => p.featured);
  const others = config.projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="bg-secondary/20 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Work
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-14 text-4xl md:text-5xl"
        >
          Featured Projects
        </motion.h2>

        {/* Featured — large cards */}
        <div className="mb-14 grid gap-6 md:grid-cols-2">
          {featured.map((project, i) => (
            <motion.div
              key={project.name}
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="group border-border bg-card card-hover flex flex-col gap-4 rounded-2xl border p-7"
              data-testid={`project-featured-${i}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-foreground group-hover:text-primary font-serif text-2xl font-light transition-colors">
                  {project.name}
                </h3>
                <div className="flex shrink-0 gap-2">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-2 transition-all"
                      aria-label="GitHub repo"
                      data-testid={`link-repo-${project.name.toLowerCase()}`}
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-2 transition-all"
                      aria-label="Live project"
                      data-testid={`link-live-${project.name.toLowerCase()}`}
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground flex-1 text-sm leading-relaxed font-light">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground border-border rounded-md border px-2.5 py-1 font-mono text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other projects */}
        {others.length > 0 && (
          <>
            <motion.h3
              variants={fadeUp}
              custom={featured.length + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="text-muted-foreground mb-6 font-mono text-xs font-medium tracking-widest uppercase"
            >
              Other Projects
            </motion.h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((project, i) => (
                <motion.div
                  key={project.name}
                  variants={fadeUp}
                  custom={i + featured.length + 3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="group border-border bg-card card-hover flex flex-col gap-3 rounded-xl border p-5"
                  data-testid={`project-other-${i}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-foreground group-hover:text-primary font-serif text-lg font-light transition-colors">
                      {project.name}
                    </h4>
                    <div className="flex gap-1">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
                          aria-label="GitHub"
                        >
                          <Github size={14} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground rounded-md p-1.5 transition-colors"
                          aria-label="Live"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground flex-1 text-xs leading-relaxed font-light">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 font-mono text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
