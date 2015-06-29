/*global cpn:true Backbone:true, $:true, jQuery:true, _:true, CryptoJS:true */
(function init(w) {
    'use strict';
    w.routes = w.routes || {};

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



