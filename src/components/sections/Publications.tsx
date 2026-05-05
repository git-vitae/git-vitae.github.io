import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import { config } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(44, 0.75, 0.12);

const TYPE_LABELS: Record<string, string> = {
  journal: 'Journal',
  conference: 'Conference',
  preprint: 'Preprint',
  'book-chapter': 'Book Chapter',
  workshop: 'Workshop',
};

export function Publications() {
  const pubs = config.publications ?? [];
  if (!pubs.length) return null;

  return (
    <section id="publications" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Research
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-14 text-4xl md:text-5xl"
        >
          Publications
        </motion.h2>

        <div className="space-y-4">
          {pubs.map((pub, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="group border-border bg-background hover:border-primary/30 hover:shadow-primary/5 relative rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* Type badge + venue row */}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {pub.type && (
                      <span className="border-primary/20 text-primary bg-primary/5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest uppercase">
                        {TYPE_LABELS[pub.type] ?? pub.type}
                      </span>
                    )}
                    {(pub.venue || pub.year) && (
                      <span className="text-muted-foreground text-xs font-medium">
                        {pub.venue}
                        {pub.year ? ` · ${pub.year}` : ''}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-foreground group-hover:text-primary mb-1.5 text-base leading-snug font-semibold transition-colors">
                    {pub.url ? (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pub.title}
                      </a>
                    ) : (
                      pub.title
                    )}
                  </h3>

                  {/* Authors */}
                  {pub.authors && (
                    <p className="text-muted-foreground mb-3 flex items-center gap-1 text-xs leading-relaxed">
                      <BookOpen
                        size={11}
                        className="flex-shrink-0 opacity-60"
                      />
                      {pub.authors}
                    </p>
                  )}

                  {/* Tags */}
                  {(pub.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {pub.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-secondary border-border text-muted-foreground rounded-full border px-2 py-0.5 text-[10px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* External link icon */}
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 mt-0.5 flex-shrink-0 rounded-lg border p-2 opacity-0 transition-all group-hover:opacity-100"
                    aria-label="Open publication"
                  >
                    <ExternalLink size={14} />
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
