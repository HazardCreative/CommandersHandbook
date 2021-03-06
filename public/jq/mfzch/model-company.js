function companyModel() {
	this.uuid = generateUUID();
	this.dbid = false;
	this.name = 'Unnamed Company';
	this.description = '';
	this.shared = false;
	this.color = '#880000';
	this.frames = [];
	this.servermodified = false;
	this.clientmodified = true;
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
	findFrameByUUID: function(findUUID) {
		for (var i in this.frames) {
			if (this.frames[i].uuid == findUUID) {
				return this.frames[i];
			}
		}
		return false;
	},
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
};