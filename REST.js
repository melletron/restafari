var _ = require('underscore');
var REST = function (server, collection, endpoint) {
    this.server = server;
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
            url += '?$start=' + start + '&$limit=' + limit;
        } else if (!/\$start/.test(url)) {
            url += '&$start=' + start + '&$limit=' + limit;
        }

        var prev = url.replace(/\$start=[0-9]+/, '$start=' + (start - limit));
        var next = url.replace(/\$start=[0-9]+/, '$start=' + (start + limit));

        return {
            prev: prev,
            next: next
        }
    },
    readAll: function (req, res, done) {
        var selection;
        var query = this.parseQuery(req.query);
        if (Object.keys(query[0]).length !== 0 || Object.keys(query[1]).length !== 0) {
            selection = this.execQuery(query[0], query[1]);
        } else {
            selection = this.collection;
        }
        var start = (req.query.$start) ? parseInt(req.query.$start) : 1;
        var limit = (req.query.$limit) ? parseInt(req.query.$limit) : 10;

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
            data: selection.toJSON().slice(start - 1, start + limit - 1),
            $start: start,
            $limit: limit
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
    parseQuery: function (query) {
        var includes = {};
        var excludes = {};
        var keys = Object.keys(query);
        for (var i = 0; i < keys.length; i++) {
            if (/^\$.*$/.test(keys[i])) {

            }
            else if (/^!.*$/.test(keys[i])) {
                excludes[keys[i].substring(1)] = query[keys[i]];
            } else {
                includes[keys[i]] = query[keys[i]];
            }
        }
        return [includes, excludes];
    },
    execQuery: function (includes, excludes) {
        return this.collection.search(includes, excludes);
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
    sortBy: function (sort, desc) {
        if (!_.isArray(sort)) {
            sort = [sort];
        }
        if (desc) {
            this.collection.comparator = function (model) {
                return _.map(model.get(sort).toLowerCase().split(""), function (letter) {
                    return String.fromCharCode(-(letter.charCodeAt(0)));
                });
            };
        } else {
            this.collection.comparator = sort;
        }
        this.collection.sort();
        return true;
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