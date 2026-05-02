import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ExternalLink, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import bundledChangelog from "../../CHANGELOG.md?raw";

const CHANGELOG_URL =
  "https://raw.githubusercontent.com/git-vita/git-vita.github.io/main/CHANGELOG.md";
const CACHE_KEY = "gitvita-changelog-v2";

interface Props {
  open: boolean;
  onClose: () => void;
}

function useChangelog(open: boolean) {
  const [md, setMd]               = useState<string>(bundledChangelog);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) { setMd(cached); return; }

    setRefreshing(true);
    fetch(CHANGELOG_URL)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((text) => { sessionStorage.setItem(CACHE_KEY, text); setMd(text); })
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }, [open]);

  return { md, refreshing };
}

export function ChangelogModal({ open, onClose }: Props) {
  const { md, refreshing } = useChangelog(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm no-print"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-50 flex flex-col bg-background border border-border rounded-2xl shadow-2xl overflow-hidden no-print"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">What's new in GitVita</span>
                {refreshing && <RefreshCw size={11} className="text-muted-foreground animate-spin" />}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/git-vita/git-vita.github.io/blob/main/CHANGELOG.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Full changelog
                  <ExternalLink size={11} />
                </a>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="prose-blog">
                <ReactMarkdown>{md}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
