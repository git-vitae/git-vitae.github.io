import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import bundledChangelog from '../../CHANGELOG.md?raw';

const CHANGELOG_URL =
  'https://raw.githubusercontent.com/git-vitae/git-vitae.github.io/main/CHANGELOG.md';
const CACHE_KEY = 'gitvitae-changelog-v1';

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
        if (part.startsWith('**') && part.endsWith('**'))
          return (
            <strong key={i} className="text-foreground font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        if (part.startsWith('`') && part.endsWith('`'))
          return (
            <code
              key={i}
              className="text-primary bg-secondary rounded px-1 font-mono text-[11px]"
            >
              {part.slice(1, -1)}
            </code>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ── Changelog renderer ─────────────────────────────────────────────────────────
function ChangelogBody({ text }: { text: string }) {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let listBuf: string[] = [];
  let nodeKey = 0;

  function flushList() {
    if (!listBuf.length) return;
    nodes.push(
      <ul key={nodeKey++} className="mb-4 list-none space-y-1.5 pl-0">
        {listBuf.map((b, i) => (
          <li
            key={i}
            className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
          >
            <span className="bg-primary/40 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            <span>
              <Inline text={b} />
            </span>
          </li>
        ))}
      </ul>
    );
    listBuf = [];
  }

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith('# ')) {
      flushList();
      nodes.push(
        <h1
          key={nodeKey++}
          className="text-foreground mb-1 font-serif text-xl font-medium"
        >
          <Inline text={line.slice(2)} />
        </h1>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      nodes.push(
        <h2
          key={nodeKey++}
          className="text-foreground border-border mt-7 mb-3 border-b pb-2 text-base font-semibold"
        >
          <Inline text={line.slice(3)} />
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      nodes.push(
        <h3
          key={nodeKey++}
          className="text-primary mt-4 mb-2 font-mono text-[11px] font-semibold tracking-widest uppercase"
        >
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      listBuf.push(line.slice(2));
    } else if (line.trim() === '---') {
      flushList();
      nodes.push(<hr key={nodeKey++} className="border-border my-5" />);
    } else if (line.trim()) {
      flushList();
      nodes.push(
        <p
          key={nodeKey++}
          className="text-muted-foreground mb-3 text-sm leading-relaxed"
        >
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
  const [md, setMd] = useState<string>(bundledChangelog);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setMd(cached);
      return;
    }

    setRefreshing(true);
    fetch(CHANGELOG_URL)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((text) => {
        sessionStorage.setItem(CACHE_KEY, text);
        setMd(text);
      })
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

    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="no-print fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="changelog-title"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-background border-border no-print fixed inset-x-4 top-[5vh] bottom-[5vh] z-50 flex flex-col overflow-hidden rounded-2xl border shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2"
          >
            {/* Header */}
            <div className="border-border flex shrink-0 items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-primary" />
                <span
                  id="changelog-title"
                  className="text-foreground text-sm font-semibold"
                >
                  What's new in GitVitae
                </span>
                {refreshing && (
                  <RefreshCw
                    size={11}
                    className="text-muted-foreground animate-spin"
                  />
                )}
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/git-vitae/git-vitae.github.io/blob/main/CHANGELOG.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                >
                  View on GitHub <ExternalLink size={11} />
                </a>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-1.5 transition-all"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="overscroll-behavior-y-contain min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <ChangelogBody text={md} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
