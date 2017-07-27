const router = require('express').Router();
const Pivotal = require('../pivotal-api-client');

const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 60 * 60 * 24 * 365; // Seconds

router.route('/signin').all(function (req, res) {
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

router.get('/signout', function (req, res) {
  res.clearCookie('pivotalToken');
  res.redirect('/signin');
});

module.exports = router;
