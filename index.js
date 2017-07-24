const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const rp = require('request-promise');
const createMark = require('./createMark.js');
const Pivotal = require('./pivotal-api-client');
const utils = require('./utils');
const marked = require('marked');


const PORT = process.env.PORT || 5000;
const DEBUG = process.env.NODE_DEBUG || true;
const SECRET = process.env.SECRET || 'pIvOtAltrAckEr';
const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 60 * 60 * 24 * 365; // Seconds


app.use(cookieParser(SECRET));
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/static/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/static/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/static/font-awesome', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/static', express.static(__dirname + '/static'));


nunjucks.configure('templates', {
    autoescape: true,
    noCache: DEBUG,
    express: app
});


app.use(function (req, res, next) {
  if ((!('pivotalToken' in req.signedCookies) || !req.signedCookies.pivotalToken) && '/signin' !== req.originalUrl) {
    res.redirect('/signin');
  } else {
    if (!('pivotal' in req.app.locals) || req.app.locals.pivotal instanceof Pivotal) {
      req.app.locals.pivotal = new Pivotal(req.signedCookies.pivotalToken);
    }
    next();
  }
});

app.get('/', function (req, res) {
  req.app.locals.pivotal.getProjects()
    .then(function (response) {
      res.render('index.html', {
        projects: response,
      });
    });
});

app.route('/signin').all(function (req, res) {
  if ('GET' === req.method) {
    res.render('signin.html');
  } else if ('POST' === req.method) {
    if ('pivotalToken' in req.body) {
      let pivotalToken = req.body.pivotalToken;
      let pivotal = new Pivotal(pivotalToken);
      pivotal.getMe()
        .then(function (data) {
          res.cookie('pivotalToken', pivotalToken, {
            signed: true,
            secure: 'https' === req.protocol,
            httpOnly: true,
            maxAge: COOKIE_MAX_AGE * 1000,
          });
          res.redirect('/');
        })
        .catch(function (err) {
          res.render('signin.html');
        });
    } else {
      res.render('signin.html');
    }
  } else {
    res.sendStatus(405);
  }
});

app.get('/signout', function (req, res) {
  res.clearCookie('pivotalToken');
  res.redirect('/signin');
});

app.get('/reports/daily', function (req, res) {
  var pivotal = req.app.locals.pivotal;
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
  req.app.locals.pivotal.getLabels(req.params.project_id)
    .then(function (response) {
      res.json(response);
    });
});

app.listen(PORT, function () {
  console.log('Listen on: http://0.0.0.0:' + PORT);
});
