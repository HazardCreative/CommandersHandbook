// set default state
mfzch.appState = mfzch.restoreLocalData('appState');

mfzch.checkElite();

var appState = new Promise(function(resolve, reject) {
	var stateVars = {};

	var urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('game')) {
		stateVars.gameid = urlParams.get('game');
	}

	if (mfzch.checkOnline()) {
		$.post('/state', stateVars)
		.done(function(result) {
			resolve(result);
		})
		.fail(function() {
			reject(Error('State retrieval failed: no response from server'));
		})
	} else {
		reject(Error('State retrieval failed: no connection'));
	}
});

function handleState(data) {
	if (data.user) {
		mfzch.appState.user = data.user;

		if (data.user.elite_expires.date) {
			mfzch.appState.eliteExpires = data.user.elite_expires.date;
			mfzch.checkElite();
		}
	}

	if (data.gameid) {
		mfzch.appState.remote = {
			mode: true,
			connection: true,
			id: data.gameid,
			password: '',
			granted: false
		}
	}
}

appState.then(function(result) {
	// server provided state
	handleState(result);
	mfzch.saveLocalData('appState');
}, function() {
	// server is unreachable
	mfzch.disableOnline();
	mfzch.remote = {
		mode: false,
		connection: false,
		id: false,
		password: false,
		granted: false
	};
});

// main vars
mfzch.game = mfzch.restoreLocalData('game');
mfzch.templateGame = mfzch.restoreLocalData('templateGame'); // game state before reset
mfzch.frameSet = mfzch.restoreLocalData('frameSet');
mfzch.companies = mfzch.restoreLocalData('companies');
mfzch.loadouts = mfzch.restoreLocalData('loadouts');
mfzch.settings = mfzch.restoreLocalData('settings');

mfzch.syncServerData('all');

if(mfzch.settings.saveVersion <= 2) { // legacy game format (2014.09.19)
	mfzch.game = new gameModel();
	mfzch.settings.saveVersion = 3;
	mfzch.saveData('settings');
}

$(document).on('submit', 'form', function(event){ // kill all HTML form submits
	event.preventDefault();
});

$(document).ready(function(){
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
		mfzch.saveData('settings');
	} else {
		try {
			ga('send', 'event', 'App', 'Run', BUILDVERSION, 1, true);
		} catch (err) {}
	}

	if (mfzch.appState.remote.mode) {
		mfzch.loadRemoteGame(function (result) {
			$( ":mobile-pagecontainer" ).pagecontainer( "change", '#game-tracking');
		});
	} else if (mfzch.game.shared) {
		if (mfzch.appState.isElite) {
			mfzch.appState.remote.mode = 'host';
			mfzch.appState.remote.id = mfzch.game.uuid;
			mfzch.appState.remote.password = mfzch.game.modifyPassword;
			mfzch.appState.remote.granted = 'modify';
		} else {
			mfzch.game.shared = false;
		}
	}

	// exit game
	$("#confirm-exit-game").enhanceWithin().popup();

	// add to home screen
	$(document).on('click', '.a2hs', function(){
		$('.a2hs').hide();
		deferredPrompt.prompt();
		deferredPrompt.userChoice
		.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				try {
					ga('send', 'event', 'App', 'Add to Home', '', 1, true);
				} catch (err) {}
			}
			deferredPrompt = null;
		});
	});
});

// add to home screen
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	deferredPrompt = e;
	$('.a2hs').show();
});

// notify of available update
/*
$(document).on('click', '#do-update', function(){
	window.applicationCache.swapCache();
	window.location.reload();
});

$(document).on('click', '#no-update', function(){
	$('#update-ready').slideUp();
});
*/

// Load the side-panel var to the DOM / page
$(document).one('pagebeforecreate', function () {
	if (mfzch.settings.compactUI) {
		$('body').addClass('compact-ui');
	}
	if (mfzch.settings.displayUI) {
		$('body').addClass('display-ui');
	}
});

$(document).one('pagecreate', function() {
	// swipe menu open
	$( document ).on( "swiperight", function( e ) {
		if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open"
			 && $(".ui-page-active .ui-popup-active").length <= 0
			 ) {
			$( "#nav-panel" ).panel( "open" );
		}
	});

	// prevent menu swipe on sliders
	$(document).on('swiperight', '[data-role=slider]', function(ev){
		ev.stopPropagation();
	});


	/* ------ exit game ------ */
	$("#confirm-exit-game").enhanceWithin().popup();
//	$("#confirm-exit-game").hide();

	// exit game
	$(document).on('click', '#exit-game', function(ev){
		if(mfzch.appState.remote.mode) {
			$('#confirm-exit-game .local').hide();
			$('#confirm-exit-game .remote').show();
		} else {
			$('#confirm-exit-game .local').show();
			$('#confirm-exit-game .remote').hide();
		}

		$('#confirm-exit-game').popup('open');
	});

	$(document).on('click', '#newgame-yes', function(){
		mfzch.appState.remote.mode = false;
		mfzch.game.restoreFromTemplate();
		mfzch.game.uuid = generateUUID();
		mfzch.game.status = 0;
		if (mfzch.game.blindSetup) {
			mfzch.game.teams = [];
		}
		mfzch.game.clientmodified = true;
		mfzch.saveData('game', true);
		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
	});

	$(document).on('click', '#newgame-no', function(){
		$('#confirm-exit-game').popup('close');
	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if(mfzch.settings.enableSplitSystems) {
		$('[data-sys-split=true]').show();
	} else {
		$('[data-sys-split=true]').hide();
	}

	if (mfzch.appState.isElite) {
		if(mfzch.settings.enableEnvironmental) {
			$('[data-sys-env=true]').show();
		} else {
			$('[data-sys-env=true]').hide();
		}
	}
});
