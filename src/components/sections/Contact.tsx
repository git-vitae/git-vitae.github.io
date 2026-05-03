import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send, Download, Share2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { config } from "@/portfolio.config";
import { ShareModal } from "@/components/ShareModal";
import { ChangelogModal } from "@/components/ChangelogModal";
import { fadeUpVariants } from "@/lib/animation";

const fadeUp = fadeUpVariants(40, 0.75, 0.12);

type FormStatus = "idle" | "sending" | "success" | "error";

export function Contact() {
  const [shareOpen, setShareOpen]       = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const hasEndpoint = !!config.contactFormEndpoint;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;

    if (!hasEndpoint) {
      const subject = encodeURIComponent(`Message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.open(`mailto:${config.email}?subject=${subject}&body=${body}`);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(config.contactFormEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer id="contact" className="py-32 px-6 border-t border-border/60 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center flex flex-col items-center gap-10">

          {/* Heading */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="text-xs font-mono font-medium tracking-widest text-primary uppercase mb-4">
              Get In Touch
            </p>
            <h2 className="section-heading text-4xl md:text-6xl text-foreground mb-5 leading-tight">
              Let&rsquo;s work
              <br />
              <em className="not-italic font-light italic">together.</em>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto font-light leading-relaxed">
              Open to new opportunities. Whether you have a role in mind or just
              want to connect — my inbox is always open.
            </p>
          </motion.div>

          {/* Contact form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="w-full max-w-lg flex flex-col gap-3 text-left"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="contact-name" className="text-xs font-medium text-muted-foreground tracking-wide">
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="contact-email" className="text-xs font-medium text-muted-foreground tracking-wide">
                  Your email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className="text-xs font-medium text-muted-foreground tracking-wide">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your project or opportunity…"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-colors resize-none"
              />
            </div>

            {status === "success" && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle size={16} className="shrink-0" />
                Message sent! I&rsquo;ll get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                Something went wrong — please try emailing directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Send size={15} />
              {status === "sending"
                ? "Sending…"
                : hasEndpoint
                ? "Send message"
                : "Open in email app"}
            </button>
            {!hasEndpoint && (
              <p className="text-xs text-muted-foreground text-center">
                Opens your email client with the message pre-filled.{" "}
                <a href={`mailto:${config.email}`} className="text-primary hover:underline underline-offset-2">
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
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <a
              href={`mailto:${config.email}`}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-secondary border border-border text-foreground font-medium text-sm tracking-wide hover:border-primary/40 hover:bg-primary/5 transition-all"
              data-testid="link-contact-email"
            >
              <Mail size={15} />
              {config.email}
            </a>
            {config.phone && (
              <a
                href={`tel:${config.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 px-6 py-3 rounded-2xl border border-border text-foreground font-medium text-sm tracking-wide hover:bg-secondary hover:border-primary/40 transition-all"
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
            viewport={{ once: true, margin: "-60px" }}
            className="flex items-center gap-3"
          >
            {config.social.github && (
              <a href={config.social.github} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                aria-label="GitHub" data-testid="link-footer-github">
                <FaGithub size={18} />
              </a>
            )}
            {config.social.linkedin && (
              <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                aria-label="LinkedIn" data-testid="link-footer-linkedin">
                <FaLinkedin size={18} />
              </a>
            )}
            {config.social.twitter && (
              <a href={config.social.twitter} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                aria-label="Twitter" data-testid="link-footer-twitter">
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
            viewport={{ once: true, margin: "-60px" }}
            className="flex items-center gap-3 flex-wrap justify-center"
          >
            <a
              href={config.resumeUrl}
              download={config.resumeFileName}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-all"
              data-testid="button-download-resume-footer"
            >
              <Download size={14} />
              Download Resume
            </a>
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-all"
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
            viewport={{ once: true, margin: "-40px" }}
            className="pt-8 border-t border-border/60 w-full text-center"
          >
            <p className="text-xs text-muted-foreground font-mono tracking-wide">
              Built with{" "}
              <a href="https://github.com/git-vitae/git-vitae.github.io" target="_blank" rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-2">
                GitVitae
              </a>{" "}
              &mdash; fork and make it yours.
            </p>
            <button
              onClick={() => setChangelogOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/60 hover:text-primary transition-colors no-print"
            >
              <Sparkles size={10} />
              What's new in v1.3
            </button>
          </motion.div>

          <ChangelogModal open={changelogOpen} onClose={() => setChangelogOpen(false)} />

        </div>
      </div>
    </footer>
  );
}
