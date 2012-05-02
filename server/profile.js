
exports.get = get;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.add_image = add_image;
exports.update_image = update_image;
exports.delete_image = delete_image;

var restify = require('restify');

var db = require('./db');
var v = require('./validation');

function get(req, res, next) {
  
  db.conn().collection('profiles', function(err, collection) {
    collection.findOne({id: req.params.id}, function(err, document) {
      if ( document ) {
        res.json(200, document);
        return next();
      } else {
        return next(new restify.ResourceNotFoundError('Nothing found with ID ' + req.params.id));
      }
    });
  });
  
}

function create(req, res, next) {
  
  var validators = [v.valid_id, v.valid_name, v.valid_sex, v.valid_dateofbirth, v.valid_deviceid];
  
  for ( var i = 0; i < validators.length; i++ ) {
    var check = validators[i](req);
    if (!check[0]) {
      return next(new restify.InvalidArgumentError(check[1]));
    }
  }
  
  db.conn().collection('profiles', function(err, collection) {
    
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
  
}

function update(req, res, next) {
  
  var validators = [v.valid_id, v.valid_name, v.valid_sex, v.valid_dateofbirth, v.valid_deviceid];
  
  for ( var i = 0; i < validators.length; i++ ) {
    var check = validators[i](req);
    if (!check[0]) {
      return next(new restify.InvalidArgumentError(check[1]));
    }
  }
  
  db.conn().collection('profiles', function(err, collection) {
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
  
}

function remove(req, res, next) {
  return next(new restify.BadMethodError('remove not yet implemented'));
}

function add_image(req, res, next) {
  return next(new restify.BadMethodError('add_image not yet implemented'));
}

function update_image(req, res, next) {
  return next(new restify.BadMethodError('update_image not yet implemented'));
}

function delete_image(req, res, next) {
  return next(new restify.BadMethodError('delete_image not yet implemented'));
}


