# mcReqJs [![Build Status](https://travis-ci.org/gjurgens/mcreqjs.png?branch=master)](https://travis-ci.org/gjurgens/mcreqjs)
####(Multiple Configurations RequireJS)
Handle multiple RequireJS configurations on the same environment.

This library is for applications that needs multiple projects using RequireJS to be loaded on the same environment, keeping their configurations isolated, avoiding conflicts between them.

## Getting Started
The first thing, is to register the project with an `id`.
```html
<!DOCTYPE html>
<html>
  <head>
    <title>mcReqJs Sample</title>
    <script type="text/javascript" src="lib/require-2.0.6.min.js"></script>
    <script type="text/javascript" src="lib/mcreqjs-1.0.0.js"></script>
  </head>
  <h1>mcRequireJs</h1>
  <body>
    <script type="text/javascript">
      mcReqJs.register({
        "id":"bar",
        "baseUrl":"/bar",
        "modules":"main"
      });
    </script>
  </body>
</html>
```
`mcReqJs.register` is the equivalent to `requirejs.config`. It accepts the same options as requirejs. The only additional and mandatory param is `id`. This param is defined with the reqister method, and then is used to identify the instance of this project on other calls to mcReqJs. Internally, this is an alias to the `context` RequireJs config param. You can still define a `context`, but it should contains the same value as `id`.

AMD modules are defined as usual. The only differenece, is that if you need to require another module asynchronously, instead of using `require` function, is recomended to use `mcReqJs.load`, or beter, if it's not strictly necessary, you shoud load the dependency on the `define` function.

```js
//main module defined on Foo project.
define(["bar"],function(bar) {
	//Loading an external project module
    var fooModule = "not yet loaded";
	mcReqJs.load({
        "projectId":"qux",
        "modules":"foo",
        "callback":function(foo) {
        	fooModule = foo;
        }
    });
    var getFooModule = function() {
    	return fooModule;
    }
	return {
		"name":"bar",
		"submodule":bar,
		"project":"baz",
        "foo":getFooModule
	}
});
```

## Methods
##### `mcReqJs.isRegistered("projectId")`
Returns `true` if the project is defined on mcReqJs or `false` if it is not.
##### `mcReqJs.register(options)`
`options` Is the same config object passed to `requirejs` with an additional mandatory param: `id` which defines the id identify an AMD JavaScript project. 

`options.id` is an alias to the `options.context` param. If both are declared, the should have the same value, if not, an exception is thrown. This id identifies the javascript project being loaded, and grants the independent configuration from other AMD projects.

`options.modules` param, could be a string or an array of string with the modules to be loaded on the same moment of registration. They will be passed as params to the
`options.callback` function. This param is not mandatory, so, if you only need to register a project but not load any module at this time, you can ignore this param.

`options.callback` param is the function that will be called after registering the new project and loading all the `options.modules`. This function receives the return of each module as a param.

`options.baseUrl` is the same as de config param from RequireJs, and is mandatory.

##### `mcReqJs.load(options)`
`options.projectId` is the id of the project registered with the `mcReqJs.register` method. It's mandatory, and should be registred before calling this method.

`options.modules` param, could be a string or an array of string with the modules to be loaded. They will be passed as params to the `options.callback` function. This param is mandatory.

`options.callback` param is the function that will be called after all the `options.modules` are loaded. This function receives the return of each module as a param.

## Sample Application
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
