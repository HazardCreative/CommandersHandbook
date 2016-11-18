<div data-role="page" id="graph-key-c">
	<div data-role="header" data-add-back-btn="true" data-position="fixed" data-tap-toggle="false">
		<h1>Company Graph Key</h1>
	</div>

	<div role="main" class="ui-content">
		<p>The company graph provides a quick overview of a company&#8217;s expected performance. This is a mathematic overview only. While useful for comparing companies at a high level, individual performance depends on field position and dice rolling for both this and other companies. It also does not take into account other special benefits of systems and environmental factors such how cover affects attack power, spotting at different ranges, or the ability to move through cover.</p>

		<h2>Example Graph</h2>
		<p>This example graph shows a company with five &#8220;soldier&#8221; loadouts.</p>

		<table class="companygraph"><thead><tr><th class="stat-type"><span class="type-label">Type</span><a href="#graph-key">?</a></th><th class="stat-graph">Graph</th><th class="stat-std">Sys</th><th class="stat-white2">+W</th></tr></thead><tbody><tr><td class="stat-type"><span data-sys="rh">Rh</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:75%; background:#E03B2C"></span><span class="graphbar graphbar-sys" style="width:0%; background:#E03B2C"></span></td><td class="stat-std">0.00</td><td class="stat-white2">11.2</td></tr><tr><td class="stat-type"><span data-sys="rd">Rd</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:59%; background:#E03B2C"></span><span class="graphbar graphbar-sys" style="width:50%; background:#E03B2C"></span></td><td class="stat-std">7.45</td><td class="stat-white2">8.73</td></tr><tr><td class="stat-type"><span data-sys="ra">Ra</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:0%; background:#E03B2C"></span><span class="graphbar graphbar-sys" style="width:0%; background:#E03B2C"></span></td><td class="stat-std">0.00</td><td class="stat-white2">0.00</td></tr><tr><td class="stat-type"><span data-sys="y">Y</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:95%; background:#D3C250"></span><span class="graphbar graphbar-sys" style="width:67%; background:#D3C250"></span></td><td class="stat-std">17.5</td><td class="stat-white2">24.8</td></tr><tr><td class="stat-type"><span data-sys="b">B</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:95%; background:#0D4572"></span><span class="graphbar graphbar-sys" style="width:67%; background:#0D4572"></span></td><td class="stat-std">17.5</td><td class="stat-white2">24.8</td></tr><tr><td class="stat-type"><span data-sys="g">G</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:83%; background:#205A2E"></span><span class="graphbar graphbar-sys" style="width:59%; background:#205A2E"></span></td><td class="stat-std">17.5</td><td class="stat-white2">24.8</td></tr><tr><td class="stat-type"><span data-sys="d">D</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:91%; background:#f2f2f2"></span><span class="graphbar graphbar-sys" style="width:64%; background:#f2f2f2"></span></td><td class="stat-std">18.1</td><td class="stat-white2">25.7</td></tr></tbody></table>

		<table class="ref-table">
			<thead>
				<tr>
					<th>Item</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><strong>Graph</strong></td>
					<td><strong>Percentage Graph</strong><br />
						A solid bar shows the <strong>Sys</strong> value, while a lighter and thinner bar displays the <strong>+W</strong> value. The right side, 100%, is the maximum possible for a company with the same number of frames.</td>
				</tr>
				<tr>
					<td><strong>Sys, +W</strong></td>
					<td><strong>Numeric values</strong><br />
						The <strong>Sys</strong> value shows the capability of the company without devoting any of its white dice to that item. <strong>+W</strong> shows how the company&#8217;s capability expands if all white dice are allocated to that item.</td>
				</tr>
				<tr>
					<td><span class="loadout load-table"><span data-sys="rh">Rh</span><span data-sys="rd">Rd</span><span data-sys="ra">Ra</span></span></td>
					<td><strong>Attack effectiveness</strong><br />
						Higher values show a greater capability to cause damage at each range; hand-to-hand, direct fire, and artillery. Specifically, the numeric value is the expected number of systems of damage caused to a company of frames, each with an effective defense of zero and not in cover.<br/>
						Normally the graph bar displays total damage output. Hand-to-hand enjoys a significant advantage when calculating damage, so the direct-fire and artillery graphs cannot reach 100%. Changing the graph type to "range-independent" in the preferences adjusts the graph so that 100% becomes the maximum possible for each range. "Range Independent" mode makes it impossible to use the graph to compare damage output between ranges, but easier to compare against the full potential for each range individually.</td>
				</tr>
				<tr>
					<td><span class="loadout load-table"><span data-sys="y">Y</span><span data-sys="b">B</span><span data-sys="g">G</span></span></td>
					<td><strong>Support effectiveness</strong><br />
						Higher values show greater capability to perform support roles of spotting, defense, and movement. The numeric value here is exactly the total of all mean rolls (expected values) for the company.</td>
				</tr>
				<tr>
					<td><span class="loadout inline"><span data-sys="d">D</span></td>
					<td><strong>Durability</strong><br />
						A higher value shows the company is more resistant to damage. It is a combination of both defensive capability and total number of systems. The numeric value is the expected number of typical attacks (<span class="loadout inline"><span data-sys="w">W</span><span data-sys="rd">Rd</span></span> + <span class="loadout inline"><span data-sys="y">Y</span></span>) which the company can survive against.</td>
				</tr>
			</tbody>
		</table>

		<div class="ref-note"><p>Note: Many frame loadouts contribute to the attack potential of more than one range, but cannot use both in a given turn. Companies with higher numbers of frames that may attack at multiple ranges may appear overall stonger than those which do not.</p></div>
	</div>
</div>