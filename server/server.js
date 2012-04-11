var restify = require('restify');

var server = restify.createServer();

server.get('/up', function(req, res, next) {
  res.send('running');
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});