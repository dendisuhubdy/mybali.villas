import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about MyBaliVilla - Bali\'s trusted property platform helping you find the perfect villa, house, or investment in paradise.',
};

const team = [
  {
    name: 'Local Market Experts',
    role: 'On-the-ground knowledge',
    description:
      'Our team of local agents have deep expertise in Bali\'s property market, from zoning regulations to the best neighborhoods for investment.',
  },
  {
    name: 'Legal Advisory',
    role: 'Transaction security',
    description:
      'We work with experienced notaries and lawyers to ensure every transaction is transparent, legally compliant, and secure.',
  },
  {
    name: 'Concierge Team',
    role: 'Guest experience',
    description:
      'Our concierge team ensures guests enjoy an unforgettable Bali experience, from airport transfers to in-villa dining arrangements.',
  },
];

const stats = [
  { label: 'Properties Listed', value: '1,500+' },
  { label: 'Areas Covered', value: '16' },
  { label: 'Happy Clients', value: '2,000+' },
  { label: 'Years of Experience', value: '10+' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-700 py-16 sm:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-5xl">
              Your Trusted Partner in Bali Property
            </h1>
            <p className="mt-6 text-lg text-primary-100">
              MyBaliVilla connects property seekers with verified listings across
              Bali&apos;s most desirable locations. We combine local expertise with
              modern technology to make your property journey seamless.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-8 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white p-6 text-center shadow-lg"
              >
                <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our Story</h2>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                MyBaliVilla was born from a simple frustration: finding reliable,
                verified property listings in Bali was far too difficult. With
                scattered information, unclear pricing, and limited transparency,
                the property search process needed a better solution.
              </p>
              <p>
                We built MyBaliVilla to be the platform we wished existed when we
                first started exploring Bali&apos;s property market. Every listing on
                our platform is verified by our local team, with accurate pricing,
                high-quality imagery, and comprehensive property details.
              </p>
              <p>
                Today, we serve thousands of property seekers from around the world
                -- from first-time villa renters to seasoned investors building
                portfolios across the island. Whether you&apos;re looking for a
                beachfront villa in Seminyak, a jungle retreat in Ubud, or
                development land in Tabanan, our platform and team are here to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">What Sets Us Apart</h2>
            <p className="mt-3 text-gray-500">
              We go beyond just listing properties
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Verified Listings</h3>
              <p className="mt-2 text-sm text-gray-500">
                Every property is personally inspected and verified by our team.
                No fake listings, no misleading photos, no surprises.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Local Expertise</h3>
              <p className="mt-2 text-sm text-gray-500">
                Our team knows Bali inside and out. From zoning regulations to
                emerging neighborhoods, we provide expert guidance.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Secure Transactions</h3>
              <p className="mt-2 text-sm text-gray-500">
                We facilitate transparent, legally compliant transactions with
                trusted notaries and legal professionals.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Concierge Service</h3>
              <p className="mt-2 text-sm text-gray-500">
                Complimentary concierge services with every booking -- from airport
                transfers to in-villa spa arrangements.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No Hidden Fees</h3>
              <p className="mt-2 text-sm text-gray-500">
                Transparent pricing with no hidden booking fees. We are paid by
                property owners, not guests.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">7-Day Support</h3>
              <p className="mt-2 text-sm text-gray-500">
                Our team is available 7 days a week via WhatsApp, email, and phone
                to assist with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our Team</h2>
            <p className="mt-3 text-gray-500">
              A dedicated team of professionals making your Bali property dreams a reality
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
                  <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-primary-600">{member.role}</p>
                <p className="mt-2 text-sm text-gray-500">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Find Your Bali Property?
          </h2>
          <p className="mt-4 text-primary-100">
            Browse our verified listings or get in touch with our team today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/properties" className="btn-secondary !px-8 !py-3">
              Browse Properties
            </Link>
            <Link href="/contact" className="btn-white !px-8 !py-3">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
