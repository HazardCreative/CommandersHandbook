function frameModel() {
	this.uuid = generateUUID();
	this.name = "Unnamed Frame";
	this.description = "";
	this.icon = 'frame';
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
		return n = this.rh + this.rd + this.ra + this.b + this.y + this.g + this.rhd + this.rha + this.rda + this.e;
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
		for (var i = 0; i < this.e; i++) {
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
	getSystemText: function() {
		var sysDisplay = '';

		for (var i = 0; i < this.rh; i++) {
			sysDisplay += ' Rh';
		}
		for (var i = 0; i < this.rd; i++) {
			sysDisplay += ' Rd';
		}
		for (var i = 0; i < this.ra; i++) {
			sysDisplay += ' Ra';
		}
		for (var i = 0; i < this.rhd; i++) {
			sysDisplay += ' Rhd';
		}
		for (var i = 0; i < this.rha; i++) {
			sysDisplay += ' Rha';
		}
		for (var i = 0; i < this.rda; i++) {
			sysDisplay += ' Rda';
		}
		for (var i = 0; i < this.y; i++) {
			sysDisplay += ' Y';
		}
		for (var i = 0; i < this.b; i++) {
			sysDisplay += ' B';
		}
		for (var i = 0; i < this.g; i++) {
			sysDisplay += ' G';
		}
		for (var i = 0; i < this.e; i++) {
			sysDisplay += ' E';
		}
		for (var i = 0; i < this.ssr; i++) {
			sysDisplay += ' SSR';
		}

		return sysDisplay.trim();
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

/* *** efficiency (needs to change with active range?) */
/*
		// efficiency
		frameStat.eff = [];
		frameStat.eff.label = '<span data-sys="d">Ef</span>';
		frameStat.eff.hexcolor = '#f2f2f2';
		frameStat.eff.multiplier = 1;
		frameStat.eff.max = 18.7;

//		frameStat.eff.mean = Math.max(
//			(frameStat.rh.mean / frameStat.rh.multiplier),
//			(frameStat.rd.mean / frameStat.rd.multiplier),
//			(frameStat.ra.mean / frameStat.ra.multiplier))
//			+ frameStat.y.mean
//			+ frameStat.b.mean
//			+ frameStat.g.mean;

//		frameStat.eff.meanw1 = 0;
//		frameStat.eff.meanw2 = 0;

		frameStat.eff.mean = (frameStat.rh.mean / frameStat.rh.multiplier)
			+ frameStat.y.mean
			+ frameStat.b.mean
			+ frameStat.g.mean;

		frameStat.eff.meanw1 = (frameStat.rd.mean / frameStat.rd.multiplier)
			+ frameStat.y.mean
			+ frameStat.b.mean
			+ frameStat.g.mean;

		frameStat.eff.meanw2 = (frameStat.ra.mean / frameStat.ra.multiplier)
			+ frameStat.y.mean
			+ frameStat.b.mean
			+ frameStat.g.mean;
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
};