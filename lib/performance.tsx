"use client";

import { useEffect } from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
            }
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);

        // Observe paint timing
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.set(entry.name, entry.startTime);
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);

        // Observe largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.set('largest-contentful-paint', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // Observe layout shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value || 0;
            }
          }
          this.metrics.set('cumulative-layout-shift', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);

        // Observe first input delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as PerformanceEntry & { processingStart?: number };
            this.metrics.set('first-input-delay', (fidEntry.processingStart || 0) - entry.startTime);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    // Time to First Byte
    const ttfb = entry.responseStart - entry.requestStart;
    this.metrics.set('time-to-first-byte', ttfb);

    // DOM Content Loaded
    const dcl = entry.domContentLoadedEventEnd - entry.fetchStart;
    this.metrics.set('dom-content-loaded', dcl);

    // Load Complete
    const loadComplete = entry.loadEventEnd - entry.fetchStart;
    this.metrics.set('load-complete', loadComplete);

    // DNS Lookup Time
    const dnsTime = entry.domainLookupEnd - entry.domainLookupStart;
    this.metrics.set('dns-lookup-time', dnsTime);

    // Connection Time
    const connectionTime = entry.connectEnd - entry.connectStart;
    this.metrics.set('connection-time', connectionTime);
  }

  // Record custom metrics
  recordMetric(name: string, value: number) {
    this.metrics.set(name, value);
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Get specific metric
  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  // Report metrics (you can send to analytics service)
  reportMetrics() {
    const metrics = this.getMetrics();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics');
      console.table(metrics);
      console.groupEnd();
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Replace with your analytics service
      // analytics.track('performance_metrics', metrics);
    }

    return metrics;
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();

    // Report metrics after page load
    const timer = setTimeout(() => {
      monitor.reportMetrics();
    }, 3000); // Wait 3 seconds after mount

    return () => {
      clearTimeout(timer);
    };
  }, []);
}

// Component to measure render performance
interface PerformanceWrapperProps {
  name: string;
  children: React.ReactNode;
}

export function PerformanceWrapper({ name, children }: PerformanceWrapperProps) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      const monitor = PerformanceMonitor.getInstance();
      monitor.recordMetric(`component-render-${name}`, renderTime);
    };
  }, [name]);

  return <>{children}</>;
}

// Utility to measure function execution time
export function measurePerformance<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    
    const monitor = PerformanceMonitor.getInstance();
    monitor.recordMetric(`function-${name}`, endTime - startTime);
    
    return result;
  }) as T;
}

// Web Vitals measurement
export function measureWebVitals() {
  if (typeof window === 'undefined') return;

  // Measure FCP (First Contentful Paint)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        const monitor = PerformanceMonitor.getInstance();
        monitor.recordMetric('first-contentful-paint', entry.startTime);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['paint'] });
  } catch (error) {
    console.warn('Web Vitals measurement failed:', error);
  }
}

// Performance budget checker
export function checkPerformanceBudget() {
  const monitor = PerformanceMonitor.getInstance();
  const metrics = monitor.getMetrics();
  
  const budgets = {
    'first-contentful-paint': 1500, // 1.5s
    'largest-contentful-paint': 2500, // 2.5s
    'first-input-delay': 100, // 100ms
    'cumulative-layout-shift': 0.1, // 0.1
    'time-to-first-byte': 600, // 600ms
  };

  const violations: string[] = [];

  Object.entries(budgets).forEach(([metric, budget]) => {
    const value = metrics[metric];
    if (value !== undefined && value > budget) {
      violations.push(`${metric}: ${value.toFixed(2)} (budget: ${budget})`);
    }
  });

  if (violations.length > 0) {
    console.warn('Performance budget violations:', violations);
  }

  return violations;
}
