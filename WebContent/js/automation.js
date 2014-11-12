
var GLOBAL_ALL_TEST_IDS = [];
var GLOBAL_PASS_COUNT = 0;
var GLOBAL_FAIL_COUNT = 0;
var GLOBAL_PREVIOUS_ETAG = null;
var GLOBAL_PREVIOUS_AUTH_TOKEN = null;

function renderTestUI() {
	
	setTimeout(function() {
		$.mobile.showPageLoadingMsg("b", "Loading Test Cases...");
		
		setTimeout(function() {
			
			var html = '<ul id="test_list" data-role="listview" data-theme="c">';
			
			for(var suite_index=0; suite_index<test_suites.length; suite_index++) {
				var testSuite = test_suites[suite_index];
				
				html += '<li data-role="list-divider">' + testSuite.name +'</span></li>';
				
				for(var test_index=0; test_index<testSuite.test_cases.length; test_index++) {
					var testCase = testSuite.test_cases[test_index];
					
					GLOBAL_ALL_TEST_IDS.push(testCase.test_case_id);
					html += renderTestCase(testCase.test_case_id, testCase.test_case_desc);
				}
			}
			
			html += '</ul>';
			
			$("#test_case_list").html(html);
			$('#test_case_list').trigger("create");
			$('#test_list').listview();
			
			$.mobile.hidePageLoadingMsg();
		}, 1000);
		
	}, 0);
	
}

function renderTestCase(testCaseId, testCaseDesc) {
	var html = "";
	
	html += '<li>';
	html += '<fieldset data-role="controlgroup">';
	html += '<h3>' + testCaseDesc + '</h3>';
	html += '<p class="ui-li-aside">';
	html += '<strong><span id="test_' + testCaseId +'_status">Not Tested</span></strong>';
	html += '</p>';
	html += '</fieldset>';
	html += '<div data-role="collapsible" data-theme="c">';
	html += '<h3>Request</h3>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="test_' + testCaseId +'_request_url">URL :</label>';
	html += '<textarea id="test_' + testCaseId +'_request_url" name="test_' + testCaseId +'_request_url" readonly="readonly"></textarea>';
	html += '</div>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="test_' + testCaseId +'_request_method">Method :</label>';
	html += '<input type="text" id="test_' + testCaseId +'_request_method" name="test_' + testCaseId +'_request_method" readonly="readonly" />';
	html += '</div>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="test_' + testCaseId +'_request_auth">Authorization :</label>';
	html += '<input type="text" id="test_' + testCaseId +'_request_auth" name="test_' + testCaseId +'_request_auth" readonly="readonly" />';
	html += '</div>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="test_' + testCaseId +'_request_etag">If-Match :</label>';
	html += '<input type="text" id="test_' + testCaseId +'_request_etag" name="test_' + testCaseId +'_request_etag" readonly="readonly" />';
	html += '</div>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="test_' + testCaseId +'_request_body">Request Body :</label>';
	html += '<textarea id="test_' + testCaseId +'_request_body" name="test_' + testCaseId +'_request_body" readonly="readonly"></textarea>';
	html += '</div>';
	html += '</div>';
	html += '<div data-role="collapsible" data-theme="c">';
	html += '<h3>Response</h3>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="test_' + testCaseId +'_response_status">Status :</label>';
	html += '<input type="text" id="test_' + testCaseId +'_response_status" name="test_' + testCaseId +'_response_status" readonly="readonly" />';
	html += '</div>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="test_' + testCaseId +'_response_auth">Authorization :</label>';
	html += '<input type="text" id="test_' + testCaseId +'_response_auth" name="test_' + testCaseId +'_response_auth" readonly="readonly" />';
	html += '</div>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="test_' + testCaseId +'_response_etag">Fingerprint :</label>';
	html += '<input type="text" id="test_' + testCaseId +'_response_etag" name="test_' + testCaseId +'_response_etag" readonly="readonly" />';
	html += '</div>';
	html += '<div data-role="fieldcontain">';
	html += '<label for="test_' + testCaseId +'_response_body">Response Body :</label>';
	html += '<textarea id="test_' + testCaseId +'_response_body" name="test_' + testCaseId +'_response_body" readonly="readonly"></textarea>';
	html += '</div>';
	html += '</div>';
	html += '</li>';
	
	return html;
}


function executeAll() {
	
	var selectedTestCaseArr = [];
	
	$("#final_result").html("<font color=\"blue\">Running...</font>");
	
	for(var suite_index=0; suite_index<test_suites.length; suite_index++) {
		var testSuite = test_suites[suite_index];
		
		for(var test_index=0; test_index<testSuite.test_cases.length; test_index++) {
			selectedTestCaseArr.push(testSuite.test_cases[test_index]);
		}
	}
	
	var executionId = 0;
	
	var executionInterval = setInterval(function() {
		
		if(executionId <= selectedTestCaseArr.length) {
			
			var testCase = selectedTestCaseArr[executionId];
			
			var auth = testCase.auth;
			if(auth == BASIC_AUTH) {
//				alert("Using Basic");
				auth = basicAuth();
			} else if (auth == PREVIOUS_AUTH_TOKEN) {
//				alert("Using Previous" + GLOBAL_PREVIOUS_AUTH_TOKEN);
				auth = GLOBAL_PREVIOUS_AUTH_TOKEN;
			}
			
			var eTag = testCase.eTag;
			if(eTag == PREVIOUS_ETAG) {
				eTag = GLOBAL_PREVIOUS_ETAG;
			}
			
			executeTest(testCase.test_case_id, host + testCase.url, testCase.type, auth, testCase.data, eTag);
			
			assertTest(testCase);
			
			executionId++;
		} else {
			clearInterval(executionInterval);
		}
		
	}, 3000);
	
}

function assertTest(testCase) {
	
	var testCaseId = testCase.test_case_id;

	var assertInterval = setInterval(function() {
		var httpStatus = $("#test_" + testCaseId + "_response_status").val();
		
		if (httpStatus != "") {
			clearInterval(assertInterval);
			
			try{
				var response = JSON.parse($("#test_" + testCaseId + "_response_body").val());
				var testResult = eval(testCase.assert);
				
				if (($.inArray(parseInt(httpStatus), testCase.response) >= 0) && (testResult)) {
					$("#test_" + testCaseId + "_status").html("<font color=\"green\">PASS</font>");
					GLOBAL_PASS_COUNT++;
				} else {
					$("#test_" + testCaseId + "_status").html("<font color=\"red\">FAIL</font>");
					GLOBAL_FAIL_COUNT++;
				}
			} catch (e) {
				$("#test_" + testCaseId + "_status").html("<font color=\"red\">FAIL</font>");
				GLOBAL_FAIL_COUNT++;
			}
			
			if(GLOBAL_ALL_TEST_IDS.length == GLOBAL_PASS_COUNT) {
				$("#final_result").html("<font color=\"green\">Complete : " + GLOBAL_PASS_COUNT + "/" + GLOBAL_ALL_TEST_IDS.length + "</font>");
			} else if (GLOBAL_FAIL_COUNT > 0) {
				if(GLOBAL_ALL_TEST_IDS.length == (GLOBAL_FAIL_COUNT + GLOBAL_PASS_COUNT)) {
					$("#final_result").html("<font color=\"red\">Complete : " + GLOBAL_PASS_COUNT + "/" + GLOBAL_ALL_TEST_IDS.length + "</font>");
				} else {
					$("#final_result").html("<font color=\"red\">Running : " + GLOBAL_PASS_COUNT + "/" + GLOBAL_ALL_TEST_IDS.length + "</font>");
				}
			} else {
				$("#final_result").html("<font color=\"blue\">Running : " + GLOBAL_PASS_COUNT + "/" + GLOBAL_ALL_TEST_IDS.length + "</font>");
			}
			
		}
	}, 250);

}

function executeTest(testCaseId, url, type, auth, data, eTag) {
	
	$("#test_" + testCaseId + "_status").html("<font color=\"blue\">Running...</font>");
	
	jQuery.support.cors = true;
	
	GLOBAL_TESTCASE_ID = testCaseId;
	
	$("#test_" + GLOBAL_TESTCASE_ID + "_request_url").val(url);
	$("#test_" + GLOBAL_TESTCASE_ID + "_request_method").val(type);
	
	GLOBAL_AUTH = undefined;
	GLOBAL_ETAG = undefined;
	
	if(auth) {
		GLOBAL_AUTH = auth;
		$("#test_" + GLOBAL_TESTCASE_ID + "_request_auth").val(auth);
	}
	
	if(eTag) {
		GLOBAL_ETAG = eTag;
		$("#test_" + GLOBAL_TESTCASE_ID + "_request_etag").val(eTag);
	}
	
	$.ajax({
		url : url,
		crossDomain: true,
        cache: false,
        type: type,
        dataType: 'json',
        success: successCallback,
        complete : completeCallback,
        beforeSend: setHeader,
    	data: JSON.stringify(data)
    });
}


function setHeader(xhr) {
	
	if(GLOBAL_AUTH != undefined) {
		xhr.setRequestHeader('Authorization', GLOBAL_AUTH);
	}
	
	if(GLOBAL_ETAG != undefined) {
		xhr.setRequestHeader('If-Match', GLOBAL_ETAG);
	}
	
//	xhr.setRequestHeader('Content-Type', 'application/json');
//	xhr.setRequestHeader("User-Agent", "Mozilla/5.0");
}


function successCallback(data) {
	
	$("#test_" + GLOBAL_TESTCASE_ID + "_response_body").val(JSON.stringify(data));
	
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_body_result_info").val(JSON.stringify(data.resultInfo));
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_body_result").val(JSON.stringify(data.result));
}


function completeCallback(response) {
	
	// Header
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_header").val(JSON.stringify(response.getAllResponseHeaders()));
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_header_date").val(response.getResponseHeader('Date'));
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_header_date").val(response.getResponseHeader('Server'));
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_header_date").val(response.getResponseHeader('Content-Type'));
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_header_date").val(response.getResponseHeader('Connection'));
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_header_date").val(response.getResponseHeader('Keep-Alive'));
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_header_date").val(response.getResponseHeader('Transfer-Encoding'));
	$("#test_" + GLOBAL_TESTCASE_ID + "_response_auth").val(response.getResponseHeader('Authorization'));
	$("#test_" + GLOBAL_TESTCASE_ID + "_response_etag").val(response.getResponseHeader('Etag'));
	
	// Body
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response").val(JSON.stringify(response));
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_readyState").val(response.readyState);
	$("#test_" + GLOBAL_TESTCASE_ID + "_response_status").val(response.status);
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_status_text").val(response.statusText);
//	$("#test_" + GLOBAL_TESTCASE_ID + "_response_response_text").val(response.responseText);
	
	GLOBAL_PREVIOUS_ETAG = response.getResponseHeader('Etag');
	
	if(response.getResponseHeader('Authorization') != null) {
		GLOBAL_PREVIOUS_AUTH_TOKEN = response.getResponseHeader('Authorization');
	}
}


renderTestUI();


