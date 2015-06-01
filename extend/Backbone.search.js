var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.Collection.extend({
    search: function (attrs, first) {
        if (_.isEmpty(attrs)) return first ? void 0 : [];
        return this[first ? 'find' : 'filter'](function (model) {
            for (var key in attrs) {
                var needles = [];
                if (!_.isArray(attrs[key])) {
                    needles.push(attrs[key]);
                } else {
                    needles = attrs[key];
                }
                if (!_.contains(needles, model.get(key))) {
                    for (var i = 0; i < needles.length; i++) {
                        if (RegExp('^' + needles[i] + '$').test(model.get(key))) {
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