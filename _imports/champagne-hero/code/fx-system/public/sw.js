// St Mary's House Dental Care - Service Worker
// Maintains luxury brand experience even when offline

const STATIC_CACHE = 'smh-static-v1.0.0';
const DYNAMIC_CACHE = 'smh-dynamic-v1.0.0';
const IMAGE_CACHE = 'smh-images-v1.0.0';

const BRAND_MAGENTA = 'var(--smh-primary-magenta)';
const BRAND_TEAL = 'var(--smh-primary-teal)';
const BRAND_GOLD = 'var(--smh-accent-gold)';
const BRAND_GRADIENT = 'var(--smh-gradient)';

// Critical assets for offline functionality
const CRITICAL_ASSETS = [
  '/',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
];

// Brand assets that should be cached
const BRAND_ASSETS = [
  '/hero-poster.jpg',
];

// Routes that work offline
const OFFLINE_ROUTES = [
  '/',
  '/treatments',
  '/about',
  '/contact',
  '/emergency-dentist',
  '/anxiety-dentistry',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('SMH Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('SMH Service Worker: Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      }),
      
      // Cache brand assets
      caches.open(IMAGE_CACHE).then((cache) => {
        console.log('SMH Service Worker: Caching brand assets');
        return cache.addAll(BRAND_ASSETS);
      })
    ]).then(() => {
      console.log('SMH Service Worker: Installation complete');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SMH Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('SMH Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SMH Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content with fallbacks
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Network first for API calls
    if (url.pathname.startsWith('/api/')) {
      return await networkFirst(request);
    }
    
    // Strategy 2: Cache first for static assets
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request);
    }
    
    // Strategy 3: Stale while revalidate for pages
    if (isPageRequest(url.pathname)) {
      return await staleWhileRevalidate(request);
    }
    
    // Strategy 4: Network first with cache fallback for everything else
    return await networkFirst(request);
    
  } catch (error) {
    console.log('SMH Service Worker: Fetch error:', error);
    return await getOfflineFallback(request);
  }
}

// Cache first strategy for static assets
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(getAppropriateCache(request.url));
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network first strategy for dynamic content
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stale while revalidate for pages
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Determine appropriate cache for different asset types
function getAppropriateCache(url) {
  if (url.includes('/images/') || url.includes('.jpg') || url.includes('.png') || url.includes('.webp')) {
    return IMAGE_CACHE;
  }
  if (url.includes('/_next/static/')) {
    return STATIC_CACHE;
  }
  return DYNAMIC_CACHE;
}

// Check if request is for a static asset
function isStaticAsset(pathname) {
  return pathname.startsWith('/_next/static/') ||
         pathname.includes('.css') ||
         pathname.includes('.js') ||
         pathname.includes('.jpg') ||
         pathname.includes('.png') ||
         pathname.includes('.webp') ||
         pathname.includes('.svg') ||
         pathname.includes('.ico');
}

// Check if request is for a page
function isPageRequest(pathname) {
  return OFFLINE_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

// Offline fallback with brand-consistent design
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Try to get cached version first
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  // For page requests, return offline page
  if (isPageRequest(url.pathname)) {
    return new Response(getOfflineHTML(), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
  
  // For images, return placeholder
  if (url.pathname.includes('.jpg') || url.pathname.includes('.png') || url.pathname.includes('.webp')) {
    return new Response(getOfflineImageSVG(), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
  
  // Default offline response
  return new Response('Offline', { status: 503 });
}

// Brand-consistent offline HTML page
function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - St Mary's House Dental Care</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', system-ui, Arial, sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #fdf2f8 50%, #f0fdfa 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
        }
        
        .container {
          text-align: center;
          max-width: 500px;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(236, 72, 153, 0.1);
        }
        
        .logo {
          width: 80px;
          height: 80px;
          background: ${BRAND_GRADIENT};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          animation: pulse 2s infinite;
        }
        
        .logo::before {
          content: 'SMH';
          color: white;
          font-family: 'Inter', system-ui, Arial, sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
        }

        h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, ${BRAND_MAGENTA}, ${BRAND_TEAL}, ${BRAND_GOLD});
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }
        
        p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          color: #64748b;
        }
        
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .feature {
          padding: 1rem;
          background: color-mix(in srgb, ${BRAND_MAGENTA} 5%, transparent);
          border-radius: 12px;
          border: 1px solid color-mix(in srgb, ${BRAND_MAGENTA} 10%, transparent);
        }
        
        .feature-icon {
          width: 40px;
          height: 40px;
          background: ${BRAND_GRADIENT};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
          color: white;
          font-size: 1.2rem;
        }
        
        .feature h3 {
          font-family: 'var(--font-inter), system-ui, Arial';
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .feature p {
          font-size: 0.8rem;
          margin: 0;
          color: #64748b;
        }
        
        .retry-btn {
          background: ${BRAND_GRADIENT};
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-family: 'var(--font-inter), system-ui, Arial';
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .retry-btn:hover {
          transform: scale(1.05);
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: float 6s infinite ease-in-out;
        }
        
        .particle:nth-child(1) { background: ${BRAND_MAGENTA}; top: 20%; left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { background: ${BRAND_TEAL}; top: 60%; left: 80%; animation-delay: 2s; }
        .particle:nth-child(3) { background: ${BRAND_GOLD}; top: 80%; left: 20%; animation-delay: 4s; }
        .particle:nth-child(4) { background: ${BRAND_MAGENTA}; top: 30%; left: 70%; animation-delay: 1s; }
        .particle:nth-child(5) { background: ${BRAND_TEAL}; top: 70%; left: 50%; animation-delay: 3s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
      </style>
    </head>
    <body>
      <div class="particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
      
      <div class="container">
        <div class="logo"></div>
        <h1>You're Offline</h1>
        <p>Don't worry! Some content is still available while you're offline. We've cached your essential dental care information.</p>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">🦷</div>
            <h3>Treatment Info</h3>
            <p>Cached details</p>
          </div>
          <div class="feature">
            <div class="feature-icon">📞</div>
            <h3>Emergency</h3>
            <p>01273 453109</p>
          </div>
          <div class="feature">
            <div class="feature-icon">📍</div>
            <p>Shoreham-by-Sea</p>
          </div>
        </div>
        
        <button class="retry-btn" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `;
}

// Brand-consistent offline image placeholder
function getOfflineImageSVG() {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${BRAND_MAGENTA};stop-opacity:0.1" />
          <stop offset="50%" style="stop-color:${BRAND_TEAL};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${BRAND_GOLD};stop-opacity:0.1" />
        </linearGradient>
        <linearGradient id="icon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${BRAND_MAGENTA}" />
          <stop offset="100%" style="stop-color:${BRAND_TEAL}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <circle cx="200" cy="120" r="30" fill="url(#icon)" opacity="0.8" />
      <text x="200" y="180" text-anchor="middle" font-family="var(--font-inter), system-ui, Arial" font-size="16" font-weight="600" fill="#64748b">
        Image Offline
      </text>
      <text x="200" y="200" text-anchor="middle" font-family="var(--font-inter), system-ui, Arial" font-size="12" fill="#94a3b8">
        Cached version unavailable
      </text>
    </svg>
  `;
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log('SMH Service Worker: Background sync triggered');
  // Handle queued form submissions, appointment bookings, etc.
}

// Push notifications for appointment reminders
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/smh-logo.png',
      badge: '/smh-logo.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: 'confirm',
          title: 'Confirm Appointment',
          icon: '/icons/confirm.png'
        },
        {
          action: 'reschedule',
          title: 'Reschedule',
          icon: '/icons/reschedule.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'confirm') {
    // Handle appointment confirmation
    event.waitUntil(
      clients.openWindow('/appointments/confirm')
    );
  } else if (event.action === 'reschedule') {
    // Handle appointment rescheduling
    event.waitUntil(
      clients.openWindow('/appointments/reschedule')
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('SMH Service Worker: Loaded successfully');

