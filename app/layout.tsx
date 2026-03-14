import { Geist, Geist_Mono, ZCOOL_QingKe_HuangYou } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import MusicPlayer from "./components/MusicPlayer";
import { metadata, viewport } from "./metadata";

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

const themeScript = `
  (function() {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zcoolQingKeHuangYou.variable} antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <MusicPlayerProvider>
              {children}
              <MusicPlayer />
            </MusicPlayerProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
