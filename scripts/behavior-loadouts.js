$(document).on('pagecreate', '#loadouts', function(event){
	$(document).on('click', '#loadouts .loadout-graph', function(){
		mfzch.extractLoadoutFromTitle(this, '#lo-data');
		var load = mfzch.convertHtmlToLoadout('#lo-data');
		$('#loadout-frameinfo-name').html(load.name);
		$('#loadout-frameinfo-graph').html(load.createFrameGraph(false));

		$('#loadout-framegraph').popup('open');
	});


	$(document).on('click', '#loadouts .add-to-company', function(){
		$('#lo-company-list').html(mfzch.getCompanyListForLoadouts());

		if(mfzch.companies.length < MAXCOMPANIES) {
			$('#lo-company-list').append('<li data-icon="plus"><a href="#">Add New</a></li>')
		}
		$('#lo-company-list').listview('refresh');

		mfzch.extractLoadoutFromTitle(this, '#lo-data');

		$('#loadout-add-to-company').popup('open');
	});

	$(document).on('click', '#lo-company-list li', function(){
		var load = mfzch.convertHtmlToLoadout('#lo-data');

		var companyid = $(this).attr('data-id');
		if (typeof(companyid) !== 'undefined' && companyid !== false) {
			if (mfzch.companies[companyid].frames.length < MAXFRAMES) {
				load.name = uniqueName(load.name, buildNameArray(mfzch.companies[companyid].frames))
				mfzch.companies[companyid].frames.push(load);
				mfzch.saveData(mfzch.companies, 'mfz.companies');

				try {
					ga('send', 'event', 'Loadouts', 'Action', 'Add Frame', 0, false);
				} catch (err) {}

				$('#loadout-add-to-company').popup('close');
			}
		} else {
			var company = new companyModel;
			var companyDesc = mfzch.generateDescriptor();
			company.name = companyDesc[0];
			company.color = companyDesc[1];

			company.frames.push(load);
			mfzch.companies.push(company);
			mfzch.saveData(mfzch.companies, 'mfz.companies');

			try {
				ga('send', 'event', 'Loadouts', 'Action', 'Add Company', 0, false);
			} catch (err) {}

			$('#loadout-add-to-company').popup('close');
		}
	});

	// add loadout
	$(document).on('click', '#loadouts #loadout-add', function(){
		var load = new frameModel();

		var nameArray = [];
		for (var i in mfzch.loadouts) {
			nameArray.push(mfzch.loadouts[i].name);
		}

		load.name = uniqueName('Custom Loadout', nameArray);

		mfzch.loadouts.push(load);
		mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');

		mfzch.updateLoadoutList();

		var loadid = mfzch.loadouts.length-1;

		$('#loadout-index').val(loadid);
		$('#loadout-name').val(mfzch.loadouts[loadid].name);
		$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
		$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));

		$('#loadout-adjust').popup('open');
		try {
			ga('send', 'event', 'Loadouts', 'Action', 'Add Loadout', 0, false);
		} catch (err) {}
	});

	// delete loadout
	$(document).on('click', '#loadouts .load-del', function(){
		var loadid = $(this).parent().attr('data-load-id');

		mfzch.loadouts.splice(loadid, 1);
		mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');

		$('#loadouts-custom [data-load-id=' + loadid + ']').slideUp(function(){
			mfzch.updateLoadoutList();
		});
	});

	// manage loadout
	$(document).on('click', '#loadouts .load-manage', function(){
		var loadid = $(this).parent().attr('data-load-id');

		$('#loadout-index').val(loadid);
		$('#loadout-name').val(mfzch.loadouts[loadid].name);
		$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
		$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));
	});

	$(document).on('focus', '#loadout-name', function(){
		this.select();
	});

	// loadout add system
	$(document).on('click', '#loadouts a.add-sys', function(){
		var loadid = $('#loadout-index').val();

		mfzch.loadouts[loadid].addSystem($(this).attr('data-sys-type'));
		$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
		$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));
		mfzch.updateLoadoutList();
		mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');
	});

	// loadout reset systems
	$(document).on('click', '#loadouts a.reset-sys', function(){
		var loadid = $('#loadout-index').val();

		mfzch.loadouts[loadid] = new frameModel();
		var bork = $('#loadout-name').val();  // preserve name
		mfzch.loadouts[loadid].name = $('<div/>').text(bork).html();

		$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
		$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));
		mfzch.updateLoadoutList();
		mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');
	});

	// loadout remove system
	$(document).on('click', '#loadout-systems li', function(){
		var loadid = $('#loadout-index').val();

		mfzch.loadouts[loadid].removeSystem($(this).attr('data-sys'));

		$('#loadout-systems').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));
		$('#loadout-graph').html(mfzch.loadouts[loadid].createFrameGraph(false));
		mfzch.updateLoadoutList();
		mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');
	});

	// loadout update name
	$(document).on('change', '#loadout-name', function(){
		var loadid = $('#loadout-index').val();

		var bork = $('#loadout-name').val(); // sanitize
		mfzch.loadouts[loadid].name = $('<div/>').text(bork).html();

		mfzch.updateLoadoutList();
		mfzch.saveData(mfzch.loadouts, 'mfz.loadouts');
	});

	$(document).on('click', '#loadout-submit', function(){
		$('#loadout-adjust').popup('close');
	});

	$(document).on('click', '#loadout-graphtoggle', function(){
		$('#loadout-graph').slideToggle(function(){
			if ($('#loadout-graph:visible').length) {
				mfzch.settings.showLoadoutGraph = true;
			} else {
				mfzch.settings.showLoadoutGraph = false;
			}
			mfzch.saveData(mfzch.settings, 'mfz.settings');
		});
	});

	$(document).on('click', '#loadout-add-to-company-btn', function(){
		var loadid = $('#loadout-index').val();

		$('#lo-company-list').html(mfzch.getCompanyListForLoadouts());

		if(mfzch.companies.length < MAXCOMPANIES) {
			$('#lo-company-list').append('<li data-icon="plus"><a href="#">Add New</a></li>')
		}
		$('#lo-company-list').listview('refresh');

		$('#lo-data').attr('data-name', mfzch.loadouts[loadid].name);
		$('#lo-data').html(mfzch.loadouts[loadid].getSystemDisplay(false, false));

		$('#loadout-adjust').popup('option', 'afterclose', function(){
			$('#loadout-add-to-company').popup('open');
		});
		$('#loadout-adjust').popup('option', 'afteropen', function(){
			$('#loadout-adjust').popup('option', 'afterclose', '');
		});
		$('#loadout-adjust').popup('close');
	});
});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'loadouts') {
		mfzch.updateLoadoutList();

		if (mfzch.settings.showLoadoutGraph) {
			$('#loadout-graph').show();
		} else {
			$('#loadout-graph').hide();
		}
	}
});
