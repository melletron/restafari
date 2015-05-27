var _ = require('underscore');
var REST = function (server, session, collection, endpoint) {
    this.server = server;
    this.session = session;
    this.collection = collection;
    this.endpoint = endpoint;
    this.run();
};

REST.prototype = {
    create: function (req, res, next) {
        var model = this.collection.add(req.body);
        res.send(model.toJSON());
        return next();
    },
    getPrevNext: function (url, start, limit) {

        if (!/\?/.test(url)) {
            url += '?start=' + start + '&limit=' + limit;
        } else if (!/start/.test(url)) {
            url += '&start=' + start + '&limit=' + limit;
        }

        var prev = url.replace(/start=[0-9]+/, 'start=' + (start - limit));
        var next = url.replace(/start=[0-9]+/, 'start=' + (start + limit));

        return {
            prev: prev,
            next: next
        }
    },
    readAll: function (req, res, done) {

        var start = (req.query.start) ? parseInt(req.query.start) : 1;
        var limit = (req.query.limit) ? parseInt(req.query.limit) : 10;

        if (start < 1) {
            start = 1;
        }
        if (limit < 1) {
            limit = 1;
        }

        var total = this.collection.size();

        var prevNext = this.getPrevNext('http://' + req.header('host', this.server.url) + req.url, start, limit);
        var sendObject = {
            total: total,
            data: this.collection.toJSON().slice(start - 1, start + limit - 1),
            start: start,
            limit: limit
        };

        if (start > 1) {
            sendObject.prev = prevNext.prev;
        }

        if (start + limit <= total) {
            sendObject.next = prevNext.next;
        }

        res.send(sendObject);
        return done();
    },
    readById: function (req, res, next) {
        var model = this.collection.get(req.params.id);
        if (model) {
            res.send(model);
        } else {
            res.send(404, {
                message: 'entry not found'
            });
        }
        return next();
    },
    readFacets: function (req, res, next) {
        var names = this.collection.pluck(req.params.facet);
        var facets = {};
        for (var i = 0; i < names.length; i++) {
            if (facets[names[i]]) {
                facets[names[i]] += 1;
            } else {
                facets[names[i]] = 1;
            }
        }
        res.send(facets);
        return next();
    },
    update: function (req, res, next) {
        var model = this.collection.get(req.params.id);
        if (model) {
            model.set(req.body);
            res.send(model);
        } else {
            res.send(404, {
                message: 'entry not found'
            });
        }
        return next();
    },
    del: function (req, res, next) {
        var model = this.collection.get(req.params.id);
        if (model) {
            model = model.toJSON();
            this.collection.remove(req.params.id);
            res.send(model);
        } else {
            res.send(404, {
                message: 'entry not found'
            });
        }
        return next();
    },
    extend: function (method, route, callback) {
        this.server[method]('/' + this.endpoint + '/' + route, function (req, res, next) {
            callback(req, res, next);
            return next();
        });
    },
    run: function () {
        var that = this;

        this.server.post('/' + this.endpoint, function (req, res, next) {
            that.create(req, res, next);
        });
        this.server.get('/' + this.endpoint, function (req, res, next) {
            that.readAll(req, res, next);
        });
        this.server.get('/' + this.endpoint + '/:id', function (req, res, next) {
            that.readById(req, res, next);
        });
        this.server.get('/' + this.endpoint + '/facets/:facet', function (req, res, next) {
            that.readFacets(req, res, next);
        });
        this.server.put('/' + this.endpoint + '/:id', function (req, res, next) {
            that.update(req, res, next);
        });
        this.server.del('/' + this.endpoint + '/:id', function (req, res, next) {
            that.del(req, res, next);
        });
    }
};

module.exports = REST;