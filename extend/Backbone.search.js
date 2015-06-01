var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.Collection.extend({
    search: function (includes, excludes) {
        excludes = excludes || {};

        function strToStrArray(value) {
            return (!_.isArray(value)) ? [value] : value;
        };

        function testValue(query, value) {
            return RegExp('^' + query + '$').test(value);
        }

        function testExclude(model) {
            var i, key;
            for (key in excludes) {
                var needles = strToStrArray(excludes[key]);
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

            for (key in includes) {

                needles = strToStrArray(includes[key]);

                if (!_.contains(needles, model.get(key))) {

                    for (i = 0; i < needles.length; i++) {

                        if (testValue(needles[i], model.get(key))) {

                            if (testExclude(model)) {
                                return false;
                            }
                            return true;

                        }

                    }
                    return false;

                }

            }
            return true;
        }));
    }
});