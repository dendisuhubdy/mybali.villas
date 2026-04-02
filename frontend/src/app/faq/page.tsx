'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FAQ_DATA, FAQCategory } from '@/lib/faq-data';

function FAQAccordion({ item }: { item: { question: string; answer: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-base font-medium text-gray-900">
          {item.question}
        </span>
        <svg
          className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-sm leading-relaxed text-gray-600">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQSection({ category }: { category: FAQCategory }) {
  return (
    <div id={category.slug}>
      <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
      <div className="mt-4">
        {category.items.map((item) => (
          <FAQAccordion key={item.question} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-700 py-16 sm:py-20">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            Everything you need to know about buying, renting, and investing in
            Bali property.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-4">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="sticky top-24">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Categories
                </h3>
                <ul className="mt-4 space-y-2">
                  {FAQ_DATA.map((category) => (
                    <li key={category.slug}>
                      <a
                        href={`#${category.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary-600"
                      >
                        {category.title}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-xl bg-primary-50 p-5">
                  <h4 className="font-semibold text-primary-900">
                    Still have questions?
                  </h4>
                  <p className="mt-2 text-sm text-primary-700">
                    Our team is happy to help with any specific questions about
                    Bali property.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Contact Us
                  </Link>
                </div>
              </nav>
            </div>

            {/* FAQ Content */}
            <div className="space-y-12 lg:col-span-3">
              {FAQ_DATA.map((category) => (
                <FAQSection key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to Start Your Bali Property Journey?
          </h2>
          <p className="mt-3 text-gray-500">
            Browse our verified listings or speak with our local experts today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/properties" className="btn-primary !px-8 !py-3">
              Browse Properties
            </Link>
            <Link href="/blog" className="btn-outline !px-8 !py-3">
              Read Our Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
