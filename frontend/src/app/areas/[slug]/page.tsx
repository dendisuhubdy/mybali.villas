import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { getAreaBySlug, AREAS } from '@/lib/areas-data';
import { getProperties, MOCK_PROPERTIES } from '@/lib/api';
import { Property } from '@/lib/types';

interface AreaDetailPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: AreaDetailPageProps): Promise<Metadata> {
  const area = getAreaBySlug(params.slug);
  if (!area) return { title: 'Area Not Found' };
  return {
    title: `${area.name} - Properties & Area Guide`,
    description: area.description.slice(0, 160),
  };
}

async function fetchAreaProperties(slug: string): Promise<Property[]> {
  try {
    const response = await getProperties({ area: slug, per_page: 6 });
    return response.data.items;
  } catch {
    return MOCK_PROPERTIES.filter(
      (p) => p.area.toLowerCase().replace(/\s+/g, '-') === slug
    ).slice(0, 6);
  }
}

export default async function AreaDetailPage({ params }: AreaDetailPageProps) {
  const area = getAreaBySlug(params.slug);
  if (!area) notFound();

  const properties = await fetchAreaProperties(params.slug);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative">
        <div className="aspect-[21/9] sm:aspect-[3/1]">
          <img
            src={area.image}
            alt={area.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom pb-8 sm:pb-12">
            <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/areas" className="hover:text-white">Areas</Link>
              <span>/</span>
              <span className="text-white">{area.name}</span>
            </nav>
            <h1 className="text-3xl font-bold text-white sm:text-5xl">
              {area.name}
            </h1>
            <p className="mt-2 text-lg text-white/80">{area.tagline}</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="rounded-md bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                {area.propertyCount} properties available
              </span>
              <Link
                href={`/properties?area=${area.slug}`}
                className="rounded-md bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                View All Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  About {area.name}
                </h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {area.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900">Highlights</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {area.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Things to Do */}
              <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-900">
                  Things to Do in {area.name}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {area.thingsToDo.map((thing) => (
                    <span
                      key={thing}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      {thing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Properties */}
              {properties.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-end justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      Properties in {area.name}
                    </h2>
                    <Link
                      href={`/properties?area=${area.slug}`}
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      View All &rarr;
                    </Link>
                  </div>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Ideal For */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="font-semibold text-gray-900">Ideal For</h3>
                  <ul className="mt-3 space-y-2">
                    {area.idealFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Links */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="font-semibold text-gray-900">Quick Links</h3>
                  <ul className="mt-3 space-y-2">
                    <li>
                      <Link
                        href={`/properties?area=${area.slug}&listing_type=sale_freehold`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Freehold in {area.name} &rarr;
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/properties?area=${area.slug}&listing_type=sale_leasehold`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Leasehold in {area.name} &rarr;
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/properties?area=${area.slug}&listing_type=short_term_rent`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Short-term rentals in {area.name} &rarr;
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/properties?area=${area.slug}&listing_type=long_term_rent`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Long-term rentals in {area.name} &rarr;
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Other Areas */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="font-semibold text-gray-900">Other Areas</h3>
                  <ul className="mt-3 space-y-2">
                    {AREAS.filter((a) => a.slug !== area.slug)
                      .slice(0, 6)
                      .map((otherArea) => (
                        <li key={otherArea.slug}>
                          <Link
                            href={`/areas/${otherArea.slug}`}
                            className="flex items-center justify-between text-sm text-gray-700 hover:text-primary-600"
                          >
                            <span>{otherArea.name}</span>
                            <span className="text-xs text-gray-400">
                              {otherArea.propertyCount}
                            </span>
                          </Link>
                        </li>
                      ))}
                    <li>
                      <Link
                        href="/areas"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View all areas &rarr;
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
