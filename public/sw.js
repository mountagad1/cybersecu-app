// Minimal service worker: exists so the app satisfies the "has a
// registered service worker with a fetch handler" PWA-installability
// heuristic used by some browsers. Deliberately does no caching —
// simulations and scoring depend on live, authoritative server data
// (docs/SECURITY_MODEL.md §3), so an offline app shell isn't attempted
// here. Every request just passes straight through to the network.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // no-op: let the browser handle the request normally
});
