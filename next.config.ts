/**
 * Next.js 应用配置文件
 * 包含输出模式、图片域名白名单、安全头配置等
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 输出模式：standalone 适用于 Docker 容器化部署
  output: 'standalone',

  // 图片域名白名单配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trae-api-cn.mchost.guru',
        pathname: '/api/ide/v1/text_to_image/**',
      },
    ],
  },

  // HTTP 安全头配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // 防止页面被 iframe 嵌套，防御点击劫持攻击
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 防止 MIME 类型嗅探，增强安全性
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // 启用浏览器 XSS 过滤器
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // 控制引用来源信息，保护隐私
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 禁用浏览器权限（摄像头、麦克风、地理位置）
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // 内容安全策略：控制资源加载来源
          // - script-src: 脚本来源（包含百度统计、Vercel 脚本）
          // - style-src: 样式来源
          // - img-src: 图片来源（包含 Waline 表情包、百度分享）
          // - connect-src: 网络请求来源
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
