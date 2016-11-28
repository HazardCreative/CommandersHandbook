$(document).on('pagecreate', '#company-analysis', function(event){
	// add company
	$(document).on('click', '#company-add', function(){
		var company = new companyModel();

		var companyDesc = mfzch.generateDescriptor();

		company.name = companyDesc[0];
		company.color = companyDesc[1];

		mfzch.companies.push(company);
		mfzch.saveData(mfzch.companies, 'mfz.companies');

		mfzch.updateCompanyList();

		var companyid = mfzch.companies.length-1;
		var company = mfzch.companies[companyid];

		$('#company-index').val(companyid);
		$('#company-name').val(company.name);
		$('#company-color').val(company.color);

		$('#company-notice').hide();
		$('#company-track-assets').hide();
		$('#company-duplicate').hide();

		$('#company-adjust').popup('open');
		try {
			ga('send', 'event', 'Company', 'Action', 'Add Company', 0, false);
		} catch (err) {}

	});

	// manage company
	$(document).on('click', '#company-analysis .company-manage', function(){
		var companyid = $(this).parent().parent().parent().attr('data-companyid');
		var company = mfzch.companies[companyid];

		$('#company-index').val(companyid);
		$('#company-name').val(company.name);
		$('#company-color').val(company.color);

		$('#company-notice').hide();
		if (!company.frames.length) {
			$('#company-track-assets').hide();
		} else {
			$('#company-notice').empty();
			// move this section to company model, probably ***
			company.nonstandard = false;

			// frame number check
			if (company.frames.length > MAXBTFRAMES[2] || company.frames.length < MINSKFRAMES[5]) {
				$('#company-notice').append('<p>A standard game requires 3&#8211;8 frames.</p>');
				company.nonstandard = true;
				$('#company-notice').show();
			}
			// SSR check
			if (company.totalSSRs() != 3) {
				$('#company-notice').append('<p>A standard game requires 3 SSRs.</p>');
				company.nonstandard = true;
				$('#company-notice').show();
			}
			// frame naming check
			var namecheck = [];
			for (var i in company.frames) {
				namecheck.push(company.frames[i].name)
			}
			namecheck.sort();
			for (var i = 0; i < namecheck.length; i++) {
				if(namecheck[i+1] == namecheck[i]) {
					$('#company-notice').append('<p>This company has duplicate frame names, which may make system tracking difficult.</p>');
					$('#company-notice').show();
					break;
				}
			}
			$('#company-track-assets').show();
		}

		if (mfzch.companies.length < MAXCOMPANIES) {
			$('#company-duplicate').show();
		} else {
			$('#company-duplicate').hide();
		}

	});

	$(document).on('focus', '#company-name', function(){
		this.select();
	});

	$(document).on('change', '#company-name', function(){
		var companyid = $('#company-index').val();
		var company = mfzch.companies[companyid];

		company.name = $('#company-name').val();
		mfzch.saveData(mfzch.companies, 'mfz.companies');
		mfzch.updateCompanyList();
	});

	$(document).on('change', '#company-color', function(){
		var companyid = $('#company-index').val();
		var company = mfzch.companies[companyid];

		company.color = $('#company-color').val();
		mfzch.saveData(mfzch.companies, 'mfz.companies');
		mfzch.updateCompanyList();
	});

	// company regen name/color
	$(document).on('click', '#company-regen', function(){
		var companyid = $('#company-index').val();
		var company = mfzch.companies[companyid];

		var companyDesc = mfzch.generateDescriptor();
		company.name = companyDesc[0];
		company.color = companyDesc[1];

		$('#company-name').val(company.name);
		$('#company-color').val(company.color);
		mfzch.saveData(mfzch.companies, 'mfz.companies');
		mfzch.updateCompanyList();
	});

	// set company options
	$(document).on('click', '#company-submit', function(){
		$('#company-adjust').popup('close');
	});

	// delete company
	$(document).on('click', '.company-delete', function(){
		var companyid = $(this).parent().parent().parent().attr('data-companyid');
		mfzch.companies.splice(companyid, 1);
		mfzch.saveData(mfzch.companies, 'mfz.companies');
		$('#company-list [data-companyid=' + companyid + ']').fadeOut(function (){
			mfzch.updateCompanyList();
		});
	});

	// add frame
	$(document).on('click', '#company-analysis .frame-add', function(){
		var companyid = $(this).parent().parent().parent().attr('data-companyid');
		var frame = new frameModel();
		frame.name = uniqueName('Frame', buildNameArray(mfzch.companies[companyid].frames));

		mfzch.companies[companyid].frames.push(frame);
		mfzch.saveData(mfzch.companies, 'mfz.companies');

		mfzch.updateCompanyList();

		var frameid = mfzch.companies[companyid].frames.length-1;

		$('#company-index').val(companyid);
		$('#frame-index').val(frameid);
		$('#frame-name').val(mfzch.companies[companyid].frames[frameid].name);
		$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
		$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));

		$('#frame-adjust').popup('open');
		try {
			ga('send', 'event', 'Company', 'Action', 'Add Frame', 0, false);
		} catch (err) {}
	});

	// delete frame
	$(document).on('click', '#company-analysis .frame-del', function(){
		var companyid = $(this).parent().parent().parent().attr('data-companyid');
		var frameid = $(this).parent().attr('data-frameid');

		mfzch.companies[companyid].frames.splice(frameid, 1);
		mfzch.saveData(mfzch.companies, 'mfz.companies');

		$('#company-list [data-companyid=' + companyid + '] [data-frameid=' + frameid + ']').slideUp(function(){
			mfzch.updateCompanyList();
		});

	});

	// manage frame
	$(document).on('click', '.frame-manage', function(){
		var companyid = $(this).parent().parent().parent().attr('data-companyid');
		var frameid = $(this).parent().attr('data-frameid');

		var company = mfzch.companies[companyid];

		$('#company-index').val(companyid);
		$('#frame-index').val(frameid);
		$('#frame-name').val(mfzch.companies[companyid].frames[frameid].name);
		$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
		$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));
	});

	$(document).on('focus', '#frame-name', function(){
		this.select();
	});

	// add system
	$(document).on('click', '#company-analysis a.add-sys', function(){
		var companyid = $('#company-index').val();
		var frameid = $('#frame-index').val();

		mfzch.companies[companyid].frames[frameid].addSystem($(this).attr('data-sys-type'));
		$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
		$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));
		mfzch.updateCompanyList();
		mfzch.saveData(mfzch.companies, 'mfz.companies');
	});

	// reset systems
	$(document).on('click', '#company-analysis a.reset-sys', function(){
		var companyid = $('#company-index').val();
		var frameid = $('#frame-index').val();

		mfzch.companies[companyid].frames[frameid] = new frameModel();
		var bork = $('#frame-name').val();
		mfzch.companies[companyid].frames[frameid].name = $('<div/>').text(bork).html();
		$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
		$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));
		mfzch.updateCompanyList();
		mfzch.saveData(mfzch.companies, 'mfz.companies');
	});

	// remove system
	$(document).on('click', '#frame-systems li', function(){
		var companyid = $('#company-index').val();
		var frameid = $('#frame-index').val();

		mfzch.companies[companyid].frames[frameid].removeSystem($(this).attr('data-sys'));

		$('#frame-systems').html(mfzch.companies[companyid].frames[frameid].getSystemDisplay(false, true));
		$('#frame-graph').html(mfzch.companies[companyid].frames[frameid].createFrameGraph(false));
		mfzch.updateCompanyList();
		mfzch.saveData(mfzch.companies, 'mfz.companies');
	});

	$(document).on('change', '#frame-name', function(){
		var companyid = $('#company-index').val();
		var frameid = $('#frame-index').val();

		var bork = $('#frame-name').val();
		mfzch.companies[companyid].frames[frameid].name = $('<div/>').text(bork).html();

		mfzch.updateCompanyList();
		mfzch.saveData(mfzch.companies, 'mfz.companies');
	});

	$(document).on('click', '#frame-submit', function(){
		$('#frame-adjust').popup('close');
	});

	$(document).on('click', '#frame-graphtoggle', function(){
		$('#frame-graph').slideToggle();
	});

	$(document).on('click', '#frame-sim1', function(){
		var companyid = $('#company-index').val();
		var frameid = $('#frame-index').val();

		mfzch.frameNow = 1;
		jQuery.extend(mfzch.frameSet[1], mfzch.companies[companyid].frames[frameid]);

		try {
			ga('send', 'event', 'Company', 'Action', 'Send to Sim', 0, false);
		} catch (err) {}

		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");

	});
	$(document).on('click', '#frame-sim2', function(){
		var companyid = $('#company-index').val();
		var frameid = $('#frame-index').val();

		mfzch.frameNow = 2;
		jQuery.extend(mfzch.frameSet[2], mfzch.companies[companyid].frames[frameid]);

		try {
			ga('send', 'event', 'Company', 'Action', 'Send to Sim', 0, false);
		} catch (err) {}

		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");
	});

	$(document).on('click', '#company-track-assets', function(){
		$('#company-adjust').popup('option', 'afteropen', function(){
			$('#company-adjust').popup('option', 'afterclose', '');
		});
		$('#company-adjust').popup('option', 'afterclose', function(){
			if (mfzch.game.inProgress) {
				$('#company-track-gameinprogress').popup('open');
			} else if (mfzch.game.teams.length >= MAXTEAMS) {
				$('#company-full-add').hide();
				$('#company-full-list').html(mfzch.getTeamListForUnitStrucutre()).listview('refresh');
				$('#company-track-teamsfull').popup('open');
			} else {
				mfzch.addCompanyToAsset();
			}
		});
		$('#company-adjust').popup('close');
	});

	$(document).on('click', '#company-end-game', function(){
		mfzch.game.inProgress = false;
		mfzch.game.restoreFromTemplate();
		mfzch.saveData(mfzch.game, 'mfz.game');
		$('#company-track-gameinprogress').popup('option', 'afteropen', function(){
			$('#company-track-gameinprogress').popup('option', 'afterclose', '');
		});
		$('#company-track-gameinprogress').popup('option', 'afterclose', function(){
			if (mfzch.game.teams.length >= MAXTEAMS) {
				$('#company-full-add').hide();
				$('#company-full-list').html(mfzch.getTeamListForUnitStrucutre()).listview('refresh');
				$('#company-track-teamsfull').popup('open');
			} else {
				mfzch.addCompanyToAsset();
			}
		});

		$('#company-track-gameinprogress').popup('close');
	});

	$(document).on('click', '#company-full-list li', function(){
		var teamid = $(this).attr('data-id');
		mfzch.game.teams.splice(teamid, 1);
		mfzch.saveData(mfzch.game, 'mfz.game');

		$('#company-full-add').show();
		$('#company-full-list').html(mfzch.getTeamListForUnitStrucutre()).listview('refresh');
	});

	$(document).on('click', '#company-full-add', function(){
		$('#company-track-teamsfull').popup('option', 'afteropen', function(){
			$('#company-track-teamsfull').popup('option', 'afterclose', '');
		});
		$('#company-track-teamsfull').popup('option', 'afterclose', function(){
			var companyid = $('#companyinfo-name').attr('data-company-id');

			mfzch.addCompanyToAsset();
		});
		$('#company-track-teamsfull').popup('close');
	});

	$(document).on('click', '#company-duplicate', function(){
		var srcCompanyIndex = $('#company-index').val();

		var destCompany = new companyModel();

		$.extend(true, destCompany, mfzch.companies[srcCompanyIndex]);

		destCompany.name = uniqueName(destCompany.name, buildNameArray(mfzch.companies));

		// *** dump and fill frames
		destCompany.frames = [];

		mfzch.companies[srcCompanyIndex].frames.forEach (function(item, index){
			var frame = new frameModel();
			$.extend(true, frame, mfzch.companies[srcCompanyIndex].frames[index]);
			destCompany.frames.push(frame);
		})

		mfzch.companies.push(destCompany);
		mfzch.saveData(mfzch.companies, 'mfz.companies');

		mfzch.updateCompanyList();

		$('#company-adjust').popup('close');
		try {
			ga('send', 'event', 'Company', 'Action', 'Duplicate Company', 0, false);
		} catch (err) {}
	});

	$(document).on('change', '#settings-showunitgraphs', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.showUnitGraphs = true;
			$('.company-graph-in-list').stop().slideDown();
		} else {
			mfzch.settings.showUnitGraphs = false;
			$('.company-graph-in-list').stop().slideUp();
		}
		mfzch.saveData(mfzch.settings, 'mfz.settings');
	});

});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'company-analysis') {
		mfzch.updateCompanyList();

		if (mfzch.settings.showUnitGraphs) {
			$('#settings-showunitgraphs').val('on');
			$('.company-graph-in-list').show();
		} else {
			$('#settings-showunitgraphs').val('off');
			$('.company-graph-in-list').hide();
		}
		$('#settings-showunitgraphs').slider('refresh');

	}
});
