'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "c3c268963e36f7d9cf4f2d3794a6a542",
"assets/assets/animals/cat.png": "4042e50285e3ac448ef4a702e39995a3",
"assets/assets/animals/dog.png": "4698f886c65c674cac32cc8af098b00c",
"assets/assets/animals/fox.png": "6d02e378d61e2a695368c26125afefaa",
"assets/assets/animals/koala.png": "a4665938d6847bdc5d9d640bf15ce675",
"assets/assets/animals/lion.png": "f3dfb47ced9e433116fae981adab1099",
"assets/assets/animals/monkey.png": "42b10094adb8b92849e225b1bc9aec45",
"assets/assets/animals/mouse.png": "d9de56ceb5a7ea03bbb0d15dbdfac6b8",
"assets/assets/animals/panda.png": "36cbc3326120e883d3a35baf0cd35421",
"assets/assets/animals/penguin.png": "bc420d7690b2e827c2c07011d547ea91",
"assets/assets/animals/tiger.png": "67e556f9b25880ece57518c2997c0b09",
"assets/assets/icons/PuzzleIcons.ttf": "0cd4c200dd39858cfa9a3383949a6273",
"assets/assets/images/dash.png": "ac9d3e804bfc692c064b9647e3ebff5b",
"assets/assets/images/hero-dash.png": "e1055c1f747db02f909a9b1bfe7c5957",
"assets/assets/images/jungle.png": "b3379a4c957081ff67cd4a41b090f1e0",
"assets/assets/images/map%2520hero1.png": "3d181fb4a38b1c155b7f25869482d291",
"assets/assets/images/numeric-puzzle.png": "13eb794a84ee7065257aaf13c643afd8",
"assets/assets/images/relax-dash.png": "7e65209f817c8110bdbff497e3e6587e",
"assets/assets/rive/winner.riv": "924ab08f7f55486361ecfaef683f9006",
"assets/assets/sounds/cat.mp3": "e89c371ad479f93bdd2efe83a19f85e6",
"assets/assets/sounds/dog.mp3": "217100ef5619472ad69963bf867c4baa",
"assets/assets/sounds/fox.mp3": "a3c09b40437435ed92dbbd272a4bff9b",
"assets/assets/sounds/koala.mp3": "71499ad33402d0f908a4b93dcf0a0844",
"assets/assets/sounds/lion.mp3": "b3b0344facf4bebd503ccc0249428577",
"assets/assets/sounds/monkey.mp3": "57628205f96845289d8305d6f5698586",
"assets/assets/sounds/mouse.mp3": "09d87285389d3f0337fc061ef3ed9f82",
"assets/assets/sounds/panda.mp3": "76543d48453f541c7eb43605e42ab01b",
"assets/assets/sounds/penguin.mp3": "167c625e1ca001544647dd511ef71307",
"assets/assets/sounds/pull-out.mp3": "3f1e8a6fc49c7f3cd46bee3c8206fc26",
"assets/assets/sounds/tiger.mp3": "afe3a35b7440f7e35e125db9bceed9f8",
"assets/FontManifest.json": "4f2dfa50841c7bf9fff466703d81ab7e",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "1587d5d3809e5d33edf5807ad9b18832",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "5a1cbf697516c20941797ed2333ec493",
"/": "5a1cbf697516c20941797ed2333ec493",
"main.dart.js": "8436cdafc0e7f7485edb26244adc837c",
"manifest.json": "a5f05c3953f311836350d8b55510f511",
"version.json": "6f966e8a6ddee64055f48db7c9357424"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
