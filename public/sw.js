var STATIC_CACHE = 'mfzch-static';
var STATIC_CACHE_URLS = [
	'/',
	'/manifest.json',
	'/style.css',
	'/sw.js',
	'/offline',
	'/img/bigchub-192.png',
	'/img/bigchub-512.png',
	'/img/Hit-cover.svg',
	'/img/Hit-frame.svg',
	'/img/Hit-h2h.svg',
	'/img/Hit-range.svg',
	'/img/Hit-terrain.svg',
	'/img/MFZRA-logo.svg',
	'/img/Tactics-inverted-wedge.svg',
	'/img/Tactics-slant.svg',
	'/img/Tactics-split.svg',
	'/img/Tactics-wall.svg',
	'/img/Tactics-wedge.svg',
	'/jq/jquery-1.11.1.min.js',
	'/jq/jquery-visibility.min.js',
	'/jq/jquery.mobile-1.4.5.min.js',
	'/jq/jquery.mobile.structure-1.4.5.min.css',
	'/jq/mfzch/behavior-company.js',
	'/jq/mfzch/behavior-game.js',
	'/jq/mfzch/behavior-loadouts.js',
	'/jq/mfzch/behavior-pregame.js',
	'/jq/mfzch/behavior-settings.js',
	'/jq/mfzch/behavior-simulator.js',
	'/jq/mfzch/event-tracking.js',
	'/jq/mfzch/generics.js',
	'/jq/mfzch/globals.js',
	'/jq/mfzch/mfzch.js',
	'/jq/mfzch/model-appstate.js',
	'/jq/mfzch/model-company.js',
	'/jq/mfzch/model-frame.js',
	'/jq/mfzch/model-game.js',
	'/jq/mfzch/model-settings.js',
	'/jq/mfzch/model-team.js',
	'/jq/mfzch/setup.js',
	'/nosleep/NoSleep.min.js',
	'/themes/fonts/fpTVHK8qsXbIeTHTrnQH6Nog-We9VNve39Jr4Vs_aDc.woff',
	'/themes/fonts/M2Jd71oPJhLKp0zdtTvoMzNrcjQuD0pTu1za2FULaMs.woff',
	'/themes/fonts/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff',
	'/themes/fonts/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff',
	'/themes/images/ajax-loader.gif',
	'/themes/jquery.mobile.icons.min.css',
	'/themes/MFZApp.min.css'
];

self.addEventListener('install', function(event) {
	// cache resources
	event.waitUntil(
		caches.open(STATIC_CACHE)
			.then(function(cache) {
				return cache.addAll(STATIC_CACHE_URLS);
			})
	);
});

self.addEventListener('fetch', function(event) {
	var requestURL = new URL(event.request.url);

	if (requestURL.origin == location.origin) {
		// for homepage
		if (/^\/[^\/]*$/.test(requestURL.pathname)) {
			event.respondWith(
				// use cache, falling back to network
				caches.match(event.request, {ignoreSearch: true})
				.then(function(response) {
					return response || fetch(event.request);
				})
			);
			return;
		} else if (/^\/state$/.test(requestURL.pathname)) {
			event.respondWith(
				// network or fail
				fetch(event.request)
			);
			return;
		} else {
			// fall back to 'content unavailable' page
			event.respondWith(
				// Try the cache
				caches.match(event.request, {ignoreSearch: true})
				.then(function(response) {
					// Fall back to network
					return response || fetch(event.request);
				}).catch(function() {
					// If both fail, show a generic fallback:
					return caches.match('/offline');
				})
			);
		}
	}
});

