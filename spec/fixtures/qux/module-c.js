define(function() {
	var externalAModule = null;

	mcReqJs.load({
        "projectId":"bar",
        "modules":"module-a",
        "callback":function(moduleA) {
        	externalAModule = moduleA;
        }
    });

	return {
		"speak":function() {console.log("project: foo; module: C")},
		"name":"module-c",
		"project":"qux",
		"getExternalProjectBarModuleA": function(){
			return  externalAModule;
		}
	}
});