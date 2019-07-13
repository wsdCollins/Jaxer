/******************************************************************************
 *
 * MIT License
 *
 * Copyright (c) 2018, 2019 Web Service Development
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *****************************************************************************/

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

	// Promise Wrapper for XMLHttpRequest

	remoteAsync : function() {

		return new Promise( (resolve, reject) => {

			let fn = this;
			let args = Array.prototype.slice.call(arguments);
			
			Jaxer.sendRequest(fn, args, function(err, res) {
				if(err) {
					return reject(err);
				}

				resolve(res);
			});

		});

	},

	// Create form url-encoded parameters to pass to server

	createQuery : function(functionName, paramsToPass) {

		if (typeof paramsToPass === 'undefined') {
			paramsToPass = [];
		}

		if (!Array.isArray(paramsToPass)) {
			paramsToPass = [paramsToPass];
		}

		let serializedParams = [];

		for (let i = 0; i < paramsToPass.length; i++) {

			var param = paramsToPass[i];
			var serializedParam = JSON.stringify(param);
			serializedParams.push(serializedParam);

		}

		let parts = {
			pageSignature : Jaxer.Callback.pageSignature.toString(),
			pageName : Jaxer.Callback.pageName,
			callingPage : Jaxer.Callback.callingPage,
			methodName : functionName,
			params : "[" + serializedParams.join(",") + "]",
			uid : Date.now() + "_" + Math.round(Math.random() * 1000000)
		};

		let query = [];
		for(let key in parts) {
			query.push( key + "=" + encodeURIComponent(parts[key]) );
		}
		
		return query.join("&");

	},

	// Execute XML Http Request

	sendRequest(fn, args, cb) {
		
		let query = Jaxer.createQuery(fn, args);
		let xhr = new XMLHttpRequest();
		xhr.open("POST", Jaxer.Options.uri);
		xhr.responseType = "text";
		
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.send(query);

		xhr.onload = () => {
			
			let res;
			try {
				res = JSON.parse(xhr.responseText);
			} catch(err) {
				return cb(err, null);
			}
			
			if(res.exception) {
				return cb(res.exception.message);
			}

			cb(null, res.returnValue);

		}

	}

};

// End program

