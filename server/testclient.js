var restify = require('restify');

var client = restify.createJsonClient({
  url: 'http://localhost:8080',
  version: '*'
});

client.put('/profile/nobby-clarkX', { name: 'Nobby Clarky', sex: 'm', dateofbirth: '1985-06-01', deviceid: '123abc' }, function(err, req, res, obj) {
  console.log(JSON.stringify(obj, null, 2));
});

client.post('/profile/nobby-clarkz', { name: 'Nobby Clarky', sex: 'm', dateofbirth: '1985-06-01', deviceid: '123abc' }, function(err, req, res, obj) {
  console.log(JSON.stringify(obj, null, 2));
});