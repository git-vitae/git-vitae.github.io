import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(36, 0.7, 0.1);

export function Certifications() {
  if (!config.certifications || config.certifications.length === 0) return null;

  return (
    <section id="certifications" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Certifications
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-10 text-4xl md:text-5xl"
        >
          Credentials & Badges
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {config.certifications.map((cert, i) => (
            <motion.div
              key={`${cert.title}-${i}`}
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              data-testid={`certification-${i}`}
              className="group border-border bg-card card-hover relative flex flex-col gap-4 rounded-2xl border p-6"
            >
              {/* Badge image or fallback icon */}
              <div className="flex items-start gap-4">
                {cert.badgeUrl ? (
                  <img
                    src={cert.badgeUrl}
                    alt={`${cert.title} badge`}
                    className="bg-secondary h-14 w-14 shrink-0 rounded-xl object-contain p-1"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      (e.currentTarget as HTMLImageElement).style.display =
                        'none';
                      const fallback = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}

                {/* Fallback icon — shown when no badgeUrl or image fails */}
                <div
                  className={`bg-primary/10 text-primary h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                    cert.badgeUrl ? 'hidden' : 'flex'
                  }`}
                >
                  <Award size={24} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-foreground text-sm leading-snug font-medium">
                    {cert.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {cert.tags && cert.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cert.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-border bg-secondary text-muted-foreground rounded-full border px-2 py-0.5 font-mono text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer — date + credential link */}
              <div className="border-border mt-auto flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground font-mono text-xs">
                  {cert.date}
                </span>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-1 text-xs hover:underline"
                  >
                    Verify <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
