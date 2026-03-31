import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import HeroSlideshow from '@/components/HeroSlideshow';
import { getFeaturedProperties, MOCK_PROPERTIES } from '@/lib/api';
import { Property } from '@/lib/types';

async function fetchFeaturedProperties(): Promise<Property[]> {
  try {
    const response = await getFeaturedProperties();
    return response.data;
  } catch {
    return MOCK_PROPERTIES;
  }
}

const whyChooseUs = [
  {
    title: 'Verified Properties',
    description:
      'Every listing is personally verified by our team to ensure accuracy and quality. No surprises, just transparent information.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: 'Expert Local Agents',
    description:
      'Our network of experienced agents know Bali inside and out. Get expert guidance through every step of your property journey.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    title: 'Secure Transactions',
    description:
      'We provide legal support and ensure all transactions are transparent and legally compliant with Indonesian property laws.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    title: 'Local Knowledge',
    description:
      'From zoning regulations to the best neighborhoods, our deep local expertise helps you make informed investment decisions.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const properties = await fetchFeaturedProperties();

  return (
    <>
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative overflow-hidden">
        {/* Slideshow Background */}
        <HeroSlideshow />

        <div className="container-custom relative z-10 py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              Find Your Dream{' '}
              <span className="text-secondary-400">Property</span> in Bali
            </h1>
            <p className="mt-6 text-lg text-white/90 drop-shadow sm:text-xl">
              Discover premium villas, houses, apartments, land, and commercial
              properties across Bali&apos;s most desirable locations.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-4xl">
            <SearchBar variant="hero" />
          </div>

          {/* Quick Stats */}
          <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-8 sm:gap-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-white drop-shadow">1,500+</p>
              <p className="mt-1 text-sm text-white/80">Active Listings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white drop-shadow">200+</p>
              <p className="mt-1 text-sm text-white/80">Verified Agents</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white drop-shadow">8</p>
              <p className="mt-1 text-sm text-white/80">Premium Areas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white drop-shadow">5,000+</p>
              <p className="mt-1 text-sm text-white/80">Happy Clients</p>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 5 480 0 720 15C960 30 1200 50 1440 30V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ================================================================
          BROWSE BY LOCATION
          ================================================================ */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="section-heading">Browse by Location</h2>
            <p className="section-subheading mx-auto max-w-2xl">
              Explore properties in Bali&apos;s most sought-after neighborhoods
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { slug: 'canggu', name: 'Canggu', desc: 'Surf town with vibrant cafes & beach clubs' },
              { slug: 'ubud', name: 'Ubud', desc: 'Cultural heart with jungles & yoga retreats' },
              { slug: 'uluwatu', name: 'Uluwatu', desc: 'Clifftop villas & world-class surf breaks' },
              { slug: 'seminyak', name: 'Seminyak', desc: 'Upscale dining, nightlife & beach clubs' },
              { slug: 'sanur', name: 'Sanur', desc: 'Relaxed coastal village with calm beaches' },
              { slug: 'nusa-dua', name: 'Nusa Dua', desc: 'Premium resorts & pristine white sand' },
              { slug: 'jimbaran', name: 'Jimbaran', desc: 'Famous seafood bay & sunset views' },
              { slug: 'kuta', name: 'Kuta', desc: 'Bustling surf hub near the airport' },
              { slug: 'tabanan', name: 'Tabanan', desc: 'UNESCO rice terraces & black sand beaches' },
              { slug: 'pererenan', name: 'Pererenan', desc: 'Stunning sunsets & growing villa scene' },
              { slug: 'mengwi', name: 'Mengwi', desc: 'Historic temples & affordable villas' },
              { slug: 'denpasar', name: 'Denpasar', desc: 'Capital city with markets & culture' },
              { slug: 'lovina', name: 'Lovina', desc: 'North Bali dolphins & black sand beach' },
              { slug: 'amed', name: 'Amed', desc: 'Diving paradise with volcanic coastline' },
              { slug: 'candidasa', name: 'Candidasa', desc: 'Tranquil east coast with lotus lagoon' },
              { slug: 'tegallalang', name: 'Tegallalang', desc: 'Iconic terraced rice paddies' },
            ].map((loc) => (
              <Link
                key={loc.slug}
                href={`/properties?area=${loc.slug}`}
                className="group relative overflow-hidden rounded-xl"
              >
                <div className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={`/images/areas/${loc.slug}.jpg`}
                    alt={loc.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">
                    {loc.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">{loc.desc}</p>
                </div>
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURED PROPERTIES
          ================================================================ */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-heading">Featured Properties</h2>
              <p className="section-subheading">
                Hand-picked properties from our curated collection
              </p>
            </div>
            <Link
              href="/properties?is_featured=true"
              className="hidden items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:flex"
            >
              View All
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/properties?is_featured=true" className="btn-outline">
              View All Properties
            </Link>
          </div>
        </div>
      </section>


      {/* ================================================================
          WHY CHOOSE US
          ================================================================ */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="section-heading">Why Choose MyBaliVilla</h2>
            <p className="section-subheading mx-auto max-w-2xl">
              We are Bali&apos;s most trusted property platform, helping thousands
              find their perfect home or investment
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-100 bg-white p-6 text-center transition-all hover:border-primary-200 hover:shadow-card-hover"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section className="bg-primary-700">
        <div className="container-custom py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Have a Property to List?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Reach thousands of potential buyers and renters looking for
              properties in Bali. List your property with us and get it seen by
              the right audience.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/list-property" className="btn-secondary !px-8 !py-3.5 !text-base">
                List Your Property
              </Link>
              <Link href="/contact" className="btn-white !px-8 !py-3.5 !text-base">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
