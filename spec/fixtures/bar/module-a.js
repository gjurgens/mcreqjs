define(["module-b","baz/module-d"],function(moduleB,moduleD) {
	var externalAModule = null;

	mcReqJs.load({
        "projectId":"foo",
        "modules":"module-a",
        "callback":function(moduleA) {
        	externalAModule = moduleA;
        }
    });

	return {
		"speak":function() {console.log("project: bar; module: A")},
		"name":"module-a",
		"submodule":moduleB,
		"submoduleInBaz":moduleD,
		"project":"bar",
		"getExternalProjectFooModuleA": function(){
			return  externalAModule;
		}
	}
})