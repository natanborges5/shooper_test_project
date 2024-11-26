import { env } from './src/lib/env.config.mjs';

process.env.TZ = env.TZ;
/** @type {import('next').NextConfig} */
const nextConfig = {
  env,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  crossOrigin: 'use-credentials',
  compress: true,
  generateBuildId: async () =>
  {
    // This could be anything, using the latest git hash

    return `${Date.now()}`
  },
  async headers ()
  {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: `${env.NEXT_PUBLIC_BACKEND_URL},${env.NEXT_PUBLIC_FRONTEND_URL}`, // Set your origin
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, CONNECT, TRACE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Authorization, Content-Type, Accept, Origin, X-Requested-With",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=86400; includeSubDomains; preload'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self' ${env.NEXT_PUBLIC_BACKEND_URL} ${env.NEXT_PUBLIC_BACKEND_URL.replace( 'http', 'ws' )}; img-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' ${env.NEXT_PUBLIC_BACKEND_URL} ${env.NEXT_PUBLIC_BACKEND_URL.replace( 'http', 'ws' )} ; frame-ancestors 'self'; font-src 'self' data: blob: https://use.typekit.net https://fonts.gstatic.com; worker-src 'self' data: blob:;`
          },

          {
            key: 'Expect-CT',
            value: 'enforce, max-age=86400'
          },
        ],
      },
    ];
  },
  webpack: ( config, { isServer } ) =>
  {
    if ( !isServer ) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
}

export default nextConfig;
