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
    // 配置安全响应头
    return [
      {
        source: '/:path*', // 匹配所有路径
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // 禁止页面被嵌入到 iframe
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // 禁止浏览器 MIME 类型嗅探
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // 启用 XSS 过滤并阻止页面加载
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // 控制跨域时发送的 Referrer 信息
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()', // 禁用摄像头、麦克风和地理位置权限
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' va.vercel-scripts.com http://push.zhanzhang.baidu.com https://zz.bdstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https: http://unpkg.com https://unpkg.com; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
