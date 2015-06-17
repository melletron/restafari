var fs = require('fs');
var restify = require('restify');
var server = restify.createServer({
    name: 'RESTAFarian Server - converting Backbone Collections into REST endpoints',
    version: require('./package').version
});

var memwatch = require('memwatch');
memwatch.on('leak', function (info) {
    console.error('Memory leak detected: ', info);
});

var Templates = require('./controllers/templateRender.js');
var templates = new Templates();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var REST = require('./REST.js');
var collections = process.env.COLLECTIONS || __dirname + '/collections/';

if (!process.env.COLLECTIONS) {
    console.log('Loading example collections');
}

fs.readdir(collections, function (err, files) {
    if (err) {
        throw err;
    }
    files.forEach(function (file) {
        new REST(server, require(collections + file), 'rest/' + file.replace(/\.js$/, '').toLowerCase());
        console.log('Added endpoint', 'rest/' + file.replace(/\.js$/, '').toLowerCase())
    });
});

server.get('/app/js/templates.js', function (req, res, next) {
    if (req.query.load) {
        templates.load();
    }
    var body = templates.templateSource;
    res.writeHead(200, {
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'text/javascript'
    });
    res.write(body);
    res.end();
    next();
});

server.get(/\/app\/css\/?.*/, restify.serveStatic({
    directory: './application/',
    default: 'styles.css'
}));

server.get(/\/app\/js\/?.*/, restify.serveStatic({
    directory: './application/',
    default: 'app.js'
}));

server.get(/\/app\/?.*/, function (req, res, next) {
    var body = 'Error 500: Cannot load HTML file to serve';
    var responseCode = 500;

    function sendData() {
        res.writeHead(responseCode, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'text/html'
        });
        res.write(body);
        res.end();
        next();
        console.timeEnd('serving app');
    }


    fs.readFile(__dirname + '/application/app/index.html', 'utf8', function (err, data) {
        if (err) {
        } else {
            body = data;
            responseCode = 200;
        }

        sendData();
    });


});

server.listen(process.env.PORT || 4242, function () {
    console.log('%s listening at %s', server.name, server.url);
});