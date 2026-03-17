import { Geist, Geist_Mono, ZCOOL_QingKe_HuangYou } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MusicPlayer from "./components/media/MusicPlayer";
import { metadata, viewport } from "./metadata";
import { initScript } from "./scripts/initScript";
import { seoScripts } from "./scripts/seo-scripts";
import SEOHead from "./components/seo/SEOHead";

export { metadata, viewport };

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zcoolQingKeHuangYou = ZCOOL_QingKe_HuangYou({
  variable: "--font-zcool-qingke",
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <SEOHead />
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
        <script dangerouslySetInnerHTML={{ __html: seoScripts }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zcoolQingKeHuangYou.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <MusicPlayer />
        <Analytics />
      </body>
    </html>
  );
}
