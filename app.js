var fs = require('fs');
var restify = require('restify');
var server = restify.createServer({
    name: 'RESTAFarian Server - converting Backbone Collections into REST endpoints',
    version: require('./package').version
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var REST = require('./REST.js');
var collections = process.env.COLLECTIONS || './collections/';

if (!process.env.COLLECTIONS) {
    console.log('Loading example collections');
}

fs.readdir(collections, function (err, files) {
    if (err) {
        throw err;
    }
    files.forEach(function (file) {
        new REST(server, require(collections + file), file.replace(/\.js$/, '').toLowerCase());
        console.log('Added enpoint', file.replace(/\.js$/, '').toLowerCase())
    });
});

server.listen(4242, function () {
    console.log('%s listening at %s', server.name, server.url);
});