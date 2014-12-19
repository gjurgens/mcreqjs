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
            it("inject is a function",function() {
                expect(typeof mcReqJs.inject).toEqual("function");
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

        describe("Project foo-injected",function() {
            var mainModule = null;
            var cModule = null;
            var dModule = null;
            var iModule = null;
            var registered = false;

            it("foo-injected shoud not be registered before calling register", function() {
                expect(mcReqJs.isRegistered("foo-injected")).toBeFalsy();
            });

            runs(function() {
                var config = {
                    "id":"foo-injected",
                    "baseUrl":"spec/fixtures/foo-injected",
                    "modules":"main",
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

            it("foo-injected shoud be registered after calling register", function() {
                waitsFor(function() {
                    return registered;
                }, "foo-injected registration timeout", 1000);

                runs(function() {
                    expect(mcReqJs.isRegistered("foo-injected")).toBeTruthy();
                });
            });

            it("foo-injected main module shoud be loaded", function() {
                waitsFor(function() {
                    return mainModule !== null;
                }, "main module timeout", 1000);

                runs(function() {
                    expect(typeof mainModule === "object").toBeTruthy();
                    expect(mainModule.project).toEqual("foo-injected");
                    expect(mainModule.name).toEqual("main");
                });
            });
            
            it("foo-injected main submodule A shoud be loaded", function() {
                expect(typeof mainModule.submodule === "object").toBeTruthy();
                expect(mainModule.submodule.project).toEqual("foo-injected");
                expect(mainModule.submodule.name).toEqual("module-a");
            });

            it("foo-injected main submodule A, submodule B shoud be loaded", function() {
                expect(typeof mainModule.submodule.submodule === "object").toBeTruthy();
                expect(mainModule.submodule.submodule.project).toEqual("foo-injected");
                expect(mainModule.submodule.submodule.name).toEqual("module-b");
            });

            it("foo-injected main submodule A, submodule C in folder baz shoud be loaded", function() {
                expect(typeof mainModule.submodule.submoduleInBaz === "object").toBeTruthy();
                expect(mainModule.submodule.submoduleInBaz.project).toEqual("foo-injected");
                expect(mainModule.submodule.submoduleInBaz.name).toEqual("module-d");
            });

            it("foo-injected main submodule A, submodule C in folder baz submodule shoud be loaded", function() {
                expect(typeof mainModule.submodule.submoduleInBaz.submodule === "object").toBeTruthy();
                expect(mainModule.submodule.submoduleInBaz.submodule.project).toEqual("foo-injected");
                expect(mainModule.submodule.submoduleInBaz.submodule.name).toEqual("module-b");
            });

            describe("foo-injected manualy loaded module C", function(){
                it("module-c should not be loaded before manulay loading", function() {
                    expect(cModule).toEqual(null);
                });

                it("foo-injected iModule module shoud not be loaded", function(){
                    expect(iModule).toEqual(null);
                });

                runs(function(){
                    mcReqJs.inject("foo-injected","iModule",function(){
                        return {
                            "speak":function() {console.log("project: foo-injected; module: I");},
                            "name":"module-i",
                            "project":"foo-injected"
                        };
                    });
                });


                runs(function(){
                    mcReqJs.load({
                        "projectId":"foo-injected",
                        "modules":["module-c","iModule"],
                        "callback":function(moduleC,moduleI) {
                            cModule = moduleC !== undefined ? moduleC:null;
                            iModule = moduleI !== undefined ? moduleI:null;
                        }
                    });
                });

                it("foo-injected module-i should be loaded after injecting it", function() {
                    waitsFor(function() {
                        return iModule !== null;
                    }, "module-i registration timeout", 1000);

                    runs(function() {
                        expect(typeof iModule === "object").toBeTruthy();
                        expect(iModule.project).toEqual("foo-injected");
                        expect(iModule.name).toEqual("module-i");
                    });
                });

                it("foo-injected module-c should be loaded after manulay load it", function() {
                    waitsFor(function() {
                        return cModule !== null;
                    }, "module-c registration timeout", 1000);

                    runs(function() {
                        expect(typeof cModule === "object").toBeTruthy();
                        expect(cModule.project).toEqual("foo-injected");
                        expect(cModule.name).toEqual("module-c");
                    });
                });

                it("foo-injected module-c submodule b shoud be loaded", function() {
                    expect(typeof cModule.submodule === "object").toBeTruthy();
                    expect(cModule.submodule.project).toEqual("foo-injected");
                    expect(cModule.submodule.name).toEqual("module-b");
                });
            });


            describe("manualy loaded module D from folder baz", function(){
                it("module-d should not be loaded before manulay loading", function() {
                    expect(dModule).toEqual(null);
                });

                runs(function(){
                    mcReqJs.load({
                        "projectId":"foo",
                        "modules":"baz/module-d",
                        "callback":function(moduleD) {
                            dModule = moduleD !== undefined ? moduleD:null;
                        }
                    });
                });

                it("module-d in folder baz should be loaded after manulay load it", function() {
                    waitsFor(function() {
                        return dModule !== null;
                    }, "module-d registration timeout", 1000);

                    runs(function() {
                        expect(typeof dModule === "object").toBeTruthy();
                        expect(dModule.project).toEqual("foo");
                        expect(dModule.name).toEqual("module-d");
                    });
                });

                it("foo module-d in folder baz submodule b shoud be loaded", function() {
                    expect(typeof dModule.submodule === "object").toBeTruthy();
                    expect(dModule.submodule.project).toEqual("foo");
                    expect(dModule.submodule.name).toEqual("module-b");
                });
            });
        });

    });
});