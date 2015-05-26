var restify = require('restify');
var session = require('restify-session')({
    debug: true,
    ttl: 2
});

var server = restify.createServer({
    name: 'ABN-Amro stub server',
    version: '0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(session.sessionManager);

var REST = require('./REST.js');
new REST(server, session, require('./modules/Elephants.js'), 'elephants');
new REST(server, session, require('./modules/Zookeepers.js'), 'zookeepers');

server.listen(4242, function () {
    console.log('%s listening at %s', server.name, server.url);
});