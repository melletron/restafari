var colors = require('colors');
var Backbone = require('backbone');
var _ = require('underscore');
var fs = require('fs');
var faker = require('faker');

var Elephant = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function () {
        if (!this.get('_id')) {
            this.set('_id', faker.random.uuid());
        }
    }
});

var Elephants = Backbone.Collection.extend({
    model: Elephant
});

module.exports = function (server, session) {

    session.elephants = new Elephants(require('./ElephantsTemplate.js').generate(Math.floor(Math.random() * 100)));

    server.get('/elephants', function (req, res, done) {
        var start = (req.query.start) ? parseInt(req.query.start) : 1;
        var limit = (req.query.limit) ? parseInt(req.query.limit) : 10;

        if (start < 1) {
            start = 1;
        }
        if (limit < 1) {
            limit = 1;
        }

        var total = session.elephants.size();

        if (!/\?/.test(req.url)) {
            req.url += '?start=' + start + '&limit=' + limit;
        }

        req.url = 'http://localhost:4242' + req.url;

        var prev = req.url.replace(/start=[0-9]+/, 'start=' + (start - limit));
        var next = req.url.replace(/start=[0-9]+/, 'start=' + (start + limit));
        var sendObject = {
            total: total,
            data: session.elephants.toJSON().slice(start - 1, start + limit - 1)
        };

        if (start > 1) {
            sendObject.prev = prev;
        }

        if (start + limit <= total) {
            sendObject.next = next;
        }

        res.send(sendObject);
        return done();
    });

    server.get('/elephants/:id', function (req, res, next) {
        var model = session.elephants.get(req.params.id);
        if (model) {
            res.send(model);
        } else {
            res.send(404, {
                message: 'entry not found'
            });
        }
        return next();
    });

    server.post('/elephants', function (req, res, next) {
        var model = session.elephants.add(req.body);
        res.send(model.toJSON());
        return next();
    });

    server.put('/elephants/:id', function (req, res, next) {
        var model = session.elephants.get(req.params.id);
        if (model) {
            model.set(req.body);
            res.send(model);
        } else {
            res.send(404, {
                message: 'entry not found'
            });
        }
        return next();
    });

    server.del('/elephants/:id', function (req, res, next) {
        var model = session.elephants.get(req.params.id);
        if (model) {
            model = model.toJSON();
            session.elephants.remove(req.params.id);
            res.send(model);
        } else {
            res.send(404, {
                message: 'entry not found'
            });
        }
        return next();
    });

    server.get('/elephants/facets/:facet', function (req, res, next) {
        console.log(req.params)
        var names = session.elephants.pluck(req.params.facet);
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
    });
};