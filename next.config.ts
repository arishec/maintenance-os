import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async redirects() {
    return [
      {
        source: '/for-landlords',
        destination: '/landlord-maintenance-software',
        permanent: true,
      },
      {
        source: '/for-homeowners',
        destination: '/home-repair-tracking',
        permanent: true,
      },
    ];
  },
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hzrsvulgncadxhwykmsd.supabase.co',
        pathname: '/storage/v1/**',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
