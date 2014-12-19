define(["module-b"],function(moduleB) {
	return {
		"speak":function() {console.log("project: foo-injected; module: D")},
		"name":"module-d",
		"submodule":moduleB,
		"project":"foo-injected"
	}
})