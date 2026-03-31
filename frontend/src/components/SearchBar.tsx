'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListingType, PropertyType } from '@/lib/types';
import { buildQueryString } from '@/lib/utils';

interface SearchBarProps {
  variant?: 'hero' | 'standalone';
  initialFilters?: {
    listing_type?: string;
    property_type?: string;
    keyword?: string;
    min_price?: string;
    max_price?: string;
    check_in?: string;
    check_out?: string;
  };
}

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: PropertyType.VILLA, label: 'Villa' },
  { value: PropertyType.HOUSE, label: 'House' },
  { value: PropertyType.APARTMENT, label: 'Apartment' },
  { value: PropertyType.LAND, label: 'Land' },
  { value: PropertyType.COMMERCIAL, label: 'Commercial' },
];

const listingCategories = [
  { value: '', label: 'All Listings' },
  { value: 'buy', label: 'Buy' },
  { value: 'short_term', label: 'Short-Term Rent' },
  { value: 'long_term', label: 'Long-Term Rent' },
];

export default function SearchBar({
  variant = 'hero',
  initialFilters,
}: SearchBarProps) {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState(
    initialFilters?.property_type || ''
  );
  const [keyword, setKeyword] = useState(initialFilters?.keyword || '');
  const [minPrice, setMinPrice] = useState(initialFilters?.min_price || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters?.max_price || '');
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [checkIn, setCheckIn] = useState(initialFilters?.check_in || '');
  const [checkOut, setCheckOut] = useState(initialFilters?.check_out || '');
  const [showDates, setShowDates] = useState(false);
  const [category, setCategory] = useState(() => {
    const lt = initialFilters?.listing_type || '';
    if (lt.startsWith('sale')) return 'buy';
    if (lt === 'short_term_rent') return 'short_term';
    if (lt === 'long_term_rent') return 'long_term';
    return '';
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    let listingType: string | undefined;
    if (category === 'buy') listingType = undefined; // show both freehold & leasehold
    else if (category === 'short_term') listingType = ListingType.RENT_SHORT_TERM;
    else if (category === 'long_term') listingType = ListingType.RENT_LONG_TERM;

    const params: Record<string, string | undefined> = {
      listing_type: listingType,
      property_type: propertyType || undefined,
      keyword: keyword || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
    };

    // For "buy", search both freehold and leasehold via keyword hack
    if (category === 'buy') {
      params.listing_type = 'sale_freehold';
    }

    const queryString = buildQueryString(params as Record<string, string | number | boolean | undefined>);
    router.push(`/properties${queryString}`);
  };

  const isHero = variant === 'hero';
  const isRental = category === 'short_term' || category === 'long_term';
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSearch} className="w-full">
      {/* Category Tabs */}
      <div className={`flex gap-1 ${isHero ? 'mb-4' : 'mb-3'}`}>
        {listingCategories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => {
              setCategory(cat.value);
              if (cat.value !== 'short_term' && cat.value !== 'long_term') {
                setCheckIn('');
                setCheckOut('');
                setShowDates(false);
              }
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              category === cat.value
                ? isHero
                  ? 'bg-white text-primary-700 shadow-md'
                  : 'bg-primary-600 text-white shadow-md'
                : isHero
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Fields */}
      <div
        className={`flex flex-col gap-3 rounded-xl p-4 shadow-lg sm:flex-row sm:items-end ${
          isHero ? 'bg-white' : 'bg-white border border-gray-200'
        }`}
      >
        {/* Property Type */}
        <div className="flex-shrink-0 sm:w-36">
          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location / Keyword */}
        <div className="flex-1 min-w-0">
          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Location or Keyword
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by area, address, or keyword..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Dates (for rentals) */}
        {isRental && (
          <div className="relative flex-shrink-0">
            <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
              Dates
            </label>
            <button
              type="button"
              onClick={() => setShowDates(!showDates)}
              className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:w-52"
            >
              <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span className={checkIn ? 'text-gray-900' : 'text-gray-400'}>
                {checkIn && checkOut
                  ? `${new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : 'Select dates'}
              </span>
            </button>

            {showDates && (
              <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      {category === 'long_term' ? 'Move-in Date' : 'Check-in Date'}
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={minDate}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        if (checkOut && e.target.value >= checkOut) setCheckOut('');
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      {category === 'long_term' ? 'Move-out Date' : 'Check-out Date'}
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || minDate}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDates(false)}
                    className="w-full rounded-lg bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price Range */}
        <div className="relative flex-shrink-0 sm:w-44">
          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Price Range
          </label>
          <button
            type="button"
            onClick={() => setShowPriceDropdown(!showPriceDropdown)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <span className={minPrice || maxPrice ? 'text-gray-900' : 'text-gray-400'}>
              {minPrice || maxPrice
                ? `${minPrice || '0'} - ${maxPrice || 'Any'}`
                : 'Any Price'}
            </span>
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showPriceDropdown && (
            <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="No minimum"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="No maximum"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPriceDropdown(false)}
                  className="w-full rounded-lg bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex-shrink-0 rounded-lg bg-primary-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Search
          </span>
        </button>
      </div>
    </form>
  );
}
