define(["module-a"], function(moduleA) {
	console.log(moduleA.$.tmpl)
	return {
		"name":"main",
		"submodule":moduleA,
		"project":"foo-jquery"
	};
})