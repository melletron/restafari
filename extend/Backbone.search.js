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

        function testExclude(key, model) {
            var i;
            var needles = strToStrArray(excludes[key]);
            for (i = 0; i < needles.length; i++) {
                return testValue(needles[i], model.get(key));
            }
        }

        return this.filter(function (model) {
            var needles,
                key,
                i;

            for (key in includes) {

                needles = strToStrArray(includes[key]);

                if (!_.contains(needles, model.get(key))) {

                    for (i = 0; i < needles.length; i++) {

                        if (testValue(needles[i], model.get(key))) {

                            if (testExclude(key, model)) {
                                return false;
                            }
                            return true;

                        }

                    }
                    return false;

                }

            }
            return true;
        });
    }
});