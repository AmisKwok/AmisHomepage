import { Geist, Geist_Mono, ZCOOL_QingKe_HuangYou } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MusicPlayer from "./components/MusicPlayer";
import { metadata, viewport } from "./metadata";
import { initScript } from "./scripts/initScript";

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
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
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
