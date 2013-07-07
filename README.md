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
    <script type="text/javascript">
      mcReqJs.register({
        "id":"qux",
        "baseUrl":"/qux"
      });
    </script>
  </body>
</html>
```
First it loads RequireJS an mcReqJs libraries on the head tag, and later declares tree different AMD javascript libraries, with a different configuration for each one. Foo and Bar loads it's main modules after registering, and Qux, only registers it's baseUrl and id.

### Foo JavaScript Project
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
