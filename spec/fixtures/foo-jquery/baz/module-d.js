define(["module-b"],function(moduleB) {
	return {
		"speak":function() {console.log("project: foo; module: D")},
		"name":"module-d",
		"submodule":moduleB,
		"project":"foo-jquery"
	}
})