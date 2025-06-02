"use client";

import { Suspense, useState, useEffect, useRef, ReactNode } from 'react';

// Enhanced loading skeleton with better performance
const OptimizedSkeleton = ({ height = "400px" }: { height?: string }) => (
  <div className="w-full bg-white" style={{ height }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded-lg mb-8 mx-auto max-w-md"></div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Enhanced intersection observer hook with better performance
export function useOptimizedIntersectionObserver(
  elementRef: React.RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!elementRef.current || hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setIsIntersecting(true);
          setHasIntersected(true);
          // Disconnect observer after first intersection for performance
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // Load content 100px before it comes into view
        ...options,
      }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Optimized lazy section component
interface OptimizedLazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  height?: string;
  priority?: boolean;
}

export function OptimizedLazySection({ 
  children, 
  fallback, 
  height = "400px",
  priority = false 
}: OptimizedLazySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isIntersecting, hasIntersected } = useOptimizedIntersectionObserver(sectionRef);
  
  // For priority sections, load immediately
  const shouldLoad = priority || isIntersecting || hasIntersected;

  return (
    <div ref={sectionRef} className="min-h-[200px]">
      <Suspense fallback={fallback || <OptimizedSkeleton height={height} />}>
        {shouldLoad ? children : <OptimizedSkeleton height={height} />}
      </Suspense>
    </div>
  );
}

// Optimized image lazy loading component
interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedLazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false
}: OptimizedLazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {(isInView || priority) && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setIsLoaded(true)}
            style={{ aspectRatio: `${width}/${height}` }}
          />
        </>
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && (isInView || priority) && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio: `${width}/${height}` }}
        />
      )}
    </div>
  );
}

// Performance-optimized component wrapper
interface PerformanceWrapperProps {
  name: string;
  children: ReactNode;
  measureRender?: boolean;
}

export function PerformanceWrapper({ 
  name, 
  children, 
  measureRender = false 
}: PerformanceWrapperProps) {
  useEffect(() => {
    if (!measureRender || typeof window === 'undefined') return;

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame (16ms)
        console.warn(`Slow render detected in ${name}: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [name, measureRender]);

  return <>{children}</>;
}

// Optimized animation component that respects user preferences
interface OptimizedAnimationProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function OptimizedAnimation({ 
  children, 
  className = '', 
  disabled = false 
}: OptimizedAnimationProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldAnimate = !disabled && !prefersReducedMotion;

  return (
    <div className={shouldAnimate ? className : ''}>
      {children}
    </div>
  );
}

// Export all components
export {
  OptimizedSkeleton,
};
