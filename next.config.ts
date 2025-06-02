import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@tabler/icons-react',
      '@heroicons/react',
      'clsx',
      'class-variance-authority',
      '@codemirror/autocomplete',
      '@codemirror/commands',
      '@codemirror/lang-javascript',
      '@codemirror/language',
      '@codemirror/state',
      '@codemirror/theme-one-dark',
      '@codemirror/view',
      'lightweight-charts',
      'html2canvas',
      'react-dom'
    ],
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
    formats: ['image/avif', 'image/webp'], // AVIF first for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    // Enable dangerous SVG optimization with security
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
      // Enhanced code splitting
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Separate chunk for React Query
        reactQuery: {
          test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
          name: 'react-query',
          chunks: 'all',
          priority: 10,
        },
        // Separate chunk for Framer Motion
        framerMotion: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-motion',
          chunks: 'all',
          priority: 9,
        },
        // Separate chunk for CodeMirror
        codemirror: {
          test: /[\\/]node_modules[\\/]@codemirror[\\/]/,
          name: 'codemirror',
          chunks: 'all',
          priority: 8,
        },
        // Separate chunk for UI libraries
        ui: {
          test: /[\\/]node_modules[\\/](@radix-ui|@tabler|@heroicons)[\\/]/,
          name: 'ui-libs',
          chunks: 'all',
          priority: 7,
        },
        // Separate chunk for lightweight-charts
        charts: {
          test: /[\\/]node_modules[\\/]lightweight-charts[\\/]/,
          name: 'charts',
          chunks: 'all',
          priority: 6,
        },
        // Separate chunk for html2canvas
        canvas: {
          test: /[\\/]node_modules[\\/]html2canvas[\\/]/,
          name: 'html2canvas',
          chunks: 'all',
          priority: 5,
        },
      };

      // Optimize module concatenation
      config.optimization.concatenateModules = true;

      // Enable tree shaking for production
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
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
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
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
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
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
