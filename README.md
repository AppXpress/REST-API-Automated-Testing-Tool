REST-API-Automated-Testing-Tool
===============================

REST API Automated Testing Tool

-------------------------------


How to use:

1. Open the /WebContent/js/test-script.js

2. Set the values for host, username, password & dataKey as appropriate

3. Update the Test Suites  
*e.g:*
```
    var test_suite_id = {
        name        : "Provide a Test Suite Name",
        test_cases  : [
                        {
                            test_case_id    :   'Provide a Unique Test Case ID with NO Spaces or Special Characters',
                            test_case_desc  :   'Provide a Test Case Description',
                            url             :   '/rest/310/user/self/?dataKey=' + dataKey, // The URL to be used
                            type            :   'GET', // 'GET' or 'POST'
                            auth            :   BASIC_AUTH, // BASIC_AUTH or PREVIOUS_AUTH_TOKEN
                            data            :   null, // Data as a JSON for POST Requests. For Get Request use null
                            eTag            :   null, // For POST Requests use PREVIOUS_ETAG to use the Previous E-Tag from the response. For Get requests use null
                            response        :   [200], // Expected HTTP response Status. e.g. [200, 201]
                            assert          :   'response.status == "Active"' // Assertion Condition
                        }
                      ]
    };
```

4. Add the Test Suite to the execution list  
*e.g:*
```
    var test_suites = [test_suite_1, test_suite_2];
```

5. Open the /WebContent/automation.html with a Web Browser. Make sure you have Allowed JavaScript on the Browser

6. Press the "Execute Test" button


