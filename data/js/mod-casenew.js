$('body > table:eq(3) > tbody:eq(0) > tr:eq(0) > td:eq(3)').prepend('<div style="margin-bottom:0px;" id="buttonBar"></div>');

$('#buttonBar').append('<div class="caseButton" id="createCase">Quick Case</div>');
$('body').append('<div class="absoluteCenter" id="formPopup"></div>');

$('#formPopup').hide();

$('#createCase').button();

$('#createCase').on('click', function(){
	$('#formPopup').show();
	var formUrl = chrome.extension.getURL('data/html/password-form.html');
	$('#formPopup').load(formUrl);
});

chrome.storage.local.get('currentClient', function(result) {
	if(result.currentClient) {
		$('#contactName').val(result.currentClient.clientName);
		$('#contactId').val(result.currentClient.clientId);

		chrome.storage.local.remove('currentClient');
	}
});

var userId = "";
var scriptTag = $('body > div:eq(0) > script:eq(0)').html();
var match = /genappend_submiturl/.exec(scriptTag);
userId = scriptTag.substring(match.index + 35, match.index + 39);