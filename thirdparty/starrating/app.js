var express = require('express');
var ibmdb = require('ibm_db');

var cfenv = require('cfenv');
var _ = require('underscore');

var app = express();
var appEnv = cfenv.getAppEnv();

var cors = require('cors')

// DB2 parameters
var db2 = {};
if (appEnv.services['dashDB']) {
  // Initialize database with credentials
  var dashDB = appEnv.services['dashDB'][0].credentials;
  
	db2.port = dashDB.port;
  db2.db = dashDB.db;
	db2.hostname = dashDB.hostname;
	db2.username = dashDB.username;
	db2.password = dashDB.password;
}
else
{
	db2.port = 50000;
  db2.db = "BLUDB";
	db2.hostname = "bluemix05.bluforcloud.com";
	db2.username = "dash113695";
	db2.password = "98935df51279";
}

var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;
function getstarratings(hotelid, callback) {
	ibmdb.open(connString, function(err, conn) {
    if(err) { res.send("error occurred " + err.message); } 
    else {
	    query = 'select ID, HOTEL, THIRDPARTYRATING from dash113695.starrating';
			if (hotelid.length > 0) query = query + ' where id = ' + hotelid
 
      rows = [];
	    conn.query(query, function (err, rows, moreResultSets) {
	      if (err) { console.log(err); return callback(rows); } 
	      else { return callback(rows); }
      });
	  }
  });	
}

app.get('/hotels.com/api/v1.0/starrating/3rdpartyrating', cors(), function(req, res) {
	var jsonResponse = {};
	getstarratings('', function(ratingrows) {
		jsonResponse.ratings = [];
	  jsonResponse.ratings = ratingrows;
			
	  res.json(jsonResponse);
	});
});

app.get('/hotels.com/api/v1.0/starrating/3rdpartyrating/:hotelid', function(req, res) {
  hotelid = req.params.hotelid;
  
  var jsonResponse = {};
	getstarratings(hotelid, function(ratingrows) {
		jsonResponse.ratings = [];
	  jsonResponse.ratings = ratingrows;
			
	  res.json(jsonResponse);
	}); 
});

app.get('*', function (apprequest, appresponse){
  appresponse.end('No route found.');
});

// start server on the specified port and binding host
app.listen(process.env.PORT || 9004, function() {
	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
});