import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Mail } from "lucide-react";
import { config } from "@/portfolio.config";

interface OpenToWorkBannerProps {
  onDismiss: () => void;
}

export function OpenToWorkBanner({ onDismiss }: OpenToWorkBannerProps) {
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
          className="fixed top-0 left-0 right-0 z-[60] h-10 flex items-center justify-center gap-3 px-4 bg-primary text-primary-foreground text-xs font-medium tracking-wide select-none print:hidden"
        >
          {/* Pulsing availability dot */}
          <span className="relative flex items-center shrink-0">
            <span className="absolute inline-flex h-2 w-2 rounded-full bg-primary-foreground opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
          </span>

          <span className="uppercase tracking-widest font-semibold text-[11px]">
            Open to opportunities
          </span>

          <span className="hidden sm:inline text-primary-foreground/50">·</span>

          <span className="hidden sm:inline text-primary-foreground/75 text-[11px]">
            Available for full-time roles &amp; freelance projects
          </span>

          {/* CTA */}
          <a
            href={`mailto:${config.email}?subject=Opportunity for ${config.name}`}
            className="ml-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25 border border-primary-foreground/20 transition-colors font-semibold text-[11px] uppercase tracking-widest whitespace-nowrap"
          >
            <Mail size={11} />
            Get in touch
          </a>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="absolute right-3 p-1.5 rounded-full hover:bg-primary-foreground/15 transition-colors text-primary-foreground/60 hover:text-primary-foreground"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
