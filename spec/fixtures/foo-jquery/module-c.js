define(["module-b"],function(moduleB) {
	return {
		"speak":function() {console.log("project: foo; module: C")},
		"name":"module-c",
		"submodule":moduleB,
		"project":"foo-jquery"
	}
})