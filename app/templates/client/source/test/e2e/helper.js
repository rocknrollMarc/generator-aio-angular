/* global $ */
'use strict';

module.exports = function () {
    return {
        gotoUrl: gotoUrl,
        getHeader: getHeader,
        takeScreenshotIfFail: takeScreenshotIfFail,
        waitForPromiseTest: waitForPromiseTest,
        expectUrlToMatch: expectUrlToMatch
    };

    //////////

    function gotoUrl (url) {
        browser.get(browser.baseUrl + '/' + url);
    }

    function getHeader () {
        return {
            'title': $('.header-title > a'),
            'loginBtn': $('.header-login'),
            'userName': $('.header-user-name'),
            'dropdown': $('.header-dropdown'),
            'dropdownToggle': $('.dropdown-toggle'),
            'dropdownMenu': $('.header-dropdown-menu'),
            'logoutLink': $('.logout-link')
        };
    }

    function takeScreenshotIfFail () {
        var fs = require('fs');
        var currentSpec = jasmine.getEnv().currentSpec;
        var passed = currentSpec.results().passed();
        if (!passed) {
            browser.takeScreenshot().then(function (png) {
                browser.getCapabilities().then(function (capabilities) {
                    var browserName = capabilities.caps_.browserName;
                    var filename = browserName + '-' +
                        currentSpec.description.replace(/[ :]/g, '-') + '.png';
                    var stream = fs.createWriteStream(browser.params.screenshotDir + filename);
                    stream.write(new Buffer(png, 'base64'));
                    stream.end();
                });
            });
        }
    }

    function waitForPromiseTest (promiseFn, testFn) {
        browser.wait(function () {
            var deferred = protractor.promise.defer();
            promiseFn.then(function (data) {
                deferred.fulfill(testFn(data));
            });
            return deferred.promise;
        }, browser.params.timeout);
    }

    function expectUrlToMatch (url) {
        expect(browser.getCurrentUrl()).toMatch(new RegExp(url));
    }

};
