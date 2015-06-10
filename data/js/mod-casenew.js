// Grab the specific location within the HTML on the techsupport.csun.edu/ozSptCaseNew.jsp page to insert the "Quick Case" button
$('body > table:eq(3) > tbody:eq(0) > tr:eq(0) > td:eq(3)').prepend('<div style="margin-bottom:0px;" id="buttonBar"></div>');

// Insert the "Quick Case" <div> and give it button functionality
$('#buttonBar').append('<div class="caseButton" id="createCase">Quick Case</div>');
$('#createCase').button();

// Add a hidden <div> that will act as the form popup
$('body').append('<div class="absoluteCenter" id="formPopup"></div>');

// Hide the form popup by default
$('#formPopup').hide();

// When the "Quick Case" button is clicked, display and load the Quick Case form
$('#createCase').on('click', function(){
	// Grab the extension-specific link to the Quick Case form HTML
	var formUrl = chrome.extension.getURL('data/html/quick-case-form.html');
	// Show the form popup and load the Quick Case form HTML
	$('#formPopup').show();
	$('#formPopup').load(formUrl);
});

chrome.storage.local.get('userId', function(result) {
	if(result.userId) {
		alert("userId found! It's: " + result.userId);
	} else {
		var element = $('input[name=sessionValMsg]').val();
		var match = /USERID/.exec(element);
		var userId = element.substring(match.index + 9, match.index + 13);
		chrome.storage.local.set({'userId': userId});
	}
});

chrome.storage.local.get('currentClient', function(result) {
	if(result.currentClient) {
		$('#contactName').val(result.currentClient.clientName);
		$('#contactId').val(result.currentClient.clientId);

		chrome.storage.local.remove('currentClient');
	}
});