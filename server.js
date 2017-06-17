const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const rp = require('request-promise');
const createMark = require('./createMark.js');
const Pivotal = require('./pivotal-api-client');


const PORT = process.env.PORT || 8899;
const TOKEN = process.env.PIVOTAL_TOKEN;

const pivotal = new Pivotal(TOKEN);

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/reports/daily', function (req, res) {
  projects = pivotal.getProjects();
  labels = pivotal.getLabels('1948407');

  Promise.all([projects. labels])
    .then(function (response) {
      res.render('reports-daily.html', {
        projects: response[0],
        labels: response[1],
      });
    });
});

app.get('/reports/weekly', function (req, res) {
  res.render('reports-weekly.html');
});

app.listen(PORT, function () {
  console.log('Listen on: http://0.0.0.0:' + PORT);
});
