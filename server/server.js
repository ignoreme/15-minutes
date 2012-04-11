var restify = require('restify');

var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.urlEncodedBodyParser());

server.get({path: '/aroundme/:location', name: 'AroundMe'}, function respond(req, res, next) {
  res.send({
    location: req.params.location
  });
  return next();
});

/* Other API methods 

  Add profile
  Update profile
  View profile
  Rate profile
  
  MyFavorites
  
  Top10
  
*/

server.get('/isup', function(req, res, next) {
  res.send('running');
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});