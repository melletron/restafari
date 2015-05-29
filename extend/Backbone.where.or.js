var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.Collection.extend({
    where: function (attrs, first) {
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
                    return false;
                }
            }
            return true;
        });
    }
});