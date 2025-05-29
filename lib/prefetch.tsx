"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Prefetch critical routes and resources
export function usePrefetchStrategy() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch critical routes after initial load
    const prefetchRoutes = () => {
      // Prefetch charts page (most likely next navigation)
      router.prefetch('/charts');
      
      // Prefetch auth pages (common user actions)
      router.prefetch('/auth/login');
      router.prefetch('/profile');
    };

    // Delay prefetching to not interfere with initial page load
    const timer = setTimeout(prefetchRoutes, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    // Prefetch critical resources
    const prefetchResources = () => {
      // Prefetch critical images
      const criticalImages = [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });

      // Prefetch critical scripts
      const criticalScripts: string[] = [
        // Add any critical third-party scripts here
      ];

      criticalScripts.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        link.as = 'script';
        document.head.appendChild(link);
      });
    };

    // Delay resource prefetching
    const timer = setTimeout(prefetchResources, 3000);

    return () => clearTimeout(timer);
  }, []);
}

// Intersection Observer for lazy prefetching
export function useLazyPrefetch(
  elementRef: React.RefObject<Element>,
  prefetchFn: () => void,
  options: IntersectionObserverInit = {}
) {
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            prefetchFn();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
        ...options,
      }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, prefetchFn, options]);
}

// Smart prefetching based on user behavior
export function useSmartPrefetch() {
  useEffect(() => {
    let mouseIdleTimer: NodeJS.Timeout;
    let isMouseIdle = false;

    const handleMouseMove = () => {
      isMouseIdle = false;
      clearTimeout(mouseIdleTimer);
      
      mouseIdleTimer = setTimeout(() => {
        isMouseIdle = true;
        // User is idle, good time to prefetch
        prefetchOnIdle();
      }, 1000);
    };

    const prefetchOnIdle = () => {
      if (isMouseIdle) {
        // Prefetch likely next pages based on current page
        const currentPath = window.location.pathname;
        
        if (currentPath === '/') {
          // On landing page, prefetch charts
          import('../components/charts/chart-layout');
          import('../lib/chart-data');
        } else if (currentPath === '/charts') {
          // On charts page, prefetch indicators
          import('../lib/indicators');
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(mouseIdleTimer);
    };
  }, []);
}

// Preload critical fonts
export function usePreloadFonts() {
  useEffect(() => {
    const fonts: string[] = [
      // Add any critical font URLs here
      // Example: '/fonts/geist-sans.woff2'
    ];

    fonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);
}

// Network-aware prefetching
export function useNetworkAwarePrefetch() {
  useEffect(() => {
    // Check if Network Information API is available
    type ConnectionType = { effectiveType: string; saveData: boolean; addEventListener: (event: string, handler: () => void) => void; removeEventListener: (event: string, handler: () => void) => void };
    const connection = (navigator as unknown as { connection?: ConnectionType }).connection ||
                      (navigator as unknown as { mozConnection?: ConnectionType }).mozConnection ||
                      (navigator as unknown as { webkitConnection?: ConnectionType }).webkitConnection;

    if (connection) {
      const prefetchBasedOnConnection = () => {
        const effectiveType = (connection as ConnectionType).effectiveType;
        const saveData = (connection as ConnectionType).saveData;

        // Don't prefetch on slow connections or when save-data is enabled
        if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
          return;
        }

        // Aggressive prefetching on fast connections
        if (effectiveType === '4g') {
          // Prefetch more resources
          import('../components/charts/trading-chart');
          import('../components/charts/chart-header');
        }
      };

      prefetchBasedOnConnection();

      // Listen for connection changes
      (connection as ConnectionType).addEventListener('change', prefetchBasedOnConnection);

      return () => {
        (connection as ConnectionType).removeEventListener('change', prefetchBasedOnConnection);
      };
    }
  }, []);
}

// Prefetch component for easy integration
interface PrefetchProps {
  children: React.ReactNode;
}

export function PrefetchProvider({ children }: PrefetchProps) {
  usePrefetchStrategy();
  useSmartPrefetch();
  useNetworkAwarePrefetch();
  usePreloadFonts();

  return <>{children}</>;
}
