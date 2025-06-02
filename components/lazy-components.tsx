"use client";

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';

// Loading components for better UX
const SectionSkeleton = () => (
  <div className="w-full py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg mb-8 mx-auto max-w-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HeroSkeleton = () => (
  <div className="h-screen bg-white flex items-center justify-center">
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200 rounded-lg mb-8 mx-auto max-w-lg"></div>
      <div className="h-96 bg-gray-200 rounded-lg mx-auto max-w-4xl"></div>
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="h-screen bg-zinc-900 flex items-center justify-center">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-800 rounded-lg mb-4 mx-auto max-w-xs"></div>
      <div className="h-96 bg-gray-800 rounded-lg mx-auto max-w-4xl"></div>
    </div>
  </div>
);

// Lazy load heavy components with optimized loading
export const LazyHeroSection = dynamic(
  () => import('./hero-section').then(mod => ({ default: mod.HeroSection })),
  {
    loading: () => <HeroSkeleton />,
    ssr: true, // Enable SSR for simple hero section
  }
);

export const LazyFeaturesSection = dynamic(
  () => import('./features-section').then(mod => ({ default: mod.FeaturesSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true, // Keep SSR for SEO-important content
  }
);

export const LazyWorldMapSection = dynamic(
  () => import('./world-map-section').then(mod => ({ default: mod.WorldMapSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false, // Disable SSR for heavy interactive components
  }
);

export const LazyWobbleCardSection = dynamic(
  () => import('./wobble-card-section').then(mod => ({ default: mod.WobbleCardSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false, // Disable SSR for heavy animation components
  }
);

export const LazyPricingSection = dynamic(
  () => import('./pricing-section').then(mod => ({ default: mod.PricingSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true, // Keep SSR for important business content
  }
);

export const LazyFooterSection = dynamic(
  () => import('./footer-section').then(mod => ({ default: mod.FooterSection })),
  {
    loading: () => <SectionSkeleton />,
    ssr: true, // Keep SSR for footer links (SEO)
  }
);

// Chart components with lazy loading
export const LazyChartLayout = dynamic(
  () => import('./charts/chart-layout').then(mod => ({ default: mod.ChartLayout })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // Charts are client-side only
  }
);

export const LazyTradingChart = dynamic(
  () => import('./charts/trading-chart').then(mod => ({ default: mod.TradingChart })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

// Wrapper component with Suspense for better error boundaries
interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazySection({ children, fallback = <SectionSkeleton /> }: LazySectionProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Intersection Observer hook for lazy loading sections
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
}
