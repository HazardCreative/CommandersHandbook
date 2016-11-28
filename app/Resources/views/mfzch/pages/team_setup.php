<div data-role="page" id="team_setup">

	<div data-role="header" data-position="fixed" data-tap-toggle="false">
		<h1>Asset Tracking</h1>
		<a href="#nav-panel" class="ui-btn-left ui-btn ui-corner-all ui-btn-icon-notext ui-icon-bars">Navigation</a>
	</div>

	<div role="main" class="ui-content">
		<ul data-role="listview" data-split-icon="delete" data-inset="true" id="teams">
			<li>Your device does not support this application or an error has occurred.</li>
		</ul>

		<ul id="game-params" data-role="listview" data-inset="true" class="ui-corner-all">
			<li data-role="list-divider"><h3>New Game Setup</h3></li>

			<li class="ui-field-contain" id="game-type">
				<label for="game-type-switch" class="hide-if-compact-ui">Game Type:</label>
				<select name="game-type-switch" id="game-type-switch">
					<option value="Battle">Battle</option>
					<option value="Skirmish">Skirmish</option>
					<option value="Demo/Free">Free Play (Demo)</option>
				</select>
				<div class="game-params-info">Frames: <strong><span class="min_frames">-</span>&#8211;<span class="max_frames">-</span></strong>; Stations: <strong class="stations_per_player">-</strong></div>
			</li>
			<li><label for="game-tracking-level" class="hide-if-compact-ui">Tracking Level: <a href="#tracking-level-info" data-rel="popup" class="item-help">?</a></label>
				<select name="game-tracking-level" id="game-tracking-level">
					<option value="10">Asset</option>
					<option value="20">System</option>
					<option value="30">Activation</option>
				</select>
			</li>
		</ul>
	</div>

	<div data-role="popup" id="team-adjust" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Edit Company</h1>
		</div>

		<div role="main" class="ui-content">
			<form id="team-adjust-form">
				<input name="team-index" id="team-index" type="hidden">

				<div id="team-adjust-info">
					<label for="team-name" class="hide-if-compact-ui">Company Name:</label>
					<input name="team-name" id="team-name" type="text" />

					<label for="team-color" class="hide-if-compact-ui">Color</label>
					<input name="team-color" id="team-color" type="color" />
				</div>

				<div id="team-adjust-data">
					<label for="team-frames">Frames:</label>
					<input name="team-frames" id="team-frames" value="5" min="1" max="8" type="range" />

					<label for="team-systems">Systems:</label>
					<input name="team-systems" id="team-systems" value="20" min="0" max="32" type="range" />
				</div>
			</form>

			<div id="team-adjust-submit">
				<p id="team-adjust-profiled" class="ui-body ui-body-a ui-corner-all">This company was imported from a Structured Unit. Modifying its frame/system composition here will discard the structure, forcing the tracking level to Asset only. (Modfying the name/color will not.) To modify and retain the structure, make changes within the Structured Unit section and re-import.</p>

				<button id="team-submit" class="ui-btn ui-btn-a ui-corner-all ui-btn-inline">Save</button>
				<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-inline">Back</a>
				<button id="team-regen" class="ui-btn ui-corner-all ui-btn-inline">Generate</button>
			</div>
		</div>
	</div>

	<div data-role="popup" id="setup_framecount" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Setup Issue</h1>
		</div>

		<div role="main" class="ui-content">
			<h2>Number of Frames</h2>

			<p><strong class="param_longtext">[error]</strong></p>

			<p>You must adjust your companies or change game type to continue.</p>

			<p><a href="#" class="ui-btn ui-corner-all" id="setup-framecount-back">Back</a></p>
		</div>
	</div>

	<div data-role="popup" id="setup_tie" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Setup Issue</h1>
		</div>

		<div role="main" class="ui-content">
			<h2>Tied for Defense</h2>

			<p>The following companies are tied for highest starting score:</p>
			<ul id="def-tie-list">
				<li>-</li>
			</ul>

			<p><strong class="team-dupe-winner">[error]</strong>: being selected by random draw to resolve the tie, you must now choose to either:</p>
			<ul>
				<li>Add a frame to your company (if possible)</li>
				<li>Remove a frame from your company (if possible)</li>
				<li>Defer to the next lower player on the list</li>
			</ul>
			<p>Players must stay within the normal minimum and maximum number of frames, which may limit the available options.</p>

			<p>The company list has been re-ordered by initaitive.</p>

			<p><a href="#" class="ui-btn ui-corner-all" id="setup-tie-back">Back</a></p>
		</div>
	</div>

	<div data-role="popup" id="game-parameters" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Custom Game Parameters</h1>
		</div>

		<div role="main" class="ui-content">
			<p>You have selected to play a <strong>Free/Demo</strong> game, which does not follow all of the standard rules for MFZ:RA. Enter your custom game parameters here. You will not be guided through deployment.</p>
			<form id="team-form">
				<label for="gp-doomsday">Doomsday</label>
				<input name="gp-doomsday" id="gp-doomsday" value="5" min="0" max="20" type="range" />

				<label for="gp-stationsPerPlayer">Stations per Company</label>
				<input name="gp-stationsPerPlayer" id="gp-stationsPerPlayer" value="0" min="0" max="9" type="range" />

				<label for="gp-unclaimedStations">Unclaimed Stations</label>
				<input name="gp-unclaimedStations" id="gp-unclaimedStations" value="1" min="0" max="9" type="range" />
			</form>

			<div>
				<a id="gp-submit" class="ui-btn ui-btn-a ui-corner-all ui-btn-inline">Start Game</a>
				<a id="gp-cancel" class="ui-btn ui-corner-all ui-btn-inline">Cancel</a>
			</div>
		</div>
	</div>

	<div data-role="popup" id="tracking-level-info" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Tracking Level</h1>
		</div>

		<div role="main" class="ui-content">
			<p>Tracking Level adjusts the amount of information recorded and used by the asset tracker.</p>

			<ul>
				<li>
					<p><strong>Asset</strong> level keeps track of doomsday, round number, and the number of frames and stations which each company controls. You only need to provide the number of frames and systems for each company.</p>
				</li>
				<li>
					<p><strong>System</strong> level adds named frames and individual tracking of frame systems. To use this level or above, you will need to import companies via the Strucutred Unit section.</p>
				</li>
				<li>
					<p><strong>Activation</strong> level adds whether or not a frame has activated, spot values, and defense values.</p>
				</li>
			</ul>
			<p>If any company is not a &#8220;Structured Unit,&#8221; only <strong>Asset</strong> tracking will be available.</p>
		</div>
	</div>
</div>
