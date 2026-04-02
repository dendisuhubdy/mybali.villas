'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  variant?: 'footer' | 'standalone';
}

export default function NewsletterSignup({ variant = 'footer' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // For now, simulate subscription success
    // TODO: Connect to backend newsletter endpoint
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus('success');
    setEmail('');

    setTimeout(() => setStatus('idle'), 4000);
  };

  if (variant === 'standalone') {
    return (
      <div className="rounded-2xl bg-primary-700 p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Stay Updated on Bali Properties
          </h2>
          <p className="mt-3 text-primary-100">
            Subscribe to receive new listings, market insights, and investment tips
            delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 sm:max-w-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-gray-100 disabled:opacity-60"
            >
              {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && (
            <p className="mt-3 text-sm text-green-300">
              You have been subscribed successfully!
            </p>
          )}
          <p className="mt-4 text-xs text-primary-200">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    );
  }

  // Footer variant
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
        Newsletter
      </h3>
      <p className="mt-3 text-sm text-gray-400">
        Get new listings and market insights in your inbox.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex-shrink-0 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-500 disabled:opacity-60"
          >
            {status === 'loading' ? '...' : status === 'success' ? 'Done!' : 'Subscribe'}
          </button>
        </div>
      </form>
    </div>
  );
}
