const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ifbids.com';

type ArticleJsonLdProps = {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
};

export function ArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: `${siteUrl}${path}`,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: 'Maintenance OS',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Maintenance OS',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
