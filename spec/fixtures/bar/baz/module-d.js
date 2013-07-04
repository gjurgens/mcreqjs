define(["module-b"],function(moduleB) {
	return {
		"speak":function() {console.log("project: bar; module: D")},
		"name":"module-d",
		"submodule":moduleB,
		"project":"bar"
	}
})