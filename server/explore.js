exports.around = around;
exports.ranking = ranking;
exports.random = random;
exports.who_likes_profile = who_likes_profile;
exports.profile_likes_who = profile_likes_who;

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

function who_likes_profile(req, res, next) {
  return next(new restify.BadMethodError('who_likes_profile not yet implemented'));
}

function profile_likes_who(req, res, next) {
  return next(new restify.BadMethodError('profile_likes_who not yet implemented'));
}
