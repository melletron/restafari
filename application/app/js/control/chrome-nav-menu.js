(function (w) {

    w.Views = w.Views || {};

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
            this.countries = new w.Collections.Countries();
            this.countries.on('sync', this.renderCountries, this);
            this.countries.fetch();
            this.render();
        },
        events: {
            'click [data-action=prev]': 'prev',
            'click [data-action=next]': 'next',
            'click [data-select]': 'select',
            'keyup input': 'search'
        },
        search: function () {
            this.countries.name = '.*' + this.$('input').val() + '.*';
            this.countries.fetch();
        },
        select: function (data) {
            console.log(this.countries.get($(data.currentTarget).data('select')).toJSON());
        },
        prev: function () {
            this.countries.goPrev();
        },
        next: function () {
            this.countries.goNext();
        },
        renderCountries: function () {
            this.$('[data-content=countries]').html('');
            var html = '';

            if (this.countries.prev) {
                html += templates.prev();
            }

            this.countries.each(function (model) {
                html += templates.menuItem({
                    id: model.get('_id'),
                    content: model.get('name')
                });
            });

            if (this.countries.next) {
                html += templates.next();
            }

            this.$('[data-content=countries]').html(html);
            this.$('[data-content=countries-total]').html(this.countries.total);
        },
        render: function () {
            return this.$el.html(templates.countryMenu());
        },
        tagName: 'div',
        className: 'panel panel-default'
    });
}(window))