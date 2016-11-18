<div data-role="page" id="damage-roller">
	<div data-role="header" data-position="fixed" data-tap-toggle="false">
		<h1>System Simulation</h1>
		<a href="#nav-panel" class="ui-btn-left ui-btn ui-corner-all ui-btn-icon-notext ui-icon-bars">Navigation</a>
	</div>

	<div role="main" class="ui-content">
		<div>
			<form>
				<label for="die-frame2" class="hide-if-compact-ui">Simulate</label>
				<select name="die-frame2" id="die-frame2">
					<option value="1">Frame 1</option>
					<option value="2">Frame 2</option>
					<option value="damage">Damage</option>
				</select>
			</form>
		</div>
		<div>
			<form id="damage-form">
				<label for="dmg-attack">Attack</label>
				<input name="dmg-attack" id="dmg-attack" value="1" min="1" max="8" type="range" />

				<label for="dmg-spot">Target&#8217;s Spot</label>
				<input name="dmg-spot" id="dmg-spot" value="0" min="0" max="6" type="range" />

				<label for="dmg-defense">Target&#8217;s Defense</label>
				<input name="dmg-defense" id="dmg-defense" value="0" min="0" max="6" type="range" />
			</form>
		</div>
		<div>
			<table>
				<thead>
					<tr>
						<th>Potential</th>
						<th>4s</th>
						<th>5s</th>
						<th>6s</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td id="dmg-potential">-</td>
						<td id="dmg-4s">-</td>
						<td id="dmg-5s">-</td>
						<td id="dmg-6s">-</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div>
			<a id="dmg-roll" class="ui-btn ui-btn-b ui-icon-action ui-btn-icon-left ui-corner-all">Run Simulation</a>
		</div>
	</div>
</div>
