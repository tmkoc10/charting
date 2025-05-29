"use client";

import { Suspense, lazy } from 'react';

// Lazy load the devtools only in development
const ReactQueryDevtools = lazy(() =>
  process.env.NODE_ENV === 'development'
    ? import('@tanstack/react-query-devtools').then(module => ({
        default: module.ReactQueryDevtools
      }))
    : Promise.resolve({ default: () => null })
);

// Development-only React Query Devtools component
// This entire file will be tree-shaken out in production builds
export function DevTools() {
  // Multiple layers of protection to ensure this never renders in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return null;
  }

  if (process.env.VERCEL_ENV === 'production') {
    return null;
  }

  if (process.env.NEXT_PUBLIC_DISABLE_REACT_QUERY_DEVTOOLS === 'true') {
    return null;
  }

  if (process.env.DISABLE_REACT_QUERY_DEVTOOLS === 'true') {
    return null;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools initialIsOpen={false} />
    </Suspense>
  );
}

// Production-safe wrapper that returns null in production
export function ConditionalDevTools() {
  // This check happens at build time for static optimization
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Additional runtime checks for extra safety
  if (typeof window !== 'undefined') {
    // Check for production indicators
    const isProduction = 
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      !window.location.hostname.includes('dev') &&
      !window.location.hostname.includes('staging');

    if (isProduction) {
      return null;
    }
  }

  return <DevTools />;
}
