function teamModel() { // simplified company model for gameplay
	this.uuid = generateUUID();
	this.name = 'Unnamed Team';
	this.color = '#880000';
	this.sSystems = 20;

	// generic
	this.gFrames = 5;
	this.gStations = 0;
	this.gPPA = 0;
	this.gScore = 0;

	// structured company
	this.cFrames = [];
}

teamModel.prototype = {
	totalSystems: function(){
		var numSystems = 0;
		for (var i in this.cFrames) {
			numSystems += this.cFrames[i].totalSystems();
		}
		return numSystems;
	},
	totalSSRs: function(){
		var numSystems = 0;
		for (var i in this.cFrames) {
			numSystems += this.cFrames[i].ssr;
		}
		return numSystems;
	},
	findFrameByUUID: function(findUUID) {
		for (var i in this.cFrames) {
			if (this.cFrames[i].uuid == findUUID) {
				return this.cFrames[i];
			}
		}
		return false;
	}
};
