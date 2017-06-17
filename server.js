const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const rp = require('request-promise');
const createMark = require('./createMark.js');
const Pivotal = require('./pivotal-api-client');
const utils = require('./utils');
var marked = require('marked');


const PORT = process.env.PORT || 8899;
const TOKEN = process.env.PIVOTAL_TOKEN;
const DEBUG = process.env.NODE_DEBUG || true;

const pivotal = new Pivotal(TOKEN);

app.use('/static/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/static/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/static/font-awesome', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/static', express.static(__dirname + '/static'));

nunjucks.configure('templates', {
    autoescape: true,
    noCache: DEBUG,
    express: app
});

app.get('/', function (req, res) {
  pivotal.getProjects()
    .then(function (response) {
      res.render('index.html', {
        projects: response,
      });
    });
});

app.get('/reports/daily', function (req, res) {
  var epics = pivotal.getEpics(req.query.project_id);
  var stories = pivotal.getStories(req.query.project_id, {label: req.query.label});
  Promise
    .all([epics, stories])
    .then(function (data) {
      processEpics = utils.groupStoriesInEpics(data[0], data[1]);
      md = utils.makeDailyReportMarkdown(processEpics);
      html = marked(md);
      res.render('reports-daily.html', {
        html: html,
        markdown: md
      });
    })
    .catch(function (reason) {
      console.log(reason);
      res.send('EEEEEEEEEEEEEERROR');
    })
  ;
});

app.get('/reports/weekly', function (req, res) {
  res.render('reports-weekly.html');
});

app.get('/api/projects/:project_id/labels', (req, res) => {
  pivotal.getLabels(req.params.project_id)
    .then(function (response) {
      res.json(response);
    });
});

app.listen(PORT, function () {
  console.log('Listen on: http://0.0.0.0:' + PORT);
});
