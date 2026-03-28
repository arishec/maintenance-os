export function SoftwareJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Maintenance OS',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Maintenance OS helps homeowners and landlords track property repairs, contact contractors, compare quotes, and keep repair history organized in one place.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
