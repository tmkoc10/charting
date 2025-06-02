"use client";

import { useEffect, ReactNode } from 'react';
import { initializeCriticalOptimizations, useCriticalCSS } from './critical-css';

interface CriticalOptimizationsProviderProps {
  children: ReactNode;
}

export function CriticalOptimizationsProvider({ children }: CriticalOptimizationsProviderProps) {
  // Initialize critical CSS
  useCriticalCSS();

  useEffect(() => {
    // Initialize all critical optimizations
    initializeCriticalOptimizations();

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        { href: '/images/hero-viewmarket-charts.png', as: 'image', type: 'image/png' },
        // Add other critical resources
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.type) link.type = resource.type;
        document.head.appendChild(link);
      });
    };

    // Run immediately for critical resources
    preloadCriticalResources();

    // Optimize third-party scripts loading
    const optimizeThirdPartyScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && !src.includes('_next') && !script.hasAttribute('async')) {
          script.setAttribute('defer', '');
        }
      });
    };

    // Run after initial render
    setTimeout(optimizeThirdPartyScripts, 100);

    // Optimize images with better lazy loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        // Add intersection observer for better control
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const image = entry.target as HTMLImageElement;
                // Trigger loading
                if (image.dataset.src) {
                  image.src = image.dataset.src;
                  image.removeAttribute('data-src');
                }
                observer.unobserve(image);
              }
            });
          },
          { rootMargin: '50px' }
        );
        observer.observe(img);
      });
    };

    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeImages);
    } else {
      optimizeImages();
    }

    // Cleanup function
    return () => {
      // Clean up any observers or listeners if needed
    };
  }, []);

  return <>{children}</>;
}
