'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blog-data';

export default function BlogPage() {
  const [category, setCategory] = useState('all');

  const filteredPosts =
    category === 'all'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === category);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-700 py-16 sm:py-20">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Bali Property Blog & Guides
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            Expert insights on buying, investing, and living in Bali. Your
            essential resource for property decisions.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {category === 'all' && (
            <Link
              href={`/blog/${BLOG_POSTS[0].slug}`}
              className="group mt-8 grid overflow-hidden rounded-2xl border border-gray-200 bg-white sm:grid-cols-2"
            >
              <div className="aspect-[16/9] overflow-hidden sm:aspect-auto">
                <img
                  src={BLOG_POSTS[0].image}
                  alt={BLOG_POSTS[0].title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <span className="inline-flex w-fit rounded-md bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700">
                  {BLOG_CATEGORIES.find((c) => c.value === BLOG_POSTS[0].category)?.label}
                </span>
                <h2 className="mt-3 text-2xl font-bold text-gray-900 group-hover:text-primary-600">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="mt-3 text-gray-500">{BLOG_POSTS[0].excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
                  <span>{BLOG_POSTS[0].author}</span>
                  <span>&middot;</span>
                  <span>{BLOG_POSTS[0].read_time} min read</span>
                  <span>&middot;</span>
                  <span>
                    {new Date(BLOG_POSTS[0].published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Posts Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(category === 'all' ? filteredPosts.slice(1) : filteredPosts).map(
              (post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-primary-300 hover:shadow-md"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {BLOG_CATEGORIES.find((c) => c.value === post.category)?.label}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <span>{post.read_time} min read</span>
                      <span>&middot;</span>
                      <span>
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>

          {filteredPosts.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-500">
                No articles found in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
