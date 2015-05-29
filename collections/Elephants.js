var Backbone = require('backbone');
var faker = require('faker');
var colours = ['red', 'pink', 'white', 'grey', 'green', 'blue', 'black', 'orange', 'yellow', 'purple'];

/**
 * @description This is a new Backbone model creating a randomized UID on init
 *     you can also hook it up to a backoffice
 * @type {*|void}
 */
var Elephant = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function () {
        if (!this.get('_id')) {
            this.set('_id', faker.random.uuid());
        }
    }
});

/**
 * @description This Backbone collection can be bound to a backoffice if you'd like to
 * @type {*|void}
 */
var Elephants = require('../extend/Backbone.where.or.js').extend({
    model: Elephant
});

/**
 * @description Generate fake data in the right schema
 * @returns {{name: *, colour: string, origin: *}}
 */
var model = function () {
    var index = Math.floor(Math.random() * 10);
    return {
        name: faker.name.firstName(),
        colour: colours[index],
        origin: faker.address.country()
    };
};

/**
 * @description generate a variable amount of fake Elephants
 * @param size
 * @returns {Array}
 */
var generate = function (size) {
    var collection = [];
    for (var i = 0; i < size; i++) {
        collection.push(model());
    }
    return collection;
};

/**
 * @description Always export a instantiated Backbone collection with data.
 *     It's a pointer reference so you can integrate this with a Back-end systems and
 *     your data will appear on your end-point.
 * @type {Elephants}
 */
module.exports = new Elephants(generate(Math.floor(Math.random() * 100)));