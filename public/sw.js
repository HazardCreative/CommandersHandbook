var CACHE_NAME = 'mfzch-cache';
var urlsToCache = [
	'/',
	'/jq/jquery-1.11.1.min.js',
	'/jq/jquery.mobile-1.4.5.min.js',
	'/jq/jquery.mobile.structure-1.4.5.min.css',
	'/style.css',
	'/img/MFZRA-logo.svg',
	'/img/Hit-h2h.svg',
	'/img/Hit-range.svg',
	'/img/Hit-cover.svg',
	'/img/Hit-frame.svg',
	'/img/Hit-terrain.svg',
	'/img/Tactics-inverted-wedge.svg',
	'/img/Tactics-wedge.svg',
	'/img/Tactics-wall.svg',
	'/img/Tactics-slant.svg',
	'/img/Tactics-split.svg',
	'/themes/MFZApp.min.css',
	'/themes/jquery.mobile.icons.min.css',
	'/themes/images/ajax-loader.gif',
	'/themes/fonts/fpTVHK8qsXbIeTHTrnQH6Nog-We9VNve39Jr4Vs_aDc.woff',
	'/themes/fonts/M2Jd71oPJhLKp0zdtTvoMzNrcjQuD0pTu1za2FULaMs.woff',
	'/themes/fonts/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff',
	'/themes/fonts/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff'
];

self.addEventListener('install', function(event) {
	// Pre-cache resources
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache) {
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('fetch', function(evt) {
  evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
    return fromCache(evt.request);
  }));
});

function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);

    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}