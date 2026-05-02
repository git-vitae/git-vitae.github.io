import { useRef, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Mail, Globe } from "lucide-react";
import { config } from "@/portfolio.config";
import { fadeUpVariants } from "@/lib/animation";

const fadeUp = fadeUpVariants(48, 0.8, 0.12);

const LEVEL_STYLE: Record<string, string> = {
  native:         "bg-primary text-primary-foreground border-primary",
  fluent:         "bg-primary/15 text-primary border-primary/30",
  conversational: "bg-secondary text-foreground border-border",
  professional:   "bg-secondary text-foreground border-border",
  basic:          "bg-secondary/60 text-muted-foreground border-border",
  elementary:     "bg-secondary/60 text-muted-foreground border-border",
};

function levelStyle(level: string) {
  return LEVEL_STYLE[level.toLowerCase()] ?? "bg-secondary text-foreground border-border";
}

// ── Animated counter card ───────────────────────────────────────────────────

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function StatCard({
  stat,
  delay,
}: {
  stat: { label: string; value: number | string; prefix?: string; suffix?: string };
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState<number | string>(
    typeof stat.value === "number" ? 0 : stat.value,
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || typeof stat.value !== "number") return;

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated) return;
        setHasAnimated(true);
        observer.disconnect();

        const target   = stat.value as number;
        const duration = 1600; // ms
        let start: number | null = null;

        const step = (timestamp: number) => {
          if (start === null) start = timestamp;
          const elapsed  = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          setDisplayed(Math.round(easeOutQuart(progress) * target));
          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, stat.value]);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="p-6 rounded-2xl border border-border bg-card card-hover"
      data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <p className="text-4xl font-serif font-light gradient-text mb-2">
        {stat.prefix ?? ""}
        {displayed}
        {stat.suffix ?? ""}
      </p>
      <p className="text-xs text-muted-foreground tracking-wide">{stat.label}</p>
    </motion.div>
  );
}

// ── About section ───────────────────────────────────────────────────────────

export function About() {
  const ref = useRef<HTMLElement>(null);
  useScroll({ target: ref, offset: ["start end", "end start"] });

  const hasLanguages = config.languages && config.languages.length > 0;

  const stats =
    config.stats.length > 0
      ? config.stats.slice(0, 4)
      : [
          { label: "Years Experience", value: 5,  prefix: "", suffix: "+" },
          { label: "Projects Shipped", value: 20, prefix: "", suffix: "+" },
          {
            label: "Technologies",
            value: config.skills.reduce((acc, s) => acc + s.items.length, 0),
            prefix: "",
            suffix: "+",
          },
          { label: "Cups of Coffee", value: "∞" as unknown as number, prefix: "", suffix: "" },
        ];

  return (
    <section id="about" ref={ref} className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left col */}
          <div>
            <motion.p
              variants={fadeUp} custom={0}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4"
            >
              About Me
            </motion.p>
            <motion.h2
              variants={fadeUp} custom={1}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="section-heading text-4xl md:text-5xl text-foreground mb-6 leading-tight"
            >
              The person behind
              <br />
              <em className="not-italic font-light">the keyboard.</em>
            </motion.h2>
            <motion.div
              variants={fadeUp} custom={2}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="w-12 h-px mb-8"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), transparent)" }}
            />
            <motion.p
              variants={fadeUp} custom={3}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-base text-muted-foreground leading-relaxed whitespace-pre-line font-light"
            >
              {config.about}
            </motion.p>

            {config.email && (
              <motion.a
                variants={fadeUp} custom={4}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                href={`mailto:${config.email}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                data-testid="link-email"
              >
                <Mail size={14} />
                {config.email}
              </motion.a>
            )}

            {hasLanguages && (
              <motion.div
                variants={fadeUp} custom={5}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="mt-8 pt-6 border-t border-border"
              >
                <div className="flex items-center gap-1.5 text-xs font-mono font-medium tracking-widest text-muted-foreground uppercase mb-3">
                  <Globe size={12} />
                  Languages
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.languages.map((lang) => (
                    <span
                      key={lang.name}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${levelStyle(lang.level)}`}
                    >
                      {lang.name}
                      <span className="opacity-60 font-normal">·</span>
                      <span className="font-normal opacity-75">{lang.level}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right col — animated stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i + 1} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
