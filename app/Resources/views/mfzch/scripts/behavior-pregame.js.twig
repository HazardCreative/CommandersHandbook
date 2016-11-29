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
