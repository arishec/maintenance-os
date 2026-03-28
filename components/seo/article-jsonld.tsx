type ArticleJsonLdProps = {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
};

export function ArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
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
