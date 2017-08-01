const rp = require('request-promise');

function Pivotal(api_token) {
  this.base_url = 'https://www.pivotaltracker.com/services/v5';
  this.api_token = api_token;


}

(function () {
  this.getOptions = function (path, query_string) {
    var _this = this;
    var query_string = query_string || {};

    return {
        uri: _this.base_url + path,
        qs: query_string,
        headers: {
          'X-TrackerToken': _this.api_token
        },
        json: true
      };
  };

  this.getMe = function () {
    let options = this.getOptions('/me');
    return rp(options);
  };

  this.getProjects = function (params) {
    let options = this.getOptions('/projects');
    return rp(options);
  };

  this.getLabels = function (project_id, params) {
    let options = this.getOptions('/projects/' + String(project_id) + '/labels');
    return rp(options);
  };

  this.getStories = function (project_id, params) {
    const query = {};

    if (params.label) {
      let label = params.label.split(',').map(s => s.trim());
  
      if (label.length === 1) {
        query.with_label = label[0];
      } else {
        query.filter = label.map(s => `label:${s}`).join(' OR ')
      }
    }

    const options = this.getOptions('/projects/' + String(project_id) + '/stories', query);
    return rp(options);
  };

  this.getEpics = function (project_id, params) {
    let options = this.getOptions('/projects/' + String(project_id) + '/epics');
    return rp(options);
  };
}).apply(Pivotal.prototype);

module.exports = Pivotal;
