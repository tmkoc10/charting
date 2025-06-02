import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/query-client";
import { PerformanceMonitoringProvider } from "@/lib/performance-provider";
import { PrefetchProvider } from "@/lib/prefetch";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

export const metadata: Metadata = {
  title: "Advanced Trading Platform | Real-time Charts & Analytics",
  description: "Professional trading platform with real-time charts, technical indicators, and advanced analytics. Trade with confidence using our cutting-edge tools.",
  keywords: "trading, charts, technical analysis, indicators, real-time data, financial markets",
  authors: [{ name: "ViewMarket" }],
  creator: "ViewMarket",
  publisher: "ViewMarket",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
  openGraph: {
    title: "Advanced Trading Platform | Real-time Charts & Analytics",
    description: "Professional trading platform with real-time charts, technical indicators, and advanced analytics.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanced Trading Platform | Real-time Charts & Analytics",
    description: "Professional trading platform with real-time charts, technical indicators, and advanced analytics.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for faster loading */}
        {/* Removed Unsplash preconnect as we now use local images */}

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />

        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        {/* Prevent zoom on iOS */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <PerformanceMonitoringProvider>
              <PrefetchProvider>
                {children}
              </PrefetchProvider>
            </PerformanceMonitoringProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
