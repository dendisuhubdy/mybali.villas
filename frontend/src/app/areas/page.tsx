import type { Metadata } from 'next';
import Link from 'next/link';
import { AREAS } from '@/lib/areas-data';

export const metadata: Metadata = {
  title: 'Bali Areas Guide',
  description:
    'Explore Bali\'s best areas for property investment and living. Detailed guides for Canggu, Ubud, Seminyak, Uluwatu, and more.',
};

export default function AreasPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-700 py-16 sm:py-20">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Explore Bali&apos;s Best Areas
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            Discover the unique character, lifestyle, and investment potential of
            each area across the island.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-custom">
          {/* Featured Areas - Top 4 */}
          <div className="grid gap-6 sm:grid-cols-2">
            {AREAS.slice(0, 4).map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-[16/9] transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={area.image}
                    alt={area.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {area.propertyCount} properties
                    </span>
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-white drop-shadow-md sm:text-3xl">
                    {area.name}
                  </h2>
                  <p className="mt-1 text-sm text-white/80">{area.tagline}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-white/70">
                    {area.description.slice(0, 150)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* All Areas Grid */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">All Areas</h2>
            <p className="mt-2 text-gray-500">
              From bustling tourist hubs to serene countryside retreats
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {AREAS.map((area) => (
                <Link
                  key={area.slug}
                  href={`/areas/${area.slug}`}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-primary-300 hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={area.image}
                      alt={area.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                        {area.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {area.propertyCount} listings
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{area.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
