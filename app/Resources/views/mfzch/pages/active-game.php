<div data-role="page" id="active-game">
	<div data-role="header" data-position="fixed" data-tap-toggle="false">
		<h1>Asset Tracking</h1>
		<a href="#nav-panel" class="ui-btn-left ui-btn ui-corner-all ui-btn-icon-notext ui-icon-bars">Navigation</a>
		<a href="#" id="exit-game" class="ui-btn-right ui-btn ui-btn-a ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-star">New Game</a>
	</div>

	<div role="main" class="ui-content">
		<div class="ui-grid-b ui-corner-all ui-body-a" id="game-info-panel">
			<div class="ui-block-a">Game Type: <strong class="gameinfo-type">-</strong></div>
			<div class="ui-block-b">Round: <strong class="gameinfo-round">-</strong> <small class="gameinfo-total-rounds">(of <span class="gameinfo-remaining">-</span>)</small></div>
			<div class="ui-block-c">Doomsday: <strong class="gameinfo-doomsday">-</strong></div>
		</div>
		<div data-role="controlgroup" data-type="horizontal" data-mini="true" style="float: right">
			<button id="undo" class="ui-btn ui-icon-back ui-btn-icon-left ui-btn-inline ui-corner-all">Undo</button>
			<button href="#" id="redo" class="ui-btn ui-icon-forward ui-btn-icon-left ui-btn-inline ui-corner-all">Redo</button>
		</div>
		<div id="active-game-teams">
			<p>[Error]</p>
		</div>

		<p style="text-align: right"><a href="#" id="endgame-log" class="ui-btn ui-icon-bullets ui-btn-icon-left ui-btn-inline ui-corner-all">Game Log</a>
			<a href="#" id="end-round" class="ui-btn ui-btn-b ui-icon-arrow-d ui-btn-icon-left ui-btn-inline ui-corner-all">End Round</a></p>
	</div>

	<div data-role="popup" id="team-action" data-theme="b" data-overlay-theme="b" data-team-index="none" data-history="false">
        <ul data-role="listview" data-inset="true">
            <li data-role="list-divider">Choose an action</li>
            <li data-icon="delete"><a href="#" id="destroy-frame">Destroy Frame</a></li>
            <li data-icon="plus"><a href="#" id="gain-station">Seize Station</a></li>
            <li data-icon="minus"><a href="#" id="lose-station">Lose Station</a></li>
        </ul>
	</div>

	<div data-role="popup" id="no-action" data-theme="b" data-overlay-theme="b" data-team-index="none" data-history="false">
		<div data-role="header">
			<h1>Company Eliminated</h1>
		</div>
		<div role="main" class="ui-content">
	        <p>This company is not capable of further action.</p>
			<p><a href="#" class="ui-btn ui-corner-all" data-rel="back">Back</a></p>
		</div>
	</div>

	<div data-role="popup" id="station-capture" data-theme="b" data-overlay-theme="b" data-team-index="none" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Capture Station</h1>
		</div>
		<div role="main" class="ui-content">
			<p class="station-capture-message"></p>

			<ul id="station-capture-list" data-role="listview" data-inset="true" data-theme="a" data-count-theme="b"></ul>

			<p><a href="#" class="ui-btn ui-corner-all" data-rel="back">Cancel</a>
		</div>
	</div>

	<div data-role="popup" id="ddc-count" data-theme="b" data-overlay-theme="b" data-team-index="none" data-transition="pop" data-dismissible="false" data-history="false">
		<div data-role="header">
			<h1>Doomsday</h1>
		</div>
		<div role="main" class="ui-content">
			<p>Doomsday is now <strong class="gameinfo-doomsday-counter">-</strong>.</p>
			<p><strong id="ddc-current-team">-</strong>: count Doomsday further?</p>
			<div>
				<a href="#" id="ddc-yes" class="ui-btn ui-corner-all ui-btn-a">Yes</a>
				<a href="#" id="ddc-no" class="ui-btn ui-corner-all">No</a>
			</div>
		</div>
	</div>

	<div data-role="popup" id="game-end" data-theme="b" data-overlay-theme="b" data-team-index="none" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Game Ends</h1>
		</div>
		<div role="main" class="ui-content">
			<h3>Final Score</h3>
			<ul id="final-score" data-role="listview"><li>-</li></ul>
			<p><a href="#" class="ui-btn ui-corner-all" data-rel="back">Back</a></p>
		</div>
	</div>

	<div data-role="popup" id="game-log-box" data-theme="b" data-overlay-theme="b" data-team-index="none" data-history="false">
		<div data-role="header">
			<h1>Game Log</h1>
		</div>
		<div role="main" class="ui-content">
			<pre id="game-log" class="ui-body ui-body-a">-</pre>
			<p>
			<a href="#" id="game-log-copy" class="ui-btn ui-corner-all">Select Log</a>
			<a href="#" class="ui-btn ui-corner-all" data-rel="back">Back</a>
			<small>Copy and paste the logfile with your device.</small></p>
		</div>
	</div>

	<div data-role="popup" id="confirm-exit-game" data-overlay-theme="b" data-theme="b" data-dismissible="false" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>New Game</h1>
		</div>

		<div role="main" class="ui-content">
			<p>Starting a new game will abandon the current game.<br />
			Scores and the game log will no longer be available.</p>

			<p><strong>Do you wish to start a new game?</strong></p>

			<p><a href="#" id="newgame-yes" class="ui-btn ui-btn-a ui-corner-all ui-icon-alert ui-btn-icon-left">Yes</a> <a href="#" id="newgame-no" class="ui-btn ui-corner-all ui-icon-back ui-btn-icon-left">No</a></p>
		</div>
	</div>

	<div data-role="popup" id="frame-smash" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Edit Frame</h1>
		</div>

		<div role="main" class="ui-content">
			<form id="frame-form">
				<input name="company-smash-index" id="company-smash-index" type="hidden">
				<input name="frame-smash-index" id="frame-smash-index" type="hidden">

				<h2 id="frame-smash-name">-</h2>

				<div class="sysbox">
					<p class="hide-if-compact-ui">Current Systems <small>(tap to remove)</small></p>
					<div id="frame-smash-systems"></div>
				</div>

				<div id="frame-smash-status">
					<p class="hide-if-compact-ui">Frame Status</p>
					<a href="#" id="frame-smash-activate" class="ui-btn ui-btn-a ui-corner-all ui-btn-inline">Activate</a>

					<div id="frame-smash-def-set">
						<label for="frame-smash-defense">Defense</label>
						<input name="frame-smash-defense" id="frame-smash-defense" value="0" min="0" max="6" type="range" />
					</div>

					<label for="frame-smash-spot">Spot</label>
					<input name="frame-smash-spot" id="frame-smash-spot" value="0" min="0" max="6" type="range" />
				</div>
			</form>

			<div id="frame-smash-adjust-submit">
				<button id="frame-smash-submit" class="ui-btn ui-btn-a ui-corner-all ui-btn-inline">Done</button>
				<button id="frame-smash-destroy" class="ui-btn ui-btn-a ui-corner-all ui-btn-inline">Destroy Frame</button>
				<div data-role="controlgroup" data-type="horizontal">
					<button id="frame-smash-sim1" class="ui-btn ui-corner-all">Simulate 1</button>
					<button id="frame-smash-sim2" class="ui-btn ui-corner-all">Simulate 2</button>
				</div>
			</div>
		</div>
	</div>

</div>
