var restify = require('restify');
var Logger = require('bunyan');
var mongo = require('mongodb');

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

var dbconn = null;

mongo.connect('mongodb://127.0.0.1:27017/test', function(err, conn) {
  if(err) {
    console.log(err.stack);
  }
  dbconn = conn;
});

server.get('/write', function(req, res, next) {

    dbconn.collection('foo', function(err, collection) {
      var thing = {'x': 5, 'y': 10};
      collection.insert(thing, {safe:true}, function(err) {
        if(err) { console.log("Error writing stuff",err.stack); return; }
      })
    });
    // conn.close();

  res.send('wrote');
});

server.get('/isup', function(req, res, next) {
  res.send('running');
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
