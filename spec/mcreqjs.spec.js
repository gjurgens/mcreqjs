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
    describe("mcReqJs", function () {

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
        
        describe("Project foo",function() {
            var mainModule = null;
            var cModule = null;
            var dModule = null;
            var registered = false;

            it("foo shoud not be registered before calling register", function() {
                expect(mcReqJs.isRegistered("foo")).toBeFalsy();
            });

            runs(function() {
                var config = {
                    "id":"foo",
                    "baseUrl":"spec/fixtures/foo",
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

            it("foo shoud be registered after calling register", function() {
                waitsFor(function() {
                    return registered;
                }, "foo registration timeout", 1000);

                runs(function() {
                    expect(mcReqJs.isRegistered("foo")).toBeTruthy();
                });
            });

            it("foo main module shoud be loaded", function() {
                waitsFor(function() {
                    return mainModule !== null;
                }, "main module timeout", 1000);

                runs(function() {
                    expect(typeof mainModule === "object").toBeTruthy();
                    expect(mainModule.project).toEqual("foo");
                    expect(mainModule.name).toEqual("main");
                });
            });
            
            it("foo main submodule A shoud be loaded", function() {
                expect(typeof mainModule.submodule === "object").toBeTruthy();
                expect(mainModule.submodule.project).toEqual("foo");
                expect(mainModule.submodule.name).toEqual("module-a");
            });

            it("foo main submodule A, submodule B shoud be loaded", function() {
                expect(typeof mainModule.submodule.submodule === "object").toBeTruthy();
                expect(mainModule.submodule.submodule.project).toEqual("foo");
                expect(mainModule.submodule.submodule.name).toEqual("module-b");
            });

            it("foo main submodule A, submodule C in folder baz shoud be loaded", function() {
                expect(typeof mainModule.submodule.submoduleInBaz === "object").toBeTruthy();
                expect(mainModule.submodule.submoduleInBaz.project).toEqual("foo");
                expect(mainModule.submodule.submoduleInBaz.name).toEqual("module-d");
            });

            it("foo main submodule A, submodule C in folder baz submodule shoud be loaded", function() {
                expect(typeof mainModule.submodule.submoduleInBaz.submodule === "object").toBeTruthy();
                expect(mainModule.submodule.submoduleInBaz.submodule.project).toEqual("foo");
                expect(mainModule.submodule.submoduleInBaz.submodule.name).toEqual("module-b");
            });

            describe("manualy loaded module C", function(){
                it("module-c should not be loaded before manulay loading", function() {
                    expect(cModule).toEqual(null);
                });

                runs(function(){
                    mcReqJs.load({
                        "projectId":"foo",
                        "modules":["module-c"],
                        "callback":function(moduleC,moduleI) {
                            cModule = moduleC !== undefined ? moduleC:null;
                        }
                    });
                });

                it("module-c should be loaded after manulay load it", function() {
                    waitsFor(function() {
                        return cModule !== null;
                    }, "module-c registration timeout", 1000);

                    runs(function() {
                        expect(typeof cModule === "object").toBeTruthy();
                        expect(cModule.project).toEqual("foo");
                        expect(cModule.name).toEqual("module-c");
                    });
                });

                it("foo module-c submodule b shoud be loaded", function() {
                    expect(typeof cModule.submodule === "object").toBeTruthy();
                    expect(cModule.submodule.project).toEqual("foo");
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

        describe("Project foo redefined",function() {
            it("foo shoud be registered before calling register", function() {
                expect(mcReqJs.isRegistered("foo")).toBeTruthy();
            });

            it("redefining foo should throws an error.",function(){
                expect(function() {
                    mcReqJs.register({
                        "id":"foo",
                        "baseUrl":"spec/fixtures/foo",
                        "modules":"main"
                    });
                }).toThrow(new Error("mcReqJs.register: Project id: 'foo is allready taken."));
            });
        });

        describe("Project bar",function() {
            var mainModule = null;
            var cModule = null;
            var dModule = null;
            var registered = false;

            it("foo shoud not be registered before calling register", function() {
                expect(mcReqJs.isRegistered("bar")).toBeFalsy();
            });

            runs(function() {
                var config = {
                    "id":"bar",
                    "baseUrl":"spec/fixtures/bar",
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

            it("bar shoud be registered after calling register", function() {
                waitsFor(function() {
                    return registered;
                }, "bar registration timeout", 1000);

                runs(function() {
                    expect(mcReqJs.isRegistered("bar")).toBeTruthy();
                });
            });

            it("bar main module shoud be loaded", function() {
                waitsFor(function() {
                    return mainModule !== null;
                }, "main module timeout", 1000);

                runs(function() {
                    expect(typeof mainModule === "object").toBeTruthy();
                    expect(mainModule.project).toEqual("bar");
                    expect(mainModule.name).toEqual("main");
                });
            });
            
            it("bar main submodule A shoud be loaded", function() {
                expect(typeof mainModule.submodule === "object").toBeTruthy();
                expect(mainModule.submodule.project).toEqual("bar");
                expect(mainModule.submodule.name).toEqual("module-a");
            });

            it("bar main submodule A, submodule B shoud be loaded", function() {
                expect(typeof mainModule.submodule.submodule === "object").toBeTruthy();
                expect(mainModule.submodule.submodule.project).toEqual("bar");
                expect(mainModule.submodule.submodule.name).toEqual("module-b");
            });

            it("bar main submodule A, submodule C in folder baz shoud be loaded", function() {
                expect(typeof mainModule.submodule.submoduleInBaz === "object").toBeTruthy();
                expect(mainModule.submodule.submoduleInBaz.project).toEqual("bar");
                expect(mainModule.submodule.submoduleInBaz.name).toEqual("module-d");
            });

            it("bar main submodule A, submodule C in folder baz submodule shoud be loaded", function() {
                expect(typeof mainModule.submodule.submoduleInBaz.submodule === "object").toBeTruthy();
                expect(mainModule.submodule.submoduleInBaz.submodule.project).toEqual("bar");
                expect(mainModule.submodule.submoduleInBaz.submodule.name).toEqual("module-b");
            });

            describe("manualy loaded module C", function(){
                it("module-c should not be loaded before manulay loading", function() {
                    expect(cModule).toEqual(null);
                });

                runs(function(){
                    mcReqJs.load({
                        "projectId":"bar",
                        "modules":"module-c",
                        "callback":function(moduleC) {
                            cModule = moduleC !== undefined ? moduleC:null;
                        }
                    });
                });

                it("module-c should be loaded after manulay load it", function() {
                    waitsFor(function() {
                        return cModule !== null;
                    }, "module-c registration timeout", 1000);

                    runs(function() {
                        expect(typeof cModule === "object").toBeTruthy();
                        expect(cModule.project).toEqual("bar");
                        expect(cModule.name).toEqual("module-c");
                    });
                });

                it("bar module-c submodule b shoud be loaded", function() {
                    expect(typeof cModule.submodule === "object").toBeTruthy();
                    expect(cModule.submodule.project).toEqual("bar");
                    expect(cModule.submodule.name).toEqual("module-b");
                });
            });

            describe("manualy loaded module D from folder baz", function(){
                it("module-d should not be loaded before manulay loading", function() {
                    expect(dModule).toEqual(null);
                });

                runs(function(){
                    mcReqJs.load({
                        "projectId":"bar",
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
                        expect(dModule.project).toEqual("bar");
                        expect(dModule.name).toEqual("module-d");
                    });
                });

                it("bar module-d in folder baz submodule b shoud be loaded", function() {
                    expect(typeof dModule.submodule === "object").toBeTruthy();
                    expect(dModule.submodule.project).toEqual("bar");
                    expect(dModule.submodule.name).toEqual("module-b");
                });
            });
        });

        describe("Project qux",function() {
            it("qux shoud not be registered before calling register", function() {
                expect(mcReqJs.isRegistered("qux")).toBeFalsy();
            });

            it("Registering a project with no params should throw an error.",function(){
                expect(function() {
                        mcReqJs.register();
                }).toThrow(new Error("mcReqJs.register: Invalid param type."));
            });

            it("qux shoud not be registered after registering a project with no params", function() {
                expect(mcReqJs.isRegistered("qux")).toBeFalsy();
            });


            it("Registering a project with a non object param should throw an error.",function(){
                expect(function() {
                        mcReqJs.register("this is a string");
                }).toThrow(new Error("mcReqJs.register: Invalid param type."));
                expect(function() {
                        mcReqJs.register(123);
                }).toThrow(new Error("mcReqJs.register: Invalid param type."));
                expect(function() {
                        mcReqJs.register(undefined);
                }).toThrow(new Error("mcReqJs.register: Invalid param type."));
            });

            it("qux shoud not be registered after registering a project with a non object param", function() {
                expect(mcReqJs.isRegistered("qux")).toBeFalsy();
            });

            it("Registering a project with no or incorrect id should throw an error.",function(){
                expect(function() {
                        mcReqJs.register({
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: 'id' param is mandatory."));
                expect(function() {
                        mcReqJs.register({
                            "id":"",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: Project 'id' can not be empty."));
                expect(function() {
                        mcReqJs.register({
                            "id":1,
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid project 'id' param type. Must be string."));
                expect(function() {
                        mcReqJs.register({
                            "id":{"id":"qux"},
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid project 'id' param type. Must be string."));
                expect(function() {
                        mcReqJs.register({
                            "id":["qux"],
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid project 'id' param type. Must be string."));
            });

            it("qux shoud not be registered after registering a project with no or incorrect id", function() {
                expect(mcReqJs.isRegistered("qux")).toBeFalsy();
            });

            it("Registering a project with no or incorrect baseUrl should throw an error.",function(){
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: 'baseUrl' param is mandatory."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: Project 'baseUrl' can not be empty."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":1,
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid project 'baseUrl' param type. Must be string."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":{"baseUrl":"spec/fixtures/qux"},
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid project 'baseUrl' param type. Must be string."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":["spec/fixtures/qux"],
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid project 'baseUrl' param type. Must be string."));
            });

            it("qux shoud not be registered after registering a project with no or incorrect baseUrl", function() {
                expect(mcReqJs.isRegistered("qux")).toBeFalsy();
            });

            it("Registering a project with incorrect modules should throw an error.",function(){
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":1
                        });
                }).toThrow(new Error("mcReqJs.register: Modules param should be a string or an array of strings."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":{"modules":"main"}
                        });
                }).toThrow(new Error("mcReqJs.register: Modules param should be a string or an array of strings."));
            });

            it("qux shoud not be registered after registering a project with incorrect modules", function() {
                expect(mcReqJs.isRegistered("qux")).toBeFalsy();
            });

            it("Registering a project with incorrect callbak should throw an error.",function(){
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main",
                            "callback":"this is a string"
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid callback param type. Should be a function."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main",
                            "callback":null
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid callback param type. Should be a function."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main",
                            "callback":1
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid callback param type. Should be a function."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main",
                            "callback":""
                        });
                }).toThrow(new Error("mcReqJs.register: Invalid callback param type. Should be a function."));
            });

            it("qux shoud not be registered after registering a project with incorrect callback", function() {
                expect(mcReqJs.isRegistered("qux")).toBeFalsy();
            });

            it("Registering a project with incorrect context should throw an error.",function(){
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main",
                            "context":"notQux"
                        });
                }).toThrow(new Error("mcReqJs.register: If context param is defined, it must be the same as id."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main",
                            "context":""
                        });
                }).toThrow(new Error("mcReqJs.register: If context param is defined, it must be the same as id."));
                expect(function() {
                        mcReqJs.register({
                            "id":"qux",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main",
                            "context":null
                        });
                }).toThrow(new Error("mcReqJs.register: If context param is defined, it must be the same as id."));
                expect(function() {
                        mcReqJs.register({
                            "id":"1",
                            "baseUrl":"spec/fixtures/qux",
                            "modules":"main",
                            "context":1
                        });
                }).toThrow(new Error("mcReqJs.register: If context param is defined, it must be the same as id."));
            });

            it("qux shoud not be registered after registering a project with incorrect context", function() {
                expect(mcReqJs.isRegistered("qux")).toBeFalsy();
            });

            runs(function() {
                var config = {
                    "id":"qux",
                    "baseUrl":"spec/fixtures/qux",
                };
                if(!inNodeJs) {
                    config.urlArgs = "bust=" +  (new Date()).getTime();
                }
                mcReqJs.register(config);
            });

            it("qux shoud be registered after registering a project with no modules", function() {
                expect(mcReqJs.isRegistered("qux")).toBeTruthy();
            });

            it("qux loading a module with no or incorrect projectId should throw an error.",function(){
                expect(function() {
                        mcReqJs.load({
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.load: 'projectId' param is mandatory."));
                expect(function() {
                        mcReqJs.load({
                            "id":"qux",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.load: 'projectId' param is mandatory."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":1,
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.load: Invalid project 'projectId' param type. Must be string."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":{"projectId":"qux"},
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.load: Invalid project 'projectId' param type. Must be string."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.load: Project 'projectId' can not be empty."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"nonexistent",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.load: projectId: 'nonexistent' is not registered."));
            });

            it("qux loading a module with no or incorrect modules should throw an error.",function(){
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux"
                        });
                }).toThrow(new Error("mcReqJs.load: Modules param is mandatory."));
                expect(function() {
                        mcReqJs.load({
                            "id":"qux",
                            "modules":"main"
                        });
                }).toThrow(new Error("mcReqJs.load: 'projectId' param is mandatory."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":""
                        });
                }).toThrow(new Error("mcReqJs.load: Modules param is mandatory."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":[]
                        });
                }).toThrow(new Error("mcReqJs.load: Modules param array should not be empty."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":[""]
                        });
                }).toThrow(new Error("mcReqJs.load: Modules param array should not contain empty or non string values."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":["main",""]
                        });
                }).toThrow(new Error("mcReqJs.load: Modules param array should not contain empty or non string values."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":["main",1]
                        });
                }).toThrow(new Error("mcReqJs.load: Modules param array should not contain empty or non string values."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":["main",{"module":"main"}]
                        });
                }).toThrow(new Error("mcReqJs.load: Modules param array should not contain empty or non string values."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":1
                        });
                }).toThrow(new Error("mcReqJs.load: Modules param should be a string or an array of strings."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":null
                        });
                }).toThrow(new Error("mcReqJs.load: Modules param should be a string or an array of strings."));
            });

            it("qux loading a module with incorrect callback should throw an error.",function(){
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":"main",
                            "callback":"this is a string"
                        });
                }).toThrow(new Error("mcReqJs.load: Invalid callback param type. Should be a function."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":"main",
                            "callback":1
                        });
                }).toThrow(new Error("mcReqJs.load: Invalid callback param type. Should be a function."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":"main",
                            "callback":null
                        });
                }).toThrow(new Error("mcReqJs.load: Invalid callback param type. Should be a function."));
                expect(function() {
                        mcReqJs.load({
                            "projectId":"qux",
                            "modules":"main",
                            "callback":{"callback":function(){}}
                        });
                }).toThrow(new Error("mcReqJs.load: Invalid callback param type. Should be a function."));
            });
        });

        describe("Project foo after other projects",function() {
            var aModule = null;
            it("foo shoud be registered before calling register", function() {
                expect(mcReqJs.isRegistered("foo")).toBeTruthy();
            });
            describe("manualy loaded module A", function(){
                it("module-a should not be loaded before manulay loading", function() {
                    expect(aModule).toEqual(null);
                });

                runs(function(){
                    mcReqJs.load({
                        "projectId":"foo",
                        "modules":"module-a",
                        "callback":function(moduleA) {
                            aModule = moduleA !== undefined ? moduleA:null;
                        }
                    });
                });

                it("module-a should be loaded after manulay load it", function() {
                    waitsFor(function() {
                        return aModule !== null;
                    }, "module-a registration timeout", 1000);

                    runs(function() {
                        expect(typeof aModule === "object").toBeTruthy();
                        expect(aModule.project).toEqual("foo");
                        expect(aModule.name).toEqual("module-a");
                    });
                });

                it("foo module-a submodule b shoud be loaded", function() {
                    expect(typeof aModule.submodule === "object").toBeTruthy();
                    expect(aModule.submodule.project).toEqual("foo");
                    expect(aModule.submodule.name).toEqual("module-b");
                });

                it("foo module-a submodule in baz D shoud be loaded", function() {
                    expect(typeof aModule.submoduleInBaz === "object").toBeTruthy();
                    expect(aModule.submoduleInBaz.project).toEqual("foo");
                    expect(aModule.submoduleInBaz.name).toEqual("module-d");
                });
            });
        });


        describe("Project qux loading modules with external project modules",function() {
            var cModule = null;
            var eModule = null;
            var externalBarAModule = null;
            var externalFooAModule = null;
            it("qux shoud be registered before be used with external project modules", function() {
                expect(mcReqJs.isRegistered("qux")).toBeTruthy();
            });
            it("foo shoud be registered before be used as external project", function() {
                expect(mcReqJs.isRegistered("foo")).toBeTruthy();
            });
            describe("manualy loaded module C", function(){
                it("module-c should not be loaded before manulay loading", function() {
                    expect(cModule).toEqual(null);
                });

                runs(function(){
                    mcReqJs.load({
                        "projectId":"qux",
                        "modules":"module-c",
                        "callback":function(moduleC) {
                            cModule = moduleC !== undefined ? moduleC:null;
                        }
                    });
                });

                it("module-c should be loaded after manulay load it", function() {
                    waitsFor(function() {
                        return cModule !== null;
                    }, "module-c registration timeout", 1000);

                    runs(function() {
                        expect(typeof cModule === "object").toBeTruthy();
                        expect(cModule.project).toEqual("qux");
                        expect(cModule.name).toEqual("module-c");
                    });
                });
            });

            describe("External bar module A loaded via qux module C", function(){
 
                it("qux module C should be loaded", function() {
                    expect(typeof cModule === "object").toBeTruthy();
                    expect(cModule.project).toEqual("qux");
                    expect(cModule.name).toEqual("module-c");
                });

                it("External bar module A should be loaded after manulay load qux module C", function() {
                    waitsFor(function() {
                        externalBarAModule = cModule.getExternalProjectBarModuleA();
                        return externalBarAModule !== null;
                    }, "external bar module-c registration timeout", 1000);

                    runs(function() {
                        expect(typeof externalBarAModule === "object").toBeTruthy();
                        expect(externalBarAModule.project).toEqual("bar");
                        expect(externalBarAModule.name).toEqual("module-a");
                    });
                });

                it("External bar module A submodule B should be loaded after manulay load qux module C", function() {
                    expect(typeof externalBarAModule.submodule === "object").toBeTruthy();
                    expect(externalBarAModule.submodule.project).toEqual("bar");
                    expect(externalBarAModule.submodule.name).toEqual("module-b");
                });

                it("External bar module A submoduleInBaz D should be loaded after manulay load qux module C", function() {
                    expect(typeof externalBarAModule.submoduleInBaz === "object").toBeTruthy();
                    expect(externalBarAModule.submoduleInBaz.project).toEqual("bar");
                    expect(externalBarAModule.submoduleInBaz.name).toEqual("module-d");
                });

                it("External bar module A submoduleInBaz D submodule B should be loaded after manulay load qux module C", function() {
                    expect(typeof externalBarAModule.submoduleInBaz.submodule === "object").toBeTruthy();
                    expect(externalBarAModule.submoduleInBaz.submodule.project).toEqual("bar");
                    expect(externalBarAModule.submoduleInBaz.submodule.name).toEqual("module-b");
                });


                it("External foo module A loaded via external bar module A should be loaded after manulay load qux module C", function() {
                    waitsFor(function() {
                        externalFooAModule = externalBarAModule.getExternalProjectFooModuleA();
                        return externalFooAModule !== null;
                    }, "external bar module-c registration timeout", 1000);

                    runs(function() {
                        expect(typeof externalFooAModule === "object").toBeTruthy();
                        expect(externalFooAModule.project).toEqual("foo");
                        expect(externalFooAModule.name).toEqual("module-a");
                    });
                });
            });


            describe("External bar module B loaded via qux module E using standard require", function() {
                it("module-e should not be loaded before manulay loading", function() {
                    expect(eModule).toEqual(null);
                });

                runs(function(){
                    mcReqJs.load({
                        "projectId":"qux",
                        "modules":"module-e",
                        "callback":function(moduleE) {
                            eModule = moduleE !== undefined ? moduleE:null;
                        }
                    });
                });

                it("module-e should be loaded after manulay loading", function() {
                    waitsFor(function() {
                        return eModule !== null;
                    }, "module-e registration timeout", 1000);

                    runs(function() {
                        expect(typeof eModule === "object" && eModule !== null).toBeTruthy();
                        expect(eModule.project).toEqual("qux");
                        expect(eModule.name).toEqual("module-e");
                    });
                });

                it("module-e submodule module-a should be loaded after using standard require", function() {
                    waitsFor(function() {
                        return eModule.getModuleA() !== null;
                    }, "module-e submodule A registration timeout", 1000);

                    runs(function() {
                        expect(typeof eModule.getModuleA() === "object" && eModule !== null).toBeTruthy();
                        expect(eModule.getModuleA().project).toEqual("qux");
                        expect(eModule.getModuleA().name).toEqual("module-a");
                    });
                });

                it("submodule module-b should be loaded after manulay loading module-e using standard require", function() {
                    expect(typeof eModule.getModuleA().submodule === "object" && eModule.getModuleA().submodule !== null).toBeTruthy();
                    expect(eModule.getModuleA().submodule.project).toEqual("qux");
                    expect(eModule.getModuleA().submodule.name).toEqual("module-b");
                });
            });

        });
    });
});