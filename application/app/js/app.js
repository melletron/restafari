/*global cpn:true Backbone:true, $:true, jQuery:true, _:true, CryptoJS:true */
(function init(w) {
    'use strict';
    w.routes = w.routes || {};
    w.Collections = w.Collection || {};
    w.Models = w.Collection || {};
    w.Views = w.Collection || {};


    w.Models.Elephant = Backbone.Model.extend({
        idAttribute: "_id"
    });

    w.Collections.Elephants = Backbone.Collection.extend({
        model: w.Models.Elephant,
        url: '/rest/elephants',
        parse: function (data) {
            this.next = data.next;
            this.prev = data.prev;
            return data.data;
        },
        goNext: function () {
            if (this.next) {
                this.url = this.next;
                this.fetch();
            }
        },
        goPrev: function () {
            if (this.prev) {
                this.url = this.prev;
                this.fetch();
            }
        }
    });

    w.Views.Chrome = Backbone.View.extend({
        initialize: function () {
            this.render();
        },
        render: function () {
            return this.$el.append(templates.chrome());
        },
        attachNav: function (el) {
            return this.$('[role=head-nav]').append(el);
        },
        attachMenu: function (el) {
            return this.$('[role=menu]').append(el);
        }
    });

    w.Views.HeadNav = Backbone.View.extend({
        initialize: function () {
            this.render();
        },
        events: {
            'click button': 'toggleMenu'
        },
        render: function () {
            return this.$el.append(templates['head-nav']());
        },
        toggleMenu: function () {
            $('html').toggleClass('menu-open');
        }
    });

    w.Views.MainMenu = Backbone.View.extend({
        initialize: function () {
            this.elephants = new w.Collections.Elephants();
            this.elephants.on('sync', this.render, this);
            this.elephants.fetch();
            window.elephants = this.elephants;
        },
        events: {
            'click [data-action=prev]': 'prev',
            'click [data-action=next]': 'next',
            'click [data-select]': 'select'
        },
        select: function (data) {
            console.log(this.elephants.get($(data.currentTarget).data('select')).toJSON());
        },
        prev: function () {
            this.elephants.goPrev();
        },
        next: function () {
            this.elephants.goNext();
        },
        render: function () {
            var html = '';

            if (this.elephants.prev) {
                html += '<a href="#" class="list-group-item" data-action="prev">' +
                    '<p class="list-group-item-text text-center"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></p>' +
                    '</a>';
            }

            this.elephants.each(function (model) {
                html += '<a href="#" class="list-group-item" data-select="' + model.get('_id') + '">' +
                    '<p class="list-group-item-text">' + model.get('name') + '</p>' +
                    '</a>';
            });

            if (this.elephants.next) {
                html += '<a href="#" class="list-group-item" data-action="next">' +
                    '<p class="list-group-item-text text-center"><span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></p>' +
                    '</a>';
            }

            return this.$el.html('<div class="panel-heading">Start the Daylight</div>' +
                '<div class="list-group">' + html +
                '</div>');
        },
        tagName: 'div',
        className: 'panel panel-default'
    });

    w.routes.start = function () {

    };

    var chrome = new w.Views.Chrome();
    var headNav = new w.Views.HeadNav();
    var menu = new w.Views.MainMenu();
    chrome.attachNav(headNav.el);
    chrome.attachMenu(menu.el);
    $('body').append(chrome.el);

    var router = new Backbone.Router();
    router.route("start/", "start", w.routes.start);
    Backbone.history.start({pushState: !!(window.history && window.history.pushState), root: '/app/'});
}(window));



