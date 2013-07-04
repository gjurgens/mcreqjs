define(["module-b","baz/module-d"],function(moduleB,moduleD) {
	return {
		"speak":function() {console.log("project: bar; module: A")},
		"name":"module-a",
		"submodule":moduleB,
		"submoduleInBaz":moduleD,
		"project":"bar"
	}
})