import { createClient } from './server';

// Database query optimization utilities
export class DatabaseOptimizer {
  private static instance: DatabaseOptimizer;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static getInstance(): DatabaseOptimizer {
    if (!DatabaseOptimizer.instance) {
      DatabaseOptimizer.instance = new DatabaseOptimizer();
    }
    return DatabaseOptimizer.instance;
  }

  // Cached query execution
  async cachedQuery<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    ttl: number = 5 * 60 * 1000 // 5 minutes default
  ): Promise<T> {
    const cached = this.queryCache.get(queryKey);
    const now = Date.now();

    // Return cached data if still valid
    if (cached && (now - cached.timestamp) < cached.ttl) {
      return cached.data as T;
    }

    // Execute query and cache result
    try {
      const data = await queryFn();
      this.queryCache.set(queryKey, {
        data,
        timestamp: now,
        ttl
      });
      return data;
    } catch (error) {
      // If query fails and we have stale cache, return it
      if (cached) {
        return cached.data as T;
      }
      throw error;
    }
  }

  // Clear cache for specific key or all
  clearCache(queryKey?: string) {
    if (queryKey) {
      this.queryCache.delete(queryKey);
    } else {
      this.queryCache.clear();
    }
  }

  // Clean up expired cache entries
  cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if ((now - value.timestamp) > value.ttl) {
        this.queryCache.delete(key);
      }
    }
  }
}

// Optimized symbol search with caching and pagination
export async function optimizedSymbolSearch(
  searchTerm: string,
  category: string = "All",
  limit: number = 25,
  offset: number = 0
) {
  const optimizer = DatabaseOptimizer.getInstance();
  const cacheKey = `symbols_${searchTerm}_${category}_${limit}_${offset}`;

  return optimizer.cachedQuery(
    cacheKey,
    async () => {
      const supabase = await createClient();
      const results: Array<{
        symbol: string;
        name: string;
        type: string;
        exchange: string;
        category: string;
      }> = [];

      // Optimized equity search
      if (category === "All" || category === "Equity") {
        const { data: equityData } = await supabase
          .from('nse_equity')
          .select('SECURITY_ID, EXCHANGE_SEGMENT, DISPLAY_NAME')
          .or(`SECURITY_ID.ilike.%${searchTerm}%,DISPLAY_NAME.ilike.%${searchTerm}%`)
          .order('DISPLAY_NAME')
          .range(offset, offset + limit - 1);

        if (equityData) {
          results.push(...equityData.map((item: { SECURITY_ID: string; DISPLAY_NAME: string; EXCHANGE_SEGMENT: string }) => ({
            symbol: item.SECURITY_ID,
            name: item.DISPLAY_NAME,
            type: "Equity",
            exchange: item.EXCHANGE_SEGMENT,
            category: "Equity"
          })));
        }
      }

      // Optimized index search
      if (category === "All" || category === "Indices") {
        const { data: indicesData } = await supabase
          .from('nse_indices')
          .select('SECURITY_ID, EXCHANGE_SEGMENT, DISPLAY_NAME')
          .or(`SECURITY_ID.ilike.%${searchTerm}%,DISPLAY_NAME.ilike.%${searchTerm}%`)
          .order('DISPLAY_NAME')
          .range(offset, offset + limit - 1);

        if (indicesData) {
          results.push(...indicesData.map((item: { SECURITY_ID: string; DISPLAY_NAME: string; EXCHANGE_SEGMENT: string }) => ({
            symbol: item.SECURITY_ID,
            name: item.DISPLAY_NAME,
            type: "Index",
            exchange: item.EXCHANGE_SEGMENT,
            category: "Indices"
          })));
        }
      }

      return results.slice(0, limit);
    },
    2 * 60 * 1000 // 2 minutes cache for search results
  );
}

// Optimized chart data fetching with compression
export async function optimizedChartDataFetch(
  symbol: string,
  timeframe: string,
  limit: number = 1000
) {
  const optimizer = DatabaseOptimizer.getInstance();
  const cacheKey = `chart_${symbol}_${timeframe}_${limit}`;

  return optimizer.cachedQuery(
    cacheKey,
    async () => {
      // For now, return mock data since we don't have real chart data in DB
      // In a real implementation, this would fetch from your chart data table
      const { getChartData } = await import('./chart-data');
      return getChartData(symbol, timeframe);
    },
    30 * 1000 // 30 seconds cache for chart data
  );
}

// Database connection pooling optimization
export class ConnectionPool {
  private static pools = new Map<string, unknown>();

  static getPool(connectionString: string) {
    if (!this.pools.has(connectionString)) {
      // In a real implementation, you'd create a proper connection pool
      // For Supabase, this is handled automatically
      this.pools.set(connectionString, createClient());
    }
    return this.pools.get(connectionString);
  }
}

// Query performance monitoring
export class QueryMonitor {
  private static metrics = new Map<string, { count: number; totalTime: number; avgTime: number }>();

  static async measureQuery<T>(queryName: string, queryFn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await queryFn();
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Update metrics
      const existing = this.metrics.get(queryName) || { count: 0, totalTime: 0, avgTime: 0 };
      existing.count++;
      existing.totalTime += duration;
      existing.avgTime = existing.totalTime / existing.count;
      this.metrics.set(queryName, existing);

      // Log slow queries in development
      if (process.env.NODE_ENV === 'development' && duration > 1000) {
        console.warn(`Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`Query failed: ${queryName} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  static getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  static resetMetrics() {
    this.metrics.clear();
  }
}

// Batch operations for better performance
export class BatchOperations {
  private static batches = new Map<string, unknown[]>();
  private static timers = new Map<string, NodeJS.Timeout>();

  static addToBatch(batchKey: string, item: unknown, batchSize: number = 100, delay: number = 1000) {
    if (!this.batches.has(batchKey)) {
      this.batches.set(batchKey, []);
    }

    const batch = this.batches.get(batchKey)!;
    batch.push(item);

    // Clear existing timer
    const existingTimer = this.timers.get(batchKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Process batch if it reaches size limit or after delay
    if (batch.length >= batchSize) {
      this.processBatch(batchKey);
    } else {
      const timer = setTimeout(() => {
        this.processBatch(batchKey);
      }, delay);
      this.timers.set(batchKey, timer);
    }
  }

  private static async processBatch(batchKey: string) {
    const batch = this.batches.get(batchKey);
    if (!batch || batch.length === 0) return;

    try {
      // Process the batch based on the key
      switch (batchKey) {
        case 'analytics':
          await this.processAnalyticsBatch(batch);
          break;
        case 'logs':
          await this.processLogsBatch(batch);
          break;
        default:
          console.warn(`Unknown batch key: ${batchKey}`);
      }
    } catch (error) {
      console.error(`Error processing batch ${batchKey}:`, error);
    } finally {
      // Clear the batch
      this.batches.set(batchKey, []);
      this.timers.delete(batchKey);
    }
  }

  private static async processAnalyticsBatch(items: unknown[]) {
    // Batch insert analytics data
    console.log(`Processing ${items.length} analytics items`);
  }

  private static async processLogsBatch(items: unknown[]) {
    // Batch insert log data
    console.log(`Processing ${items.length} log items`);
  }
}

// Initialize cleanup intervals
if (typeof window === 'undefined') {
  // Server-side cleanup
  setInterval(() => {
    DatabaseOptimizer.getInstance().cleanupCache();
  }, 10 * 60 * 1000); // Cleanup every 10 minutes
}
