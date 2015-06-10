/**
 * This will ultimately be a collection of methods and possibly variables
 * that will be central to this extension.
 * Note to Self: Implement structure to allow for the updating of a case.
 */

/**
 * Pulls the create case information entered by the user in the popup form and submits that data
 * via POST to https://techsupport.csun.edu/ozSptCaseNew.jsp.
 */
function createCase(currentCase) {
	
	var formData = new FormData();
		formData.append('caseName', currentCase.caseName); // Case Name *Required
		formData.append('customerName','');
		formData.append('customerId','');
		formData.append('contactName', currentCase.clientName); // Contact Name *Required
		formData.append('contactId', currentCase.clientId); // Contact ID *Required
		formData.append('divContactType','NORMAL'); // UNKNOWN
		formData.append('cbExtViewable','Y'); // Externally Viewable
		formData.append('ownerId', currentCase.agentId); // UNKNOWN - Case Creator? *Required
		formData.append('SOURCE', currentCase.source); // Source *Required
		formData.append('__SOURCE','Y');
		formData.append('CF_188',''); // Requested Start Date
		formData.append('CF_188_id','');
		formData.append('__CF_188','Y');
		formData.append('STATUS','RECEIVED');
		formData.append('__STATUS','Y');
		formData.append('expCloseDate',''); // Requested Completion Date
		formData.append('__EXP_CLOSE_DATE','Y');
		formData.append('__CF_ENTITY_FIELD_13',''); // UNKNOWN
		formData.append('CF_13_id','');
		formData.append('__CF_13','Y');
		formData.append('CF_1',''); // IP Address
		formData.append('CF_1_id','');
		formData.append('__CF_1','Y');
		formData.append('PRIORITY', currentCase.priority); // Priority *Required
		formData.append('__PRIORITY','Y');
		formData.append('CF_2',''); // Hardware Address
		formData.append('CF_2_id','');
		formData.append('__CF_2','Y');
		formData.append('CF_91', currentCase.impact); // Impact *Required
		formData.append('CF_91_id','');
		formData.append('__CF_91','Y');
		formData.append('CF_27',''); // DNS Name
		formData.append('CF_27_id','');
		formData.append('__CF_27','Y');
		formData.append('prodName', currentCase.prodCatName); // Product/Category *Required
		formData.append('prdCatId', currentCase.prodCatId); // Product/Category ID *Required
		formData.append('prdId','-1');
		formData.append('__PRODUCT','Y');
		formData.append('attachFile',''); // Attachments
		formData.append('attachFile2','');
		formData.append('attachFile3','');
		formData.append('attachFile4','');
		formData.append('PROBLEM_DESC', currentCase.caseDetails); // Case Details *Required
		formData.append('__PROBLEM_DESC','Y');
		formData.append('CF_39', ''); // Preferred Email Address
		formData.append('CF_39_id','');
		formData.append('__CF_39','Y');
		formData.append('CF_5', currentCase.location); // Location Type *Required
		formData.append('CF_5_id','');
		formData.append('__CF_5','Y');
		formData.append('CF_40',''); // Preferred Phone Number
		formData.append('CF_40_id','');
		formData.append('__CF_40','Y');
		formData.append('CF_7',''); // Building
		formData.append('CF_7_id','');
		formData.append('__CF_7','Y');
		formData.append('CF_12',''); // Web Site
		formData.append('CF_12_id','');
		formData.append('__CF_12','Y');
		formData.append('CF_10',''); // Room
		formData.append('CF_10_id','');
		formData.append('__CF_10','Y');
		formData.append('PROBLEM_CODE', ''); // Problem Code
		formData.append('__PROBLEM_CODE','Y');
		formData.append('qas','');
		formData.append('astid','-1');
		formData.append('projectId','-1');
		formData.append('iclid','0');
		formData.append('pcseid','-1');
		formData.append('ahsFormAction','createCase');

	// Generate a button that displays a "loading" gif within the button bar.
	$('#buttonBar').append('<div style="width:25px;height:21px;padding-top:4px;float:left;" uid="'+ returnedUsers[currentUser].uid +'" class="caseProgress">Case</div>');
	$('.caseProgress').last().button();
	showLoader($('.caseProgress').last(), 'small');

	// Submit the case creation data via POST to create a case in EBSuite.
	$.ajax({
		url: 'https://techsupport.csun.edu/ozSptCaseNew.jsp',
		data: formData,
		processData: false,
		contentType: false,
		type: 'POST',
		success: function(data) {
			var link = $(data).find('a:eq(0)').attr('href'); // Grab the link to the case returned from POST request
			currentCase.caseId = link.substring(25,31); // Scrape the unique case ID from the returned HTML
			closeCase(currentCase);
		},
		error: function() {
			alert("An error occured while submitting the case. Please try again.");
		}
	});

	// Close the form popup window once the case data is submitted.
	$('#formPopup').hide();
}

/**
 * Pulls the close case information entered by the user in the popup form and submits that data
 * via POST to https://techsupport.csun.edu/ozSptCaseClose.jsp
 */
function closeCase(currentCase) {
	
	// Load and scrape the data from the Close Case page via https://techsupport.csun.edu/ozSptCaseClose.jsp?id=######
	// such that we have the correct email properties to send to the user upon closing a case.
	$.ajax({
		url: 'https://techsupport.csun.edu/ozSptCaseClose.jsp?id=' + currentCase.caseId,
		success: function(data) {
			var pageData = $(data);
			// Scrape the email subject, To: address, and contents from the Close Case page.
			var emailTo = pageData.find('input[name=emailTo]').val();
			var emailSubject = pageData.find('input[name=emailSubject]').val();
			var emailContent = pageData.find('textarea[name=emailContent]').html();
			// Generate the string to submit via POST to close the case.
			var closeCaseData = "caseOwnerId="+currentCase.agentId+
				"&caseStatus=CLOSED"+
				"&resolutionCode="+currentCase.resolutionCode+
				"&resolutionDetail="+currentCase.resolutionDetails+
				"&caseComment="+
				"&PROBLEM_CODE="+currentCase.problemCode+
				"&__PROBLEM_CODE=Y"+
				"&sendEmail=Y"+
				"&fromAddr=1998"+
				"&emailTo="+emailTo+
				"&ccId=-1"+
				"&emailSubject="+emailSubject+
				"&emailContent="+emailContent+
				"&cbAddEmailToLog=Y"+
				"&addNoteCase=Y"+
				"&addNoteCustomer=Y"+
				"&addNoteContact=Y"+
				"&addNoteSubject="+
				"&addNoteContent="+
				"&taskName="+
				"&ownerId="+currentCase.agentId+
				"&dueDate="+
				"&taskDetail="+
				"&surveyId=-1"+
				"&surveyEmlTo="+emailTo+
				"&surveyEmlSubject="+
				"&surveyEmlContent="+
				"&cbAddSurveyEmlToLog=Y"+
				"&ahsFormAction=updateClose"+
				"&id="+currentCase.caseId+
				"&commentstatusdirty=Y"+
				"&commentdirty=Y";
			// Close the case with the scraped data
			$.ajax({
				url: 'https://techsupport.csun.edu/ozSptCaseClose.jsp',
				data: closeCaseData,
				type: 'POST',
				success: function(data) {
					// Loops through all the case created buttons and update the button matching
					// this case ID with a checkmark and a link to the closed case details.
					$('.caseProgress').each(function(){
						if($(this).attr('uid') == returnedUsers[currentUser].uid) {
							var caseUrl = 'https://techsupport.csun.edu/ozSptCaseDtn.jsp?id='+currentCase.caseId+'&cpos=1';
							$(this).html('&#10003;');
							$(this).attr('href', caseUrl)
							$(this).on('click', function() {
								window.open($(this).attr('href'));
							});
						}
					});
				},
				error: function () {
					alert("Error closeing case. Please close it manually.");
				}
			});
		},
		error: function() {
			alert("Error loading the close case page.");
		}
	});
}


/**
 * Injects a loading image gif based on the preferred size and element.
 */
function showLoader(element, size) {
	var loaderGifUrl = chrome.extension.getURL('data/images/ajax-loader.gif');
	var loaderGifSmallUrl = chrome.extension.getURL('data/images/ajax-loader-small.gif');
	if(size == "medium") $(element).html('<img style="display:block;margin:auto;" src="'+ loaderGifUrl +'">');
	if(size == "small") $(element).html('<img style="display:block;margin:auto;" src="'+ loaderGifSmallUrl +'">');
}