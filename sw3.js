const expectedCaches = ["static-v3"];

self.addEventListener("install", event => {
  console.log("V3 Installing…");

  // don't wait
  self.skipWaiting();

  // cache a cow SVG
  event.waitUntil(caches.open("static-v3").then(cache => cache.add("cow.jpg")));
});

self.addEventListener("activate", event => {
  // delete any caches that aren't in expectedCaches
  event.waitUntil(
    caches
    .keys()
    .then(keys =>
      Promise.all(
        keys.map(key => {
          if (!expectedCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
    .then(() => {
      console.log("V3 now ready to handle fetches!");
    })
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // serve the cat SVG from the cache if the request is
  // same-origin and the path is '/dog.svg'
  if (url.origin == location.origin && url.pathname.endsWith("/dog.jpeg")) {
    event.respondWith(caches.match("cow.jpg"));
  }
});