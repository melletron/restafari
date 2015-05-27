var Backbone = require('backbone');
var faker = require('faker');
var colours = ['red', 'pink', 'white', 'grey', 'green', 'blue', 'black', 'orange', 'yellow', 'purple'];

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

var model = function () {
    var index = Math.floor(Math.random() * 10);
    return {
        name: faker.name.firstName(),
        colour: colours[index],
        origin: faker.address.country()
    };
};


var generate = function (size) {
    var collection = [];
    for (var i = 0; i < size; i++) {
        collection.push(model());
    }
    return collection;
};

module.exports = new Elephants(generate(Math.floor(Math.random() * 100)));