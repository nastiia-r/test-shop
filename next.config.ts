import path from 'node:path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  images: {
    loader: 'custom',
    loaderFile: './src/shared/lib/image-loader.ts',
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [32, 64, 128, 256, 384],
  },
  sassOptions: {
    loadPaths: [path.join(process.cwd(), 'src/shared/styles')],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
