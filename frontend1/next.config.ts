import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Fix workspace root warning
  output: 'standalone',
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year — images are immutable
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
    webpackBuildWorker: true,
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache optimized images aggressively
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache public static assets
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // SEO-friendly redirects: service+location → product pages
  async redirects() {
    return [
      // LED Sign Board location variants
      {
        source: '/led-sign-board-kukatpally',
        destination: '/products/led-sign-board',
        permanent: true,
      },
      {
        source: '/led-sign-board-gachibowli',
        destination: '/products/led-sign-board',
        permanent: true,
      },
      {
        source: '/led-sign-board-madhapur',
        destination: '/products/led-sign-board',
        permanent: true,
      },
      {
        source: '/led-sign-board-nacharam',
        destination: '/products/led-sign-board',
        permanent: true,
      },
      // Vehicle Branding location variants
      {
        source: '/vehicle-branding-kukatpally',
        destination: '/products/car-4-wheeler-wrap',
        permanent: true,
      },
      {
        source: '/vehicle-branding-gachibowli',
        destination: '/products/car-4-wheeler-wrap',
        permanent: true,
      },
      {
        source: '/vehicle-branding-madhapur',
        destination: '/products/car-4-wheeler-wrap',
        permanent: true,
      },
      // Flex Printing location variants
      {
        source: '/flex-printing-kukatpally',
        destination: '/products/flex-vinyl-printing',
        permanent: true,
      },
      {
        source: '/flex-printing-gachibowli',
        destination: '/products/flex-vinyl-printing',
        permanent: true,
      },
      {
        source: '/flex-printing-nacharam',
        destination: '/products/flex-vinyl-printing',
        permanent: true,
      },
      // ACP Cladding location variants
      {
        source: '/acp-cladding-kukatpally',
        destination: '/products/acp-cladding-sign',
        permanent: true,
      },
      {
        source: '/acp-cladding-gachibowli',
        destination: '/products/acp-cladding-sign',
        permanent: true,
      },
      // General printing services by location
      {
        source: '/printing-services-kukatpally',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/printing-services-gachibowli',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/printing-services-madhapur',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/printing-services-nacharam',
        destination: '/products',
        permanent: true,
      },

      // ── Legacy orphan redirects (pre-migration URLs still indexed by Google) ──
      // These were confirmed live in Google's index via the Aug 2026 GSC audit.
      // Without these, Google keeps two split sets of signals — blocking sitelinks.

      // Old static HTML pages → current routes (301 permanent)
      { source: '/contact.html',  destination: '/contact',  permanent: true },
      { source: '/work.html',     destination: '/projects', permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },

      // Old PHP catalog pages → closest current product category
      {
        source: '/display-standees-embossing-printing-manufacturers-hyderabad.php',
        destination: '/products?category=Display%20%26%20Exhibition',
        permanent: true,
      },
      {
        source: '/clip-on-snap-frames-manufacturers-hyderabad.php',
        destination: '/products?category=Signage%20Solutions',
        permanent: true,
      },

      // Catch-all for any other old .php or .html legacy URLs
      { source: '/:path*.php',  destination: '/products', permanent: true },
      { source: '/:path*.html', destination: '/',         permanent: true },

      // ── GSC 404 Fixes (Aug 2026 Audit) ──
      // These broken URLs were found in GSC with double-dashes from old toSlug() bug.
      // Redirecting to correct single-dash slugs.
      {
        source: '/products/demo-tent--canopy',
        destination: '/products/canopy-and-tent-branding',
        permanent: true,
      },
      {
        source: '/products/demo-tents',
        destination: '/products/canopy-and-tent-branding',
        permanent: true,
      },
      {
        source: '/products/brochure--catalogue',
        destination: '/products/brochure-catalogue',
        permanent: true,
      },
      {
        source: '/products/backdrop--stage-banner',
        destination: '/products/backdrop-stage-banner',
        permanent: true,
      },
      {
        source: '/products/bus--van-branding',
        destination: '/products/bus-van-branding',
        permanent: true,
      },
      {
        source: '/products/car--4-wheeler-wrap',
        destination: '/products/car-4-wheeler-wrap',
        permanent: true,
      },
      {
        source: '/products/flex--vinyl-printing',
        destination: '/products/flex-vinyl-printing',
        permanent: true,
      },
      {
        source: '/products/offset-printing',
        destination: '/products/brochure-catalogue',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
