// main vars
mfzch.game = mfzch.restoreData('mfz.game', 'game');
mfzch.templateGame = mfzch.restoreData('mfz.templateGame', 'templateGame');
mfzch.frameSet = mfzch.restoreData('mfz.diceSim', 'sim');
mfzch.companies = mfzch.restoreData('mfz.companies', 'companies');
mfzch.loadouts = mfzch.restoreData('mfz.loadouts', 'loadouts');
mfzch.settings = mfzch.restoreData('mfz.settings', 'settings');

if(mfzch.settings.saveVersion == 2) { // legacy game format (2014.09.19)
	mfzch.game = new gameModel();
	mfzch.settings.saveVersion = 3;
	mfzch.saveData(mfzch.settings, 'mfz.settings');
}

$(document).on('submit', 'form', function(event){ // kill all HTML form submits
	event.preventDefault();
});

$(document).ready(function(){
	window.applicationCache.update();
	$('#version').html(PUBLICBUILDSTRING);

	if(mfzch.settings.buildVersion < BUILDVERSION) {
		if (!mfzch.settings.buildVersion) {
			try {
				ga('send', 'event', 'App', 'New Load', BUILDVERSION, 1, true);
			} catch (err) {}
		} else {
			try {
				ga('send', 'event', 'App', 'Update from', mfzch.settings.buildVersion, 1, true);
				ga('send', 'event', 'App', 'Update to', BUILDVERSION, 1, true);
			} catch (err) {}
		}

		mfzch.settings.buildVersion = BUILDVERSION;
		mfzch.saveData(mfzch.settings, 'mfz.settings');
	} else {
		try {
			ga('send', 'event', 'App', 'Run', BUILDVERSION, 1, true);
		} catch (err) {}
	}
});

// notify of available update
$(window.applicationCache).on('updateready', function(e) {
	if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		$('#update-ready').slideDown();
	}

	$(document).on('click', '#do-update', function(){
		window.applicationCache.swapCache();
		window.location.reload();
	});

	$(document).on('click', '#no-update', function(){
		$('#update-ready').slideUp();
	});
});

// Load the side-panel var to the DOM / page
$(document).one('pagebeforecreate', function () {
	$.mobile.pageContainer.prepend(mfzch.buildNavPanel());
	$("#nav-panel").panel();
	$('.nav-listview').listview();

	if (mfzch.settings.compactUI) {
		$('body').addClass('compact-ui');
	}
});

$( document ).on( "pagecreate", function() {
	// swipe menu open
	$( document ).on( "swiperight", function( e ) {
		if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open"
			 && $(".ui-page-active .ui-popup-active").length <= 0) {
			$( "#nav-panel" ).panel( "open" );
		}
	});

	// prevent menu swipe on sliders
	$(document).on('swiperight', '[data-role=slider]', function(ev){
		ev.stopPropagation();
	});
});

$(document).on('pagecreate', '#main-page', function(event){
	$('#main-nav').html(mfzch.buildNav()).enhanceWithin();
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if(mfzch.settings.enableSplitSystems) {
		$('[data-sys-split=true]').show();
	} else {
		$('[data-sys-split=true]').hide();
	}

	/* *** */
	if(mfzch.settings.enableEnvironmental) {
		$('[data-sys-env=true]').show();
	} else {
		$('[data-sys-env=true]').hide();
	}
});