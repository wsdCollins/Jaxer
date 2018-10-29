/* ***** LICENSE BLOCK *****
 * Version: GPL 3
 *
 * This program is Copyright (C) 2018 Web Service Development
 * This program is licensed under the GNU General Public license, version 3 (GPL).
 *
 * This program is distributed in the hope that it will be useful, but
 * AS-IS and WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE, TITLE, or
 * NONINFRINGEMENT. Redistribution, except as permitted by the GPL,
 * is prohibited.
 *
 * You can redistribute and/or modify this program under the terms of the GPL,
 * as published by the Free Software Foundation.  You should
 * have received a copy of the GNU General Public License, Version 3 along
 * with this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Any modifications to this file must keep this entire header intact.
 *
 * ***** END LICENSE BLOCK ***** */

const Jaxer = {

	// Namespace for Proxy Functions

	async : {},
	
	Callback : {},

	// Options for calling Proxy

	Options : {
		
		uri : "/jaxer-callback",

		timeout : 5000

	},

	// Function to create Proxies

	createProxies : function(proxyNames) {

		for (var i = 0; i < proxyNames.length; i++) {
			
			var name = proxyNames[i];
			Jaxer.async[name] = Jaxer.remoteAsync.bind(name);

		}

	},

	remoteAsync : function() {

		return new Promise( (resolve, reject) => {

			var fn = this;
			var args = arguments;
			
			Jaxer.sendRequest(fn, args, function(err, res) {
				if(err) {
					throw err;
				}
				
				resolve(res.returnValue);

				// console.log(res);
			});

		});

	},

	createQuery : function(functionName, paramsToPass) {

		var parts = {};

		if (paramsToPass == null) {
			paramsToPass = [];
		}

		if (!Array.isArray(paramsToPass)) {
			paramsToPass = [paramsToPass];
		}

		var serializedParams = [];

		for (var i = 0; i < paramsToPass.length; i++) {

			var param = paramsToPass[i];
			var serializedParam = JSON.stringify(param);
			serializedParams.push(serializedParam);

		}

		var parts = {
			pageSignature : Jaxer.Callback.pageSignature.toString(),
			pageName : Jaxer.Callback.pageName,
			callingPage : Jaxer.Callback.callingPage,
			methodName : functionName,
			params : "[" + serializedParams.join(",") + "]",
			uid : Date.now() + "_" + Math.round(Math.random() * 1000000)
		};

		var query = [];
		for(var key in parts) {
			query.push( key + "=" + encodeURIComponent(parts[key]) );
		}
		
		return query.join("&");

	},

	sendRequest(fn, args, cb) {
		
		var query = Jaxer.createQuery(fn, args);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", Jaxer.Options.uri);
		xhr.responseType = "text";
		
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		xhr.send(query);

		xhr.onload = function() {
			
			var response = JSON.parse(xhr.responseText);
			cb(null, response);

		}

	}

};

// End program

