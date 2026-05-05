import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { config } from '@/portfolio.config';
import type { Testimonial } from '@/portfolio.config';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(36, 0.7, 0.1);

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index + 2}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      data-testid={`testimonial-${index}`}
      className="border-border bg-card card-hover flex flex-col gap-5 rounded-2xl border p-7"
    >
      {/* Quote mark */}
      <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
        <Quote size={16} />
      </div>

      {/* Quote text */}
      <blockquote className="text-foreground flex-1 font-serif text-lg leading-relaxed font-light">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Attribution */}
      <div className="border-border flex items-center gap-3 border-t pt-2">
        {t.photoUrl ? (
          <img
            src={t.photoUrl}
            alt={t.name}
            className="bg-secondary h-10 w-10 shrink-0 rounded-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const fallback = e.currentTarget
                .nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Initials fallback */}
        <div
          className={`bg-primary/15 text-primary h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            t.photoUrl ? 'hidden' : 'flex'
          }`}
        >
          {t.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">
            {t.name}
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {t.title}
            {t.company ? ` · ${t.company}` : ''}
          </p>
        </div>

        {t.relationship && (
          <span className="text-muted-foreground bg-secondary border-border ml-auto shrink-0 rounded-full border px-2.5 py-1 font-mono text-xs whitespace-nowrap">
            {t.relationship}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  if (!config.testimonials || config.testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase"
        >
          Testimonials
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="section-heading text-foreground mb-10 text-4xl md:text-5xl"
        >
          What People Say
        </motion.h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {config.testimonials.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
