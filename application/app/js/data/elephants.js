(function (w) {

    w.Collections = w.Collections || {};
    w.Models = w.Models || {};

    w.Models.Country = Backbone.Model.extend({
        idAttribute: "_id"
    });

    w.Collections.Countries = Backbone.Collection.extend({
        model: w.Models.Country,
        url: function () {
            if (/&name=.*&/.test(this.baseUrl)) {
                this.baseUrl.replace(/\?name=.*&/, '&name=' + this.name + '&')
            }
            return this.baseUrl + (this.name && '&name=' + this.name || '');
        },
        parse: function (data) {
            this.total = data.total;
            this.next = data.next;
            this.prev = data.prev;
            return data.data;
        },
        goNext: function () {
            if (this.next) {
                this.baseUrl = this.next;
                this.fetch();
            }
        },
        goPrev: function () {
            if (this.prev) {
                this.baseUrl = this.prev;
                this.fetch();
            }
        },
        baseUrl: '/rest/countries?'
    });
}(window));