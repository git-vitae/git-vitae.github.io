import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ExternalLink, RefreshCw } from "lucide-react";
import bundledChangelog from "../../CHANGELOG.md?raw";

const CHANGELOG_URL =
  "https://raw.githubusercontent.com/git-vita/git-vita.github.io/main/CHANGELOG.md";
const CACHE_KEY = "gitvita-changelog-v2";

interface Props {
  open: boolean;
  onClose: () => void;
}

// ── Inline bold/code parser ────────────────────────────────────────────────────
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`\n]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={i} className="text-primary bg-secondary px-1 rounded text-[11px] font-mono">{part.slice(1, -1)}</code>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ── Changelog renderer ─────────────────────────────────────────────────────────
function ChangelogBody({ text }: { text: string }) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let listBuf: string[] = [];
  let nodeKey = 0;

  function flushList() {
    if (!listBuf.length) return;
    nodes.push(
      <ul key={nodeKey++} className="space-y-1.5 mb-4 pl-0 list-none">
        {listBuf.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
            <span><Inline text={b} /></span>
          </li>
        ))}
      </ul>
    );
    listBuf = [];
  }

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith("# ")) {
      flushList();
      nodes.push(
        <h1 key={nodeKey++} className="text-xl font-serif font-medium text-foreground mb-1">
          <Inline text={line.slice(2)} />
        </h1>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      nodes.push(
        <h2 key={nodeKey++} className="text-base font-semibold text-foreground mt-7 mb-3 pb-2 border-b border-border">
          <Inline text={line.slice(3)} />
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      nodes.push(
        <h3 key={nodeKey++} className="text-[11px] font-mono font-semibold text-primary uppercase tracking-widest mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listBuf.push(line.slice(2));
    } else if (line.trim() === "---") {
      flushList();
      nodes.push(<hr key={nodeKey++} className="border-border my-5" />);
    } else if (line.trim()) {
      flushList();
      nodes.push(
        <p key={nodeKey++} className="text-sm text-muted-foreground leading-relaxed mb-3">
          <Inline text={line} />
        </p>
      );
    }
  }
  flushList();
  return <>{nodes}</>;
}

// ── Hook ───────────────────────────────────────────────────────────────────────
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

// ── Modal ──────────────────────────────────────────────────────────────────────
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
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm no-print"
          />
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
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View on GitHub <ExternalLink size={11} />
                </a>
                <button onClick={onClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ChangelogBody text={md} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
