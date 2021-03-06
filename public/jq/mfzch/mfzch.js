var mfzch = {
	game: new gameModel(),
	templateGame: '',
	frameSet: [],
	companies: [],
	loadouts: [],
	settings: new settingsModel(),
	appState: new appStateModel(),
	remoteSync: [],
	frameNow: 1,

	/* Parse saved game data */
	gameDataToGameModel: function (loadedData) {
		var restoredGame = new gameModel;
		for (var i in loadedData) {
			if(i == 'teams') {
				restoredGame[i] = [];
				for (var j in loadedData[i]) {
					restoredGame[i][j] = new teamModel;

					for (var k in loadedData[i][j]) {
						if (k == 'cFrames') {
							restoredGame[i][j][k] = [];
							for (var l in loadedData[i][j][k]) {
								restoredGame[i][j][k][l] = new frameModel();
								for (var m in loadedData[i][j][k][l]) {
									restoredGame[i][j][k][l][m] = loadedData[i][j][k][l][m];
								}
							}

						} else {
							restoredGame[i][j][k] = loadedData[i][j][k];
						}
					}
				}
			} else {
				restoredGame[i] = loadedData[i]
			}
		}
		return restoredGame;
	},
	JSONtoGameModel: function (loadJSON) {
		return restoredGame = this.gameDataToGameModel(JSON.parse(loadJSON));
	},

	/* Load and Save */

	saveData: function(dataType, forceSync) {
		if (typeof(forceSync) === undefined) {
			forceSync = false;
		}

		if (dataType == 'game') {
			if (forceSync) {
				var result = new Object;
				result.local = this.saveLocalData(dataType);
				result.remote = this.syncServerData(dataType);
				return result;
			} else {
				return this.saveLocalData(dataType);
			}
		} else if (
			dataType == 'templateGame'
			|| dataType == 'frameSet'
			|| dataType == 'companies'
			|| dataType == 'loadouts'
			|| dataType == 'settings'
			) {
			return this.saveLocalData(dataType) && this.syncServerData(dataType);
		} else {
			return false;
		}
	},

	/* Local data save/restore */

	saveLocalData: function(dataType) {
		if (!this.hasOwnProperty(dataType)) {
			return false;
		}

		var location = 'mfz.' + dataType;
		var data = this[dataType];

		if (
			dataType == 'game'
			|| dataType == 'templateGame'
			|| dataType == 'frameSet'
			|| dataType == 'companies'
			|| dataType == 'loadouts'
			|| dataType == 'settings'
			|| dataType == 'appState'
		) {
			if (!supportsLocalStorage()) { return false; }
			if (dataType == 'templateGame') {
				localStorage[location] = data;
			} else {
				localStorage[location] = JSON.stringify(data);
			}
			return true;
		} else {
			return false;
		}
	},
	restoreLocalData: function(dataType) {
		if (!this.hasOwnProperty(dataType)) {
			return false;
		}

		var location = 'mfz.' + dataType;
		var data = this[dataType];

		if (supportsLocalStorage() && localStorage[location]) {
			var loadedData = JSON.parse(localStorage[location]);

			if (dataType == 'game') {
				return restoredGame = mfzch.gameDataToGameModel(loadedData);
			} else if (dataType == 'templateGame') {
				return localStorage[location];
			} else if (dataType == 'frameSet') {
				var restoredSim = [];
				for (var i in loadedData) {
					restoredSim[i] = new frameModel;
					for (var j in loadedData[i]) {
						restoredSim[i][j] = loadedData[i][j];
					}
				}
				return restoredSim;
			} else if (dataType == 'companies') {
				var restoredCompanies = [];
				for (var i in loadedData) {
					restoredCompanies[i] = new companyModel;
					for (var j in loadedData[i]) {
						if(j == 'frames') {
							restoredCompanies[i][j] = [];
							for (var k in loadedData[i][j]) {
								restoredCompanies[i][j][k] = new frameModel;
								for (var l in loadedData[i][j][k]) {
									restoredCompanies[i][j][k][l] = loadedData[i][j][k][l];
								}
							}
						} else {
							restoredCompanies[i][j] = loadedData[i][j];
						}
					}
				}
				return restoredCompanies;
			} else if (dataType == 'loadouts') {
				var restoredLoadouts = [];
				for (var i in loadedData) {
					restoredLoadouts[i] = new frameModel;
					for (var j in loadedData[i]) {
						restoredLoadouts[i][j] = loadedData[i][j];
					}
				}
				return restoredLoadouts;
			} else if (dataType == 'settings') {
				var restoredSettings = new settingsModel();
				for (var i in loadedData) {
					restoredSettings[i] = loadedData[i];
				}
				return restoredSettings;
			} else if (dataType == 'appState') {
				var restoredState = new appStateModel();
				for (var i in loadedData) {
					restoredState[i] = loadedData[i];
				}
				return restoredState;
			} else {
				return false;
			}
		} else {
			if (dataType == 'game') {
				return new gameModel();
			} else if (dataType == 'templateGame') {
				return '';
			} else if (dataType == 'frameSet') {
				var protoSim = [];
				protoSim[1] = new frameModel();
				protoSim[2] = new frameModel();
				return protoSim;
			} else if (dataType == 'companies') {
				return [];
			} else if (dataType == 'loadouts') {
				return [];
			} else if (dataType == 'settings') {
				return new settingsModel();
			} else if (dataType == 'appState') {
				return new appStateModel();
			} else {
				return false;
			}
		}
	},

	/* Server save/restore */

	saveServerData: function(dataType) {
		if (this.appState.isElite) {
			if (!this.hasOwnProperty(dataType)) {
				return false;
			}

			/* *** What was this check for? It's breaking game parameter changes at pregame.
			if (dataType == 'game' && mfzch.appState.remote.mode) {
				return false;
			}
			*/

			if (dataType == 'game'
				|| dataType == 'companies'
				//	|| dataType == 'loadouts'
				//	|| dataType == 'settings'
				) {
				if (mfzch.settings.activeSync && mfzch.checkOnline()) {
					var postdata = new Object();

					var data = this[dataType]

					if (data) {
						postdata[dataType] = JSON.stringify(data);

						$.post('/save-data', postdata)
						.done(function(result) {
							if (dataType == 'companies') {
								for (var i in data) {
									if (result[i]) {
										if (data[i].name == result[i].name) {
											if (data[i].dbid === false && result[i].dbid) {
												data[i].dbid = result[i].dbid;
											}
											data[i].servermodified = result[i].servermodified;
											data[i].clientmodified = false;
										}
									}
								}
							} else if (dataType == 'game') {
								data.dbid = result[0].dbid;
								data.servermodified = result[0].servermodified;
								data.passwordSet = result[0].passwordSet;
								data.clientmodified = false;
							}
						});
						mfzch.appState.remote.connection = true;
						return true;
					}
				}
			}
		}
		mfzch.appState.remote.connection = false;
		return false;
	},
	restoreServerData: function(dataType) {
		if (this.appState.isElite) {
			if (!this.hasOwnProperty(dataType)) {
				mfzch.appState.remote.connection = false;
				return false;
			}

			if (mfzch.settings.activeSync && mfzch.checkOnline()) {
				var postdata = new Object();
				postdata['type'] = dataType;

				$.post('/load-data', postdata)
				.done(function(result) {
					// success

					for (var i in result) {
						if (result[i].type == 'companies') {

							var companyMap = {};
							for (var l=0; l < mfzch.companies.length; l++) {
								companyMap[ mfzch.companies[l]['dbid'] ] = true;
							}

							for (var c in result[i].data) {
								if (!companyMap.hasOwnProperty(result[i].data[c].dbid)) {
									// No match with server means item was deleted locally
									var delData = new Object();

									delData['companies'] = result[i].data[c].dbid;
									$.post('/delete-data', delData);
								} else {
									var found = false;
									for (var ec in mfzch.companies) {
										if (mfzch.companies[ec].dbid == result[i].data[c].dbid) {
											var found = true;

											var useServer = true;

											if (mfzch.companies[ec].clientmodified) {
												if (result[i].data[c].servermodified <= mfzch.companies[ec].servermodified) {
													useServer = false;
												}
											}

											if (useServer) {
												mfzch.companies[ec].dbid = result[i].data[c].dbid;
												mfzch.companies[ec].name = result[i].data[c].name;
												mfzch.companies[ec].description = result[i].data[c].description;
												mfzch.companies[ec].shared = result[i].data[c].shared;
												mfzch.companies[ec].color = result[i].data[c].color;

												var restoredFrames = [];
												for (var rf in result[i].data[c].frames) {
													restoredFrames[rf] = new frameModel;
													for (var frame in result[i].data[c].frames[rf]) {
														restoredFrames[rf][frame] = result[i].data[c].frames[rf][frame];
													}
												}

												mfzch.companies[ec].frames = restoredFrames;
												mfzch.companies[ec].servermodified = result[i].data[c].servermodified;
												mfzch.companies[ec].clientmodified = false;

											} else {
												// save client to server now
												mfzch.saveServerData(mfzch.companies, 'mfz.companies');
											}
										}
									}

									if (!found) {
										// create if ID does not exist
										var company = new companyModel();

										company.dbid = result[i].data[c].dbid;
										company.name = result[i].data[c].name;
										company.description = result[i].data[c].description;
										company.shared = result[i].data[c].shared;
										company.color = result[i].data[c].color;

										var restoredFrames = [];
										for (var rf in result[i].data[c].frames) {
											restoredFrames[rf] = new frameModel;
											for (var frame in result[i].data[c].frames[rf]) {
												restoredFrames[rf][frame] = result[i].data[c].frames[rf][frame];
											}
										}
										company.frames = restoredFrames;

										company.servermodified = result[i].data[c].servermodified;
										company.clientmodified = false;

										mfzch.companies.push(company);
									}
								}
							}
						} else if (result[i].type == 'game') {
							// *** restore loaded game
							mfzch.game = mfzch.gameDataToGameModel(result[i].data[0]);
							mfzch.game.clientmodified = false;
						}
						mfzch.updateCompanyList();
					}
				});
				mfzch.appState.remote.connection = true;
				return true;
			}
		}
		mfzch.appState.remote.connection = false;
		return false;
	},
	syncServerData: function(dataType) {
		var result = new Object;
		result.save = new Object;
		result.load = new Object;

		if (dataType == 'all') {
			result.save.game = this.saveServerData('game');
			result.save.companies = this.saveServerData('companies');
			// result['save']['loadout'] = this.saveServerData('loadouts');
			// result['save']['setting'] = this.saveServerData('settings');

			result.load.game = this.restoreServerData('game');
			result.load.companies = this.restoreServerData('companies');
			// result['load']['loadouts'] = this.restoreServerData('loadouts');
			// result['load']['settings'] = this.restoreServerData('settings');
		} else {
			result.save[dataType] = this.saveServerData(dataType);
			result.load[dataType] = this.restoreServerData(dataType);
		}
		return result;
	},
	sendGameUpdate: function(patch) {
		if (mfzch.settings.activeSync && mfzch.checkOnline() && mfzch.checkRegistered()) {
			if (patch) {
				$.post('/patch-game', {
					game_dbid: this.game.dbid,
					password: mfzch.appState.remote.password,
					patch: JSON.stringify(patch)
				})
				.done(function(result) {
					// ***
				});
				return true;
			}
		}
		return false;
	},

	/* online connections */
	checkOnline:function() {
		var status = isOnline();
		this.appState.isOnline = status;
		if (status) {
			mfzch.enableOnline();
			return true;
		} else {
			mfzch.disableOnline();
			return false;
		}
	},
	enableOnline:function() {
		$('[data-online-visible="true"]').show();
		$('[data-online-visible="false"]').hide();
	},
	disableOnline:function() {
		$('[data-online-visible="true"]').hide();
		$('[data-online-visible="false"]').show();
	},

	/* registered */
	checkRegistered:function() {
		if (this.appState.user) {
			this.enableRegistered();
			return true;
		} else {
			this.disableRegistered();
			return false;
		}
	},
	enableRegistered:function() {
		$('[data-registered-visible="true"]').show();
		$('[data-registered-visible="false"]').hide();
		$('.registered-username').html(this.appState.user.username);
	},
	disableRegistered:function() {
		$('[data-registered-visible="true"]').hide();
		$('[data-registered-visible="false"]').show();
		$('.registered-username').html('Commander');
	},

	/* remote */
	loadRemoteGame: function(callback) {
		var remoteLoadResult = new Object();
		remoteLoadResult.loaded = false;
		remoteLoadResult.statusChange = false;

		var postdata = new Object();
		postdata['type'] = 'game';
		postdata['data'] = JSON.stringify(mfzch.appState.remote);

		$.post('/remote-load-game/', postdata)
		.done(function(result) {
			if (result && result.type == 'game') {
				if (mfzch.game.status != result.data.status) {
					remoteLoadResult.statusChange = true;
				}

				if (mfzch.game.passwordSet.date != result.data.passwordSet.date) {
					result.passwordChange = true;
				}

				mfzch.game = mfzch.gameDataToGameModel(result.data); // check if servermodified
				mfzch.game.clientmodified = false;

				mfzch.appState.remote.granted = result.grant;

				if (!result.passwordChange) {
					if(mfzch.appState.remote.granted == 'view-nopass'){
						mfzch.appState.remote.granted = 'view';
					}
				}

				remoteLoadResult.loaded = true;
			}
			mfzch.appState.remote.connection = true;

		}).fail(function(){
			mfzch.appState.remote.connection = false;
			remoteLoadResult.loaded = false;
		}).always(function(){
			if (typeof callback === 'function') {
				callback(remoteLoadResult);
			}
		});
	},
	checkRemoteStatus(page, callback){
		mfzch.loadRemoteGame(function(result){
			if (result
				&& result.loaded == true
				&& (
					result.statusChange
					&& mfzch.chooseGamePage() != page
					)
				) {

				$( ":mobile-pagecontainer" ).pagecontainer( "change", mfzch.chooseGamePage(), { changeHash: false } );
			} else {
				if (typeof callback === 'function') {
					callback();
				}
			}
		});
	},
	checkRemoteConnection(){
		mfzch.loadRemoteGame(function(result){
			if (mfzch.chooseGamePage() != '#remote-noconnection') {
				$( ":mobile-pagecontainer" ).pagecontainer( "change", mfzch.chooseGamePage(), { changeHash: false } );
			}
		});
	},

	/* elite */
	checkElite: function() {
		if (this.checkRegistered()) {
			var eliteExpires = new Date(this.appState.eliteExpires);
			this.appState.eliteExpiresFormatted = eliteExpires.getFullYear() + '-' + pad(eliteExpires.getMonth(), 2) + '-' + pad(eliteExpires.getDate(), 2);
			var now = new Date();

			if (eliteExpires > now) {
				this.appState.isElite = true;
				this.enableElite();

				var soon = new Date();
				soon.setDate(soon.getDate() + 15);
				if (eliteExpires > soon) {
					$('[data-elite-expires-soon]').show();
				} else {
					$('[data-elite-expires-soon]').hide();
				}
			} else {
				this.appState.isElite = false;
				this.disableElite();
			}
		} else {
			this.appState.isElite = false;
			this.disableElite();
		}
	},
	enableElite: function() {
		MAXCOMPANIES = 25;
		MAXTEAMS = 9;
		MAXFRAMES = 9;
		MAXSTATIONS = 9;
		MAXUNCLAIMEDSTATIONS = 9;
		MAXLOADOUTS = 50;
		MAXDOOMSDAY = 20;

		$('[data-elite-visible="true"]').show();
		$('[data-elite-visible="false"]').hide();
		$('[data-elite="true"]').prop('disabled', false);
		$('.user-elite-expires').html(this.appState.eliteExpiresFormatted);
	},
	disableElite: function() {
		MAXCOMPANIES = 5;
		MAXTEAMS = 5;
		MAXFRAMES = 8;
		MAXSTATIONS = 3;
		MAXUNCLAIMEDSTATIONS = 1;
		MAXLOADOUTS = 10;
		MAXDOOMSDAY = 11;

		$('[data-elite-visible="false"]').show();
		$('[data-elite-visible="true"]').hide();
		$('[data-elite="true"]').prop('disabled', true);
		$('.user-elite-expires').html(this.appState.eliteExpiresFormatted);
	},

	/* undo/redo */

	undo: {
		states: [],
		currentState: 0,
		validStates: 0,

		setState: function() {
			this.currentState++;
			this.validStates = this.currentState;

			this.states[this.currentState] = JSON.stringify(mfzch.game);

			$('#undo').prop('disabled', false);
			$('#redo').prop('disabled', true);
		},
		getState: function() {
			if(this.currentState) {
				var redoState = this.currentState + 1;
				this.states[redoState] = JSON.stringify(mfzch.game);

				mfzch.game = this.restoreState(this.states[this.currentState]);
				this.currentState--;

				if (this.currentState < 1) {
					$('#undo').prop('disabled', true);
				}

				$('#redo').prop('disabled', false);
				$('#end-round').show();
			}
		},
		getRedoState: function() {
			if(this.currentState < this.validStates) {
				this.currentState++;
				var redoState = this.currentState + 1;

				mfzch.game = this.restoreState(this.states[redoState]);

				if(this.currentState >= this.validStates) {
					$('#redo').prop('disabled', true);
				}

				$('#undo').prop('disabled', false);
			} else {
				$('#redo').prop('disabled', true);
			}
		},
		restoreState: function(state) {
			return restoredGame = mfzch.JSONtoGameModel(state);
		},
		invalidateLastState: function() {
			this.currentState--;
			this.validStates = this.currentState;

			if (this.currentState < 1) {
				$('#undo').prop('disabled', true);
			}

			$('#redo').prop('disabled', true);
		}
	},

	/* interface */

	updateGameInfo: function(thisGame) {
		$('.gameinfo-type').html(thisGame.gameType);
		$('.gameinfo-round').html(thisGame.round);
		$('.gameinfo-remaining').html(thisGame.roundsRemaining(true));
		$('.gameinfo-doomsday').html(thisGame.doomsday);
	},
	updateSystemsInputs: function() {
		$('#team-systems').attr('max', $('#team-frames').val()*4 ).slider( "refresh" );
	},
	updateTeamList: function(thisGame) {
		$('#teams').empty();

		var newteam = '';

		for (var i in thisGame.teams) {
			var team = thisGame.teams[i];
			var checkSetup = thisGame.checkSetup(team);
			newteam += '<li id="team_'+ i +'" data-teamid="' + team.uuid + '"';

			if (!checkSetup.passing) {
				newteam += ' data-theme="c"';
			}

			if (thisGame.blindSetup) {
				newteam += ' data-icon="delete">';
				newteam += '<a href="#" class="team-del"><h2>' + getIcon('frame', team.color, 'game-icon') +  ' ' + team.name + '</h2>';
			} else {
				newteam += '>';
				newteam += '<a href="#team-adjust" data-rel="popup" data-position-to="window" data-transition="pop" class="team-manage">';
				newteam += '<h2>' + team.name + '</h2>';

				if (thisGame.trackingLevel <= 10) {
					newteam += '<div class="team-display-info">' + getIcon('frame', team.color, 'game-icon') + team.gFrames + ' ' + getIcon('system', team.color, 'game-icon') + team.sSystems + '</div>';
				} else {
					var totalSystems = team.totalSystems();

					newteam += '<div class="team-display-info">' + getIcon('frame', team.color, 'game-icon') + team.cFrames.length + ' ' + getIcon('system', team.color, 'game-icon') + totalSystems + '</div>';
				}

				if (!checkSetup.passing) {
					newteam += '<ul class="reason">';
					for (var r in checkSetup.reason) {
						newteam += '<li>' + checkSetup.reason[r] + '</li>';
					}
					newteam += '</ul>';
				}

			}

			newteam += '</a>';

			if (!thisGame.blindSetup) {
				newteam += '<a href="#" class="team-del">Delete</a></li>';
			}
		}

		if (thisGame.teams.length < thisGame.intendedPlayers) {
			newteam += '<li><a href="#" id="team-add" class="ui-btn ui-btn-b ui-icon-plus ui-btn-icon-left">Add Company</a></li>';
		}

		$('#teams').append(newteam);
		$('#teams').listview('refresh');
	},
	updateTeamFrameList: function(thisGame, team, jqobj) {
		jqobj.empty();
		var frames = team.cFrames;
		var teamlist = '';

		for (var i in frames) {
			teamlist += '<li id="team_frame_'+ i +'" data-frameid="' + frames[i].uuid + '">';
			teamlist += '<a href="#team-adjust-frame" data-rel="popup" data-position-to="window" data-transition="pop" class="team-frame-manage">';
			teamlist += frames[i].name;
			teamlist += frames[i].getSystemDisplay(false, false, 'in-list');
			teamlist += '</a>';
			teamlist += '<a href="#" class="team-frame-del">Delete</a></li>'
		}

		if (team.cFrames.length < thisGame.maxFrames) {
			teamlist += '<li><a href="#" id="team-frame-add" class="ui-btn ui-btn-b ui-icon-plus ui-btn-icon-left">Add Frame</a></li>';
		}

		jqobj.append(teamlist);
		jqobj.listview('refresh');
	},
	updateSetupParameters: function(thisGame) {
		thisGame.updateParameters();

		if (thisGame.gameType == 'Battle'
			|| thisGame.gameType == 'Skirmish') {
			$('#gp-framesPerPlayer').rangeslider('disable');
			$('#gp-stationsPerPlayer').slider('disable');
			$('#gp-doomsday').slider('disable');
			$('#gp-unclaimedStations').slider('disable');
			$('#gp-unclaimedStations').attr('max', 1);
			if(thisGame.intendedPlayers == 4) {
				$('#gp-unclaimedStations').slider('enable');
			}
		} else if (thisGame.gameType == 'Demo') {
			$('#gp-framesPerPlayer').rangeslider('disable');
			$('#gp-stationsPerPlayer').slider('disable');
			$('#gp-doomsday').slider('disable');
			$('#gp-unclaimedStations').slider('disable');
			$('#gp-unclaimedStations').attr('max', 1);
		} else { // Free Play
			$('#gp-framesPerPlayer').rangeslider('enable');
			$('#gp-stationsPerPlayer').slider('enable');
			$('#gp-doomsday').slider('enable');
			$('#gp-unclaimedStations').slider('enable');
			$('#gp-unclaimedStations').attr('max', MAXUNCLAIMEDSTATIONS);
		}

		$('#gp-framesPerPlayerMin').val(thisGame.minFrames);
		$('#gp-framesPerPlayerMax').val(thisGame.maxFrames);
		$('#gp-stationsPerPlayer').val(thisGame.stationsPerPlayer);
		$('#gp-doomsday').val(thisGame.doomsday);
		$('#gp-unclaimedStations').val(thisGame.unclaimedStations);

		$('#gp-framesPerPlayer').rangeslider('refresh');
		$('#gp-stationsPerPlayer').slider('refresh');
		$('#gp-doomsday').slider('refresh');
		$('#gp-unclaimedStations').slider('refresh');

		$('#game-players-amount').slider('refresh');
		$('#game-type-switch').selectmenu('refresh');
	},
	outputSetupParameters: function(thisGame) {
		var output = 'For this ' + thisGame.intendedPlayers + '-player ';

		if (thisGame.gameType == 'Battle') {
			output += 'battle';
		} else if (thisGame.gameType == 'Skirmish') {
			output += 'skirmish';
		} else if (thisGame.gameType == 'Demo') {
			output += 'demo game';
		} else if (thisGame.gameType == 'Custom') {
			output += 'custom game';
		} else {
			output += 'game';
		}

		output += ', each company must have '+ thisGame.minFrames;


		if (thisGame.minFrames == thisGame.maxFrames) {
			if (thisGame.minFrames == 1) {
				output += ' frame';
			} else {
				output += ' frames';

			}
		} else {
			output += '&#8211;' + thisGame.maxFrames + ' frames';
		}

		output += ' and ' + thisGame.stationsPerPlayer;

		if (thisGame.stationsPerPlayer == 1) {
			output += ' station.';
		} else {
			output += ' stations.';
		}

		if (thisGame.unclaimedStations) {
			output += '<br />' + thisGame.unclaimedStations + ' additional unclaimed';
			if (thisGame.unclaimedStations == 1) {
				output += ' station is';
			} else {
				output += ' stations are';
			}
			output += ' needed.';
		}

		output += '<br />';
		if (thisGame.trackingLevel == 10) {
			output += 'Simple';
		} else if (thisGame.trackingLevel == 20) {
			output += 'Detailed';
		} else if (thisGame.trackingLevel == 30) {
			output += 'Complete';
		} else {
			output += 'ERROR';
		}
		output += ' tracking will be used.'

		$('.game-params-text').html(output);
	},
	randomTeamName: function() {
		var list1 = ['Advanced', 'Ahu', 'Aleph', 'Alpha', 'Amritsar', 'Assault', 'Astromax', 'Beta', 'Bhadal', 'Blood', 'Boussht', 'Burned Moon', 'Callisto', 'Celiel', 'Ceres', 'Chabbing', 'Chet\'s', 'Chrome', 'Crimson', 'Deadeye', 'Deadly', 'Death', 'Deimos', 'Deku', 'Doomed', 'Dragon-slaying', 'Earth', 'Ekmer', 'Elite', 'Endymion', 'Enniot City', 'Enorn Two', 'Europa', 'Ferocious', 'Free Colony', 'Freedom', 'Gamma', 'Ganymede', 'Gemmel', 'Guerrilla', 'Guild', 'Gursk', 'Heavy', 'Gen. Hezeraiah\'s', 'Horrible', 'Hurdy-gurdy', 'Hutching', 'Hyperion', 'Ijad', 'Invincible', 'Io', 'Jakarta', 'Jovian', 'Junker', 'Kigali', 'Kush', 'Labor', 'Leda', 'Lunar', 'Luzon', 'Martian', 'Mechanical', 'Midnight', 'Mieze', 'Millennium', 'Momozono\'s', 'Napalm', 'Nanking', 'Newport Station', 'Northern Republic', 'Omega', 'Omicron', 'Orbital', 'Outback', 'Pathetic', 'Peach', 'Peloto', 'Phobos', 'Phoenix', 'Poshet', 'Prototype', 'Quall', 'Queslett', 'Ragged', 'Ransoll', 'Rock', 'Rookie', 'Rusty', 'Salvage', 'Selene', 'Scrap', 'Shebehu', 'Shiny', 'Shock', 'Sigma', 'Sol', 'Solar Union', 'Southport', 'Space', 'Spice', 'Steel', 'Stone', 'Strongarm', 'Support', 'TEM', 'Titan', 'TTA', 'TTM', 'Terran', 'Test', 'Thunder', 'Tien Shan', 'Transit Gate', 'Twankus Prime', 'UMFL', 'United', 'Venusian', 'Veteran', 'Wandering', 'Weeping Widow', 'Worthless'];
		var list2 = ['Anvil', 'Army', 'Assassins', 'Axe', 'Big Dogs', 'Blade', 'Brigade', 'Cannon', 'Cavaliers', 'Cell', 'Chabbers', 'Chuckers', 'Clanks', 'Cobras', 'Commandos', 'Company', 'Condors', 'Conscripts', 'Corps', 'Cowboys', 'Crew', 'Crusaders', 'Cultists', 'Deathtraps', 'Defenders', 'Delivery Service', 'Demolitions', 'Dragons', 'Eagles', 'Enforcers', 'Falcons', 'Fire Starters', 'Force', 'Formation', 'Frames', 'Freaks', 'Ghosts', 'Grashers', 'Griffins', 'Hammer', 'Hoplites', 'Hunters', 'Hutch Bunnies', 'Infantry', 'Jaguars', 'Knights', 'Lancers', 'Legion', 'Legionnaires', 'Lobsters', 'Marauders', 'Marines', 'Mercenaries', 'Militia', 'Miners', 'Nagas', 'Navigators', 'Outlaws', 'Overlords', 'Peacekeepers', 'Phalanx', 'Pirates', 'Pitbulls', 'Police', 'Protectors', 'Raiders', 'Rangers', 'Ravens', 'Rebels', 'Recon', 'Rejects', 'Rhinos', 'Ronin', 'Rustbuckets', 'Scorpions', 'Scouts', 'Scythe', 'Seals', 'Sentinels', 'Seraphs', 'Service', 'Shadows', 'Sharks', 'Shield', 'Sisterhood', 'Slackers', 'Slag', 'Snakes', 'Soldiers', 'Squadron', 'Standing Tanks', 'Storm', 'Striders', 'Strike Team', 'SWAT Team', 'Sword', 'Tarantulas', 'Team', 'Thunderhead', 'Tigers', 'Troopers', 'Vagrants', 'Vikings', 'Vipers', 'Warriors', 'Wedge', 'Wolverines'];
		var list3 = ['of Death', 'of Destruction', 'of Doom', 'of Pain'];

		var randName = '';
		var seed = Math.random();

		if (seed < 0.01) {
			randName = list1[Math.floor((Math.random() * (list1.length)))] + ' ' + list2[Math.floor((Math.random() * (list2.length)))] + ' ' + list3[Math.floor((Math.random() * (list3.length)))];
		} else if (seed < 0.03) {
			randName = list2[Math.floor((Math.random() * (list2.length)))] + ' ' + list3[Math.floor((Math.random() * (list3.length)))];
		} else {
			randName = list1[Math.floor((Math.random() * (list1.length)))] + ' ' + list2[Math.floor((Math.random() * (list2.length)))];
		}

		return randName;
	},
	generateDescriptor: function() {
		var newName = this.randomTeamName();
		var newColor = '#'+pad(Math.floor(Math.random()*16777215).toString(16), 6);

		return descriptor = [newName, newColor];
	},
	updateActiveTeams: function(thisGame) {
		thisGame.sortByScore();

		$('#active-game-teams').empty();

		for (var i in thisGame.teams) {
			var team = thisGame.teams[i];
			var teamrow = '';

			teamrow = '<div class="team" data-team-id="'+ team.uuid + '">';

			teamrow += '<ul class="team-box" data-role="listview" data-inset="true"><li class="team-info">';

			teamrow += '<div class="team-score"><div class="score">' + team.gScore + '</div>';
			teamrow += '<small class="PPA">' + team.gPPA + ' PPA</small></div>';

			teamrow += '<div class="team-asset-summary">' + getIcon('frame', team.color, 'game-icon') + team.gFrames + '<br />';
			teamrow += getIcon('station', team.color, 'game-icon') + team.gStations + '</div>';

			teamrow += '<div class="team-name"><h2>' + team.name + '</h2></div></li>';

			if (thisGame.trackingLevel >= 20) {

				for (var j in team.cFrames) {
					var frame = team.cFrames[j];

					teamrow += '<li class="team-frame';

					if (thisGame.trackingLevel >= 30) {
						if (frame.activated) {
							teamrow += ' activated" data-theme="c';
						}
					}

					teamrow += '" data-frameid="' + frame.uuid + '"><a href="#" data-rel="popup" data-position-to="window" data-transition="pop" class="frame-smash">';

					teamrow += '<span class="lv-wsys-name">';

					if (thisGame.trackingLevel >= 30) {
						if (frame.activated) {
							teamrow += '<span data-sys="b">' + frame.defense + '</span>';
						}
						if (frame.spot > 0) {
							teamrow += '<span data-sys="y">' + frame.spot + '</span>';
						}
					}

					teamrow += getIcon(frame.icon, team.color, 'game-icon') + frame.name + '</span>';

					teamrow += frame.getSystemDisplay(false, true, 'in-list');

					teamrow += '</a></li>';
				}
				teamrow += '</ul>';
			}

			teamrow += '</div>';

			$('#active-game-teams').append(teamrow);
			$('#active-game-teams').find('.team-box').listview();
		}
	},
	updateReadyStatus: function(thisGame) {
		var result = thisGame.checkSetup();

		if (result.passing) {
			if(mfzch.appState.remote.mode
				&& mfzch.appState.remote.mode != 'host') {
				$('#game-ready-status').html('<div class="ui-body ui-body-b ui-corner-all">Waiting for host to proceed.</div>');
			} else {
				$('#game-ready-status').html('<a href="#" id="confirm-companies" class="ui-btn ui-btn-b ui-icon-carat-r ui-btn-icon-right ui-corner-all">Confirm Companies</a>');
			}
		} else {
			if (result.reason.length) {
				var response = '<ul>';
				for (var i in result.reason) {
					response += '<li>' + result.reason[i] + '</li>';
				}
				response += '</ul>';

				$('#game-ready-status').html('<div class="ui-body ui-body-a ui-corner-all">' + response + '</div>');
			} else {
				$('#game-ready-status').html('');
			}
		}
	},
	updateTieChoices: function(thisGame, team, totalTied) {
		$('#def-tie-teams').empty();
		for (var i = 0; i < mfzch.game.teams.length; i++) {
			var teamrow = '<li>';

			teamrow += '<div class="team-score"><div class="score">' + thisGame.teams[i].gScore + '</div>';
			teamrow += '<small class="PPA">' + thisGame.teams[i].gPPA + ' PPA</small></div>';

			teamrow += '<div class="team-asset-summary">' + getIcon('frame', thisGame.teams[i].color, 'game-icon') + thisGame.teams[i].gFrames + '<br />';
			teamrow += getIcon('system', thisGame.teams[i].color, 'game-icon') + thisGame.teams[i].sSystems + '</div>';

			teamrow += '<div class="team-name"><h2>' + thisGame.teams[i].name + '</h2></div></li>';

			$('#def-tie-teams').append(teamrow);
		}
		$('#def-tie-teams').listview('refresh');

		$('.def-tie-choice-team').html(getIcon('company', team.color, 'game-icon') + team.name);

		var actions = thisGame.tiedForDefenseActions(team, totalTied);

		$('#def-tie-choice').empty();

		for (var i in actions) {
			if (actions[i] == 'add-frame') {
				$('#def-tie-choice').append('<li data-icon="plus"><a href="#tie-frame-add" data-rel="popup">Add a frame</a></li>');
			} else if (actions[i] == 'remove-frame') {
				$('#def-tie-choice').append('<li data-icon="minus"><a href="#tie-frame-remove" data-rel="popup">Remove a frame</a></li>');
			} else if (actions[i] == 'defer') {
				$('#def-tie-choice').append('<li data-icon="forbidden"><a href="#" id="tie-defer">Defer choice to next company</a></li>');
			}
		}

		$('#def-tie-choice').listview('refresh');
		$('#def-team-choice-id').val(team.uuid);
	},
	determineTieChoices: function(thisGame) {
		var teamid = $('#def-team-choice-id').val();
		var team = mfzch.game.findTeamByUUID(teamid);
		var teamIndex = mfzch.game.teams.indexOf(team);

		var numTied = mfzch.game.tiedForDefense();

		var nextTeamIndex = teamIndex + 1;
		if (nextTeamIndex >= numTied) {
			thisGame.reset();
			nextTeamIndex = 0;
		}

		team = thisGame.teams[nextTeamIndex];

		thisGame.setPPA();
		thisGame.updateScores();
		thisGame.sortByScore();

		numTied = mfzch.game.tiedForDefense();

		if (numTied > 1) {
			mfzch.updateTieChoices(thisGame, team, numTied)
		} else {
			// tie is resolved; move on
			mfzch.game.reset();

			if (mfzch.game.gameType == "Battle"
				|| mfzch.game.gameType == "Skirmish") {

				mfzch.game.status = 3;
				mfzch.saveData('game', true);

				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#game-deployment", { changeHash: false } );
			} else {
				mfzch.game.status = 4;
				mfzch.saveData('game', true);

				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#active-game", { changeHash: false } );
			}
		}
	},
	updateTieFrameList: function(thisGame, team, jqobj) {
		jqobj.empty();
		var frames = team.cFrames
		var teamlist = '';

		for (var i in frames) {
			var frame = frames[i];
			teamlist += '<a href=""><li data-frameid="' + frame.uuid + '">';
			teamlist += frame.name;
			teamlist += frame.getSystemDisplay(false, false, 'in-list');
			teamlist += '</a></li>'
		}

		jqobj.append(teamlist);
		jqobj.listview('refresh');
	},
	updateSystemDisplay: function(thisFrame) {
		// system display
		$('#active-systems').html(thisFrame.getSystemDisplay(true, true));

		// dice display
		if(!thisFrame.rollResult) { // if no current roll exists
			$('#active-dice').html(thisFrame.getDiceDisplay());
		} else {
			$('#active-dice').html(thisFrame.getRollDisplay());
		}

		$('.framespec').html(thisFrame.createFrameGraph(true));
	},
	getCapturableStations: function(captureTeamId, isGaining) {
		var availableStations = '';
		var availableStationIDs = [];
		var captureTeam = this.game.findTeamByUUID(captureTeamId);

		if (isGaining) {
			$('.station-capture-message').html('Who controls the station that <strong>' + getIcon('company', captureTeam.color, 'game-icon') + captureTeam.name + '</strong> is capturing?')

			for (var i in this.game.teams) {
				var team = this.game.teams[i];
				if (team.gStations) {
					if (team.uuid != captureTeam.uuid) {
						if (team.gStations) {
							availableStationIDs.push(team.uuid);
							availableStations += '<li data-icon="minus"><a href="#" class="station-capture-button" data-team-id="' + team.uuid + '">' + getIcon('company', team.color, 'game-icon') + team.name + ' <span class="ui-li-count">' + team.gStations + '</span></a></li>';
						}
					}
				}
			}
			if(this.game.unclaimedStations) {
				availableStationIDs.push('nobody');
				availableStations += '<li data-icon="minus"><a href="#" class="station-capture-button" data-team-id="nobody">Unclaimed <span class="ui-li-count">' + this.game.unclaimedStations + '</span></a></li>';
			}

		} else {
			$('.station-capture-message').html('Who is gaining control of the station <strong>' + getIcon('company', captureTeam.color, 'game-icon') + captureTeam.name + '</strong> is losing?')

			for (var i in this.game.teams) {
				var team = this.game.teams[i];
				if (team.uuid != captureTeam.uuid && team.gFrames) {
					availableStationIDs.push(team.uuid);
					availableStations += '<li data-icon="plus"><a href="#" class="station-drop-button" data-team-id="' + team.uuid + '">' + getIcon('company', team.color, 'game-icon') + team.name + ' <span class="ui-li-count">' + team.gStations + '</span></a></li>';
				}
			}
			if (mfzch.game.checkUnclaimedIsPossible()) {
				availableStations += '<li data-icon="plus"><a href="#" class="station-drop-button" data-team-id="nobody">Nobody/Contested <span class="ui-li-count">' + this.game.unclaimedStations + '</span></a></li>';
			}
		}

		if (availableStationIDs.length == 1) {
			return availableStationIDs[0];
		} else if (availableStations) {
			$('#station-capture-list').html(availableStations);
			$('#station-capture-list').listview('refresh');
			$('#station-capture-list').show();
			return false;
		} else {
			$('.station-capture-message').html('There are no stations which <strong>' + getIcon('company', this.game.teams[captureTeam].color, 'game-icon') + this.game.teams[captureTeam].name + '</strong> may capture.');

			$('#station-capture-list').hide();
			return false;
		}
	},
	getShortCompanyList: function(){
		var output = '';
		for (var i in this.companies) {
			var company = this.companies[i];
			if (company.frames.length < MAXFRAMES) {
				output += '<li data-id="' + company.uuid + '" data-icon="false"><a href="#">' + getIcon('company', company.color, 'game-icon') + company.name + '<span class="ui-li-count">' + company.frames.length + '</span></a></li>';
			} else {
				output += '<li data-id="' + company.uuid + '">' + getIcon('company', company.color, 'game-icon') + company.name + '<span class="ui-li-count">Full</span></li>';
			}
		}
		return output;
	},

	updateCompanyList: function() {
		$('#company-list').empty();

		for (var i in this.companies) {
			var company = this.companies[i];

			var companyList = '<li id="company_'+ i +'" data-companyid="' + company.uuid + '">'

			+ '<ul data-role="listview" data-split-icon="delete" data-inset="true" class="company-frames">'

			+ '<li data-theme="b"><a href="#company-adjust" data-rel="popup" data-position-to="window" data-transition="pop" class="company-manage" class="company-info">' + '<span class="lv-wsys-name">' + getIcon('company', company.color, 'game-icon', true) + company.name + '</span><ul class="companyinfo-string in-list">';

			companyList += '<li>' + getIcon('frame', company.color, 'game-icon') + company.frames.length + '</li>';
			companyList += '<li>' + getIcon('system', company.color, 'game-icon') + company.totalSystems() + '</li>';
			companyList += '<li><span data-sys="ssr">SSR</span>' + company.totalSSRs()+ '</li>';

			companyList += '</ul></a>';

			companyList += '<a href="#" class="company-delete">Delete</a>';

			if (company.frames.length) {
				companyList += '<li data-role="list-divider" class="company-graph-in-list">' + company.getCompanyGraph() + '</li>';
			}

			for (var j in company.frames) {
				var frame = company.frames[j];

				companyList += '<li data-frameid="' + frame.uuid + '"><a href="#frame-adjust" data-rel="popup" data-position-to="window" data-transition="pop" class="frame-manage">';

				companyList += '<span class="lv-wsys-name">' + getIcon(frame.icon, company.color, 'game-icon') + frame.name + '</span>';

				companyList += frame.getSystemDisplay(false, false, 'in-list');

				companyList += '</a><a href="#" class="frame-del">Delete</a></li>';
			}

			if (company.frames.length < MAXFRAMES) {
				companyList += '<li><a href="#" class="frame-add ui-btn ui-btn-a ui-icon-plus ui-btn-icon-left">Add Frame</a></li>';
			}

			companyList += '</ul></li>';
			$('#company-list').append(companyList);
		}

		if (this.companies.length < MAXCOMPANIES) {
			$('#company-list').append('<li><a href="#" id="company-add" class="ui-btn ui-btn-a ui-corner-all ui-icon-plus ui-btn-icon-left">Add Company</a></li>');
		}

		$('.company-frames').listview();

		if (!mfzch.settings.showUnitGraphs) {
			$('.company-graph-in-list').hide();
		}
	},
	chooseGamePage: function() {
		if (mfzch.appState.remote.mode) {
			if (mfzch.appState.remote.connection) {
				if (mfzch.appState.remote.granted == 'modify') {
					if (mfzch.game.status >= 4) {
						return "#active-game";
					} else if (mfzch.game.status >= 3) {
						return "#game-deployment";
					} else if (mfzch.game.status >= 2) { // wait out tie resolution
						if (mfzch.appState.remote.mode == 'host') {
							return "#setup-tie";
						} else {
							return "#remote-hold";
						}
					} else if (mfzch.game.status >= 1) {
						return "#company-entry";
					} else {
						if (mfzch.appState.remote.mode == 'host') {
							return "#game-setup";
						} else { // *** wait it out or kick users? (need to reauth if wait)
							return "#remote-hold";
						}
					}
				} else if (mfzch.appState.remote.granted == 'view') {
					if (mfzch.game.status >= 2) { // skip deployment, tie resolution
						return "#active-game";
					} else {
						return "#remote-hold";
					}
				} else {
					return "#remote-password";
				}
			} else {
				return "#remote-noconnection";
			}
		} else { // offline or host
			if (mfzch.game.status >= 4) {
				return "#active-game";
			} else if (mfzch.game.status >= 3) {
				return "#game-deployment";
			} else if (mfzch.game.status >= 2) {
				return "#setup-tie";
			} else if (mfzch.game.status >= 1) {
				return "#company-entry";
			} else {
				return "#game-setup";
			}
		}
	},

	/* Deployment */

	frameNameScore: function(teamid) {
		return getIcon('company', this.game.teams[teamid].color, 'game-icon') + this.game.teams[teamid].name + ' &#8212; ' + this.game.teams[teamid].gScore + ' <small>(' + this.game.teams[teamid].gPPA + 'PPA)</small>';
	},
	frameName: function(teamid) {
		return getIcon('company', this.game.teams[teamid].color, 'game-icon') + this.game.teams[teamid].name;
	},

	/* Loadouts */

	buildPresetLoadouts: function() {
		var loadoutList = '';

		for (var i in FRAMELOADS) {
			var loadset = FRAMELOADS[i];
			loadoutList += '<h2>' + loadset.title + '</h2>';

			loadoutList += '<div data-role="collapsible-set" data-expanded-icon="carat-d" data-collapsed-icon="carat-r">';

			for (var j in loadset.loadouts) {
				var load = new frameModel;
				for (var k in loadset.loadouts[j]) {
					load[k] = loadset.loadouts[j][k];
				}

				loadoutList += '<div data-role="collapsible" data-load-index="' + k + '">';
				loadoutList += '<h3><span class="lv-wsys-name">' + load.name + '</span> ';
				loadoutList += load.getSystemDisplay(false, false, 'in-list no-ssr');
				loadoutList += '</h3><p>' + load.description + '</p>';
				loadoutList += '<button class="loadout-graph ui-btn ui-btn-inline ui-corner-all">Show Graph</button>';
				loadoutList += '<button class="add-to-company ui-btn ui-btn-inline ui-corner-all">Add to Company</button>';
				loadoutList += '</div>';
			}

			loadoutList += '</div>';
		}

		$('#loadouts-preset').html(loadoutList).enhanceWithin();
	},
	updateLoadoutList: function() {
		$('#loadouts-custom').empty();
		var loadoutList = '<ul data-role="listview" data-split-icon="delete" data-inset="true">';

		for (var i in this.loadouts) {
			var load = this.loadouts[i];
			loadoutList += '<li data-load-id="' + load.uuid + '"><a href="#loadout-adjust" data-rel="popup" data-position-to="window" data-transition="pop" class="load-manage">';
			loadoutList += '<span class="lv-wsys-name">' + load.name + '</span>';
			loadoutList += load.getSystemDisplay(false, false, 'in-list no-ssr');
			loadoutList += '</a><a href="#" class="load-del">Delete</a></li>';
		}
		if (this.loadouts.length < MAXLOADOUTS) {
			loadoutList += '<li><a href="#" id="loadout-add" class="ui-btn ui-icon-plus ui-btn-icon-left">Add Loadout</a></li>';
		}
		loadoutList += '</ul>';

		$('#loadouts-custom').html(loadoutList);
		$('#loadouts-custom>ul').listview();
	},
	extractLoadoutFromTitle: function(elInput, elOutput) {
		var name = $(elInput).parent().parent().find('.lv-wsys-name').html().trim();
		$(elOutput).attr('data-name', name);

		$(elOutput).html($(elInput).parent().parent().find('a .sys-display').html());
	},
	convertHtmlToLoadout: function(elInput) {
		var load = new frameModel;

		load.name = $(elInput).attr('data-name');
		$(elInput).find('li').each(function(){
			var sysType = $(this).attr('data-sys');
			load[sysType]++;
		});

		return load;
	},

	/* Structured Units */

	addCompanyToAsset: function() {
		var companyid = $('#company-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		var team = new teamModel();
		team.name = uniqueName(company.name, buildNameArray(this.game.teams));

		team.color = company.color;
		team.gFrames = company.frames.length;
		team.sSystems = company.totalSystems();

		 // Copy frames in
		for (var i in company.frames) {
			team.cFrames[i] = new frameModel();
			for (var j in company.frames[i]) {
				team.cFrames[i][j] = company.frames[i][j];
			}
		}

		this.game.teams.push(team);
		mfzch.saveLocalData('game');

		$('#company-track-added').popup('open');
		try {
			ga('send', 'event', 'Company', 'Action', 'Send to Asset Tracker', 0, false);
		} catch (err) {}
	}
}
