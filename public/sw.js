var STATIC_CACHE = 'mfzch-static';
var STATIC_CACHE_URLS = [
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
		caches.open(STATIC_CACHE)
			.then(function(cache) {
				return cache.addAll(STATIC_CACHE_URLS);
			})
	);
});

self.addEventListener('fetch', function(evt) {
	evt.respondWith(
		fetch(evt.request).catch(function() {
			return caches.match(evt.request);
		})
	);
});
