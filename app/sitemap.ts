import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ifbids.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/property-maintenance-software',
    '/landlord-maintenance-software',
    '/home-repair-tracking',
    '/compare-contractor-quotes',
    '/track-rental-property-repairs',
    '/features',
    '/how-it-works',
    '/pricing',
    '/for-homeowners',
    '/for-landlords',
    '/contact',
    '/privacy',
    '/terms',
    '/features/property-maintenance-tracking',
    '/features/contractor-dispatch',
    '/features/quote-comparison',
    '/features/repair-history',
    '/features/tenant-intake',
    '/features/job-tracking',
    '/features/ai-powered-maintenance',
    '/guides/how-to-track-home-repairs',
    '/guides/how-to-manage-rental-property-maintenance',
    '/guides/how-to-compare-contractor-quotes',
  ];

  const now = new Date();

  return staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === ''
      ? 1
      : path === '/property-maintenance-software'
        ? 0.9
        : ['/landlord-maintenance-software', '/home-repair-tracking', '/compare-contractor-quotes', '/track-rental-property-repairs'].includes(path)
          ? 0.8
          : path.startsWith('/guides')
            ? 0.6
            : 0.7,
  }));
}
