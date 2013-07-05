# RequireJS multi-project manager [![Build Status](https://travis-ci.org/gjurgens/mcreqjs.png?branch=master)](https://travis-ci.org/gjurgens/mcreqjs)

Handle multiple RequireJS configurations on the same environment.

## Getting Started

This library is for applications that needs multiple projects using RequireJS to be loaded on the same environment, keeping their configurations isolated, avoiding conflicts between them.

## For example
### Project foo
```
/foo/
	/baz/
    	/module-d.js
    /main.js
    /module-a.js
    /module-b-js
    /module-c.js

```
#### main.js
```js
define(["module-a"], function(moduleA) {
	return {
		"name":"main",
		"submodule":moduleA,
		"project":"foo"
	};
});
```
#### module-a.js
```js
define(["module-b","baz/module-d"],function(moduleB,moduleD) {
	return {
		"speak":function() {console.log("project: foo; module: A")},
		"name":"module-a",
		"submodule":moduleB,
		"submoduleInBaz":moduleD,
		"project":"foo"
	}
});
```
#### module-b.js
```js
define(function() {
	return {
		"speak":function() {console.log("project: foo; module: B")},
		"name":"module-b",
		"project":"foo"
	}
});
```
#### module-c.js
```js
define(["module-b"],function(moduleB) {
	return {
		"speak":function() {console.log("project: foo; module: C")},
		"name":"module-c",
		"submodule":moduleB,
		"project":"foo"
	}
})
```


### Project bar
```
/foo/
	/baz/
    	/module-d.js
    /main.js
    /module-a.js
    /module-b-js
    /module-c.js

```