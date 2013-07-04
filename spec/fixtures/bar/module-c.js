define(["module-b"],function(moduleB) {
	return {
		"speak":function() {console.log("project: bar; module: C")},
		"name":"module-c",
		"submodule":moduleB,
		"project":"bar"
	}
})