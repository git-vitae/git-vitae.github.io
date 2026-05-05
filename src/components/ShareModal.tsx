import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Copy, CheckCircle, Download, Mail, QrCode, Link2 } from 'lucide-react';
import { FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { config } from '@/portfolio.config';
import QRCodeLib from 'qrcode';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

function CopyButton({
  text,
  label,
  copiedLabel = 'Copied!',
  compact = false,
}: {
  text: string;
  label: string;
  copiedLabel?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`border-border hover:bg-secondary hover:border-primary/40 flex items-center gap-1.5 rounded-lg border font-medium transition-all ${
        compact
          ? 'w-full justify-between px-2.5 py-1.5 text-[11px]'
          : 'px-3 py-1.5 text-xs'
      }`}
    >
      <span className="truncate">{copied ? copiedLabel : label}</span>
      {copied ? (
        <CheckCircle size={11} className="flex-shrink-0 text-green-500" />
      ) : (
        <Copy size={11} className="text-muted-foreground flex-shrink-0" />
      )}
    </button>
  );
}

export function ShareModal({ open, onClose }: ShareModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copyLinkDone, setCopyLinkDone] = useState(false);

  const portfolioUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname.replace(/\/$/, '') || '/'}`
      : '';

  const pageTitle = `${config.name} — ${config.title}`;

  useEffect(() => {
    if (!open || !portfolioUrl) return;
    QRCodeLib.toDataURL(portfolioUrl, {
      width: 240,
      margin: 2,
      color: { dark: '#111111', light: '#ffffff' },
    }).then(setQrDataUrl);
  }, [open, portfolioUrl]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(portfolioUrl);
    setCopyLinkDone(true);
    setTimeout(() => setCopyLinkDone(false), 2000);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${config.name.replace(/\s+/g, '-')}-qr.png`;
    a.click();
  };

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my portfolio 👋`)}&url=${encodeURIComponent(portfolioUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`${config.name}'s Portfolio`)}&body=${encodeURIComponent(`Hi,\n\nCheck out my portfolio:\n${portfolioUrl}`)}`;

  const emailSignature = [
    `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;color:#333333;">`,
    `  <tr><td style="padding-bottom:2px;"><strong>${config.name}</strong></td></tr>`,
    `  <tr><td style="color:#666666;padding-bottom:2px;">${config.title}</td></tr>`,
    config.location
      ? `  <tr><td style="color:#666666;padding-bottom:6px;">${config.location}</td></tr>`
      : '',
    `  <tr><td><a href="${portfolioUrl}" style="color:#6366f1;text-decoration:none;">🌐 Portfolio</a>${config.email ? ` &nbsp;·&nbsp; <a href="mailto:${config.email}" style="color:#6366f1;text-decoration:none;">${config.email}</a>` : ''}</td></tr>`,
    `</table>`,
  ]
    .filter(Boolean)
    .join('\n');

  const embedCode = `<iframe\n  src="${portfolioUrl}"\n  width="100%"\n  height="700"\n  style="border:none;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.08);"\n  title="${pageTitle}"\n></iframe>`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Share your portfolio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto pr-1 pb-1">
          {/* ── Portfolio link ─────────────────────────── */}
          <div>
            <p className="text-muted-foreground mb-2 flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase">
              <Link2 size={11} /> Portfolio link
            </p>
            <div className="bg-secondary border-border flex items-center gap-2 rounded-xl border px-3 py-2.5">
              <span className="text-foreground flex-1 truncate font-mono text-xs">
                {portfolioUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="hover:bg-background flex-shrink-0 rounded-lg p-1.5 transition-colors"
                aria-label="Copy link"
              >
                {copyLinkDone ? (
                  <CheckCircle size={14} className="text-green-500" />
                ) : (
                  <Copy size={14} className="text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* ── Social share ───────────────────────────── */}
          <div>
            <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
              Share on
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
              >
                <FaLinkedin size={13} /> LinkedIn
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border hover:bg-foreground/5 flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all"
              >
                <FaXTwitter size={13} /> Twitter / X
              </a>
              <a
                href={emailUrl}
                className="border-border hover:bg-secondary hover:border-primary/40 flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all"
              >
                <Mail size={13} /> Email
              </a>
            </div>
          </div>

          {/* ── QR Code ────────────────────────────────── */}
          <div>
            <p className="text-muted-foreground mb-2 flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase">
              <QrCode size={11} /> QR code
            </p>
            <div className="bg-secondary border-border flex items-center gap-4 rounded-xl border p-3">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Portfolio QR Code"
                  className="h-20 w-20 flex-shrink-0 rounded-lg"
                />
              ) : (
                <div className="bg-muted h-20 w-20 flex-shrink-0 animate-pulse rounded-lg" />
              )}
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Put this on your business card, LinkedIn banner, or conference
                  badge.
                </p>
                <button
                  onClick={downloadQR}
                  disabled={!qrDataUrl}
                  className="border-border hover:bg-background hover:border-primary/40 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40"
                >
                  <Download size={12} /> Download PNG
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase">
              <Mail size={11} /> Email signature
            </p>
            <div className="bg-secondary border-border rounded-xl border p-3">
              <div className="bg-background border-border/60 mb-2.5 rounded-lg border p-2.5 text-xs">
                <div className="text-foreground font-semibold">
                  {config.name}
                </div>
                <div className="text-muted-foreground">{config.title}</div>
                {config.location && (
                  <div className="text-muted-foreground">{config.location}</div>
                )}
                <a
                  href={portfolioUrl}
                  className="text-primary"
                  onClick={(e) => e.preventDefault()}
                >
                  🌐 Portfolio
                </a>
              </div>
              <CopyButton text={emailSignature} label="Copy HTML" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
