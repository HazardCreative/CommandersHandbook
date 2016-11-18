function gameModel() {
	this.doomsday = 0;
	this.round = 0;
	this.gameType = 'Battle';
	this.log = '';
	this.inProgress = false;
	this.gameEnded = false;
	this.maxFrames = 0;
	this.minFrames = 0;
	this.stationsPerPlayer = 0;
	this.unclaimedStations = 0;
	this.teams = [];
	this.trackingLevel = 10;
	this.startTime = new Date();
};

gameModel.prototype = {
	roundsRemaining: function() {
		if (!this.doomsday) {
			return this.round;
		}
		var maxRounds = this.round + this.doomsday - 1;
		var minRounds = this.round + Math.ceil((this.doomsday) / (this.teams.length+1))-1;
		if (maxRounds <= this.round) {
			return maxRounds;
		} else if (minRounds == maxRounds) {
			return maxRounds;
		} else {
			return minRounds + '&#8211;' + maxRounds;
		}
	},
	gameDurationText: function() {
		var duration = getDuration(this.startTime);

		if (duration.days) {
			return duration.days + "d " + duration.hours + ":" + duration.minutes + ":" + duration.seconds;
		} else {
			return duration.hours + ":" + duration.minutes + ":" + duration.seconds;
		}
	},
	sortByScore: function() {
		this.teams.sort(function(a,b) {
			return b.gScore - a.gScore;
		});
	},
	updateParameters: function() {
		this.stationsPerPlayer = NUMSTATIONS[this.teams.length];

		if (this.gameType == 'Battle') { // Skirmish
			this.maxFrames = MAXBTFRAMES[this.teams.length];
			this.minFrames = MINBTFRAMES[this.teams.length];
		} else if (this.gameType == 'Skirmish') { // Skirmish
			this.maxFrames = MAXSKFRAMES[this.teams.length];
			this.minFrames = MINSKFRAMES[this.teams.length];
		} else { // demo/free
			this.maxFrames = MAXFRAMES;
			this.minFrames = 1;
		}
	},
	updateScores: function() {
		for (var i in this.teams) {
			this.teams[i].gScore = (this.teams[i].gFrames + this.teams[i].gStations) * this.teams[i].gPPA;
		}
	},
	frameCountIsGood: function() {
		for (var i in this.teams) {
			if (this.teams[i].gFrames > this.maxFrames
			|| this.teams[i].gFrames < this.minFrames) {
				return false;
			}
		}
		return true;
	},
	tiedForDefense: function() {
		shuffle(this.teams); // randomize team order first...
		this.sortByScore(); // then sorting by score...
		mfzch.updateTeamList(this); // effectively randomly decides initaitive ties

		if (this.teams[1].gScore == this.teams[0].gScore) {
			var tiedForDef = 0;
			for (var i in this.teams) {
				if (this.teams[i].gScore == this.teams[0].gScore) {
					tiedForDef++;
				}
			}

			$('#def-tie-list').empty();

			for (var i = 0; i < tiedForDef; i++) {
				$('#def-tie-list').append('<li>' + mfzch.getIcon('company', this.teams[i].color, 'game-icon') + this.teams[i].name + '</li>')
			}

			$('.team-dupe-winner').html(mfzch.getIcon('company', this.teams[0].color, 'game-icon') + this.teams[0].name);

			return true;
		} else {
			return false;
		}
	},
	setPPA: function() {
		var teamsCopy = this.teams.slice(0);

		for (var i in teamsCopy) {
			teamsCopy[i].gPPA = 5; // reset all PPA
			teamsCopy[i].order = parseInt(i); // save original team order
		}


		// Sort teams by number of frames. Adjust accordingly
		teamsCopy.sort(function(a,b) {
			return b.gFrames - a.gFrames;
		});
		for (var i in teamsCopy) {
			if (teamsCopy[i].gFrames == teamsCopy[0].gFrames) {
				teamsCopy[i].gPPA--;
			}
			if (teamsCopy[i].gFrames == teamsCopy[teamsCopy.length - 1].gFrames) {
				teamsCopy[i].gPPA++;
			}
		}

		// Sort teams by number of systems. Adjust accordingly
		teamsCopy.sort(function(a,b) {
			return b.sSystems - a.sSystems;
		});
		for (var i in teamsCopy) {
			if (teamsCopy[i].sSystems == teamsCopy[0].sSystems) {
				teamsCopy[i].gPPA--;
			}
			if (teamsCopy[i].sSystems == teamsCopy[teamsCopy.length - 1].sSystems) {
				teamsCopy[i].gPPA++;
			}
		}

		// reorder to original list
		teamsCopy.sort(function(a,b) {
			return a.order - b.order;
		});

		// save PPA back to teams
		for (var i in teamsCopy) {
			this.teams[i].gPPA = teamsCopy[i].gPPA;
		}
	},
	reset: function() { // clean game before starting
		for (var i in this.teams) {
			// reset number of stations
			this.teams[i].gStations = this.stationsPerPlayer;
		}

		this.setPPA();
		this.updateScores();
		mfzch.updateTeamList(mfzch.game);

		// reset game parameters
		this.unclaimedStations = 0;
		this.inProgress = false;
		this.gameEnded = false;
		this.doomsday = 11;
		this.round = 1;
		this.log = '';
		this.startTime = new Date();

		mfzch.undo.states = [];
		mfzch.undo.currentState = 0;
		mfzch.undo.validStates = 0;

		mfzch.saveData(this, 'mfz.game');

		mfzch.settings.gameEndedOnce = false;
		mfzch.saveData(mfzch.settings, 'mfz.settings');
	},
	checkUnclaimedIsPossible: function () {
		if (this.teams.length < 3) {
			return false;
		}
		if (!this.teams[2].gScore) {
			return false;
		}
		var teamsWithFrames = 0;
		for (var i in this.teams) {
			if (this.teams[i].gFrames) {
				teamsWithFrames++;
			}
		}
		if (teamsWithFrames < 3) {
			return false;
		}
		return true;
	},
	checkOtherFrames: function(teamid) {
		for (var i in this.teams) {
			if (i != teamid && this.teams[i].gFrames) {
				return true;
			}
		}
		return false;
	},
	checkCapturableStations: function(teamid) {
		if (!this.teams[teamid].gFrames) {
			return false;
		}
		for (var i in this.teams) {
			if (i != teamid && this.teams[i].gStations) {
				return true;
			}
		}
		if(this.unclaimedStations) {
			return true;
		}
		return false;
	},
	checkDroppableStations: function(teamid) {
		if (!this.teams[teamid].gStations) {
			return false;
		}
		for (var i in this.teams) {
			if (i != teamid && this.teams[i].gFrames) {
				return true;
			}
		}
		return false;
	},
	getActions: function(teamid) {
		var actions = [];

		// frame loss
		if (this.trackingLevel < 20) {
			if (this.teams[teamid].gFrames && this.checkOtherFrames(teamid)) {
				actions.push('frame');
			}
		}
		// station gain
		if (this.checkCapturableStations(teamid)) {
			actions.push('station-capture');
		}
		// station loss
		if (this.checkDroppableStations(teamid)) {
			actions.push('station-drop');
		}

		return actions;
	},
	checkEarlyDoomsday: function() {
		if (!this.teams[1].gScore) {
			this.endGame();
		}
	},
	endGame: function() {
		if (!mfzch.settings.gameEndedOnce) { // only log to settings and track data once
			mfzch.settings.gamesPlayed++;
			try {
				ga('send', 'event', 'Game', 'Action', 'End', 1, false);
				ga('send', 'event', 'Game End', 'Rounds', this.round, this.round);
				ga('send', 'event', 'Game End', 'Final Score', this.logScores('analytics'), 0);
				ga('send', 'event', 'Game End', 'Winner Score', this.teams[0].gScore, this.teams[0].gScore);
				ga('send', 'event', 'Game End', 'Winner PPA', this.teams[0].gPPA, this.teams[0].gPPA);
				ga('send', 'event', 'Game End', 'Players', this.teams.length, this.teams.length);
				ga('send', 'event', 'Game End', 'Type', this.gameType, 0);
				ga('send', 'event', 'Game End', 'Track Level', this.trackingLevel, 0);

				ga('send', 'event', 'Game End', 'Duration', this.gameDurationText(), getDuration(this.startTime).rawSeconds);

			} catch (err) {}
			mfzch.settings.gameEndedOnce = true;
			mfzch.saveData(mfzch.settings, 'mfz.settings');
		}
		this.gameEnded = true;
		this.logEvent('Game over');
		this.logScores();
		mfzch.updateGameInfo(this);

		var finalScore = '';
		for (var i in this.teams) {
			finalScore += '<li>' + mfzch.getIcon('company', this.teams[i].color, 'game-icon') + this.teams[i].gScore + ' - ' + this.teams[i].name + '</li>';
		}
		$('#final-score').html(finalScore);
		$('#final-score').listview('refresh');

		$('#game-end').popup('open');
		$('#end-round').hide();
		mfzch.saveData(this, 'mfz.game');
	},
	logEvent: function(eventText) {
		this.log += timeStamp() + ' - ' + eventText + '\n';
	},
	logSeparator: function(style) {
		if (style == 1) {
			this.log += '-------------\n';
		} else {
			this.log += '=============\n';
		}
	},
	logParameters: function(style) {
		this.log += 'Game Type: '+ this.gameType + '\n';
		this.log += 'Doomsday is '+ this.doomsday + '\n';
		this.logSeparator();
		this.logEvent('Round 1 begins');
	},
	logScores: function(style) {
		if (style == 'short') {
			for (var i in this.teams) {
				if( parseInt(i) ) {
					this.log += ' / ';
				} else {
					this.log += ' - ';
				}
				this.log += this.teams[i].name + ': ' + this.teams[i].gScore;
			}
			this.log += '\n';
		} else if (style == 'analytics') {
			var scoreStr = '';
			for (var i in this.teams) {
				if( parseInt(i) ) {
					scoreStr += ' / ';
				}
				scoreStr += this.teams[i].gScore + ' (' + this.teams[i].gFrames +'f+'+ this.teams[i].gStations + 's x' + this.teams[i].gPPA + ')';
			}
			return scoreStr;
		} else {
			this.logSeparator(1);
			this.log += '**Scores**\n';
			for (var i in this.teams) {
				this.log += this.teams[i].name + ': ' + this.teams[i].gScore + ' (' + this.teams[i].gFrames +'f+'+ this.teams[i].gStations + 's &#215; ' + this.teams[i].gPPA + ')'+ '\n';
			}
			this.logSeparator(1);
		}
	},
	restoreFromTemplate: function() {
		if(mfzch.templateGame) {
			mfzch.game = mfzch.JSONtoGameModel(mfzch.templateGame);
		} else {
			mfzch.game = new gameModel();
		}
	}
};