import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/query-client";
import { PerformanceMonitoringProvider } from "@/lib/performance-provider";
import { PrefetchProvider } from "@/lib/prefetch";
import { ThemeProvider } from "@/lib/theme-context";
// import { CriticalOptimizationsProvider } from "@/lib/critical-optimizations-provider";
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
        {/* Critical resource preloading */}
        <link rel="preload" href="/images/hero-viewmarket-charts.png" as="image" type="image/png" />
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />

        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Prevent zoom on iOS */}
        <meta name="format-detection" content="telephone=no" />

        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
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
