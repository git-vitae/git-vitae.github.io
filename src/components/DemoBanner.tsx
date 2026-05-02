import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, GitFork } from "lucide-react";

const DISMISS_KEY = "gitvitae-demo-dismissed";

interface DemoBannerProps {
  onDismiss: () => void;
}

export function DemoBanner({ onDismiss }: DemoBannerProps) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "1"
  );

  if (import.meta.env.VITE_DEMO_MODE !== "true") return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
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
          className="fixed top-0 left-0 right-0 z-[70] h-10 flex items-center justify-center gap-3 px-4 bg-zinc-900 dark:bg-zinc-800 text-zinc-100 text-[11px] font-medium select-none print:hidden"
        >
          <GitFork size={12} className="shrink-0 opacity-70" />

          <span className="opacity-80 hidden sm:inline">
            Live demo of <span className="font-semibold text-white">GitVitae</span>
            {" "}— a free, open-source portfolio template.
          </span>
          <span className="opacity-80 sm:hidden font-semibold text-white">GitVitae demo</span>

          <a
            href="https://github.com/gitvitae/gitvitae.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-colors font-semibold text-[11px] uppercase tracking-widest whitespace-nowrap"
          >
            Use this template →
          </a>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss demo banner"
            className="absolute right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
