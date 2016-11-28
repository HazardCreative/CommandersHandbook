<div data-role="page" id="graph-key">
	<div data-role="header" data-add-back-btn="true" data-position="fixed" data-tap-toggle="false">
		<h1>Frame Graph Key</h1>
	</div>

	<div role="main" class="ui-content">
		<p>The frame graph provides a quick overview of a frame&#8217;s expected performance. This is a mathematic overview only. While useful for comparing frames at a high level, individual performance depends on field position and dice rolling for both attack and defense of this and other frames. It also does not take into account other special benefits of systems and environmental factors such how cover affects attack power, spotting at different ranges, or the ability to move through cover.</p>

		<h2>Example Graph</h2>
		<p>This example graph shows a typical &#8220;soldier&#8221; loadout: <span class="loadout inline"><span data-sys="rd">Rd</span><span data-sys="y">Y</span><span data-sys="b">B</span><span data-sys="g">G</span></span></p>

		<table class="framegraph"><thead><tr><th class="stat-type"></th><th class="stat-graph">Graph</th><th class="stat-std">Sys</th><th class="stat-white1">+1W</th><th class="stat-white2">+2W</th></tr></thead><tbody><tr><td class="stat-type"><span data-sys="rh">Rh</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:75%; background:#E03B2C"></span><span class="graphbar graphbar-1w" style="width:59%; background:#E03B2C"></span><span class="graphbar graphbar-sys" style="width:0%; background:#E03B2C"></span></td><td class="stat-std">0.00</td><td class="stat-white1">1.75</td><td class="stat-white2">2.23</td></tr><tr><td class="stat-type"><span data-sys="rd">Rd</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:59%; background:#E03B2C"></span><span class="graphbar graphbar-1w" style="width:55%; background:#E03B2C"></span><span class="graphbar graphbar-sys" style="width:50%; background:#E03B2C"></span></td><td class="stat-std">1.49</td><td class="stat-white1">1.65</td><td class="stat-white2">1.75</td></tr><tr><td class="stat-type"><span data-sys="ra">Ra</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-sys" style="width:0%; background:#E03B2C"></span></td><td class="stat-std">-</td><td class="stat-white1">-</td><td class="stat-white2">-</td></tr><tr><td class="stat-type"><span data-sys="y">Y</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:95%; background:#D3C250"></span><span class="graphbar graphbar-1w" style="width:85%; background:#D3C250"></span><span class="graphbar graphbar-sys" style="width:67%; background:#D3C250"></span></td><td class="stat-std">3.50</td><td class="stat-white1">4.47</td><td class="stat-white2">4.96</td></tr><tr><td class="stat-type"><span data-sys="b">B</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:95%; background:#0D4572"></span><span class="graphbar graphbar-1w" style="width:85%; background:#0D4572"></span><span class="graphbar graphbar-sys" style="width:67%; background:#0D4572"></span></td><td class="stat-std">3.50</td><td class="stat-white1">4.47</td><td class="stat-white2">4.96</td></tr><tr><td class="stat-type"><span data-sys="g">G</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:83%; background:#205A2E"></span><span class="graphbar graphbar-1w" style="width:75%; background:#205A2E"></span><span class="graphbar graphbar-sys" style="width:59%; background:#205A2E"></span></td><td class="stat-std">3.50</td><td class="stat-white1">4.47</td><td class="stat-white2">4.96</td></tr><tr><td class="stat-type"><span data-sys="d">D</span></td><td class="stat-graph graph-container"><span class="graphbar graphbar-2w" style="width:91%; background:#f2f2f2"></span><span class="graphbar graphbar-1w" style="width:80%; background:#f2f2f2"></span><span class="graphbar graphbar-sys" style="width:64%; background:#f2f2f2"></span></td><td class="stat-std">3.63</td><td class="stat-white1">4.51</td><td class="stat-white2">5.14</td></tr></tbody></table>

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
						A solid bar shows the <strong>Sys</strong> value, while lighter and thinner bars display the values of <strong>+1W</strong> and <strong>+2W</strong>. The right side, 100%, is defined at the maximum possible for a legal loadout.</td>
				</tr>
				<tr>
					<td><strong>Sys, +1W, +2W</strong></td>
					<td><strong>Numeric values</strong><br />
						The <strong>Sys</strong> value shows the capability of the frame without devoting any of its white dice to that item. <strong>+1W</strong> and <strong>+2W</strong> show how the frame&#8217;s capability expands if one or both white dice are allocated to that item. If this shows &#8220;-&#8221;, the frame is incapable of allocating dice in that way.</td>
				</tr>
				<tr>
					<td><span class="loadout load-table"><span data-sys="rh">Rh</span><span data-sys="rd">Rd</span><span data-sys="ra">Ra</span></span></td>
					<td><strong>Attack effectiveness</strong><br />
						Higher values show a greater capability to cause damage at each range; hand-to-hand, direct fire, and artillery. Specifically, the numeric value is the expected number of systems of damage caused to a frame with an effective defense of zero and is not in cover.<br/>
						Normally the graph bar displays total damage output. Hand-to-hand enjoys a significant advantage when calculating damage, so the direct-fire and artillery graphs cannot reach 100%. Changing the graph type to "range-independent" in the preferences adjusts the graph so that 100% becomes the maximum possible for each range. "Range Independent" mode makes it impossible to use the graph to compare damage output between ranges, but easier to compare against the full potential for each range individually.</td>
				</tr>
				<tr>
					<td><span class="loadout load-table"><span data-sys="y">Y</span><span data-sys="b">B</span><span data-sys="g">G</span></span></td>
					<td><strong>Support effectiveness</strong><br />
						Higher values show greater capability to perform support roles of spotting, defense, and movement. The numeric value is exactly the mean roll (expected value) for the stat.</td>
				</tr>
				<tr>
					<td><span class="loadout inline"><span data-sys="d">D</span></td>
					<td><strong>Durability</strong><br />
						A higher value shows the frame is more resistant to damage. It is a combination of both the frame&#8217;s defensive capability and its total number of systems. The numeric value is the expected number of typical attacks (<span class="loadout inline"><span data-sys="w">W</span><span data-sys="rd">Rd</span></span> + <span class="loadout inline"><span data-sys="y">Y</span></span>) which this frame can survive against.</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
