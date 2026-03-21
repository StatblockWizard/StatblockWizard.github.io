const statblockwizardappversion = "3.1.7"; // Update this to force the service worker to update and re-cache everything

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('pwa-cache');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('pwa-cache');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request.clone());
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

self.addEventListener("install", (event) => {
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
        ])
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
