function supportsLocalStorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch(e){
		return false;
	}
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function pad(num, size) {
	var s = "000000000" + num;
	return s.substr(s.length-size);
}

function timeStamp(now) {
	if(typeof(datetime)==='undefined') now = new Date();
	var date = [ now.getFullYear(), now.getMonth() + 1, now.getDate() ];
	var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
	return date[0] + '-' + pad(date[1],2) + '-' + pad(date[2],2) + ' ' + pad(time[0],2) + ':' + pad(time[1],2) + ':' + pad(time[2],2);
}

function getDuration(then, now) {
	if(typeof(then)==='undefined')
		return false;
	if(typeof(datetime)==='undefined')
		now = new Date();

	var then_ms = then.getTime();
	var now_ms = now.getTime();

	var duration = now_ms - then_ms;

	var output = new Object();
	output['raw'] = duration;
	var temp = duration/1000;
	output['rawseconds'] = temp;
	output['seconds'] = Math.floor(temp%60);
	var temp = temp/60;
	output['minutes'] = Math.floor(temp%60);
	var temp = temp/60;
	output['hours'] = Math.floor(temp%24);
	output['days'] = Math.floor(temp/24);

	return output;
}

function selectText(element) {
	var doc = document
		, text = doc.getElementById(element)
		, range, selection
	;
	if (doc.body.createTextRange) { //ms
		range = doc.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	} else if (window.getSelection) { //all others
		selection = window.getSelection();
		range = doc.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}

function rollDie(size) {
	if(typeof(size)==='undefined') size = 6;
	return roll = Math.floor(Math.random() * size)+1;
}

function uniqueName(desiredName, otherNames) {
	if (otherNames.indexOf(desiredName) > -1) {
		var newName = desiredName;
		var matches = desiredName.match('^(.*) ([0-9]*)$');
		if (matches) {
			var nextInt = parseInt(matches[2]);
			nextInt++;
			newName = matches[1] + ' ' + nextInt;
		} else {
			newName = desiredName + " 2";
		}
		newName = uniqueName(newName, otherNames);
		return newName;
	} else {
		return desiredName;
	}
}

function buildNameArray(targetArray, nameProperty) {
	if(typeof(nameProperty)==='undefined') nameProperty = 'name';
	var nameArray = [];
	for (var i in targetArray) {
		nameArray.push(targetArray[i][nameProperty]);
	}
	return nameArray;
}
