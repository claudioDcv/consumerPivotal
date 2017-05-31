const HTTP = require('http');
const EXEC_PROCESS = require("./exec_process.js");
const createMark = require('./createMark.js');
const rp = require('request-promise');

var PORT = process.env.PORT || 8899;
var TOKEN = process.env.PIVOTAL_TOKEN;

HTTP.createServer(function(req, res) {

  var url = require('url');
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  var QUERYLABEL = query.label ? query.label : '';
  var PROJECT_ID = query.project_id ? query.project_id : '';

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

	console.log("Params: label:" + QUERYLABEL + ' project_id:' + PROJECT_ID);

  var stories_options = {
    uri: 'https://www.pivotaltracker.com/services/v5/projects/' + PROJECT_ID + '/stories',
    qs: {
      with_label: QUERYLABEL // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
      'X-TrackerToken': TOKEN
    },
    json: false // Automatically parses the JSON string in the response
  };
  var epics_options = {
    uri: 'https://www.pivotaltracker.com/services/v5/projects/' + PROJECT_ID + '/epics',
    headers: {
      'X-TrackerToken': TOKEN
    },
    json: false // Automatically parses the JSON string in the response
  };

  var stories_rq = rp(stories_options);
  var epics_rq = rp(epics_options);

  Promise.all([stories_rq, epics_rq])
    .then(function (response) {
      var stories = response[0];
      var epics = response[1];

      res.end(createMark.createMark(stories, epics, QUERYLABEL));
    })
    .catch(function (e) {
      res.end("Error: ", e);
    })
  ;
}).listen(PORT, function () {
  console.log('Listen on PORT: ' + PORT);
});
