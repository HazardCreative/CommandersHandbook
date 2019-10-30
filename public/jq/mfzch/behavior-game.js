$(document).on('pagecreate', '#active-game', function(event){
	// enable Wake Lock with active game
	$(document).on('click', '#active-game', enableNoSleep);

	// open team actions
	$(document).on('click', '.team-info', function(){
		if(mfzch.appState.remote.mode
			&& mfzch.appState.remote.granted != 'modify') {
			return false;
		}

		if (mfzch.game.status < 5) {
			var teamid = $(this).parent().parent().attr('data-team-id');
			var team = mfzch.game.findTeamByUUID(teamid);

			$('#team-action').attr('data-team-id', teamid).popup('option', 'afterclose', '');

			var actions = mfzch.game.getActions(team);

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
		var teamid = $('#team-action').attr('data-team-id');
		var team = mfzch.game.findTeamByUUID(teamid);

		if(team.gFrames) {
			mfzch.undo.setState(mfzch.game);
			team.gFrames--;
			mfzch.game.logEvent(team.name + ' loses a frame');
			mfzch.game.updateScores();
			mfzch.updateActiveTeams(mfzch.game);
			mfzch.game.logScores('short');
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');

			mfzch.sendGameUpdate([
				{
					action: 'team-gFrames',
					teamid: team.uuid,
					gFrames: team.gFrames,
					gScore: team.gScore
				},
				{
					action: 'log',
					log: mfzch.game.logEvent(team.name + ' loses a frame', true)
				},
				{
					action: 'log',
					log: mfzch.game.logScores('short', true)
				}
			]);

			mfzch.settings.framesDestroyed++;
			mfzch.saveData('settings');

			try {
				ga('send', 'event', 'Game', 'Action', 'Destroyed Frame', 0, false);
			} catch (err) {}
		}

		$('#team-action').popup('close');
		mfzch.game.checkEarlyDoomsday();
	});

	// gain station option
	$(document).on('click', '#gain-station', function(){
		var teamid = $('#team-action').attr('data-team-id');
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var autoSelect = mfzch.getCapturableStations(teamid, true);

			if (autoSelect) {
				mfzch.undo.setState(mfzch.game);

				var capturedFrom = '';
				if (autoSelect == 'nobody') {
					mfzch.game.unclaimedStations--;
					capturedFrom = ' claims a contested station';
				} else {
					var teamauto = mfzch.game.findTeamByUUID(autoSelect);
					teamauto.gStations--;
					capturedFrom = ' captures a station from ' + teamauto.name;
				}
				team.gStations++;
				mfzch.game.logEvent(team.name + capturedFrom);
				mfzch.game.updateScores();
				mfzch.updateActiveTeams(mfzch.game);
				mfzch.game.logScores('short');
				mfzch.game.clientmodified = true;
				mfzch.saveData('game');

				mfzch.sendGameUpdate([
					{
						action: 'unclaimedStations',
						unclaimedStations: mfzch.game.unclaimedStations
					},
					{
						action: 'team-gStations',
						teamid: team.uuid,
						gStations: team.gStations,
						gScore: team.gScore
					},
					{
						action: 'log',
						log: mfzch.game.logEvent(team.name + capturedFrom, true)
					},
					{
						action: 'log',
						log: mfzch.game.logScores('short', true)
					}
				]);

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
		}
	});

	// lose station option
	$(document).on('click', '#lose-station', function(){
		var teamid = $('#team-action').attr('data-team-id');
		var autoSelect = mfzch.getCapturableStations(teamid, false);
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {

			if (autoSelect) {
				mfzch.undo.setState(mfzch.game);

				var teamauto = mfzch.game.findTeamByUUID(autoSelect);
				teamauto.gStations++;
				mfzch.game.logEvent(teamauto.name + ' captures a station from ' + team.name);

				team.gStations--;
				mfzch.game.updateScores();
				mfzch.updateActiveTeams(mfzch.game);
				mfzch.game.logScores('short');
				mfzch.game.clientmodified = true;
				mfzch.saveData('game');

				mfzch.sendGameUpdate([
					{
						action: 'team-gStations',
						teamid: team.uuid,
						gStations: team.gStations,
						gScore: team.gScore
					},
					{
						action: 'log',
						log: mfzch.game.logEvent(teamauto.name + ' captures a station from ' + team.name, true)
					},
					{
						action: 'log',
						log: mfzch.game.logScores('short', true)
					}
				]);

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
		}
	});

	// capture station
	$(document).on('click', '.station-capture-button', function(){
		var capturingTeamid = $('#team-action').attr('data-team-id');
		var capturedTeamid = $(this).attr('data-team-id');
		var capturedFrom = '';
		var capturingTeam = mfzch.game.findTeamByUUID(capturingTeamid);
		var capturedTeam = mfzch.game.findTeamByUUID(capturedTeamid);

		mfzch.undo.setState(mfzch.game);
		if (capturedTeamid == 'nobody') {
			mfzch.game.unclaimedStations--;
			capturedFrom = ' claims a contested station';
		} else {
			capturedTeam.gStations--;
			capturedFrom = ' captures a station from ' + capturedTeam.name;
		}
		capturingTeam.gStations++;
		mfzch.game.logEvent(capturingTeam.name + capturedFrom);
		mfzch.game.updateScores();
		mfzch.updateActiveTeams(mfzch.game);
		mfzch.game.logScores('short');
		mfzch.game.clientmodified = true;
		mfzch.saveData('game');

		if (capturedTeamid == 'nobody') { // hack so patch doesn't fail
			capturedTeam = new teamModel();
			capturedTeam.uuid = false;
		}
		mfzch.sendGameUpdate([
			{
				action: 'unclaimedStations',
				unclaimedStations: mfzch.game.unclaimedStations
			},
			{
				action: 'team-gStations',
				teamid: capturingTeam.uuid,
				gStations: capturingTeam.gStations,
				gScore: capturingTeam.gScore
			},
			{
				action: 'team-gStations',
				teamid: capturedTeam.uuid,
				gStations: capturedTeam.gStations,
				gScore: capturedTeam.gScore
			},
			{
				action: 'log',
				log: mfzch.game.logEvent(capturingTeam.name + capturedFrom, true)
			},
			{
				action: 'log',
				log: mfzch.game.logScores('short', true)
			}
		]);

		$('#station-capture').popup('close');
		try {
			ga('send', 'event', 'Game', 'Action', 'Station Captured', 0, false);
		} catch (err) {}

		mfzch.game.checkEarlyDoomsday();
	});

	// drop station
	$(document).on('click', '.station-drop-button', function(){
		var capturingTeamid = $(this).attr('data-team-id');
		var capturedTeamid = $('#team-action').attr('data-team-id');
		var capturedFrom = '';
		var capturingTeam = mfzch.game.findTeamByUUID(capturingTeamid);
		var capturedTeam = mfzch.game.findTeamByUUID(capturedTeamid);

		var logtext = '';
		mfzch.undo.setState(mfzch.game);
		if (capturingTeamid == 'nobody') {
			mfzch.game.unclaimedStations++;
			logtext = capturedTeam.name + ' loses a station which becomes contested';
		} else {
			capturingTeam.gStations++;
			logtext = capturingTeam.name + ' captures a station from ' + capturedTeam.name;
		}
		mfzch.game.logEvent(logtext);
		capturedTeam.gStations--;
		mfzch.game.updateScores();
		mfzch.updateActiveTeams(mfzch.game);
		mfzch.game.logScores('short');
		mfzch.game.clientmodified = true;
		mfzch.saveData('game');

		if (capturingTeamid == 'nobody') { // hack so patch doesn't fail
			capturingTeam = new teamModel();
			capturingTeam.uuid = false;
		}

		mfzch.sendGameUpdate([
			{
				action: 'unclaimedStations',
				unclaimedStations: mfzch.game.unclaimedStations
			},
			{
				action: 'team-gStations',
				teamid: capturingTeam.uuid,
				gStations: capturingTeam.gStations,
				gScore: capturingTeam.gScore
			},
			{
				action: 'team-gStations',
				teamid: capturedTeam.uuid,
				gStations: capturedTeam.gStations,
				gScore: capturedTeam.gScore
			},
			{
				action: 'log',
				log: mfzch.game.logEvent(logtext, true)
			},
			{
				action: 'log',
				log: mfzch.game.logScores('short', true)
			}
		]);

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
		mfzch.game.clientmodified = true;
		mfzch.saveData('game', true);
	});

	// redo
	$(document).on('click', '#redo', function(){
		mfzch.undo.getRedoState(mfzch.game);
		mfzch.game.updateScores();
		mfzch.updateActiveTeams(mfzch.game);
		mfzch.updateGameInfo(mfzch.game);
		mfzch.game.clientmodified = true;
		mfzch.saveData('game', true);
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

		mfzch.game.logEvent('Round ' + mfzch.game.round + ' ends (' + getDurationText(mfzch.game.roundTime) + '); Doomsday is now '+ mfzch.game.doomsday);
		mfzch.game.logSeparator();

		mfzch.sendGameUpdate([
			{
				action: 'log',
				log: mfzch.game.logEvent('Round ' + mfzch.game.round + ' ends (' + getDurationText(mfzch.game.roundTime) + '); Doomsday is now '+ mfzch.game.doomsday, true)
			},
			{
				action: 'log',
				log: mfzch.game.logSeparator(0, true)
			}
		]);

		mfzch.game.roundTime = Date.now();

		if (mfzch.game.doomsday < 1) {
			mfzch.game.endGame();
		} else {
			mfzch.game.round++;

			$('#ddc-current-team').html(getIcon('company', mfzch.game.teams[0].color, 'game-icon') + mfzch.game.teams[0].name);
			$('#ddc-count').attr('data-team-index', 0);

			$('#ddc-count').popup('option', 'afterclose', function(){
				setTimeout(function(){
					if (mfzch.game.doomsday > 0) {

						var teamIndex = $('#ddc-count').attr('data-team-index');

						if (teamIndex < mfzch.game.teams.length-1) {
							$('.gameinfo-doomsday-counter').html(mfzch.game.doomsday);
							teamIndex++;
							$('#ddc-current-team').html(getIcon('company', mfzch.game.teams[teamIndex].color, 'game-icon') + mfzch.game.teams[teamIndex].name);
							$('#ddc-count').attr('data-team-index', teamIndex);
							$('#ddc-count').popup('open');
						} else {
							mfzch.updateGameInfo(mfzch.game);
							mfzch.game.logEvent('Doomsday is now '+ mfzch.game.doomsday);
							mfzch.game.logSeparator();
							mfzch.game.logEvent('Round '+ mfzch.game.round + ' begins');
							mfzch.game.logScores();

							mfzch.sendGameUpdate([
								{
									action: 'log',
									log: mfzch.game.logEvent('Doomsday is now '+ mfzch.game.doomsday, true)
								},
								{
									action: 'log',
									log: mfzch.game.logSeparator(0, true)
								},
								{
									action: 'log',
									log: mfzch.game.logEvent('Round '+ mfzch.game.round + ' begins', true)
								},
								{
									action: 'log',
									log: mfzch.game.logScores(false, true)
								}
							]);

							mfzch.game.clientmodified = true;
							mfzch.saveData('game', true);
						}
					} else {
						mfzch.game.logEvent('Doomsday is now 0');

						mfzch.sendGameUpdate([
							{
								action: 'log',
								log: mfzch.game.logEvent('Doomsday is now 0', true)
							}
						]);
						mfzch.game.endGame();
					}
				}, 1); // wait until it COMPLETELY closes...
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

	// Tracking level 20+
	// manage frame
	$(document).on('click', '.frame-smash', function(){
		if (mfzch.game.status < 5) {
			var teamid = $(this).parent().parent().parent().attr('data-team-id');
			var frameid = $(this).parent().attr('data-frameid');
			var team = mfzch.game.findTeamByUUID(teamid);

			if (team) {
				var frame = team.findFrameByUUID(frameid);

				if (frame) {
					$('#team-smash-id').val(teamid);
					$('#frame-smash-id').val(frameid);
					$('#frame-smash-name').html(getIcon('frame', team.color, 'game-icon') + frame.name);
					$('#frame-smash-systems').html(frame.getSystemDisplay(false, true));

					// Tracking level 30+
					if (mfzch.game.trackingLevel >= 30) {
						if (frame.activated) {
							$('#frame-smash-activate').hide();
							$('#frame-smash-def-set').show();
						} else {
							$('#frame-smash-activate').show();
							$('#frame-smash-def-set').hide();
						}
						$('#frame-smash-activated').checkboxradio('refresh');
						$('#frame-smash-defense').val(frame.defense).slider('refresh');
						$('#frame-smash-spot').val(frame.spot).slider('refresh');
					}

					$('#frame-smash').popup('open');
				}
			}
		}
	});

	// remove system
	$(document).on('click', '#frame-smash-systems li', function(){
		var teamid = $('#team-smash-id').val();
		var frameid = $('#frame-smash-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				mfzch.undo.setState(mfzch.game);

				var sysType = $(this).attr('data-sys');

				if(frame.removeSystem(sysType)) {
					var logtext = '';

					if (sysType == 'ssr') {
						logtext = team.name + ' fires an SSR from '+ frame.name;
						try {
							ga('send', 'event', 'Game', 'Action', 'Fired SSR', 0, false);
						} catch (err) {}
					} else {
						logtext = team.name + ' loses a system (' + sysType + ') from '+ frame.name;
						try {
							ga('send', 'event', 'Game', 'Action', 'Destroyed System', 0, false);
						} catch (err) {}
					}
					mfzch.game.logEvent(logtext);
					mfzch.game.clientmodified = true;
					mfzch.saveData('game');

					mfzch.sendGameUpdate([
						{
							action: 'team-frame-update',
							teamid: team.uuid,
							frameid: frame.uuid,
							frame: frame
						},
						{
							action: 'team-sSystems',
							teamid: team.uuid,
							sSystems: team.sSystems
						},
						{
							action: 'log',
							log: mfzch.game.logEvent(logtext, true)
						}
					]);

					mfzch.settings.systemsDestroyed++;
					mfzch.saveData('settings');

					$('#frame-smash-systems').html(frame.getSystemDisplay(false, true));
					mfzch.updateActiveTeams(mfzch.game);
				} else {
					mfzch.undo.invalidateLastState();
				}
			} else {
				$('#frame-smash').popup('close');
			}
		} else {
			$('#frame-smash').popup('close');
		}
	});

	// delete frame
	$(document).on('click', '#frame-smash-destroy', function(){
		var teamid = $('#team-smash-id').val();
		var frameid = $('#frame-smash-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				mfzch.undo.setState(mfzch.game);

				mfzch.game.logEvent(team.name + ' loses a frame: '+ frame.name);

				try {
					ga('send', 'event', 'Game', 'Action', 'Destroyed Frame', 0, false);
				} catch (err) {}

				$('#active-game-teams [data-team-id=' + teamid + '] [data-frameid=' + frameid + ']').slideUp(function(){
					mfzch.updateActiveTeams(mfzch.game);
				});

				var index = team.cFrames.indexOf(frame);

				if (index !== -1) {

					team.cFrames.splice(index, 1);
					team.gFrames = team.cFrames.length;
					team.sSystems = team.totalSystems();

					mfzch.game.updateScores();
					mfzch.game.logScores('short');
					mfzch.game.clientmodified = true;
					mfzch.saveData('game');

					mfzch.sendGameUpdate([
						{
							action: 'team-frame-del',
							teamid: team.uuid,
							frameid: frame.uuid
						},
						{
							action: 'team-gFrames',
							teamid: team.uuid,
							gFrames: team.gFrames,
							gScore: team.gScore
						},
						{
							action: 'team-sSystems',
							teamid: team.uuid,
							sSystems: team.sSystems
						},
						{
							action: 'log',
							log: mfzch.game.logEvent(team.name + ' loses a frame: '+ frame.name, true)
						}
					]);

					mfzch.settings.framesDestroyed++;
					mfzch.saveData('settings');
					$('#frame-smash').popup('close');

					mfzch.game.checkEarlyDoomsday();
				}
			} else {
				$('#frame-smash').popup('close');
			}
		} else {
			$('#frame-smash').popup('close');
		}
	});

	$(document).on('click', '#frame-smash-submit', function(){
		$('#frame-smash').popup('close');
	});

	// send to sim
	$(document).on('click', '#frame-smash-sim1', function(){
		var teamid = $('#team-smash-id').val();
		var frameid = $('#frame-smash-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				mfzch.frameNow = 1;
				jQuery.extend(mfzch.frameSet[1], frame);

				try {
					ga('send', 'event', 'Game', 'Action', 'Send to Sim', 0, false);
				} catch (err) {}

				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");
			} else {
				$('#frame-smash').popup('close');
			}
		} else {
			$('#frame-smash').popup('close');
		}
	});

	$(document).on('click', '#frame-smash-sim2', function(){
		var teamid = $('#team-smash-id').val();
		var frameid = $('#frame-smash-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				mfzch.frameNow = 2;
				jQuery.extend(mfzch.frameSet[2], frame);

				try {
					ga('send', 'event', 'Game', 'Action', 'Send to Sim', 0, false);
				} catch (err) {}

			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");

			} else {
				$('#frame-smash').popup('close');
			}
		} else {
			$('#frame-smash').popup('close');
		}
	});

	// Tracking level 30+
	$(document).on('click', '#frame-smash-activate', function(){
		var teamid = $('#team-smash-id').val();
		var frameid = $('#frame-smash-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				mfzch.undo.setState(mfzch.game);

				frame.activated = true;

				$('#frame-smash-def-set').show();
				$('#frame-smash-activate').hide();

				mfzch.game.logEvent(team.name + ' activates '+ frame.name);
				try {
					ga('send', 'event', 'Game', 'Action', 'Activation', 0, false);
				} catch (err) {}

				mfzch.game.clientmodified = true;
				mfzch.saveData('game');

				mfzch.sendGameUpdate([
					{
						action: 'team-frame-update',
						teamid: team.uuid,
						frameid: frame.uuid,
						frame: frame
					},
					{
						action: 'log',
						log: mfzch.game.logEvent(team.name + ' activates '+ frame.name, true)
					}
				]);

				mfzch.updateActiveTeams(mfzch.game);
			} else {
				$('#frame-smash').popup('close');
			}
		} else {
			$('#frame-smash').popup('close');
		}
	});

	$(document).on('slidestop', '#frame-smash-defense', function(){
		var teamid = $('#team-smash-id').val();
		var frameid = $('#frame-smash-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				mfzch.undo.setState(mfzch.game);

				frame.defense = $('#frame-smash-defense').val();

				mfzch.game.logEvent(team.name + ' sets the defense of '+ frame.name + ' to ' + frame.defense);
				try {
					ga('send', 'event', 'Game', 'Action', 'Defense', frame.defense, false);
				} catch (err) {}

				mfzch.game.clientmodified = true;
				mfzch.saveData('game');

				mfzch.sendGameUpdate([
					{
						action: 'team-frame-update',
						teamid: team.uuid,
						frameid: frame.uuid,
						frame: frame
					},
					{
						action: 'log',
						log: mfzch.game.logEvent(team.name + ' sets the defense of '+ frame.name + ' to ' + frame.defense, true)
					}
				]);

				mfzch.updateActiveTeams(mfzch.game);
			} else {
				$('#frame-smash').popup('close');
			}
		} else {
			$('#frame-smash').popup('close');
		}
	});

	$(document).on('slidestop', '#frame-smash-spot', function(){
		var teamid = $('#team-smash-id').val();
		var frameid = $('#frame-smash-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				mfzch.undo.setState(mfzch.game);

				frame.spot = $('#frame-smash-spot').val();;

				mfzch.game.logEvent(team.name + ' ' + frame.name + ' receives a spot of ' + frame.spot);
				try {
					ga('send', 'event', 'Game', 'Action', 'Defense', frame.spot, false);
				} catch (err) {}

				mfzch.game.clientmodified = true;
				mfzch.saveData('game');

				mfzch.sendGameUpdate([
					{
						action: 'team-frame-update',
						teamid: team.uuid,
						frameid: frame.uuid,
						frame: frame
					},
					{
						action: 'log',
						log: mfzch.game.logEvent(team.name + ' ' + frame.name + ' receives a spot of ' + frame.spot, true)
					}
				]);

				mfzch.updateActiveTeams(mfzch.game);
			} else {
				$('#frame-smash').popup('close');
			}
		} else {
			$('#frame-smash').popup('close');
		}
	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'active-game') {
		if (!mfzch.game.teams.length){ // display correct panel
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#team_setup", { changeHash: false } );
		} else {
			mfzch.updateActiveTeams(mfzch.game);
			mfzch.updateGameInfo(mfzch.game);

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

			if (mfzch.game.shared) {
				$('.game-link').html('This game is shared. <a href="/game/'+ mfzch.game.uuid+ '/">Link to this game</a>.');
				$('.game-link').show();
			} else {
				$('.game-link').hide();
			}

			if(mfzch.appState.remote.mode) {
				if(mfzch.appState.remote.granted != 'modify') {
					$('#end-round').hide();
					$('#undo').hide();
					$('#redo').hide();
				} else {
					$('#end-round').show();
					$('#undo').show();
					$('#redo').show();
				}

				clearInterval(mfzch.remoteSync['active-game']);

				mfzch.remoteSync['active-game'] = setInterval(function(){
					mfzch.checkRemoteStatus('active-game', function(){
						mfzch.updateActiveTeams(mfzch.game);
						mfzch.updateGameInfo(mfzch.game);

						if (mfzch.game.doomsday < 1) {
							$('#end-round').hide();
						} else {
							if(mfzch.appState.remote.granted == 'modify') {
								$('#end-round').show();
							}
						}
					});
				}, mfzch.appState.remote.refresh);
			}
		}
	}
});

$(document).on( "pagecontainerhide", function( event, ui ) {
	if (ui.prevPage[0].id == 'active-game') {
		clearInterval(mfzch.remoteSync['active-game']);
		noSleep.disable();
	}
});