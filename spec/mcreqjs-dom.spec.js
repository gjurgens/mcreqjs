var inNodeJs = false;
if (typeof define !== 'function') {
    requirejs = require('requirejs');

    define = require('amdefine')(module);
    require("../lib/mcreqjs");
    inNodeJs = true;
    requirejs.onError = function(err) {
        describe("RequireJS unhandled Errors", function() {
            it("No Error",function() {
                expect(err).toBeUndefined();
            });
        });
    };
}

define(function() {
    describe("mcReqJs DOM", function () {

        it("Global object is defined", function () {
            expect(mcReqJs).toBeDefined();
            expect(typeof mcReqJs).toEqual("object");
        });

        describe("Public Interface", function() {
            it("register is a function",function() {
                expect(typeof mcReqJs.register).toEqual("function");
            });
            it("load is a function",function() {
                expect(typeof mcReqJs.load).toEqual("function");
            });
            it("isRegistered is a function",function() {
                expect(typeof mcReqJs.isRegistered).toEqual("function");
            });
        });
        
        describe("jQuery before loading through mcreqjs", function() {
            it("jQuery is a function",function() {
                expect(typeof jQuery).toEqual("function");
            });
            it("$ is a function",function() {
                expect(typeof $).toEqual("function");
            });
        });

        describe("jQuery.tmpl before loading through mcreqjs", function() {
            it("jQuery.tmpl is a function",function() {
                expect(typeof jQuery.tmpl).toEqual("function");
            });
            it("$.tmpl is a function",function() {
                expect(typeof $.tmpl).toEqual("function");
            });
        });

        describe("Project foo-jquery",function() {
            var mainModule = null;
            var cModule = null;
            var dModule = null;
            var registered = false;

            it("foo shoud not be registered before calling register", function() {
                expect(mcReqJs.isRegistered("foo-jquery")).toBeFalsy();
            });

            runs(function() {
                var config = {
                    "id":"foo-jquery",
                    "baseUrl":"spec/fixtures/foo-jquery",
                    "modules":"main",
                    "paths":{
                        "jquery": "../../../vendor/jquery-1.10.2.min"
                    },
                    map: {
                        '*': { 'jquery': 'jquery-noconflict' },
                        'jquery-noconflict': { 'jquery': 'jquery' }
                    },
                    "callback":function(main){
                        mainModule = main !== undefined ? main:null;
                        registered = true;
                    }
                };

                if(!inNodeJs) {
                    config.urlArgs = "bust=" +  (new Date()).getTime();
                }

                mcReqJs.register(config);

            });

            it("foo-jquery shoud be registered after calling register", function() {
                waitsFor(function() {
                    return registered;
                }, "foo registration timeout", 1000);

                runs(function() {
                    expect(mcReqJs.isRegistered("foo-jquery")).toBeTruthy();
                });
            });

            it("foo-jquery main module shoud be loaded", function() {
                waitsFor(function() {
                    return mainModule !== null;
                }, "main module timeout", 1000);

                runs(function() {
                    expect(typeof mainModule === "object").toBeTruthy();
                    expect(mainModule.project).toEqual("foo-jquery");
                    expect(mainModule.name).toEqual("main");
                });
            });

            it("foo-jquery main submodule A shoud have jQuery injected", function() {
                var moduleA = mainModule.submodule;
                expect(typeof moduleA.$).toEqual("function");
            });

            it("foo-jquery main submodule A shoud have jQuery injected with no external plugin", function() {
                var moduleA = mainModule.submodule;
                expect(typeof moduleA.$.tmpl).toEqual("undefined");
            });

            describe("external jQuery after loading through mcreqjs", function() {
                it("jQuery is a function",function() {
                    expect(typeof jQuery).toEqual("function");
                });
                it("$ is a function",function() {
                    expect(typeof $).toEqual("function");
                });
            });

            describe("external jQuery.tmpl after loading through mcreqjs", function() {
                it("jQuery.tmpl is a function",function() {
                    expect(typeof jQuery.tmpl).toEqual("function");
                });
                it("$.tmpl is a function",function() {
                    expect(typeof $.tmpl).toEqual("function");
                });
            });

        });

    });
});