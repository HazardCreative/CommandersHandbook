if (typeof jQuery != 'undefined') {

	/* ---------------------- */
	/* models; properties and methods */

	function teamModel() { // simplified company model for gameplay
		this.name = 'Unnamed Team';
		this.color = '#880000';
		this.sSystems = 20;

		this.gFrames = 5;
		this.gStations = 0;
		this.gPPA = 0;
		this.gScore = 0;

		this.cProfile = false; // completed frame profile for tracking 20+
		this.cFrames = [];
		this.cNonstandard = false;
	};

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
	}

	function companyModel() {
		this.name = 'Unnamed Company';
		this.color = '#880000';
		this.frames = [];
		this.nonstandard = false;
	}

	companyModel.prototype = {
		totalSystems: function(){
			var numSystems = 0;
			for (var i in this.frames) {
				numSystems += this.frames[i].totalSystems();
			}
			return numSystems;
		},
		totalSSRs: function(){
			var numSystems = 0;
			for (var i in this.frames) {
				numSystems += this.frames[i].ssr;
			}
			return numSystems;
		},
	/*	getPlayerCounts: function(){
			var validPlayerCounts = [false, false, false, false, false, false];

			for (var i = 2; i < MAXTEAMS; i++) {
				if(this.frames.length >= MINSKFRAMES[i]
					|| this.frames.length >= MINBTFRAMES[i]) {
					validPlayerCounts[i] = true;
				}

				if(this.frames.length > MAXSKFRAMES[i]
					|| this.frames.length > MAXBTFRAMES[i]) {
					validPlayerCounts[i] = false;
				}
			}

			return validPlayerCounts;
		}, */
		calcCompanyStat: function() {
			var frameStats = [];
			for (var i in this.frames) {
				frameStats[i] = this.frames[i].calcFrameStat();
			}
			var companyStat = [];
			for (var i in frameStats) {
				for (var j in frameStats[i]) {
					if (!companyStat[j]) {
						companyStat[j] = [];
						companyStat[j]['label'] = '';
						companyStat[j]['hexcolor'] = '';
						companyStat[j]['d6'] = 0;
						companyStat[j]['d8'] = 0;
						companyStat[j]['multiplier'] = 0;
						companyStat[j]['max'] = 0;
						companyStat[j]['mean'] = 0;
						companyStat[j]['meanw1'] = 0;
						companyStat[j]['meanw2'] = 0;
						companyStat[j]['meanw2'] = 0;
					}
					for (var k in frameStats[i][j]) {
						if(k == 'd6'
							|| k == 'd8'
							|| k == 'max'
							|| k == 'mean'
							|| k == 'meanw1'
							|| k == 'meanw2') {
							companyStat[j][k] += frameStats[i][j][k];
						} else {
							companyStat[j][k] = frameStats[i][j][k];
						}
					}
				}
			}
			return companyStat;
		},
		getCompanyGraph: function(players){
			if(typeof(players)==='undefined') players = this.frames.length;

			var companyStat = this.calcCompanyStat();

			var output = '<table class="companygraph"><thead><tr><th class="stat-type"><span class="type-label">Type</span><a href="#graph-key-c" class="item-help">?</a></th><th class="stat-graph">Graph</th><th class="stat-std">Sys</th><th class="stat-white2">+W</th></tr></thead><tbody>';

			for(var i in companyStat) {
				output += '<tr>';
				output += '<td class="stat-type">' + companyStat[i].label + '</td>';

				output += '<td class="stat-graph graph-container">';

				var useColor = companyStat[i].hexcolor;
				var stdPct = Math.round(companyStat[i].mean / companyStat[i].max * 100);
				var w2Pct = Math.round(companyStat[i].meanw2 / companyStat[i].max * 100);

				output += '<span style="width:'+ w2Pct +'%; background:' + useColor + '" class="graphbar graphbar-2w"></span>';
				output += '<span style="width:'+ stdPct +'%; background:' + useColor + '" class="graphbar graphbar-sys"></span>';
				output += '</td>';

				output += '<td class="stat-std">' + companyStat[i].mean.toPrecision(3) + '</td>';
				output += '<td class="stat-white2">' +companyStat[i].meanw2.toPrecision(3) + '</td>';

				output += '</tr>';
			}

			output += '</tbody></table>';
			return output;
		}
	}

	function frameModel() {
		this.name = "Unnamed Frame"
		this.w = 2;
		this.rh = 0;
		this.rd = 0;
		this.ra = 0;
		this.b = 0;
		this.y = 0;
		this.g = 0;
		this.e = 0;
		this.ssr = 0;
		this.rhd = 0;
		this.rha = 0;
		this.rda = 0;

		this.activeRange = 'd';
		this.rollResult = false;

		this.activated = false;
		this.defense = 0;
		this.spot = 0;
	}

	frameModel.prototype = {
		totalSystems: function() {
			return n = this.rh + this.rd + this.ra + this.b + this.y + this.g + this.rhd + this.rha + this.rda + this.e; // ***
		},

		getSystemDisplay: function(useRange, showWhite, cssClass) {
			if(typeof(useRange) === 'undefined') useRange = false;
			if(typeof(showWhite) === 'undefined') showWhite = true;
			if(typeof(cssClass) === 'undefined') cssClass = '';

			var sysDisplay = '<ul class="sys-display ' + cssClass + '">';
			var isDisabled = '';

			if (showWhite) {
				for (var i = 0; i < this.w; i++) {
					sysDisplay += '<li data-sys="w">W</li>';
				}
			}

			if (useRange)
				isDisabled = (this.activeRange == "h") ? '' : ' class="disabled"';

			if (this.rh) {
				sysDisplay += '<li data-sys="rh"'+ isDisabled +'>Rh</li>';
			}
			if (this.rh == 2) {
				sysDisplay += '<li data-sys="rh"'+ isDisabled +'>Rh</li>';
			}

			if (useRange)
				isDisabled = (this.activeRange == "d") ? '' : ' class="disabled"';

			if (this.rd) {
				sysDisplay += '<li data-sys="rd"'+ isDisabled +'>Rd</li>';
			}
			if (this.rd == 2) {
				sysDisplay += '<li data-sys="rd"'+ isDisabled +'>Rd</li>';
			}

			if (useRange)
				isDisabled = (this.activeRange == "a") ? '' : ' class="disabled"';

			if (this.ra) {
				sysDisplay += '<li data-sys="ra"'+ isDisabled +'>Ra</li>';
			}
			if (this.ra == 2) {
				sysDisplay += '<li data-sys="ra"'+ isDisabled +'>Ra</li>';
			}

			if (useRange)
				var isDisabled = (this.activeRange == "a") ? ' class="disabled"' : '';

			for (var i = 0; i < this.rhd; i++) {
				sysDisplay += '<li data-sys="rhd"'+ isDisabled +'>Rh/d</li>';
			}

			if (useRange)
				isDisabled = (this.activeRange == "d") ? ' class="disabled"' : '';
			for (var i = 0; i < this.rha; i++) {
				sysDisplay += '<li data-sys="rha"'+ isDisabled +'>Rh/a</li>';
			}

			if (useRange)
				var isDisabled = (this.activeRange == "h") ? ' class="disabled"' : '';

			for (var i = 0; i < this.rda; i++) {
				sysDisplay += '<li data-sys="rda"'+ isDisabled +'>Rd/a</li>';
			}

			for (var i = 0; i < this.y; i++) {
				sysDisplay += '<li data-sys="y">Y</li>';
			}
			for (var i = 0; i < this.b; i++) {
				sysDisplay += '<li data-sys="b">B</li>';
			}
			for (var i = 0; i < this.g; i++) {
				sysDisplay += '<li data-sys="g">G</li>';
			}
			for (var i = 0; i < this.e; i++) { /* *** */
				sysDisplay += '<li data-sys="e">E</li>';
			}

			if (useRange)
				isDisabled = (this.activeRange == "d") ? '' : ' class="disabled"';

			for (var i = 0; i < this.ssr; i++) {
				sysDisplay += '<li data-sys="ssr"'+ isDisabled +'>SSR</li>';
			}

			sysDisplay += '</ul>';
			return sysDisplay;
		},
		getDiceDisplay: function(cssClass) {
			if(typeof(cssClass) === 'undefined') cssClass = '';
			var diceDisplay = '<ul class="dice-display ' + cssClass + '">';

			for (var i = 0; i < this.w; i++) {
				diceDisplay += '<li data-die="w6">W6</li>';
			}

			if (this.activeRange == "h") {
				if (this.rh) {
					diceDisplay += '<li data-die="r6">R6</li><li data-die="r6">R6</li>';
				}
				if (this.rh == 2) {
					diceDisplay += '<li data-die="r8">R8</li>';
				}
			}

			if (this.activeRange == "d") {
				if (this.rd) {
					diceDisplay += '<li data-die="r6">R6</li><li data-die="r6">R6</li>';
				}
				if (this.rd == 2) {
					diceDisplay += '<li data-die="r8">R8</li>';
				}
			}

			if (this.activeRange == "a") {
				if (this.ra) {
					diceDisplay += '<li data-die="r6">R6</li><li data-die="r6">R6</li>';
				}
				if (this.ra == 2) {
					diceDisplay += '<li data-die="r8">R8</li>';
				}
			}

			if (this.activeRange == "h" || this.activeRange == "d") {
				for (var i = 0; i < this.rhd; i++) {
					diceDisplay += '<li data-die="r6">R6</li>';
				}
			}
			if (this.activeRange == "h" || this.activeRange == "a") {
				for (var i = 0; i < this.rha; i++) {
					diceDisplay += '<li data-die="r6">R6</li>';
				}
			}
			if (this.activeRange == "d" || this.activeRange == "a") {
				for (var i = 0; i < this.rda; i++) {
					diceDisplay += '<li data-die="r6">R6</li>';
				}
			}

			if (this.activeRange == "d") {
				for (var i = 0; i < this.ssr; i++) {
					diceDisplay += '<li data-die="r8">R8</li>';
				}
			}

			for (var i = 0; i < this.y; i++) {
				diceDisplay += '<li data-die="y6">Y6</li>';
			}
			for (var i = 0; i < this.b; i++) {
				diceDisplay += '<li data-die="b6">B6</li>';
			}
			for (var i = 0; i < this.g; i++) {
				diceDisplay += '<li data-die="g6">G6</li>';
			}
			if (!this.rd && !this.ra && !this.rhd && !this.rha && !this.rda) {
				diceDisplay += '<li data-die="g8">G8</li>';
			}

			diceDisplay += '</ul>';
			return diceDisplay;
		},
		getRollDisplay: function(cssClass) {
			if(typeof(cssClass) === 'undefined') cssClass = '';
			return result = '<ul class="roll-display ' + cssClass + '">' + this.rollResult + '</ul>';
		},
		rollAll: function() {
			var result = '';

			for (var i = 0; i < this.w; i++) {
				result += '<li data-type="w" data-die="w6">W' + rollDie() + '</li>';
			}

			if (this.activeRange == "h") {
				if (this.rh) {
					result += '<li data-type="r" data-die="r6">R' + rollDie() + '</li>';
					result += '<li data-type="r" data-die="r6">R' + rollDie() + '</li>';
				}
				if (this.rh == 2) {
					result += '<li data-type="r" data-die="r8">R' + rollDie(8) + '</li>';
				}
			}

			if (this.activeRange == "d") {
				if (this.rd) {
					result += '<li data-type="r" data-die="r6">R' + rollDie() + '</li>';
					result += '<li data-type="r" data-die="r6">R' + rollDie() + '</li>';
				}
				if (this.rd == 2) {
					result += '<li data-type="r" data-die="r8">R' + rollDie(8) + '</li>';
				}
			}

			if (this.activeRange == "a") {
				if (this.ra) {
					result += '<li data-type="r" data-die="r6">R' + rollDie() + '</li>';
					result += '<li data-type="r" data-die="r6">R' + rollDie() + '</li>';
				}
				if (this.ra == 2) {
					result += '<li data-type="r" data-die="r8">R' + rollDie(8) + '</li>';
				}
			}

			if (this.activeRange == "h" || this.activeRange == "d") {
				for (var i = 0; i < this.rhd; i++) {
					result += '<li data-type="r" data-die="r6">R' + rollDie() + '</li>';
				}
			}
			if (this.activeRange == "h" || this.activeRange == "a") {
				for (var i = 0; i < this.rha; i++) {
					result += '<li data-type="r" data-die="r6">R' + rollDie() + '</li>';
				}
			}
			if (this.activeRange == "d" || this.activeRange == "a") {
				for (var i = 0; i < this.rda; i++) {
					result += '<li data-type="r" data-die="r6">R' + rollDie() + '</li>';
				}
			}

			if (this.activeRange == "d") {
				for (var i = 0; i < this.ssr; i++) {
					result += '<li data-type="r" data-die="r8">R' + rollDie(8) + '</li>';
				}
			}

			for (var i = 0; i < this.y; i++) {
				result += '<li data-type="y" data-die="y6">Y' + rollDie() + '</li>';
			}
			for (var i = 0; i < this.b; i++) {
				result += '<li data-type="b" data-die="b6">B' + rollDie() + '</li>';
			}
			for (var i = 0; i < this.g; i++) {
				result += '<li data-type="g" data-die="g6">G' + rollDie() + '</li>';
			}
			if (!this.rd && !this.ra && !this.rhd && !this.rha && !this.rda) {
				result += '<li data-type="g" data-die="g8">G' + rollDie(8) + '</li>';
			}

			return this.rollResult = result;
		},
		addSystem: function(sysType) {
			var tempRollResult = this.rollResult;
			this.rollResult = false;

			if (sysType == "w" && this[sysType] < 2) {
				this[sysType]++;
				return true;
			} else if (sysType == "ssr" && this[sysType] < 3) {
				this[sysType]++;
				return true;
			} else if (this.totalSystems() < 4 && this[sysType] < 2) {
				if (sysType == 'rhd') { // split system adding
					if (this.rh + this.rhd*0.5 + this.rha*0.5 < 2
						&& this.rd + this.rhd*0.5 + this.rda*0.5 < 2) {
						this[sysType]++;
						return true;
					}
				} else if (sysType == 'rha') {
					if (this.rh + this.rhd*0.5 + this.rha*0.5 < 2
						&& this.ra + this.rha*0.5 + this.rda*0.5 < 2) {
						this[sysType]++;
						return true;
					}
				} else if (sysType == 'rda') {
					if (this.rd + this.rhd*0.5 + this.rda*0.5 < 2
						&& this.ra + this.rha*0.5 + this.rda*0.5 < 2) {
						this[sysType]++;
						return true;
					}
				} else if (sysType == 'rh') {
					if (this.rh + this.rhd*0.5 + this.rha*0.5 <= 1) {
						this[sysType]++;
						return true;
					}
				} else if (sysType == 'rd') {
					if (this.rd + this.rhd*0.5 + this.rda*0.5 <= 1) {
						this[sysType]++;
						return true;
					}
				} else if (sysType == 'ra') {
					if (this.ra + this.rha*0.5 + this.rda*0.5 <= 1) {
						this[sysType]++;
						return true;
					}
				} else {
					this[sysType]++;
					return true;
				}
			}

			this.rollResult = tempRollResult;
			return false;
		},
		removeSystem: function(sysType){
			if (sysType == "w") {
				if (this[sysType] > 1) {
					this[sysType]--;
					this.rollResult = false;
					return true;
				}
			} else if (this[sysType]) {
				this[sysType]--;
				this.rollResult = false;
				return true;
			}
			return false;
		},
		calcFrameStat: function() {
			var frameStat = []

			// h2h
			frameStat.rh = [];
			frameStat.rh.label = '<span data-sys="rh">Rh</span>';
			frameStat.rh.hexcolor = '#E03B2C';
			frameStat.rh.d6 = 0;
			frameStat.rh.d8 = 0;
			frameStat.rh.multiplier = 0.5;
			frameStat.rh.max = 2.98;

			if (this.rh == 1) {
				frameStat.rh.d6 += 2;
			}
			if (this.rh == 2) {
				frameStat.rh.d6 += 2;
				frameStat.rh.d8++;
			}
			for(var i = 0; i < this.rhd; i++) {
				frameStat.rh.d6++;
			}
			for(var i = 0; i < this.rha; i++) {
				frameStat.rh.d6++;
			}
			frameStat.rh.mean = MEAND6D8[frameStat.rh.d6][frameStat.rh.d8] * frameStat.rh.multiplier;
			frameStat.rh.meanw1 = MEAND6D8[frameStat.rh.d6+1][frameStat.rh.d8] * frameStat.rh.multiplier;
			if (this.w > 1) {
				frameStat.rh.meanw2 = MEAND6D8[frameStat.rh.d6+2][frameStat.rh.d8] * frameStat.rh.multiplier;
			} else {
				frameStat.rh.meanw2 = 0;
			}

			// df
			frameStat.rd = [];
			frameStat.rd.label = '<span data-sys="rd">Rd</span>';
			frameStat.rd.hexcolor = '#E03B2C';
			frameStat.rd.d6 = 0;
			frameStat.rd.d8 = 0;
			frameStat.rd.multiplier = 0.3333;
			frameStat.rd.max = 2.98;
			if (mfzch.settings.altAttackGraphType) {
				frameStat.rd.max = 2.336;
			}

			if (this.rd == 1) {
				frameStat.rd.d6 += 2;
			}
			if (this.rd == 2) {
				frameStat.rd.d6 += 2;
				frameStat.rd.d8++;
			}
			for(var i = 0; i < this.rhd; i++) {
				frameStat.rd.d6++;
			}
			for(var i = 0; i < this.rda; i++) {
				frameStat.rd.d6++;
			}
			for(var i = 0; i < this.ssr; i++) {
				frameStat.rd.d8++;
			}
			if (frameStat.rd.d6 == 0 && frameStat.rd.d8 == 0) {
				frameStat.rd.disabled = true;
			}
			frameStat.rd.mean = MEAND6D8[frameStat.rd.d6][frameStat.rd.d8] * frameStat.rd.multiplier;
			if (!frameStat.rd.disabled) {
				frameStat.rd.meanw1 = MEAND6D8[frameStat.rd.d6+1][frameStat.rd.d8] * frameStat.rd.multiplier;
				if (this.w > 1) {
					frameStat.rd.meanw2 = MEAND6D8[frameStat.rd.d6+2][frameStat.rd.d8] * frameStat.rd.multiplier;
				} else {
					frameStat.rd.meanw2 = 0;
				}
			} else {
				frameStat.rd.meanw1 = 0;
				frameStat.rd.meanw2 = 0;
			}

			// arty
			frameStat.ra = [];
			frameStat.ra.label = '<span data-sys="ra">Ra</span>';
			frameStat.ra.hexcolor = '#E03B2C';
			frameStat.ra.d6 = 0;
			frameStat.ra.d8 = 0;
			frameStat.ra.multiplier = 0.3333;
			frameStat.ra.max = 2.98;
			if (mfzch.settings.altAttackGraphType) {
				frameStat.ra.max = 1.983;
			}
			if (this.ra == 1) {
				frameStat.ra.d6 += 2;
			}
			if (this.ra == 2) {
				frameStat.ra.d6 += 2;
				frameStat.ra.d8++;
			}
			for(var i = 0; i < this.rha; i++) {
				frameStat.ra.d6++;
			}
			for(var i = 0; i < this.rda; i++) {
				frameStat.ra.d6++;
			}
			if (frameStat.ra.d6 == 0 && frameStat.ra.d8 == 0) {
				frameStat.ra.disabled = true;
			}
			frameStat.ra.mean = MEAND6D8[frameStat.ra.d6][frameStat.ra.d8] * frameStat.ra.multiplier;

			if (!frameStat.ra.disabled) {
				frameStat.ra.meanw1 = MEAND6D8[frameStat.ra.d6+1][frameStat.ra.d8] * frameStat.ra.multiplier;
				if (this.w > 1) {
					frameStat.ra.meanw2 = MEAND6D8[frameStat.ra.d6+2][frameStat.ra.d8] * frameStat.ra.multiplier;
				} else {
					frameStat.ra.meanw2 = 0;
				}
			} else {
				frameStat.ra.meanw1 = 0;
				frameStat.ra.meanw2 = 0;
			}

			// spot
			frameStat.y = [];
			frameStat.y.label = '<span data-sys="y">Y</span>';
			frameStat.y.hexcolor = '#D3C250';
			frameStat.y.d6 = 0;
			frameStat.y.d8 = 0;
			frameStat.y.multiplier = 1;
			frameStat.y.max = 5.24;

			for(var i = 0; i < this.y; i++) {
				frameStat.y.d6++;
			}
			frameStat.y.mean = MEAND6D8[frameStat.y.d6][frameStat.y.d8] * frameStat.y.multiplier;
			frameStat.y.meanw1 = MEAND6D8[frameStat.y.d6+1][frameStat.y.d8] * frameStat.y.multiplier;
			if (this.w > 1) {
				frameStat.y.meanw2 = MEAND6D8[frameStat.y.d6+2][frameStat.y.d8] * frameStat.y.multiplier;
			} else {
				frameStat.y.meanw2 = 0;
			}

			// def
			frameStat.b = [];
			frameStat.b.label = '<span data-sys="b">B</span>';
			frameStat.b.hexcolor = '#0D4572';
			frameStat.b.d6 = 0;
			frameStat.b.d8 = 0;
			frameStat.b.multiplier = 1;
			frameStat.b.max = 5.24;

			for(var i = 0; i < this.b; i++) {
				frameStat.b.d6++;
			}

			frameStat.b.mean = MEAND6D8[frameStat.b.d6][frameStat.b.d8] * frameStat.b.multiplier;
			frameStat.b.meanw1 = MEAND6D8[frameStat.b.d6+1][frameStat.b.d8] * frameStat.b.multiplier;
			if (this.w > 1) {
				frameStat.b.meanw2 = MEAND6D8[frameStat.b.d6+2][frameStat.b.d8] * frameStat.b.multiplier;
			} else {
				frameStat.b.meanw2 = 0;
			}

			// move
			frameStat.g = [];
			frameStat.g.label = '<span data-sys="g">G</span>';
			frameStat.g.hexcolor = '#205A2E';
			frameStat.g.d6 = 0;
			frameStat.g.d8 = 0;
			frameStat.g.multiplier = 1;
			frameStat.g.max = 5.95;

			for(var i = 0; i < this.g; i++) {
				frameStat.g.d6++;
			}
			if (!this.rd && !this.ra && !this.rhd && !this.rha && !this.rda) {
				frameStat.g.d8++;
			}

			frameStat.g.mean = MEAND6D8[frameStat.g.d6][frameStat.g.d8] * frameStat.g.multiplier;
			frameStat.g.meanw1 = MEAND6D8[frameStat.g.d6+1][frameStat.g.d8] * frameStat.g.multiplier;
			if (this.w > 1) {
				frameStat.g.meanw2 = MEAND6D8[frameStat.g.d6+2][frameStat.g.d8] * frameStat.g.multiplier;
			} else {
				frameStat.g.meanw2 = 0;
			}

			// durability
			frameStat.dur = [];
			frameStat.dur.label = '<span data-sys="d">D</span>';
			frameStat.dur.hexcolor = '#f2f2f2';
			frameStat.dur.totalSystems = 0;
			frameStat.dur.multiplier = 0.3333;
			frameStat.dur.max = 5.6465;

			frameStat.dur.totalSystems = this.w;
			frameStat.dur.totalSystems += this.totalSystems();

			frameStat.dur.mean = frameStat.dur.totalSystems / ((8.46 - MEAND6D8[frameStat.b.d6][frameStat.b.d8]) * frameStat.dur.multiplier);
			frameStat.dur.meanw1 = frameStat.dur.totalSystems / ((8.46 - MEAND6D8[frameStat.b.d6 + 1][frameStat.b.d8]) * frameStat.dur.multiplier);
			if (this.w > 1) {
				frameStat.dur.meanw2 = frameStat.dur.totalSystems / ((8.46 - MEAND6D8[frameStat.b.d6 + 2][frameStat.b.d8]) * frameStat.dur.multiplier);
			} else {
				frameStat.dur.meanw2 = 0;
			}

	/* ****** */
	/*
			// efficiency
			frameStat.eff = [];
			frameStat.eff.label = '<span data-sys="d">Ef</span>';
			frameStat.eff.hexcolor = '#f2f2f2';
			frameStat.eff.multiplier = 1;
			frameStat.eff.max = 16.7;

			frameStat.eff.mean = Math.max(
				(frameStat.rh.mean / frameStat.rh.multiplier),
				(frameStat.rd.mean / frameStat.rd.multiplier),
				(frameStat.ra.mean / frameStat.ra.multiplier))
				+ frameStat.y.mean
				+ frameStat.b.mean
				+ frameStat.g.mean;

			frameStat.eff.meanw1 = 0;
			frameStat.eff.meanw2 = 0;
	*/
			return frameStat;
		},
		createFrameGraph: function(useActiveRange) {
			var frameStat = this.calcFrameStat();

			var output = '<table class="framegraph"><thead><tr><th class="stat-type"><span class="type-label">Type</span><a href="#graph-key" class="item-help">?</a></th><th class="stat-graph">Graph</th><th class="stat-std">Sys</th><th class="stat-white1">+1W</th><th class="stat-white2">+2W</th></tr></thead><tbody>';

			for(var i in frameStat) {
				output += '<tr>';
				output += '<td class="stat-type">' + frameStat[i].label + '</td>';

				output += '<td class="stat-graph graph-container">';

				var useColor = frameStat[i].hexcolor;

				if (useActiveRange && (i == 'rh' || i == 'rd' || i == 'ra')) {
					if ((this.activeRange == 'h' && i != 'rh')
						|| (this.activeRange == 'd' && i != 'rd')
						|| (this.activeRange == 'a' && i != 'ra')) {
						useColor = '#aaa';
					}
				}

				var stdPct = Math.round(frameStat[i].mean / frameStat[i].max * 100);
				var w1Pct = Math.round(frameStat[i].meanw1 / frameStat[i].max * 100);
				var w2Pct = Math.round(frameStat[i].meanw2 / frameStat[i].max * 100);

				if (!frameStat[i].disabled) {
					if (this.w == 2) {
						output += '<span style="width:'+ w2Pct +'%; background:' + useColor + '" class="graphbar graphbar-2w"></span>';
					}

					output += '<span style="width:'+ w1Pct +'%; background:' + useColor + '" class="graphbar graphbar-1w"></span>';
				}

				output += '<span style="width:'+ stdPct +'%; background:' + useColor + '" class="graphbar graphbar-sys"></span>';
				output += '</td>';

				if (frameStat[i].disabled) {
					output += '<td class="stat-std">-</td>'
					output += '<td class="stat-white1">-</td>'
					output += '<td class="stat-white2">-</td>'
				} else {
					output += '<td class="stat-std">' + frameStat[i].mean.toFixed(2) + '</td>';
					output += '<td class="stat-white1">' + frameStat[i].meanw1.toFixed(2) + '</td>';
					if (this.w == 2) {
						output += '<td class="stat-white2">' +frameStat[i].meanw2.toFixed(2) + '</td>';
					} else {
						output += '<td class="stat-white2">-</td>'
					}
				}
				output += '</tr>';
			}

			output += '</tbody></table>';
			return output;
		}
	}

	function settingsModel() {
		// settable preferences
		this.enableSplitSystems = false;
		this.enableEnvironmental = false; // ***
		this.altAttackGraphType = false;
		this.compactUI = false;
		// settable preferences from outside main interface
		this.showUnitGraphs = false;
		this.showLoadoutGraph = true;
		// unsettable
		this.saveVersion = 3;
		this.buildVersion = 0;
		this.framesDestroyed = 0;
		this.systemsDestroyed = 0;
		this.gamesPlayed = 0;
		// app state
		this.gameEndedOnce = false;
	}

} // close jQuery check