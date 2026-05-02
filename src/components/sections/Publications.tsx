import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { config } from "@/portfolio.config";
import { fadeUpVariants } from "@/lib/animation";

const fadeUp = fadeUpVariants(44, 0.75, 0.12);

const TYPE_LABELS: Record<string, string> = {
  journal:        "Journal",
  conference:     "Conference",
  preprint:       "Preprint",
  "book-chapter": "Book Chapter",
  workshop:       "Workshop",
};

export function Publications() {
  const pubs = config.publications ?? [];
  if (!pubs.length) return null;

  return (
    <section id="publications" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4"
        >
          Research
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="section-heading text-4xl md:text-5xl text-foreground mb-14"
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
              viewport={{ once: true, margin: "-60px" }}
              className="group relative p-6 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">

                  {/* Type badge + venue row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {pub.type && (
                      <span className="text-[10px] font-mono font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/20 text-primary bg-primary/5">
                        {TYPE_LABELS[pub.type] ?? pub.type}
                      </span>
                    )}
                    {(pub.venue || pub.year) && (
                      <span className="text-xs text-muted-foreground font-medium">
                        {pub.venue}{pub.year ? ` · ${pub.year}` : ""}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
                    {pub.url ? (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pub.title}
                      </a>
                    ) : pub.title}
                  </h3>

                  {/* Authors */}
                  {pub.authors && (
                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1 leading-relaxed">
                      <BookOpen size={11} className="flex-shrink-0 opacity-60" />
                      {pub.authors}
                    </p>
                  )}

                  {/* Tags */}
                  {(pub.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {pub.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground"
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
                    className="flex-shrink-0 mt-0.5 p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100"
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
