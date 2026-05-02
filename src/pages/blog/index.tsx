import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, ArrowLeft, Rss } from "lucide-react";
import { allPosts, allTags } from "@/lib/blog";
import { config } from "@/portfolio.config";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function BlogListPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts;

  const blogTitle       = config.blog?.title       ?? "Blog";
  const blogDescription = config.blog?.description ?? "Thoughts, stories and ideas.";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border/60">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="#/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} />
            Back to portfolio
          </a>
          <a
            href="#/blog"
            className="flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-primary"
          >
            <Rss size={13} />
            {blogTitle}
          </a>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-foreground mb-3">
            {blogTitle}
          </h1>
          <p className="text-muted-foreground text-base">{blogDescription}</p>
        </motion.div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeTag === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  activeTag === tag
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        {/* Posts */}
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts found.</p>
        ) : (
          <div className="space-y-8">
            {filtered.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.45 }}
              >
                <a
                  href={`#/blog/${post.slug}`}
                  className="group block p-6 rounded-2xl border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all"
                >
                  {/* Cover image */}
                  {post.cover && (
                    <div className="mb-4 rounded-xl overflow-hidden aspect-[2/1]">
                      <img
                        src={post.cover}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[11px] font-medium"
                        >
                          <Tag size={9} />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-serif font-medium text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {post.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {formatDate(post.date)}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock size={11} />
                      {post.readingTime} min read
                    </span>
                    <span className="ml-auto text-primary text-xs font-medium group-hover:underline">
                      Read →
                    </span>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        )}

        {/* Empty blog hint */}
        {allPosts.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-4xl mb-4">✍️</p>
            <p className="text-muted-foreground text-sm">
              No posts yet. Add a <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-foreground text-xs">.md</span> file
              to your <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-foreground text-xs">blog/</span> folder to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
