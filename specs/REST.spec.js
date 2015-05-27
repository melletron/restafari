var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon')
var EventEmitter = require('events').EventEmitter;
var REST = require('../REST.js');
var mock = function () {
        return {
            server: {
                get: function () {
                },
                post: function () {
                },
                put: function () {
                },
                del: function () {
                }
            },
            req: {
                query: {
                    start: 1,
                    limit: 10
                },
                url: '/elephants',
                header: function (header) {
                    switch (header) {
                        case 'host':
                            return 'localhost:4242';
                            break;
                    }
                },
                body: 'request body',
                params: {
                    id: 'id',
                    facet: 'colour'
                }
            },
            res: {
                send: sinon.spy()
            },
            session: {},
            collection: {
                toJSON: function () {
                    return '1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20'.split(';');
                },
                size: function () {
                    return this.toJSON().length;
                },
                add: sinon.spy(function () {
                    return {
                        toJSON: function () {
                            return {
                                'new': 'model'
                            }
                        }
                    };
                }),
                'get': sinon.spy(function (id) {
                    if (id !== 'id') {
                        return undefined;
                    }
                    return 'that model'
                }),
                pluck: sinon.spy(function () {
                    return [
                        'orange',
                        'purple',
                        'yellow',
                        'grey',
                        'green',
                        'green',
                        'green',
                        'red',
                        'red'
                    ]
                }),
                remove: sinon.spy()
            },
            endpoint: 'point'
        };
    }
    ;


//TODO better mocking
var INITIALIZE = mock();
var CREATE = mock();
var READALL = mock();
var READALL2 = mock();
var READBYID = mock();
var READBYID404 = mock();
var READFACETS = mock();
var UPDATE = mock();
var UPDATE404 = mock();
var DEL = mock();
var DEL404 = mock();
var DOUBLES6 = mock();

describe('REST', function () {

    before(function (done) {
        done();
    });

    beforeEach(function (done) {
        done();
    });

    after(function (done) {
        done();
    });

    context('initialize', function () {
        describe('setters', function () {
            before(function () {
                this.rest = new REST(INITIALIZE.server, INITIALIZE.session, INITIALIZE.collection, INITIALIZE.endpoint);
            });
            it('should set the endpoint', function (done) {
                expect(this.rest.endpoint).to.equal(INITIALIZE.endpoint);
                done();
            });
            it('should set the collection', function (done) {
                expect(this.rest.collection).to.equal(INITIALIZE.collection);
                done();
            });
            it('should set the session', function (done) {
                expect(this.rest.session).to.equal(INITIALIZE.session);
                done();
            });
            it('should set the server', function (done) {
                expect(this.rest.server).to.equal(INITIALIZE.server);
                done();
            });
        });
    });


    describe('create', function () {
        before(function () {
            this.rest = new REST(CREATE.server, CREATE.session, CREATE.collection, CREATE.endpoint);
        });
        it('calls next and returns it\'s value', function () {
            expect(this.rest.create(CREATE.req, CREATE.res, function () {
                return 'ok';
            })).to.equal('ok');
        });
        it('adds the model to the collection', function () {
            sinon.assert.calledWith(CREATE.collection.add, CREATE.req.body);
        });
        it('sends the newly created model', function () {
            sinon.assert.calledWith(CREATE.res.send, {
                'new': 'model'
            });
        });
    });

    describe('readAll', function () {
        before(function () {
            this.rest = new REST(READALL.server, READALL.session, READALL.collection, READALL.endpoint);
        });
        it('calls next and returns it\'s value', function () {
            expect(this.rest.readAll(READALL.req, READALL.res, function () {
                return 'ok';
            })).to.equal('ok');
        });
        it('calls res.send with it data to send to client', function () {
            sinon.assert.calledWith(READALL.res.send, {
                data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                limit: 10,
                next: "http://localhost:4242/elephants?start=11&limit=10",
                start: 1,
                total: 20
            });
        });
    });

    describe('readAll - pagination', function () {
        before(function () {
            this.rest = new REST(READALL2.server, READALL2.session, READALL2.collection, READALL2.endpoint);
        });
        it('calls next and returns it\'s value', function () {
            READALL2.req.query.start = 5;
            READALL2.req.query.limit = 2;
            expect(this.rest.readAll(READALL2.req, READALL2.res, function () {
                return 'ok';
            })).to.equal('ok');
        });
        it('calls res.send with it data to send to client', function () {
            sinon.assert.calledWith(READALL2.res.send, {
                data: ["5", "6"],
                limit: 2,
                prev: "http://localhost:4242/elephants?start=3&limit=2",
                next: "http://localhost:4242/elephants?start=7&limit=2",
                start: 5,
                total: 20
            });
        });
    });

    describe('readById', function () {
        before(function () {
            this.rest = new REST(READBYID.server, READBYID.session, READBYID.collection, READBYID.endpoint);
            READBYID404.req.params.id = '404';
            this.rest404 = new REST(READBYID404.server, READBYID404.session, READBYID404.collection, READBYID404.endpoint);
            this.rest404.readById(READBYID404.req, READBYID404.res, function () {
            });
        });
        it('calls next and returns it\'s value', function () {
            expect(this.rest.readById(READBYID.req, READBYID.res, function () {
                return 'ok';
            })).to.equal('ok');
        });
        it('gets the model by id from the collection', function () {
            sinon.assert.calledWith(READBYID.collection.get, 'id');
        });
        it('sends that model to the client', function () {
            sinon.assert.calledWith(READBYID.res.send, 'that model');
        });
        it('sends sends a 404 to the client if model doesn\'t exist', function () {
            sinon.assert.calledWith(READBYID404.res.send, 404, {
                message: 'entry not found'
            });
        });
    });

    describe('readFacets', function () {
        before(function () {
            this.rest = new REST(READFACETS.server, READFACETS.session, READFACETS.collection, READFACETS.endpoint);
        });
        it('calls next and returns it\'s value', function () {
            expect(this.rest.readFacets(READFACETS.req, READFACETS.res, function () {
                return 'ok';
            })).to.equal('ok');
        });
        it('plucks the key from the collection', function () {
            sinon.assert.calledWith(READFACETS.collection.pluck, 'colour');
        });

        it('sends the facets to the client', function () {
            sinon.assert.calledWith(READFACETS.res.send, {
                orange: 1,
                purple: 1,
                yellow: 1,
                grey: 1,
                green: 3,
                red: 2
            });
        });
    });

    describe('update', function () {
        before(function () {
            this.rest = new REST(UPDATE.server, UPDATE.session, UPDATE.collection, UPDATE.endpoint);
            var that = this;
            this.modelSpy = {
                set: sinon.spy()
            }
            UPDATE404.req.params.id = '404';
            UPDATE.collection.get = sinon.spy(function () {
                return that.modelSpy;
            });
            this.rest404 = new REST(UPDATE404.server, UPDATE404.session, UPDATE404.collection, UPDATE404.endpoint);
            this.rest404.update(UPDATE404.req, UPDATE404.res, function () {
            });
        });
        it('calls next and returns it\'s value', function () {
            expect(this.rest.update(UPDATE.req, UPDATE.res, function () {
                return 'ok';
            })).to.equal('ok');
        });
        it('gets the model by id from the collection', function () {
            sinon.assert.calledWith(UPDATE.collection.get, 'id');
        });
        it('updates the data model with the request body', function () {
            sinon.assert.calledWith(this.modelSpy.set, 'request body');
        });
        it('sends sends a 404 to the client if model doesn\'t exist', function () {
            sinon.assert.calledWith(UPDATE404.res.send, 404, {
                message: 'entry not found'
            });
        });
    });

    describe('del', function () {
        before(function () {

            DEL.collection.get = sinon.spy(function () {
                return {
                    toJSON: function () {
                        return 'data';
                    }
                };
            });

            this.rest = new REST(DEL.server, DEL.session, DEL.collection, DEL.endpoint);

            DEL404.req.params.id = '404';
            this.rest404 = new REST(DEL404.server, DEL404.session, DEL404.collection, DEL404.endpoint);
            this.rest404.del(DEL404.req, DEL404.res, function () {
            });

        });
        it('calls next and returns it\'s value', function () {
            expect(this.rest.del(DEL.req, DEL.res, function () {
                return 'ok';
            })).to.equal('ok');
        });
        it('gets the model by id from the collection', function () {
            sinon.assert.calledWith(DEL.collection.get, 'id');
        });
        it('removes the model by id from the collection', function () {
            sinon.assert.calledWith(DEL.collection.remove, 'id');
        });
        it('sends the deleted model to the client', function () {
            sinon.assert.calledWith(DEL.res.send, 'data');
        });
        it('sends sends a 404 to the client if model doesn\'t exist', function () {
            sinon.assert.calledWith(DEL404.res.send, 404, {
                message: 'entry not found'
            });
        });
    });

    describe('getPrevNext', function () {

        it('adds a start and limit to a URL that does not contain any queryetring', function () {
            expect(this.rest.getPrevNext('/elephants', 11, 10).prev).to.equal('/elephants?start=1&limit=10');
            expect(this.rest.getPrevNext('/elephants', 11, 10).next).to.equal('/elephants?start=21&limit=10');
        });

        it('updates a start and limit to a URL that does contain one', function () {
            expect(this.rest.getPrevNext('/elephants?start=31&limit=10', 11, 10).prev).to.equal('/elephants?start=1&limit=10');
            expect(this.rest.getPrevNext('/elephants?start=31&limit=10', 11, 10).next).to.equal('/elephants?start=21&limit=10');
        });

        it('adds a start and limit to a URL that does contain a querystring', function () {
            expect(this.rest.getPrevNext('/elephants?elephant=pink', 11, 10).prev).to.equal('/elephants?elephant=pink&start=1&limit=10');
            expect(this.rest.getPrevNext('/elephants?elephant=pink', 11, 10).next).to.equal('/elephants?elephant=pink&start=21&limit=10');
        });
    });


});