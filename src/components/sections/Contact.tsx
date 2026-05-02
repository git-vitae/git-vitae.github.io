import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Download, Share2, CheckCircle } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { config } from "@/portfolio.config";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}${config.resumeUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${config.name} - Resume`, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer id="contact" className="py-32 px-6 border-t border-border/60 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center flex flex-col items-center gap-8">
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

          <motion.a
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            href={`mailto:${config.email}`}
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-medium text-sm tracking-wide hover:opacity-90 transition-opacity"
            data-testid="link-contact-email"
          >
            <Mail size={16} />
            {config.email}
          </motion.a>

          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex items-center gap-3"
          >
            {config.social.github && (
              <a
                href={config.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
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
                className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
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
                className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                aria-label="Twitter"
                data-testid="link-footer-twitter"
              >
                <FaXTwitter size={18} />
              </a>
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={3}
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
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-all"
              data-testid="button-share-resume-footer"
            >
              {copied ? (
                <>
                  <CheckCircle size={14} className="text-green-500" />
                  Link Copied
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  Share Resume
                </>
              )}
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="pt-8 border-t border-border/60 w-full text-center"
          >
            <p className="text-xs text-muted-foreground font-mono tracking-wide">
              Built with{" "}
              <a
                href="https://github.com/gitvita"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-2"
              >
                GitVita
              </a>{" "}
              &mdash; fork and make it yours.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
