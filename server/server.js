var restify = require('restify');
var Logger = require('bunyan');

var server = restify.createServer({
  name: '15-minutes',
  log: new Logger({name: "15-minutes", stream: process.stdout}),
  version: "0.0.1"
  });

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.urlEncodedBodyParser());

server.get({path: '/aroundme/:location', name: 'AroundMe'}, function respond(req, res, next) {
  
  // example logging...
  // req.log.info({params: req.params}, 'Hello there %s', 'foo');

  // default caching: Cache-Control: public
  // res.cache()
  
  res.json({
    location: req.params.location,
    clientID: req.query['clientID']
  });
  return next();
});

// Access logging...
//
// server.on('after', restify.auditLogger({
//   log: new Logger({
//     name: 'audit',
//     stream: process.stdout
//   })
// }));

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