import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trae-api-cn.mchost.guru',
        pathname: '/api/ide/v1/text_to_image/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' va.vercel-scripts.com http://push.zhanzhang.baidu.com https://zz.bdstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob: http://unpkg.com https://unpkg.com http://api.share.baidu.com https://api.share.baidu.com; font-src 'self' data:; connect-src 'self' https: http://unpkg.com https://unpkg.com; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
