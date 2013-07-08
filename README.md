# RequireJS multi-project manager [![Build Status](https://travis-ci.org/gjurgens/mcreqjs.png?branch=master)](https://travis-ci.org/gjurgens/mcreqjs)

Handle multiple RequireJS configurations on the same environment.

## Getting Started

This library is for applications that needs multiple projects using RequireJS to be loaded on the same environment, keeping their configurations isolated, avoiding conflicts between them.

## For example
### Files
```
/foo/
	/baz/
    	/module-b.js
    /main.js
    /module-a.js
/bar/
	/baz/
    	/module-b.js
    /main.js
    /module-a.js
/qux/
	/module-a.js
    /module-b.js
/index.html
```
#### index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <title>mcReqJs Sample</title>
    <script type="text/javascript" src="lib/require-1.0.7.js"></script>
    <script type="text/javascript" src="lib/mcreqjs-0.0.1.js"></script>
    <script type="text/javascript">
      mcReqJs.register({
        "id":"qux",
        "baseUrl":"/qux"
      });
    </script>
  </head>
  <h1>HTML Stuff</h1>
  <body>
    <script type="text/javascript">
      mcReqJs.register({
        "id":"bar",
        "baseUrl":"/bar",
        "modules":"main"
      });
    </script>
    <script type="text/javascript">
      mcReqJs.register({
        "id":"foo",
        "baseUrl":"/foo",
        "modules":"main"
      });
    </script>
  </body>
</html>
```
First it loads RequireJS an mcReqJs libraries on the head tag, and later declares tree different AMD javascript libraries, with a different configuration for each one. Foo and Bar loads it's main modules after registering, and Qux, only registers it's baseUrl and id. Qux project is registered on the head tag, because project Bar has a module that depends on it. Project Qux has no module defined on the register method, so, registering it on the head tag, should not have any performance impact.

### Foo JavaScript Project
This is a 3 AMD modules sample project. Main module is loaded on the register method on index.html, and it starts the chanin of dependencies, loading module B who loads module C located on folder baz. Keep in mind is that all dependencies are relative to the baseUrl defined on index.html
#### foo/main.js
```js
define(["module-a"], function(moduleA) {
	return {
		"name":"main",
		"submodule":moduleA,
		"project":"foo"
	};
});
```
#### foo/module-a.js
```js
define(["baz/module-b"],function(moduleB) {
	return {
		"name":"module-a",
		"submodule":moduleB,
		"project":"foo"
	}
});
```
#### foo/baz/module-b.js
```js
define(function() {
	return {
		"name":"module-b",
		"project":"foo"
	}
});
```

### Bar JavaScript Project
This project has the same structure an dependencies chain that Foo. The only difference is that module A loads a module from de Qux project using the load method.
#### bar/main.js
```js
define(["module-a"], function(moduleA) {
	return {
		"name":"main",
		"submodule":moduleA,
		"project":"bar"
	};
});
```
#### bar/module-a.js
```js
define(["baz/module-b"],function(moduleB) {
	//Loading an external project module
	mcReqJs.load({
        "projectId":"qux",
        "modules":"module-a",
        "callback":function(moduleA) {
        	externalAModule = moduleA;
        }
    });
	return {
		"name":"module-a",
		"submodule":moduleB,
		"project":"bar"
	}
});
```
#### bar/baz/module-b.js
```js
define(function() {
	return {
		"name":"module-b",
		"project":"bar"
	}
});
```
### Qux JavaScript Project
This Project is referenced from Bar project.
#### qux/module-a.js
```js
define(["module-b"], function(moduleB) {
	return {
		"name":"module-a",
		"submodule":moduleB,
		"project":"qux"
	};
});
```
#### qux/module-b.js
```js
define(function() {
	return {
		"name":"module-b",
		"project":"qux"
	}
});
```
