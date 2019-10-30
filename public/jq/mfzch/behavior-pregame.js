$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'game-tracking') {
		$( ":mobile-pagecontainer" ).pagecontainer( "change", mfzch.chooseGamePage(), { changeHash: false } );
	}
});

/* ------ status 0: set parameters ------ */

$(document).on('pagecreate', '#game-setup', function(event){
	// Number of players slider
	$(document).on('change', '#game-players-amount', function(){
		mfzch.game.intendedPlayers = parseInt($('#game-players-amount').val());
		mfzch.game.clientmodified = true;
		mfzch.updateSetupParameters(mfzch.game);
	});

	// game type switch
	$(document).on('change', '#game-type-switch', function(){
		mfzch.game.gameType = $('#game-type-switch').val();
		mfzch.game.clientmodified = true;
		mfzch.updateSetupParameters(mfzch.game);
	});

	//
	$(document).on('change', '#gp-framesPerPlayer', function(){
		mfzch.game.minFrames = parseInt($('#gp-framesPerPlayerMin').val());
		mfzch.game.clientmodified = true;
		mfzch.game.maxFrames = parseInt($('#gp-framesPerPlayerMax').val());
	});

	//
	$(document).on('change', '#gp-stationsPerPlayer', function(){
		mfzch.game.stationsPerPlayer = parseInt($('#gp-stationsPerPlayer').val());
		mfzch.game.clientmodified = true;
	});

	//
	$(document).on('change', '#gp-unclaimedStations', function(){
		mfzch.game.unclaimedStations = parseInt($('#gp-unclaimedStations').val());
		mfzch.game.clientmodified = true;
	});

	//
	$(document).on('change', '#gp-doomsday', function(){
		mfzch.game.doomsday = parseInt($('#gp-doomsday').val());
		mfzch.game.clientmodified = true;
	});

	// tracking level switch
	$(document).on('change', '#game-tracking-level', function(){
		mfzch.game.trackingLevel = $('#game-tracking-level').val();
		mfzch.game.clientmodified = true;
	});

	// view password
	$(document).on('change', '#game-viewpassword', function(){
		mfzch.game.viewPassword = $('#game-viewpassword').val();
		mfzch.game.passwordSet = false;
		mfzch.game.clientmodified = true;
	});

	// modify password
	$(document).on('change', '#game-modifypassword', function(){
		mfzch.game.modifyPassword = $('#game-modifypassword').val();
		mfzch.game.passwordSet = false;
		mfzch.game.clientmodified = true;
	});

	// continue
	$(document).on('click', '#create-game', function(event){
		event.preventDefault();
		mfzch.game.status = 1;
		mfzch.game.clientmodified = true;
		mfzch.saveData('game', true);

		if (mfzch.game.shared) {
			mfzch.appState.remote.mode = 'host';
			mfzch.appState.remote.id = mfzch.game.uuid;
			mfzch.appState.remote.password = mfzch.game.modifyPassword;
			mfzch.appState.remote.granted = 'modify';
		} else {
			mfzch.appState.remote.mode = false;
			mfzch.appState.remote.id = false;
			mfzch.appState.remote.password = false;
			mfzch.appState.remote.granted = false;
		}

		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#company-entry", { changeHash: false } );
	});
});

function gameBlindSetupChanged(e) {
	if ($(this).val() == 'on') {
		mfzch.game.blindSetup = true;
	} else {
		mfzch.game.blindSetup = false;
		mfzch.game.teams = [];
	}
	mfzch.game.clientmodified = true;
};

function gameSharingChanged(e) {
	if ($(this).val() == 'on') {
		mfzch.game.shared = true;
		$('.game-online-form').removeClass('ui-screen-hidden');
	} else {
		mfzch.game.shared = false;
		$('.game-online-form').addClass('ui-screen-hidden');
	}
	mfzch.game.clientmodified = true;
	mfzch.game.uuid = generateUUID();
	$('#game-params').listview('refresh');
};

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'game-setup') {

		$('#game-players-amount').val(mfzch.game.intendedPlayers).slider('refresh');
		$('#game-type-switch').val(mfzch.game.gameType).selectmenu('refresh');
		$('#gp-framesPerPlayerMin').val(mfzch.game.minFrames);
		$('#gp-framesPerPlayerMax').val(mfzch.game.maxFrames);
		$('#gp-framesPerPlayer').rangeslider('refresh');
		$('#gp-stationsPerPlayer').val(mfzch.game.stationsPerPlayer).slider('refresh');
		$('#gp-unclaimedStations').val(mfzch.game.unclaimedStations).slider('refresh');
		$('#gp-doomsdays').val(mfzch.game.doomsday).slider('refresh');
		$('#game-tracking-level').val(mfzch.game.trackingLevel).selectmenu('refresh');

		$('#game-viewpassword').val(mfzch.game.viewPassword);
		$('#game-modifypassword').val(mfzch.game.modifyPassword);

		$(document).off('change', '#game-blind-setup');
		if (mfzch.game.blindSetup) {
			$('#game-blind-setup').val('on').flipswitch('refresh');
		} else {
			$('#game-blind-setup').val('off').flipswitch('refresh');
		}
		$(document).on('change', '#game-blind-setup', gameBlindSetupChanged);

		$(document).off('change', '#game-view-access');
		if (mfzch.game.shared) {
			$('#game-view-access').val('on').flipswitch('refresh');
		} else {
			$('#game-view-access').val('off').flipswitch('refresh');
		}
		$(document).on('change', '#game-view-access', gameSharingChanged);

		mfzch.updateSetupParameters(mfzch.game);
	}
});

/* ------ status 1: company setup ------ */

$(document).on('pagecreate', '#company-entry', function(event){
	// back
	$(document).on('click', '#change-parameters', function(event){
		mfzch.game.status = 0;
		mfzch.game.clientmodified = true;
		mfzch.saveData('game');
		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
	});

	// add team
	$(document).on('click', '#team-add', function(){
		var team = new teamModel();

		var teamDesc = mfzch.generateDescriptor();

		team.name = uniqueName(teamDesc[0], buildNameArray(mfzch.game.teams));
		team.color = teamDesc[1];

		mfzch.game.teams.push(team);
		mfzch.saveData('game');

		mfzch.updateTeamList(mfzch.game);
		mfzch.updateReadyStatus(mfzch.game);

		$('#team-id').val(team.uuid);
		$('#team-name').val(team.name);
		$('#team-color').val(team.color);

		if (mfzch.game.trackingLevel > 10) {
			mfzch.updateTeamFrameList(mfzch.game, team, $('#team-adjust-long-company-list'));
		} else {
			$('#team-frames').val(team.gFrames).slider( "refresh" );
			$('#team-systems').val(team.sSystems).slider( "refresh" );
			mfzch.updateSystemsInputs();
		}

		mfzch.game.clientmodified = true;
		mfzch.saveData('game');

		mfzch.sendGameUpdate([
			{
				action: 'team-add',
				team: team
			}
		]);

		$('#team-adjust').popup('open');
	});

	// delete team
	$(document).on('click', '.team-del', function(){
		var teamid = $(this).parent().attr('data-teamid');
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var index = mfzch.game.teams.indexOf(team);

			if (index !== -1) {
				mfzch.game.teams.splice(index, 1);

				mfzch.saveData('game');

				$('#teams [data-teamid=' + teamid + ']').slideUp(function(){
					mfzch.updateTeamList(mfzch.game);
				});

				mfzch.updateReadyStatus(mfzch.game);
				mfzch.game.clientmodified = true;
				mfzch.saveData('game');

				mfzch.sendGameUpdate([
					{
						action: 'team-del',
						teamid: team.uuid
					}
				]);
			}
		}
	});

	// manage team
	$(document).on('click', '.team-manage', function(event){
		var teamid = $(this).parent().attr('data-teamid');
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			$('#team-id').val(team.uuid);
			$('#team-name').val(team.name);
			$('#team-color').val(team.color);

			if (mfzch.game.trackingLevel > 10) {
				mfzch.updateTeamFrameList(mfzch.game, team, $('#team-adjust-long-company-list'));
			} else {
				$('#team-frames').val(team.gFrames).slider( "refresh" );
				$('#team-systems').val(team.sSystems).slider( "refresh" );
				mfzch.updateSystemsInputs();
			}
		} else {
			event.preventDefault();
		}
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

	$(document).on('change', '#team-name', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			team.name = uniqueName($('<div/>').text($('#team-name').val()).html(), buildNameArray(mfzch.game.teams));

			mfzch.updateTeamList(mfzch.game);
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');

			mfzch.sendGameUpdate([
				{
					action: 'team-name',
					teamid: team.uuid,
					name: team.name
				}
			]);
		} else {
			$('#team-adjust').popup('close');
		}
	});

	$(document).on('change', '#team-color', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			team.color = $('#team-color').val();

			mfzch.updateTeamList(mfzch.game);
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');

			mfzch.sendGameUpdate([
				{
					action: 'team-color',
					teamid: team.uuid,
					color: team.color
				}
			]);
		} else {
			$('#team-adjust').popup('close');
		}
	});

	$(document).on('slidestop', '#team-frames', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			team.gFrames = parseInt($('#team-frames').val());

			mfzch.updateTeamList(mfzch.game);
			mfzch.updateReadyStatus(mfzch.game);
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');

			mfzch.sendGameUpdate([
				{
					action: 'team-gFrames',
					teamid: team.uuid,
					gFrames: team.gFrames
				}
			]);
		} else {
			$('#team-adjust').popup('close');
		}
	});

	$(document).on('slidestop', '#team-systems', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			team.sSystems = parseInt($('#team-systems').val());

			mfzch.updateTeamList(mfzch.game);
			mfzch.updateReadyStatus(mfzch.game);
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');

			mfzch.sendGameUpdate([
				{
					action: 'team-sSystems',
					teamid: team.uuid,
					sSystems: team.sSystems
				}
			]);
		} else {
			$('#team-adjust').popup('close');
		}
	});

	// team regen name/color
	$(document).on('click', '#team-regen', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var teamDesc = mfzch.generateDescriptor();

			$('#team-name').val(teamDesc[0]);
			$('#team-color').val(teamDesc[1]);
			team.name = uniqueName(teamDesc[0], buildNameArray(mfzch.game.teams));
			team.color = teamDesc[1];

			mfzch.updateTeamList(mfzch.game);
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');

			mfzch.sendGameUpdate([
				{
					action: 'team-name',
					teamid: team.uuid,
					name: team.name
				},
				{
					action: 'team-color',
					teamid: team.uuid,
					color: team.color
				}
			]);
		} else {
			$('#team-adjust').popup('close');
		}
	});

	// add frame
	$(document).on('click', '#team-frame-add', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frame = new frameModel();
			frame.name = uniqueName('Frame', buildNameArray(team.cFrames));

			team.cFrames.push(frame);
			team.gFrames = team.cFrames.length;
			team.sSystems = team.totalSystems();

			mfzch.updateTeamList(mfzch.game);

			$('#team-id').val(teamid);
			$('#team-frame-id').val(frame.uuid);
			$('#team-adjust-frame-name').val(frame.name);
			$('#team-adjust-frame-systems').html(frame.getSystemDisplay(false, true));

			// go to frame selector next
			$('#team-adjust').on({
				popupafterclose: function() {
					setTimeout( function(){
						$('#team-adjust-frame').popup('open');
						$('#team-adjust').off('popupafterclose');
					}, 100 );
				}
			});

			mfzch.updateTeamList(mfzch.game);
			mfzch.updateReadyStatus(mfzch.game);
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');

			mfzch.sendGameUpdate([
				{
					action: 'team-frame-add',
					teamid: team.uuid,
					frameid: frame.uuid,
					frame: frame
				},
				{
					action: 'team-gFrames',
					teamid: team.uuid,
					gFrames: team.gFrames
				},
				{
					action: 'team-sSystems',
					teamid: team.uuid,
					sSystems: team.sSystems
				}
			]);
		}

		$('#team-adjust').popup('close');
	});

	// delete frame
	$(document).on('click', '#team-adjust-long-company-list .team-frame-del', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frameid = $(this).parent().attr('data-frameid');
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				var index = team.cFrames.indexOf(frame);

				if (index !== -1) {
					team.cFrames.splice(index, 1);

					team.gFrames = team.cFrames.length;
					team.sSystems = team.totalSystems();

					$('#team-adjust-long-company-list [data-frameid=' + frameid + ']').slideUp(function(){
						mfzch.updateTeamFrameList(mfzch.game, team, $('#team-adjust-long-company-list'));
					});

					mfzch.updateTeamList(mfzch.game);
					mfzch.updateReadyStatus(mfzch.game);
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
							gFrames: team.gFrames
						},
						{
							action: 'team-sSystems',
							teamid: team.uuid,
							sSystems: team.sSystems
						}
					]);
				}
			}
		} else {
			$('#team-adjust').popup('close');
		}
	});

	// manage frame
	$(document).on('click', '.team-frame-manage', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frameid = $(this).parent().attr('data-frameid');
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				$('#team-frame-id').val(frameid);
				$('#team-adjust-frame-name').val(frame.name);
				$('#team-adjust-frame-systems').html(frame.getSystemDisplay(false, true));

				// go to frame selector next
				$('#team-adjust').on({
					popupafterclose: function() {
						setTimeout( function(){
							$('#team-adjust-frame').popup('open');
							$('#team-adjust').off('popupafterclose');
						}, 100 );
					}
				});
			}
		}

		$('#team-adjust').popup('close');
	});

	$(document).on('focus', '#team-adjust-frame-name', function(){
		this.select();
	});

	$(document).on('change', '#team-adjust-frame-name', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frameid = $('#team-frame-id').val();
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				var frameName = $('#team-adjust-frame-name').val();
				frame.name = uniqueName($('<div/>').text(frameName).html(), buildNameArray(team.cFrames));

				mfzch.updateTeamFrameList(mfzch.game, team, $('#team-adjust-long-company-list'));
				mfzch.game.clientmodified = true;
				mfzch.saveData('game');

				mfzch.sendGameUpdate([
					{
						action: 'team-frame-update',
						teamid: team.uuid,
						frameid: frame.uuid,
						frame: frame
					}
				]);
			} else {
				/* *** */
			}

		} else {
			// don't return to normal adjust when killed
			$('#team-adjust-frame').off('popupafterclose');
			$('#team-adjust-frame').popup('close');
			$('#team-adjust-frame').on({
				popupafterclose: returnToCompanyAdjust
			});
		}
	});

	// add system
	$(document).on('click', '#team-adjust-frame a.add-sys', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frameid = $('#team-frame-id').val();
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				frame.addSystem($(this).attr('data-sys-type'));
				$('#team-adjust-frame-systems').html(frame.getSystemDisplay(false, true));
				team.sSystems = team.totalSystems();

				mfzch.updateTeamFrameList(mfzch.game, team, $('#team-adjust-long-company-list'));
				mfzch.updateTeamList(mfzch.game);
				mfzch.updateReadyStatus(mfzch.game);
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
					}
				]);
			} else {
				/* *** */
			}
		} else {
			// don't return to normal adjust when killed
			$('#team-adjust-frame').off('popupafterclose');
			$('#team-adjust-frame').popup('close');
			$('#team-adjust-frame').on({
				popupafterclose: returnToCompanyAdjust
			});
		}
	});

	// reset systems
	$(document).on('click', '#team-adjust-frame a.reset-sys', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frameid = $('#team-frame-id').val();
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				frame.w = 2;
				frame.rh = 0;
				frame.rd = 0;
				frame.ra = 0;
				frame.b = 0;
				frame.y = 0;
				frame.g = 0;
				frame.e = 0;
				frame.ssr = 0;
				frame.rhd = 0;
				frame.rhd = 0;
				frame.rha = 0;
				frame.rda = 0;

				team.sSystems = team.totalSystems();

				$('#team-adjust-frame-systems').html(frame.getSystemDisplay(false, true));

				mfzch.updateTeamFrameList(mfzch.game, team, $('#team-adjust-long-company-list'));
				mfzch.updateTeamList(mfzch.game);
				mfzch.updateReadyStatus(mfzch.game);
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
					}
				]);
			} else {
				/* *** */
			}
		} else {
			// don't return to normal adjust when killed
			$('#team-adjust-frame').off('popupafterclose');
			$('#team-adjust-frame').popup('close');
			$('#team-adjust-frame').on({
				popupafterclose: returnToCompanyAdjust
			});
		}
	});

	// remove system
	$(document).on('click', '#team-adjust-frame-systems li', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var frameid = $('#team-frame-id').val();
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				frame.removeSystem($(this).attr('data-sys'));
				team.sSystems = team.totalSystems();

				$('#team-adjust-frame-systems').html(frame.getSystemDisplay(false, true));

				mfzch.updateTeamFrameList(mfzch.game, team, $('#team-adjust-long-company-list'));
				mfzch.updateTeamList(mfzch.game);
				mfzch.updateReadyStatus(mfzch.game);
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
					}
				]);
			} else {
				/* *** */
			}
		} else {
			// don't return to normal adjust when killed
			$('#team-adjust-frame').off('popupafterclose');
			$('#team-adjust-frame').popup('close');
			$('#team-adjust-frame').on({
				popupafterclose: returnToCompanyAdjust
			});
		}
	});

	// always return to team dialog after
	$('#team-adjust-frame').on({
		popupafterclose: returnToCompanyAdjust
	});

	// update max systems (when tracking >10)
	$(document).on('change', '#team-frames', function(){
		mfzch.updateSystemsInputs();
	});

	// open company import selector
	$(document).on('click', '#team-choose-company', function(){
		// go to company selector next
		$('#team-adjust').on({
			popupafterclose: function() {
				setTimeout( function(){
					$('#team-import-company').popup('open');
					$('#team-adjust').off('popupafterclose');
				}, 100 );
			}
		});
		$('#team-import-company-list').html(mfzch.getShortCompanyList());
		$('#team-import-company-list').listview('refresh');
		$('#team-adjust').popup('close');
	});

	// do company import
	$(document).on('click', '#team-import-company-list li', function(){
		var teamid = $('#team-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);

		if (team) {
			var companyid = $(this).attr('data-id');
			var company = findObjectByUUID(companyid, mfzch.companies);

			if (company) {
				team.name = uniqueName(company.name, buildNameArray(mfzch.game.teams));
				team.color = company.color;
				team.cFrames = [];
				company.frames.forEach (function(item, index){
					var srcFrame = company.frames[index];
					var destFrame = new frameModel();

					destFrame.name = srcFrame.name;
					destFrame.w = srcFrame.w;
					destFrame.rh = srcFrame.rh
					destFrame.rd = srcFrame.rd
					destFrame.ra = srcFrame.ra
					destFrame.b = srcFrame.b
					destFrame.y = srcFrame.y;
					destFrame.g = srcFrame.g;
					destFrame.e = srcFrame.e;
					destFrame.ssr = srcFrame.ssr;
					destFrame.rhd = srcFrame.rhd;
					destFrame.rha = srcFrame.rha;
					destFrame.rda = srcFrame.rda;

					team.cFrames.push(destFrame);
				})
				team.gFrames = team.cFrames.length;
				team.sSystems = team.totalSystems();

				$('#team-name').val(team.name);
				$('#team-color').val(team.color);
				$('#team-frames').val(team.gFrames).slider( "refresh" );
				$('#team-systems').val(team.sSystems).slider( "refresh" );
				mfzch.updateSystemsInputs();

				mfzch.updateTeamFrameList(mfzch.game, team, $('#team-adjust-long-company-list'));
				mfzch.updateTeamList(mfzch.game);
				mfzch.updateReadyStatus(mfzch.game);
				mfzch.game.clientmodified = true;
				mfzch.saveData('game');

				mfzch.sendGameUpdate([
					{
						action: 'team-name',
						teamid: team.uuid,
						name: team.name
					},
					{
						action: 'team-color',
						teamid: team.uuid,
						color: team.color
					},
					{
						action: 'team-frames-replace',
						teamid: team.uuid,
						cFrames: team.cFrames
					},
					{
						action: 'team-gFrames',
						teamid: team.uuid,
						gFrames: team.gFrames
					},
					{
						action: 'team-sSystems',
						teamid: team.uuid,
						sSystems: team.sSystems
					}
				]);
			}
		}

		$('#team-import-company').popup('close');
	});

	// always return to team dialog after
	$('#team-import-company').on({
		popupafterclose: returnToCompanyAdjust
	});

	// confirm companies; decide destination
	$(document).on('click', '#confirm-companies', function(){
		mfzch.game.reset();
		mfzch.game.sortByScore();

		if (mfzch.game.trackingLevel >= 20) {
			for (var i in mfzch.game.teams) {
				var team = mfzch.game.teams[i];
				team.gFrames = team.cFrames.length;
				team.sSystems = team.totalSystems();
			}
		}

		if (mfzch.game.gameType == "Battle"
			|| mfzch.game.gameType == "Skirmish") {

			if (mfzch.game.tiedForDefense()) { // check for defensive tie
				mfzch.game.status = 2;
				mfzch.game.clientmodified = true;
				mfzch.saveData('game', true);

				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#setup-tie", { changeHash: false } );
			} else {
				mfzch.game.status = 3;
				mfzch.game.clientmodified = true;
				mfzch.saveData('game', true);

				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-deployment", { changeHash: false } );
			}
		} else {
			mfzch.game.start();
			mfzch.game.status = 4;
			mfzch.game.clientmodified = true;
			mfzch.saveData('game', true);

			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#active-game", { changeHash: false } );
		}
	});
});

function returnToCompanyAdjust() {
	var teamid = $('#team-id').val();
	var team = mfzch.game.findTeamByUUID(teamid);

	if (team) {
		mfzch.updateTeamFrameList(mfzch.game, team, $('#team-adjust-long-company-list'));
		setTimeout( function(){ $('#team-adjust').popup('open') }, 100 );
	}
};

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'company-entry') {
		mfzch.outputSetupParameters(mfzch.game);
		mfzch.updateTeamList(mfzch.game);
		mfzch.updateReadyStatus(mfzch.game);

		$('#team-frames').attr('max', mfzch.game.maxFrames);
		$('#team-frames').attr('min', mfzch.game.minFrames);
		$('#team-systems').attr('max', mfzch.game.maxFrames * 4);

		if (mfzch.game.trackingLevel < 20) {
			$('#team-adjust-data-short').show();
			$('#team-adjust-data-long').hide();
		} else {
			$('#team-adjust-data-short').hide();
			$('#team-adjust-data-long').show();
		}

		if (mfzch.companies.length) {
			$('#team-choose-company').show();
		} else {
			$('#team-choose-company').hide();
		}

		if (mfzch.game.shared) {
			$('.game-link').html('This game is shared. <a href="/game/'+ mfzch.game.uuid+ '/">Link to this game</a>.');
			$('.game-link').show();
		} else {
			$('.game-link').hide();
		}

		if(mfzch.appState.remote.mode
			&& mfzch.appState.remote.granted != 'modify') {
			$('#confirm-companies').hide();
		} else {
			$('#confirm-companies').show();
		}

		if(mfzch.appState.remote.mode) {
			if (mfzch.appState.remote.mode != 'host') {
				$('#change-parameters').hide();
			}

			clearInterval(mfzch.remoteSync['company-entry']);
			mfzch.remoteSync['company-entry'] = setInterval(function(){
				mfzch.checkRemoteStatus('company-entry', function(){
					mfzch.outputSetupParameters(mfzch.game);
					mfzch.updateTeamList(mfzch.game);
					mfzch.updateReadyStatus(mfzch.game);

					$('#team-frames').attr('max', mfzch.game.maxFrames);
					$('#team-frames').attr('min', mfzch.game.minFrames);

					if (mfzch.companies.length) {
						$('#team-choose-company').show();
					} else {
						$('#team-choose-company').hide();
					}
				});
			}, mfzch.appState.remote.refresh);
		} else {
			$('#change-parameters').show();
		}
	}
});

$(document).on( "pagecontainerhide", function( event, ui ) {
	if (ui.prevPage[0].id == 'company-entry') {
		clearInterval(mfzch.remoteSync['company-entry']);
	}
});

/* ------ status 2: tie resolution ------ */

$(document).on('pagecreate', '#setup-tie', function(event){

	$('#tie-frame-add').on({
		popupbeforeposition: function() {
			if (mfzch.game.trackingLevel >= 20) {
				var teamid = $('#def-team-choice-id').val();
				var team = mfzch.game.findTeamByUUID(teamid);

				if (team) {
					var frame = new frameModel();
					frame.name = uniqueName('Frame', buildNameArray(team.cFrames));

					team.cFrames.push(frame);
					team.gFrames = team.cFrames.length;

					var frameid = frame.uuid;
					$('#tie-frame-add-id').val(frameid);
					$('#tie-frame-add-name').val(frame.name);
					$('#tie-frame-add-systems').html(frame.getSystemDisplay(false, true));
				} else {
					mfzch.game.status = 0;
					mfzch.game.clientmodified = true;
					mfzch.saveData('game');
					$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
				}

			}
		}
	});

	$(document).on('focus', 'tie-frame-add-name', function(){
		this.select();
	});

	// add system
	$(document).on('click', '#tie-frame-add a.add-sys', function(){
		var teamid = $('#def-team-choice-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);
		if (team) {
			var frameid = $('#tie-frame-add-id').val();
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				frame.addSystem($(this).attr('data-sys-type'));
				$('#tie-frame-add-systems').html(frame.getSystemDisplay(false, true));
			} else {
				mfzch.determineTieChoices(mfzch.game);
			}
		} else {
			mfzch.game.status = 0;
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
		}
	});

	// reset systems
	$(document).on('click', '#tie-frame-add a.reset-sys', function(){
		var teamid = $('#def-team-choice-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);
		if (team) {
			var frameid = $('#tie-frame-add-id').val();
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				frame = new frameModel();
				var frameName = $('#team-adjust-frame-name').val();
				frame.name = uniqueName($('<div/>').text(frameName).html(), buildNameArray(team.cFrames));

				$('#tie-frame-add-systems').html(frame.getSystemDisplay(false, true));
			} else {
				mfzch.determineTieChoices(mfzch.game);
			}
		} else {
			mfzch.game.status = 0;
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
		}
	});

	// remove system
	$(document).on('click', '#tie-frame-add-systems li', function(){
		var teamid = $('#def-team-choice-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);
		if (team) {
			var frameid = $('#tie-frame-add-id').val();
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				frame.removeSystem($(this).attr('data-sys'));

				$('#tie-frame-add-systems').html(frame.getSystemDisplay(false, true));
			} else {
				mfzch.determineTieChoices(mfzch.game);
			}
		} else {
			mfzch.game.status = 0;
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
		}
	});

	$(document).on('change', '#tie-frame-add-name', function(){
		var teamid = $('#def-team-choice-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);
		if (team) {
			var frameid = $('#tie-frame-add-id').val();
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				var frameName = $('#tie-frame-add-name').val();
				frame.name = uniqueName($('<div/>').text(frameName).html(), buildNameArray(team.cFrames));
			} else {
				mfzch.determineTieChoices(mfzch.game);
			}
		} else {
			mfzch.game.status = 0;
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
		}
	});

	$(document).on('click', '#tie-frame-add-submit', function(){
		var teamid = $('#def-team-choice-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);
		if (team) {
			if (mfzch.game.trackingLevel < 20) {
				team.gFrames++;
				team.sSystems += parseInt($('#tie-frame-add-amount-short').val());
			} else {
				team.gFrames = team.cFrames.length;
				team.sSystems = team.totalSystems();
			}

			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$('#tie-frame-add').popup('close');
			mfzch.determineTieChoices(mfzch.game);
		} else {
			mfzch.game.status = 0;
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
		}
	});

	$('#tie-frame-remove').on({
		popupbeforeposition: function() {
			var teamid = $('#def-team-choice-id').val();
			var team = mfzch.game.findTeamByUUID(teamid);
			if (team) {
				if (mfzch.game.trackingLevel < 20) {
					var maxSys = Math.min(4, team.sSystems);
					var minSys = Math.max(0, team.sSystems - ((team.gFrames - 1) * 4));

					if (minSys == maxSys) {
						team.gFrames--;
						team.sSystems -= maxSys;
						mfzch.game.clientmodified = true;
						mfzch.saveData('game');
						$('#tie-frame-remove').popup('close');
						mfzch.determineTieChoices(mfzch.game);
					} else {
						$('#tie-frame-remove-amount-short').attr('min', minSys).slider('refresh');
						$('#tie-frame-remove-amount-short').attr('max', maxSys);
					}
				} else {
					mfzch.updateTieFrameList(mfzch.game, team, $('#tie-frame-remove-list-long'));
				}
			} else {
				mfzch.game.status = 0;
				mfzch.game.clientmodified = true;
				mfzch.saveData('game');
				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
			}
		}
	});

	$(document).on('click', '#tie-frame-remove-submit', function(){
		var teamid = $('#def-team-choice-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);
		if (team) {
			team.gFrames--;
			team.sSystems -= parseInt($('#tie-frame-remove-amount-short').val());

			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$('#tie-frame-remove').popup('close');
			mfzch.determineTieChoices(mfzch.game);
		} else {
			mfzch.game.status = 0;
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
		}
	});

	$(document).on('click', '#tie-frame-remove-list-long>li', function(){
		var teamid = $('#def-team-choice-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);
		if (team) {
			var frameid = $(this).attr('data-frameid');
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				var missingSSR = frame.ssr;

				var index = team.cFrames.indexOf(frame);

				if (index !== -1) {
					team.cFrames.splice(index, 1);
					team.gFrames = team.cFrames.length;
					team.sSystems = team.totalSystems();

					if (missingSSR) {
						// add SSRs!
						$('#tie-frame-remove').on({
							popupafterclose: function() {
								setTimeout( function(){
									$('#tie-ssr-resolve').popup('open');
									$('#tie-frame-remove').off('popupafterclose');
								}, 100 );
							}
						});
						$('#tie-frame-remove').popup('close');
					} else {
						mfzch.game.clientmodified = true;
						mfzch.saveData('game');
						$('#tie-frame-remove').popup('close');
						mfzch.determineTieChoices(mfzch.game);
					}
				}
			} else {
				$('#tie-frame-remove').popup('close');
				mfzch.determineTieChoices(mfzch.game);
			}
		} else {
			mfzch.game.status = 0;
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
		}
	});

	$('#tie-ssr-resolve').on({
		popupbeforeposition: function() {
			var teamid = $('#def-team-choice-id').val();
			var team = mfzch.game.findTeamByUUID(teamid);
			if (team) {
				var lostSSR = 3 - team.totalSSRs();
				if (lostSSR == 1) {
					lostSSR += ' SSR which needs';
				} else {
					lostSSR += ' SSRs which need';
				}

				$('#tie-add-ssr-count').html(lostSSR);
				mfzch.updateTieFrameList(mfzch.game, team, $('#tie-ssr-add'));
			} else {
				mfzch.game.status = 0;
				mfzch.game.clientmodified = true;
				mfzch.saveData('game');
				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
			}
		}
	});

	$(document).on('click', '#tie-ssr-add>li', function(){
		var teamid = $('#def-team-choice-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);
		if (team) {
			var frameid = $(this).attr('data-frameid');
			var frame = team.findFrameByUUID(frameid);

			if (frame) {
				frame.addSystem('ssr');

				if (team.totalSSRs() < 3) {
					$('#tie-ssr-resolve').on({
						popupafterclose: function() {
							setTimeout( function(){
								$('#tie-ssr-resolve').popup('open');
								$('#tie-ssr-resolve').off('popupafterclose');
							}, 100 );
						}
					});
				} else {
					mfzch.game.clientmodified = true;
					mfzch.saveData('game');
					mfzch.determineTieChoices(mfzch.game);
				}
			} else {
				mfzch.determineTieChoices(mfzch.game);
			}
			$('#tie-ssr-resolve').popup('close');
		} else {
			mfzch.game.status = 0;
			mfzch.game.clientmodified = true;
			mfzch.saveData('game');
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
		}
	});

	$(document).on('click', '#tie-defer', function(){
		mfzch.determineTieChoices(mfzch.game);
	});

	$(document).on('click', '#tie-change-parameters', function(event){
		if (mfzch.game.blindSetup) {
			mfzch.game.teams = [];
		}

		mfzch.game.status = 0;
		mfzch.game.clientmodified = true;
		mfzch.saveData('game');
		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'setup-tie') {
		mfzch.outputSetupParameters(mfzch.game);

		var numTied = mfzch.game.tiedForDefense();

		$('#def-team-choice-id').val(mfzch.game.teams[0].uuid);

		mfzch.updateTieChoices(mfzch.game, mfzch.game.teams[0], numTied);

		if (mfzch.game.trackingLevel < 20) {
			$('#setup-tie .short').show();
			$('#setup-tie .long').hide();
		} else {
			$('#setup-tie .short').hide();
			$('#setup-tie .long').show();
		}

		/*
		try {
			ga('send', 'event', 'Game', 'Setup', 'Defensive Tie', 0, false);
		} catch (err) {}
		*/
	}
});

/* ------ status 3: deployment ------ */

$(document).on('pagecreate', '#game-deployment', function(event){
	$(document).on('click', '#game-deployment-back', function(){
		if (mfzch.game.blindSetup) {
			mfzch.game.teams = [];
		}

		mfzch.game.status = 0;
		mfzch.game.clientmodified = true;
		mfzch.saveData('game');

		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-setup", { changeHash: false } );
	});

	$(document).on('click', '.play-combat-phase', function(){
		mfzch.game.start();
		mfzch.game.status = 4;
		mfzch.game.clientmodified = true;
		mfzch.saveData('game', true);

		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#active-game", { changeHash: false } );
	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'game-deployment') {
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

		if(mfzch.appState.remote.mode) {
			clearInterval(mfzch.remoteSync['game-deployment']);
			mfzch.remoteSync['game-deployment'] = setInterval(function(){
				mfzch.checkRemoteStatus('game-deployment');
			}, mfzch.appState.remote.refresh);
		}
	}
});

$(document).on( "pagecontainerhide", function( event, ui ) {
	if (ui.prevPage[0].id == 'game-deployment') {
		clearInterval(mfzch.remoteSync['game-deployment']);
	}
});

/* ------ remote game: password entry ------ */

$(document).on('pagecreate', '#remote-password', function(event){
	$(document).on('change', '#game-enterpassword', function(){
		mfzch.appState.remote.password = $('#game-enterpassword').val();
	});

	$(document).on('click', '#game-password-go', function(){
		$('#password-fail').hide();
		mfzch.loadRemoteGame(function(result){
			if (result.loaded) {
				$( ":mobile-pagecontainer" ).pagecontainer( "change", mfzch.chooseGamePage(), { changeHash: false } );
			} else {
				$('#password-fail').slideDown();
			}
		});
	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'remote-password') {
		$('#password-fail').hide();
	}
});

$(document).on('pagecontainerbeforechange', function(event, ui){
	if (ui.toPage[0].id == 'remote-password') {
		if (mfzch.appState.remote.granted == 'view-nopass') {
			$('#game-password-description').html('Enter a password to enable sending updates, or leave blank to view.');
		} else {
			$('#game-password-description').html('This game requires a password.');
		}
	}
});

/* ------ remote game: status hold ------ */

$(document).on('pagecontainerbeforechange', function(event, ui){
	if (ui.toPage[0].id == 'remote-hold') {
		// if (***previous page != '#game-tracking') {
			mfzch.checkRemoteStatus();
		// }

		clearInterval(mfzch.remoteSync['remote-hold']);
		mfzch.remoteSync['remote-hold'] = setInterval(function(){
			mfzch.checkRemoteStatus('remote-hold');
		}, mfzch.appState.remote.refresh);
	}
});

$(document).on( "pagecontainerhide", function( event, ui ) {
	if (ui.prevPage[0].id == 'remote-hold') {
		clearInterval(mfzch.remoteSync['remote-hold']);
	}
});

/* ------ remote game: connection lost ------ */

$(document).on('pagecontainerbeforechange', function(event, ui){
	if (ui.toPage[0].id == 'remote-noconnection') {
		// if (ui.prevPage[0].id != '#game-tracking') { //*** page hash
			mfzch.checkRemoteConnection();
		// }

		clearInterval(mfzch.remoteSync['remote-noconnection']);
		mfzch.remoteSync['remote-noconnection'] = setInterval(mfzch.checkRemoteConnection, mfzch.appState.remote.refresh);
	}
});

$(document).on( "pagecontainerhide", function( event, ui ) {
	if (ui.prevPage[0].id == 'remote-noconnection') {
		clearInterval(mfzch.remoteSync['remote-noconnection']);
	}
});
