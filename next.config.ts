import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
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

export default nextConfig;
