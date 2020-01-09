function appStateModel() {
	this.user = null;
	this.isOnline = false;
	this.isElite = false;
	this.eliteExpires = 0;
	this.eliteExpiresFormatted = null;

	this.remote = {
		refresh: 8000,
		mode: false,
		connection: false,
		id: false,
		password: false,
		granted: false
	};
};
