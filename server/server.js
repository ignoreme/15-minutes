var restify = require('restify');
var Logger = require('bunyan');
var mongo = require('mongodb');

var dbconn = null;
mongo.connect('mongodb://127.0.0.1:27017/test', function(err, conn) {
  if(err) {
    console.log(err.stack);
    process.exit(1);
  }
  dbconn = conn;
});

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
  log: log,
  version: "0.0.1"
  });

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

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
  
  Master photo
  Attach picture
  
  Check-in
  
  MyFavorites
  
  Top10
  
*/

server.put('/profile/:id', function update_profile(req, res, next) {
  
  dbconn.collection('profiles', function(err, collection) {
    collection.findOne({id: req.params.id}, function(err, document) {
      if ( document ) {
        res.json(200, document);
        return next();
      } else {
        return next(new restify.ResourceNotFoundError('Nothing found with ID ' + req.params.id));
      }
    });
  });
  
});

server.post('/profile/:id', function create_profile(req, res, next) {
  
  if ( !req.params.id || !req.params.id.match(/^[a-zA-Z0-9_\-]+$/) ) {
    return next(new restify.InvalidArgumentError("Invalid id " + req.params.id));
  }
  
  if ( !req.params.name || !req.params.name.match(/^.+$/) ) {
    return next(new restify.InvalidArgumentError("Invalid name " + req.params.name));
  }
  
  if ( !req.params.sex || !req.params.sex.match(/^[mf]$/) ) {
    return next(new restify.InvalidArgumentError("Invalid sex " + req.params.sex));
  }
  
  if ( !req.params.dateofbirth || !req.params.dateofbirth.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ) {
    return next(new restify.InvalidArgumentError("Invalid date of birth " + req.params.dateofbirth));
  }
  
  if ( !req.params.deviceid ) {
    return next(new restify.InvalidArgumentError("Device ID required"));
  }
  
  dbconn.collection('profiles', function(err, collection) {
    
    collection.findOne({id: req.params.id}, function(err, document) {
      if ( document ) {
        return next(new restify.InvalidArgumentError("Profile already exists with ID " + req.params.id));
      } else {
        var profile = {
          'id': req.params.id,
          'name': req.params.name,
          'sex': req.params.sex,
          'dateofbirth': req.params.dateofbirth,
          'devices': [req.params.deviceid]
          };

        collection.insert(profile, {safe:true}, function(err) {
          if(err) {
            req.log.error("Error writing profile",err.stack);
            return next(new restify.InternalError("Error writing profile with id " + req.params.id));
          } else {
            res.json(201, {'result':'Profile ' + req.params.id + ' created'});
            return next();
          }
        });
      }
    });
  });
  
});

server.get('/profiles/:id', function get_profile(req, res, next) {
  
  dbconn.collection('profiles', function(err, collection) {
    collection.findOne({id: req.params.id}, function(err, document) {
      if ( document ) {
        res.json(200, document);
        return next();
      } else {
        return next(new restify.ResourceNotFoundError('Nothing found with ID ' + req.params.id));
      }
    });
  });
  
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

server.on('after', function(req, res, name) {
  // req.log.info('%s just finished: %d.', name, res.code);
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
