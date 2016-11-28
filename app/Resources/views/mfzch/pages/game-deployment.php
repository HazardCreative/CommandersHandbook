<div data-role="page" id="game-deployment" data-history="false">
	<div data-role="header" data-position="fixed" data-tap-toggle="false">
		<h1>Deployment</h1>
		<a href="#team_setup" id="game-deployment-back" class="ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-back">Cancel</a>
	</div>

	<div role="main" class="ui-content">
		<p>Complete the deployment phase.</p>

		<ul id="deploy-allteams">
			<li>-</li>
		</ul>

		<p><small>Note: Initiative ties have been randomly decided.</small></p>

		<p><a href="#" class="ui-btn ui-btn-b ui-corner-all ui-icon-carat-r ui-btn-icon-right play-combat-phase">Play Combat Phase</a></p>

		<div data-role="collapsible-set" data-expanded-icon="carat-d" data-collapsed-icon="carat-r">
			<div data-role="collapsible">
				<h3>Battlefield Setup</h3>
				<p>Place cover and terrain on the field. Any player can adjust the battlefield layout until everyone is satisfied.</p>
			</div>
			<div data-role="collapsible">
				<h3>Defender</h3>
				<p><strong class="deploy-defender">-</strong>: you are the defender. <strong>Place all of your stations</strong>, each within 1 ruler of at least one other. Everything within 1 ruler around these stations is the defensive perimeter. <strong>Place two frames</strong> within this defensive perimeter.</p>
			</div>
			<div data-role="collapsible">
				<h3>Point Frame</h3>
				<p><strong class="deploy-point">-</strong>: <strong>Place the point frame.</strong> This frame is placed:</p>
				<ul>
					<li>Out of cover</li>
					<li>Outside the defensive perimeter</li>
					<li>At exactly 1 ruler length of one of the defender&#8217;s frames, in range for direct-fire</li>
				</ul>
			</div>
			<div data-role="collapsible">
				<h3>Attackers&#8217; Frames</h3>
				<p><strong>Place remaining frames.</strong> All offensive players alternate, descending by score, frame for frame, until all frames are on the field. Frames are placed:</p>
				<ul>
					<li>Outside the defensive perimeter</li>
					<li>Outside direct fire range of any of the Defender&#8217;s frames</li>
					<li>Otherwise unrestricted</li>
				</ul>
				<div class="multiple-offense">
					<p>Place in the following order.</p>
					<ol class="deploy-attackers">
						<li>-</li>
					</ol>
				</div>
			</div>
			<div data-role="collapsible">
				<h3>Attackers&#8217; Stations</h3>
				<p>All attackers: <strong>place your stations</strong>. Alternate again, descending by score. There are no restrictions on location.</p>
				<div class="multiple-offense">
					<p>Place in the following order.</p>
					<ol class="deploy-attackers">
						<li>-</li>
					</ol>
				</div>
			</div>
			<div data-role="collapsible">
				<h3>Defender&#8217;s other frames.</h3>
				<p><strong class="deploy-defender">-</strong>: <strong>Place your remaining frames.</strong> Frames placed outside the perimeter must be in cover.</p>
			</div>
		</div>

		<p><a href="#" class="ui-btn ui-btn-b ui-corner-all ui-icon-carat-r ui-btn-icon-right play-combat-phase">Play Combat Phase</a></p>
	</div>
</div>
