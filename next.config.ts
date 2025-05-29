import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },

  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,

  // Environment-based optimizations
  env: {
    DISABLE_REACT_QUERY_DEVTOOLS: process.env.NODE_ENV === 'production' ? 'true' : 'false',
  },

  // Webpack configuration for production optimizations
  webpack: (config, { dev, isServer }) => {
    // In production, completely exclude React Query Devtools
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@tanstack/react-query-devtools': false,
      };
    }

    // Additional optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Separate chunk for React Query
        reactQuery: {
          test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
          name: 'react-query',
          chunks: 'all',
          priority: 10,
        },
      };
    }

    return config;
  },

  // Bundle analyzer (enable when needed)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
