/*!
 * mcReqJs - v1.1.0 - 2014-12-18
 * (Handle mutiple projects using different RequireJs configuration and context on the same ambient)
 *
 * Author: Gabriel Jurgens (https://github.com/gjurgens/)
 */

/*! 
 * Licensed under the MIT license:
 *
 * Copyright (c) 2014 Gabriel Jürgens, contributors
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */ 



(function(root){
	if(root.mcReqJs !== undefined || (typeof global !== 'undefined' && global.mcReqJs !== undefined)) {
		throw new Error("Global instance of mcReqJs shoud not be loaded more than once");
	} else {
		root.mcReqJs = (function() {
			var projects = [];

			var screamAndAbort = function(method,message) {
				throw new Error("mcReqJs." + method + ": " + message);
			};

			var validateStringParam = function(paramName, value, method) {
				if(value === undefined) {screamAndAbort(method,"'" + paramName + "' param is mandatory.");}
				if(typeof value !== "string") {screamAndAbort(method,"Invalid project '" + paramName + "' param type. Must be string.");}
				if(value === "") {screamAndAbort(method,"Project '" + paramName + "' can not be empty.");}
			};

			var validateModules = function(modules,method,mandatory) {
				if(modules !== undefined && modules !== "") {
					if(Object.prototype.toString.call(modules) !== '[object Array]' ) {
						if(typeof modules !== "string") {
							screamAndAbort(method,"Modules param should be a string or an array of strings.");
						}
					} else {
						if(modules.length <= 0) {
							screamAndAbort(method,"Modules param array should not be empty.");
						} else {
							for(var i = 0; i < modules.length; i++) {
								if(typeof modules[i] !== "string" || modules[i] === "") {
									screamAndAbort(method,"Modules param array should not contain empty or non string values.");
								}
							}
						}
					}
				} else if(mandatory){
					screamAndAbort(method,"Modules param is mandatory.");
				}
			};

			var register = function(project) {
				//VALIDATIONS
				if(typeof requirejs !== "function") {screamAndAbort("register","Requirejs should be loaded before registering any project.");}
				if(typeof project !== "object") {screamAndAbort("register","Invalid param type.");}
				validateStringParam("id",project.id,"register");
				validateStringParam("baseUrl",project.baseUrl,"register");
				validateModules(project.modules,"register",false);
				if(isRegistered(project.id)) {screamAndAbort("register","Project id: '" + project.id +" is allready taken.");}
				if(!(project.callback === undefined || typeof project.callback === "function")) {screamAndAbort("register","Invalid callback param type. Should be a function.");}
				if((project.context !== undefined && project.context !== project.id)) {screamAndAbort("register","If context param is defined, it must be the same as id.");}

				//Prepearing requireJs Configuration
				project.context=project.id;

				//Save Config
				projects[project.id] = project;

				//Store callback reference before removing from projec object. The callback will be called through the "load" method automatically
				var callback = project.callback;
				delete project.callback;

				//Init Project require Handler
				projects[project.id].requireHandle = requirejs.config(project);
				
				if(project.modules !== undefined  && project.modules !== "") {
					load({"projectId":project.id, "modules":project.modules, "callback":callback});
				}
			};

			var isRegistered = function(projectId) {
				return projects[projectId] !== undefined;
			};

			var load = function(params) {
				if(typeof params !== "object") {screamAndAbort("load","Invalid param type.");}
				validateStringParam("projectId",params.projectId,"load");
				if(projects[params.projectId] === undefined) {screamAndAbort("load","projectId: '" + params.projectId +"' is not registered.");}
				
				validateModules(params.modules,"load",true);
				if(typeof params.modules === "string") {
					params.modules = [params.modules];
				}

				if(!(params.callback === undefined || typeof params.callback === "function")) {screamAndAbort("load","Invalid callback param type. Should be a function.");}
				if(params.callback === undefined) {params.callback = function(){};}

				if(!(params.onError === undefined || typeof params.onError === "function")) {screamAndAbort("load","Invalid onError param type. Should be a function.");}
				if(params.onError === undefined) {params.onError = function(error){throw error;};}

				//Adding Require as a dependency to itself to conserve context
				params.modules.push("require");
				return projects[params.projectId].requireHandle(params.modules,params.callback,params.onError);
			};

			var inject = function(projectId, name, callback) {
				if(projects[projectId] === undefined) {screamAndAbort("inject","projectId: '" + projectId +"' is not registered.");}
				if(!(callback === undefined || typeof callback === "function")) {screamAndAbort("inject","Invalid callback type. Should be a function.");}
				if(!(name === undefined || typeof name === "string")) {screamAndAbort("inject","Invalid name type. Should be a string.");}
				require.s.contexts[projectId].defined[name] = callback();
			};

			return {
				"register":register,
				"load":load,
				"isRegistered":isRegistered,
				"inject":inject
			};
		})();
		if(typeof global !== 'undefined') {global.mcReqJs = root.mcReqJs;}
	}
})(this);