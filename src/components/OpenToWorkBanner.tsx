import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { config } from '@/portfolio.config';

interface OpenToWorkBannerProps {
  onDismiss: () => void;
  topOffset?: number;
}

export function OpenToWorkBanner({
  onDismiss,
  topOffset = 0,
}: OpenToWorkBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!config.openToWork) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ top: topOffset }}
          className="bg-primary text-primary-foreground fixed right-0 left-0 z-[60] flex h-10 items-center justify-center gap-3 px-4 text-xs font-medium tracking-wide select-none print:hidden"
        >
          <span className="relative flex shrink-0 items-center">
            <span className="bg-primary-foreground absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-70" />
            <span className="bg-primary-foreground relative inline-flex h-2 w-2 rounded-full" />
          </span>

          <span className="text-[11px] font-semibold tracking-widest uppercase">
            Open to opportunities
          </span>

          <span className="text-primary-foreground/50 hidden sm:inline">·</span>

          <span className="text-primary-foreground/75 hidden text-[11px] sm:inline">
            Available for full-time roles &amp; freelance projects
          </span>

          <a
            href={`mailto:${config.email}?subject=Opportunity for ${config.name}`}
            className="bg-primary-foreground/15 hover:bg-primary-foreground/25 border-primary-foreground/20 ml-1 flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-widest whitespace-nowrap uppercase transition-colors"
          >
            <Mail size={11} />
            Get in touch
          </a>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="hover:bg-primary-foreground/15 text-primary-foreground/60 hover:text-primary-foreground absolute right-3 rounded-full p-1.5 transition-colors"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
