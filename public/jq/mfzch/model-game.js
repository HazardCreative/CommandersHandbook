function gameModel() {
	this.uuid = generateUUID();
	this.dbid = false;
	this.description = '';
	this.owner = '';
	this.doomsday = 0;
	this.round = 0;
	this.gameType = 'Battle';
	this.log = '';
	this.maxFrames = 7;
	this.minFrames = 4;
	this.stationsPerPlayer = 2;
	this.unclaimedStations = 0;
	this.teams = [];
	this.trackingLevel = 10;
	this.startTime = Date.now();
	this.roundTime = Date.now();
	this.intendedPlayers = 3;
	this.blindSetup = false;
	this.shared = false;
	this.passwordSet = false;
	this.viewPassword = '';
	this.modifyPassword = '';
	this.servermodified = false;
	this.clientmodified = true;
	this.status = 0;
	/*
	0 = choose parameters
	1 = enter teams
	2 = resolve ties
	3 = deployment
	4 = in progress
	5 = has ended
	*/
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
	sortByScore: function() {
		this.teams.sort(function(a,b) {
			return b.gScore - a.gScore;
		});
	},
	updateParameters: function() {
		if (this.gameType == 'Battle') {
			this.minFrames = MINBTFRAMES[this.intendedPlayers];
			this.maxFrames = MAXBTFRAMES[this.intendedPlayers];
			this.stationsPerPlayer = NUMSTATIONS[this.intendedPlayers];
			this.unclaimedStations = 0;
			this.doomsday = 11;
		} else if (this.gameType == 'Skirmish') {
			this.minFrames = MINSKFRAMES[this.intendedPlayers];
			this.maxFrames = MAXSKFRAMES[this.intendedPlayers];
			this.stationsPerPlayer = NUMSTATIONS[this.intendedPlayers];
			this.unclaimedStations = 0;
			this.doomsday = 11;
		} else if (this.gameType == 'Demo') {
			this.minFrames = 2;
			this.maxFrames = 2;
			this.stationsPerPlayer = 0;
			this.unclaimedStations = 1;
			this.doomsday = 5;
		}
	},
	checkSetup: function(team) {
		var result = new Object();

		result.passing = true;
		result.reason = [];

		if(typeof(team)==='undefined') {
			if (this.teams.length != this.intendedPlayers) {
				result.passing = false;
				if (this.teams.length < this.intendedPlayers) {
					result.reason.push('Additional companies are needed.');
				} else if (this.teams.length > this.intendedPlayers) {
					result.reason.push('There are too many companies included.');
				}
			}
			for (var i in this.teams) {
				if(!this.checkSetup(this.teams[i]).passing) {
					result.passing = false;
				}
			}
		} else {
			if (this.trackingLevel >= 20) {
				if (team.cFrames.length < this.minFrames) {
					result.passing = false;
					result.reason.push('Not enough frames');
				} else if (team.cFrames.length > this.maxFrames) {
					result.passing = false;
					result.reason.push('Too many frames');
				}
				if (team.totalSSRs() < 3) {
					result.passing = false;
					result.reason.push('Not enough SSRs');
				}
				if (team.totalSSRs() > 3) {
					result.passing = false;
					result.reason.push('Too many SSRs');
				}
			} else {
				if (team.gFrames < this.minFrames) {
					result.passing = false;
					result.reason.push('Not enough frames');
				} else if (team.gFrames > this.maxFrames) {
					result.passing = false;
					result.reason.push('Too many frames');
				}
			}
		}


		return result;
	},
	updateScores: function() {
		for (var i in this.teams) {
			this.teams[i].gScore = (this.teams[i].gFrames + this.teams[i].gStations) * this.teams[i].gPPA;
		}
	},
	tiedForDefense: function() {
		// requires sorting teams first
		if (this.teams[1].gScore == this.teams[0].gScore) {
			var tiedForDef = 0;
			for (var i in this.teams) {
				if (this.teams[i].gScore == this.teams[0].gScore) {
					tiedForDef++;
				}
			}

			return tiedForDef;
		} else {
			return false;
		}
	},
	tiedForDefenseActions: function(team, tiedAmount) {
		var actions = [];
		var index = this.teams.indexOf(team);

		// add frame
		if (this.trackingLevel < 20) {
			if (team.gFrames < this.maxFrames) {
				actions.push('add-frame');
			}
		} else {
			if (team.cFrames.length < this.maxFrames) {
				actions.push('add-frame');
			}
		}
		// drop frame
		if (this.trackingLevel < 20) {
			if (team.gFrames > this.minFrames) {
				actions.push('remove-frame');
			}
		} else {
			if (team.cFrames.length > this.minFrames) {
				actions.push('remove-frame');
			}
		}
		// defer
		if (index+1 < tiedAmount) {
			actions.push('defer');
		}

		return actions;
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

		// reset game parameters
		this.round = 1;
		this.log = '';
		this.startTime = Date.now();

		mfzch.undo.states = [];
		mfzch.undo.currentState = 0;
		mfzch.undo.validStates = 0;

		shuffle(this.teams);
		this.sortByScore();

		mfzch.settings.gameEndedOnce = false;
		mfzch.saveData('settings');
	},
	start: function() {
		mfzch.templateGame = JSON.stringify(mfzch.game);
		mfzch.saveData('templateGame');

		this.startTime = Date.now();
		this.roundTime = Date.now();
		this.logEvent('Start Game');
		this.logParameters();
		this.logScores();

		try {
			ga('send', 'event', 'Game', 'Action', 'Start', 0, false);
		} catch (err) {}
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
	checkOtherFrames: function(team) {
		for (var i in this.teams) {
			if (this.teams[i].uuid != team.uuid && this.teams[i].gFrames) {
				return true;
			}
		}
		return false;
	},
	checkCapturableStations: function(team) {
		if (!team.gFrames) {
			return false;
		}
		for (var i in this.teams) {
			if (this.teams[i].uuid != team.uuid && this.teams[i].gStations) {
				return true;
			}
		}
		if(this.unclaimedStations) {
			return true;
		}
		return false;
	},
	checkDroppableStations: function(team) {
		if (!team.gStations) {
			return false;
		}
		for (var i in this.teams) {
			if (this.teams[i] != team.uuid && this.teams[i].gFrames) {
				return true;
			}
		}
		return false;
	},
	getActions: function(team) {
		var actions = [];

		// frame loss
		if (this.trackingLevel < 20) {
			if (team.gFrames && this.checkOtherFrames(team)) {
				actions.push('frame');
			}
		}
		// station gain
		if (this.checkCapturableStations(team)) {
			actions.push('station-capture');
		}
		// station loss
		if (this.checkDroppableStations(team)) {
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

				ga('send', 'event', 'Game End', 'Duration', getDurationText(this.startTime), getDuration(this.startTime).rawSeconds);

			} catch (err) {}
			mfzch.settings.gameEndedOnce = true;
			mfzch.saveData('settings');
		}
		this.status = 5;
		this.logEvent('Game over');
		this.logScores();
		this.logEvent('Game Duration: ' + getDurationText(this.startTime));
		mfzch.updateGameInfo(this);

		var finalScore = '';
		for (var i in this.teams) {
			finalScore += '<li>' + getIcon('company', this.teams[i].color, 'game-icon') + this.teams[i].gScore + ' - ' + this.teams[i].name + '</li>';
		}
		$('#final-score').html(finalScore);
		$('#final-score').listview('refresh');

		$('#game-end').popup('open');
		$('#end-round').hide();
		mfzch.saveData('game', true);
	},
	logEvent: function(eventText, returnString) {
		if (typeof(returnString) === undefined) {
			returnString = false;
		}

		var logtext = timeStamp() + ' - ' + eventText + '\n';

		if (returnString) {
			return logtext;
		} else {
			this.log += logtext;
		}
	},
	logSeparator: function(style, returnString) {
		if (typeof(returnString) === undefined) {
			returnString = false;
		}

		var logtext = '';
		if (style == 1) {
			logtext += '-------------\n';
		} else {
			logtext += '=============\n';
		}

		if (returnString) {
			return logtext;
		} else {
			this.log += logtext;
		}
	},
	logParameters: function(style, returnString) {
		if (typeof(returnString) === undefined) {
			returnString = false;
		}

		var logtext = '';
		logtext += 'Game Type: '+ this.gameType + '\n';
		logtext += 'Doomsday is '+ this.doomsday + '\n';
		if (this.trackingLevel > 10) {
			logtext += this.logSeparator(1, true);
			logtext += '**Loadouts**\n';
			for (var i in this.teams) {
				var team = this.teams[i];
				logtext += '--\n*' + team.name + '*\n';
				for (var j in team.cFrames) {
					var frame = team.cFrames[j];
					logtext += frame.name + ':' + frame.getSystemText() + '\n';
				}
			}
		}
		logtext += this.logSeparator(0, true);
		logtext += this.logEvent('Round 1 begins', true);

		if (returnString) {
			return logtext;
		} else {
			this.log += logtext;
		}
	},
	logScores: function(style, returnString) {
		if (typeof(returnString) === undefined) {
			returnString = false;
		}

		var logtext = '';
		if (style == 'short') {
			for (var i in this.teams) {
				if( parseInt(i) ) {
					logtext += ' / ';
				} else {
					logtext += ' - ';
				}
				logtext += this.teams[i].name + ': ' + this.teams[i].gScore;
			}
			logtext += '\n';
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
			logtext += this.logSeparator(1, true);
			logtext += '**Scores**\n';
			for (var i in this.teams) {
				logtext += this.teams[i].name + ': ' + this.teams[i].gScore + ' (' + this.teams[i].gFrames +'f+'+ this.teams[i].gStations + 's &#215; ' + this.teams[i].gPPA + ')'+ '\n';
			}
			logtext += this.logSeparator(1, true);
		}

		if (returnString) {
			return logtext;
		} else {
			this.log += logtext;
		}
	},
	restoreFromTemplate: function() {
		if(mfzch.templateGame) {
			mfzch.game = mfzch.JSONtoGameModel(mfzch.templateGame);
		} else {
			mfzch.game = new gameModel();
		}
	},
	findTeamByUUID: function(findUUID) {
		for (var i in this.teams) {
			if (this.teams[i].uuid == findUUID) {
				return this.teams[i];
			}
		}
		return false;
	},
};