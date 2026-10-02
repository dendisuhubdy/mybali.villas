interface ListingContactCardProps {
  name?: string | null;
  company?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  sourceUrl?: string | null;
  propertyTitle: string;
}

function digits(value: string) {
  return value.replace(/\D/g, '');
}

export default function ListingContactCard({
  name,
  company,
  phone,
  whatsapp,
  email,
  sourceUrl,
  propertyTitle,
}: ListingContactCardProps) {
  const subject = encodeURIComponent(`Enquiry: ${propertyTitle}`);
  const body = encodeURIComponent(
    `Hi, I am interested in "${propertyTitle}"${sourceUrl ? ` (${sourceUrl})` : ''}. Please provide more details.`
  );

  const rows = [
    whatsapp && {
      label: 'WhatsApp',
      value: whatsapp,
      href: `https://wa.me/${digits(whatsapp)}?text=${body}`,
      external: true,
    },
    phone && { label: 'Phone', value: phone, href: `tel:+${digits(phone)}`, external: false },
    email && {
      label: 'Email',
      value: email,
      href: `mailto:${email}?subject=${subject}&body=${body}`,
      external: false,
    },
  ].filter(Boolean) as { label: string; value: string; href: string; external: boolean }[];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
      <h3 className="text-lg font-semibold text-gray-900">Enquire</h3>
      {name && (
        <p className="mt-1 text-sm text-gray-500">
          Listed by <span className="font-medium text-gray-700">{name}</span>
          {company && company !== name && <span className="block text-xs">{company}</span>}
        </p>
      )}

      <dl className="mt-4 space-y-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-gray-500">{row.label}</dt>
            <dd>
              <a
                href={row.href}
                {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                {row.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>

      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          View original listing
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      )}
    </div>
  );
}
