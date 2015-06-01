var chai = require('chai');
var expect = chai.expect;
var Backbone = require('backbone');
Backbone.Collection = require('../extend/Backbone.search.js')
describe('Backbone.search', function () {
    before(function () {
        this.model = new Backbone.Model({a: 1});
        this.coll = new Backbone.Collection([
            this.model,
            {a: 1},
            {a: 1, b: 2},
            {a: 2, b: 2},
            {a: 3}
        ]);

        this.collRegex = new Backbone.Collection([
            this.model,
            {a: 'Elephant'},
            {a: 'Elephant', b: 'Snake'},
            {a: 'Indian Elephant', b: 'Python'},
            {a: 'Brown Bear', b: 'John'},
            {a: 'Grizzly Bear', b: 'Steve'},
            {a: 'Polar Bear', b: 'Jack'}
        ]);

    });
    it('passes the same acceptance criteria as the original Backbone.Collection.prototype.where spec', function () {
        expect(this.coll.search({a: 1}).length).to.equal(3);
        expect(this.coll.search({a: 2}).length).to.equal(1);
        expect(this.coll.search({a: 3}).length).to.equal(1);
        expect(this.coll.search({b: 1}).length).to.equal(0);
        expect(this.coll.search({b: 2}).length).to.equal(2);
        expect(this.coll.search({a: 1, b: 2}).length).to.equal(1);
    });
    it('can search multiple values for the same key', function () {
        expect(this.coll.search({a: 1}).length).to.equal(3);
        expect(this.coll.search({a: [1, 2]}).length).to.equal(4);
        expect(this.coll.search({a: [2, 3]}).length).to.equal(2);
    });

    describe('can do regex searches on models in a collection', function () {
        it('wraps the regexes in a ^$ so only specific searchers get picked up', function () {
            expect(this.collRegex.search({a: 'Elephant'}).length).to.equal(2);
            expect(this.collRegex.search({a: 'Elephant', b: 'Python'}).length).to.equal(0);
            expect(this.collRegex.search({a: 'Elephant', b: 'Snake'}).length).to.equal(1);
            expect(this.collRegex.search({a: 'Indian Elephant', b: 'Python'}).length).to.equal(1);
        });
        it('still does multiple value searches', function () {
            expect(this.collRegex.search({a: ['Elephant', 'Brown Bear']}).length).to.equal(3);
        });
        it('takes a regex to find all Elephant related values', function () {
            expect(this.collRegex.search({a: ['.*Elephant']}).length).to.equal(3);
            expect(this.collRegex.search({a: ['(Brown|Grizzly|Polar) Bear']}).length).to.equal(3);
            expect(this.collRegex.search({a: ['Elephant']}).length).to.equal(2);
        });
        it('excludes the excluded key value pairs', function () {
            expect(this.collRegex.search({a: ['(Brown|Grizzly|Polar) Bear']}, {b: 'Jack'}).length).to.equal(2);
//            console.log(this.collRegex.search({a: ['(Brown|Grizzly|Polar) Bear']}, {a: 'Polar Bear'}))
        });

    });
});