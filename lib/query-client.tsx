"use client";

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ConditionalDevTools } from './devtools';

// Create a client with optimized settings for performance
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes by default
        staleTime: 5 * 60 * 1000,
        // Keep data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry failed requests 3 times
        retry: 3,
        // Don't refetch on window focus for better performance
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect for better performance
        refetchOnReconnect: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/*
        ReactQuery Devtools - Completely isolated and production-safe
        Will be tree-shaken out of production builds
      */}
      <ConditionalDevTools />
    </QueryClientProvider>
  );
}

// Custom hooks for chart data with caching
export function useChartDataQuery(symbol: string, timeframe: string) {
  return useQuery({
    queryKey: ['chartData', symbol, timeframe],
    queryFn: async () => {
      // Dynamic import to reduce initial bundle size
      const { getChartData } = await import('./chart-data');
      return getChartData(symbol, timeframe);
    },
    staleTime: 30 * 1000, // 30 seconds for chart data
    gcTime: 2 * 60 * 1000, // 2 minutes cache
    enabled: !!symbol && !!timeframe, // Only run query when we have both params
  });
}

export function usePriceDataQuery(symbol: string, timeframe: string) {
  return useQuery({
    queryKey: ['priceData', symbol, timeframe],
    queryFn: async () => {
      const { getLatestPrice, getPriceChange } = await import('./chart-data');
      return {
        price: getLatestPrice(symbol, timeframe),
        change: getPriceChange(symbol, timeframe),
      };
    },
    staleTime: 10 * 1000, // 10 seconds for price data
    gcTime: 60 * 1000, // 1 minute cache
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    enabled: !!symbol && !!timeframe, // Only run query when we have both params
  });
}
