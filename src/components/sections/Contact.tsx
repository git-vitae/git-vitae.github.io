import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Send,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { config } from '@/portfolio.config';
import { ShareModal } from '@/components/ShareModal';
import { ChangelogModal } from '@/components/ChangelogModal';
import { fadeUpVariants } from '@/lib/animation';

const fadeUp = fadeUpVariants(40, 0.75, 0.12);

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const [shareOpen, setShareOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const hasEndpoint = !!config.contactFormEndpoint;
  const contactHeading = config.contactHeading ?? 'Get In Touch';
  const contactTitle = config.contactTitle ?? 'Let’s work\ntogether.';
  const contactDescription =
    config.contactDescription ??
    'Open to new opportunities. Whether you have a role in mind or just want to connect — my inbox is always open.';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;

    if (!hasEndpoint) {
      const subject = encodeURIComponent(`Message from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.open(`mailto:${config.email}?subject=${subject}&body=${body}`);
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(config.contactFormEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <footer
      id="contact"
      className="border-border/60 bg-card/30 border-t px-6 py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-10 text-center">
          {/* Heading */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="text-primary mb-4 font-mono text-xs font-medium tracking-widest uppercase">
              {contactHeading}
            </p>
            <h2 className="section-heading text-foreground mb-5 text-4xl leading-tight md:text-6xl">
              {contactTitle.split('\n').map((line, index) =>
                index === 1 ? (
                  <em key={index} className="font-light italic not-italic">
                    {line}
                  </em>
                ) : (
                  <span key={index}>
                    {line}
                    {index === 0 && contactTitle.includes('\n') ? <br /> : null}
                  </span>
                )
              )}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md leading-relaxed font-light">
              {contactDescription}
            </p>
          </motion.div>

          {/* Contact form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex w-full max-w-lg flex-col gap-3 text-left"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 flex-col gap-1.5">
                <label
                  htmlFor="contact-name"
                  className="text-muted-foreground text-xs font-medium tracking-wide"
                >
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/40 focus:border-primary/40 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-1 focus:outline-none"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label
                  htmlFor="contact-email"
                  className="text-muted-foreground text-xs font-medium tracking-wide"
                >
                  Your email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/40 focus:border-primary/40 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-1 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-message"
                className="text-muted-foreground text-xs font-medium tracking-wide"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your project or opportunity…"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary/40 focus:border-primary/40 w-full resize-none rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-1 focus:outline-none"
              />
            </div>

            {status === 'success' && (
              <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                <CheckCircle size={16} className="shrink-0" />
                Message sent! I&rsquo;ll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                Something went wrong — please try emailing directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Send size={15} />
              {status === 'sending'
                ? 'Sending…'
                : hasEndpoint
                  ? 'Send message'
                  : 'Open in email app'}
            </button>
            {!hasEndpoint && (
              <p className="text-muted-foreground text-center text-xs">
                Opens your email client with the message pre-filled.{' '}
                <a
                  href={`mailto:${config.email}`}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  Or email directly →
                </a>
              </p>
            )}
          </motion.form>

          {/* Quick links */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href={`mailto:${config.email}`}
              className="bg-secondary border-border text-foreground hover:border-primary/40 hover:bg-primary/5 flex items-center gap-2.5 rounded-2xl border px-6 py-3 text-sm font-medium tracking-wide transition-all"
              data-testid="link-contact-email"
            >
              <Mail size={15} />
              {config.email}
            </a>
            {config.phone && (
              <a
                href={`tel:${config.phone.replace(/\s/g, '')}`}
                className="border-border text-foreground hover:bg-secondary hover:border-primary/40 flex items-center gap-2.5 rounded-2xl border px-6 py-3 text-sm font-medium tracking-wide transition-all"
                data-testid="link-contact-phone"
              >
                <Phone size={15} />
                {config.phone}
              </a>
            )}
          </motion.div>

          {/* Social icons */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex items-center gap-3"
          >
            {config.social.github && (
              <a
                href={config.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 rounded-xl border p-3 transition-all"
                aria-label="GitHub"
                data-testid="link-footer-github"
              >
                <FaGithub size={18} />
              </a>
            )}
            {config.social.linkedin && (
              <a
                href={config.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 rounded-xl border p-3 transition-all"
                aria-label="LinkedIn"
                data-testid="link-footer-linkedin"
              >
                <FaLinkedin size={18} />
              </a>
            )}
            {config.social.twitter && (
              <a
                href={config.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 rounded-xl border p-3 transition-all"
                aria-label="Twitter"
                data-testid="link-footer-twitter"
              >
                <FaXTwitter size={18} />
              </a>
            )}
          </motion.div>

          {/* Resume / share actions */}
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={config.resumeUrl}
              download={config.resumeFileName}
              className="border-border text-foreground hover:bg-secondary hover:border-primary/40 flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all"
              data-testid="button-download-resume-footer"
            >
              <Download size={14} />
              Download Resume
            </a>
            <button
              onClick={() => setShareOpen(true)}
              className="border-border text-foreground hover:bg-secondary hover:border-primary/40 flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all"
              data-testid="button-share-resume-footer"
            >
              <Share2 size={14} />
              Share Portfolio
            </button>
          </motion.div>

          <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />

          {/* Footer credit */}
          <motion.div
            variants={fadeUp}
            custom={5}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="border-border/60 w-full border-t pt-8 text-center"
          >
            <p className="text-muted-foreground font-mono text-xs tracking-wide">
              Built with{' '}
              <a
                href="https://github.com/git-vitae/git-vitae.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                GitVitae
              </a>{' '}
              &mdash; fork and make it yours.
            </p>
            <button
              onClick={() => setChangelogOpen(true)}
              className="text-muted-foreground/60 hover:text-primary no-print mt-2 inline-flex items-center gap-1.5 text-[11px] transition-colors"
            >
              <Sparkles size={10} />
              What's new in v1.3
            </button>
          </motion.div>

          <ChangelogModal
            open={changelogOpen}
            onClose={() => setChangelogOpen(false)}
          />
        </div>
      </div>
    </footer>
  );
}
