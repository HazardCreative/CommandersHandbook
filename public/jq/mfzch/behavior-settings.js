$(document).on('pagecreate', '#settings', function(event){
	$(document).on('change', '#settings-enablesplits', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.enableSplitSystems = true;
		} else {
			mfzch.settings.enableSplitSystems = false;
		}
		mfzch.saveData('settings');
	});

	$(document).on('change', '#settings-enableenvironmental', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.enableEnvironmental = true;
		} else {
			mfzch.settings.enableEnvironmental = false;
		}
		mfzch.saveData('settings');
	});

	$(document).on('change', '#settings-compactui', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.compactUI = true;
			$('body').addClass('compact-ui');
		} else {
			mfzch.settings.compactUI = false;
			$('body').removeClass('compact-ui');
		}
		mfzch.saveData('settings');
	});

	$(document).on('change', '#settings-displayui', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.displayUI = true;
			$('body').addClass('display-ui');
		} else {
			mfzch.settings.displayUI = false;
			$('body').removeClass('display-ui');
		}
		mfzch.saveData('settings');
	});

	$(document).on('change', '#settings-activesync', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.activeSync = true;
			mfzch.syncServerData('all');
		} else {
			mfzch.settings.activeSync = false;
		}
		mfzch.saveData('settings');
	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'settings') {
		if (mfzch.settings.enableSplitSystems) {
			$('#settings-enablesplits').val('on');
		} else {
			$('#settings-enablesplits').val('off');
		}
		$('#settings-enablesplits').flipswitch('refresh');

		if (mfzch.settings.compactUI) {
			$('#settings-compactui').val('on');
		} else {
			$('#settings-compactui').val('off');
		}
		$('#settings-compactui').flipswitch('refresh');

		if (mfzch.settings.activeSync) {
			$('#settings-activesync').val('on');
		} else {
			$('#settings-activesync').val('off');
		}
		$('#settings-activesync').flipswitch('refresh');

		if (mfzch.settings.enableEnvironmental) {
			$('#settings-enableenvironmental').val('on');
		} else {
			$('#settings-enableenvironmental').val('off');
		}
		$('#settings-enableenvironmental').flipswitch('refresh');
	}
});