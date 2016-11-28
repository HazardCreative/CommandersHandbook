<div data-role="page" id="company-analysis">
	<div data-role="header" data-position="fixed" data-tap-toggle="false">
		<h1>Structured Units</h1>
		<a href="#nav-panel" class="ui-btn-left ui-btn ui-corner-all ui-btn-icon-notext ui-icon-bars">Navigation</a>
	</div>

	<div role="main" class="ui-content">
		<form>
			<div class="ui-field-contain">
				<label for="settings-showunitgraphs">Show Graphs:</label>
				<select name="settings-showunitgraphs" id="settings-showunitgraphs" data-role="slider">
					<option value="off">Off</option>
					<option value="on">On</option>
				</select>
			</div>
		</form>
		<ul id="company-list">
			<li>Your device does not support this application or an error has occurred.</li>
		</ul>
	</div>

	<div data-role="popup" id="company-adjust" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Edit Company</h1>
		</div>

		<div role="main" class="ui-content">
			<form id="company-form">
				<input name="company-index" id="company-index" type="hidden">

				<div id="company-adjust-info">
					<label for="company-name" class="hide-if-compact-ui">Company Name:</label>
					<input name="company-name" id="company-name" type="text" />

					<label for="company-color" class="hide-if-compact-ui">Color</label>
					<input name="company-color" id="company-color" type="color" />
				</div>
			</form>

			<div id="company-notice" class="ui-body ui-body-c ui-corner-all">-</div>

			<div id="company-adjust-submit">
				<button id="company-submit" class="ui-btn ui-corner-all ui-btn-inline">Back</button>
				<button id="company-regen" class="ui-btn ui-corner-all ui-btn-inline">Generate</button>
				<button id="company-track-assets" class="ui-btn ui-corner-all ui-btn-inline">Add to Asset Tracker</button>
				<button id="company-duplicate" class="ui-btn ui-corner-all ui-btn-inline">Duplicate</button>
			</div>
		</div>
	</div>

	<div data-role="popup" id="frame-adjust" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Edit Frame</h1>
		</div>

		<div role="main" class="ui-content">
			<form id="frame-adjust-form">
				<input name="company-index" id="company-index" type="hidden">
				<input name="frame-index" id="frame-index" type="hidden">

				<div id="frame-adjust-info">
					<label for="frame-name" class="hide-if-compact-ui">Frame Name:</label>
					<input name="frame-name" id="frame-name" type="text" />
				</div>

				<div class="addbox">
					<p class="hide-if-compact-ui"> Add Systems </p>
					<p class="shrink-if-compact-ui"><a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="w">W</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="rh">Rh</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="rd">Rd</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="ra">Ra</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="b">B</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="y">Y</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="g">G</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="ssr">SSR</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="rhd" data-sys-split="true">Rh/d</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="rha" data-sys-split="true">Rh/a</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="rda" data-sys-split="true">Rd/a</a>
						<a href="#" class="add-sys ui-btn ui-btn-inline ui-corner-all" data-sys-type="e" data-sys-env="true">E</a>
						<a href="#" class="reset-sys ui-btn ui-btn-a ui-btn-inline ui-corner-all">Reset</a></p>
				</div>
				<div class="sysbox">
					<p class="hide-if-compact-ui">Current Systems <small>(tap to remove)</small></p>
					<div id="frame-systems"></div>
				</div>
			</form>

			<div id="frame-adjust-submit">
				<button id="frame-submit" class="ui-btn ui-btn-a ui-corner-all ui-btn-inline">Done</button>
				<button id="frame-graphtoggle" class="ui-btn ui-corner-all ui-btn-inline">Toggle Graph</button>
				<div data-role="controlgroup" data-type="horizontal" class="ui-btn-inline">
					<button id="frame-sim1" class="ui-btn ui-corner-all ui-btn-inline">Simulate 1</button>
					<button id="frame-sim2" class="ui-btn ui-corner-all ui-btn-inline">Simulate 2</button>
				</div>
			</div>

			<div id="frame-graph" class="ui-body ui-body-a ui-corner-all"></div>
		</div>
	</div>

	<div data-role="popup" id="company-track-gameinprogress" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Game In Progress</h1>
		</div>

		<div role="main" class="ui-content">
			<p>Companies cannot be added to the Asset Tracker while there is a game in progress. You must end the current game before adding companies.</p>

			<p>Starting a new game will abandon the current game. Scores and the game log will no longer be available.</p>

			<p><a href="#" data-rel="back" class="ui-btn ui-corner-all">Back</a> <a href="#" id="company-end-game" class="ui-btn ui-btn-a ui-corner-all ui-btn-icon-left ui-icon-alert">End Game</a></p>
		</div>
	</div>

	<div data-role="popup" id="company-track-teamsfull" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Game Full</h1>
		</div>

		<div role="main" class="ui-content">
			<p>This company cannot be added to the Asset Tracker because the Asset Tracker is full. You must remove a company from the Asset Tracker before adding another.</p>

			<ul id="company-full-list" data-role="listview" data-inset="true"><li>-</li></ul>

			<p><a href="#" data-rel="back" class="ui-btn ui-corner-all">Back</a> <a href="#" id="company-full-add" class="ui-btn ui-btn-a ui-corner-all">Add Company</a></p>
		</div>
	</div>

	<div data-role="popup" id="company-track-added" data-overlay-theme="b" data-theme="b" data-transition="pop" data-history="false">
		<div data-role="header">
			<h1>Company Added</h1>
		</div>

		<div role="main" class="ui-content">
			<p>A copy of this company has been added to the Asset Tracker.</p>

			<p><a href="#" data-rel="back" class="ui-btn ui-corner-all">Back</a></p>
		</div>
	</div>
</div>
