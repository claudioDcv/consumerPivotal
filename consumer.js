const APIUrl = require('./APIUrl.json');

const consumer = function(QUERYLABEL, TOKEN, PROJECT_ID){
  var stories_options = {
    uri: APIUrl.v5.getpProjects + PROJECT_ID + '/stories',
    qs: {
      with_label: QUERYLABEL // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
      'X-TrackerToken': TOKEN
    },
    json: false // Automatically parses the JSON string in the response
  };
  var epics_options = {
    uri: APIUrl.v5.getpProjects + PROJECT_ID + '/epics',
    headers: {
      'X-TrackerToken': TOKEN
    },
    json: false // Automatically parses the JSON string in the response
  };
  // service public
  return {
    stories_options,
    epics_options,
  }
}

exports.consumer = consumer;
