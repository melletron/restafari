var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.Collection.extend({
    search: function (includes, excludes) {
        excludes = excludes || {};
        return this.filter(function (model) {
            var needles,
                needelsx;
            for (var key in includes) {
                needles = [];
                if (!_.isArray(includes[key])) {
                    needles.push(includes[key]);
                } else {
                    needles = includes[key];
                }
                if (!_.contains(needles, model.get(key))) {
                    for (var i = 0; i < needles.length; i++) {
                        if (RegExp('^' + needles[i] + '$').test(model.get(key))) {
                            if (excludes[key]) {
                                needelsx = [];
                                if (!_.isArray(excludes[key])) {
                                    needelsx.push(excludes[key]);
                                } else {
                                    needelsx = excludes[key];
                                }
                                for (var j = 0; j < needelsx.length; j++) {
                                    if (RegExp('^' + needelsx[i] + '$').test(model.get(key))) {
                                        return false;
                                    }
                                }
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