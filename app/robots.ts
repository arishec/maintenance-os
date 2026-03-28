import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ifbids.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/features',
          '/how-it-works',
          '/pricing',
          '/for-homeowners',
          '/for-landlords',
          '/guides/',
          '/contact',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard',
          '/issues',
          '/properties',
          '/contractors',
          '/settings',
          '/history',
          '/api/',
          '/sign-in',
          '/sign-up',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
