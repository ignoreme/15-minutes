var mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"",
    "name":"",
    "db":"test"
}


var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}

var mongourl = generate_mongo_url(mongo);

console.log("Connecting to", mongourl);

require('mongodb').connect(mongourl, function(err, conn) {
  if(err) {
    console.log(err.stack);
    return;
  }
  console.log('Connected');
  conn.collection('stuff', function(err, collection) {
    if(err) { console.log("Error opening collection",err.stack); return; }
    var thing = {'x': 1, 'y': 2};
    collection.insert(thing, {safe:true}, function(err) {
      if(err) { console.log("Error writing stuff",err.stack); return; }
    })
  });
  console.log('Done');
  conn.close();
});