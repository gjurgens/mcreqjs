define(["module-b","baz/module-d","jquery"],function(moduleB,moduleD,$) {
	return {
		"speak":function() {console.log("project: foo; module: A")},
		"name":"module-a",
		"submodule":moduleB,
		"submoduleInBaz":moduleD,
		"project":"foo-jquery",
		"$":$
	}
})