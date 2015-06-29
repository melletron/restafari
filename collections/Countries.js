var countries = require('../countries.json');
var faker = require('faker');


var Backbone = require('backbone');
var _ = require('underscore');

var Country = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function () {
        if (!this.get('_id')) {
            this.set('_id', faker.random.uuid());
        }
    }
});

var Countries = require('../extend/Backbone.search.js').extend({
    model: Country
});

var Name = Backbone.Model.extend();
var Names = require('../extend/Backbone.search.js').extend({
    model: Name
});

console.time('Country map reduce');
countries.map(function (model) {
    var names = model.name;
    var nativeNames = [];
    var translations = [];
    var languages = [];
    model.officialName = names.official;
    //
    _.each(names.native, function (name, key) {
        name.language = key;
        nativeNames.push(name);
    });
    _.each(model.translations, function (trans, key) {
        trans.language = key;
        translations.push(trans);
    });
    _.each(model.languages, function (lang) {
        languages.push(lang);
    });
    model.nativeNames = new Names(nativeNames);
    model.name = names.common;
    model.translations = new Names(translations);
    model.languages = languages;
    return model;
});
console.timeEnd('Country map reduce');

module.exports = new Countries(countries);