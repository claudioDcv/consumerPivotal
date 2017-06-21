const router = require('express').Router();

router.get('/projects/:project_id/labels', (req, res) => {
  req.app.locals.pivotal.getLabels(req.params.project_id)
    .then(function (response) {
      res.json(response);
    });
});

module.exports = router;
