import { useState, useEffect, useRef } from 'react';
import { Download, MapPin, Phone, ArrowDown } from 'lucide-react';
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { motion, useScroll, useTransform } from 'framer-motion';
import { config } from '@/portfolio.config';

function Avatar() {
  if (config.avatarUrl) {
    return (
      <img
        src={config.avatarUrl}
        alt={config.name}
        className="ring-primary/30 h-28 w-28 rounded-2xl object-cover ring-2"
        fetchPriority="high"
        loading="eager"
        data-testid="img-avatar"
      />
    );
  }
  const initials = config.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="text-primary-foreground ring-primary/30 flex h-28 w-28 items-center justify-center rounded-2xl font-serif text-3xl font-bold ring-2"
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--primary)), hsl(250 84% 80%))',
      }}
      data-testid="div-avatar-initials"
    >
      {initials}
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 38);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <p className="text-muted-foreground max-w-xl text-base leading-relaxed font-light tracking-wide md:text-lg">
      {displayed}
      {!done && (
        <span className="bg-primary ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle" />
      )}
    </p>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const blobY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16"
    >
      {/* Parallax dot-grid */}
      <motion.div
        style={{
          y: gridY,
          backgroundImage:
            'radial-gradient(hsl(var(--primary) / 0.11) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20"
      />

      {/* Parallax glow blob */}
      <motion.div
        style={{
          y: blobY,
          background:
            'radial-gradient(ellipse, hsl(var(--primary)), transparent 70%)',
        }}
        className="pointer-events-none absolute top-1/3 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15 blur-3xl"
      />

      {/* Main content — drifts up & fades as you scroll */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 text-center"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Avatar />
        </motion.div>

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="flex flex-col items-center gap-3"
        >
          {config.openToWork && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium tracking-wide text-green-600 uppercase dark:text-green-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Open to opportunities
            </span>
          )}

          <h1 className="text-foreground font-serif text-6xl leading-none font-light tracking-tight md:text-8xl">
            {config.name.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'italic' : ''}>
                {i > 0 ? ' ' : ''}
                {word}
              </span>
            ))}
          </h1>

          <p className="text-primary mt-1 text-sm font-medium tracking-[0.22em] uppercase">
            {config.title}
          </p>

          {config.tagline && <TypewriterText text={config.tagline} />}

          {(config.location || config.phone) && (
            <p className="text-muted-foreground mt-1 flex flex-wrap items-center justify-center gap-3 text-xs font-medium tracking-wider uppercase">
              {config.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  {config.location}
                </span>
              )}
              {config.location && config.phone && (
                <span className="opacity-30">·</span>
              )}
              {config.phone && (
                <a
                  href={`tel:${config.phone.replace(/\s/g, '')}`}
                  className="hover:text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <Phone size={12} />
                  {config.phone}
                </a>
              )}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {config.social.github && (
            <a
              href={config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 rounded-xl border p-2.5 transition-all"
              aria-label="GitHub"
              data-testid="link-github"
            >
              <FaGithub size={18} />
            </a>
          )}
          {config.social.linkedin && (
            <a
              href={config.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 rounded-xl border p-2.5 transition-all"
              aria-label="LinkedIn"
              data-testid="link-linkedin"
            >
              <FaLinkedin size={18} />
            </a>
          )}
          {config.social.twitter && (
            <a
              href={config.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 rounded-xl border p-2.5 transition-all"
              aria-label="Twitter"
              data-testid="link-twitter"
            >
              <FaXTwitter size={18} />
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="bg-primary text-primary-foreground rounded-xl px-7 py-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-90"
            data-testid="button-view-work"
          >
            View My Work
          </a>
          <a
            href="#/resume"
            className="border-primary/40 text-primary hover:bg-primary/5 flex items-center gap-2 rounded-xl border px-7 py-3 text-sm font-medium tracking-wide transition-all"
            data-testid="button-view-resume"
          >
            <Download size={14} />
            View Resume
          </a>
        </motion.div>
      </motion.div>

      {/* Arrow fades out as soon as you start scrolling */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ opacity: arrowOpacity }}
        transition={{ duration: 0.5, delay: 1.2 }}
        onClick={() =>
          document
            .querySelector('#about')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
        className="text-muted-foreground hover:text-foreground absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce rounded-full p-2 transition-colors"
        aria-label="Scroll down"
        data-testid="button-scroll-down"
      >
        <ArrowDown size={18} />
      </motion.button>
    </section>
  );
}
