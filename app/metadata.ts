import type { Metadata, Viewport } from "next";

export const siteConfig = {
  name: "Amis's Homepage",
  title: "Amis的主页",
  url: "https://www.amisweb.cn",
  ogImage: "/images/index.jpg",
  author: "AmisKwok",
  description: {
    zh: "后端开发者 | 移动端开发者。专注于 Java Spring Boot、Flutter 和 Next.js 开发。热爱编程，追求极致，永不止步。",
    en: "Backend Developer | Mobile Developer. Focused on Java Spring Boot, Flutter and Next.js development. Passionate about coding, pursuing excellence, never stopping.",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description.zh,
  keywords: [
    "Amis",
    "AmisKwok",
    "个人主页",
    "博客",
    "技术",
    "Java",
    "Spring Boot",
    "Flutter",
    "Next.js",
    "后端开发",
    "移动端开发",
    "GitHub",
    "Gitee",
    "Personal Homepage",
    "Blog",
    "Technology",
    "Backend Developer",
    "Mobile Developer",
  ],
  authors: [{ name: siteConfig.author, url: "https://github.com/AmisKwok" }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/images/icon.png",
    apple: [
      { url: "/images/icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description.zh,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description.zh,
    images: [siteConfig.ogImage],
    creator: "@AmisKwok",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};
