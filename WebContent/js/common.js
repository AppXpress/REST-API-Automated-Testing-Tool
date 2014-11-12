

var BASIC_AUTH = "BASIC_AUTH";
var PREVIOUS_AUTH_TOKEN = "PREVIOUS_AUTH_TOKEN";
var PREVIOUS_ETAG = "PREVIOUS_ETAG";


JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};


/**
 * JavaScript function to encode the HTTP Request Header
 */
function basicAuth(){
	
	var sep = String.fromCharCode(0x1F);
	
	var authentication = username + sep + password;
	
	var b64 = $().crypt({method: "b64enc",source: authentication});
	
	return 'Basic ' + b64;
}


