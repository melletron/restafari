var chai = require('chai');
var fs = require('fs');
var mockFs = require('mock-fs');
var expect = chai.expect;
var sinon = require('sinon');
var TemplateRender = require('./TemplateRender.js');

describe('TemplateRender', function () {

    before(function () {
//        sinon.stub(TemplateRender, "operator", TemplateRender.operator);
//        sinon.stub(TemplateRender, "getContents", TemplateRender.getContents);
        mockFs({
            'templates': {
                'base.html': mockFs.file({
                    content: '<!--data-underscore-->Hello<!--/data-underscore-->',
                    ctime: new Date(),
                    mtime: new Date()
                })
            }
        });
//        sinon.stub(fs, "getContents", TemplateRender.getContents);
    });

    after(function () {

    });

    describe('getContents', function () {

        before(function () {
            this.next = sinon.spy();
            this.die = sinon.spy();
            TemplateRender.prototype.getContents('templates/base.html').then(this.next);
            TemplateRender.prototype.getContents('die').then(null, this.die);
        });

        it('loads templates from the template folder and calls next with the content', function () {
            sinon.assert.calledWith(this.next, '<!--data-underscore-->Hello<!--/data-underscore-->');
        });

        it('calls fail if file doesn\'t exist', function () {
            sinon.assert.calledWith(this.die, {
                "message": "ENOENT, no such file or directory 'die'",
                "code": "ENOENT",
                "errno": 34
            });
        });
    });

    describe('operator', function () {

        it('takes a file readout and convertis it into a template', function () {
            expect(TemplateRender.prototype.operator('base', '<!--data-underscore-->Hello<!--/data-underscore-->')).to.equal('window.undefined[\'base\']=function(obj){\nvar __t,__p=\'\',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,\'\');};\nwith(obj||{}){\n__p+=\'Hello\';\n}\nreturn __p;\n};');
        });

    });

    describe('integration', function () {

        before(function () {
            this.tplRender = new TemplateRender();
        });

        it('loads templates from the template folder and calls next with the content', function () {
            expect(this.tplRender.templateSource).to.equal('window.templates=window.templates||{};window.templates[\'base\']=function(obj){\nvar __t,__p=\'\',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,\'\');};\nwith(obj||{}){\n__p+=\'Hello\';\n}\nreturn __p;\n};');
        });

    });


});