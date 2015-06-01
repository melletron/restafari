# RESTAfari

Restafarian is a pure REST implementation for data collections.
It automatically converts Backbone collections into REST endpoints.

### Version
1.1.0

### Tech
* [Backbone.js] - Two way data binding, with, whatever...
* [Restify] - A really quick and neat way of routing the end-points
* [Faker] - For generating large amounts of dummy data for the examples

### Installation

```sh
$ npm install restafari
```

#### Running from module folder
```sh
$ cd node_modules/restafari
# you can set your own folder of which it should read collections
$ COLLECTIONS=./collection_folder
$ npm start
```
#### Running as include

create your app.js

app.js
```JavaScript
require('restafari');
```

```sh
$ COLLECTIONS=./collection_folder
$ node app.js
```

If you don't specify your own collection folder it will automatically load the example Elephants and Zookeepers endpoints.

#### Running the test spec
```sh
$ cd node_modules/restafari
$ npm install
$ npm test
```

### Accessing the rest API

When started up, the REST api exposes the endpoint based on your collection file name.
It accepts the following requests

#### create
- POST /elephants

#### read
- GET /elephants
- GET /elephants/:id
- GET /elephants/facets/:facetName

#### query
Get only green elephants
- GET /elephants?colour=green

Get green and red elephants
- GET /elephants?colour=green&colour=red

Get green and red elephants not named Nelly
- GET /elephants?colour=green&colour=red&!name=Nelly

Get green and red elephants not named Nelly or James
- GET /elephants?colour=green&colour=red&!name=Nelly&name=James

Or use regular expressions instead
- GET /elephants?colour=(green|red)&!name=(Nelly|James)
- GET /elephants?name=N.*
- GET /elephants?name=N.*
Only elephants from Islands
- GET /elephants?origin=.*Islands
No elephants from Islands
- GET /elephants?!origin=.*Islands

#### update
- PUT /elephants/:id

#### delete
- DELETE /elephants/:id


####

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
var Elephants = require('../extend/Backbone.search.js').extend({
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
- Sorting
- Adding relational structures E.g. GET zoo/xyz123/elephants returning all elephants belonging to zoo with id xyz123
- Improve the prev next URL generation so it supports schema and proxied services
- Adding Websocket support
- Making the run testable
- Cleaning up test doubles

### Release notes

#### 1.1.0 - integrating search-queries
In this release I've added
- extend/Backbone.search.js
- extend/Backbone.search.spec.js

This is an extension to Backbone and tested in isolation.

The REST object integrates the new search features for which I added the methods:
- parseQuery
- execQuery

I've updated the readAll method to use these when it receives key value pairs in the query string.

start and limit are now preceded by a $ to indicate meta operations.
The ! is used to exclude key value pairs from the query.

To use the search you'd have to initiate your collection with:
```JavaScript
var Elephants = require('../extend/Backbone.search.js').extend({
    model: Elephant
});
```

##### Known issues
the prev and next meta values don't allow you to go beyond the collection.
 it currently doesn't limit when in queried mode ... not sure if we should consider it a defect.

License
----

ISC
