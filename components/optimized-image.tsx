"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

// Generate a simple blur placeholder
function generateBlurDataURL(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a simple gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a1a1a');
  gradient.addColorStop(0.5, '#2a2a2a');
  gradient.addColorStop(1, '#1a1a1a');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = blurDataURL || (typeof window !== 'undefined' ? generateBlurDataURL(width, height) : '');

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
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

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Error fallback
  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-800 flex items-center justify-center ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <div className="text-gray-400 text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Failed to load</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          sizes={sizes}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && (isInView || priority) && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse"
          style={{ 
            backgroundImage: `url(${defaultBlurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
    </div>
  );
}

// Responsive image component with automatic sizing
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'width' | 'height' | 'sizes'> {
  aspectRatio?: number; // width/height ratio
  maxWidth?: number;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ResponsiveImage({
  aspectRatio = 16/9,
  maxWidth = 1920,
  breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 },
  ...props
}: ResponsiveImageProps) {
  // Generate responsive sizes string
  const sizes = `
    (max-width: ${breakpoints.sm}px) 100vw,
    (max-width: ${breakpoints.md}px) 80vw,
    (max-width: ${breakpoints.lg}px) 70vw,
    (max-width: ${breakpoints.xl}px) 60vw,
    ${maxWidth}px
  `.replace(/\s+/g, ' ').trim();

  const width = maxWidth;
  const height = Math.round(maxWidth / aspectRatio);

  return (
    <OptimizedImage
      {...props}
      width={width}
      height={height}
      sizes={sizes}
    />
  );
}

// Hero image component with optimized loading
interface HeroImageProps extends Omit<OptimizedImageProps, 'priority' | 'loading'> {
  overlay?: boolean;
  overlayOpacity?: number;
}

export function HeroImage({
  overlay = false,
  overlayOpacity = 0.3,
  className = '',
  ...props
}: HeroImageProps) {
  return (
    <div className={`relative ${className}`}>
      <OptimizedImage
        {...props}
        priority={true}
        loading="eager"
        quality={90}
        className="object-cover"
      />
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

// Gallery image component with lazy loading
interface GalleryImageProps extends OptimizedImageProps {
  index: number;
  totalImages: number;
}

export function GalleryImage({
  index,
  totalImages: _totalImages, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...props
}: GalleryImageProps) {
  // Prioritize first few images
  const priority = index < 3;
  
  return (
    <OptimizedImage
      {...props}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      quality={75}
    />
  );
}
