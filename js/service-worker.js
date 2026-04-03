const statblockwizardappversion = "3.1.15";

const CACHE_NAME = `pwa-cache-${statblockwizardappversion}`;

const cacheFirstStrategy = async (request) => {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Cache hit:', request.url);
            return cachedResponse;
        }

        console.log('Cache miss, fetching from network:', request.url);
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.status >= 200 && networkResponse.status < 300) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone()).catch(err => {
                console.warn('Failed to cache response:', request.url, err);
            });
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Network unavailable, using cached response:', request.url);
            return cachedResponse;
        }

        console.error('Offline - resource not available in cache:', request.url);
        return new Response(
            'Offline - resource not available',
            { status: 503, statusText: 'Service Unavailable' }
        );
    }
};

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(resources);
};

self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
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
});

self.addEventListener('fetch', event => {
    event.respondWith(cacheFirstStrategy(event.request));
});

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
    
    event.waitUntil(
        addResourcesToCache([
            '/',
            '/index.html',
            '/Creator.html',
            '/Viewer.html',
            '/2024Creator.html',
            '/2024Viewer.html',
            '/Legal.html',
            '/favicon.ico',
            '/css/StatblockWizardMain.css',
            '/js/StatblockWizardMain.js',
            '/js/StatblockWizardTools.js',
            '/2024/css/StatblockWizard.css',
            '/2024/css/StatblockWizardCreator.css',
            '/2024/css/StatblockWizardFonts.css',
            '/2024/css/StatblockWizardPrint.css',
            '/2024/css/StatblockWizardViewer.css',
            '/2024/js/StatblockWizard.js',
            '/2024/js/StatblockWizardCreator.js',
            '/2024/js/StatblockWizardViewer.js',
            '/2014/css/StatblockWizard.css',
            '/2014/css/StatblockWizardCreator.css',
            '/2014/css/StatblockWizardFonts.css',
            '/2014/css/StatblockWizardPrint.css',
            '/2014/css/StatblockWizardViewer.css',
            '/2014/js/StatblockWizard.js',
            '/2014/js/StatblockWizardCreator.js',
            '/2014/js/StatblockWizardViewer.js',
            '/res/Archmage.statblockwizard',
            '/res/Cat.statblockwizard',
            '/res/Cat1.statblockwizard',
            '/res/GoblinWarrior.statblockwizard',
            '/res/GoblinWarrior.statblockwizard.png',
            '/res/Incubus.statblockwizard',
            '/res/OFL.txt',
            '/res/StatblockWizard-Creator-Buttons.pdf',
            '/res/StatblockWizard.png',
            '/res/StatblockWizard_192.png',
            '/res/StatblockWizard_256_m.png',
            '/res/StatblockWizard_512.png',
            '/res/Statblock_Wizard_demo_2014.statblockwizard',
            '/res/Statblock_Wizard_demo_2024.statblockwizard'
        ]).then(() => {
            console.log('Service Worker installed successfully');
        }).catch(error => {
            console.error('Service Worker installation failed:', error);
        })
    );
});
