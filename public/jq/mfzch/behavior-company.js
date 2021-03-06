$(document).on('pagecreate', '#company-analysis', function(event){
	$('#company-adjust').off().on({
		popupafterclose: function() {
			mfzch.saveData('companies');
		}
	});
	$('#frame-adjust').off().on({
		popupafterclose: function() {
			mfzch.saveData('companies');
		}
	});

	// add company
	$(document).on('click', '#company-add', function(){
		var company = new companyModel();

		var companyDesc = mfzch.generateDescriptor();

		company.name = companyDesc[0];
		company.color = companyDesc[1];

		mfzch.companies.push(company);

		mfzch.updateCompanyList();

		$('#company-adjust-id').val(company.uuid);
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
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			$('#company-adjust-id').val(companyid);
			$('#company-name').val(company.name);
			$('#company-color').val(company.color);
			$('#company-description').val(company.description);
			if (company.shared) {
				$('#company-shared').val('on');
			} else {
				$('#company-shared').val('off');
			}
			$('#company-shared').flipswitch('refresh');

			$('#company-notice').hide();
			if (!company.frames.length) {
				$('#company-track-assets').hide();
			} else {
				$('#company-notice').empty();
				// move this section to company model, probably ***

				// frame number check
				if (company.frames.length > MAXBTFRAMES[2] || company.frames.length < MINSKFRAMES[5]) {
					$('#company-notice').append('<p>A standard game requires 3&#8211;8 frames.</p>');
					$('#company-notice').show();
				}
				// SSR check
				if (company.totalSSRs() != 3) {
					$('#company-notice').append('<p>A standard game requires 3 SSRs.</p>');
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
		}
	});

	$(document).on('focus', '#company-name', function(){
		this.select();
	});

	$(document).on('change', '#company-name', function(){
		var companyid = $('#company-adjust-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			company.name = $('#company-name').val();
			company.clientmodified = true;
			mfzch.updateCompanyList();
		} else {
			$('#company-adjust').popup('close');
		}
	});

	$(document).on('change', '#company-color', function(){
		var companyid = $('#company-adjust-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			company.color = $('#company-color').val();
			company.clientmodified = true;
			mfzch.updateCompanyList();
		} else {
			$('#company-adjust').popup('close');
		}
	});

	$(document).on('change', '#company-description', function(){
		var companyid = $('#company-adjust-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			company.description = $('#company-description').val();
			company.clientmodified = true;
		} else {
			$('#company-adjust').popup('close');
		}
	});

	$(document).on('change', '#company-shared', function(){
		var companyid = $('#company-adjust-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			if ($(this).val() == 'on') {
				company.shared = true;
			} else {
				company.shared = false;
			}
			company.clientmodified = true;
		} else {
			$('#company-adjust').popup('close');
		}
	});

	// company regen name/color
	$(document).on('click', '#company-regen', function(){
		var companyid = $('#company-adjust-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var companyDesc = mfzch.generateDescriptor();
			company.name = companyDesc[0];
			company.color = companyDesc[1];

			$('#company-name').val(company.name);
			$('#company-color').val(company.color);
			company.clientmodified = true;
			mfzch.updateCompanyList();
		}
	});

	// set company options
	$(document).on('click', '#company-submit', function(){
		$('#company-adjust').popup('close');
	});

	// delete company
	$(document).on('click', '.company-delete', function(){
		var companyid = $(this).parent().parent().parent().attr('data-companyid');
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var index = mfzch.companies.indexOf(company);

			if (index !== -1) {
				mfzch.companies.splice(index, 1);
				mfzch.saveData('companies');
				$('#company-list [data-companyid=' + companyid + ']').fadeOut(function (){
					mfzch.updateCompanyList();
				});
			}
		}
	});

	// add frame
	$(document).on('click', '#company-analysis .frame-add', function(){
		var companyid = $(this).parent().parent().parent().attr('data-companyid');
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frame = new frameModel();
			frame.name = uniqueName('Frame', buildNameArray(company.frames));

			company.frames.push(frame);
			company.clientmodified = true;

			mfzch.updateCompanyList();

			$('#company-id').val(companyid);
			$('#frame-id').val(frame.uuid);
			$('#frame-name').val(frame.name);
			$('#frame-systems').html(frame.getSystemDisplay(false, true));
			$('#frame-graph').html(frame.createFrameGraph(false));

			$('#frame-adjust').popup('open');
			try {
				ga('send', 'event', 'Company', 'Action', 'Add Frame', 0, false);
			} catch (err) {}
		}
	});

	// delete frame
	$(document).on('click', '#company-analysis .frame-del', function(){
		var companyid = $(this).parent().parent().parent().attr('data-companyid');
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frameid = $(this).parent().attr('data-frameid');
			var frame = company.findFrameByUUID(frameid);

			if (frame) {
				var index = company.frames.indexOf(frame);

				if (index !== -1) {
					company.frames.splice(index, 1);
					company.clientmodified = true;
					mfzch.saveData('companies');

					$('#company-list [data-companyid=' + companyid + '] [data-frameid=' + frameid + ']').slideUp(function(){
						mfzch.updateCompanyList();
					});
				}
			} else {
				$('#frame-adjust').popup('close');
			}
		} else {
			$('#frame-adjust').popup('close');
		}


	});

	// manage frame
	$(document).on('click', '.frame-manage', function(){
		var companyid = $(this).parent().parent().parent().attr('data-companyid');
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frameid = $(this).parent().attr('data-frameid');
			var frame = company.findFrameByUUID(frameid);

			if (frame) {
				$('#company-id').val(companyid);
				$('#frame-id').val(frameid);
				$('#frame-name').val(frame.name);
				$('#frame-icon').val(frame.icon);
				$('#frame-systems').html(frame.getSystemDisplay(false, true));
				$('#frame-graph').html(frame.createFrameGraph(false));
			} else {
				$('#frame-adjust').popup('close');
			}
		} else {
			$('#frame-adjust').popup('close');
		}


	});

	$(document).on('focus', '#frame-name', function(){
		this.select();
	});

	// add system
	$(document).on('click', '#company-analysis a.add-sys', function(){
		var companyid = $('#company-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frameid = $('#frame-id').val();
			var frame = company.findFrameByUUID(frameid);

			if (frame) {
				company.clientmodified = true;
				frame.addSystem($(this).attr('data-sys-type'));
				$('#frame-systems').html(frame.getSystemDisplay(false, true));
				$('#frame-graph').html(frame.createFrameGraph(false));
				mfzch.updateCompanyList();
			} else {
				$('#frame-adjust').popup('close');
			}
		} else {
			$('#frame-adjust').popup('close');
		}
	});

	// reset systems
	$(document).on('click', '#company-analysis a.reset-sys', function(){
		var companyid = $('#company-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frameid = $('#frame-id').val();
			var frame = company.findFrameByUUID(frameid);

			if (frame) {
				company.clientmodified = true;
				frame.w = 2;
				frame.rh = 0;
				frame.rd = 0;
				frame.ra = 0;
				frame.b = 0;
				frame.y = 0;
				frame.g = 0;
				frame.e = 0;
				frame.ssr = 0;
				frame.rhd = 0;
				frame.rhd = 0;
				frame.rha = 0;
				frame.rda = 0;

				$('#frame-systems').html(frame.getSystemDisplay(false, true));
				$('#frame-graph').html(frame.createFrameGraph(false));
				mfzch.updateCompanyList();
			} else {
				$('#frame-adjust').popup('close');
			}
		} else {
			$('#frame-adjust').popup('close');
		}
	});

	// remove system
	$(document).on('click', '#frame-systems li', function(){
		var companyid = $('#company-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frameid = $('#frame-id').val();
			var frame = company.findFrameByUUID(frameid);

			if (frame) {
				company.clientmodified = true;
				frame.removeSystem($(this).attr('data-sys'));

				$('#frame-systems').html(frame.getSystemDisplay(false, true));
				$('#frame-graph').html(frame.createFrameGraph(false));
				mfzch.updateCompanyList();
			} else {
				$('#frame-adjust').popup('close');
			}
		} else {
			$('#frame-adjust').popup('close');
		}
	});

	$(document).on('change', '#frame-name', function(){
		var companyid = $('#company-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frameid = $('#frame-id').val();
			var frame = company.findFrameByUUID(frameid);

			if (frame) {
				company.clientmodified = true;
				var frameName = $('#frame-name').val();
				frame.name = $('<div/>').text(frameName).html();

				mfzch.updateCompanyList();
			} else {
				$('#frame-adjust').popup('close');
			}
		} else {
			$('#frame-adjust').popup('close');
		}
	});

	$(document).on('change', '#frame-icon', function(){
		var companyid = $('#company-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frameid = $('#frame-id').val();
			var frame = company.findFrameByUUID(frameid);

			if (frame) {
				company.clientmodified = true;
				frame.icon = $('#frame-icon').val();

				mfzch.updateCompanyList();
			} else {
				$('#frame-adjust').popup('close');
			}
		} else {
			$('#frame-adjust').popup('close');
		}
	});

	$(document).on('click', '#frame-submit', function(){
		$('#frame-adjust').popup('close');
	});

	$(document).on('click', '#frame-graphtoggle', function(){
		$('#frame-graph').slideToggle();
	});

	$(document).on('click', '#frame-sim1', function(){
		var companyid = $('#company-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frameid = $('#frame-id').val();
			var frame = company.findFrameByUUID(frameid);

			if (frame) {
				mfzch.frameNow = 1;
				jQuery.extend(mfzch.frameSet[1], frame);

				try {
					ga('send', 'event', 'Company', 'Action', 'Send to Sim', 0, false);
				} catch (err) {}

				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");
			} else {
				$('#frame-adjust').popup('close');
			}
		} else {
			$('#frame-adjust').popup('close');
		}
	});

	$(document).on('click', '#frame-sim2', function(){
		var companyid = $('#company-id').val();
		var company = findObjectByUUID(companyid, mfzch.companies);

		if (company) {
			var frameid = $('#frame-id').val();
			var frame = company.findFrameByUUID(frameid);

			if (frame) {
				mfzch.frameNow = 2;
				jQuery.extend(mfzch.frameSet[2], frame);

				try {
					ga('send', 'event', 'Company', 'Action', 'Send to Sim', 0, false);
				} catch (err) {}

				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#dice-roller");
			} else {
				$('#frame-adjust').popup('close');
			}
		} else {
			$('#frame-adjust').popup('close');
		}
	});

	$(document).on('click', '#company-duplicate', function(){
		var srcCompanyid = $('#company-adjust-id').val();
		var srcCompany = findObjectByUUID(srcCompanyid, mfzch.companies);

		if (srcCompany) {
			var destCompany = new companyModel();

			destCompany.name = uniqueName(srcCompany.name, buildNameArray(mfzch.companies));
			destCompany.description = srcCompany.description;
			destCompany.color = srcCompany.color;

			// dump and fill frames
			destCompany.frames = [];

			srcCompany.frames.forEach (function(item, index){
				var srcFrame = srcCompany.frames[index];
				var destFrame = new frameModel();

				destFrame.name = srcFrame.name;
				destFrame.w = srcFrame.w;
				destFrame.rh = srcFrame.rh
				destFrame.rd = srcFrame.rd
				destFrame.ra = srcFrame.ra
				destFrame.b = srcFrame.b
				destFrame.y = srcFrame.y;
				destFrame.g = srcFrame.g;
				destFrame.e = srcFrame.e;
				destFrame.ssr = srcFrame.ssr;
				destFrame.rhd = srcFrame.rhd;
				destFrame.rha = srcFrame.rha;
				destFrame.rda = srcFrame.rda;

				destCompany.frames.push(destFrame);
			})

			destCompany.clientmodified = true;

			mfzch.companies.push(destCompany);

			mfzch.updateCompanyList();

			$('#company-adjust').popup('close');
			try {
				ga('send', 'event', 'Company', 'Action', 'Duplicate Company', 0, false);
			} catch (err) {}
		} else {
			$('#frame-adjust').popup('close');
		}
	});

	$(document).on('change', '#settings-showunitgraphs', function(){
		if ($(this).val() == 'on') {
			mfzch.settings.showUnitGraphs = true;
			$('.company-graph-in-list').stop().slideDown();
		} else {
			mfzch.settings.showUnitGraphs = false;
			$('.company-graph-in-list').stop().slideUp();
		}
		mfzch.saveData('settings');
	});

});

$(document).on("pagecontainerbeforeshow", function(event, ui){
	if (ui.toPage[0].id == 'company-analysis') {
		mfzch.syncServerData('companies');
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

$(document).on('show', function() {
	if (window.location.hash == "#company-analysis") {
		mfzch.syncServerData('companies');
	}
});
