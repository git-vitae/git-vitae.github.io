import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { config } from "@/portfolio.config";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Certifications() {
  if (!config.certifications || config.certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4"
        >
          Certifications
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="section-heading text-4xl md:text-5xl text-foreground mb-10"
        >
          Credentials & Badges
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.certifications.map((cert, i) => (
            <motion.div
              key={`${cert.title}-${i}`}
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              data-testid={`certification-${i}`}
              className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card card-hover"
            >
              {/* Badge image or fallback icon */}
              <div className="flex items-start gap-4">
                {cert.badgeUrl ? (
                  <img
                    src={cert.badgeUrl}
                    alt={`${cert.title} badge`}
                    className="w-14 h-14 rounded-xl object-contain shrink-0 bg-secondary p-1"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* Fallback icon — shown when no badgeUrl or image fails */}
                <div
                  className={`w-14 h-14 rounded-xl bg-primary/10 text-primary items-center justify-center shrink-0 ${
                    cert.badgeUrl ? "hidden" : "flex"
                  }`}
                >
                  <Award size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{cert.issuer}</p>
                </div>
              </div>

              {/* Tags */}
              {cert.tags && cert.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cert.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-mono rounded-full border border-border bg-secondary text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer — date + credential link */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                <span className="font-mono text-xs text-muted-foreground">
                  {cert.date}
                </span>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
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
