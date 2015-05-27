var Backbone = require('backbone');
var faker = require('faker');

var colours = ['red', 'pink', 'white', 'grey', 'green', 'blue', 'black', 'orange', 'yellow', 'purple'];

var Zookeeper = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function () {
        if (!this.get('_id')) {
            this.set('_id', faker.random.uuid());
        }
    }
});

var Zookeepers = Backbone.Collection.extend({
    model: Zookeeper
});

var model = function () {
    return {
        name: faker.name.firstName(),
        boss: faker.name.firstName()
    };
};


var generate = function (size) {
    var collection = [];
    for (var i = 0; i < size; i++) {
        collection.push(model());
    }
    return collection;
};

module.exports = new Zookeepers(generate(Math.floor(Math.random() * 100)));