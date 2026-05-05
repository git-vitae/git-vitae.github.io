import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { getPost, allPosts } from '@/lib/blog';

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface BlogPostPageProps {
  slug: string;
}

export function BlogPostPage({ slug }: BlogPostPageProps) {
  const post = useMemo(() => getPost(slug), [slug]);

  const related = useMemo(() => {
    if (!post || post.tags.length === 0) return [];
    return allPosts
      .filter(
        (p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t))
      )
      .sort((a, b) => {
        const aScore = a.tags.filter((t) => post.tags.includes(t)).length;
        const bScore = b.tags.filter((t) => post.tags.includes(t)).length;
        return bScore !== aScore
          ? bScore - aScore
          : b.date.localeCompare(a.date);
      })
      .slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-5xl">📄</p>
        <h1 className="text-foreground font-serif text-xl">Post not found</h1>
        <a href="#/blog" className="text-primary text-sm hover:underline">
          ← Back to blog
        </a>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Top bar */}
      <div className="bg-background/85 border-border/60 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <a
            href="#/blog"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft size={15} />
            All posts
          </a>
          <a
            href="#/"
            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            Portfolio →
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-6 pt-28 pb-24">
        {/* Cover */}
        {post.cover && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 aspect-[2/1] overflow-hidden rounded-2xl"
          >
            <img
              src={post.cover}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="mb-4 flex flex-wrap gap-1.5"
          >
            {post.tags.map((t) => (
              <span
                key={t}
                className="bg-accent text-accent-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                <Tag size={10} />
                {t}
              </span>
            ))}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-foreground mb-4 font-serif text-3xl leading-tight font-medium sm:text-4xl"
        >
          {post.title}
        </motion.h1>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="text-muted-foreground border-border mb-10 flex items-center gap-4 border-b pb-8 text-xs"
        >
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
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="prose-blog"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Related posts */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="border-border mt-16 border-t pt-10"
          >
            <p className="text-primary mb-5 font-mono text-xs font-medium tracking-widest uppercase">
              You might also enjoy
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <a
                  key={p.slug}
                  href={`#/blog/${p.slug}`}
                  className="group border-border hover:border-primary/30 hover:bg-secondary/30 block rounded-xl border p-4 transition-all"
                >
                  {p.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {p.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="bg-accent text-accent-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        >
                          <Tag size={8} />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-foreground group-hover:text-primary mb-2 line-clamp-2 font-serif text-sm leading-snug font-medium transition-colors">
                    {p.title}
                  </p>
                  <div className="text-muted-foreground flex items-center gap-3 text-[11px]">
                    {p.date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(p.date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {p.readingTime} min
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-border mt-10 flex items-center justify-between border-t pt-8"
        >
          <a
            href="#/blog"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            All posts
          </a>
          <a
            href="#/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Back to portfolio →
          </a>
        </motion.div>
      </main>
    </div>
  );
}
