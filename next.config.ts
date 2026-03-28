import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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

export default nextConfig;
