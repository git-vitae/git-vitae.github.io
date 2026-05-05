import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, GitFork } from 'lucide-react';

const DISMISS_KEY = 'gitvitae-demo-dismissed';

interface DemoBannerProps {
  onDismiss: () => void;
}

export function DemoBanner({ onDismiss }: DemoBannerProps) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === '1'
  );

  if (import.meta.env.VITE_DEMO_MODE !== 'true') return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
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
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 right-0 left-0 z-[70] flex h-10 items-center justify-center gap-3 bg-zinc-900 px-4 text-[11px] font-medium text-zinc-100 select-none dark:bg-zinc-800 print:hidden"
        >
          <GitFork size={12} className="shrink-0 opacity-70" />

          <span className="hidden opacity-80 sm:inline">
            Live demo of{' '}
            <span className="font-semibold text-white">GitVitae</span> — a free,
            open-source portfolio template.
          </span>
          <span className="font-semibold text-white opacity-80 sm:hidden">
            GitVitae demo
          </span>

          <a
            href="https://github.com/git-vitae/git-vitae.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-widest whitespace-nowrap uppercase transition-colors hover:bg-white/20"
          >
            Use this template →
          </a>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss demo banner"
            className="absolute right-3 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
