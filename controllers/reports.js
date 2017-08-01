const express = require('express');
const router = express.Router();
const marked = require('marked');
const utils = require('../utils');

router.get('/daily', function (req, res) {
  var epics = req.app.locals.pivotal.getEpics(req.query.project_id);
  var stories = req.app.locals.pivotal.getStories(req.query.project_id, { label: req.query.label });
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

router.get('/weekly', function (req, res) {
  res.render('reports-weekly.html');
});

module.exports = router;
