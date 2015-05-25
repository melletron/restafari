var faker = require('faker');

var ElephantsTemplate = function () {
    this.faker = faker;
    this.colours = ['red', 'pink', 'white', 'grey', 'green', 'blue', 'black', 'orange', 'yellow', 'purple'];
};

ElephantsTemplate.prototype = {
    model: function () {
        var index = Math.floor(Math.random() * 10);
        return {
            name: this.faker.name.firstName(),
            colour: this.colours[index],
            origin: this.faker.address.country()
        }
    },
    generate: function (size) {
        var collection = [];
        for (var i = 0; i < size; i++) {
            collection.push(this.model());
        }
        return collection;
    }
};

var elephantsTemplate = new ElephantsTemplate();

module.exports = elephantsTemplate;