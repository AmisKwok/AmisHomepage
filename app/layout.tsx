import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { LanguageProvider } from "./contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amis's Personal Homepage",
  description: "记录技术文章和生活感悟 | Technical articles and life insights",
  keywords: ["Amis", "个人主页", "博客", "技术", "GitHub", "Gitee", "Personal Homepage", "Blog", "Technology"],
  authors: [{ name: "Amis" }],
  creator: "Amis",
  publisher: "Amis",
  robots: "index, follow",
  icons: {
    icon: "/images/icon.png",
    shortcut: "/images/icon.png",
    apple: "/images/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: "https://www.amisblog.cn",
    siteName: "Amis's Homepage",
    title: "Amis's Homepage",
    description: "记录技术文章和生活感悟 | Technical articles and life insights",
    images: [
      {
        url: "/images/index.jpg",
        width: 1200,
        height: 630,
        alt: "Amis's Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amis's Homepage",
    description: "记录技术文章和生活感悟 | Technical articles and life insights",
    images: ["/images/index.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
