var restify = require('restify');
var Logger = require('bunyan');
var mongo = require('mongodb');
var v = require('./validation');

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
  
  var validators = [v.valid_id, v.valid_name, v.valid_sex, v.valid_dateofbirth, v.valid_deviceid];
  
  for ( var i = 0; i < validators.length; i++ ) {
    var check = validators[i](req);
    if (!check[0]) {
      return next(new restify.InvalidArgumentError(check[1]));
    }
  }
  
  dbconn.collection('profiles', function(err, collection) {
    collection.findOne({id: req.params.id}, function(err, document) {
      if ( document ) {
        
        var params = ['name', 'sex', 'dateofbirth'];
        
        for ( var i = 0; i < params.length; i++ ) {
          if ( req.params[params[i]] ) {
            document[params[i]] = req.params[params[i]];
          }
        }
        
        if ( !document.devices ) {
          document.devices = [];
        }
        
        var new_device = true;
        for ( var i = 0; i < document.devices.length; i++ ) {
          if ( document.devices[i] == req.params['deviceid'] ) {
            new_device = false;
          }
        }
        
        if ( new_device ) {
          document['devices'].push(req.params['deviceid']);
        }
        
        collection.update({id: req.params.id}, document, {safe:true, multi: false}, function(err) {
          
          if(err) {
            req.log.error("Error updating profile",err.stack);
            return next(new restify.InternalError("Error update profile with id " + req.params.id));
          } else {
            res.json(201, {'result':'Profile ' + req.params.id + ' updated'});
            return next();
          }
        });
        
      } else {
        return next(new restify.ResourceNotFoundError('Nothing found with ID ' + req.params.id));
      }
    });
  });
  
});

server.post('/profile/:id', function create_profile(req, res, next) {
  
  var validators = [v.valid_id, v.valid_name, v.valid_sex, v.valid_dateofbirth, v.valid_deviceid];
  
  for ( var i = 0; i < validators.length; i++ ) {
    var check = validators[i](req);
    if (!check[0]) {
      return next(new restify.InvalidArgumentError(check[1]));
    }
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

server.get('/profile/:id', function get_profile(req, res, next) {
  
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

server.get('/isup', function(req, res, next) {
  res.send('running');
});

server.on('after', function(req, res, name) {
  // req.log.info('%s just finished: %d.', name, res.code);
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
