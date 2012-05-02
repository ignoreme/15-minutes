exports.checkin = checkin;

var restify = require('restify');

function checkin(req, res, next) {
  return next(new restify.BadMethodError('checkin not yet implemented'));
}

