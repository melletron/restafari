# RESTAfari

Restafarian is a pure REST implementation for data collections.
It automatically converts Backbone collections into REST endpoints.

### Version
1.0.0

### Tech
* [Backbone.js] - Two way data binding, with, whatever...
* [Restify] - A really quick and neat way of routing the end-points
* [Faker] - For generating large amounts of dummy data for the examples

### Installation

```sh
$ npm install restafari
$ npm test
# you can set your own folder of which it should read collections
$ COLLECTIONS=./Backbone_collection_folder
$ npm start
```

### Creating collections
You can create your own collection endpoint by making a Backbone model and collection pair and store them in your collection directory.
Anithing goes als long as the module exports a singelton Backbone collection. You can hook them up with a MongoDB, RabbitMQ or any back-end system you please. It's your party :)

#### Example
```JavaScript
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
var Elephants = Backbone.Collection.extend({
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
```
### Todo's
- Adding Websocket support
- Making the run testable
- Cleaning up test doubles

License
----

ISC