/*global module:true*/
'use strict';
var fs = require('fs');
var _ = require('underscore');
var Promise = require('promise');
var minify = require('html-minifier').minify;

var templateRender = function (dirname, globalName) {
    this.dirname = (dirname) ? __dirname + dirname : __dirname + '/../templates';
    this.globalName = globalName || 'templates';
    this.load();
};

templateRender.prototype = {
    operator: function (name, underscoreTemplate) {
        var tpl = minify(underscoreTemplate.match(/<!--data-underscore-->([^]*)<!--\/data-underscore-->/)[1], {
            removeComments: true,
            removeAttributeQuotes: true,
            collapseWhitespace: true
        });
        return 'window.' + this.globalName + '[\'' + name + '\']=' + _.template(tpl).source + ';'
    },
    getContents: function (file) {
        var promise = new Promise(function (resolve, reject) {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        return promise;
    },
    load: function () {
        this.templateSource = 'window.' + this.globalName + '=window.' + this.globalName + '||{};';
        var that = this;
        fs.readdir(__dirname + '/../templates', function (err, files) {
            if (err) {
                throw err;
            }
            files.forEach(function (file) {
                that.getContents(__dirname + '/../templates/' + file).then(function (data) {
                    that.templateSource += that.operator(file.slice(0, -5), data);
                    console.log('Adding template', file);
                });
            });
        });
    }
};

module.exports = templateRender;