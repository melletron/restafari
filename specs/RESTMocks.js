var sinon = require('sinon');
module.exports = function () {
    return {
        server: {
            get: sinon.spy(),
            post: function () {
            },
            put: function () {
            },
            del: function () {
            }
        },
        req: {
            query: {
                $start: 1,
                $limit: 10
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
            remove: sinon.spy(),
            where: sinon.spy(function () {
                return {
                    toJSON: function () {
                        return '1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20'.split(';');
                    }
                };
            }),
            search: sinon.spy()
        },
        endpoint: 'point'
    };
};