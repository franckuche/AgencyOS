import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
    proxyTimeout: 2_400_000,
  },
  devIndicators: false,
};

export default nextConfig;
