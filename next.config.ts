import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
      { source: '/admin/', destination: '/admin/index.html' },
    ];
  },
  async redirects() {
    return [
      // The Tina admin is a static SPA emitted into /public/admin.
      { source: '/admin', destination: '/admin/index.html', permanent: false },
    ];
  },
};

export default nextConfig;
