"use client";

import { useEffect, ReactNode } from 'react';
import { usePerformanceMonitoring, measureWebVitals, checkPerformanceBudget } from './performance';

interface PerformanceMonitoringProviderProps {
  children: ReactNode;
}

export function PerformanceMonitoringProvider({ children }: PerformanceMonitoringProviderProps) {
  usePerformanceMonitoring();

  useEffect(() => {
    // Initialize web vitals measurement
    measureWebVitals();

    // Check performance budget after initial load
    const timer = setTimeout(() => {
      checkPerformanceBudget();
    }, 5000);

    // Register service worker for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
