const CACHE_NAME = 'viewmarket-v2';
const STATIC_CACHE_NAME = 'static-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-v2';

// Assets to cache immediately for faster loading
const STATIC_ASSETS = [
  '/',
  '/charts',
  '/manifest.json',
  '/images/hero-viewmarket-charts.png',
  '/_next/static/css/app/layout.css',
  // Add other critical assets here
];

// Assets to cache dynamically
const CACHE_STRATEGIES = {
  // Cache images for a long time
  images: {
    pattern: /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i,
    strategy: 'CacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  // Cache API responses for a short time
  api: {
    pattern: /\/api\//,
    strategy: 'NetworkFirst',
    maxAge: 5 * 60 * 1000, // 5 minutes
  },
  // Cache static assets for a long time
  static: {
    pattern: /\.(js|css|woff|woff2|ttf|eot)$/i,
    strategy: 'CacheFirst',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  },
  // Cache HTML pages with network first strategy
  pages: {
    pattern: /\.html$|\/$/,
    strategy: 'NetworkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine caching strategy
  let strategy = 'NetworkFirst'; // Default strategy
  let maxAge = 24 * 60 * 60 * 1000; // Default max age

  for (const [key, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.pattern.test(url.pathname) || config.pattern.test(url.href)) {
      strategy = config.strategy;
      maxAge = config.maxAge;
      break;
    }
  }

  event.respondWith(
    handleRequest(request, strategy, maxAge)
  );
});

// Handle different caching strategies
async function handleRequest(request, strategy, maxAge) {
  const cacheName = DYNAMIC_CACHE_NAME;

  switch (strategy) {
    case 'CacheFirst':
      return cacheFirst(request, cacheName, maxAge);
    case 'NetworkFirst':
      return networkFirst(request, cacheName, maxAge);
    case 'StaleWhileRevalidate':
      return staleWhileRevalidate(request, cacheName, maxAge);
    default:
      return networkFirst(request, cacheName, maxAge);
  }
}

// Cache First strategy
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Network error', { status: 408 });
  }
}

// Network First strategy
async function networkFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return true;

  const date = new Date(dateHeader);
  const now = new Date();
  return (now.getTime() - date.getTime()) > maxAge;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here
  // For example, sync offline actions when connection is restored
  console.log('Background sync triggered');
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey,
      },
      actions: [
        {
          action: 'explore',
          title: 'View',
          icon: '/icon-192x192.png',
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192x192.png',
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
