import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/unsplash/image-loader.ts',
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [32, 64, 128, 256, 384],
  },
};

export default nextConfig;
