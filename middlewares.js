const Pivotal = require('./pivotal-api-client');

exports.pivotalCookie = function (req, res, next) {
  if ((!('pivotalToken' in req.signedCookies) || !req.signedCookies.pivotalToken) && '/signin' !== req.originalUrl) {
    res.redirect('/signin');
  } else {
    if (!('pivotal' in req.app.locals) || req.app.locals.pivotal instanceof Pivotal) {
      req.app.locals.pivotal = new Pivotal(req.signedCookies.pivotalToken);
    }
    next();
  }
}
