"use client";

import { useEffect } from 'react';

// Critical CSS for above-the-fold content
const CRITICAL_CSS = `
  /* Critical styles for immediate rendering */
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
  
  .hero-image-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Loading states */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* Optimize font rendering */
  body {
    font-display: swap;
    text-rendering: optimizeSpeed;
  }
  
  /* Reduce layout shifts */
  img, video {
    height: auto;
    max-width: 100%;
  }
`;

// Function to inject critical CSS
export function injectCriticalCSS() {
  if (typeof window === 'undefined') return;
  
  const existingStyle = document.getElementById('critical-css');
  if (existingStyle) return; // Already injected
  
  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = CRITICAL_CSS;
  document.head.insertBefore(style, document.head.firstChild);
}

// Hook to manage critical CSS
export function useCriticalCSS() {
  useEffect(() => {
    injectCriticalCSS();
  }, []);
}

// Function to preload non-critical CSS
export function preloadNonCriticalCSS() {
  if (typeof window === 'undefined') return;
  
  const nonCriticalStyles = [
    '/_next/static/css/app/layout.css',
    // Add other non-critical CSS files
  ];
  
  nonCriticalStyles.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = function() {
      link.onload = null;
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
}

// Function to defer non-critical CSS loading
export function deferNonCriticalCSS() {
  if (typeof window === 'undefined') return;
  
  // Load non-critical CSS after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloadNonCriticalCSS();
    }, 100); // Small delay to prioritize critical rendering
  });
}

// Resource hints for better performance
export function addResourceHints() {
  if (typeof window === 'undefined') return;
  
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  ];
  
  hints.forEach(hint => {
    const existing = document.querySelector(`link[href="${hint.href}"]`);
    if (existing) return;
    
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
    document.head.appendChild(link);
  });
}

// Optimize images with intersection observer
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();
  
  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }
  
  constructor() {
    if (typeof window === 'undefined') return;
    
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
            this.images.delete(img);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );
  }
  
  observeImage(img: HTMLImageElement) {
    if (!this.observer) return;
    
    this.images.add(img);
    this.observer.observe(img);
  }
  
  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

// Performance monitoring for critical metrics
export class CriticalPerformanceMonitor {
  private static instance: CriticalPerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  
  static getInstance(): CriticalPerformanceMonitor {
    if (!CriticalPerformanceMonitor.instance) {
      CriticalPerformanceMonitor.instance = new CriticalPerformanceMonitor();
    }
    return CriticalPerformanceMonitor.instance;
  }
  
  constructor() {
    if (typeof window === 'undefined') return;
    this.initializeMonitoring();
  }
  
  private initializeMonitoring() {
    // Monitor FCP
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('fcp', entry.startTime);
          this.checkBudget('fcp', entry.startTime, 1200);
        }
      }
    }).observe({ entryTypes: ['paint'] });
    
    // Monitor LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('lcp', lastEntry.startTime);
      this.checkBudget('lcp', lastEntry.startTime, 2000);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Monitor CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & {
          hadRecentInput?: boolean;
          value?: number;
        };
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value || 0;
        }
      }
      this.metrics.set('cls', clsValue);
      this.checkBudget('cls', clsValue, 0.05);
    }).observe({ entryTypes: ['layout-shift'] });
  }
  
  private checkBudget(metric: string, value: number, budget: number) {
    if (value > budget) {
      console.warn(`Performance budget exceeded for ${metric}: ${value.toFixed(2)} (budget: ${budget})`);
    }
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// Initialize critical performance optimizations
export function initializeCriticalOptimizations() {
  if (typeof window === 'undefined') return;
  
  // Inject critical CSS immediately
  injectCriticalCSS();
  
  // Add resource hints
  addResourceHints();
  
  // Defer non-critical CSS
  deferNonCriticalCSS();
  
  // Initialize performance monitoring
  CriticalPerformanceMonitor.getInstance();
  
  // Initialize image optimization
  ImageOptimizer.getInstance();
}
