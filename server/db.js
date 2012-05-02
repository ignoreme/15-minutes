exports.conn = get_connection;

var mongo = require('mongodb');

var dbconn = null;

function get_connection() {
  
  if ( dbconn !== null ) {
    return dbconn;
  }
  
  mongo.connect('mongodb://127.0.0.1:27017/test', function(err, conn) {
    if(err) {
      console.log(err.stack);
      process.exit(1);
    }
    dbconn = conn;
  });

  // BUG - until first connection established, this remains NULL - don't know why yet...
  return dbconn;
}

