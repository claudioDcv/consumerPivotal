const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const rp = require('request-promise');
const marked = require('marked');

const createMark = require('./createMark.js');
const Pivotal = require('./pivotal-api-client');
const utils = require('./utils');

const controllersReports = require('./controllers/reports');
const controllersApi = require('./controllers/api');
const controllersAuth = require('./controllers/authentication');


const PORT = process.env.PORT || 8899;
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

app.use('/reports', controllersReports);
app.use('/api', controllersApi);
app.use('/', controllersAuth);



app.listen(PORT, function () {
  console.log('Listen on: http://0.0.0.0:' + PORT);
});
