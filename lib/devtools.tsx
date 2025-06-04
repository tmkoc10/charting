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
export function DevTools() {
  // Only render in development
  if (process.env.NODE_ENV === 'production') {
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

// Simplified production-safe wrapper
export function ConditionalDevTools() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return <DevTools />;
}
