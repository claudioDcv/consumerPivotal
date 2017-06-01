const HTTP = require('http');
const rp = require('request-promise');
const URL = require('url');
const createMark = require('./createMark.js');
const CONSUMER = require("./consumer.js");

const PORT = process.env.PORT || 8899;
const TOKEN = process.env.PIVOTAL_TOKEN;

HTTP.createServer(function(req, res) {

  var explainError = '';
  var url_parts = URL.parse(req.url, true);
  var query = url_parts.query;

  var QUERYLABEL = query.label ? query.label : '';
  var PROJECT_ID = query.project_id ? query.project_id : '';

// Formater Error Out Explain
  if (!QUERYLABEL)
    explainError += 'label no puede estar vacio | ';
  if (!PROJECT_ID)
    explainError += 'project_id no puede estar vacio | ';

  console.log("Params: label:" + QUERYLABEL + ' project_id:' + PROJECT_ID);
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  var stories_rq = rp(CONSUMER.consumer(QUERYLABEL, TOKEN, PROJECT_ID).stories_options);
  var epics_rq = rp(CONSUMER.consumer(QUERYLABEL, TOKEN, PROJECT_ID).epics_options);

  Promise.all([stories_rq, epics_rq])
    .then(function (response) {
      var stories = response[0];
      var epics = response[1];

      res.end(createMark.createMark(stories, epics, QUERYLABEL));
    })
    .catch(function (e) {
      res.end(`Error: ${explainError}`, e);
    })
  ;
}).listen(PORT, function () {
  console.log('Listen on PORT: ' + PORT);
});
