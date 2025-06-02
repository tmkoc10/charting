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

  // Removed typeof window check to prevent hydration mismatch
  // The ConditionalDevTools wrapper handles environment checks properly
  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-left"
        position="bottom"
      />
    </Suspense>
  );
}

// Production-safe wrapper that returns null in production
export function ConditionalDevTools() {
  // This check happens at build time for static optimization
  // Only rely on build-time environment variables to avoid hydration mismatches
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Check additional environment variables that are available at build time
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

  // Check for additional flag to hide DevTools branding
  if (process.env.NEXT_PUBLIC_HIDE_DEVTOOLS_BRANDING === 'true') {
    return null;
  }

  // Always return DevTools in development to ensure consistent SSR/client rendering
  return <DevTools />;
}
