var restify = require('restify');
var Logger = require('bunyan');

var db = require('./db');
var explore = require('./explore');
var profile = require('./profile');
var location = require('./location');

var NAME = '15-minutes';

var log = new Logger({
  name: NAME,
  level: 'trace',
  service: 'exampleapp',
  serializers: {
    // err: Logger.stdSerializers.err,
    req: Logger.stdSerializers.req,
    res: restify.bunyan.serializers.response
  }
});

var server = restify.createServer({
  name: NAME,
  // log: log,
  version: "0.0.1"
  });

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Explore
server.get('/explore/around', explore.around);
server.get('/explore/ranking', explore.ranking);
server.get('/explore/random', explore.random);


// Location
server.put('/location/checkin', location.checkin);


// Core profile
server.get('/profile/:id', profile.get);
server.post('/profile/:id', profile.create);
server.put('/profile/:id', profile.update);
server.del('/profile/:id', profile.remove);

// Images
server.post('/profile/:id/:imageurl', profile.add_image);
server.put('/profile/:id/:imageurl', profile.update_image);
server.del('/profile/:id/:imageurl', profile.delete_image);

server.get('/isup', function(req, res, next) {
  res.send('running');
});

// server.on('after', function(req, res, name) {
//   // req.log.info('%s just finished: %d.', name, res.code);
// });

server.listen(8080, function() {
  db.conn(); // Prime the DB connection...
  console.log('%s listening at %s', server.name, server.url);
});
