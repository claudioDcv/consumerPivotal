const router = require('express').Router();

router.get('/', function (req, res) {
  req.app.locals.pivotal.getProjects()
    .then(function (response) {
      res.render('index.html', {
        projects: response,
      });
    });
});

module.exports = router;
