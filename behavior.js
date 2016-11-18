if (typeof jQuery != 'undefined') {

	/* ---------------------- */
	/* globals */

	// "constants"
	var MAXBTFRAMES = [0, 0, 8, 7, 6, 5];
	var MINBTFRAMES = [0, 0, 5, 4, 4, 3];
	var MAXSKFRAMES = [0, 0, 6, 5, 4, 4];
	var MINSKFRAMES = [0, 0, 4, 3, 3, 3];
	var NUMSTATIONS = [0, 0, 3, 2, 2, 1];
	var MEAND6D8 = [ // mean (highest of Xd6 + Yd8)
		[0, 4.5, 5.81, 6.47, 6.86],
		[3.5, 5.23, 6.09, 6.59, 6.92],
		[4.47, 5.59, 6.25, 6.67, 6.96],
		[4.96, 5.81, 6.35, 6.72, 6.99],
		[5.24, 5.95, 6.42, 6.76, 7.01],
		[5.43, 6.05, 6.48, 6.79, 7.03],
		[5.56, 6.12, 6.52, 6.81, 7.04]
	]
	var MAXCOMPANIES = 20;
	var MAXTEAMS = 5;
	var MAXFRAMES = 8;
	var MAXLOADOUTS = 50;
	var BUILDVERSION = 2016111802;
	var PUBLICBUILDSTRING = 'v2016.11.18a';

	/* ---------------------- */
	/* App setup */

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

	/* ---------------------- */

	/* Team Setup */

	$(document).on('pagecreate', '#team_setup', function(event){
		// add team
		$(document).on('click', '#team-add', function(){
			var team = new teamModel();

			var teamDesc = mfzch.generateDescriptor();

			team.name = teamDesc[0];
			team.color = teamDesc[1];

			mfzch.game.teams.push(team);
			mfzch.saveData(mfzch.game, 'mfz.game');

			mfzch.updateTeamList(mfzch.game);
			mfzch.updateSetupParameters(mfzch.game);

			var teamid = mfzch.game.teams.length-1;
			var team = mfzch.game.teams[teamid];

			$('#team-index').val(teamid);
			$('#team-name').val(team.name);
			$('#team-color').val(team.color);
			$('#team-frames').val(team.gFrames).slider( "refresh" );
			$('#team-systems').val(team.sSystems).slider( "refresh" );

			if(mfzch.game.teams[teamid].cProfile) {
				$('#team-adjust-profiled').show();
			} else {
				$('#team-adjust-profiled').hide();
			}

			mfzch.updateSystemsInputs();

			$('#team-adjust').popup('open');
		});

		// delete team
		$(document).on('click', '.team-del', function(){
			var teamid = $(this).parent().attr('data-teamid');
			mfzch.game.teams.splice(teamid, 1);
			mfzch.saveData(mfzch.game, 'mfz.game');

			$('#teams [data-teamid=' + teamid + ']').slideUp(function(){
				mfzch.updateTeamList(mfzch.game);
			});

			mfzch.updateSetupParameters(mfzch.game);
		});

		// manage team
		$(document).on('click', '.team-manage', function(){
			var teamid = $(this).parent().attr('data-teamid');
			var team = mfzch.game.teams[teamid];

			$('#team-index').val(teamid);
			$('#team-name').val(team.name);
			$('#team-color').val(team.color);
			$('#team-frames').val(team.gFrames).slider( "refresh" );
			$('#team-systems').val(team.sSystems).slider( "refresh" );

			mfzch.updateSystemsInputs();
		});

		$(document).on('focus', '#team-name', function(){
			this.select();
		});

		$(document).on('focus', '#team-frames', function(){
			this.select();
		});

		$(document).on('focus', '#team-systems', function(){
			this.select();
		});

		// team regen name/color
		$(document).on('click', '#team-regen', function(){
			var teamid = $('#team-index').val();
			var team = mfzch.game.teams[teamid];

			var teamDesc = mfzch.generateDescriptor();
			team.name = teamDesc[0];
			team.color = teamDesc[1];

			$('#team-name').val(team.name);
			$('#team-color').val(team.color);
		});

		// set team options
		$(document).on('click', '#team-submit', function(){
			var teamid = $('#team-index').val();

			var bork = $('#team-name').val();
			mfzch.game.teams[teamid].name = $('<div/>').text(bork).html();

			mfzch.game.teams[teamid].color = $('#team-color').val();

			if (mfzch.game.teams[teamid].gFrames != parseInt($('#team-frames').val())
				|| mfzch.game.teams[teamid].sSystems != parseInt($('#team-systems').val())) {
				mfzch.game.teams[teamid].gFrames = parseInt($('#team-frames').val());
				mfzch.game.teams[teamid].sSystems = parseInt($('#team-systems').val());
				mfzch.game.teams[teamid].cProfile = false;
			}

			mfzch.saveData(mfzch.game, 'mfz.game');
			mfzch.updateTeamList(mfzch.game);
			mfzch.updateSetupParameters(mfzch.game);

			$('#team-adjust').popup('close');
		});

		// manage the team dialog
		$(document).on('change', '#team-frames', function(){
			mfzch.updateSystemsInputs();
		});

		// game type switch
		$(document).on('change', '#game-type-switch', function(){
			mfzch.game.gameType = $('#game-type-switch').val();
			mfzch.updateSetupParameters(mfzch.game);
		})

		// tracking level switch
		$(document).on('change', '#game-tracking-level', function(){
			mfzch.game.trackingLevel = $('#game-tracking-level').val();
		})

		// game checks before proceeding
		$(document).on('click', '#game-start', function(){
			mfzch.game.reset();

			if (mfzch.game.gameType == "Demo/Free") {
				$('#game-parameters').popup('open');
			} else {
				if (!mfzch.game.frameCountIsGood()) { // check min/max frames against game type
					$('#setup_framecount').popup('open');
					try {
						ga('send', 'event', 'Game', 'Setup', 'Frame Number', 0, false);
					} catch (err) {}

				} else if (mfzch.game.tiedForDefense()) { // check for defensive tie
					$('#setup_tie').popup('open');
					try {
						ga('send', 'event', 'Game', 'Setup', 'Defensive Tie', 0, false);
					} catch (err) {}

				} else {
					mfzch.saveData(mfzch.game, 'mfz.game');

					if (mfzch.game.trackingLevel >= 20) {
						for (var i in mfzch.game.teams) {
							if (!mfzch.game.teams[i].cProfile) {
								mfzch.game.trackingLevel = 10;
								break;
							}
						}
					}

					$('#deploy-allteams').empty();
					for (var i in mfzch.game.teams) {
						if (parseInt(i) == 0) {
							$('#deploy-allteams').append('<li>Defense: <strong>' + mfzch.frameNameScore(i) + '</strong></li>')
						} else if (parseInt(i) == mfzch.game.teams.length-1) {
							$('#deploy-allteams').append('<li>Point Offense: <strong>' + mfzch.frameNameScore(i) + '</strong></li>')
						} else {
							$('#deploy-allteams').append('<li>Offense: <strong>' + mfzch.frameNameScore(i) + '</strong></li>')
						}
					}

					if(mfzch.game.teams.length > 3) {
						$('.deploy-attackers').empty();
						for (var i in mfzch.game.teams) {
							if (parseInt(i)) {
								$('.deploy-attackers').append('<li><strong>' + mfzch.frameName(i) + '</strong></li>')
							}
						}
						$('.multiple-offense').show();
					} else {
						$('.multiple-offense').hide();
					}

					$('.deploy-defender').html(mfzch.frameName(0));
					$('.deploy-point').html(mfzch.frameName(mfzch.game.teams.length-1));

					$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-deployment", { changeHash: false } );
				}
			}
		});

		$(document).on('click', '#gp-submit', function(){
			mfzch.game.doomsday = parseInt($('#gp-doomsday').val());
			mfzch.game.stationsPerPlayer = parseInt($('#gp-stationsPerPlayer').val());
			mfzch.game.unclaimedStations = parseInt($('#gp-unclaimedStations').val());

			for (var i in mfzch.game.teams) {
				// reset number of stations
				mfzch.game.teams[i].gStations = mfzch.game.stationsPerPlayer;
			}
			mfzch.game.updateScores();

			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#active-game", { changeHash: false } );
		});

		$(document).on('click', '#gp-cancel', function(){
			$('#game-parameters').popup('close');
		});

		$(document).on('click', '#setup-framecount-back', function(){
			$('#setup_framecount').popup('close');
		});

		$(document).on('click', '#setup-tie-back', function(){
			$('#setup_tie').popup('close');
		});

		$(document).on('click', '#game-deployment-back', function(){
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#team_setup", { changeHash: false } );
		});

		$(document).on('click', '.play-combat-phase', function(){
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#active-game", { changeHash: false } );
		});
	});

	$(document).on("pagecontainerbeforechange", function(event, data){
		if (data.toPage[0].id == 'team_setup') { // auto switch to correct panel
			if (mfzch.game.inProgress) {
				data.toPage[0] = $("#active-game")[0];
			}
		}
	});

	$(document).on("pagecontainerbeforeshow", function(event, ui){
		if (ui.toPage[0].id == 'team_setup') {

			$('#game-type-switch').val(mfzch.game.gameType).selectmenu('refresh');
			$('#game-tracking-level').val(mfzch.game.trackingLevel).selectmenu('refresh');

			if (mfzch.game.inProgress){
				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#active-game", { changeHash: false } );
			}

			mfzch.updateSetupParameters(mfzch.game);
			mfzch.updateTeamList(mfzch.game);
			mfzch.updateSystemsInputs();
		}
	});

	/* ---------------------- */
	/* Combat Phase */

	$(document).on('pagecreate', '#active-game', function(event){
		// open team actions
		$(document).on('click', '.team-info', function(){
			if (!mfzch.game.gameEnded) {
				var teamid = $(this).parent().parent().attr('data-team-index');
				$('#team-action').attr('data-team-index', teamid).popup('option', 'afterclose', '');

				var actions = mfzch.game.getActions(teamid);

				if (!actions.length){
					$('#no-action').popup('open');
				} else {
					$('#destroy-frame').hide();
					$('#gain-station').hide();
					$('#lose-station').hide();

					for (var i in actions) {
						if (actions[i] == 'frame') {
							$('#destroy-frame').show();
						} else if (actions[i] == 'station-capture') {
							$('#gain-station').show();
						} else if (actions[i] == 'station-drop') {
							$('#lose-station').show();
						}
					}

					$('#team-action>ul').listview('refresh');
					$('#team-action').popup('open', {positionTo: this});
				}
			}
		});

		// destroy frame option
		$(document).on('click', '#destroy-frame', function(){
			var teamid = $('#team-action').attr('data-team-index');

			if(mfzch.game.teams[teamid].gFrames) {
				mfzch.undo.setState(mfzch.game);
				mfzch.game.teams[teamid].gFrames--;
				mfzch.game.logEvent(mfzch.game.teams[teamid].name + ' loses a frame');
				mfzch.game.updateScores();
				mfzch.updateActiveTeams(mfzch.game);
				mfzch.game.logScores('short');
				mfzch.saveData(mfzch.game, 'mfz.game');

				mfzch.settings.framesDestroyed++;
				mfzch.saveData(mfzch.settings, 'mfz.settings');

				try {
					ga('send', 'event', 'Game', 'Action', 'Destroyed Frame', 0, false);
				} catch (err) {}
			}

			$('#team-action').popup('close');
			mfzch.game.checkEarlyDoomsday();
		});

		// gain station option
		$(document).on('click', '#gain-station', function(){
			var teamid = $('#team-action').attr('data-team-index');
			var autoSelect = mfzch.getCapturableStations(teamid, true);

			if (autoSelect) {
				var capturedFrom = '';

				mfzch.undo.setState(mfzch.game);
				if (autoSelect == 'nobody') {
					mfzch.game.unclaimedStations--;
					capturedFrom = ' claims a contested station';
				} else {
					mfzch.game.teams[autoSelect].gStations--;
					capturedFrom = ' captures a station from ' + mfzch.game.teams[autoSelect].name;
				}
				mfzch.game.teams[teamid].gStations++;
				mfzch.game.logEvent(mfzch.game.teams[teamid].name + capturedFrom);
				mfzch.game.updateScores();
				mfzch.updateActiveTeams(mfzch.game);
				mfzch.game.logScores('short');
				mfzch.saveData(mfzch.game, 'mfz.game');

				$('#team-action').popup('close');
				try {
					ga('send', 'event', 'Game', 'Action', 'Station Captured', 0, false);
				} catch (err) {}

			} else {
				$('#team-action').popup('option', 'afterclose', function(){
					$('#station-capture').popup('open');
				});
				$('#team-action').popup('close');
			}
			mfzch.game.checkEarlyDoomsday();
		});

		// lose station option
		$(document).on('click', '#lose-station', function(){
			var teamid = $('#team-action').attr('data-team-index');
			var autoSelect = mfzch.getCapturableStations(teamid, false);
			if (autoSelect) {
				var capturedFrom = '';

				mfzch.undo.setState(mfzch.game);
				mfzch.game.teams[autoSelect].gStations++;
				mfzch.game.logEvent(mfzch.game.teams[autoSelect].name + ' captures a station from ' + mfzch.game.teams[teamid].name);

				mfzch.game.teams[teamid].gStations--;
				mfzch.game.updateScores();
				mfzch.updateActiveTeams(mfzch.game);
				mfzch.game.logScores('short');
				mfzch.saveData(mfzch.game, 'mfz.game');

				$('#team-action').popup('close');
				try {
					ga('send', 'event', 'Game', 'Action', 'Station Captured', 0, false);
				} catch (err) {}
			} else {
				$('#team-action').popup('option', 'afterclose', function(){
					$('#station-capture').popup('open');
				});
				$('#team-action').popup('close');
			}
			mfzch.game.checkEarlyDoomsday();
		});

		// capture station
		$(document).on('click', '.station-capture-button', function(){
			var capturingTeamid = $('#team-action').attr('data-team-index');
			var capturedTeamid = $(this).attr('data-team-index');
			var capturedFrom = '';

			mfzch.undo.setState(mfzch.game);
			if (capturedTeamid == 'nobody') {
				mfzch.game.unclaimedStations--;
				capturedFrom = ' claims a contested station';
			} else {
				mfzch.game.teams[capturedTeamid].gStations--;
				capturedFrom = ' captures a station from ' + mfzch.game.teams[capturedTeamid].name;
			}
			mfzch.game.teams[capturingTeamid].gStations++;
			mfzch.game.logEvent(mfzch.game.teams[capturingTeamid].name + capturedFrom);
			mfzch.game.updateScores();
			mfzch.updateActiveTeams(mfzch.game);
			mfzch.game.logScores('short');
			mfzch.saveData(mfzch.game, 'mfz.game');

			$('#station-capture').popup('close');
			try {
				ga('send', 'event', 'Game', 'Action', 'Station Captured', 0, false);
			} catch (err) {}

			mfzch.game.checkEarlyDoomsday();
		});

		// drop station
		$(document).on('click', '.station-drop-button', function(){
			var capturedTeamid = $('#team-action').attr('data-team-index');
			var capturingTeamid = $(this).attr('data-team-index');
			var capturedFrom = '';

			mfzch.undo.setState(mfzch.game);
			if (capturingTeamid == 'nobody') {
				mfzch.game.unclaimedStations++;
				mfzch.game.logEvent(mfzch.game.teams[capturedTeamid].name + ' loses a station which becomes contested');
			} else {
				mfzch.game.teams[capturingTeamid].gStations++;
				mfzch.game.logEvent(mfzch.game.teams[capturingTeamid].name + ' captures a station from ' + mfzch.game.teams[capturedTeamid].name);
			}
			mfzch.game.teams[capturedTeamid].gStations--;
			mfzch.game.updateScores();
			mfzch.updateActiveTeams(mfzch.game);
			mfzch.game.logScores('short');
			mfzch.saveData(mfzch.game, 'mfz.game');

			$('#station-capture').popup('close');
			try {
				ga('send', 'event', 'Game', 'Action', 'Station Captured', 0, false);
			} catch (err) {}

			mfzch.game.checkEarlyDoomsday();
		});

		// undo
		$(document).on('click', '#undo', function(){
			mfzch.undo.getState(mfzch.game);
			mfzch.game.updateScores();
			mfzch.updateActiveTeams(mfzch.game);
			mfzch.updateGameInfo(mfzch.game);
			mfzch.saveData(mfzch.game, 'mfz.game');
		});

		// redo
		$(document).on('click', '#redo', function(){
			mfzch.undo.getRedoState(mfzch.game);
			mfzch.game.updateScores();
			mfzch.updateActiveTeams(mfzch.game);
			mfzch.updateGameInfo(mfzch.game);
			mfzch.saveData(mfzch.game, 'mfz.game');
		});

		// end round
		$(document).on('click', '#end-round', function(){
			mfzch.undo.setState(mfzch.game);

			mfzch.game.doomsday--;
			$('.gameinfo-doomsday-counter').html(mfzch.game.doomsday);

			if (mfzch.game.trackingLevel >= 30) {
				for (var i in mfzch.game.teams) {
					for (var j in mfzch.game.teams[i].cFrames) {
						mfzch.game.teams[i].cFrames[j].activated = false;
						mfzch.game.teams[i].cFrames[j].defense = 0;
						mfzch.game.teams[i].cFrames[j].spot = 0;
					}
				}
				mfzch.updateActiveTeams(mfzch.game);
			}

			mfzch.game.logEvent('Round ' + (mfzch.game.round) + ' ends; Doomsday is now '+ mfzch.game.doomsday);
			mfzch.game.logSeparator();

			if (mfzch.game.doomsday < 1) {
				mfzch.game.endGame();
			} else {
				mfzch.game.round++;

				$('#ddc-current-team').html(mfzch.getIcon('company', mfzch.game.teams[0].color, 'game-icon') + mfzch.game.teams[0].name);
				$('#ddc-count').attr('data-team-index', 0);

				$('#ddc-count').popup('option', 'afterclose', function(){
					setTimeout(function(){
						if (mfzch.game.doomsday > 0) {

							var teamIndex = $('#ddc-count').attr('data-team-index');

							if (teamIndex < mfzch.game.teams.length-1) {
								$('.gameinfo-doomsday-counter').html(mfzch.game.doomsday);
								teamIndex++;
								$('#ddc-current-team').html(mfzch.getIcon('company', mfzch.game.teams[teamIndex].color, 'game-icon') + mfzch.game.teams[teamIndex].name);
								$('#ddc-count').attr('data-team-index', teamIndex);
								$('#ddc-count').popup('open');
							} else {
								mfzch.updateGameInfo(mfzch.game);
								mfzch.game.logEvent('Doomsday is now '+ mfzch.game.doomsday);
								mfzch.game.logSeparator();
								mfzch.game.logEvent('Round '+ mfzch.game.round + ' begins');
								mfzch.game.logScores();
								mfzch.saveData(mfzch.game, 'mfz.game');
							}
						} else {
							mfzch.game.logEvent('Doomsday is now 0');
							mfzch.game.endGame();
						}
					}, 1); // I guess it doesn't fire after it COMPLETELY closes...
				} );
				$('#ddc-count').popup('open');
			}
		});

		$(document).on('click', '#ddc-yes', function(){
			mfzch.game.doomsday--;
			mfzch.game.logEvent(mfzch.game.teams[$('#ddc-count').attr('data-team-index')].name + ' counts down doomsday');
			$('#ddc-count').popup('close');
		});

		$(document).on('click', '#ddc-no', function(){
			mfzch.game.logEvent(mfzch.game.teams[$('#ddc-count').attr('data-team-index')].name + ' does not count down doomsday');
			$('#ddc-count').popup('close');
		});

		$(document).on('click', '#log-btn', function(){
			$('#game-log').html(mfzch.game.log);
			$('#game-log-box').popup('open');
		});

		$(document).on('click', '#endgame-log', function(){
			$('#game-log').html(mfzch.game.log);
			$('#game-log-box').popup('open');
		});

		$(document).on('click', '#game-log-copy', function(){
			selectText('game-log');
			try {
				ga('send', 'event', 'Game', 'Action', 'Select Log', 0, false);
			} catch (err) {}
		});

		// exit game
		$(document).on('click', '#exit-game', function(){
			$('#confirm-exit-game').popup('open');
		});

		$(document).on('click', '#newgame-yes', function(){
			mfzch.game.inProgress = false;
			mfzch.game.restoreFromTemplate();
			mfzch.saveData(mfzch.game, 'mfz.game');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#team_setup", { changeHash: false } );
		});

		$(document).on('click', '#newgame-no', function(){
			$('#confirm-exit-game').popup('close');
		});

		// Tracking level 20+
		// manage frame
		$(document).on('click', '.frame-smash', function(){
			if (!mfzch.game.gameEnded) {
				var companyid = $(this).parent().parent().parent().attr('data-team-index');
				var frameid = $(this).parent().attr('data-frameid');

				$('#company-smash-index').val(companyid);
				$('#frame-smash-index').val(frameid);
				$('#frame-smash-name').html(mfzch.getIcon('frame', mfzch.game.teams[companyid].color, 'game-icon') + mfzch.game.teams[companyid].cFrames[frameid].name);
				$('#frame-smash-systems').html(mfzch.game.teams[companyid].cFrames[frameid].getSystemDisplay(false, true));

				// Tracking level 30+
				if (mfzch.game.trackingLevel >= 30) {
					if (mfzch.game.teams[companyid].cFrames[frameid].activated) {
						$('#frame-smash-activate').hide();
						$('#frame-smash-def-set').show();
					} else {
						$('#frame-smash-activate').show();
						$('#frame-smash-def-set').hide();
					}
					$('#frame-smash-activated').checkboxradio('refresh');
					$('#frame-smash-defense').val(mfzch.game.teams[companyid].cFrames[frameid].defense).slider('refresh');
					$('#frame-smash-spot').val(mfzch.game.teams[companyid].cFrames[frameid].spot).slider('refresh');
				}

				$('#frame-smash').popup('open');
			}
		});

		// remove system
		$(document).on('click', '#frame-smash-systems li', function(){
			var companyid = $('#company-smash-index').val();
			var frameid = $('#frame-smash-index').val();
			var sysType = $(this).attr('data-sys');
			mfzch.undo.setState(mfzch.game);

			if(mfzch.game.teams[companyid].cFrames[frameid].removeSystem(sysType)) {
				if (sysType == 'ssr') {
					mfzch.game.logEvent(mfzch.game.teams[companyid].name + ' fires an SSR from '+ mfzch.game.teams[companyid].cFrames[frameid].name);
					try {
						ga('send', 'event', 'Game', 'Action', 'Fired SSR', 0, false);
					} catch (err) {}
				} else {
					mfzch.game.logEvent(mfzch.game.teams[companyid].name + ' loses a system (' + sysType + ') from '+ mfzch.game.teams[companyid].cFrames[frameid].name);
					try {
						ga('send', 'event', 'Game', 'Action', 'Destroyed System', 0, false);
					} catch (err) {}
				}
				mfzch.saveData(mfzch.game, 'mfz.game');

				mfzch.settings.systemsDestroyed++;
				mfzch.saveData(mfzch.settings, 'mfz.settings');

				$('#frame-smash-systems').html(mfzch.game.teams[companyid].cFrames[frameid].getSystemDisplay(false, true));
				mfzch.updateActiveTeams(mfzch.game);
			} else {
				mfzch.undo.invalidateLastState();
			}
		});
		// delete frame
		$(document).on('click', '#frame-smash-destroy', function(){
			var companyid = $('#company-smash-index').val();
			var frameid = $('#frame-smash-index').val();

			mfzch.undo.setState(mfzch.game);

			mfzch.game.logEvent(mfzch.game.teams[companyid].name + ' loses a frame: '+ mfzch.game.teams[companyid].cFrames[frameid].name);

			try {
				ga('send', 'event', 'Game', 'Action', 'Destroyed Frame', 0, false);
			} catch (err) {}

			$('#active-game-teams [data-team-index=' + companyid + '] [data-frameid=' + frameid + ']').slideUp(function(){
				mfzch.updateActiveTeams(mfzch.game);
			});

			mfzch.game.teams[companyid].cFrames.splice(frameid, 1);
			mfzch.game.teams[companyid].gFrames = mfzch.game.teams[companyid].cFrames.length;

			mfzch.game.updateScores();
			mfzch.game.logScores('short');
			mfzch.saveData(mfzch.game, 'mfz.game');

			mfzch.settings.framesDestroyed++;
			mfzch.saveData(mfzch.settings, 'mfz.settings');
			$('#frame-smash').popup('close');

			mfzch.game.checkEarlyDoomsday();
		});

		$(document).on('click', '#frame-smash-submit', function(){
			$('#frame-smash').popup('close');
		});

		// send to sim
		$(document).on('click', '#frame-smash-sim1', function(){
			var companyid = $('#company-smash-index').val();
			var frameid = $('#frame-smash-index').val();

			mfzch.frameNow = 1;
			jQuery.extend(mfzch.frameSet[1], mfzch.game.teams[companyid].cFrames[frameid]);

			try {
				ga('send', 'event', 'Game', 'Action', 'Send to Sim', 0, false);
			} catch (err) {}

			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");

		});
		$(document).on('click', '#frame-smash-sim2', function(){
			var companyid = $('#company-smash-index').val();
			var frameid = $('#frame-smash-index').val();

			mfzch.frameNow = 2;
			jQuery.extend(mfzch.frameSet[2], mfzch.game.teams[companyid].cFrames[frameid]);

			try {
				ga('send', 'event', 'Game', 'Action', 'Send to Sim', 0, false);
			} catch (err) {}

			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");
		});

		// Tracking level 30+
		$(document).on('click', '#frame-smash-activate', function(){
			mfzch.undo.setState(mfzch.game);

			var companyid = $('#company-smash-index').val();
			var frameid = $('#frame-smash-index').val();

			mfzch.game.teams[companyid].cFrames[frameid].activated = true;

			$('#frame-smash-def-set').show();
			$('#frame-smash-activate').hide();

			mfzch.game.logEvent(mfzch.game.teams[companyid].name + ' activates '+ mfzch.game.teams[companyid].cFrames[frameid].name);
			try {
				ga('send', 'event', 'Game', 'Action', 'Activation', 0, false);
			} catch (err) {}

			mfzch.saveData(mfzch.game, 'mfz.game');
			mfzch.updateActiveTeams(mfzch.game);
		});

		$(document).on('slidestop', '#frame-smash-defense', function(){
			mfzch.undo.setState(mfzch.game);

			var companyid = $('#company-smash-index').val();
			var frameid = $('#frame-smash-index').val();

			mfzch.game.teams[companyid].cFrames[frameid].defense = $('#frame-smash-defense').val();

			mfzch.game.logEvent(mfzch.game.teams[companyid].name + ' sets the defense of '+ mfzch.game.teams[companyid].cFrames[frameid].name + ' to ' + mfzch.game.teams[companyid].cFrames[frameid].defense);
			try {
				ga('send', 'event', 'Game', 'Action', 'Defense', mfzch.game.teams[companyid].cFrames[frameid].defense, false);
			} catch (err) {}

			mfzch.saveData(mfzch.game, 'mfz.game');
			mfzch.updateActiveTeams(mfzch.game);
		});

		$(document).on('slidestop', '#frame-smash-spot', function(){
			mfzch.undo.setState(mfzch.game);

			var companyid = $('#company-smash-index').val();
			var frameid = $('#frame-smash-index').val();

			mfzch.game.teams[companyid].cFrames[frameid].spot = $('#frame-smash-spot').val();;

			mfzch.game.logEvent(mfzch.game.teams[companyid].name + ' ' + mfzch.game.teams[companyid].cFrames[frameid].name + ' receives a spot of ' + mfzch.game.teams[companyid].cFrames[frameid].spot);
			try {
				ga('send', 'event', 'Game', 'Action', 'Defense', mfzch.game.teams[companyid].cFrames[frameid].spot, false);
			} catch (err) {}

			mfzch.saveData(mfzch.game, 'mfz.game');
			mfzch.updateActiveTeams(mfzch.game);
		});

	});

	$(document).on("pagecontainerbeforeshow", function(event, ui){
		if (ui.toPage[0].id == 'active-game') {
			if (!mfzch.game.teams.length){ // display correct panel
				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#team_setup", { changeHash: false } );
			} else {
				mfzch.updateActiveTeams(mfzch.game);
				mfzch.updateGameInfo(mfzch.game);

				if (!mfzch.game.inProgress) {
					mfzch.templateGame = JSON.stringify(mfzch.game);

					mfzch.game.logEvent('Start Game');
					mfzch.game.logParameters();
					mfzch.game.logScores();
					mfzch.game.inProgress = true; // ***
					mfzch.saveData(mfzch.game, 'mfz.game');
					mfzch.saveData(mfzch.templateGame, 'mfz.templateGame', true);

					try {
						ga('send', 'event', 'Game', 'Action', 'Start', 0, false);
					} catch (err) {}
				}

				$('#undo').prop('disabled', true);
				$('#redo').prop('disabled', true);

				if (mfzch.undo.currentState) {
					$('#undo').prop('disabled', false);
				}

				if (mfzch.undo.currentState < mfzch.undo.validStates) {
					$('#redo').prop('disabled', false);
				}

				if (mfzch.game.doomsday < 1) {
					$('#end-round').hide();
				} else {
					$('#end-round').show();
				}

				if (mfzch.game.trackingLevel >= 30) {
					$('#frame-smash-status').show();
				} else {
					$('#frame-smash-status').hide();
				}
			}
		}
	});

	/* ---------------------- */
	/* System simulator */

	$(document).on('pagecreate', '#dice-roller', function(event){
		$(document).on('click', '#dice-roller .add-sys', function(){
			mfzch.frameSet[mfzch.frameNow].addSystem($(this).attr('data-sys-type'));
			mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
			mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
		});

		$(document).on('click', '#dice-roller .reset-sys', function(){
			mfzch.frameSet[mfzch.frameNow] = new frameModel();
			mfzch.frameSet[mfzch.frameNow].activeRange = $('#sys-range').val();
			mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
			mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
		});

		$(document).on('click', '#active-systems li', function(){
			mfzch.frameSet[mfzch.frameNow].removeSystem($(this).attr('data-sys'));
			mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
			mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
		});

		$(document).on('change', '#sys-range', function(){
			mfzch.frameSet[mfzch.frameNow].activeRange = $('#sys-range').val();
			mfzch.frameSet[mfzch.frameNow].rollResult = false;
			mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
			mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
		});

		$(document).on('click', '#dice-roller .roll-all', function(){
			mfzch.frameSet[mfzch.frameNow].rollAll();
			$('#active-dice').html(mfzch.frameSet[mfzch.frameNow].getRollDisplay());
			mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
			try {
				ga('send', 'event', 'Simulator', 'Action', 'Roll Frame', mfzch.frameNow, false);
			} catch (err) {}
		});

		$(document).on('change', '#die-frame', function(){
			if ($('#die-frame').val() == 'damage') {
				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#damage-roller", { changeHash: false } );
			} else {
				var frame = parseInt($('#die-frame').val());
				mfzch.frameNow = frame;

				$('#sys-range').val(mfzch.frameSet[mfzch.frameNow].activeRange).selectmenu('refresh');
				mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
			}
		});
	});

	$(document).on("pagecontainerbeforeshow", function(event, ui){
		if (ui.toPage[0].id == 'dice-roller') {
			$('#die-frame').val(mfzch.frameNow).selectmenu('refresh');
			$('#sys-range').val(mfzch.frameSet[mfzch.frameNow].activeRange);
			$('#sys-range').selectmenu('refresh');

			mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
		}
	});

	$(document).on('pagecreate', '#damage-roller', function(event){
		$(document).on('change', '#die-frame2', function(){
			if ($('#die-frame2').val() != 'damage') {
				var frame = parseInt($('#die-frame2').val());

				mfzch.frameNow = frame;

				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller", { changeHash: false } );
			}
		});

		$(document).on('swiperight', '#damage-form', function(ev){
			ev.stopPropagation();
		});

		$(document).on('click', '#dmg-roll', function(){
			var attack = parseInt($('#dmg-attack').val());
			var spot = parseInt($('#dmg-spot').val());
			var defense = parseInt($('#dmg-defense').val());
			var totaldice = attack + spot - defense;

			$('#dmg-potential').html(totaldice);
			if (totaldice) {
				var dmgrolls = [0,0,0,0,0,0,0];
				for (var i = 0; i < totaldice; i++) {
					var dmg = rollDie(6);
					dmgrolls[dmg]++;
				}
				$('#dmg-4s').html(dmgrolls[4]);
				$('#dmg-5s').html(dmgrolls[5]);
				$('#dmg-6s').html(dmgrolls[6]);
			} else {
				$('#dmg-4s').html('-');
				$('#dmg-5s').html('-');
				$('#dmg-6s').html('-');
			}

			try {
				ga('send', 'event', 'Simulator', 'Action', 'Roll Damage', 0, false);
			} catch (err) {}

		});
	});

	$(document).on("pagecontainerbeforeshow", function(event, ui){
		if (ui.toPage[0].id == 'damage-roller') {
			$('#die-frame2').val("damage").selectmenu('refresh');
			mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
		}
	});

	/* ---------------------- */
	/* Structured Units */

	$(document).on('pagecreate', '#company-analysis', function(event){
		// add company
		$(document).on('click', '#company-add', function(){
			var company = new companyModel();

			var companyDesc = mfzch.generateDescriptor();

			company.name = companyDesc[0];
			company.color = companyDesc[1];

			mfzch.companies.push(company);
			mfzch.saveData(mfzch.companies, 'mfz.companies');

			mfzch.updateCompanyList();

			var companyid = mfzch.companies.length-1;
			var company = mfzch.companies[companyid];

			$('#company-index').val(companyid);
			$('#company-name').val(company.name);
			$('#company-color').val(company.color);

			$('#company-notice').hide();
			$('#company-track-assets').hide();
			$('#company-duplicate').hide();

			$('#company-adjust').popup('open');
			try {
				ga('send', 'event', 'Company', 'Action', 'Add Company', 0, false);
			} catch (err) {}

		});

		// manage company
		$(document).on('click', '#company-analysis .company-manage', function(){
			var companyid = $(this).parent().parent().parent().attr('data-companyid');
			var company = mfzch.companies[companyid];

			$('#company-index').val(companyid);
			$('#company-name').val(company.name);
			$('#company-color').val(company.color);

			$('#company-notice').hide();
			if (!company.frames.length) {
				$('#company-track-assets').hide();
			} else {
				$('#company-notice').empty();
				// move this section to company model, probably ***
				company.nonstandard = false;

				// frame number check
				if (company.frames.length > MAXBTFRAMES[2] || company.frames.length < MINSKFRAMES[5]) {
					$('#company-notice').append('<p>A standard game requires 3&#8211;8 frames.</p>');
					company.nonstandard = true;
					$('#company-notice').show();
				}
				// SSR check
				if (company.totalSSRs() != 3) {
					$('#company-notice').append('<p>A standard game requires 3 SSRs.</p>');
					company.nonstandard = true;
					$('#company-notice').show();
				}
				// frame naming check
				var namecheck = [];
				for (var i in company.frames) {
					namecheck.push(company.frames[i].name)
				}
				namecheck.sort();
				for (var i = 0; i < namecheck.length; i++) {
					if(namecheck[i+1] == namecheck[i]) {
						$('#company-notice').append('<p>This company has duplicate frame names, which may make system tracking difficult.</p>');
						$('#company-notice').show();
						break;
					}
				}
				$('#company-track-assets').show();
			}

			if (mfzch.companies.length < MAXCOMPANIES) {
				$('#company-duplicate').show();
			} else {
				$('#company-duplicate').hide();
			}

		});

		$(document).on('focus', '#company-name', function(){
			this.select();
		});

		$(document).on('change', '#company-name', function(){
			var companyid = $('#company-index').val();
			var company = mfzch.companies[companyid];

			company.name = $('#company-name').val();
			mfzch.saveData(mfzch.companies, 'mfz.companies');
			mfzch.updateCompanyList();
		});

		$(document).on('change', '#company-color', function(){
			var companyid = $('#company-index').val();
			var company = mfzch.companies[companyid];

			company.color = $('#company-color').val();
			mfzch.saveData(mfzch.companies, 'mfz.companies');
			mfzch.updateCompanyList();
		});

		// company regen name/color
		$(document).on('click', '#company-regen', function(){
			var companyid = $('#company-index').val();
			var company = mfzch.companies[companyid];

			var companyDesc = mfzch.generateDescriptor();
			company.name = companyDesc[0];
			company.color = companyDesc[1];

			$('#company-name').val(company.name);
			$('#company-color').val(company.color);
			mfzch.saveData(mfzch.companies, 'mfz.companies');
			mfzch.updateCompanyList();
		});

		// set company options
		$(document).on('click', '#company-submit', function(){
			$('#company-adjust').popup('close');
		});

		// delete company
		$(document).on('click', '.company-delete', function(){
			var companyid = $(this).parent().parent().parent().attr('data-companyid');
			mfzch.companies.splice(companyid, 1);
			mfzch.saveData(mfzch.companies, 'mfz.companies');
			$('#company-list [data-companyid=' + companyid + ']').fadeOut(function (){
				mfzch.updateCompanyList();
			});
		});

		// add frame
		$(document).on('click', '#company-analysis .frame-add', function(){
			var companyid = $(this).parent().parent().parent().attr('data-companyid');
			var frame = new frameModel();
			frame.name = uniqueName('Frame', buildNameArray(mfzch.companies[companyid].frames));

			mfzch.companies[companyid].frames.push(frame);
			mfzch.saveData(mfzch.companies, 'mfz.companies');

			mfzch.updateCompanyList();

			var frameid = mfzch.companies[companyid].frames.length-1;

			$('#company-index').val(companyid);
			$('#frame-index').val(frameid);
			$('#frame-name').val(mfzch.companies[companyid].frames[frameid].name);
			$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
			$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));

			$('#frame-adjust').popup('open');
			try {
				ga('send', 'event', 'Company', 'Action', 'Add Frame', 0, false);
			} catch (err) {}
		});

		// delete frame
		$(document).on('click', '#company-analysis .frame-del', function(){
			var companyid = $(this).parent().parent().parent().attr('data-companyid');
			var frameid = $(this).parent().attr('data-frameid');

			mfzch.companies[companyid].frames.splice(frameid, 1);
			mfzch.saveData(mfzch.companies, 'mfz.companies');

			$('#company-list [data-companyid=' + companyid + '] [data-frameid=' + frameid + ']').slideUp(function(){
				mfzch.updateCompanyList();
			});

		});

		// manage frame
		$(document).on('click', '.frame-manage', function(){
			var companyid = $(this).parent().parent().parent().attr('data-companyid');
			var frameid = $(this).parent().attr('data-frameid');

			var company = mfzch.companies[companyid];

			$('#company-index').val(companyid);
			$('#frame-index').val(frameid);
			$('#frame-name').val(mfzch.companies[companyid].frames[frameid].name);
			$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
			$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));
		});

		$(document).on('focus', '#frame-name', function(){
			this.select();
		});

		// add system
		$(document).on('click', '#company-analysis a.add-sys', function(){
			var companyid = $('#company-index').val();
			var frameid = $('#frame-index').val();

			mfzch.companies[companyid].frames[frameid].addSystem($(this).attr('data-sys-type'));
			$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
			$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));
			mfzch.updateCompanyList();
			mfzch.saveData(mfzch.companies, 'mfz.companies');
		});

		// reset systems
		$(document).on('click', '#company-analysis a.reset-sys', function(){
			var companyid = $('#company-index').val();
			var frameid = $('#frame-index').val();

			mfzch.companies[companyid].frames[frameid] = new frameModel();
			var bork = $('#frame-name').val();
			mfzch.companies[companyid].frames[frameid].name = $('<div/>').text(bork).html();
			$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
			$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));
			mfzch.updateCompanyList();
			mfzch.saveData(mfzch.companies, 'mfz.companies');
		});

		// remove system
		$(document).on('click', '#frame-systems li', function(){
			var companyid = $('#company-index').val();
			var frameid = $('#frame-index').val();

			mfzch.companies[companyid].frames[frameid].removeSystem($(this).attr('data-sys'));

			$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
			$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));
			mfzch.updateCompanyList();
			mfzch.saveData(mfzch.companies, 'mfz.companies');
		});

		$(document).on('change', '#frame-name', function(){
			var companyid = $('#company-index').val();
			var frameid = $('#frame-index').val();

			var bork = $('#frame-name').val();
			mfzch.companies[companyid].frames[frameid].name = $('<div/>').text(bork).html();

			mfzch.updateCompanyList();
			mfzch.saveData(mfzch.companies, 'mfz.companies');
		});

		$(document).on('click', '#frame-submit', function(){
			$('#frame-adjust').popup('close');
		});

		$(document).on('click', '#frame-graphtoggle', function(){
			$('#frame-graph').slideToggle();
		});

		$(document).on('click', '#frame-sim1', function(){
			var companyid = $('#company-index').val();
			var frameid = $('#frame-index').val();

			mfzch.frameNow = 1;
			jQuery.extend(mfzch.frameSet[1], mfzch.companies[companyid].frames[frameid]);

			try {
				ga('send', 'event', 'Company', 'Action', 'Send to Sim', 0, false);
			} catch (err) {}

			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");

		});
		$(document).on('click', '#frame-sim2', function(){
			var companyid = $('#company-index').val();
			var frameid = $('#frame-index').val();

			mfzch.frameNow = 2;
			jQuery.extend(mfzch.frameSet[2], mfzch.companies[companyid].frames[frameid]);

			try {
				ga('send', 'event', 'Company', 'Action', 'Send to Sim', 0, false);
			} catch (err) {}

			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");
		});

		$(document).on('click', '#company-track-assets', function(){
			$('#company-adjust').popup('option', 'afteropen', function(){
				$('#company-adjust').popup('option', 'afterclose', '');
			});
			$('#company-adjust').popup('option', 'afterclose', function(){
				if (mfzch.game.inProgress) {
					$('#company-track-gameinprogress').popup('open');
				} else if (mfzch.game.teams.length >= MAXTEAMS) {
					$('#company-full-add').hide();
					$('#company-full-list').html(mfzch.getTeamListForUnitStrucutre()).listview('refresh');
					$('#company-track-teamsfull').popup('open');
				} else {
					mfzch.addCompanyToAsset();
				}
			});
			$('#company-adjust').popup('close');
		});

		$(document).on('click', '#company-end-game', function(){
			mfzch.game.inProgress = false;
			mfzch.game.restoreFromTemplate();
			mfzch.saveData(mfzch.game, 'mfz.game');
			$('#company-track-gameinprogress').popup('option', 'afteropen', function(){
				$('#company-track-gameinprogress').popup('option', 'afterclose', '');
			});
			$('#company-track-gameinprogress').popup('option', 'afterclose', function(){
				if (mfzch.game.teams.length >= MAXTEAMS) {
					$('#company-full-add').hide();
					$('#company-full-list').html(mfzch.getTeamListForUnitStrucutre()).listview('refresh');
					$('#company-track-teamsfull').popup('open');
				} else {
					mfzch.addCompanyToAsset();
				}
			});

			$('#company-track-gameinprogress').popup('close');
		});

		$(document).on('click', '#company-full-list li', function(){
			var teamid = $(this).attr('data-id');
			mfzch.game.teams.splice(teamid, 1);
			mfzch.saveData(mfzch.game, 'mfz.game');

			$('#company-full-add').show();
			$('#company-full-list').html(mfzch.getTeamListForUnitStrucutre()).listview('refresh');
		});

		$(document).on('click', '#company-full-add', function(){
			$('#company-track-teamsfull').popup('option', 'afteropen', function(){
				$('#company-track-teamsfull').popup('option', 'afterclose', '');
			});
			$('#company-track-teamsfull').popup('option', 'afterclose', function(){
				var companyid = $('#companyinfo-name').attr('data-company-id');

				mfzch.addCompanyToAsset();
			});
			$('#company-track-teamsfull').popup('close');
		});

		$(document).on('click', '#company-duplicate', function(){
			var srcCompanyIndex = $('#company-index').val();

			var destCompany = new companyModel();

			$.extend(true, destCompany, mfzch.companies[srcCompanyIndex]);

			destCompany.name = uniqueName(destCompany.name, buildNameArray(mfzch.companies));

			// *** dump and fill frames
			destCompany.frames = [];

			mfzch.companies[srcCompanyIndex].frames.forEach (function(item, index){
				var frame = new frameModel();
				$.extend(true, frame, mfzch.companies[srcCompanyIndex].frames[index]);
				destCompany.frames.push(frame);
			})

			mfzch.companies.push(destCompany);
			mfzch.saveData(mfzch.companies, 'mfz.companies');

			mfzch.updateCompanyList();

			$('#company-adjust').popup('close');
			try {
				ga('send', 'event', 'Company', 'Action', 'Duplicate Company', 0, false);
			} catch (err) {}
		});

		$(document).on('change', '#settings-showunitgraphs', function(){
			if ($(this).val() == 'on') {
				mfzch.settings.showUnitGraphs = true;
				$('.company-graph-in-list').stop().slideDown();
			} else {
				mfzch.settings.showUnitGraphs = false;
				$('.company-graph-in-list').stop().slideUp();
			}
			mfzch.saveData(mfzch.settings, 'mfz.settings');
		});

	});

	$(document).on("pagecontainerbeforeshow", function(event, ui){
		if (ui.toPage[0].id == 'company-analysis') {
			mfzch.updateCompanyList();

			if (mfzch.settings.showUnitGraphs) {
				$('#settings-showunitgraphs').val('on');
				$('.company-graph-in-list').show();
			} else {
				$('#settings-showunitgraphs').val('off');
				$('.company-graph-in-list').hide();
			}
			$('#settings-showunitgraphs').slider('refresh');

		}
	});

	/* ---------------------- */
	/* loadouts */

	$(document).on('pagecreate', '#loadouts', function(event){
		$(document).on('click', '#loadouts .loadout-graph', function(){
			mfzch.extractLoadoutFromTitle(this, '#lo-data');
			var load = mfzch.convertHtmlToLoadout('#lo-data');
			$('#loadout-frameinfo-name').html(load.name);
			$('#loadout-frameinfo-graph').html(load.createFrameGraph(false));

			$('#loadout-framegraph').popup('open');
		});


		$(document).on('click', '#loadouts .add-to-company', function(){
			$('#lo-company-list').html(mfzch.getCompanyListForLoadouts());

			if(mfzch.companies.length < MAXCOMPANIES) {
				$('#lo-company-list').append('<li data-icon="plus"><a href="#">Add New</a></li>')
			}
			$('#lo-company-list').listview('refresh');

			mfzch.extractLoadoutFromTitle(this, '#lo-data');

			$('#loadout-add-to-company').popup('open');
		});

		$(document).on('click', '#lo-company-list li', function(){
			var load = mfzch.convertHtmlToLoadout('#lo-data');

			var companyid = $(this).attr('data-id');
			if (typeof(companyid) !== 'undefined' && companyid !== false) {
				if (mfzch.companies[companyid].frames.length < MAXFRAMES) {
					load.name = uniqueName(load.name, buildNameArray(mfzch.companies[companyid].frames))
					mfzch.companies[companyid].frames.push(load);
					mfzch.saveData(mfzch.companies, 'mfz.companies');

					try {
						ga('send', 'event', 'Loadouts', 'Action', 'Add Frame', 0, false);
					} catch (err) {}

					$('#loadout-add-to-company').popup('close');
				}
			} else {
				var company = new companyModel;
				var companyDesc = mfzch.generateDescriptor();
				company.name = companyDesc[0];
				company.color = companyDesc[1];

				company.frames.push(load);
				mfzch.companies.push(company);
				mfzch.saveData(mfzch.companies, 'mfz.companies');

				try {
					ga('send', 'event', 'Loadouts', 'Action', 'Add Company', 0, false);
				} catch (err) {}

				$('#loadout-add-to-company').popup('close');
			}
		});

		// add loadout
		$(document).on('click', '#loadouts #loadout-add', function(){
			var load = new frameModel();

			var nameArray = [];
			for (var i in mfzch.loadouts) {
				nameArray.push(mfzch.loadouts[i].name);
			}

			load.name = uniqueName('Custom Loadout', nameArray);

			mfzch.loadouts.push(load);
			mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');

			mfzch.updateLoadoutList();

			var loadid = mfzch.loadouts.length-1;

			$('#loadout-index').val(loadid);
			$('#loadout-name').val(mfzch.loadouts[loadid].name);
			$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
			$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));

			$('#loadout-adjust').popup('open');
			try {
				ga('send', 'event', 'Loadouts', 'Action', 'Add Loadout', 0, false);
			} catch (err) {}
		});

		// delete loadout
		$(document).on('click', '#loadouts .load-del', function(){
			var loadid = $(this).parent().attr('data-load-id');

			mfzch.loadouts.splice(loadid, 1);
			mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');

			$('#loadouts-custom [data-load-id=' + loadid + ']').slideUp(function(){
				mfzch.updateLoadoutList();
			});
		});

		// manage loadout
		$(document).on('click', '#loadouts .load-manage', function(){
			var loadid = $(this).parent().attr('data-load-id');

			$('#loadout-index').val(loadid);
			$('#loadout-name').val(mfzch.loadouts[loadid].name);
			$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
			$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));
		});

		$(document).on('focus', '#loadout-name', function(){
			this.select();
		});

		// loadout add system
		$(document).on('click', '#loadouts a.add-sys', function(){
			var loadid = $('#loadout-index').val();

			mfzch.loadouts[loadid].addSystem($(this).attr('data-sys-type'));
			$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
			$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));
			mfzch.updateLoadoutList();
			mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');
		});

		// loadout reset systems
		$(document).on('click', '#loadouts a.reset-sys', function(){
			var loadid = $('#loadout-index').val();

			mfzch.loadouts[loadid] = new frameModel();
			var bork = $('#loadout-name').val();  // preserve name
			mfzch.loadouts[loadid].name = $('<div/>').text(bork).html();

			$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
			$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));
			mfzch.updateLoadoutList();
			mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');
		});

		// loadout remove system
		$(document).on('click', '#loadout-systems li', function(){
			var loadid = $('#loadout-index').val();

			mfzch.loadouts[loadid].removeSystem($(this).attr('data-sys'));

			$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
			$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));
			mfzch.updateLoadoutList();
			mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');
		});

		// loadout update name
		$(document).on('change', '#loadout-name', function(){
			var loadid = $('#loadout-index').val();

			var bork = $('#loadout-name').val(); // sanitize
			mfzch.loadouts[loadid].name = $('<div/>').text(bork).html();

			mfzch.updateLoadoutList();
			mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');
		});

		$(document).on('click', '#loadout-submit', function(){
			$('#loadout-adjust').popup('close');
		});

		$(document).on('click', '#loadout-graphtoggle', function(){
			$('#loadout-graph').slideToggle(function(){
				if ($('#loadout-graph:visible').length) {
					mfzch.settings.showLoadoutGraph = true;
				} else {
					mfzch.settings.showLoadoutGraph = false;
				}
				mfzch.saveData(mfzch.settings, 'mfz.settings');
			});
		});

		$(document).on('click', '#loadout-add-to-company-btn', function(){
			var loadid = $('#loadout-index').val();

			$('#lo-company-list').html(mfzch.getCompanyListForLoadouts());

			if(mfzch.companies.length < MAXCOMPANIES) {
				$('#lo-company-list').append('<li data-icon="plus"><a href="#">Add New</a></li>')
			}
			$('#lo-company-list').listview('refresh');

			$('#lo-data').attr('data-name', mfzch.loadouts[loadid].name);
			$('#lo-data').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));

			$('#loadout-adjust').popup('option', 'afterclose', function(){
				$('#loadout-add-to-company').popup('open');
			});
			$('#loadout-adjust').popup('option', 'afteropen', function(){
				$('#loadout-adjust').popup('option', 'afterclose', '');
			});
			$('#loadout-adjust').popup('close');
		});
	});

	$(document).on("pagecontainerbeforeshow", function(event, ui){
		if (ui.toPage[0].id == 'loadouts') {
			mfzch.updateLoadoutList();

			if (mfzch.settings.showLoadoutGraph) {
				$('#loadout-graph').show();
			} else {
				$('#loadout-graph').hide();
			}
		}
	});

	/* ---------------------- */
	/* settings */

	$(document).on('pagecreate', '#settings', function(event){
		$(document).on('change', '#settings-enablesplits', function(){
			if ($(this).val() == 'on') {
				mfzch.settings.enableSplitSystems = true;
			} else {
				mfzch.settings.enableSplitSystems = false;
			}
			mfzch.saveData(mfzch.settings, 'mfz.settings');
		});

		/* *** */
		$(document).on('change', '#settings-enableenvironmental', function(){
			if ($(this).val() == 'on') {
				mfzch.settings.enableEnvironmental = true;
			} else {
				mfzch.settings.enableEnvironmental = false;
			}
			mfzch.saveData(mfzch.settings, 'mfz.settings');
		});

		$(document).on('change', '#settings-compactui', function(){
			if ($(this).val() == 'on') {
				mfzch.settings.compactUI = true;
				$('body').addClass('compact-ui');
			} else {
				mfzch.settings.compactUI = false;
				$('body').removeClass('compact-ui');
			}
			mfzch.saveData(mfzch.settings, 'mfz.settings');
		});

		$(document).on('change', 'input[name=settings-attackgraph]', function(){
			if ($(this).val() == 'on') {
				mfzch.settings.altAttackGraphType = true;
			} else {
				mfzch.settings.altAttackGraphType = false;
			}
			mfzch.saveData(mfzch.settings, 'mfz.settings');
		});
	});

	$(document).on("pagecontainerbeforeshow", function(event, ui){
		if (ui.toPage[0].id == 'settings') {
			if (mfzch.settings.enableSplitSystems) {
				$('#settings-enablesplits').val('on');
			} else {
				$('#settings-enablesplits').val('off');
			}
			$('#settings-enablesplits').slider('refresh');

			/* *** */
			if (mfzch.settings.enableEnvironmental) {
				$('#settings-enableenvironmental').val('on');
			} else {
				$('#settings-enableenvironmental').val('off');
			}
			$('#settings-enableenvironmental').slider('refresh');

			if (mfzch.settings.compactUI) {
				$('#settings-compactui').val('on');
			} else {
				$('#settings-compactui').val('off');
			}
			$('#settings-compactui').slider('refresh');

			if (mfzch.settings.altAttackGraphType) {
				$('#settings-attackgraph-2').prop('checked', true);
			} else {
				$('#settings-attackgraph-1').prop('checked', true);
			}
			$('input[name=settings-attackgraph]').checkboxradio('refresh');

			$('#settings-usage').empty();

			$('#settings-usage').append('<li>Games Played: '+ mfzch.settings.gamesPlayed + '</li>');
			$('#settings-usage').append('<li>Frames Destroyed: '+ mfzch.settings.framesDestroyed + '</li>');
			$('#settings-usage').append('<li>Systems Destroyed: '+ mfzch.settings.systemsDestroyed + '</li>');
		}
	});

	/* ---------------------- */

	// External/download link tracking
	jQuery(document).ready(function($) {
		var filetypes = /\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;
		var baseHref = '';
		if (jQuery('base').attr('href') != undefined) baseHref = jQuery('base').attr('href');

		jQuery('a').on('click', function(event) {
			var el = jQuery(this);
			var track = true;
			var href = (typeof(el.attr('href')) != 'undefined' ) ? el.attr('href') :"";
			var isThisDomain = href.match(document.domain.split('.').reverse()[1] + '.' + document.domain.split('.').reverse()[0]);
			if (!href.match(/^javascript:/i)) {
				var elEv = []; elEv.value=0, elEv.non_i=false;
				if (href.match(/^mailto\:/i)) {
					elEv.category = "email";
					elEv.action = "click";
					elEv.label = href.replace(/^mailto\:/i, '');
					elEv.loc = href;
				}
				else if (href.match(filetypes)) {
					var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
					elEv.category = "download";
					elEv.action = "click-" + extension[0];
					elEv.label = href.replace(/ /g,"-");
					elEv.loc = baseHref + href;
				}
				else if (href.match(/^https?\:/i) && !isThisDomain) {
					elEv.category = "external";
					elEv.action = "click";
					elEv.label = href.replace(/^https?\:\/\//i, '');
					elEv.non_i = true;
					elEv.loc = href;
				}
				else if (href.match(/^tel\:/i)) {
					elEv.category = "telephone";
					elEv.action = "click";
					elEv.label = href.replace(/^tel\:/i, '');
					elEv.loc = href;
				}
				else track = false;

				if (track) {
					try {
						ga('send', 'event', elEv.category.toLowerCase(), elEv.action.toLowerCase(), elEv.label.toLowerCase(), elEv.value, elEv.non_i);
						//		  _gaq.push(['_trackEvent', elEv.category.toLowerCase(), elEv.action.toLowerCase(), elEv.label.toLowerCase(), elEv.value, elEv.non_i]);
					} catch (err) {}
					if ( el.attr('target') == undefined || el.attr('target').toLowerCase() != '_blank') {
						setTimeout(function() { location.href = elEv.loc; }, 400);
						return false;
					}
				}
			}
		});
	});

} // close jQuery check