var chai = require('chai');
var expect = chai.expect;
var Backbone = require('backbone');
Backbone.Collection = require('../extend/Backbone.where.or.js')
describe('Backbone.where', function () {
    before(function () {
        this.model = new Backbone.Model({a: 1});
        this.coll = new Backbone.Collection([
            this.model,
            {a: 1},
            {a: 1, b: 2},
            {a: 2, b: 2},
            {a: 3}
        ]);
    });
    it('passes the same acceptance criteria as the original Backbone.Collection spec', function () {
        expect(this.coll.where({a: 1}).length).to.equal(3);
        expect(this.coll.where({a: 2}).length).to.equal(1);
        expect(this.coll.where({a: 3}).length).to.equal(1);
        expect(this.coll.where({b: 1}).length).to.equal(0);
        expect(this.coll.where({b: 2}).length).to.equal(2);
        expect(this.coll.where({a: 1, b: 2}).length).to.equal(1);
        expect(this.coll.findWhere({a: 1})).to.equal(this.model);
        expect(this.coll.findWhere({a: 4})).to.equal(void 0)
    });
    it('can search multiple values for the same key', function () {
        expect(this.coll.where({a: 1}).length).to.equal(3);
        expect(this.coll.where({a: [1, 2]}).length).to.equal(4);
        expect(this.coll.where({a: [2, 3]}).length).to.equal(2);
    });
});