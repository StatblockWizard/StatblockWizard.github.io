const statblockwizardappversion = "3.1.9"; // Update this to force the service worker to update and re-cache everything

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('pwa-cache');
  await cache.addAll(resources);
};

const getFixedUrl = (req) => {
    var url = new URL(req.url)
    url.protocol = self.location.protocol
    return url.href
}

self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches if needed
                    if (cacheName !== "pwa-cache") {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activated');
            return self.clients.claim();
        })
    );
})

self.addEventListener('fetch', event => {
    if (HOSTNAME_WHITELIST.indexOf(new URL(event.request.url).hostname) > -1) {
        const cached = caches.match(event.request)
        const fixedUrl = getFixedUrl(event.request)
        const fetched = fetch(fixedUrl, { cache: 'no-store' })
        const fetchedCopy = fetched.then(resp => resp.clone())

        // Call respondWith() with whatever we get first.
        // If the fetch fails (e.g disconnected), wait for the cache.
        // If there’s nothing in cache, wait for the fetch.
        // If neither yields a response, return offline pages.
        event.respondWith(
            Promise.race([fetched.catch(_ => cached), cached])
                .then(resp => resp || fetched)
                .catch(error => { 
                    console.warn('Fetch failed for:', event.request.url, error);
                    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                })
        )

        // Update the cache with the version we fetched (only for ok status)
        event.waitUntil(
            Promise.all([fetchedCopy, caches.open("pwa-cache")])
                .then(([response, cache]) => {
                    if (response.ok) {
                        return cache.put(event.request, response);
                    }
                })
                .catch(error => { 
                    console.warn('Cache update failed for:', event.request.url, error);
                })
        )
    }
})

const addResourceToCache = async (resources) => {
    const cache = await caches.open("pwa-cache");
    await cache.addAll(resources);
}

self.addEventListener("install", (event) => {
    console.log('Service Worker installing...');
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
    
    event.waitUntil(
        addResourceToCache([
            "/",
            "/2024Creator.html",
            "/2024Viewer.html",
            "/Creator.html",
            "/favicon.ico",
            "/index.html",
            "/Legal.html",
            "/Viewer.html",
            "/2014/css/StatblockWizard.css",
            "/2014/css/StatblockWizardCreator.css",
            "/2014/css/StatblockWizardFonts.css",
            "/2014/css/StatblockWizardPrint.css",
            "/2014/css/StatblockWizardViewer.css",
            "/2014/js/StatblockWizard.js",
            "/2014/js/StatblockWizardCreator.js",
            "/2014/js/StatblockWizardViewer.js",
            "/2024/css/StatblockWizard.css",
            "/2024/css/StatblockWizardCreator.css",
            "/2024/css/StatblockWizardFonts.css",
            "/2024/css/StatblockWizardPrint.css",
            "/2024/css/StatblockWizardViewer.css",
            "/2024/js/StatblockWizard.js",
            "/2024/js/StatblockWizardCreator.js",
            "/2024/js/StatblockWizardViewer.js",
            "/css/StatblockWizardMain.css",
            "/js/StatblockWizardMain.js",
            "/js/StatblockWizardTools.js",
            "/res/Archmage.statblockwizard",
            "/res/Archmage.statblockwizard.png",
            "/res/Cat.statblockwizard",
            "/res/Cat.statblockwizard.png",
            "/res/Cat1.statblockwizard",
            "/res/Cat1.statblockwizard.png",
            "/res/Goblin%20Warrior.statblockwizard",
            "/res/Goblin%20Warrior.statblockwizard.png",
            "/res/Incubus.statblockwizard",
            "/res/Incubus.statblockwizard.png",
            "/res/OFL.txt",
            "/res/StatblockWizard-Creator-Buttons.pdf",
            "/res/StatblockWizard.png",
            "/res/StatblockWizard_192.png",
            "/res/StatblockWizard_256_m.png",
            "/res/StatblockWizard_512.png",
            "/res/Statblock_Wizard_demo_2014.statblockwizard",
            "/res/Statblock_Wizard_demo_2024.statblockwizard"
        ]).then(() => {
            console.log('Service Worker installed successfully');
        }).catch(error => {
            console.error('Service Worker installation failed:', error);
            throw error;
        })
    );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
    })
  );
});
