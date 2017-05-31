const HTTP = require('http');
const EXEC_PROCESS = require("./exec_process.js");
const createMark = require('./createMark.js');

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

    EXEC_PROCESS.result("sh consumer.sh " + QUERYLABEL + ' ' + PROJECT_ID, function(err, response) {
        EXEC_PROCESS.result("sh consumerEpics.sh " + PROJECT_ID, function(err2, response2) {
            if (!err ||  !err2) {

                res.end(createMark.createMark(response, response2, QUERYLABEL));
            } else {
                res.end("Error: ", err || err2);
            }
        });
    });
}).listen(8899);
console.log('Server listening on port 8899');
