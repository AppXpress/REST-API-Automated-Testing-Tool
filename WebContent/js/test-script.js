
var host = "http://commerce.qa.tradecard.com";
var username = "qctest1";
var password = "12345678";
var dataKey = "55b4b8a1a38f2342c95308cc07387a782e5fe61b";

// Test Suite & Test Case format
/*
var test_suite_id = {
	name		: "Provide a Test Suite Name",
	test_cases	: [
	              	{
	              		test_case_id	:	'Provide a Unique Test Case ID with NO Spaces or Special Characters',
	              		test_case_desc	:	'Provide a Test Case Description',
	              		url				:	'/rest/310/user/self/?dataKey=' + dataKey, // The URL to be used
	              		type			:	'GET', // 'GET' or 'POST'
	              		auth			:	BASIC_AUTH, // BASIC_AUTH or PREVIOUS_AUTH_TOKEN
	              		data			: 	null, // Data as a JSON for POST Requests. For Get Request use null
	              		eTag			:	null, // For POST Requests use PREVIOUS_ETAG to use the Previous E-Tag from the response. For Get requests use null
	              		response		:	[200], // Expected HTTP response Status. e.g. [200, 201]
	              		assert			:	'response.status == "Active"' // Assertion Condition
	              	}
	              ]
};
*/

var test_suite_1 = {
	name		: "Authorization and Authentication",
	test_cases	: [
	              	{
	              		test_case_id	:	'AppX_RA_MD_0001',
	              		test_case_desc	:	'Authentication request Process',
	              		url				:	'/rest/310/user/self/?dataKey=' + dataKey,
	              		type			:	'GET',
	              		auth			:	BASIC_AUTH,
	              		data			: 	null,
	              		eTag			:	null,
	              		response		:	[200],
	              		assert			:	'response.status == "Active"'
	              	}
	              ]
};

var test_suite_2 = {
		name		: "Master Data Access",
		test_cases	: [
		              	{
		              		test_case_id	:	'AppX_RA_PICK_0001',
		              		test_case_desc	:	'PickList Access',
		              		url				:	'/rest/310/masterdata/127064329/?dataKey=' + dataKey,
		              		type			:	'GET',
		              		auth			:	PREVIOUS_AUTH_TOKEN,
		              		data			: 	null,
		              		eTag			:	null,
		              		response		:	[200],
		              		assert			:	'response.dataType == "PickList"'
		              		
		              	},
		              	{
		              		test_case_id	:	'AppX_RA_COM_0001',
		              		test_case_desc	:	'Party List',
		              		url				:	'/rest/310/party/list/?dataKey=' + dataKey,
		              		type			:	'GET',
		              		auth			:	PREVIOUS_AUTH_TOKEN,
		              		data			: 	null,
		              		eTag			:	null,
		              		response		:	[200],
		              		assert			:	'response.result.length > 0'
		              		
		              	}
		              ]
	};

// Add all Test Suites to be executed in to this array
var test_suites = [test_suite_1, test_suite_2];

