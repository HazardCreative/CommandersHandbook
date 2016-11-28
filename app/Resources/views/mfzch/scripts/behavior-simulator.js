$(document).on('pagecreate', '#dice-roller', function(event){
	$(document).on('click', '#dice-roller .add-sys', function(){
		mfzch.frameSet[mfzch.frameNow].addSystem($(this).attr('data-sys-type'));
		mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
		mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
	});

	$(document).on('click', '#dice-roller .reset-sys', function(){
		mfzch.frameSet[mfzch.frameNow] = new frameModel();
		mfzch.frameSet[mfzch.frameNow].activeRange = $('#sys-range').val();
		mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
		mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
	});

	$(document).on('click', '#active-systems li', function(){
		mfzch.frameSet[mfzch.frameNow].removeSystem($(this).attr('data-sys'));
		mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
		mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
	});

	$(document).on('change', '#sys-range', function(){
		mfzch.frameSet[mfzch.frameNow].activeRange = $('#sys-range').val();
		mfzch.frameSet[mfzch.frameNow].rollResult = false;
		mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
		mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
	});

	$(document).on('click', '#dice-roller .roll-all', function(){
		mfzch.frameSet[mfzch.frameNow].rollAll();
		$('#active-dice').html(mfzch.frameSet[mfzch.frameNow].getRollDisplay());
		mfzch.saveData(mfzch.frameSet, 'mfz.diceSim');
		try {
			ga('send', 'event', 'Simulator', 'Action', 'Roll Frame', mfzch.frameNow, false);
		} catch (err) {}
	});

	$(document).on('change', '#die-frame', function(){
		if ($('#die-frame').val() == 'damage') {
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#damage-roller", { changeHash: false } );
		} else {
			var frame = parseInt($('#die-frame').val());
			mfzch.frameNow = frame;

			$('#sys-range').val(mfzch.frameSet[mfzch.frameNow].activeRange).selectmenu('refresh');
			mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
		}
	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'dice-roller') {
		$('#die-frame').val(mfzch.frameNow).selectmenu('refresh');
		$('#sys-range').val(mfzch.frameSet[mfzch.frameNow].activeRange);
		$('#sys-range').selectmenu('refresh');

		mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
	}
});

$(document).on('pagecreate', '#damage-roller', function(event){
	$(document).on('change', '#die-frame2', function(){
		if ($('#die-frame2').val() != 'damage') {
			var frame = parseInt($('#die-frame2').val());

			mfzch.frameNow = frame;

			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller", { changeHash: false } );
		}
	});

	$(document).on('swiperight', '#damage-form', function(ev){
		ev.stopPropagation();
	});

	$(document).on('click', '#dmg-roll', function(){
		var attack = parseInt($('#dmg-attack').val());
		var spot = parseInt($('#dmg-spot').val());
		var defense = parseInt($('#dmg-defense').val());
		var totaldice = attack + spot - defense;

		$('#dmg-potential').html(totaldice);
		if (totaldice) {
			var dmgrolls = [0,0,0,0,0,0,0];
			for (var i = 0; i < totaldice; i++) {
				var dmg = rollDie(6);
				dmgrolls[dmg]++;
			}
			$('#dmg-4s').html(dmgrolls[4]);
			$('#dmg-5s').html(dmgrolls[5]);
			$('#dmg-6s').html(dmgrolls[6]);
		} else {
			$('#dmg-4s').html('-');
			$('#dmg-5s').html('-');
			$('#dmg-6s').html('-');
		}

		try {
			ga('send', 'event', 'Simulator', 'Action', 'Roll Damage', 0, false);
		} catch (err) {}

	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'damage-roller') {
		$('#die-frame2').val("damage").selectmenu('refresh');
		mfzch.updateSystemDisplay(mfzch.frameSet[mfzch.frameNow]);
	}
});