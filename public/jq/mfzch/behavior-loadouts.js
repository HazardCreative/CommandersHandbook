$(document).on('pagecreate', '#loadouts', function(event){
	mfzch.buildPresetLoadouts();

	$(document).on('click', '#loadouts .loadout-graph', function(){
		mfzch.extractLoadoutFromTitle(this, '#lo-data');
		var load = mfzch.convertHtmlToLoadout('#lo-data');
		$('#loadout-frameinfo-name').html(load.name);
		$('#loadout-frameinfo-graph').html(load.createFrameGraph(false));

		$('#loadout-framegraph').popup('open');
	});

	// add (generic loadout) to company
	$(document).on('click', '#loadouts .add-to-company', function(){
		$('#lo-company-list').html(mfzch.getShortCompanyList());

		if(mfzch.companies.length < MAXCOMPANIES) {
			$('#lo-company-list').append('<li data-icon="plus"><a href="#">Add New</a></li>')
		}
		$('#lo-company-list').listview('refresh');

		mfzch.extractLoadoutFromTitle(this, '#lo-data');

		$('#loadout-add-to-company').popup('open');
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
		mfzch.saveData('loadouts');

		mfzch.updateLoadoutList();

		var loadid = load.uuid;

		$('#loadout-id').val(loadid);
		$('#loadout-name').val(load.name);
		$('#loadout-systems').html(load.getSystemDisplay(false, false));
		$('#loadout-graph').html(load.createFrameGraph(false));

		$('#loadout-adjust').popup('open');
		try {
			ga('send', 'event', 'Loadouts', 'Action', 'Add Loadout', 0, false);
		} catch (err) {}
	});

	// delete loadout
	$(document).on('click', '#loadouts .load-del', function(){
		var loadid = $(this).parent().attr('data-load-id');
		var load = findObjectByUUID(loadid, mfzch.loadouts);

		if (load) {
			var index = mfzch.loadouts.indexOf(load);

			if (index !== -1) {
				mfzch.loadouts.splice(index, 1);
				mfzch.saveData('loadouts');

				$('#loadouts-custom [data-load-id=' + loadid + ']').slideUp(function(){
					mfzch.updateLoadoutList();
				});
			}
		}
	});

	// manage loadout
	$(document).on('click', '#loadouts .load-manage', function(){
		var loadid = $(this).parent().attr('data-load-id');
		var load = findObjectByUUID(loadid, mfzch.loadouts);

		if (load) {
			$('#loadout-id').val(loadid);
			$('#loadout-name').val(load.name);
			$('#loadout-systems').html(load.getSystemDisplay(false, false));
			$('#loadout-graph').html(load.createFrameGraph(false));
		}
	});

	$(document).on('focus', '#loadout-name', function(){
		this.select();
	});

	// loadout add system
	$(document).on('click', '#loadouts a.add-sys', function(){
		var loadid = $('#loadout-id').val();
		var load = findObjectByUUID(loadid, mfzch.loadouts);

		if (load) {
			load.addSystem($(this).attr('data-sys-type'));
			$('#loadout-systems').html(load.getSystemDisplay(false, false));
			$('#loadout-graph').html(load.createFrameGraph(false));
			mfzch.updateLoadoutList();
			mfzch.saveData('loadouts');
		}
	});

	// loadout reset systems
	$(document).on('click', '#loadouts a.reset-sys', function(){
		var loadid = $('#loadout-id').val();
		var load = findObjectByUUID(loadid, mfzch.loadouts);

		if (load) {
			load.w = 2;
			load.rh = 0;
			load.rd = 0;
			load.ra = 0;
			load.b = 0;
			load.y = 0;
			load.g = 0;
			load.e = 0;
			load.ssr = 0;
			load.rhd = 0;
			load.rhd = 0;
			load.rha = 0;
			load.rda = 0;

			$('#loadout-systems').html(load.getSystemDisplay(false, false));
			$('#loadout-graph').html(load.createFrameGraph(false));
			mfzch.updateLoadoutList();
			mfzch.saveData('loadouts');
		}
	});

	// loadout remove system
	$(document).on('click', '#loadout-systems li', function(){
		var loadid = $('#loadout-id').val();
		var load = findObjectByUUID(loadid, mfzch.loadouts);

		if (load) {
			load.removeSystem($(this).attr('data-sys'));

			$('#loadout-systems').html(load.getSystemDisplay(false, false));
			$('#loadout-graph').html(load.createFrameGraph(false));
			mfzch.updateLoadoutList();
			mfzch.saveData('loadouts');
		}
	});

	// loadout update name
	$(document).on('change', '#loadout-name', function(){
		var loadid = $('#loadout-id').val();
		var load = findObjectByUUID(loadid, mfzch.loadouts);

		if (load) {
			var bork = $('#loadout-name').val(); // sanitize
			load.name = $('<div/>').text(bork).html();

			mfzch.updateLoadoutList();
			mfzch.saveData('loadouts');
		}
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
			mfzch.saveData('settings');
		});
	});

	// add to company selector
	$(document).on('click', '#loadout-add-to-company-btn', function(){
		var loadid = $('#loadout-id').val();
		var load = findObjectByUUID(loadid, mfzch.loadouts);

		if (load) {
			$('#lo-company-list').html(mfzch.getShortCompanyList());

			if(mfzch.companies.length < MAXCOMPANIES) {
				$('#lo-company-list').append('<li data-icon="plus"><a href="#">Add New</a></li>')
			}
			$('#lo-company-list').listview('refresh');

			$('#lo-data').attr('data-name', load.name);
			$('#lo-data').html(load.getSystemDisplay(false, false));

			$('#loadout-adjust').popup('option', 'afterclose', function(){
				$('#loadout-add-to-company').popup('open');
			});
			$('#loadout-adjust').popup('option', 'afteropen', function(){
				$('#loadout-adjust').popup('option', 'afterclose', '');
			});
		}
		$('#loadout-adjust').popup('close');
	});

	// add to selected company
	$(document).on('click', '#lo-company-list li', function(){
		var load = mfzch.convertHtmlToLoadout('#lo-data');

		var companyid = $(this).attr('data-id');
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			if (company.frames.length < MAXFRAMES) {
				load.name = uniqueName(load.name, buildNameArray(company.frames))
				company.frames.push(load);
				company.clientmodified = true;
				mfzch.saveData('companies');

				try {
					ga('send', 'event', 'Loadouts', 'Action', 'Add Frame', 0, false);
				} catch (err) {}

				$('#loadout-add-to-company').popup('close');
			}
		} else { // generate new company
			company = new companyModel;
			var companyDesc = mfzch.generateDescriptor();
			company.name = companyDesc[0];
			company.color = companyDesc[1];

			company.frames.push(load);
			company.clientmodified = true;
			mfzch.companies.push(company);
			mfzch.saveData('companies');

			try {
				ga('send', 'event', 'Loadouts', 'Action', 'Add Company', 0, false);
			} catch (err) {}

			$('#loadout-add-to-company').popup('close');
		}
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
