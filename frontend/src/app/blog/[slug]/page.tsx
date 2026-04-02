import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blog-data';
import NewsletterSignup from '@/components/NewsletterSignup';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  ).slice(0, 3);

  const categoryLabel = BLOG_CATEGORIES.find(
    (c) => c.value === post.category
  )?.label;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="py-12 sm:py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="text-center">
              <span className="inline-flex rounded-md bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                {categoryLabel}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-gray-500">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-400">
                <span>{post.author}</span>
                <span>&middot;</span>
                <span>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>&middot;</span>
                <span>{post.read_time} min read</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mt-10 overflow-hidden rounded-2xl">
              <img
                src={post.image}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-primary mx-auto mt-10 max-w-none">
              {post.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={i} className="mt-8 text-2xl font-bold text-gray-900">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={i} className="mt-6 text-xl font-semibold text-gray-900">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <p key={i} className="font-semibold text-gray-900">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter((l) => l.startsWith('- '));
                  return (
                    <ul key={i} className="list-disc pl-6 space-y-1">
                      {items.map((item, j) => (
                        <li key={j} className="text-gray-600">
                          {item.replace(/^- (\[.\] )?/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d\. /)) {
                  const items = paragraph.split('\n').filter((l) => l.match(/^\d/));
                  return (
                    <ol key={i} className="list-decimal pl-6 space-y-1">
                      {items.map((item, j) => (
                        <li key={j} className="text-gray-600">
                          {item.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={i} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Share / Tags */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Share:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - https://mybali.villas/blog/' + post.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#25D366] hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  &larr; Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-12">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600">
                      {related.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {related.read_time} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-12">
        <div className="container-custom">
          <NewsletterSignup variant="standalone" />
        </div>
      </section>
    </div>
  );
}
