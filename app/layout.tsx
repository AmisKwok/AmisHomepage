/**
 * 根布局组件
 * Next.js 应用的顶层布局，所有页面共享
 * 包含字体加载、全局样式、SEO 脚本、国际化 Provider 等
 */
import { Geist, Geist_Mono, ZCOOL_QingKe_HuangYou } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MusicPlayer from "./components/media/MusicPlayer";
import { metadata, viewport } from "./metadata";
import { initScript } from "./scripts/initScript";
import { seoScripts } from "./scripts/seo-scripts";
import SEOHead from "./components/seo/SEOHead";
import { I18nProvider } from "../i18n";

// 导出元数据和视口配置
export { metadata, viewport };

// Geist Sans 字体 - 主字体
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono 字体 - 等宽字体
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 站酷庆科黄油体 - 中文艺术字体
const zcoolQingKeHuangYou = ZCOOL_QingKe_HuangYou({
  variable: "--font-zcool-qingke",
  weight: "400",
  subsets: ["latin"],
});

/**
 * 根布局组件
 * @param children - 子页面内容
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* SEO 元信息组件 */}
        <SEOHead />
        {/* 初始化脚本：处理主题闪烁等问题 */}
        <script dangerouslySetInnerHTML={{ __html: initScript }} suppressHydrationWarning />
        {/* SEO 脚本：百度统计等 */}
        <script dangerouslySetInnerHTML={{ __html: seoScripts }} suppressHydrationWarning />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zcoolQingKeHuangYou.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* 国际化 Provider */}
        <I18nProvider>
          {children}
          {/* 全局音乐播放器 */}
          <MusicPlayer />
          {/* Vercel 分析 */}
          <Analytics />
        </I18nProvider>
      </body>
    </html>
  );
}
