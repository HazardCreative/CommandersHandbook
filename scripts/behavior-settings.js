$(document).on('pagecreate', '#settings', function(event){
	$(document).on('change', '#settings-enablesplits', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.enableSplitSystems = true;
		} else {
			mfzch.settings.enableSplitSystems = false;
		}
		mfzch.saveData(mfzch.settings, 'mfz.settings');
	});

	/* *** */
	$(document).on('change', '#settings-enableenvironmental', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.enableEnvironmental = true;
		} else {
			mfzch.settings.enableEnvironmental = false;
		}
		mfzch.saveData(mfzch.settings, 'mfz.settings');
	});

	$(document).on('change', '#settings-compactui', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.compactUI = true;
			$('body').addClass('compact-ui');
		} else {
			mfzch.settings.compactUI = false;
			$('body').removeClass('compact-ui');
		}
		mfzch.saveData(mfzch.settings, 'mfz.settings');
	});

	$(document).on('change', 'input[name=settings-attackgraph]', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.altAttackGraphType = true;
		} else {
			mfzch.settings.altAttackGraphType = false;
		}
		mfzch.saveData(mfzch.settings, 'mfz.settings');
	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'settings') {
		if (mfzch.settings.enableSplitSystems) {
			$('#settings-enablesplits').val('on');
		} else {
			$('#settings-enablesplits').val('off');
		}
		$('#settings-enablesplits').slider('refresh');

		/* *** */
		if (mfzch.settings.enableEnvironmental) {
			$('#settings-enableenvironmental').val('on');
		} else {
			$('#settings-enableenvironmental').val('off');
		}
		$('#settings-enableenvironmental').slider('refresh');

		if (mfzch.settings.compactUI) {
			$('#settings-compactui').val('on');
		} else {
			$('#settings-compactui').val('off');
		}
		$('#settings-compactui').slider('refresh');

		if (mfzch.settings.altAttackGraphType) {
			$('#settings-attackgraph-2').prop('checked', true);
		} else {
			$('#settings-attackgraph-1').prop('checked', true);
		}
		$('input[name=settings-attackgraph]').checkboxradio('refresh');

		$('#settings-usage').empty();

		$('#settings-usage').append('<li>Games Played: '+ mfzch.settings.gamesPlayed + '</li>');
		$('#settings-usage').append('<li>Frames Destroyed: '+ mfzch.settings.framesDestroyed + '</li>');
		$('#settings-usage').append('<li>Systems Destroyed: '+ mfzch.settings.systemsDestroyed + '</li>');
	}
});