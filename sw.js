/* Quiz Studio offline cache.  Change VERSION whenever you want every device to re-download the files. */
var VERSION='qs-1';
var SHELL=['./','index.html','config.js','manifest.webmanifest','icon-192.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VERSION).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==VERSION;}).map(function(x){return caches.delete(x);}));}).then(function(){return self.clients.claim();}));});
function putSafe(req,res){if(res&&res.ok){var c=res.clone();caches.open(VERSION).then(function(x){x.put(req,c);}).catch(function(){});}return res;}
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  /* the Firebase library files and Google fonts: keep a copy so the player can start offline */
  if(/(^|\.)gstatic\.com$/.test(u.hostname)||u.hostname==='fonts.googleapis.com'){
    e.respondWith(caches.match(r).then(function(h){var n=fetch(r).then(function(res){return putSafe(r,res);}).catch(function(){return h;});return h||n;}));return;}
  if(u.origin!==location.origin)return;
  /* pages: network first (so updates arrive), cached copy when offline; ?k= and ?v= use the same page */
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(function(res){if(res&&res.ok){var c=res.clone();caches.open(VERSION).then(function(x){x.put('index.html',c);});}return res;}).catch(function(){return caches.match('index.html').then(function(h){return h||caches.match('./');});}));return;}
  /* own files: network first, cache fallback */
  e.respondWith(fetch(r).then(function(res){return putSafe(r,res);}).catch(function(){return caches.match(r);}));
});
