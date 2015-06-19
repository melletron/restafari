var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.Collection.extend({
    search: function (includes, excludes) {
        excludes = excludes || {};


        function strToStrArray(value) {
            return (!_.isArray(value)) ? [value] : value;
        };

        function testValue(query, value) {
            value = strToStrArray(value);
            var i;
            for (i = 0; i < value.length; i++) {
                if (RegExp('^' + query + '$').test(value[i])) {
                    return true;
                }
            }
            return false;
        }

        function test(model, collection) {
            var i, key;
            for (key in collection) {
                var needles = strToStrArray(collection[key]);
                for (i = 0; i < needles.length; i++) {
                    if (testValue(needles[i], model.get(key))) {
                        return true;
                    }
                }
            }
        }

        return new Backbone.Collection(this.filter(function (model) {
            var needles,
                key,
                i;

            if (test(model, excludes)) {
                return false;
            } else {
                for (key in includes) {
                    needles = strToStrArray(includes[key]);
                    if (!_.contains(needles, model.get(key))) {
                        for (i = 0; i < needles.length; i++) {
                            if (testValue(needles[i], model.get(key))) {
                                return true;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }));
    }
});