exports.around = around;
exports.ranking = ranking;
exports.random = random;

var restify = require('restify');

function around(req, res, next) {
  return next(new restify.BadMethodError('around not yet implemented'));
}

function ranking(req, res, next) {
  return next(new restify.BadMethodError('ranking not yet implemented'));
}

function random(req, res, next) {
  return next(new restify.BadMethodError('random not yet implemented'));
}

