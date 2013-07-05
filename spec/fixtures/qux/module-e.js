define(function(require) {
	var externalAModule = null;
	require(["module-a"], function(moduleA) {
		externalAModule = moduleA;
	});

	return {
		"speak":function() {console.log("project: foo; module: E")},
		"name":"module-e",
		"project":"qux",
		"getModuleA": function(){
			return  externalAModule;
		}		
	}
});