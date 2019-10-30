function appStateModel() {
	this.isElite = false;
	this.eliteExpires = 0;
	this.remote = {
		refresh: 8000,
		mode: false,
		connection: false,
		id: false,
		password: false,
		granted: false
	};
};
