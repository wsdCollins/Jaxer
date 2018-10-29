/* ***** LICENSE BLOCK *****
 * Version: GPL 3
 *
 * This program is Copyright (C) 2007-2008 Aptana, Inc. All Rights Reserved
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
 * Aptana provides a special exception to allow redistribution of this file
 * with certain other code and certain additional terms
 * pursuant to Section 7 of the GPL. You may view the exception and these
 * terms on the web at http://www.aptana.com/legal/gpl/.
 * 
 * You may view the GPL, and Aptana's exception and additional terms in the file
 * titled license-jaxer.html in the main distribution folder of this program.
 * 
 * Any modifications to this file must keep this entire header intact.
 *
 * ***** END LICENSE BLOCK ***** */

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework > frameworkStart.js
 */
coreTraceMethods.TRACE('Loading fragment: frameworkStart.js');
Jaxer.lastLoadedFragment = 'frameworkStart.js';
/*
 * This is the beginning of the Jaxer server framework JavaScript code.
 */

/**
 * @overview The Jaxer server framework contains functions and code that run only on the server.
 * 
 */

/**
 * @namespace {Jaxer.Config} Holds various configuration settings for Jaxer.
 * See config.js for the default settings, which may be overridden by settings
 * in the corresponding file in the local folder specified by Jaxer.Config.LOCAL_CONF_DIR.
 */

try
{

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > Utilities.js
 */
coreTraceMethods.TRACE('Loading fragment: Utilities.js');
Jaxer.lastLoadedFragment = 'Utilities.js';

(function() {

/**
 * @namespace {Jaxer.Util} A namespace to hold a miscellany of generic utility
 * functions and other objects. In particular, it also holds sub-namespaces
 * for more specific operations.
 */
var Util = {};

/**
 * Remove items from an array that do not pass a given criteria. Each item in
 * the specified array will be passed to the filtering function. If that
 * function returns true, then the item will remain in the specified array. If
 * the function returns false, the item is removed from the specified array.
 * 
 * Note that the specified array is altered in place. If you prefer to create a
 * new array, leaving the original intact, then use the native Array's 
 * filter method instead.
 * 
 * @alias Jaxer.Util.filterInPlace
 * @param {Array} array
 * 		The source array to be filtered
 * @param {Function} func
 * 		The filtering function to apply to each array item. This filter has two
 * 		parameters. The first parameter is the current item in the array that is
 *		potentially being filtered. The second parameter is the index of the
 *		item potentially being filtered. The index can be used in cases where
 *		the filtering decision needs to be determined based on proximity to
 *		other items in the array
 * @return {Array}
 * 		Returns the filtered array containing only items that were approved by
 * 		the filtering function. Note that this instance will be the same as the
 * 		instance passed into the function. This is provided as a convenience and
 * 		to keep this function signature the same as Util.filter's signature.
 */
Util.filterInPlace = function filterInPlace(array, func)
{
	var length = array.length;
	
	for (var i = 0; i < length; i++)
	{
		var keep = (func) ? func(item, i) : item;
		
		if (keep == false)
		{
			array.splice(i, 1);
			i--;
			length--;
		}
	}
	
	return array;
};

/**
 * Replace each item of an array by applying a function and then replacing the
 * original item with the results of that function.
 * 
 * @alias Jaxer.Util.mapInPlace
 * @param {Array} array
 * 		The source array
 * @param {Function} func
 * 		The function to apply to each of the items in the source array. The
 * 		function has two parameters. The first parameter is the current item in
 * 		the array that is being transformed. The second parameter is the index
 * 		of the item being transformed.
 * @return {Array}
 * 		Returns the mapped array. Note that this instance will be the same as
 * 		the instance passed into the function. This is provided as a convenience
 * 		and to keep this function's signature the same as the signature of the
 * 		native Array's map mathod.
 */
Util.mapInPlace = function mapInPlace(array, func)
{
	if (array == null) return;
	
	var length = array.length;
	
	for (var i = 0; i < length; i++)
	{
		array[i] = func(array[i], i);
	}
	
	return array;
};

/**
 * Determine if the specified object contains all properties in a list of
 * property names.
 * 
 * @alias Jaxer.Util.hasProperties
 * @param {Object} object
 * 		The source object
 * @param {String[]} properties
 * 		The list of property names to test on the specified object
 * @return {Boolean}
 * 		Returns true if all properties in the list exist on the specified object
 */
Util.hasProperties = function hasProperties(object, properties)
{
	var result = false;
	
	if (object && properties && properties.constructor === Array)
	{
		result = true;
		
		for (var i = 0; i < properties.length; i++)
		{
			var property = properties[i];
			
			if (object.hasOwnProperty[property] == false)
			{
				result = false;
				break;
			}
		}
	}
	
	return result;
};

/**
 * Get all property names or filtered subset of names from an object.
 * 
 * @alias Jaxer.Util.getPropertyNames
 * @param {Object} object
 * 		The source object
 * @param {Function} [filter]
 * 		An optional filter function to apply to the property's name and value. 
 * 		filter(name, value) should return something that's equivalent to true if
 * 		the property is to be included.
 * @param {Boolean} [asHash]
 * 		If true, returns the result as a hash (with all values set to true)
 * @return {Object}
 * 		A list or hash of the property names depending on the value provided to
 * 		the asHash parameter
 */
Util.getPropertyNames = function getPropertyNames(object, filter, asHash)
{
	var names = asHash ? {} : [];
	
	if (object)
	{
		for (var p in object)
		{
			try 
			{
				if (!filter || filter(p, object[p])) 
				{
					asHash ? (names[p] = true) : names.push(p);
				}
			} 
			catch (e) 
			{
				// do nothing -- just don't push it
			}
		}
	}
	
	return names;
};

/**
 * Tests whether the given function is native (i.e. for which there is actually
 * no source code)
 * 
 * @alias Jaxer.Util.isNativeFunction
 * @param {Function} func
 * 		The function to test
 * @return {Boolean}
 * 		True if it's a native function, false otherwise 
 */
Util.isNativeFunction = function isNativeFunction(func)
{
	return Util.isNativeFunctionSource(func.toSource());
}

/**
 * Tests whether the given string is the source of a native function (i.e. for
 * which there is actually no source code)
 * 
 * @alias Jaxer.Util.isNativeFunctionSource
 * @param {String} source
 * 		The source string to test
 * @return {Boolean}
 * 		True if it's a native function's source, false otherwise 
 */
Util.isNativeFunctionSource = function isNativeFunctionSource(source)
{
	return Boolean(source.match(/\)\s*\{\s*\[native code\]\s*\}\s*$/));
}

/**
 * Tests whether the given object is a Date object (even if it's from a
 * different global context)
 * 
 * @alias Jaxer.Util.isDate
 * @param {Object} obj
 * 		The object to test
 * @return {Boolean}
 * 		True if it's a Date (or at least seems to be a Date), false otherwise
 */
Util.isDate = function isDate(obj)
{
	if (!obj || (typeof obj != "object")) 
		return false;
	
	var global = Util.getGlobalContext(obj);
	if (global && global.Date)
		return (obj.constructor == global.Date);
		
	if (obj.constructor)
		return (obj.constructor.name == "Date");
	
	return false;
}

/**
 * Tests whether the given object is an Array object (even if it's from a
 * different global context). This returns false on Array-like objects
 * that are not in fact arrays, such as the arguments object inside a function.
 * 
 * @alias Jaxer.Util.isArray
 * @param {Object} obj
 * 		The object to test
 * @return {Boolean}
 * 		True if it's an Array (or at least seems to be an Array), false otherwise
 */
Util.isArray = function isArray(obj)
{
	if (!obj || (typeof obj != "object")) 
		return false;
	
	var global = Util.getGlobalContext(obj);
	if (global && global.Array)
		return (obj.constructor == global.Array);
		
	if (obj.constructor)
		return (obj.constructor.name == "Array");
	
	return false;
}

/**
 * Does nothing for the given number of milliseconds
 * 
 * @alias Jaxer.Util.sleep
 * @param {Number} milliseconds
 * 		The number of milliseconds to pause.
 */
Util.sleep = function sleep(milliseconds)
{
	var thread = Components.classes['@mozilla.org/thread-manager;1'].getService().currentThread;
	
	thread.sleep(milliseconds);
}

Util.setSafeSetter = function setSafeSetter(proto, propName, setter)
{
	proto.__defineSetter__(propName, function _setSafeSetter(value)
	{
		// Need to backup this setter and delete it off the prototype
		// before calling setter which may change the actual property, 
		// so the property is actually set and we also avoid recursion
		var myself = proto.__lookupSetter__(propName);
		delete proto[propName];
		setter(this, value);
		proto.__defineSetter__(propName, myself);
	});
}

/**
 * Tests whether the given object is devoid of any (enumerable) properties.
 * 
 * @alias Jaxer.Util.isEmptyObject
 * @param {Object} obj
 * 		The object to test
 * @return {Boolean}
 * 		false if there is (at least) one enumerable property, true otherwise
 */
Util.isEmptyObject = function isEmptyObject(obj)
{
	for (var prop in obj)
	{
		return false;
	}
	return true;
}

/**
 * Clones an object (actually any argument) and returns the clone. If obj is of type
 * "object", then the clone is created from the same constructor (but without any arguments).
 * For a deep clone, every (enumerable) property is itself cloned; otherwise, every
 * (enumerable) property is simply copied (by value or reference).
 * 
 * @alias Jaxer.Util.clone
 * @param {Object} obj
 * 		The object to clone. If it's not of type object, its value is simply copied and returned.
 * 		It is not altered.
 * @param {Boolean} [deep]
 * 		Whether to make a deep clone or a shallow one (just copy properties); by default, false.
 * @param {Number} [maxDepth]
 * 		An optional maximum cloning depth. By default it's 10. This prevents infinite loops.
 * @return {Object}
 * 		The new, cloned object.
 */
Util.clone = function clone(obj, deep, maxDepth)
{
	if (typeof maxDepth != "number") maxDepth = 10;
	var clone;
	if (typeof obj != "object")
	{
		clone = obj;
	}
	else
	{
		clone = new obj.constructor();
		if (maxDepth) 
		{
			for (var p in obj) 
			{
				clone[p] = deep ? Util.clone(obj[p], deep, maxDepth-1) : obj[p];
			}
		}
	}
	return clone;
}

/**
 * Extends an object by (shallow) cloning it and then copying all (enumerable) properties
 * from the extensions object to the new cloned object.
 * 
 * @alias Jaxer.Util.extend
 * @param {Object} obj
 * 		The object to use as a base and extend. It is not altered.
 * @param {Object} extensions
 * 		The object to use as extensions -- usually this is a simple
 * 		hashmap of properties and their values.
 * @return {Object}
 * 		The extended clone.
 */
Util.extend = function extend(obj, extensions)
{
	var extended = Util.clone(obj, false);
	for (var p in extensions)
	{
		extended[p] = extensions[p];
	}
	return extended;
}

/**
 * Find the global context ('window', in the browser) to which the given object
 * is ultimately parented. If no object is given, returns the developer page's window
 * object, and if that does not exist for some reason, returns the framework's
 * global context.
 * 
 * @alias Jaxer.Util.getGlobalContext
 * @advanced
 * @param {Object} [obj]
 * 		The object whose global context is to be found
 * @return {Object}
 * 		The global context ('window', in the browser)
 */
Util.getGlobalContext = function getGlobalContext(obj)
{
	var globalContext;
	// If an obj was given, try to find its global context
	if (obj != null && obj != undefined)
	{
		try
		{
			var current = obj;
			var parent = obj.__parent__;
			while (parent && parent !== current)
			{
				current = parent;
				parent = parent.__parent__;
			}
			if (current != obj)
			{
				globalContext = current;
			}
		}
		catch (e)
		{
			// Nothing to do -- just return the no-object global
		}
	}
	
	if (!globalContext) // if we haven't found one yet...
	{
		if (Jaxer.pageWindow) // prefer the user's global context
		{
			globalContext = Jaxer.pageWindow;
		}
		else
		{
			globalContext = Jaxer.frameworkGlobal;
		}
	}
	
	return globalContext;
}

/**
 * Finds the named object within the global context ('window', in the browser) to which the second argument
 * is ultimately parented. If no second argument is given, finds the named object in the developer page's window
 * object, and if that does not exist for some reason, finds it in the Jaxer framework's
 * global context.
 * 
 * @alias Jaxer.Util.findInGlobalContext
 * @param {String} objectName
 * 		The name of the object to find. If this name contains periods (".") then it's split into subnames
 * 		and each is used to search in the former. So "a.b.c" means get the value of the property "a" in the global context,
 * 		and in it get the value of the property "b", and in it get the value of the property "c".
 * 		If any of these is not defined it returns undefined.
 * @param {Object} [objForGlobalContext]
 * 		The object whose global context is the one to use for finding the named object, which defaults 
 * 		to the developer page's window object (or else the Jaxer framework's global)
 * @return {Object}
 * 		The found object, or undefined if it cannot be found
 */
Util.findInGlobalContext = function findInGlobalContext(objectName, objForGlobalContext)
{
	var globalContext = Util.getGlobalContext(objForGlobalContext);
	var names = objectName.split(/\./);
	var obj = globalContext;
	names.forEach(function(name)
	{
		if (!obj || (typeof obj != "object")) return undefined;
		obj = obj[name];
	})
	return obj;
}

/**
 * Creates a new instance of an object given the name of a constructor and the object
 * in which to find the constructor. Any parameters beyond these two will be passed
 * to the constructor, getting around an apparent limitation of JavaScript: the inability
 * to use "call" or "apply" on a constructor.
 * @param {String} constructorName
 * 		The name of the function to use as the constructor of the object
 * @param {Object} [objForGlobalContext]
 * 		If specified, this should be the "window"
 */
Util.createObject = function createObject(constructorName, objForGlobalContext)
{
	var constructor = Util.findInGlobalContext(constructorName, objForGlobalContext);
	if (!constructor)
	{
		throw new Exception("Could not find a constructor named '" + constructorName + "'");
	}
	var args = Array.slice(arguments, 2);
	var internalArgNames = ['arg'+i for (i in args)];
	var argNames = ["o"].concat(internalArgNames);
	var c = Function.constructor.apply(null,[argNames.join(","),
			"var constr = Jaxer.Util.findInGlobalContext('" + constructorName + "', o);\n" +
			"return new constr(" + internalArgNames.join(",") + ");"]
			);
	return c.apply(null, [objForGlobalContext].concat(args))
}

/**
 * Create a string representation of all properties in an object. A separator
 * string can be used as a delimited between each property and the user has the
 * object of showing the property values or not.
 * 
 * @private
 * @alias Jaxer.Util.__listProps
 * @param {Object} obj
 * 		The source object
 * @param {String} [separator]
 * 		The separator string to use between properties. If this value is not
 * 		specified or if it is undefined, the string "; " will be used by default
 * @param {Boolean} showContents
 * 		A boolean value indicating whether property values should shown in
 * 		addition to the property names.
 * @return {String} Returns a string representation of the specified object.
 */
Util.__listProps = function __listProps(obj, separator, showContents)
{
	if (obj == null) return "null";
	
	if (typeof obj == "undefined") return "undefined";
	
	var props = [];
	
	if (typeof separator == "undefined" || separator == null) separator = "; ";
	
	for (var p in obj)
	{
		props.push(p + (showContents ? ": " + obj[p] : "") );
	}
	
	props = props.sort();
	
	var type = typeof obj;
	var constr = "";
	
	if (typeof obj.constructor != "undefined")
	{
		constr = (typeof obj.constructor.name == "string") ? obj.constructor.name : obj.constructor.toString();
		
		if (!(obj instanceof obj.constructor))
		{
			constr += " (not an instanceof its own constructor!!)"
		}
	}
	
	props.unshift("[Type: " + type + ", constructor: " + constr + "]");
	
	return props.join(separator);
};

frameworkGlobal.Util = Jaxer.Util = Util;

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > String.js
 */
coreTraceMethods.TRACE('Loading fragment: String.js');
Jaxer.lastLoadedFragment = 'String.js';

(function() {

/**
 * @namespace {Jaxer.Util.String} Namespace that holds functions and other objects that extend JavaScript's string capabilities.
 */
Util.String = {};

/**
 * Escapes an input string for use with javascript
 * 
 * @alias Jaxer.Util.String.escapeForJS
 * @param {String} raw
 * 		The source string
 * @return {String}
 * 		The escaped string suitable for use in an eval statement
 */
Util.String.escapeForJS = function escapeForJS(raw)
{
	var regex = new RegExp("'|\"|\\\\|</scrip" + "t>", "gi");
	var escaped = raw.replace(regex, function(txt)
	{
		switch (txt)
		{
			case "\\":
				return "\\\\";
				
			case "'":
				return "\\'";
				
			case '"':
				return '\\"';
				
			default: // Must be script end tag
				return "<\\/script>" ;
		}
	});
	
	return escaped;
};

/**
 * Escapes an input string for use with SQL
 * 
 * @alias Jaxer.Util.String.escapeForSQL
 * @param {String} raw
 * 		The source string
 * @return {String}
 * 		The escaped string suitable for use in a SQL query
 */
Util.String.escapeForSQL = function escapeForSQL(raw)
{
	var regex = /['\\\t\r\n]/g;
	var escaped = raw.replace(regex, function(a) {
		switch (a)
		{
			case '\'':
				return "\\'";
				break;
				
			case '\\':
				return "\\\\";
				break;
				
			case '\r':
				return "\\r";
				break;
				
			case '\n':
				return "\\n";
				break;
				
			case '\t':
				return "\\t";
				break;
		}
	});
	
	return escaped;
};

/**
 * Surround the provided string in single quotation marks
 * 
 * @alias Jaxer.Util.String.singleQuote
 * @param {String} text
 * 		The original string
 * @return {String}
 * 		The original string encased in single quotes
 */
Util.String.singleQuote = function(text)
{
	return "'" + text + "'";
};

/**
 * Left or right trim the provided string. Optionally, you can specify a list of
 * characters (as a single string) to trim from the source string. By default,
 * whitespace is removed. Also, you can control which side of the string (start
 * or end) is trimmed with the default being both sides.
 * 
 * @alias Jaxer.Util.String.trim
 * @param {String} str
 * 		The source string
 * @param {String} [charsToTrim]
 * 		This optional parameter can be used to specify a list of characters to
 * 		remove from the sides of the source string. Any combination of these
 * 		characters will be removed. If this parameter is not specified, then all
 * 		whitespace characters will be removed.
 * @param {String} [leftOrRight]
 * 		This optional parameter can be used to control which side of the string
 * 		is trimmed. A value of "L" will trim the start of the string and all
 * 		other string values will trim the end of the string. If this parameter
 * 		is not specified, then both sides of the string will be trimmed
 * @return {String}
 * 		The resulting trimmed string
 */
Util.String.trim = function trim(str, charsToTrim, leftOrRight)
{
	if (charsToTrim == null || charsToTrim == " ")
	{
		if (leftOrRight)
		{
			var left = leftOrRight.toUpperCase().indexOf("L") == 0;
			
			return left ? str.replace(/^\s+/g,'') : str.replace(/\s+$/g,'');
		}
		else
		{
			return str.replace(/^\s+|\s+$/g,'');
		}
	}
	else // Another alternative to the below would be to (safely) build a regexp
	{
		var left = leftOrRight == null || leftOrRight.toUpperCase().indexOf("L") == 0;
		var right = leftOrRight == null || !left;
		
		for (var i=0; i<charsToTrim.length; i++)
		{
			var charToTrim = charsToTrim[i];
			
			if (left)
			{
				while (str.indexOf(charToTrim) == 0)
				{
					str = str.substr(1);
				}
			}
			if (right)
			{
				var length = str.length;
				
				while (length && (str.lastIndexOf(charToTrim) == length - 1))
				{
					str = str.substring(0, length - 1);
					length = str.length;
				}
			}
		}
		
		return str;
	}
};

/**
 * Convert a string to a CamelCase representation by removing interword spaces
 * and capitalizing the first letter of each word following an underscore
 * 
 * @alias Jaxer.Util.String.upperCaseToCamelCase
 * @param {String} orig
 * 		The orignal string containing underscores between words
 * @return {String}
 * 		The resulting string with underscores removed and the first letter of a
 * 		word capitalized
 */
Util.String.upperCaseToCamelCase = function upperCaseToCamelCase(orig)
{
	return orig.toLowerCase().replace(/_(\w)/g, function(all, c) { return c.toUpperCase(); });
};


/**
 * Check to see if a string starts with another string
 * 
 * @alias Jaxer.Util.String.startsWith
 * @param {String} inString
 * 		The string to look in
 * @param {String} lookFor
 * 		The string to look for
 * @param {Boolean} ignoreCase
 * 		Set to true for case insensitive searches
 * @return {Boolean}
 * 		true if the string starts with the provided string
 */
Util.String.startsWith = function startsWith(inString, lookFor, ignoreCase)
{
	if (ignoreCase)
	{
		inString = inString.toLowerCase();
		lookFor = lookFor.toLowerCase();
	}
	return (inString.indexOf(lookFor) == 0);
};

/**
 * Check to see if a string ends with a string
 * 
 * @alias Jaxer.Util.String.endsWith
 * @param {String} inString
 * 		The string to look in
 * @param {String} lookFor
 * 		The string to look for
 * @param {Boolean} ignoreCase
 * 		Set to true for case insensitive searches
 * @return {Boolean}
 * 		true if the string ends with the provided string
 */
Util.String.endsWith = function endsWith(inString, lookFor, ignoreCase)
{
	if (ignoreCase)
	{
		inString = inString.toLowerCase();
		lookFor = lookFor.toLowerCase();
	}
	return (inString.lastIndexOf(lookFor) == (inString.length - lookFor.length));
};

/**
 * Searches the given lines for the given pattern, and returns the lines that matched.
 * 
 * @alias Jaxer.Util.String.grep
 * @param {String, String[]} stringOrArray
 * 		The string to search through, which will be split up into its lines, 
 * 		or an array of lines (i.e. a string that has already been split)
 * @param {String, RegExp} pattern
 * 		The string pattern to look for, which will be turned into a RegExp,
 * 		or the RegExp to match
 * @return {String[]}
 * 		An array of the lines that matched the pattern
 */
Util.String.grep = function grep(stringOrArray, pattern)
{
	if (typeof stringOrArray == "string")
	{
		stringOrArray = stringOrArray.split("\r?\n");
	}
	if (typeof pattern == "string")
	{
		pattern = new RegExp(pattern);
	}
	return stringOrArray.filter(function(item) { return pattern.test(item); });
}

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > DateTime.js
 */
coreTraceMethods.TRACE('Loading fragment: DateTime.js');
Jaxer.lastLoadedFragment = 'DateTime.js';

(function() {

/**
 * @namespace {Jaxer.Util.DateTime} Namespace used to hold functions and other objects that extend JavaScript's datetime handling.
 */
Util.DateTime = {};

/**
 * Converts a date to a string and pads the month and date values to align
 * all date values in columns. Not yet internationalized.
 * 
 * @alias Jaxer.Util.DateTime.toPaddedString
 * @param {Date} date
 * 		The source date
 * @return {String}
 * 		The source data converted to a string with month and data values padded
 * 		with spaces to align all values
 */
Util.DateTime.toPaddedString = function toPaddedString(date)
{
	var m = date.getMonth();
	var d = date.getDate();
	var sep = "/";
	return date.toTimeString().substr(0, 8) + " " + (m < 10 ? " " : "") + m + sep + (d < 10 ? " " : "") + d + sep + date.getFullYear();
};

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > Math.js
 */
coreTraceMethods.TRACE('Loading fragment: Math.js');
Jaxer.lastLoadedFragment = 'Math.js';

(function() {

/**
 * @namespace {Jaxer.Util.Math} Namespace used to hold functions and other objects that extend JavaScript's math capabilities 
 */
Util.Math = {};

/**
 * Determine whether the specified value is an integer value
 * 
 * @alias Jaxer.Util.Math.isInteger
 * @param {Number} num
 * 		The number to test
 * @return {Boolean}
 * 		Returns true if the number is an integer value
 */
Util.Math.isInteger = function isInteger(num)
{
	return (typeof num == "number") &&
		isFinite(num) && 
		(Math.floor(num) == num);
};

function _forceInteger(num)
{
	if (typeof num == "string") num = parseInt(num); // string -> integer number or NaN
	if (typeof num == "number") num = Math.floor(num); // number -> integer number or NaN
	if ((typeof num != "number") || !isFinite(num)) num = null; // anything else or NaN -> null
	return num;
}

/**
 * Forces num into a finite integer. If it's a string, it first attempts to parse it to an integer.
 * If it's a number, it takes its integer part by applying Math.floor() to it. 
 * If it's anything else, o NaN (not a number), it uses the defaultNum or 0.
 * 
 * @alias Jaxer.Util.Math.forceInteger
 * @param {Object} num
 * 		The object to turn into an integer
 * @param {Object} defaultNum
 * 		The integer to use as a default (which will itself be forced to be 0 if not an integer)
 */
Util.Math.forceInteger = function forceInteger(num, defaultNum)
{
	num = _forceInteger(num);
	if (num == null) num = _forceInteger(defaultNum) || 0;
	return num;
}

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > MultiHash.js
 */
coreTraceMethods.TRACE('Loading fragment: MultiHash.js');
Jaxer.lastLoadedFragment = 'MultiHash.js';

(function() {

/**
 * @namespace {Jaxer.Util.MultiHash} Namespace used to hold functions that create
 * and manipulate a hash whose values are primitives or Arrays of primitives
 */
Util.MultiHash = {};

function isArray(obj)
{
	return obj &&
		(obj.__parent__) && 
		(obj.constructor == obj.__parent__.Array);
}

/**
 * Adds the name-value pair to the MultiHash: if the name does not exist,
 * it is added with the given value; if the name exists, the previous value 
 * is turned into an Array, if needed, and then the given value is appended to it
 * 
 * @alias Jaxer.Util.MultiHash.add
 * @param {Object} multiHash
 * 		The multihash to which the name-value should be added
 * @param {String} name
 * 		The name to use as a key
 * @param {Object} value
 * 		The value to associate with the key -- it must not be an array
 */
Util.MultiHash.add = function add(multiHash, name, value)
{
	if (name in multiHash)
	{
		var current = multiHash[name];
		if (isArray(current)) // assumed to be an Array
		{
			current.push(value);
		}
		else
		{
			multiHash[name] = [current, value];
		}
	}
	else
	{
		multiHash[name] = value;
	}
};

/**
 * Removes the name-value pair from the MultiHash: if the name does not exist,
 * or it does not have the value, nothing happens; if the name exists and has the value,
 * that value is removed, and if no more values remain for that name, the name
 * is removed
 * 
 * @alias Jaxer.Util.MultiHash.remove
 * @param {Object} multiHash
 * 		The multihash from which the name-value should be removed
 * @param {String} name
 * 		The name of the key
 * @param {Object} value
 * 		The value to remove from the key -- it must not be an array
 */
Util.MultiHash.remove = function add(multiHash, name, value)
{
	if (name in multiHash)
	{
		var current = multiHash[name];
		if (isArray(current)) // assumed to be an Array
		{
			var indexToRemove = -1;
			for (var i=0; i<current.length; i++)
			{
				if (current[i] == value)
				{
					indexToRemove = i;
					break;
				}
			};
			if (indexToRemove > -1)
			{
				current.splice(indexToRemove, 1);
			}
			if (current.length == 1)
			{
				multiHash[name] = current[0];
			}
		}
		else if (value == current)
		{
			delete multiHash[name];
		}
	}
};

/**
 * Analyzes the first MultiHash relative to the second
 * 
 * @alias Jaxer.Util.MultiHash.diff
 * @param {Object} after
 * 		The MultiHash whose changes we are interested in
 * @param {Object} before
 * 		The MultiHash relative to which the changes have occurred
 * @return {Object}
 * 		The results of the analysis, an object with three properties: 
 * 		'added' is a hash of all the name-value pairs added;
 * 		'changed' is a hash of all the name-value pairs that have changed 
 * 		(the value is the one in after); 
 * 		and 'deleted' is a hash of all the name-value pairs that have been deleted 
 * 		(the value is the one in before, of course)
 */
Util.MultiHash.diff = function diff(after, before)
{
	var result = {added: {}, changed: {}, deleted: {}};
	for (var a in after)
	{
		if (!(a in before))
		{
			result.added[a] = after[a];
		}
		else
		{
			var changed = false;
			var valueBefore = before[a];
			var valueAfter = after[a];
			if (isArray(valueBefore))
			{
				if (isArray(valueAfter))
				{
					if (valueBefore.length != valueAfter.length)
					{
						changed = true;
					}
					else
					{
						for (var i=0; i<valueAfter.length; i++)
						{
							if (valueBefore[i] != valueAfter[i])
							{
								changed = true; 
								break;
							}
						}
					}
				}
				else
				{
					changed = true;;
				}
			}
			else if (valueBefore != valueAfter)
			{
				changed = true;
			}
			if (changed)
			{
				result.changed[a] = valueAfter;
			}
		}
	}
	for (var b in before)
	{
		if (!(b in after))
		{
			result.deleted[b] = before[b];
		}
	}
	return result;
}

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > Url.js
 */
coreTraceMethods.TRACE('Loading fragment: Url.js');
Jaxer.lastLoadedFragment = 'Url.js';

(function() {

/**
 * @namespace {Jaxer.Util.Url} Namespace that holds functions and other objects
 * for working with URLs.
 */
Util.Url = {};

/**
 * @classDescription {Jaxer.Util.Url.ParsedUrl} An object describing the parsed
 * pieces of a URL.
 */

function isIpAddress(host)
{
	return /^\d+\.\d+\.\d+\.\d+/.test(host);
}

/**
 * An object describing the parsed pieces of a URL. 
 * This object contains sub properties to allow access to the individual pieces
 * of the URL
 * 
 * @alias Jaxer.Util.Url.ParsedUrl
 * @constructor
 * @return {Jaxer.Util.Url.ParsedUrl}
 * 		Returns an instance of ParsedUrl.
 */
Util.Url.ParsedUrl = function ParsedUrl(url)
{
	
	url = Util.String.trim(url);
	
	// We first use the RegExp from RFC 2396 to parse the basic components
	var pattern = /^(([^\:\/\?#]+)\:)?(\/\/([^\/\?#]*))?([^\?#]*)(\?([^#]*))?(#(.*))?$/;
	//              12                3    4            5        6  7        8 9
	//               scheme                authority    path        query      fragment
	var isMatch = url.match(pattern);
	
	/**
	 * The complete (but whitespace-trimmed) original URL, before parsing
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.url
	 * @property {String}
	 */
	this.url = url;

	/**
	 * The protocol (typically 'http' or 'https'), or '' if not specified.
	 * A synonym for the scheme property.
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.protocol
	 * @property {String}
	 */
	/**
	 * The scheme (typically 'http' or 'https'), or '' if not specified.
	 * A synonym for the protocol property.
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.scheme
	 * @property {String}
	 */
	this.protocol = this.scheme = isMatch ? RegExp.$2 : "";

	/**
	 * The complete authority (e.g. 'user1@www.aptana.com:8081'), or '' if not specified.
	 * Note that the userInfo ('user1') and/or the port ('8081') may not be present.
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.authority
	 * @property {String}
	 */
	this.authority = isMatch ? RegExp.$4 : "";

	/**
	 * The entire path (e.g. '/images/myImage.gif') between the hostAndPort and the query string or fragment (if any), or ''
	 * if none
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.path
	 * @property {String}
	 */
	this.path = isMatch ? Util.String.trim(RegExp.$5) : "";
	
	/**
	 * The query string (e.g. 'name=joe&id=12') after the (first) question mark
	 * (?), or '' if not specified
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.query
	 * @property {String}
	 */
	this.query = (isMatch && RegExp.$7) ? RegExp.$7 : "";

	/**
	 * The fragment string (e.g. 'myBookmark') after the # symbol (e.g.
	 * #myBookmark), or '' if not specified
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.fragment
	 * @property {String}
	 */
	this.fragment = (isMatch && RegExp.$9) ? RegExp.$9 : "";

	// Then we further disassemble these into useful bits:
	
	pattern = /^(([^@]+)@)?([^\:]+)(:(.+))?$/;
	//          12         3       4 5
	isMatch = this.authority.match(pattern);
	
	/**
	 * The userInfo in the URL (e.g. 'user1' in 'user1@www.aptana.com'), or '' if not specified.
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.userInfo
	 * @property {String}
	 */
	this.userInfo = isMatch ? RegExp.$2 : "";
	
	/**
	 * The host (e.g. 'www.aptana.com'), or '' if not specified.
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.host
	 * @property {String}
	 */
	this.host = isMatch ? RegExp.$3 : "";
	
	/**
	 * The port as a string (e.g. '80'), or '' if not specified
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.port
	 * @property {String}
	 */
	this.port = isMatch ? RegExp.$5 : "";
	
	// Further combinations and slices:

	/**
	 * The combined host and port (e.g. 'www.aptana.com:8081'), which might be
	 * just the host if no port was specified.
	 * A synonym for the authority property.
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.hostAndPort
	 * @property {String}
	 */
	this.hostAndPort = this.host + preDress(this.port, ":");

	/**
	 * The protocol, userInfo, host, and port (e.g. 'http://user1@www.aptana.com:8081'), which
	 * might not have a protocol or a port if they were not specified
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.base
	 * @property {String}
	 */
	this.base = postDress(this.protocol, ":") + '//' + this.authority;
	
	var domainParts = isIpAddress(this.host) ? null : this.host.split(".");

	/**
	 * The subdomain (e.g. 'www.playground' in 'www.playground.aptana.com')
	 * before the domain, or '' if none or if the host was an IP address
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.subdomain
	 * @property {String}
	 */
	this.subdomain = domainParts ? domainParts.slice(0, -2).join(".") : '';

	/**
	 * The highest-level non-TLD domain (e.g. 'aptana.com' in
	 * 'www.playground.aptana.com'), or the IP address if the host was an IP address
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.domain
	 * @property {String}
	 */
	this.domain = domainParts ? domainParts.slice(-2).join(".") : this.host;

	/**
	 * A possibly-empty array of strings that compose the path part of the URL 
	 * (e.g. ["images", "small", "logo.png"] in 'http://www.aptana.com/images/small/logo.png?v=12').
	 * Note that if the path ends in a /, the last element in the pathParts array 
	 * (a.k.a. the leaf) will be the empty string.
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.pathParts
	 * @property {Array}
	 */
	var leftTrimmedPath = Util.String.trim(this.path, '/', 'l');
	this.pathParts = (leftTrimmedPath == '') ? [] : leftTrimmedPath.split("/");
	
	/**
	 * The last part of the path, namely everything after the last / and before any query or fragment
	 * (e.g. "logo.png" in 'http://www.aptana.com/images/small/logo.png?v=12').
	 * If the path ends in a trailing /, this is the empty string.
	 * And if the path is completely absent, this is null.
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.leaf
	 * @property {String}
	 */
	this.leaf = (this.pathParts.length > 0) ? this.pathParts[this.pathParts.length - 1] : null;

	/**
	 * An object containing a property for each name=value pair in the query
	 * string of the URL, e.g. 'http://www.aptana.com/staff?name=joe&id=12'
	 * leads to queryParts.name = "joe" and queryParts.id = "12"
	 * 
	 * @alias Jaxer.Util.Url.ParsedUrl.prototype.queryParts
	 * @property {Object}
	 */	
	this.queryParts = Util.Url.queryToHash(this.query);

}

function preDress(str, separator)
{
	return (str == '') ? '' : (separator + str);
}

function postDress(str, separator)
{
	return (str == '') ? '' : (str + separator);
}

/**
 * Parse a string containing a URL into a Jaxer.Util.Url.ParsedUrl object
 * to allow manipulation of the individual URL component parts
 * 
 * @alias Jaxer.Util.Url.parseUrl
 * @param {String} url
 * 		The URL to parse
 * @return {Jaxer.Util.Url.ParsedUrl}
 * 		The parts of a URL broken down into useful pieces
 */
Util.Url.parseUrl = function parseUrl(url)
{
	return new Util.Url.ParsedUrl(url);
};

/**
 * Create a Util.Url.ParsedUrl object from the component pieces provided
 * as parameters to the functions calls.
 * 
 * @alias Jaxer.Util.Url.parseUrlComponents 
 * @param {String} hostAndPort
 * 		The host (and port, if any) containing the given path 
 * @param {String} absolutePath
 * 		The absolute path to a resource on the host
 * @param {String} [protocol]
 * 		The protocol ('http' or 'https'); the default is 'http'
 * @return {Jaxer.Util.Url.ParsedUrl}
 * 		The parts of a URL broken down into useful pieces
 */
Util.Url.parseUrlComponents = function parseUrlComponents(hostAndPort, absolutePath, protocol)
{
	var url = (protocol ? protocol : "http") + "://" + Util.Url.combine(hostAndPort, absolutePath); 
	return Util.Url.parseUrl(url);
};

/**
 * Divides the key/value pairs in a query string and builds an object for these
 * values. The key will become the property name of the object and the value
 * will become the value of that property
 * 
 * @alias Jaxer.Util.Url.queryToHash
 * @param {String} query
 * 		A query string
 * @return {Object}
 */
Util.Url.queryToHash = function queryToHash(query)
{
	var hash = {};
	if (typeof query == "number") query = String(query);
	if (typeof query == "string") query = Jaxer.Util.String.trim(query, " ?");
	if (query) 
	{
		var queryStrings = query.split("&");
		for (var i = 0; i < queryStrings.length; i++) 
		{
			var nameValue = queryStrings[i].split("=");
			hash[Util.Url.formUrlDecode(nameValue[0])] = (nameValue.length > 1) ? Util.Url.formUrlDecode(nameValue[1]) : null;
		}
	}
	return hash;
};

/**
 * Decode a URL by replacing +'s with spaces and all hex values (%xx) with their
 * character value
 * 
 * @alias Jaxer.Util.Url.formUrlDecode
 * @param {String} str
 * 		The source URL to decode
 * @return {String}
 * 		The resulting URL after all hex values have been  converted
 */
Util.Url.formUrlDecode = function formUrlDecode(str)
{
	if (typeof str != "string")
	{
		throw new Exception("formUrlDecode was handed something of type " + (typeof str) + " rather than a string");
	}
	str = str.replace(/\+/g, " "); // For those encoders that use + to represent a space. A true + should have been encoded as %2B
	str = decodeURIComponent(str);
	
	return str;
};

/**
 * Converts an object's properties and property values to a string suitable as
 * a query string. Each property name becomes a key in the query string and each
 * property value becomes the key value. A key and its value are separated by
 * the '=' character. Each key/value pair is separated by '&'. Note that each
 * value is encoded so invalid URL characters are encoded properly.
 * 
 * @alias Jaxer.Util.Url.hashToQuery
 * @param {Object} hash
 * 		The object to convert to a query string
 * @return {String}
 * 		The resulting query string
 */
Util.Url.hashToQuery = function hashToQuery(hash)
{
	var queryStrings = [];
	
	for (var p in hash)
	{
		var name = Util.Url.formUrlEncode(p);
		var value = (hash[p] == null) ? "" : Util.Url.formUrlEncode(hash[p]);
		
		queryStrings.push([name, value].join("="));
	}
	
	return queryStrings.join("&");
};

/**
 * Encode a URL by replacing all special characters with hex values (%xx)
 * 
 * @alias Jaxer.Util.Url.formUrlEncode
 * @param {String} str
 * 		The string to encode
 * @return {String}
 * 		The resulting URL after special characters and spaces have been encoded
 */
Util.Url.formUrlEncode = function formUrlEncode(str)
{
	return encodeURIComponent(str);
};

/**
 * Combines any number of URL fragments into a single URL, using / as the
 * separator. Before joining two fragments with the separator, it strips any
 * existing separators on the fragment ends to be joined
 * 
 * @alias Jaxer.Util.Url.combine
 * @param {String} ...
 * 		Takes any number of string URL fragments
 * @return {String}
 * 		The fragments joined into a URL
 */
Util.Url.combine = function combine()
{
	if (arguments.length == 0) return '';
	if (arguments.length == 1) return arguments[0];
	var pieces = Array.prototype.slice.call(arguments);
	pieces.forEach(function(piece, pieceIndex)
	{
		if (piece == null) pieces[pieceIndex] = '';
	});
	var sep = "/";
	var stripRight = new RegExp("\\" + sep + "+$");
	var stripLeft  = new RegExp("^\\" + sep + "+");
	var stripBoth  = new RegExp("^\\" + sep + "|\\" + sep + "$", 'g');
	pieces[0] = (pieces[0].replace(stripRight, ''));
	pieces[pieces.length - 1] = pieces[pieces.length - 1].replace(stripLeft, '');
	for (var i=1; i<pieces.length-1; i++)
	{
		pieces[i] = pieces[i].replace(stripBoth, '');
	}
	return pieces.join(sep);
}

var filePattern = /^(file|resource|chrome)\:\/{2,}/i;

/**
 * Tests whether the given URL is a reasonable file URL rather than something
 * that's available over the network.The test is pretty simplistic: the URL must
 * start with file://, resource://, or chrome://, or it must contain a backslash
 * (i.e. a Windows filesystem separator)
 * 
 * @alias Jaxer.Util.Url.isFile
 * @param {String} url
 * 		The URL to test
 * @return {Boolean}
 * 		True if a reasonable file URL, false otherwise
 */
Util.Url.isFile = function isFile(url)
{
	if (!url)
	{
		throw new Exception("No url given");
	}
	if (url.match(filePattern)) return true; 	// A recognized file protocol handler
	if (url.match(/\\/)) return true;			// A Windows path
	return false;
}

/**
 * If the given URL is already a file-type URL, it's returned untouched.
 * Otherwise we turn it into a file-type URL by prefixing it with "file://"
 * 
 * @alias Jaxer.Util.Url.ensureFileProtocol
 * @param {String} url
 * 		The URL to apply this to
 * @return {String}
 * 		URL expressed as a file type URL
 */
Util.Url.ensureFileProtocol = function ensureFileProtocol(url)
{
	if (url.match(filePattern)) return url;
	return 'file://' + url;
}

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > CRC32.js
 */
coreTraceMethods.TRACE('Loading fragment: CRC32.js');
Jaxer.lastLoadedFragment = 'CRC32.js';

/*
 * Original code comes from KevLinDev.com at
 * http://www.kevlindev.com/utilities/crc32/crc32.zip
 */

(function() {

/**
 * @namespace {Jaxer.Util.CRC32} Namespace used to hold functions and other
 * objects for using CRC32
 * 
 * @see http://en.wikipedia.org/wiki/Cyclic_redundancy_check
 */

var CRC32 = {};

CRC32.VERSION = 1.0;

// CRC polynomial - 0xEDB88320
CRC32.table = [
0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3,
0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91,
0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5,
0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f,
0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d,
0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457,
0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb,
0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9,
0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad,
0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683,
0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7,
0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79,
0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f,
0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21,
0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45,
0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db,
0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf,
0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d
];

/**
 * Create a CRC32 from the characters of a string
 * 
 * @alias Jaxer.Util.CRC32.getStringCRC
 * @param {String} text
 * 		The source string to convert
 * @return {Number}
 * 		The resulting CRC32 of the source string
 * @see http://en.wikipedia.org/wiki/Cyclic_redundancy_check
 */
CRC32.getStringCRC = function(text)
{
	var bytes = [];
	
	for (var i = 0; i < text.length; i++)
	{
		var code = text.charCodeAt(i);
		
		if (code > 0xFF)
		{
			var lo =   code & 0x00FF;
			var hi = ((code & 0xFF00) >> 8) && 0xFF;
			
			bytes.push(lo);
			bytes.push(hi);
		}
		else
		{
			bytes.push(code);
		}
	}
	
	return CRC32.getCRC(bytes, 0, bytes.length);
};

/**
 * Create a CRC32 from an array of bytes. The user may specify the starting
 * offset within the array and the total number of bytes past the offset to
 * include in the resulting CRC32.
 * 
 * @alias Jaxer.Util.CRC32.getCRC
 * @param {Array} data
 * 		An array of byte values
 * @param {Number} [offset]
 * 		The optional offset within the array where the calculated CRC32 should
 * 		start
 * @param {Number} [count]
 * 		The optional number of bytes starting from the offset to include in the
 * 		resulting CRC32.
 * @return {Number}
 * 		The resulting CRC32
 * @see http://en.wikipedia.org/wiki/Cyclic_redundancy_check
 */
CRC32.getCRC = function(data, offset, count)
{
	offset = offset || 0;
	count = count || data.length;
	 
    var crc = 0xFFFFFFFF;
    var k;

    for (var i = 0; i < count; i++)
	{
        k = (crc ^ data[offset+i]) & 0xFF;
        crc = ( (crc >> 8) & 0x00FFFFFF ) ^ CRC32.table[k];
    }

    return ~crc;
};

Util.CRC32 = CRC32;

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > Crypto.js
 */
coreTraceMethods.TRACE('Loading fragment: Crypto.js');
Jaxer.lastLoadedFragment = 'Crypto.js';

(function(){

var converter = CC["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(CI.nsIScriptableUnicodeConverter); 
	converter.charset = "UTF-8"; 
	
var crypto  = CC["@mozilla.org/security/hash;1"].createInstance(CI.nsICryptoHash); 

/**
 * @namespace {Jaxer.Util.Crypto} The namespace that holds functions for Cryptographic hashing
 * 
 * @see https://developer.mozilla.org/en/nsICryptoHash
 */

Util.Crypto = {};

Util.Crypto.__noSuchMethod__ = function methodMissingHandler(methodName,arguments)
{
	if (['MD2', 'MD5', 'SHA1', 'SHA256', 'SHA384', 'SHA512'].indexOf(methodName) > -1) {
		return getHash(methodName, arguments[0])
	}
	
	if (['verifyMD2', 'verifyMD5', 'verifySHA1', 'verifySHA256', 'verifySHA384', 'verifySHA512'].indexOf(methodName) > -1) {
		return getHash(methodName.replace('verify',''), arguments[0]) === arguments[1];
	}
	
	throw new Jaxer.Exception('Method not found : Jaxer.Util.Crypto.' + methodName);

}

/**
 * @namespace {Jaxer.Util.File.Crypto} The namespace that holds functions for Cryptographic hashing of Files
 * 
 * @see https://developer.mozilla.org/en/nsICryptoHash
 */

//TODO - add unit tests

Util.Crypto.File = {};

Util.Crypto.File.__noSuchMethod__ = function methodMissingHandler(methodName,arguments)
{
	if (['MD2','MD5','SHA1','SHA256','SHA384','SHA512'].indexOf(methodName)>-1)
	{
		return getFileHash(methodName, arguments[0]);		
	} 
	
	if (['verifyMD2', 'verifyMD5', 'verifySHA1', 'verifySHA256', 'verifySHA384', 'verifySHA512'].indexOf(methodName) > -1) {
		return getFileHash(methodName.replace('verify',''), arguments[0]) === arguments[1];
	}

	throw new Jaxer.Exception('Method not found :Jaxer.Util.Crypo.File.'+methodName);
}

/**
 * Convert a character to a 2 digit hex string
 * 
 * @param {Object} charCode
 * 		The character code to convert
 */
function asHex(charCode) 
{ 
	Jaxer.Log.info(charCode.toString(16));
	return ("0" + charCode.toString(16)).slice(-2); 
} 

/**
 * @see https://developer.mozilla.org/en/nsICryptoHash
 * @private
 * @param {Object} hashingAlgorithm
 * @param {Object} content
 * 
 */
function getHash(hashingAlgorithm, content) 
{ 	
    Jaxer.Log.info('Getting '+hashingAlgorithm+' for String');
	var result = {}; 
	
	var data = converter.convertToByteArray(content, result); 
	
	crypto.initWithString(hashingAlgorithm,content); 
	crypto.update(data, data.length); 
	var hash = crypto.finish(false); 

	var hashString = [asHex(hash.charCodeAt(i)) for (i in hash)].join(""); 
	
	return hashString; 
};

/**
 * @see https://developer.mozilla.org/en/nsICryptoHash
 * @private
 * @param {Object} hashingAlgorithm
 * @param {Object} content
 * 
 */
function getFileHash(hashingAlgorithm, file) 
{ 	
    // TODO - needs to handle string paths and trap bad things
	 Jaxer.Log.info('Getting '+hashingAlgorithm+' for File');

	if (!file.exists)
	{
		throw Jaxer.Exception("not found");
	}
	
	var f = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);			  
	f.initWithPath(file.path);

	// open for reading
	var inputStream = CC["@mozilla.org/network/file-input-stream;1"].createInstance(CI.nsIFileInputStream);
	inputStream.init(f, 0x01, 0444, 0);

	crypto.init(crypto[hashingAlgorithm]);
	crypto.updateFromStream(inputStream, 0xffffffff);
	inputStream.close();
	
	var hash = crypto.finish(false);
	var hashString = [asHex(hash.charCodeAt(i)) for (i in hash)].join(""); 
	
	return hashString; 
}; 
 
/**
 * Generate an MD2 Hash key for the provided content.
 * 
 * Message Digest Algorithm 2 (MD2) is a cryptographic hash function developed by Ronald Rivest in 1989. 
 * The algorithm is optimized for 8-bit computers. MD2 is specified in RFC 1319. Although other algorithms 
 * have been proposed since, such as MD4, MD5 and SHA, even as of 2004[update] MD2 remains in use in public 
 * key infrastructures as part of certificates generated with MD2 and RSA.
 * 
 * @alias Jaxer.Util.Crypto.MD2
 * @param {String} content
 * 		The content used to generate the hask key.
 * @return {String} 
 * 		A string containing the MD2 hash key for the provided content
 */

/**
 * Generate an MD5 Hash key for the provided content.
 * 
 * In cryptography, MD5 (Message-Digest algorithm 5) is a widely used cryptographic hash function with a 128-bit 
 * hash value. As an Internet standard (RFC 1321), MD5 has been employed in a wide variety of security applications, 
 * and is also commonly used to check the integrity of files. However, it is now known to be partially insecure 
 * thus reducing its suitability for these purposes. An MD5 hash is typically expressed as a 32 digit hexadecimal number.
 * 
 * MD5 was designed by Ron Rivest in 1991 to replace an earlier hash function, MD4. In 1996, a flaw was found with the 
 * design of MD5. While it was not a clearly fatal weakness, cryptographers began recommending the use of other 
 * algorithms, such as SHA-1 (which has since been found vulnerable itself). 
 * 
 * In 2004, more serious flaws were discovered making further use of the algorithm for security purposes questionable.
 * In 2007 a group of researchers including Arjen Lenstra described how to create a pair of files that share the 
 * same MD5 checksum.
 * 
 * In an attack on MD5 published in December 2008, a group of researchers used this technique to fake SSL certificate 
 * validity.
 *  
 * @alias Jaxer.Util.Crypto.MD5
 * @param {String} content
 * 		The content used to generate the hash key.
 * @return {String} 
 * 		A string containing the MD5 hash key for the provided content
 */

/**
 * Generate an SHA1 Hash key for the provided content.
 * 
 * The SHA hash functions are a set of cryptographic hash functions designed by the National Security Agency (NSA) and 
 * published by the NIST as a U.S. Federal Information Processing Standard. SHA stands for Secure Hash Algorithm. 
 * 
 * @alias Jaxer.Util.Crypto.SHA1
 * @param {String} content
 * 		The content used to generate the hash key.
 * @return {String} 
 * 		A string containing the SHA1 hash key for the provided content
 */

/**
 * Generate an SHA256 Hash key for the provided content.
 * 
 * SHA-256 is novel hash function computed with a 32-bit word. 
 * 
 * @alias Jaxer.Util.Crypto.SHA256
 * @param {String} content
 * 		The content used to generate the hash key.
 * @return {String} 
 * 		A string containing the SHA256 hash key for the provided content
 */

/**
 * Generate an SHA384 Hash key for the provided content.
 * 
 * SHA-384 is simply a truncated version of the SHA512, computed 
 * with different initial values.
 * 
 * @alias Jaxer.Util.Crypto.SHA384
 * @param {String} content
 * 		The content used to generate the hash key.
 * @return {String} 
 * 		A string containing the SHA384 hash key for the provided content
 */

/**
 * Generate an SHA512 Hash key for the provided content.
 * 
 * SHA-512 is novel hash function computed with a 64-bit word. 
 * 
 * @alias Jaxer.Util.Crypto.SHA512
 * @param {String} content
 * 		The content used to generate the hash key.
 * @return {String} 
 * 		A string containing the SHA512 hash key for the provided content
 */

/**
 * Generate an MD2 Hash key for the provided file. 
 * 
 * Message Digest Algorithm 2 (MD2) is a cryptographic hash function developed by Ronald Rivest in 1989. 
 * The algorithm is optimized for 8-bit computers. MD2 is specified in RFC 1319. Although other algorithms 
 * have been proposed since, such as MD4, MD5 and SHA, even as of 2004[update] MD2 remains in use in public 
 * key infrastructures as part of certificates generated with MD2 and RSA.
 * 
 * @alias Jaxer.Util.Crypto.File.MD2
 * @param {Jaxer.File|String} file
 * 		The File used to generate the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @return {String} 
 * 		A string containing the MD2 hash key for the provided file
 */

/**
 * Generate an MD5 Hash key for the provided file.
 * 
 * In cryptography, MD5 (Message-Digest algorithm 5) is a widely used cryptographic hash function with a 128-bit 
 * hash value. As an Internet standard (RFC 1321), MD5 has been employed in a wide variety of security applications, 
 * and is also commonly used to check the integrity of files. However, it is now known to be partially insecure 
 * thus reducing its suitability for these purposes. An MD5 hash is typically expressed as a 32 digit hexadecimal number.
 * 
 * MD5 was designed by Ron Rivest in 1991 to replace an earlier hash function, MD4. In 1996, a flaw was found with the 
 * design of MD5. While it was not a clearly fatal weakness, cryptographers began recommending the use of other 
 * algorithms, such as SHA-1 (which has since been found vulnerable itself). 
 * 
 * In 2004, more serious flaws were discovered making further use of the algorithm for security purposes questionable.
 * In 2007 a group of researchers including Arjen Lenstra described how to create a pair of files that share the 
 * same MD5 checksum.
 * 
 * In an attack on MD5 published in December 2008, a group of researchers used this technique to fake SSL certificate 
 * validity.
 *  
 * @alias Jaxer.Util.Crypto.File.MD5
 * @param {Jaxer.File|String} file
 * 		The File used to generate the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @return {String} 
 * 		A string containing the MD5 hash key for the provided file
 */

/**
 * Generate an SHA1 Hash key for the provided file.
 * 
 * The SHA hash functions are a set of cryptographic hash functions designed by the National Security Agency (NSA) and 
 * published by the NIST as a U.S. Federal Information Processing Standard. SHA stands for Secure Hash Algorithm. 
 * 
 * @alias Jaxer.Util.Crypto.File.SHA1
 * @param {Jaxer.File|String} file
 * 		The File used to generate the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @return {String} 
 * 		A string containing the SHA1 hash key for the provided file
 */

/**
 * Generate an SHA256 Hash key for the provided file.
 * 
 * SHA-256 is novel hash function computed with a 32-bit word. 
 * 
 * @alias Jaxer.Util.Crypto.File.SHA256
 * @param {Jaxer.File|String} file
 * 		The File used to generate the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @return {String} 
 * 		A string containing the SHA256 hash key for the provided file
 */

/**
 * Generate an SHA384 Hash key for the provided file.
 * 
 * SHA-384 is simply a truncated version of the SHA512, computed 
 * with different initial values.
 * 
 * @alias Jaxer.Util.Crypto.File.SHA384
 * @param {Jaxer.File|String} file
 * 		The File used to generate the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @return {String} 
 * 		A string containing the SHA512 hash key for the provided file
 */

/**
 * Generate an SHA512 Hash key for the provided file.
 * 
 * SHA-512 is novel hash function computed with a 64-bit word. 
 * 
 * @alias Jaxer.Util.Crypto.File.SHA512
 * @param {Jaxer.File|String} file
 * 		The File used to generate the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @return {String} 
 * 		A string containing the SHA512 hash key for the provided file
 */

/**
 * Verify an MD2 Hash key for the provided content.
 * 
 * @alias Jaxer.Util.Crypto.verifyMD2
 * @param {String} content
 * 		The content used to Verify the hask key.
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an MD5 Hash key for the provided content.
 *  
 * @alias Jaxer.Util.Crypto.verifyMD5
 * @param {String} content
 * 		The content used to Verify the hash key.
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an SHA1 Hash key for the provided content.
 * 
 * @alias Jaxer.Util.Crypto.verifySHA1
 * @param {String} content
 * 		The content used to Verify the hash key.
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an SHA256 Hash key for the provided content.
 * 
 * @alias Jaxer.Util.Crypto.verifySHA256
 * @param {String} content
 * 		The content used to Verify the hash key.
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an SHA384 Hash key for the provided content.
 * 
 * @alias Jaxer.Util.Crypto.verifySHA384
 * @param {String} content
 * 		The content used to Verify the hash key.
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an SHA512 Hash key for the provided content.
 * 
 * @alias Jaxer.Util.Crypto.verifySHA512
 * @param {String} content
 * 		The content used to Verify the hash key.
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an MD2 Hash key for the provided file. 
 * 
 * @alias Jaxer.Util.Crypto.File.verifyMD2
 * @param {Jaxer.File|String} file
 * 		The File used to Verify the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an MD5 Hash key for the provided file.
 * 
 * @alias Jaxer.Util.Crypto.File.verifyMD5
 * @param {Jaxer.File|String} file
 * 		The File used to Verify the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an SHA1 Hash key for the provided file.
 * 
 * @alias Jaxer.Util.Crypto.File.verifySHA1
 * @param {Jaxer.File|String} file
 * 		The File used to Verify the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */
/**

 * Verify an SHA256 Hash key for the provided file.
 * 
 * @alias Jaxer.Util.Crypto.File.verifySHA256
 * @param {Jaxer.File|String} file
 * 		The File used to Verify the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an SHA384 Hash key for the provided file.
 * 
 * @alias Jaxer.Util.Crypto.File.verifySHA384
 * @param {Jaxer.File|String} file
 * 		The File used to Verify the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */

/**
 * Verify an SHA512 Hash key for the provided file.
 * 
 * @alias Jaxer.Util.Crypto.File.verifySHA512
 * @param {Jaxer.File|String} file
 * 		The File used to Verify the hash key. Can be either
 * 		a Jaxer.File object or a String containing the absolute path to the file
 * @param {String} hash
 * 		The hash value to compare.
 * @return {String} 
 * 		true if the hash matches, false if not.
 */

// Log.trace("*** Crypto.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > DOM.js
 */
coreTraceMethods.TRACE('Loading fragment: DOM.js');
Jaxer.lastLoadedFragment = 'DOM.js';

(function() {

/**
 * @namespace {Jaxer.Util.DOM} Namespace used to hold functions and other
 * objects that extend JavaScript's DOM capabilities.
 */
Util.DOM = {};

/**
 * Convert an object's properties and property values into a string of
 * attributes suitable for use in creating a string representation of an
 * HTMLElement. Each property is used as the attribute name and each property
 * value becomes the attribute value. Attribute values are surrounding in
 * double-quotes and all property values containing double-quotes will have
 * those characters escaped with backslashes.
 * 
 * @alias Jaxer.Util.DOM.hashToAttributesString
 * @param {Object} hash
 * 		The source object
 * @return {String}
 * 		The resulting string of attribute name/value pairs
 */
Util.DOM.hashToAttributesString = function hashToAttributesString(hash)
{
	var result = [];
	
	for (var p in hash)
	{
		var value = hash[p].replace(/"/g, '\\"');
		
		result.push(p + "=\"" + value + "\"");
	}
	
	return result.join(" ");
};

/**
 * Convert an array into a string where each item is separated by a newline. If
 * the specfied item is not an Array, then the value itself will be returned.
 * 
 * @private
 * @param {Object} contents
 * 		The item to process
 * @return {Object}
 * 		The resulting string value if the "contents" item was an Array;
 * 		otherwise this returns the "contents" item itself
 */
function prepareContents(contents)
{
	return (contents instanceof Array) ? "\n" + contents.join("\n") + "\n" : contents;
}

/**
 * Create a new script element with the specified content and attributes
 * 
 * @alias Jaxer.Util.DOM.createScript
 * @param {Document} doc
 * 		The DocumentElement to use when creating elements for the active
 * 		document.
 * @param {String} contents
 * 		The text content for the script element. This value will be set via
 * 		innerHTML once the new script element has been created
 * @param {Object} [attributes]
 * 		A list of attributes and attribute values to apply to the new
 * 		ScriptElement. Each property name will become the attribute name and
 * 		each property value will become that attributes value. Note that no
 * 		escaping is done on the attributes values, so it is expected those
 * 		values are valid attribute values.
 * 		If this is omitted, a default type attribute will be used
 * 		if set in Jaxer.Config.DEFAULT_EMITTED_SCRIPT_TYPE
 * @return {ScriptElement}
 * 		The new script element with content and attributes applied.
 */
Util.DOM.createScript = function createScript(doc, contents, attributes)
{
	var script = doc.createElement("script");
	
	if (attributes)
	{
		for (var p in attributes)
		{
			if ((p != "type") || attributes[p]) // allow a way to specify no type attribute: just specify an empty type attribute
			{
				script.setAttribute(p, attributes[p]);
			}
		}
	}
	if (Config.DEFAULT_EMITTED_SCRIPT_TYPE && 		// the default is to emit a type
		(!attributes || !('type' in attributes)))	// and no other type directive was specified
	{
		script.setAttribute("type", Config.DEFAULT_EMITTED_SCRIPT_TYPE);
	}
	script.innerHTML = prepareContents(contents);
	
	return script;
};

/**
 * Creates a new script element and adds it before a specified element in the
 * DOM.
 * 
 * @alias Jaxer.Util.DOM.insertScriptBefore
 * @param {Object} contents
 * 		The text content for the script element. This value will be set via
 * 		innerHTML once the new script element has been created
 * @param {Node} elt
 * 		The element in the DOM before which the new script element will be
 * 		inserted
 * @param {Object} [attributes]
 * 		A list of attributes and attribute values to apply to the new
 * 		ScriptElement. Each property name will become the attribute name and
 * 		each property value will become that attributes value. Note that no
 * 		escaping is done on the attributes values, so it is expected those
 * 		values are valid attribute values
 * @return {ScriptElement}
 * 		The new script element with content and attributes applied.
 */
Util.DOM.insertScriptBefore = function insertScriptBefore(contents, elt, attributes)
{
	contents = prepareContents(contents);
	
	var doc = elt.ownerDocument;
	var script = Util.DOM.createScript(doc, contents, attributes);
	
	elt.parentNode.insertBefore(script, elt);
	
	return script;
};

/**
 * Creates a new script element and adds it as the first child of a specified
 * element in the DOM.
 * 
 * @alias Jaxer.Util.DOM.insertScriptAtBeginning
 * @param {Object} contents
 * 		The text content for the script element. This value will be set via
 * 		innerHTML once the new script element has been created
 * @param {Node} elt
 * 		The element in the DOM where the new script element will be added as the
 * 		element's first child.
 * @param {Object} [attributes]
 * 		A list of attributes and attribute values to apply to the new
 * 		ScriptElement. Each property name will become the attribute name and
 * 		each property value will become that attributes value. Note that no
 * 		escaping is done on the attributes values, so it is expected those
 * 		values are valid attribute values
 * @return {ScriptElement}
 * 		The new script element with content and attributes applied.
 */
Util.DOM.insertScriptAtBeginning = function insertScriptAtBeginning(contents, elt, attributes)
{
	contents = prepareContents(contents);
	
	var doc = elt.ownerDocument;
	var script = Util.DOM.createScript(doc, contents, attributes);
	
	elt.insertBefore(script, elt.firstChild);
	elt.insertBefore(doc.createTextNode("\n\t\t"), script);
	
	return script;
};

/**
 * Creates a new script element and adds it as the next sibling of the specified
 * element in the DOM.
 * 
 * @alias Jaxer.Util.DOM.insertScriptAfter
 * @param {Object} contents
 * 		The text content for the script element. This value will be set via
 * 		innerHTML once the new script element has been created
 * @param {Node} elt
 * 		The element in the DOM after which the new script element will be
 * 		inserted
 * @param {Object} [attributes]
 * 		A list of attributes and attribute values to apply to the new
 * 		ScriptElement. Each property name will become the attribute name and
 * 		each property value will become that attributes value. Note that no
 * 		escaping is done on the attributes values, so it is expected those
 * 		values are valid attribute values
 * @return {ScriptElement}
 * 		The new script element with content and attributes applied.
 */
Util.DOM.insertScriptAfter = function insertScriptAfter(contents, elt, attributes)
{
	contents = prepareContents(contents);
	
	var doc = elt.ownerDocument;
	var script = Util.DOM.createScript(doc, contents, attributes);
	
	elt.parentNode.insertBefore(script, elt.nextSibling);
	
	return script;
};

/**
 * Creates a new script element and adds it as the last child of a specified
 * element in the DOM.
 * 
 * @alias Jaxer.Util.DOM.insertScriptAtEnd
 * @param {Object} contents
 * 		The text content for the script element. This value will be set via
 * 		innerHTML once the new script element has been created
 * @param {Node} elt
 * 		The element in the DOM where the new script element will be added as the
 * 		element's last child.
 * @param {Object} [attributes]
 * 		A list of attributes and attribute values to apply to the new
 * 		ScriptElement. Each property name will become the attribute name and
 * 		each property value will become that attributes value. Note that no
 * 		escaping is done on the attributes values, so it is expected those
 * 		values are valid attribute values
 * @return {ScriptElement}
 * 		The new script element with content and attributes applied.
 */
Util.DOM.insertScriptAtEnd = function insertScriptAtEnd(contents, elt, attributes)
{
	contents = prepareContents(contents);
	
	var doc = elt.ownerDocument;
	var script = Util.DOM.createScript(doc, contents, attributes);
	
	elt.appendChild(doc.createTextNode("\n\t\t"));
	elt.appendChild(script);
	
	return script;
};

/**
 * Replace a specified element in the DOM with a new script element.
 * 
 * @alias Jaxer.Util.DOM.replaceWithScript
 * @param {Object} contents
 * 		The text content for the script element. This value will be set via
 * 		innerHTML once the new script element has been created
 * @param {Node} elt
 * 		The element to replace with the a script element
 * @param {Object} [attributes]
 * 		A list of attributes and attribute values to apply to the new
 * 		ScriptElement. Each property name will become the attribute name and
 * 		each property value will become that attributes value. Note that no
 * 		escaping is done on the attributes values, so it is expected those
 * 		values are valid attribute values
 * @return {ScriptElement}
 * 		The new script element with content and attributes applied.
 */
Util.DOM.replaceWithScript = function replaceWithScript(contents, elt, attributes)
{
	contents = prepareContents(contents);
	
	var doc = elt.ownerDocument;
	var script = Util.DOM.createScript(doc, contents, attributes);
	
	elt.parentNode.replaceChild(script, elt);
	
	return script;
};

/**
 * Inserts (and then parses/executes) the given HTML contents in the document
 * of the given element.
 * 
 * @param {String} contents
 * 		The HTML to insert into the document
 * @param {Node} elt
 * 		The element that marks where the HTML is to be inserted
 * @param {Number} [beforeReplaceAfter]
 * 		If this is < 0, insert the HTML before the element;
 * 		if this is > 0, insert the HTML after the element;
 * 		if this is 0, insert the HTML instead of the element.
 */
Util.DOM.insertHTML = function insertHTML(contents, elt, beforeReplaceAfter)
{
	if (typeof beforeReplaceAfter != "number") beforeReplaceAfter = 0;
	var doc = elt.ownerDocument;
	var range = doc.createRange();
	var parsed = range.createContextualFragment(contents);
	if (beforeReplaceAfter > 0)
	{
		range.setStartAfter(elt);
		elt.parentNode.insertBefore(parsed, elt.nextSibling);
	}
	else
	{
		range.setStartBefore(elt);
		elt.parentNode.insertBefore(parsed, elt);
	}
	if (beforeReplaceAfter == 0) elt.parentNode.removeChild(elt);
}

/**
 * Returns the serialized HTML of the given node and its contents, much like the
 * outerHTML property in IE. You can also pass the entire document as the node
 * to get the entire HTML of the document (page).
 * 
 * @alias Jaxer.Util.DOM.toHTML
 * @param {Node|Document} node
 * 		The HTML element or document (or DOM node) to be serialized
 * @return {String}
 * 		The HTML text
 */
Util.DOM.toHTML = function toHTML(node)
{
	var nodeIsDoc;
	var doc = node.ownerDocument; // ownerDocument is null iff ownerDocument is the document itself
	nodeIsDoc = (doc == null);
	if (nodeIsDoc) doc = node;
	var encoder = getDocumentEncoder(doc);
	if (!nodeIsDoc) encoder.setNode(node);
	return encoder.encodeToString();
}

function getDocumentEncoder(doc)
{
	const nsIDocumentEncoder = Components.interfaces.nsIDocumentEncoder;
	
	var contentType = doc.contentType;
	var documentEncoder = Components.classes["@mozilla.org/layout/documentEncoder;1?type=" + contentType].createInstance(nsIDocumentEncoder);
	documentEncoder.init(doc, contentType, nsIDocumentEncoder.OutputEncodeHTMLEntities | nsIDocumentEncoder.OutputRaw); /* these flags are compatible with Jaxer page serialization */
	documentEncoder.setCharset(doc.characterSet);
	return documentEncoder;
}

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > Cookie.js
 */
coreTraceMethods.TRACE('Loading fragment: Cookie.js');
Jaxer.lastLoadedFragment = 'Cookie.js';

/*
 * The functions below are used in both the client and the server Jaxer frameworks
 */

(function() {

if (!Jaxer.Util) Jaxer.Util = {};

/**
 * @namespace {Jaxer.Util.Cookie} Namespace object holding functions and members
 * for working with client (browser) cookies on the server side.
 */
Jaxer.Util.Cookie = {};

/**
 * Set a cookie name/value pair
 * 
 * @alias Jaxer.Util.Cookie.set
 * @param {String} name
 * 		The name of the cookie to set
 * @param {String} value
 * 		The value of the cookie
 */
Jaxer.Util.Cookie.set = function set(name, value)
{
	var cookieString = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=/";
	if (Jaxer.isOnServer) 
	{
		Jaxer.response.addHeader("Set-Cookie", cookieString, false);
	}
	else
	{
		document.cookie = cookieString;
	}
};

/**
 * Get a cookie key value
 * 
 * @alias Jaxer.Util.Cookie.get
 * @param {String} name
 * 		The name of the cookie to retrieve
 * @return {String}
 * 		Returns the value of the specified cookie or null if the value does not
 * 		exist.
 */
Jaxer.Util.Cookie.get = function get(name)
{
	var value = null;
	var cookies = Jaxer.Util.Cookie.getAll();
	
	if (typeof cookies[name] != "undefined")
	{
		value = cookies[name];
	}
	
	return value;
};

// specials, if given, is a hashmap that gives, for each special index, the property names to
// use for that indexed element's LHS and RHS
function parseHeaderString(str, specials)
{
	var data = {};
	var fragments = str.split(/\s*;\s*/);
	for (var i=0; i<fragments.length; i++)
	{
		var fragment = fragments[i];
		var matched = /^([^\=]+?)\s*\=\s*(.*?)$/.exec(fragment);
		if (matched && matched.length == 3) 
		{
			var lhs, rhs;
			try
			{
				lhs = decodeURIComponent(matched[1]);
			}
			catch (e)
			{
				lhs = matched[1];
				if (Jaxer.isOnServer) Jaxer.Log.debug("Malformed cookie name: name = " + lhs);
			}
			try
			{
				rhs = decodeURIComponent(matched[2]);
			}
			catch (e)
			{
				rhs = matched[2];
				if (Jaxer.isOnServer) Jaxer.Log.debug("Malformed cookie value: name = " + lhs + ", value = " + rhs);
			}
			if (specials && specials[i])
			{
				data[specials[i][0]] = lhs;
				data[specials[i][1]] = rhs;
			}
			else
			{
				data[lhs] = rhs;
			}
		}
	};
	return data;
};

/**
 * Get an object containing all cookie keys and values from the current request. 
 * Each cookie name will become a property on the object and each cookie value 
 * will become that property's value.
 * 
 * @alias Jaxer.Util.Cookie.getAll
 * @return {Object}
 * 		The resulting object of all cookie key/value pairs
 */
Jaxer.Util.Cookie.getAll = function getAll()
{
	var cookieString = Jaxer.isOnServer ? Jaxer.request.headers.Cookie : document.cookie;
	return (typeof cookieString == "string") ?
		parseHeaderString(cookieString) :
		{};
};

/**
 * Parses a given array of an HTTP response's "Set-Cookie" header strings to extract
 * the cookie fields
 * 
 * @alias Jaxer.Util.Cookie.parseSetCookieHeaders
 * @param {Array} setCookieStrings
 * 		An array of the (string) values of the HTTP response's Set-Cookie headers
 * @return {Array}
 * 		An array of objects, one per Set-Cookie header, with properties corresponding to the 
 * 		name, value, expires, path, and domain values in the header
 */
Jaxer.Util.Cookie.parseSetCookieHeaders = function parseSetCookieHeaders(setCookieStrings)
{
	if (typeof setCookieStrings == "string") setCookieStrings = [setCookieStrings];
	var cookies = [];
	for (var i=0; i<setCookieStrings.length; i++)
	{
		cookies.push(parseHeaderString(setCookieStrings[i], {0: ['name', 'value']}));
	};
	return cookies;
};

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > Certificate.js
 */
coreTraceMethods.TRACE('Loading fragment: Certificate.js');
Jaxer.lastLoadedFragment = 'Certificate.js';

(function() {

/**
 * @namespace {Jaxer.Util.Certificate} Namespace used for handling
 * information related to SSL certificates
 */
Util.Certificate = {};

/**
 * @classDescription {Jaxer.Util.Certificate.CertInfo} Information about
 * an SSL Certificate
 */

/**
 * Holds information about an SSL certificate and the SSL connection that 
 * returned it. It repackages the information in the Mozilla objects used
 * to construct it.
 * 
 * @constructor
 * @alias Jaxer.Util.Certificate.CertInfo
 * @param {Object} socketInfo
 * 		A network communication context that can be used to obtain more information about the connection
 * 		relevant to this certificate.
 * 		This is an instance of Mozilla's nsIInterfaceRequestor 
 * 		(http://www.xulplanet.com/references/xpcomref/ifaces/nsIInterfaceRequestor.html)
 * @param {Object} sslStatus
 * 		A Mozilla object that contains information about the certificate.
 * 		This is an instance of Mozilla's nsISSLStatus
 * 		(http://www.xulplanet.com/references/xpcomref/ifaces/nsISSLStatus.html)
 * @param {String} targetSite
 * 		The site name that was used to open the connection from which the certificate was returned
 * @return {Jaxer.Util.Certificate.CertInfo}
 * 		Returns an instance of CertInfo.
 */
Util.Certificate.CertInfo = function CertInfo(socketInfo, sslStatus, targetSite)
{
	/**
	 * The Mozilla object representing an X.509 certificate.
	 * See nsIX509Cert (http://www.xulplanet.com/references/xpcomref/ifaces/nsIX509Cert.html)
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.cert
	 * @property {Object}
	 */
	this.cert = sslStatus.serverCert;
	
	/**
	 * The primary email address of the certificate, if present.
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.emailAddress
	 * @property {String}
	 */
	this.emailAddress = this.cert.emailAddress;
	
	/**
	 * The subject owning the certificate.
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.subjectName
	 * @property {String}
	 */
	this.subjectName = this.cert.subjectName;
	
	/**
	 * The subject's organization.
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.organization
	 * @property {String}
	 */
	this.organization = this.cert.organization;
	
	/**
	 * The subject identifying the issuer certificate.
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.issuerName
	 * @property {String}
	 */
	this.issuerName = this.cert.issuerName;
	
	/**
	 * The issuer subject's organization.
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.issuerOrganization
	 * @property {String}
	 */
	this.issuerOrganization = this.cert.issuerOrganization;
	
	/**
	 * This certificate's validity period: the notBefore date, followed by '/',
	 * followed by the notAfter date.
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.validity
	 * @property {String}
	 */
	this.validity = this.cert.validity.notBefore + "/" + this.cert.validity.notAfter;
	
	/**
	 * The site name that was used to open the connection from which the certificate was returned.
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.targetSite
	 * @property {String}
	 */
	this.targetSite = targetSite;
	
	/**
	 * Is there a domain mismatch between the domain on this certificate and the domain that served it?
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.isDomainMismatch
	 * @property {Boolean}
	 */
	this.isDomainMismatch = sslStatus.isDomainMismatch;
	
	/**
	 * Is this certificate not trusted at this time -- because its validity period 
	 * has not yet started or has already ended?
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.isNotValidAtThisTime
	 * @property {Boolean}
	 */
	this.isNotValidAtThisTime = sslStatus.isNotValidAtThisTime;
	
	/**
	 * Is this certificate untrusted -- either because it has a missing or untrusted issuer
	 * or because it is self-signed?
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.isUntrusted
	 * @property {Boolean}
	 * @see Jaxer.Util.Certificate.CertInfo.prototype.isSelfSigned
	 */
	this.isUntrusted = sslStatus.isUntrusted;
	
	/**
	 * Is this a self-signed certificate?
	 * @alias Jaxer.Util.Certificate.CertInfo.prototype.isSelfSigned
	 * @property {Boolean}
	 */
	this.isSelfSigned = this.cert.QueryInterface(Components.interfaces.nsIX509Cert3).isSelfSigned;
	
};


})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > Overrides.js
 */
coreTraceMethods.TRACE('Loading fragment: Overrides.js');
Jaxer.lastLoadedFragment = 'Overrides.js';

(function(){

/**
 * @namespace {Jaxer.Overrides} Namespace used for overriding some of the
 * built-in JavaScript and JavaScript-environment (user-agent) functions that
 * may not make sense or need to behave differently on the server.
 */
var Overrides = {};

var overridesToApply = []; // These will be set on the developer's server-side window object
var noOps = []; // e.g. if you want to disable setTimeout and setInterval, use: ["setTimeout", "setInterval"];

/**
 * Alert in a server-side context will generate an info-level log message
 * 
 * @alias Jaxer.Overrides.alert
 * @param {String} message
 */
Overrides.alert = function alert(message)
{
	Jaxer.Log.info(message);
}
overridesToApply.push(Overrides.alert);

/**
 * Prompt in a server-side context will generate an info-level log message
 * 
 * @alias Jaxer.Overrides.prompt
 * @param {String} message
 */
Overrides.prompt = function prompt(message)
{
	Jaxer.Log.info("(prompt called for: " + message + ")");
}
overridesToApply.push(Overrides.prompt);

// The following could be used to make all server-side XHRs into synchronous ones.
// Otherwise, async ones require pumping the event loop to get the onreadystatechange to fire in time
// But note that we may then have to stop circular references to the underlying XMLHttpRequest object
//Overrides.XMLHttpRequest = function XMLHttpRequest()
//{
//	this.xhr = Jaxer.XHR.getTransport();
//	this.status = this.xhr.status;
//	this.statusText = this.xhr.statusText;
//	this.readyState = this.xhr.readyState;
//	this.responseText = this.xhr.responseText;
//	this.responseXML = this.xhr.responseXML;
//	this.onreadystatechange = null;
//}
//Overrides.XMLHttpRequest.prototype.open = function open()
//{ 
//	var args = Array.prototype.slice.call(arguments); // Turn into an array for safer manipulation
//	if (args.length < 1) throw new Error("No method argument specified");
//	if (args.length < 2) throw new Error("No url argument specified");
//	args[2] = false; // server-side requests are always synchronous
//	this.xhr.open.apply(this.xhr, args);
//}
//Overrides.XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader() { this.xhr.setRequestHeader.apply(this.xhr, arguments); }
//Overrides.XMLHttpRequest.prototype.overrideMimeType = function overrideMimeType() { this.xhr.overrideMimeType.apply(this.xhr, arguments); }
//Overrides.XMLHttpRequest.prototype.getResponseHeader = function getResponseHeader() { this.xhr.getResponseHeader.apply(this.xhr, arguments); }
//Overrides.XMLHttpRequest.prototype.getAllResponseHeaders = function getAllResponseHeaders() { this.xhr.getAllResponseHeaders.apply(this.xhr, arguments); }
//Overrides.XMLHttpRequest.prototype.send = function send()
//{ 
//	this.xhr.send.apply(this.xhr, arguments);
//	this.status = this.xhr.status;
//	this.statusText = this.xhr.statusText;
//	this.readyState = this.xhr.readyState;
//	this.responseText = this.xhr.responseText;
//	this.responseXML = this.xhr.responseXML;
//	if (typeof this.onreadystatechange == "function")
//	{
//		this.onreadystatechange();
//	}
//}
//overridesToApply.push(Overrides.XMLHttpRequest);

/**
 * Confirm in a server-side context will generate an info-level log message
 * 
 * @alias Jaxer.Overrides.confirm
 * @param {String} message
 */
Overrides.confirm = function confirm(message)
{
	Jaxer.Log.info("(confirm called for: " + message + ")");
}
overridesToApply.push(Overrides.prompt);

/**
 * Alters the built-in setter methods for various DOM FORM element prototypes to
 * alter the DOM as well as set the value of the associated in-memory property.
 * E.g., normally when you set the value of an input element, the "value"
 * attribute of the element in the DOM isn't altered. After running the function
 * below, the "value" attribute on any input element will stay in sync with its
 * in-memory value, so it will get serialized with the rest of the DOM when
 * we're ready to send the DOM to the browser.
 * 
 * @alias Jaxer.Overrides.extendDomSetters
 * @advanced
 * @param {Object} global
 * 		The global object (usually a window object) whose prototype setters are
 * 		to be overridden.
 */
Overrides.extendDomSetters = function extendDomSetters(global)
{
	if (global.HTMLInputElement) 
	{
		var inputValueSetter = global.HTMLInputElement.prototype.__lookupSetter__('value');
		global.HTMLInputElement.prototype.__defineSetter__('value', function(val)
		{
			inputValueSetter.call(this, val);
			this.setAttribute('value', val);
		});
		var inputCheckedSetter = global.HTMLInputElement.prototype.__lookupSetter__('checked');
		global.HTMLInputElement.prototype.__defineSetter__('checked', function(val)
		{
			inputCheckedSetter.call(this, val);
			if (val) 
			{
				this.setAttribute('checked', null);
			}
			else 
			{
				this.removeAttribute('checked');
			}
		});
	}
	if (global.HTMLTextAreaElement) 
	{
		var textAreaValueSetter = global.HTMLTextAreaElement.prototype.__lookupSetter__('value');
		global.HTMLTextAreaElement.prototype.__defineSetter__('value', function(val)
		{
			textAreaValueSetter.call(this, val);
			this.textContent = val;
		});
	}
	if (global.HTMLSelectElement) 
	{
		var selectSelectedIndexSetter = global.HTMLSelectElement.prototype.__lookupSetter__('selectedIndex');
		global.HTMLSelectElement.prototype.__defineSetter__('selectedIndex', function(index)
		{
			selectSelectedIndexSetter.call(this, index);
			var option = this.options[index];
			if (option) 
			{
				for (var i = 0, len = this.options.length; i < len; i++) 
				{
					if (i == index) 
					{
						this.options[i].setAttribute('selected', null);
					}
					else 
					{
						this.options[i].removeAttribute('selected');
					}
				}
			}
		});
	}
	if (global.HTMLOptionElement) 
	{
		var optionSelectedSetter = global.HTMLOptionElement.prototype.__lookupSetter__('selected');
		global.HTMLOptionElement.prototype.__defineSetter__('selected', function(val)
		{
			optionSelectedSetter.call(this, val);
			if (val) 
			{
				this.setAttribute('selected', null);
			}
			else 
			{
				this.removeAttribute('selected');
			}
		});
	}
}

/**
 * @namespace {Jaxer.Overrides.JSON} An object that exposes native functions 
 * for constructing and parsing JSON data strings.
 * A synonym for window.JSON.
 */

/**
 * Returns a JSON string representation of its argument. More options are likely
 * to be available in the future. 
 * A synonym for Jaxer.Overrides.JSON.stringify, JSON.encode, and JSON.stringify
 * 
 * @alias Jaxer.Overrides.JSON.encode
 * @param {Object} value
 * 		The value whose JSON string representation is to be returned
 * @return {String}
 * 		The JSON string representation of the value
 * @see Jaxer.Overrides.JSON.decode
 * @see Jaxer.Overrides.JSON.parse
 * @see Jaxer.Serialization.toJSONString
 */

/**
 * Returns a JSON string representation of its argument. More options are likely
 * to be available in the future. 
 * A synonym for Jaxer.Overrides.JSON.encode, JSON.encode, and JSON.stringify
 * 
 * @alias Jaxer.Overrides.JSON.stringify
 * @param {Object} value
 * 		The value whose JSON string representation is to be returned
 * @return {String}
 * 		The JSON string representation of the value
 * @see Jaxer.Overrides.JSON.decode
 * @see Jaxer.Overrides.JSON.parse
 * @see Jaxer.Serialization.toJSONString
 */

/**
 * Returns the JavaScript value represented by the given JSON string. More options are likely
 * to be available in the future. 
 * A synonym for Jaxer.Overrides.JSON.parse, JSON.decode, and JSON.parse
 * 
 * @alias Jaxer.Overrides.JSON.decode
 * @param {String} text
 * 		The JSON string describing the value to be created
 * @return {Object}
 * 		The value value represented by the JSON string
 * @see Jaxer.Overrides.JSON.encode
 * @see Jaxer.Overrides.JSON.stringify
 * @see Jaxer.Serialization.fromJSONString
 */

/**
 * Returns the JavaScript value represented by the given JSON string. More options are likely
 * to be available in the future. 
 * A synonym for Jaxer.Overrides.JSON.decode, JSON.parse, and JSON.decode
 * 
 * @alias Jaxer.Overrides.JSON.parse
 * @param {String} text
 * 		The JSON string describing the value to be created
 * @return {Object}
 * 		The value value represented by the JSON string
 * @see Jaxer.Overrides.JSON.encode
 * @see Jaxer.Overrides.JSON.stringify
 * @see Jaxer.Serialization.fromJSONString
 */

/**
 * @namespace {JSON} An object that exposes native functions 
 * for constructing and parsing JSON data strings.
 * A synonym for Jaxer.Overrides.JSON.
 */

/**
 * Returns a JSON string representation of its argument. More options are likely
 * to be available in the future. 
 * A synonym for Jaxer.Overrides.JSON.stringify, JSON.encode, and JSON.stringify
 * 
 * @alias JSON.encode
 * @param {Object} value
 * 		The value whose JSON string representation is to be returned
 * @return {String}
 * 		The JSON string representation of the value
 * @see JSON.decode
 * @see JSON.parse
 */

/**
 * Returns a JSON string representation of its argument. More options are likely
 * to be available in the future. 
 * A synonym for Jaxer.Overrides.JSON.encode, JSON.encode, and JSON.stringify
 * 
 * @alias JSON.stringify
 * @param {Object} value
 * 		The value whose JSON string representation is to be returned
 * @return {String}
 * 		The JSON string representation of the value
 * @see JSON.decode
 * @see JSON.parse
 */

/**
 * Returns the JavaScript value represented by the given JSON string. More options are likely
 * to be available in the future. 
 * A synonym for Jaxer.Overrides.JSON.parse, Jaxer.Overrides.JSON.decode, and JSON.parse
 * 
 * @alias JSON.decode
 * @param {String} text
 * 		The JSON string describing the value to be created
 * @return {Object}
 * 		The value value represented by the JSON string
 * @see JSON.encode
 * @see JSON.stringify
 */

/**
 * Returns the JavaScript value represented by the given JSON string. More options are likely
 * to be available in the future. 
 * A synonym for Jaxer.Overrides.JSON.decode, Jaxer.Overrides.JSON.parse, and JSON.decode
 * 
 * @alias JSON.parse
 * @param {String} text
 * 		The JSON string describing the value to be created
 * @return {Object}
 * 		The value value represented by the JSON string
 * @see JSON.encode
 * @see JSON.stringify
 */

var nativeJSON = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
Overrides.JSON =
{
	  encode: nativeJSON.encode
	, decode: nativeJSON.decode
	, stringify: nativeJSON.encode
	, parse: nativeJSON.decode
}

/**
 * Applies all the overrides on the given global object, including the no-ops
 * "setTimeout" and "setInterval"
 * 
 * @alias Jaxer.Overrides.applyAll
 * @advanced
 * @param {Object} global
 * 		The global (typically window) object
 */
Overrides.applyAll = function applyAll(global)
{
	overridesToApply.forEach(function(override)
	{
		global[override.name] = override;
	});
	
	noOps.forEach(function(noOpName)
	{
		global[noOpName] = function() {};
	});
	
	if (typeof global.document == "object") 
	{
		// Have to literally define and evaluate this function on the target global
		// because of issues with cross-global setters in FF3
		Includer.evalOn(Jaxer.Overrides.extendDomSetters.toSource() + "(document.defaultView)", global);
	}
	
	if (!('JSON' in global)) global.JSON = Overrides.JSON;
}

Overrides.applyAll(frameworkGlobal);
// These will also be applied on the developer's window during a request

frameworkGlobal.Overrides = Jaxer.Overrides = Overrides;

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > Both.js
 */
coreTraceMethods.TRACE('Loading fragment: Both.js');
Jaxer.lastLoadedFragment = 'Both.js';

/*
 * The functions below are used in both the client and the server Jaxer frameworks,
 * to offer common APIs for some frequently-needed tasks that need to be implemented
 * differently on client and server.
 */

if (!Jaxer.Util) Jaxer.Util = {};

/**
 * Used to set events on DOM elements such that they "do the right thing" both
 * client-side and server-side. On the client, this acts as expected, setting a
 * property with the name eventName (e.g. onclick) on the DOM element. On the
 * server, the eventName attribute is set on the DOM element so it can be
 * serialized with the DOM before sending to the client. If the handler is a
 * (server side) function with a name, the attribute's value is handler.name +
 * "()". 
 * 
 * @alias Jaxer.setEvent
 * @param {Object} domElement
 * 		The element on which to set the event
 * @param {String} eventName
 * 		The name of the event to set
 * @param {Object} handler
 * 		The handler function, or the body (as a string)
 */
Jaxer.setEvent = function setEvent(domElement, eventName, handler)
{
	if (Jaxer.isOnServer)
	{
		var attribute;
		if (typeof handler == "function")
		{
			if (handler.name == "")
			{
				attribute = "(" + handler.toSource() + ")()";
			}
			else
			{
				attribute = handler.name + "()";
			}
		}
		else // handler should be a string (the handler function's body)
		{
			attribute = handler;
		}
		domElement.setAttribute(eventName, attribute);
	}
	else
	{
		var func;
		if (typeof handler == "function")
		{
			func = handler;
		}
		else // handler should be a string (the handler function's body)
		{
			func = new Function(handler);
		}
		domElement[eventName] = func;
	}
};

/**
 * Sets the title of the document and works on either the server or the client.
 * 
 * @alias Jaxer.setTitle
 * @param {String} title
 * 		The text of the title
 */
Jaxer.setTitle = function setTitle(title)
{
	if (Jaxer.isOnServer)
	{
		if (!Jaxer.pageWindow)
		{
			throw new Exception("Jaxer.pageWindow is not available for some reason");
		}
		var doc = Jaxer.pageWindow.document;
		if (!doc)
		{
			throw new Exception("Jaxer.pageWindow.document is not available for some reason");
		}
		var titleElement = doc.getElementsByTagName("title")[0];
		if (!titleElement)
		{
			var head = doc.getElementsByTagNames("head")[0];
			if (head)
			{
				titleElement = doc.createElement("title");
				head.appendChild(titleElement);
			}
		}
		if (titleElement)
		{
			titleElement.firstChild.data = title;
		}
	}
	else
	{
		document.title = title;
	}
};

/**
 * Returns an array whose elements consist of the elements of all the arrays or
 * array-like objects passed in as arguments. If any of the arguments is null
 * or undefined (i.e. is equivalent to false) it is skipped.
 * 
 * @alias Jaxer.Util.concatArrays
 * @param {Object} [...]
 * 		Any number of arrays or array-like objects (e.g. a function's arguments meta-array).
 * 		Note that, unlike Array.concat, the arguments here need to be arrays or array-like
 * 		objects that have a length property and an indexer (i.e. obj[i] is defined)
 * @return {Array}
 * 		The concatenated array
 */
Jaxer.Util.concatArrays = function concatArrays()
{
	var all = [];
	for (var iArg = 0, lenArgs = arguments.length; iArg < lenArgs; iArg++) 
	{
		var arr = arguments[iArg];
		if (arr) 
		{
			for (iArr=0, lenArr=arr.length; iArr<lenArr; iArr++) 
			{
				all.push(arr[iArr]);
			}
		}
	}
	return all;
};

/**
 * Creates a new object whose private prototype (the one used when looking up
 * property values) will be set to the object passed into this function. This
 * allows for the resulting clone object to add new properties and to redefine
 * property values without affecting the master object. If access to the master
 * object is required, the cloned object contains a '$parent' property which
 * can be used for that purpose.
 * 
 * @param {Object} master
 * @return {Object}
 * 		Returns a new object that effectively inherits all properties of the
 * 		passed in object via JavaScript's prototype inheritance mechanism.
 */
Jaxer.Util.protectedClone = function(master)
{
	// anonymous object creator
	var f = function() {};
	
	// attach original object to prototype
	f.prototype = master;
	
	// create a new object whose [proto] now points to the original object
	var result = new f();
	
	// make a local reference to the master in cases where we need to unroll
	// the prototype chain
	result.$parent = master;
	
	// return result;
	return result;
};

/**
 * If a property on "values" is not defined on the target object, then add
 * that property and associated value to the target object. Note that the target
 * object's [proto] chain is included in the search for each property.
 * 
 * @param {Object} targetObject
 * @param {Object} values
 */
Jaxer.Util.safeSetValues = function(targetObject, values)
{
	for (var p in values)
	{
		if (!targetObject[p])
		{
			targetObject[p] = values[p];
		}
	}
};

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Utilities > Stopwatch.js
 */
coreTraceMethods.TRACE('Loading fragment: Stopwatch.js');
Jaxer.lastLoadedFragment = 'Stopwatch.js';

(function(){

/**
 * @namespace {Jaxer.Util.Stopwatch} The namespace that holds functions timing javascript
 */

Util.Stopwatch = {};

/**
 * A hashmap keyed by timer label, each element contains an Array of timing measurements.
 * @alias Jaxer.Util.Stopwatch.timings
 * @property {Object}
 */
Util.Stopwatch.timings  = {};

/**
 * A hashmap keyed by timer label, each element contains the timestamp last set.
 * @alias Jaxer.Util.Stopwatch.clocks
 * @property {Object}
 */
Util.Stopwatch.clocks 	= {};

/**
 * A hashmap keyed by lap label, each element contains the timestamp last set.
 * @alias Jaxer.Util.Stopwatch.laps
 * @property {Object}
 */
Util.Stopwatch.laps 	= {};

/**
 * Reset all the currently managed timers
 * @alias Jaxer.Util.Stopwatch.reset
 */
Util.Stopwatch.reset = function reset()
{
	Util.Stopwatch.timings 	= {};
	Util.Stopwatch.clocks 	= {};
};

/**
 * Start a timer for the provided label
 * @alias Jaxer.Util.Stopwatch.start
 * @param {String} label
 * 		A label to uniquely identify this measurement timer
 */
Util.Stopwatch.start = function start(label)
{
	label = label || 'unknownTimer';
	Util.Stopwatch.clocks[label] = (new Date()).getTime();
};

/**
 * Stops the current timer and stores the result for later analysis
 * @alias Jaxer.Util.Stopwatch.stop
 * @param {String} label
 * 		A label to uniquely identify this measurement timer
*/
Util.Stopwatch.stop = function stop(label)
{
	label = label || 'unknownTimer';
	if (!Util.Stopwatch.timings.hasOwnProperty(label)) 
	{
		Util.Stopwatch.timings[label] = [ (new Date()).getTime() -  Util.Stopwatch.clocks[label] ];
	} 
	else
	{
		Util.Stopwatch.timings[label].push((new Date()).getTime() -  Util.Stopwatch.clocks[label]);
	}
	delete Util.Stopwatch.clocks[label];
};

/**
 * A lap timer which will store the delta between each invocation for later analysis
 * @alias Jaxer.Util.Stopwatch.lap
 * @param {String} label
 * 		A label to uniquely identify this measurement timer
 */
Util.Stopwatch.lap = function lap(label)
{
	label = label || 'unknownLapTimer';

	if (Util.Stopwatch.timings.hasOwnProperty(label)) 
	{			
		Util.Stopwatch.timings[label].push( (new Date()).getTime() -  Util.Stopwatch.laps[label] );
	}
	else
	{
		Util.Stopwatch.timings[label] = [];
	}
	Util.Stopwatch.laps[label] = (new Date()).getTime();
};

/** 
 * This method is invoked to analyze/save/display the currently stored measurement timers.
 * 
 * If no function parameter is provided then contents of the measurement timers are written to the logfile.
 * If a function is provided then it is invoked with the timings hashmap (Jaxer.Util.Stopwatch.timings) as the only parameter.
 * 
 * @alias Jaxer.Util.Stopwatch.flush
 * @param {Function} [fn]
 * 		The provided function is executed before all current timers are cleared.  
 * 		The function is provided the timings hashmap (Jaxer.Util.Stopwatch.timings) as the only parameter.
 */
Util.Stopwatch.flush = function flush(fn)
{
	fn = fn || function(tm)
	{
		for (var label in tm) 
		{
			Jaxer.Log.info(label + ":" + tm[label]);
		};
	}
	fn(Util.Stopwatch.timings);
	Util.Stopwatch.reset();
};

/**
 * This method returns the value of the lapcounter for the provided label.
 * 
 * @alias Jaxer.Util.Stopwatch.lapCount
 * @param {String} label
 * 		A label to uniquely identify this measurement timer
 */
Util.Stopwatch.lapCount = function lapCount(label)
{
	label = label || 'unknownLapTimer';
	return (Util.Stopwatch.timings[label]) ? Util.Stopwatch.timings[label].length : 0;
}

// Log.trace("*** Stopwatch.js loaded");

})();


/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Logging > Log.js
 */
coreTraceMethods.TRACE('Loading fragment: Log.js');
Jaxer.lastLoadedFragment = 'Log.js';

(function() {
	
/**
 * @namespace {Jaxer.Log}
 * 
 * Log is a static object meant to be shared across the framework and perhaps
 * even the user's code. In a module, use it to create a module-specific logger
 * and then log with it.
 * 
 * @example
 * To log without a module name, use Jaxer.Log.info("my message"), where instead
 * of info you can use any of the six logging levels: trace(...), debug(...),
 * info(...), warn(...), error(...), and fatal(...). The generic logger is set
 * by default to only log messages at or above the info level.
 * 
 * @example
 * To log with a module name, first define a log helper: var log =
 * Jaxer.Log.forModule("myModule"); This will get or create the module logger
 * with this name. Then use log.info(...) or any of the other methods.
 * 
 * The default level of messages to log is set in configLog.js (default and
 * local) and can also be changed in memory:
 * 
 * @see Jaxer.Log.setLevel
 * @see Jaxer.Log.setAllModuleLevels
 */
var Log = 
{
	minLevelForStackTrace: null,
	genericLogger: null
};

/*
 * A hashtable of moduleNames -> moduleLoggers
 */
var modules = {};
var levelNames = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"];
var defaultModuleLevel = null;
var appenders = {};

/**
 * Return a array of implemented Logger levelnames e.g. "TRACE", "DEBUG",
 * "INFO", "WARN", "ERROR", "FATAL"
 * 
 * @advanced
 * @alias Jaxer.Log.getLevelNames
 * @return {String[]}
 */
Log.getLevelNames = function getLevelNames()
{
	return levelNames;
};

/**
 * Lazily creates a logger for the given module name, if needed,
 * and in any case returns it. The referenced Log object knows to create log
 * entries marked as belonging to the specific module.
 * 
 * @alias Jaxer.Log.forModule
 * @param {String} moduleName 
 * 		The name of the module (just an identifier string).
 * @return {Jaxer.Log.ModuleLogger}
 * 		The module-specific logger to use for log entries.
 */
Log.forModule = function forModule(moduleName)
{
	if (!modules[moduleName])
	{
		modules[moduleName] = new Log.ModuleLogger(moduleName, defaultModuleLevel);
	}
	return modules[moduleName];
};

/**
 * Returns a boolean to indicate whether the referenced Log object is wired to
 * do logging for the provided modulename
 * 
 * @alias Jaxer.Log.hasModule
 * @param {String} moduleName
 * 		The name of the module to look up
 * @return {Boolean}
 */
Log.hasModule = function hasModule(moduleName)
{
	return moduleName in modules;
};

/**
 * Gets a sorted array of all the currently-defined modules.
 * 
 * @advanced
 * @alias Jaxer.Log.getSortedModuleNames
 * @return {Array}
 * 		An array of strings, sorted alphabetically, of the names of modules for
 * 		which ModuleLoggers have been defined.
 */
Log.getSortedModuleNames = function getSortedModuleNames()
{
	var names = [];
	for (var name in modules)
	{
		names.push(name);
	}
	return names.sort();
};

/**
 * Set the logging level on ALL modules to level provided for the referenced Log
 * object
 * 
 * @alias Jaxer.Log.setAllModuleLevels
 * @param {Jaxer.Log.Level} level
 * 		The new level to use for all of them
 */
Log.setAllModuleLevels = function setAllModuleLevels(level)
{
	defaultModuleLevel = level;
	for (var name in modules)
	{
		modules[name].setLevel(level);
	}
};

/**
 * Add an appender to the referenced Log object
 * 
 * @advanced
 * @alias Jaxer.Log.addAppender
 * @param {String} name
 * 		The name of the appender
 * @param {Jaxer.Log.Appender} appender
 * 		An instance of the appender. It should be derived from
 * 		Jaxer.Log.Appender.
 */
Log.addAppender = function addAppender(name, appender)
{
	appenders[name] = appender;
};

/**
 * Remove the specified appender from the referenced Log object
 * 
 * @advanced
 * @alias Jaxer.Log.removeAppender
 * @param {String} name
 * 		The name of the appender to use.
 */
Log.removeAppender = function removeAppender(name)
{
	delete appenders[name];
};

/**
 * Get an appender reference from the referenced Log object
 * 
 * @advanced
 * @alias Jaxer.Log.getAppender
 * @param {String} name
 * 		The name of the appender to look for
 * @return {Jaxer.Log.Appender}
 * 		The appender instance
 */
Log.getAppender = function getAppender(name)
{
	return appenders[name];
};

/**
 * The internal logging method which logs to all the current appenders
 * 
 * @private
 * @alias Jaxer.Log._log
 * @param {String} moduleName
 * 		The associated module
 * @param {Jaxer.Log.Level} level
 * 		The level of this message
 * @param {String} message
 * 		The message to log
 * @param {Object} [exception]
 * 		An optional exception to use
 */
Log._log = function _log(moduleName, level, message, exception)
{
	for (var appenderName in appenders)
	{
		var appender = appenders[appenderName];
		if (level.isAtLeast(appender.getLevel()))
		{
			appender.append(moduleName, level, message, exception);
		}
	}
};

/**
 * Initialize the logging system
 * 
 * @private
 * @alias Jaxer.Log.init
 * @param {String} defModuleLevelName
 * 		The default name to use when there's no module name specified
 */
Log.init = function init(defModuleLevelName)
{
	for (var i=0; i<levelNames.length; i++)
	{
		var levelName = levelNames[i];
		Log[levelName] = new Log.Level(levelName, i * 1000);
	}
	defaultModuleLevel = Log[defModuleLevelName];

	Log.genericLogger = Log.forModule("framework");

	for (var i=0; i<levelNames.length; i++)
	{
		var methodName = levelNames[i].toLowerCase();
		eval('Log[methodName] = function() { Log.genericLogger["' + methodName + '"].apply(Log.genericLogger, arguments); }');
	}

	Log.minLevelForStackTrace = Log.ERROR;
};

/**
 * Logs a message at the "TRACE" level. The message will only be appended to the
 * log if the level for that module (and that appender) is set at
 * Jaxer.Log.TRACE. This is the most verbose level - instrument your code
 * liberally with trace() calls to be able to pinpoint any issues.
 * 
 * @alias Jaxer.Log.trace
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from. By default, it's the function that called this logging
 * 		method.
 */

/**
 * Logs a message at the "DEBUG" level. The message will only be appended to the
 * log if the level for that module (and that appender) is set at or below
 * Jaxer.Log.DEBUG. This is the second-most verbose level - instrument your code
 * with debug() calls in those places where debugging is likely to benefit from
 * them.
 * 
 * @alias Jaxer.Log.debug
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from. By default, it's the function that called this logging
 * 		method.
 */

/**
 * Logs a message at the "INFO" level. The message will only be appended to the
 * log if the level for that module (and that appender) is set at or below
 * Jaxer.Log.INFO. By default, modules are set to show messages at this level,
 * so use info() when you want to show log messages without needing to set the
 * level to more verbose than usual, but don't keep info() messages in your code
 * long term.
 * 
 * @alias Jaxer.Log.info
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from. By default, it's the function that called this logging
 * 		method.
 */

/**
 * Logs a message at the "WARN" level. The message will only be appended to the
 * log if the level for that module (and that appender) is set at or below
 * Jaxer.Log.WARN. Use this to warn of any unusual or unexpected, but not
 * necessarily erroneous, conditions.
 * 
 * @alias Jaxer.Log.warn
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from. By default, it's the function that called this logging
 * 		method.
 */

/**
 * Logs a message at the "ERROR" level. The message will only be appended to the
 * log if the level for that module (and that appender) is set at or below
 * Jaxer.Log.ERROR. Use this to log non-fatal but nonetheless real errors.
 * 
 * @alias Jaxer.Log.error
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from.	By default, it's the function that called this logging
 * 		method.
 */

/**
 * Logs a message at the "FATAL" level. The message will only be appended to the
 * log if the level for that module (and that appender) is set at or below
 * Jaxer.Log.FATAL. Use this to log the most serious errors.
 * 
 * @alias Jaxer.Log.fatal
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from. By default, it's the function that called this logging
 * 		method.
 */

/**
 * Set the logging level for the generic logger (the one that's not module-
 * specific)
 * 
 * @alias Jaxer.Log.setLevel
 * @param {Jaxer.Log.Level} level
 * 		The level to use on the generic logger messages below this level will
 * 		not be logged.
 */
Log.setLevel = function(level)
{
	Log.genericLogger.setLevel(level);
};

/**
 * Get the logging level of the generic logger
 * 
 * @alias Jaxer.Log.getLevel
 * @return {Jaxer.Log.Level}
 * 		The level below which non-module-specific messages will not be logged
 */
Log.getLevel = function getLevel()
{
	return Log.genericLogger.getLevel();
};

/**
 * Get the current JavaScript stack trace.
 * 
 * @alias Jaxer.Log.getStackTrace
 * @param {String} [linePrefix]
 * 		An optional prefix (e.g. whitespace for indentation) to prepend to every
 * 		line of the stack trace
 * @param {Number} [framesToSkip]
 * 		An optional number of frames to skip before starting to trace the
 * 		remaining frames
 * @return {String}
 * 		The stack trace as a string consisting of a number of lines, starting at
 * 		the deepest frame
 */
Log.getStackTrace = function getStackTrace(linePrefix, framesToSkip)
{
	if (typeof linePrefix != "string") linePrefix = '';
	if (!Util.Math.isInteger(framesToSkip) || framesToSkip < 0) framesToSkip = 0;
	var stack = Components.stack.caller;
	if (framesToSkip) 
	{
		var leftToSkip = framesToSkip;
		while (leftToSkip > 0 && stack) 
		{
			stack = stack.caller;
			leftToSkip--;
		}
	}
	var iterations = 0;
	var stackTrace = [];
	var MAX_ITERATIONS = 50;
	while (stack && (iterations < MAX_ITERATIONS))
	{
		var filename = stack.filename.replace(/^.*\//, '');
		var name = (stack.name == null) ? '<no name>' : stack.name;
		stackTrace.push(linePrefix + name + " [line " + stack.lineNumber + " of " + filename + " (" + stack.filename + ")]");
		stack = stack.caller;
		iterations++;
	}
	if (iterations >= MAX_ITERATIONS)
	{
		stackTrace.push(linePrefix + "<TRUNCATED>");
	}
	return stackTrace.join("\n");
}

/**
 * Get the current JavaScript stack trace.
 * 
 * @alias Jaxer.Log.getStackTraceAlt
 * @param {String} [linePrefix]
 * 		An optional prefix (e.g. whitespace for indentation) to prepend to every
 * 		line of the stack trace
 * @param {Number} [framesToSkip]
 * 		An optional number of frames to skip before starting to trace the
 * 		remaining frames
 * @return {String}
 * 		The stack trace as a string consisting of a number of lines, starting at
 * 		the deepest frame
 */
Log.getStackTraceAlt = function getStackTraceAlt(linePrefix, framesToSkip)
{
	if (typeof linePrefix != "string") linePrefix = '';
	
	if (!Util.Math.isInteger(framesToSkip) || framesToSkip < 0) framesToSkip = 0;
	
	var stack = Components.stack.caller;
	if (framesToSkip) 
	{
		var leftToSkip = framesToSkip;
		while (leftToSkip > 0 && stack) 
		{
			stack = stack.caller;
			leftToSkip--;
		}
	}
	var iterations = 0;
	var stackTrace = ["\nstack:"];
	var filePaths = {};
	
	var MAX_ITERATIONS = 50;
	while (stack && (iterations < MAX_ITERATIONS))
	{
		var filename = stack.filename.replace(/^.*\//, '');
		var name = (stack.name == null) ? '<no name>' : stack.name;
		
		stackTrace.push(linePrefix + " [" + filename +":" + stack.lineNumber + "] "+ name );
		filePaths[filename] = stack.filename.replace(/.*->\s/, '');
		stack = stack.caller;
		iterations++;
	}
	
	stackTrace.push(["paths:"]);
	for each( p in filePaths)
	{
		stackTrace.push(linePrefix + p );
	}
	
	if (iterations >= MAX_ITERATIONS)
	{
		stackTrace.push(linePrefix + "<TRUNCATED>");
	}
	return stackTrace.join("\n");
}



frameworkGlobal.Log = Jaxer.Log = Log;

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Logging > Level.js
 */
coreTraceMethods.TRACE('Loading fragment: Level.js');
Jaxer.lastLoadedFragment = 'Level.js';

(function(){
	
/**
 * @classDescription {Jaxer.Log.Level} Logging level object used by the Logging
 * facility to set or determine the current log levels.
 */

/**
 * The constructor of a logging level object.Messages must exceed a certain
 * severity level before they are logged.
 * 
 * @constructor
 * @alias Jaxer.Log.Level
 * @param {String} name
 * 		The name of the level
 * @param {Number} value
 * 		The numeric value to associate with this level. Higher numbers are more
 * 		severe.
 * @return {Jaxer.Log.Level}
 * 		Returns an instance of Level.
 */
function Level(name, value)
{
	this.name = name.toUpperCase();
	this.value = value;
}

/**
 * The textual representation of a level, namely its name
 * 
 * @alias Jaxer.Log.Level.prototype.toString
 * @return {String} The name
 */
Level.prototype.toString = function toString()
{
	return this.name;
}

/**
 * A common comparison operator on Jaxer.Log.Level objects: is the current level
 * at or above the given level?
 * 
 * @alias Jaxer.Log.Level.prototype.isAtLeast
 * @return {Boolean}
 * 		true if matches or exceeds the given level
 */
Level.prototype.isAtLeast = function isAtLeast(otherLevel)
{
	return this.value >= otherLevel.value;
}

/**
 * A common comparison operator on Jaxer.Log.Level objects: is the current level
 * at or below the given level?
 * 
 * @alias Jaxer.Log.Level.prototype.isAtOrBelow
 * @return {Boolean}
 * 		true if matches or falls below the given level
 */
Level.prototype.isAtOrBelow = function isAtOrBelow(otherLevel)
{
	return this.value <= otherLevel.value;
}

/**
 * A common comparison operator on Jaxer.Log.Level objects: is the current level
 * below the given level?
 * 
 * @alias Jaxer.Log.Level.prototype.isBelow
 * @return {Boolean}
 * 		true if falls below the given level
 */
Level.prototype.isBelow = function isBelow(otherLevel)
{
	return this.value < otherLevel.value;
}

Log.Level = Level;

})();


/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Logging > ModuleLogger.js
 */
coreTraceMethods.TRACE('Loading fragment: ModuleLogger.js');
Jaxer.lastLoadedFragment = 'ModuleLogger.js';

(function(){

/**
 * @classDescription {Jaxer.Log.ModuleLogger} Object created by the 
 * global Log.forModule("...") method for module-specific logging.
 */

/**
 * An object that's created only through the global Log.forModule("...") method
 * for module-specific logging. Usually you create such a logger at the
 * beginning of your module, and then use it throughout your module for logging
 * at various levels. It has its own level, so you can control the verbosity of
 * logging per module.
 * 
 * @constructor
 * @alias Jaxer.Log.ModuleLogger
 * @param {String} moduleName
 * 		The name to use for the module
 * @param {Jaxer.Log.Level}
 * 		The log level for the module
 * @return {Jaxer.Log.ModuleLogger}
 * 		Returns an instance of ModuleLogger.
 */
function ModuleLogger(name, level)
{
	this.moduleName = name;
	this.level = level;
}

/**
 * The internal logging function for the module logger, meant to be called from
 * the level-specific methods. It ASSUMES that its caller's caller is the
 * function that's really doing the logging, and uses its name in the log (as
 * well as the module's name).
 * 
 * @private
 * @alias Jaxer.Log.ModuleLogger.prototype._log
 * @param {Jaxer.Log.Level} level
 * 		The level at which to log the message
 * @param {String} message
 * 		The message (the module and caller will be prepended automatically)
 * @param {Jaxer.Exception} [exception]
 * 		Optional: an exception to log
 */
ModuleLogger.prototype._log = function _log(level, message, exception, inFunction)
{
	if (level.isBelow(this.level))
	{
		return;
	}
	if (!inFunction) inFunction = this._log.caller.caller;
	var calledFrom = (typeof inFunction == "function") ? inFunction.name : "";
	message = "[" + this.moduleName + "." + calledFrom + "] " + message;
	if ((typeof inFunction == "function") && level.isAtLeast(Log.minLevelForStackTrace))
	{
		message += Log.getStackTraceAlt("  -> ", 1)+"\n";
	}
	Log._log(this.moduleName, level, message, exception);
};

// Create methods for the various levels
var levelNames = Log.getLevelNames();

for (var i = 0; i < levelNames.length; i++)
{
	var levelName = levelNames[i];
	var methodName = levelName.toLowerCase();
	eval('ModuleLogger.prototype["' + methodName + '"] = function ' + methodName + '(message, exception, inFunction) { this._log(Log.' + levelName + ', message, exception, inFunction); }');
}

/**
 * Logs a message at the "TRACE" level for this module. The message will only be
 * appended to the log if the level for this module (and that appender) is set
 * at Jaxer.Log.TRACE. This is the most verbose level - instrument your code
 * liberally with trace() calls to be able to pinpoint any issues.
 * 
 * @alias Jaxer.Log.ModuleLogger.prototype.trace
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 *		An optional indication of which function this message should appear to
 		originate from. By default, it's the function that called this logging
 		method.
 */

/**
 * Logs a message at the "DEBUG" level for this module. The message will only be
 * appended to the log if the level for this module (and that appender) is set
 * at or below Jaxer.Log.DEBUG. This is the second-most verbose level -
 * instrument your code with debug() calls in those places where debugging is
 * likely to benefit from them.
 * 
 * @alias Jaxer.Log.ModuleLogger.prototype.debug
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from.	By default, it's the function that called this logging
 * 		method.
 */

/**
 * Logs a message at the "INFO" level for this module. The message will only be
 * appended to the log if the level for this module (and that appender) is set
 * at or below Jaxer.Log.INFO. By default, modules are set to show messages at
 * this level, so use info() when you want to show log messages without needing
 * to set the level to more verbose than usual, but don't keep info() messages
 * in your code long term.
 * 
 * @alias Jaxer.Log.ModuleLogger.prototype.info
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from. By default, it's the function that called this logging
 * 		method.
 */

/**
 * Logs a message at the "WARN" level for this module. The message will only be
 * appended to the log if the level for this module (and that appender) is set 
 * at or below Jaxer.Log.WARN. Use this to warn of any unusual or unexpected,
 * but not necessarily erroneous, conditions.
 * 
 * @alias Jaxer.Log.ModuleLogger.prototype.warn
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from.	By default, it's the function that called this logging
 * 		method.
 */

/**
 * Logs a message at the "ERROR" level for this module. The message will only be
 * appended to the log if the level for this module (and that appender) is set
 * at or below Jaxer.Log.ERROR. Use this to log non-fatal but nonetheless real
 * errors.
 * 
 * @alias Jaxer.Log.ModuleLogger.prototype.error
 * @param {String} message
 * 		Tthe message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from. By default, it's the function that called this logging
 * 		method.
 */

/**
 * Logs a message at the "FATAL" level for this module. The message will only be
 * appended to the log if the level for this module (and that appender) is set
 * at or below Jaxer.Log.FATAL. Use this to log the most serious errors.
 * 
 * @alias Jaxer.Log.ModuleLogger.prototype.fatal
 * @param {String} message
 * 		The message to append to the log. The timestamp, modulename, and
 * 		terminating newline will be added automatically.
 * @param {Error} [exception]
 * 		An optional error or exception to be logged with this message
 * @param {Function} [inFunction]
 * 		An optional indication of which function this message should appear to
 * 		originate from.	By default, it's the function that called this logging
 * 		method.
 */

/**
 * Gets the level to which this ModuleLogger is set -- appending messages below
 * this level will do nothing
 * 
 * @alias Jaxer.Log.ModuleLogger.prototype.getLevel
 * @return {Jaxer.Log.Level}
 * 		The current level
 */
ModuleLogger.prototype.getLevel = function getLevel()
{
	return this.level;
};

/**
 * Sets the level below which this moduleLogger will not log messages.
 * 
 * @alias Jaxer.Log.ModuleLogger.prototype.setLevel
 * @param {Jaxer.Log.Level} level
 * 		The minimum loggable level. Should be one of Jaxer.Log.TRACE, Jaxer.Log.DEBUG,
 * 		Jaxer.Log.INFO, Jaxer.Log.WARN, Jaxer.Log.ERROR, Jaxer.Log.FATAL.
 */
ModuleLogger.prototype.setLevel = function setLevel(level)
{
	this.level = level;
};

Log.ModuleLogger = ModuleLogger;

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Logging > Appender.js
 */
coreTraceMethods.TRACE('Loading fragment: Appender.js');
Jaxer.lastLoadedFragment = 'Appender.js';

(function(){

/**
 * @classDescription {Jaxer.Log.Appender} Base class of all Appenders: listeners
 * that know how to append log messages somewhere, e.g. to a file or a database.
 */

/**
 * This is the base class of all Appenders: listeners that know how to append
 * log messages somewhere, e.g. to a file or a database.
 * 
 * @advanced
 * @constructor
 * @alias Jaxer.Log.Appender
 * @param {String} name
 * 		The name to use to identify this appender
 * @param {Jaxer.Log.Level} level
 * 		The level to start this appender at -- messages below this will not be
 * 		appended
 * @return {Jaxer.Log.Appender}
 * 		Returns an instance of Appender.
 */
function Appender(name, level)
{
	this.level = level;
}

/**
 * Append a message associated with the given module to the log
 * 
 * @private
 * @alias Jaxer.Log.Appender.append
 * @param {String} moduleName
 * 		The name of the module to use
 * @param {Jaxer.Log.Level} level
 * 		The level to use for this message
 * @param {String} message
 * 		The message to log
 * @param {Object} [exception]
 * 		An optional exception object to use
 */
Appender.prototype.append = function append(moduleName, level, message, exception)
{
};

/**
 * The level to which this appender is set. Messages below this level will not
 * be logged.
 * 
 * @advanced
 * @alias Jaxer.Log.Appender.prototype.getLevel
 * @return {Jaxer.Log.Level}
 * 		The current level
 */
Appender.prototype.getLevel = function getLevel()
{
	return this.level;
};

/**
 * Sets the level below which this appender will not log messages.
 * 
 * @advanced
 * @alias Jaxer.Log.Appender.prototype.setLevel
 * @param {Jaxer.Log.Level} level
 *		The minimum loggable level. Should be one of Log.TRACE, Log.DEBUG,
 *		Log.INFO, Log.WARN, Log.ERROR, Log.FATAL.
 */
Appender.prototype.setLevel = function setLevel(level)
{
	this.level = level;
};

/**
 * Identifies this appender instance by name
 * 
 * @advanced
 * @alias Jaxer.Log.Appender.prototype.toString
 * @return {String}
 * 		The appender's name
 */
Appender.prototype.toString = function()
{
	return "[" + this.name + "]";
};

Log.Appender = Appender;

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Logging > FileAppender.js
 */
coreTraceMethods.TRACE('Loading fragment: FileAppender.js');
Jaxer.lastLoadedFragment = 'FileAppender.js';

(function() {

/**
 * @classDescription {Jaxer.Log.FileAppender} File-based Log Appender.
 */

/**
 * Create an instance of the FileAppender, a file-based Appender
 * 
 * @advanced
 * @alias Jaxer.Log.FileAppender
 * @constructor
 * @param {String} name 
 * 		The appender name
 * @param {Jaxer.Log.Level} level 
 * 		The logging level to start using with this appender
 * @param {String} logPath 
 * 		The path to the logfile
 * @return {Jaxer.Log.FileAppender}
 * 		Returns an instance of FileAppender.
 */
var FileAppender = function FileAppender(name, level, logPath) 
{
	Log.Appender.call(this, name, level);
	this.logPath = logPath;
};

FileAppender.prototype = new Log.Appender("");
FileAppender.constructor = FileAppender;

/**
 * Set the  path for the filesystem logging target
 * 
 * @advanced
 * @alias Jaxer.Log.FileAppender.prototype.setPath
 * @param {String} newPath 
 * 		The new path to use for this appender. 
 */
FileAppender.prototype.setPath = function(newPath)
{
	this.logPath = newPath;
}

/**
 * Appends the provided message to the referenced appenders log
 * 
 * @advanced
 * @alias Jaxer.Log.FileAppender.prototype.append
 * @param {String} moduleName
 * 		The name of the module to use
 * @param {Jaxer.Log.Level} level
 * 		The level to use for this message
 * @param {String} message
 * 		The message to log
 * @param {Object} [exception]
 * 		An optional exception object to use
*/
FileAppender.prototype.append = function(moduleName, level, message, exception) 
{
	if (this.logPath == null || this.logPath == "") return;
	
	var formattedMessage = Util.DateTime.toPaddedString(new Date()) + " [" + level + "] [" + moduleName + "] " + message + (exception ? ('; ' + exception) : '') + "\n";

	File.append(this.logPath, formattedMessage);

};

Log.FileAppender = FileAppender;

})();


/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Logging > CoreAppender.js
 */
coreTraceMethods.TRACE('Loading fragment: CoreAppender.js');
Jaxer.lastLoadedFragment = 'CoreAppender.js';

(function() {
	
/**
 * @classDescription {Jaxer.Log.CoreAppender} Appends log messages to the same
 * file as the Jaxer core.
 */

/**
 * Create an instance of the Core appender -- appends log messages to the same
 * file as the Jaxer core
 * 
 * @advanced
 * @alias Jaxer.Log.CoreAppender
 * @constructor
 * @param {String} name 
 * 		The name to use to identify this appender
 * @param {Jaxer.Log.Level} level
 * 		The level to start this appender at -- messages below this will not be
 * 		appended
 * @param {Object} coreTraceMethods
 * 		The hashtable of core trace methods that this should invoke
 * @param {Function} coreTraceBefore
 * 		The core function to call before calling any core method -- it will turn
 * 		on logging regardless of the core's settings
 * @param {Function}  coreTraceAfter
 * 		The core function to call after calling any core method -- it will
 * 		restore using the core's log settings
 * @return {Jaxer.Log.CoreAppender}
 * 		Returns an instance of CoreAppender.
 */
var CoreAppender = function CoreAppender(name, level, coreTraceMethods, coreTraceBefore, coreTraceAfter)
{
	Log.Appender.call(this, name, level);
	this.coreTraceMethods = coreTraceMethods;
	this.coreTraceBefore = coreTraceBefore;
	this.coreTraceAfter = coreTraceAfter;
};

CoreAppender.prototype = new Log.Appender("");
CoreAppender.constructor = CoreAppender;

/**
 * Append a message associated with the given module to the log
 * 
 * @private
 * @alias Jaxer.Log.CoreAppender.prototype.append
 * @param {String} moduleName
 * 		The name of the module to use
 * @param {Jaxer.Log.Level} level
 * 		The level to use for this message
 * @param {String} message
 * 		The message to log
 * @param {Object} [exception]
 * 		An optional exception object to use
 */
CoreAppender.prototype.append = function(moduleName, level, message, exception) 
{
	
	try
	{
		if (coreTraceBefore) coreTraceBefore();
		this.coreTraceMethods[level.name](message + (exception ? ('; ' + exception) : ''));
	}
	finally
	{
		if (coreTraceAfter) coreTraceAfter();
	}

};

Log.CoreAppender = CoreAppender;

})();


/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Logging > LogInit.js
 */
coreTraceMethods.TRACE('Loading fragment: LogInit.js');
Jaxer.lastLoadedFragment = 'LogInit.js';

Log.init("WARN");

if (typeof Config.USE_CORE_LOG_FILE != "undefined" && Config.USE_CORE_LOG_FILE)
{
	var coreAppender = new Log.CoreAppender("CoreAppender", Log.TRACE, coreTraceMethods, coreTraceBefore, coreTraceAfter);
	Log.addAppender(coreAppender.name, coreAppender);
}
else // use file logging
{
	
	var getService = function(aURL, aInterface){
	    try {
	        // determine how 'aInterface' is passed and handle accordingly
	        switch (typeof(aInterface)) {
	            case "object":
	                return Components.classes[aURL].getService(aInterface);
	                break;
	                
	            case "string":
	                return Components.classes[aURL].getService(JSLib.interfaces[aInterface]);
	                break;
	                
	            default:
	                return Components.classes[aURL].getService();
	                break;
	        }
	    } 
	    catch (e) {
	        throw new Exception(e);
	    }
	}

	var logPath;
	if (typeof Config.LOG_PATH == "string")
	{
		logPath = Config.LOG_PATH;
	}
	else
	{
		var logDir = getService("@mozilla.org/file/directory_service;1", "nsIProperties").get("CurProcD", Components.interfaces.nsIFile).path;
		var logFileName = (typeof Config.LOG_FILE_NAME == "string") ? Config.LOG_FILE_NAME : "jaxerFrameworkLog.txt";
		logPath = Dir.combine(logDir, logFileName);
	}
	
	var fileAppender = new Log.FileAppender("FileAppender", Log.TRACE, logPath);
	Log.addAppender(fileAppender.name, fileAppender);
}

Jaxer.include(Config.FRAMEWORK_DIR + "/configLog.js");
if (typeof Config.LOCAL_CONF_DIR == "string") Jaxer.include(Config.LOCAL_CONF_DIR + "/configLog.js");

if (Log.CLIENT_SIDE_CONSOLE_SUPPORT)
{
	var consoleSupport = function()
	{
		if (typeof Jaxer == "undefined") Jaxer = {};
		function hasConsole() { return window.console && typeof window.console.debug == "function" && typeof window.console.info == "function" && typeof window.console.warn == "function" && typeof window.console.error == "function"; };
		function ModuleLogger(moduleName, defaultLevel)
		{
			this.moduleName = moduleName;
			this.level = (typeof defaultLevel == "number") ? defaultLevel : 2;
			var prefix = "[Jaxer.";
			var suffix = "]: ";
			var levels = {trace: [0, "debug"], debug: [1, "debug"], info: [2, "info"], warn: [3, "warn"], error: [4, "error"], fatal: [5, "error"]};
			var ff = function(l) { return function(msg) { if (hasConsole() && this.level<=levels[l][0]) window.console[levels[l][1]]([prefix, this.moduleName, suffix, msg].join(''))}; };
			for (var l in levels)
			{
				this[l] = ff(l);
				this[l.toUpperCase()] = levels[l][0];
			}
			modules[this.moduleName] = this;
		};
		var modules = {};
		Jaxer.Log = new ModuleLogger("");
		Jaxer.Log.forModule = function forModule(moduleName) { return (typeof modules[moduleName] == "undefined") ? new ModuleLogger(moduleName) : modules[moduleName]; };
	};
	if (!Jaxer.beforeClientFramework) Jaxer.beforeClientFramework = [];
	Jaxer.beforeClientFramework.push({contents: consoleSupport.toSource().replace(/\n/g, " ") + "();", src: null});
}

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Comm > XHR.js
 */
coreTraceMethods.TRACE('Loading fragment: XHR.js');
Jaxer.lastLoadedFragment = 'XHR.js';

(function() {

// This is a server- and client-side, compressible module -- be sure to end each function declaration with a semicolon

var log = Jaxer.Log.forModule("XHR");

function getWindow()
{
	if (Jaxer.isOnServer)
	{
		return Jaxer.pageWindow || this.__parent__;
	}
	else
	{
		return window;
	}
};

/**
 * @namespace {Jaxer.XHR} Namespace to hold the Jaxer client-side cross-browser
 * wrapper around XMLHttpRequest.
 */
var XHR = {};

/**
 * The value of the "reason" property that indicates a timeout has occurred.
 * This property is set on the Error object that's thrown by XHR.send() during
 * synchronous requests that don't use the onsuccess function but rather just
 * return a response or throw an Error.
 * 
 * @advanced
 * @alias Jaxer.XHR.REASON_TIMEOUT
 * @property {String}
 */
XHR.REASON_TIMEOUT = "timeout";

/**
 * The value of the "reason" property that indicates a communication failure has
 * occurred. This property is set on the Error object that's thrown by
 * XHR.send() during synchronous requests that don't use the onsuccess function
 * but rather just return a response or throw an Error.
 * 
 * @advanced
 * @alias Jaxer.XHR.REASON_FAILURE
 * @property {String}
 */
XHR.REASON_FAILURE = "failure";

XHR.asyncRequests = {}; // Holds identifier codes for the pending async requests so you can call XHR.cancel() on them

/**
 * The default client-side function used to handle any errors that occur during
 * XMLHttpRequest processing by throwing an error describing them
 * 
 * @advanced
 * @alias Jaxer.XHR.onfailure
 * @param {Object} error
 * 		An error object describing the error, if one was thrown. Otherwise this
 * 		is null.
 * @param {Object} extra
 * 		Any extra information passed into Jaxer.XHR.send(), e.g. to make error
 * 		messages more informative.
 * @param {XMLHttpRequest} xhr
 * 		The XMLHttpRequest object that contains the information received from
 * 		the server,	e.g. in xhr.status and xhr.responseText. It may be null if
 * 		an error was encountered creating it.
 */
XHR.onfailure = function onfailure(error, extra, xhr)
{
	if (xhr) 
	{
		var status;
		try
		{
			status = xhr.status;
		}
		catch (e) {}
		throw new Error("XMLHttpRequest: Received status " + String(xhr.status) + " from the server\n" +
			"Response from server: " + xhr.responseText);
	}
	else if (error)
	{
		throw error;
	}
};

/**
 * The default client-side function used to handle any timeout errors that occur
 * during XMLHttpRequest processing by throwing an error describing them
 * 
 * @advanced
 * @alias Jaxer.XHR.ontimeout
 * @param {Error} timeout
 * 		The timeout error object encountered, having a "timeout" property with
 * 		its value indicating the timeout (in milliseconds) used in this request.
 * @param {Object} extra
 * 		Any extra information passed into Jaxer.XHR.send(), e.g. to make error
 * 		messages more informative.
 * @param {XMLHttpRequest} xhr
 * 		The XMLHttpRequest object that contains the information received from
 * 		the server, e.g. in xhr.status and xhr.responseText. It may be null if
 * 		an error was encountered creating it.
 */
XHR.ontimeout = function ontimeout(error, extra, xhr)
{
	throw new Error("XMLHttpRequest: Request timed out after " + (error.timeout/1000) + " seconds");
};

/**
 * Returns an XMLHttpRequest object by calling the platform-specific API for it.
 * On the server side of Jaxer, the XPCOM version of XMLHttpRequest is used.
 * 
 * @advanced
 * @alias Jaxer.XHR.getTransport
 * @return {XMLHttpRequest}
 */
XHR.getTransport = function getTransport()
{
	var xhr, e, win;
	win = getWindow();
	try
	{
		// On IE use the most common/standard ActiveX call to minimize version bugs/weirdnesses
		xhr = win.ActiveXObject ? new win.ActiveXObject("Microsoft.XMLHTTP") : new win.XMLHttpRequest();
	}
	catch (e) {} // May be needed on older versions of IE to prevent "automation error" notifications
	if (!xhr)
	{
		throw new Error("Could not create XMLHttpRequest" + (e ? '\n' + e : ''));
	}
	return xhr;
};

/**
 * The default function used to test whether the XMLHttpRequest got a successful
 * response or not, in particular using xhr.status, location.protocol and some
 * browser sniffing.
 * 
 * @advanced
 * @alias Jaxer.XHR.testSuccess
 * @param {XMLHttpRequest} xhr
 * 		The XMLHttpRequest object that got the response
 * @return {Boolean}
 * 		true if successful, false otherwise
 */
XHR.testSuccess = function testSuccess(xhr)
{
	var success = false;
	var win = getWindow();
	try
	{
		success =
			(!xhr.status && win.location && win.location.protocol == "file:") ||
			(xhr.status >= 200 && xhr.status < 300) || 
			(xhr.status == 304) ||
			(win.navigator && win.navigator.userAgent.match(/webkit/) && xhr.status == undefined);
	}
	catch(e) { }
	return success;
};

/**
 * The generic function used to send requests via XMLHttpRequest objects. Each
 * request gets its own XMLHttpRequest object, and async requests hold onto that
 * object until they're finished or timed out or canceled. On the server side of
 * Jaxer, only synchronous requests are supported.
 * <br><br>
 * For async requests, this returns a key that can be used to abort the request
 * via Jaxer.XHR.cancel().
 * <br><br>
 * For synchronous requests, returns the response of the server or throws an
 * exception if an error occurred, unless an onsuccess function was specified in
 * the options, in which case it passes the response to that function and also
 * handles any errors through the onfailure function if specified in the
 * options.
 * <br><br>
 * In any case, the response can be a text string or an XML DOM. To force one or
 * the other, set the "as" property on the options argument, e.g. if as="text"
 * it will definitely be a text string, if as="xml" it will definitely be an
 * XML DOM, and if as="e4x" it will be an E4X DOM (if E4X is supported -- 
 * which is always the case server-side but may not be client-side).
 * 
 * @alias Jaxer.XHR.send
 * @param {String} message
 * 		The message to send, usually as a query string
 * 		("name1=value&name2=value2...")
 * @param {Jaxer.XHR.SendOptions|Object} [options]
 * 		A JavaScript object (hashmap) of name: value property pairs specifying
 * 		how to handle this request.
 * @param {Object} extra
 * 		Any extra information that might be useful e.g. in the error handlers on
 * 		this request. This object is simply passed on to them if/when they're
 * 		called. E.g. Jaxer.Callback uses this information to pass the name of
 * 		the function being called remotely, so error messages can be more
 * 		informative.
 * @return {Object}
 * 		For async requests, a key to the XHR object; for synchronous requests
 * 		(with no onsuccess handler in the options), a text string or an XML DOM,
 * 		or an object containing detailed information about the response (if
 * 		the options specified extendedResponse=true)
 */
XHR.send = function send(message, options, extra)
{
	
	var win = getWindow();
	var xmlSerializer = (typeof win.XMLSerializer == "function") ? new win.XMLSerializer() : null;
	var e4xConstructor = (typeof win.XML == "function") ? win.XML : null;

	if (typeof message != "string")
	{
		if ((message == null) || (message == undefined) || (typeof message.toString != "function"))
		{
			message = '';
		}
		else
		{
			message = message.toString();
		}
	}
	options = options || {};
	var as = options.as || XHR.defaults.as || '';
	as = as.toLowerCase();
	var url = options.url || XHR.defaults.url || Jaxer.CALLBACK_URI;
	url = url.replace(/#.*$/, ''); // strip off any fragment
	var cacheBuster = (typeof options.cacheBuster == "undefined") ? XHR.defaults.cacheBuster : options.cacheBuster;
	if (cacheBuster) url += (url.match(/\?/) ? "&" : "?") + "_rnd" + ((new Date()).getTime()) + "=" + Math.random();
	var method = String(options.method || XHR.defaults.method || "GET").toUpperCase();
	if ((method == "GET") && (message != ''))
	{
		url += (url.match(/\?/) ? "&" : "?") + message;
		message = ''; // prevent submitting this twice in IE
	}
	var async = (typeof options.async == "undefined") ? XHR.defaults.async : options.async;
	var username = options.username || XHR.defaults.username || null;
	var password = options.password || XHR.defaults.password || null;
	var onsuccess = options.onsuccess || XHR.defaults.onsuccess;
	var onfailure = options.onfailure || XHR.defaults.onfailure;
	var onsslcerterror = options.onsslcerterror || XHR.defaults.onsslcerterror;
	var timeout = options.timeout || XHR.defaults.timeout || 0;
	var ontimeout = timeout ? (options.ontimeout || XHR.defaults.ontimeout) : null;
	var headers = options.headers || XHR.defaults.headers;
	var overrideMimeType = as ? ((as == 'xml' || as == 'e4x') ? 'application/xml' : 'text/plain') : options.overrideMimeType || XHR.defaults.overrideMimeType || null;
	var onreadytosend = options.onreadytosend || XHR.defaults.onreadytosend;
	var onfinished = options.onfinished || XHR.defaults.onfinished;
	var contentType = options.contentType || XHR.defaults.contentType;
	var testSuccess = options.testSuccess || XHR.defaults.testSuccess;
	if (typeof testSuccess != "function") testSuccess = XHR.testSuccess;
	var responseType = as ? ((as == 'xml' || as == 'e4x') ? as : 'text') : options.responseType || XHR.defaults.responseType || 'text';
	var extendedResponse = options.extendedResponse || XHR.defaults.extendedResponse;
	var pollingPeriod = options.pollingPeriod || XHR.defaults.pollingPeriod || 11;
	var getTransport = options.getTransport || XHR.defaults.getTransport;
	if (typeof getTransport != "function") getTransport = XHR.getTransport;

	var useOnFunctions = (typeof onsuccess == "function"); // otherwise, return a value or throw an error
	var error = null;

	var xhr = getTransport();
	
	// Open the transport:
	try
	{
		xhr.open(method, url, async, username, password);
	}
	catch (e)
	{
		error = new Error("xhr.open error: " + e + "\n\n" + "typeof xhr: " + (typeof xhr) + "\n\nparams: " + [method, url, async]);
		if (useOnFunctions) 
		{
			if (typeof onfailure == "function") onfailure(error, extra, xhr);
			return;
		}
		else 
		{
			throw error;
		}
	}
	
	// Get ready to send:
	if (headers && (typeof headers == "object")) // array or actual object
	{
		if (typeof headers.length == "number") // assume it's an array
		{
			for (var iHeader = 0, lenHeaders = headers.length; iHeader < lenHeaders; iHeader++) 
			{
				xhr.setRequestHeader(headers[iHeader][0], headers[iHeader][1]);
			}
		}
		else // assume it's an object of name => value pairs
		{
			for (var headerName in headers)
			{
				xhr.setRequestHeader(headerName, headers[headerName]);
			}
		}
	}
	else 
	{
		if (contentType != '') xhr.setRequestHeader("Content-Type", contentType);
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	}
	if (overrideMimeType && (typeof xhr.overrideMimeType == "function"))
	{
		xhr.overrideMimeType(overrideMimeType);
	}
	if (typeof onreadytosend == "function") onreadytosend(xhr, extra);
	
	// Get ready to receive: (modeled after jQuery)
	var finished = false;
	var pollId, asyncKey;
	var finish = function finish(cancelCode)
	{
		var response;
		if (!finished && xhr && ((xhr.readyState == 4) || (cancelCode == "timedout") || (cancelCode == "canceled")))
		{
			// prevent firing more than once
			finished = true; 

			// stop polling
			if (pollId)
			{
				asyncKey = 'id_' + pollId;
				win.clearInterval(pollId);
				delete XHR.asyncRequests[asyncKey];
			}
			
			var err = null;
			var msgIdentifier = (async ? "Asynchronous" : "Synchronous") + " request " +
				(asyncKey ? asyncKey + " " : "") + "to url " + url;
			
			if (cancelCode == "timedout")
			{
				log.trace(msgIdentifier + " timed out");
				err = new Error(msgIdentifier + " timed out");
				err.reason = XHR.REASON_TIMEOUT;
				err.timeout = timeout;
				if (useOnFunctions && (typeof ontimeout == "function")) 
				{
					ontimeout(err, extra, xhr);
				}
			}
			else if (cancelCode == "canceled")
			{
				log.trace(msgIdentifier + " canceled");
			}
			else
			{
				if (testSuccess(xhr)) // succeeded
				{
					var useXml;
					switch (responseType)
					{
						case "xml":
						case "e4x":
							useXml = true;
							break;
						case "auto":
							var autoType = "text";
							try 
							{
								autoType = xhr.getResponseHeader("content-type");
							} 
							catch (e) {}
							useXml = Boolean(autoType.match(/xml/i));
							break;
						default: // "text" and anything else
							useXml = false;
					}
					response = useXml ? xhr.responseXML : xhr.responseText;
					if (responseType == 'e4x' && xmlSerializer && e4xConstructor) 
					{
						var xmlRootString = xmlSerializer.serializeToString(response.documentElement);
						response = new e4xConstructor(xmlRootString);
					}
					var responseAsText = useXml ? xhr.responseText : response;
					log.trace(msgIdentifier + " received " + (useXml ? "XML" : "text") + " response: " +
						responseAsText.substr(0, 100) + (responseAsText.length > 100 ? '...' : ''));
					if (extendedResponse)
					{
						var responseHeadersString = xhr.getAllResponseHeaders();
						var responseHeaders = {};
						if (responseHeadersString)
						{
							responseHeadersString.split(/[\r\n]+/).forEach(function (headerString)
							{
								var matchedHeaders = /^([^\:]+)\: (.*)$/.exec(headerString);
								if (matchedHeaders && matchedHeaders.length == 3) 
								{
									var headerName = matchedHeaders[1];
									var headerValue = matchedHeaders[2];
									if (headerName in responseHeaders)
									{
										if (typeof responseHeaders[headerName] == "string")
										{
											responseHeaders[headerName] = [responseHeaders[headerName], headerValue];
										}
										else
										{
											responseHeaders[headerName].push(headerValue);
										}
									}
									else
									{
										responseHeaders[headerName] = headerValue;
									}
								}
							});
						}
						var setCookieHeaders = responseHeaders["Set-Cookie"];
						var setCookieStrings = setCookieHeaders ? (typeof setCookieHeaders == "string" ? [setCookieHeaders] : setCookieHeaders) : [];
						response = new XHR.ResponseData({
							  response: response
							, text: xhr.responseText
							, xml: xhr.responseXML
							, xhr: xhr
							, extra: extra
							, headers: responseHeaders
							, status: xhr.status
							, statusText: xhr.statusText
							, cookies: Jaxer.Util.Cookie.parseSetCookieHeaders(setCookieStrings)
							, certInfo: certInfo
						});
					}
					if (useOnFunctions) 
					{
						onsuccess(response, extra);
					}
				}
				else  // failed
				{
					log.trace(msgIdentifier + " failed");
					err = new Error(msgIdentifier + " failed");
					err.reason = XHR.REASON_FAILURE;
					err.status = xhr.status;
					if (useOnFunctions && (typeof onfailure == "function")) 
					{
						onfailure(err, extra, xhr);
					}
				}
			}
			
			// finish and clean up
			if (typeof onfinished == "function") onfinished(xhr, cancelCode, extra);
			pollId = asyncKey = xhr = url = undefined;
			
			if (!useOnFunctions && err) 
			{
				throw err;
			}
		}
		
		if (!useOnFunctions) return response;
	};

	// For async requests, look for received data, and timeout if requested and needed
	if (async)
	{
		// Poll for receiving data, instead of subscribing to onreadystatechange - modeled after jQuery
		pollId = win.setInterval(finish, pollingPeriod);
		asyncKey = 'id_' + pollId;
		XHR.asyncRequests[asyncKey] = {url: url, message: message, timeout: timeout, timestamp: new Date(), finish: finish};
		
		if (timeout)
		{
			win.setTimeout(function xhrTimeout()
				{
					if (!xhr) return; 					// we've already finished
					xhr.abort();						// otherwise, abort
					if (!finished) finish("timedout");	// and finish with a timeout if we haven't already finished
				}, timeout);
		}
	}

	// Handle SSL certificate errors -- server-side only
	var certInfo = null;
	if (Jaxer.isOnServer)
	{
		xhr.onsslcerterror = function(socketInfo, sslStatus, targetSite)
		{
			var cert = sslStatus.serverCert; /* nsIX509Cert */
			certInfo = new Util.Certificate.CertInfo(socketInfo, sslStatus, targetSite);
			var ignore = false; // by default, we abort on SSL errors
			if (typeof onsslcerterror == "function")
			{
				ignore = onsslcerterror(certInfo, cert, socketInfo, sslStatus, targetSite);
			}
			return ignore; // true - ignore, false - abort
		}
	}
	
	// Now actually send the request
	log.trace("Sending " + (async ? "asynchronous " : "synchronous ") + method +
		" request to url " + url + " with " + (message == '' ? "no data" : "data: " + message));
	xhr.send((message == '') ? null : message);
	log.trace("Sent");
	
	if (async) // For async requests, return an id by which requests may be aborted or prematurely timed out
	{
		log.trace("Response will be received asynchronously with key: " + asyncKey);
		return asyncKey;
	}
	else // And for synchronous requests, force the receiving. Timeout is not possible.
	{
		var response = finish(false);
		if ((typeof(response) == "object") && ("documentElement" in response))
		{
			var docElement = response.documentElement;
			if (docElement && docElement.nodeName == "parsererror")
			{
				error = new Error("Error reading returned XML: " + docElement.firstChild.data + "\nXHR params: " + [method, url, async]);
				if (useOnFunctions) 
				{
					if (typeof onfailure == "function") onfailure(error, extra, xhr);
				}
				else 
				{
					throw error;
				}
			}
		}
		if (!useOnFunctions)
		{
			return response;
		}
	}
	
};

/**
 * Cancels the pending async XMLHttpRequest if its response has not yet been
 * received and if it has not yet timed out.
 * 
 * @alias Jaxer.XHR.cancel
 * @param {Number} asyncKey
 * 		The key that Jaxer.XHR.send() returned when the request was created.
 * @return {Boolean}
 * 		true if the request was found and canceled, false if it was not found 
 * 		(i.e. was not in the pending queue)
 */
XHR.cancel = function cancel(asyncKey)
{
	if (typeof XHR.asyncRequests[asyncKey] != "undefined")
	{
		log.trace("Canceling request " + asyncKey);
		XHR.asyncRequests[asyncKey].finish("canceled");
		return true;
	}
	else
	{
		return false; // nothing to cancel
	}
};

/**
 * @classDescription {Jaxer.XHR.ResponseData} A hashmap containing detaild information
 * about the response from an XHR.send.
 */

/**
 * A hashmap containing detailed information about the response from an XHR.send.
 * This is returned as the response of XHR.send when the SendOptions specify
 * extendedResponse=true.
 * 
 * @constructor
 * @alias Jaxer.XHR.ResponseData
 * @return {Jaxer.XHR.ResponseData}
 * 		Returns an instance of ResponseData.
 */
XHR.ResponseData = function ResponseData(values)
{
	/**
	 * The responseText string or responseXML XMLDocument of the response,
	 * depending on the SendOptions and the returned content type
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.response
	 * @property {Object}
	 */
	this.response = values.response;
	
	/**
	 * The responseText of the response, or null if none
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.text
	 * @property {String}
	 */
	this.text = values.text;
	
	/**
	 * The responseXML of the response, or null if none
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.xml
	 * @property {XMLDocument}
	 */
	this.xml = values.xml;
	
	/**
	 * The XMLHttpRequest object used in the request-response
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.xhr
	 * @property {XMLHttpRequest}
	 */
	this.xhr = values.xhr;
	
	/**
	 * Information about the SSL certificate used in this request-response.
	 * This is only available server-side.
	 * NOTE: currently this is only available when an SSL certificate error
	 * was encountered, and the onsslcerterror function was set and
	 * returned true.
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.certInfo
	 * @property {Jaxer.Util.Certificate.CertInfo}
	 * @see Jaxer.XHR.SendOptions.prototype.onsslcerterror
	 */
	this.certInfo = values.certInfo;
	
	/**
	 * The value of the "extra" parameter, if any, passed into XHR.send.
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.extra
	 * @property {Object}
	 */
	this.extra = values.extra;
	
	/**
	 * A hashmap containing properties corresponding to the names of the
	 * response headers. For each property, if the header name was present
	 * multiple times in the response, the value of the property is an
	 * array of the corresponding header values; otherwise, the value
	 * of the property is the value of the header.
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.headers
	 * @property {Object}
	 */
	this.headers = values.headers;
	
	/**
	 * The HTTP status code of the response (e.g. 200)
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.status
	 * @property {Number}
	 */
	this.status = values.status;
	
	/**
	 * The HTTP status text of the response (e.g. "OK")
	 *
	 * @alias Jaxer.XHR.ResponseData.prototype.statusText
	 * @property {String}
	 */
	this.statusText = values.statusText;
	
	/**
	 * An array of cooky directives indicated in the response via the
	 * "Set-Cookie" header. Each cookie is represented by
	 * an object with properties corresponding to its 
 	 * name, value, expires, path, and domain.
	 *
	 * @see Jaxer.Util.Cookie.parseSetCookieHeaders
	 * @alias Jaxer.XHR.ResponseData.prototype.cookies
	 * @property {Array}
	 */
	this.cookies = values.cookies;
	
};

/**
 * @classDescription {Jaxer.XHR.SendOptions} Options used to define the behavior
 * of Jaxer.XHR.send.
 */

/**
 * Options used to define the behavior of Jaxer.XHR.send. Create a new Jaxer.XHR.SendOptions()
 * to get the default options, then modify its properties as needed before
 * passing it to Jaxer.XHR.send.
 * 
 * @constructor
 * @alias Jaxer.XHR.SendOptions
 * @return {Jaxer.XHR.SendOptions}
 * 		Returns an instance of SendOptions.
 */
XHR.SendOptions = function SendOptions()
{
	/**
	 * The URL to which the XMLHttpRequest is to be sent. On the client side,
	 * defaults to Jaxer.CALLBACK_URI which is used to handle function callbacks
	 * from client-side proxies to their server-side counterparts.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.url
	 * @property {String}
	 */
	this.url = Jaxer.CALLBACK_URI;
	
	/**
	 * If true (default, client-side), a random name and value query pair will be appended to
	 * the URL on each call
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.cacheBuster
	 * @property {Boolean}
	 */
	this.cacheBuster = Jaxer.isOnServer ? false : true;
	
	/**
	 * Should be "GET" (default, server-side) or "POST" (default, client-side)
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.method
	 * @property {String}
	 */
	this.method = Jaxer.isOnServer ? "GET" : "POST";
	
	/**
	 * Set to true for asynchronous, false for synchronous. By default it's
	 * true client-side and false server-side. To use it server-side, see also
	 * Jaxer.Thread.waitFor.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.async
	 * @property {Boolean}
	 * @see Jaxer.Thread.waitFor
	 */
	this.async = Jaxer.isOnServer ? false : true;
	
	/**
	 * If the target URL requires authentication, specify this username, 
	 * otherwise leave this as null.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.username
	 * @property {String}
	 */
	this.username = null;
	
	/**
	 * If the target URL requires authentication, specify this password, 
	 * otherwise leave this as null.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.password
	 * @property {String}
	 */
	this.password = null;
	
	/**
	 * Set to a function to call if successful. Its arguments are the response
	 * received back from the server, and any "extra" information passed in when
	 * calling send(). For synchronous calls, you can optionally set onsuccess
	 * to null to have XHR.send() return a value directly (and throw errors on
	 * failure/timeout).
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onsuccess
	 * @property {Function}
	 */
	this.onsuccess = null;
	
	/**
	 * Set to a custom callback function to call if unsuccessful (by default set
	 * to Jaxer.XHR.onfailure client-side). Its arguments are the error
	 * encountered, the "extra" information from the caller, and the XHR
	 * instance.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onfailure
	 * @property {Function}
	 */
	this.onfailure = Jaxer.isOnServer ? null : XHR.onfailure;
	
	/**
	 * Set to a custom callback function to call if an SSL request fails
	 * due to a certificate error. Its arguments are the certInfo (an object
	 * containing properties describing the certificate and its status), the
	 * cert, and the XHR's socketInfo,
	 * sslStatus, and targetSite. It should return true to ignore the error,
	 * or false to abort the request. This is only available server-side.
	 * If (and only if) this is set to a function that returns true, 
	 * information about the failure can be retrieved from the extended 
	 * response's certInfo property.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onsslcerterror
	 * @property {Function}
	 * @see Jaxer.XHR.ResponseData.prototype.certInfo
	 * @see Jaxer.Util.Certificate.CertInfo
	 */
	this.onsslcerterror = null;
	
	/**
	 * For async (client-side) requests, set to number of milliseconds before
	 * timing out, or 0 to wait indefinitely
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.timeout
	 * @property {Number}
	 * @see Jaxer.XHR.defaults.timeout
	 * @see Jaxer.XHR.SendOptions.DEFAULT_TIMEOUT
	 */
	this.timeout = XHR.SendOptions.DEFAULT_TIMEOUT;
	
	/**
	 * Set to a custom timeout function to call if timeout is used and the async
	 * request has timed out. Its arguments are the timeout error encountered, 
	 * the "extra" information from the caller, and the XHR instance.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.ontimeout
	 * @property {Function}
	 */
	this.ontimeout = null;
	
	/**
	 * Set to null to use default headers; set to an array of [name, value]
	 * arrays to use custom headers instead, or to an object containing
	 * properties to use as the headers
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.headers
	 * @property {Object|Array}
	 */
	this.headers = null;
	
	/**
	 * Set to "text" to force interpreting the response as text regardless of
	 * mimetype. Set to "xml" to force interpreting the response as XML
	 * regardless of mimetype and returning the XML as an XML (DOM) object via
	 * XMLHttpRequest.responseXML. Set to null to not force anything - see
	 * overrideMimeType and responseType for finer control.
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.as
	 * @property {String}
	 */
	this.as = null;
	
	/**
	 * Set to null to use whatever mimetype the server sends in the response;
	 * set to a mimetype string (e.g. "text/plain") to force the response to be
	 * interpreted using the given mimetype
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.overrideMimeType
	 * @property {String}
	 */
	this.overrideMimeType = null;
	
	/**
	 * Set to a custom function to call just before sending (e.g. to set custom
	 * headers, mimetype, keep reference to xhr object, etc.)
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onreadytosend
	 * @property {Function}
	 */
	this.onreadytosend = null;
	
	/**
	 * Set to a custom function to call when done receiving (or timed out),
	 * usually to abort()
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.onfinished
	 * @property {Function}
	 */
	this.onfinished = null;
	
	/**
	 * The content type of the request being sent (by default
	 * "application/x-www-form-urlencoded")
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.contentType
	 * @property {String}
	 */
	this.contentType = "application/x-www-form-urlencoded";
	
	/**
	 * If this is set to true, the response returned directly
	 * or passed to an onsuccess handler will contain detailed
	 * information about the response, in the form of a
	 * Jaxer.XHR.ResponseData object.
	 * 
	 * @see Jaxer.XHR.ResponseData
	 * @alias Jaxer.XHR.SendOptions.extendedResponse
	 * @property {Boolean}
	 */
	this.extendedResponse = false;
	
	/**
	 * Set to a custom function that receives the XMLHttpRequest (after
	 * readyState == 4) and tests whether it succeeded (by default
	 * Jaxer.XHR.testSuccess)
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.testSuccess
	 * @property {Function}
	 */
	this.testSuccess = XHR.testSuccess;
	
	/**
	 * Set to "text" (default) to use the responseText, to "xml" to use the
	 * responseXML, or "auto" to use the response's content-type to choose
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.responseText
	 * @property {String}
	 */
	this.responseType = "text";
	
	/**
	 * For async requests, the number of milliseconds between
	 * polling for onreadystatechange, by default 11
	 *
	 * @advanced
	 * @alias Jaxer.XHR.SendOptions.prototype.pollingPeriod
	 * @property {Number}
	 */
	this.pollingPeriod = 11;
	
	/**
	 * The function to use to create the XMLHttpRequest, by default
	 * XHR.getTransport
	 *
	 * @alias Jaxer.XHR.SendOptions.prototype.getTransport
	 * @property {Function}
	 */
	this.getTransport = XHR.getTransport;
};

/**
 * The default value to use when creating new Jaxer.XHR.SendOptions() objects,
 * in milliseconds. It's only used for async requests.
 * It defaults to 30 seconds (30000) on the server, and 0 on the client.
 * 0 means no timeout.
 * 
 * NOTE: To set the the default timeout to use when creating new XHR()s
 * (i.e. XMLHttpRequests), set Jaxer.XHR.defaults.timeout instead.
 * 
 * @alias Jaxer.SendOptions.DEFAULT_TIMEOUT
 * @property {Number}
 */
XHR.SendOptions.DEFAULT_TIMEOUT = Jaxer.isOnServer ? 30000 : 0;

/**
 * The default SendOptions which new calls to Jaxer.XHR.send(message, options,
 * extra) will use, unless overridden by the options argument. This is slightly
 * different for client-side and server-side requests (e.g. server-side requests
 * are by default synchronous).
 * 
 * @alias Jaxer.XHR.defaults
 * @property {Jaxer.XHR.SendOptions}
 */
XHR.defaults = new XHR.SendOptions();

/**
 * The default value to use when creating new Jaxer.XHR (XMLHttpRequest) requests,
 * in milliseconds. This also applies to anything that uses XHRs, such as Jaxer.Web.get.
 * It's only used for async requests.
 * It defaults to 30 seconds (30000) on the server, and 0 on the client.
 * 0 means no timeout.
 * 
 * NOTE: To set the the default timeout to use when creating new XHR.SendOptions()
 * objects, set Jaxer.XHR.SendOptions.timeout instead.
 * 
 * @alias Jaxer.defaults.timeout
 * @property {Number}
 */

Jaxer.XHR = XHR;

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/IO > jslib_namespace_import.js
 */
coreTraceMethods.TRACE('Loading fragment: jslib_namespace_import.js');
Jaxer.lastLoadedFragment = 'jslib_namespace_import.js';
(function(){

/*
 * import the JSLib namespace objects into Jaxer and the framework global context
 */
frameworkGlobal.Filesystem 		= Jaxer.Filesystem 		= JSLib.Filesystem;
frameworkGlobal.File 			= Jaxer.File 			= JSLib.File;
frameworkGlobal.FileUtils 		= Jaxer.FileUtils 		= JSLib.FileUtils ;
frameworkGlobal.Dir 			= Jaxer.Dir 			= JSLib.Dir;
frameworkGlobal.DirUtils 		= Jaxer.DirUtils 		= JSLib.DirUtils;
frameworkGlobal.NetworkUtils 	= Jaxer.NetworkUtils 	= JSLib.NetworkUtils;
	
})();


/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/IO > File.js
 */
coreTraceMethods.TRACE('Loading fragment: File.js');
Jaxer.lastLoadedFragment = 'File.js';

(function() {

/**
 * @classDescription {Jaxer.File} Utility object for simple filesystem access.
 */

/**
 * Read the contents of a file on local disk. If the file does not exist,
 * returns a null
 * 
 * @alias Jaxer.File.read
 * @param {String} path	
 * 		The full or partial (to be resolved) path to read
 * @return {String|null}
 * 		The contents of the file as a string, or null if the file does not exist
 */
File.read = function read(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (!file.isFile)
	{
		throw path+" is not a file" ;
	}
	
	if (!file.exists)
	{
		return null;
	}
	var data = "";
	try
	{
		file.open('r');
		data = file.read();
	}
	finally
	{
		if (file)
		{
			file.close();
		}
	}
	return data;
};

/**
 * Does the file (or folder) exist on disk?
 * 
 * @alias Jaxer.File.exists
 * @param {String} path	
 * 		The full or partial (to be resolved) path to test
 * @return {Boolean}
 * 		true if exists, false otherwise
 */
File.exists = function exists(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return file.exists;
};

/**
 * Read the contents of a textfile on local disk, return an array of lines. When
 * the optional sep parameter is not provided return a string with the lines
 * concatenated by the provided parameter. If the file does not exist, returns a
 * null
 * 
 * @alias Jaxer.File.readLines
 * @param {String} path
 * 		The full or partial (to be resolved) path to read
 * @param {String} [sep]
 * 		An optional separator to use between lines. If none is specified,
 * 		returns an array of lines.
 * @return {Array|String|null}
 * 		The contents of the file as a string or array of lines, or null if the
 * 		file does not exist
 */
File.readLines = function read(path,sep)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	

	if (!file.exists)
	{
		return null;
	}

	if (!file.isFile)
	{
		throw path+" is not a file" ;
	}

	var data = [];
	try
	{
		file.open('r');
		data = file.readAllLines();
	}
	finally
	{
		if (file)
		{
			file.close();
		}
	}
	return (sep) ? data.join(sep) : data ;
};

/**
 * Writes the provided text to file specified by the path. WARNING -
 * destructive! This will overwrite an existing file so use File.append if you
 * want to add the data to the end of an existing file.
 * 
 * @alias Jaxer.File.write
 * @param {String} path
 * 		The full or partial (to be resolved) path to read
 * @param {String} text
 * 		The text to write to the file
 */
File.write = function write(path, text)
{
	var file = File.getOrCreate(path);
	
	try
	{
		file.open('w');
		for (var i=1; i<arguments.length; i++)
		{
			file.write(String(arguments[i]));
		}
	}
	finally
	{
		if (file)
		{
			file.close();
		}
	}
};

/**
 * Creates a file if required, if the file already exists it will set the last modified timestamp to the current time.
 * @alias Jaxer.File.touch
 * @param {String} path
 * 		The full or partial (to be resolved) path to touched
 */
File.touch = function touch(path)
{
	var file = File.getOrCreate(path);
	
	try
	{
		file.open('w');
	}
	finally
	{
		if (file)
		{
			file.close();
		}
	}
};

/**
 * Truncates a file if the file already exists otherwise it will create an empty file.
 * @alias Jaxer.File.truncate
 * @param {String} path
 * 		The full or partial (to be resolved) path to truncated
 */
File.truncate = function truncate(path)
{
	var file = File.getOrCreate(path);
	file.truncate();
};

/**
 * Returns the size of the file in bytes.
 * @alias Jaxer.File.size
 * @param {String} path
 * 		The full or partial (to be resolved) path to truncated
 * @return {Number}
 * 		The size of the file in bytes
 * 		
 */
File.size = function size(path)
{
	var sPath = Dir.resolve(path);
	var sourceFile = new File(sPath);
	return sourceFile.size;
};

/**
 * Copies the file from sourcePath to destinationPath. 
 * If the destination file exists it will be overwritten.
 * @alias Jaxer.File.copy
 * @param {String} sourcePath
 * 		The full or partial (to be resolved) path of the original file
 * @param {String} destinationPath
 * 		The full or partial (to be resolved) path to the new file
 */
File.copy = function copy(sourcePath, destinationPath)
{
	var sPath = Dir.resolve(sourcePath);
	var sourceFile = new File(sPath);
	
	if (!sourceFile.isFile) 
	{
		throw sPath + " is not a file";
	};
	
	if (!sourceFile.exists) 
	{
		throw sourcePath + " does not exist";		
	};
	var dPath = Dir.resolve(destinationPath);
	var destinationFile = new File(dPath);
	
	if (destinationFile.exists) 
	{
		if (!destinationFile.isFile) 
		{
			throw dPath + " is not a file";
		// TODO 
		// if destination is a folder which doesn't exist then create folder
		// if destination is a folder then create inside folder using original file leafname
		} 
		else
		{
			destinationFile.remove()
		}
	}

	sourceFile.copy(dPath);
	
};

/**
 * Create a uniquely named backup copy of the file referenced by the provided path 
 * @alias Jaxer.File.backup
 * @param {String} sourcePath
 * 		The full or partial (to be resolved) path of the original file
 * @return {String}
 * 		The path to the backup copy of the file
 */
File.backup = function backup(sourcePath)
{
	var sPath = Dir.resolve(sourcePath);
	var sourceFile = new File(sPath);
	
	if (!sourceFile.isFile) 
	{
		throw sPath + " is not a file";
	};
	
	if (!sourceFile.exists) 
	{
		throw sourcePath + " does not exist";		
	};

	var destinationFile = new File(sPath);

	destinationFile.createUnique();
	destinationFile.remove();
	
	sourceFile.copy(destinationFile.path);
	
	return destinationFile.path;
	
};

/**
 * Moves the file from sourcePath to destinationPath, the orginal file is deleted from the file system.  
 * If the destination file exists it will be overwritten.
 * @alias Jaxer.File.move
 * @param {String} sourcePath
 * 		The full or partial (to be resolved) path of the original file
 * @param {String} destinationPath
 * 		The full or partial (to be resolved) path to the new file
 */
File.move = function move(sourcePath,destinationPath)
{
	File.copy(sourcePath,destinationPath);
	File.remove(sourcePath);
};

/**
 * Get/Set the file permissions for the File object
 * 
 * If the optional permissions parameter is provided chmod will set the permissions of the object to those provided.
 * 
 * this may be ignored/misreported by some versions of windows.
 * 
 * on Windows, you can only set the Read/Write bits of a file. And User/Group/Other will have the SAME 
 * settings based on the most-relaxed setting (Read 04, 040, 0400, Write 02, 020, 0200). When a file is created, 
 * by default it has both Read and Write permissions. Also, you cannot set the file permission to WRITE-ONLY, doing 
 * so would set it to read-write
 * 
 * @alias Jaxer.File.chmod
 * @param {String} path
 * 		The full or partial (to be resolved) path of the original file
 * @param {String} permissions
 * 		The file permissions to apply to the file referenced by the provided path, this number is an OCTAL representation of the permissions.
 * 		to indicate a number is in octal format in javascript the first digit must be a 0
 * @return {Number}
 * 		The file permissions from the file referenced by the provided path
 */
File.chmod = function chmod(path,permissions)
{
	var sPath = Dir.resolve(path);
	var sourceFile = new File(sPath);
	
	if (typeof permissions != 'undefined') 
	{
		sourceFile.permissions = permissions;
	}
	return parseInt("0" + sourceFile.permissions , 8) & 07777;
};

/**
 * Extracts the filename for the file referenced by the provided path
 * @alias Jaxer.File.filename
 * @param {String} filename
 * 		The full or partial (to be resolved) of the path
 * @return {String} 
 * 		The filename from the file referenced by the provided path
 */
File.filename = function filename(path)
{
	var sPath = Dir.resolve(path);
	var sourceFile = new File(sPath);
	return sourceFile.leaf;
};

/**
 * Return the file extension for the file referenced by the provided path
 * @alias Jaxer.File.extension
 * @param {String} path
 * 		The full or partial (to be resolved) path of the  file
 * @return {String} 
 * 		The extension of the file referenced by the provided path
 */
File.extension = function extension(path)
{
	var sPath = Dir.resolve(path);
	var sourceFile = new File(sPath);
	return sourceFile.ext;
};

/**
 * Return the dateModified for the file referenced by the provided path
 * @alias Jaxer.File.dateModified
 * @param {String} path
 * 		The full or partial (to be resolved) path of the  file
 * @return {String} 
 * 		The last modified date of file referenced by the provided path
 */
File.dateModified = function dateModified(path)
{
	var sPath = Dir.resolve(path);
	var sourceFile = new File(sPath);
	return sourceFile.dateModified;
};

/**
 * Extracts the path of the containing folder for the file referenced by the provided path
 * @alias Jaxer.File.parentPath
 * @param {String} parentPath
 * 		The full or partial (to be resolved) path of the  file
 * @return {String} 
 * 		The path to the parent folder of file referenced by the provided path
 */
File.parentPath = function parentPath(path)
{
	var sPath = Dir.resolve(path);
	var sourceFile = new File(sPath);
	return sourceFile.parentPath;
};

/**
 * Extracts the absolute path of the file referenced by the provided path
 * @alias Jaxer.File.absolutePath
 * @param {String} path
 * 		The full or partial (to be resolved) path of the  file
 * @return {String} 
 * 		The absolute path of the file referenced by the provided path
 */
File.absolutePath = function absolutePath(path)
{
	var sPath = Dir.resolve(path);
	var sourceFile = new File(sPath);
	return sourceFile.path;
};

/**
 * return a crc32 checksum calculated from the file referenced by the provided path
 * @alias Jaxer.File.checksum
 * @param {String} path
 * 		The full or partial (to be resolved) path of the  file
 * @return {String} 
 * 		The checksum of the file referenced by the provided path
 */
File.checksum = function checksum(path)
{
	var sPath = Dir.resolve(path);
	var contents = File.read(sPath);
	var crc = Util.CRC32.getStringCRC(contents);
	
	return crc;
};

/**
 * Add the provided text to the end of an existing file.
 * 
 * @alias Jaxer.File.append
 * @param {String} path
 * 		The full or partial (to be resolved) path to append to
 * @param {String} text
 * 		The text to append
 */
File.append = function append(path, text)
{
	var file = File.getOrCreate(path);
	
	try
	{
		file.open('a');
		for (var i=1; i<arguments.length; i++)
		{
			file.write(arguments[i].toString());
		}
	}
	finally
	{
		if (file)
		{
			file.close();
		}
	}
};

/**
 * Add a line to the end of an existing file.
 * 
 * @alias Jaxer.File.appendLine
 * @param {String} path
 * 		The full or partial (to be resolved) path to append to
 * @param {String} text
 * 		The text to append, as a new line
 */
File.appendLine = function appendLine(path, text)
{
	var args = new Array((arguments.length - 1) * 2);
	for (var i=1; i<arguments.length; i++)
	{
		args[(i - 1) * 2    ] = arguments[i];
		args[(i - 1) * 2 + 1] = "\n";
	}
	args.unshift(path);
	File.append.apply(null, args);
};

/**
 * Get a file object, and if the object doesn't exist then automagically create
 * it.
 * 
 * @alias Jaxer.File.getOrCreate
 * @param {String} path
 * 		The full or partial (to be resolved) path to get or create
 * @return {Jaxer.File}
 * 		The file, possibly newly-created
 */
File.getOrCreate = function getOrCreate(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (!file.exists)
	{
		file.create();
	}

	if (!file.isFile)
	{
		throw path+" is not a file" ;
	}

	return file;
};

/**
 * Delete a file (only if it already exists).
 * 
 * @alias Jaxer.File.remove
 * @param {String} path
 * 		The full or partial (to be resolved) path to delete
 */
File.remove = function remove(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (!file.isFile)
	{
		throw path+" is not a file" ;
	}

	if (file.exists)
	{
		file.remove();
	}
};

/**
 * Returns the MIME type (e.g. "text/html") of the file at the given path.
 * It uses a variety of methods to determine this: 
 * built-in mozilla entries, user-set prefs, the operating system, and category manager.
 * 
 * @alias Jaxer.File.mimeType
 * @param {String} path
 * 		The full or partial (to ne resolved) path of the file
 * @return {String}
 * 		The MIME type of the file, or null if not detected.
 */
File.mimeType = function mimeType(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	var mimeService = Components.classes["@mozilla.org/mime;1"].getService(Components.interfaces.nsIMIMEService);
	try 
	{
		return mimeService.getTypeFromFile(file._nsIFile);
	}
	catch (e)
	{
		if (e.result == NS_ERROR_NOT_AVAILABLE)
		{
			return null;
		}
		else
		{
			throw e;
		}
	}
}

/**
 * Generate an MD2 Hash key for the file. 
 * 
 * @alias Jaxer.File.MD2
 * @see Jaxer.Util.Crypto.File.MD2
 * @param {String} path
 * 		the absolute path to the file 
 * @return {String} 
 * 		A string containing the MD2 hash key for the provided file
 */
File.MD2 = function MD2(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.MD2(file);
};

/**
 * Generate an MD5 Hash key for the file. 
 * 
 * @alias Jaxer.File.MD5
 * @see Jaxer.Util.Crypto.File.MD5
 * @param {String} path
 * 		the absolute path to the file 
 * @return {String} 
 * 		A string containing the MD5 hash key for the provided file
 */
File.MD5 = function MD5(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.MD5(file);
};

/**
 * Generate an SHA1 Hash key for the file. 
 * 
 * @alias Jaxer.File.SHA1
 * @see Jaxer.Util.Crypto.File.SHA1
 * @param {String} path
 * 		the absolute path to the file 
 * @return {String} 
 * 		A string containing the SHA1 hash key for the provided file
 */
File.SHA1 = function SHA1(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.SHA1(file);
};

/**
 * Generate an SHA256 Hash key for the file. 
 * 
 * @alias Jaxer.File.SHA256
 * @see Jaxer.Util.Crypto.File.SHA256
 * @param {String} path
 * 		the absolute path to the file 
 * @return {String} 
 * 		A string containing the SHA256 hash key for the provided file
 */
File.SHA256 = function SHA256(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.SHA256(file);
};

/**
 * Generate an SHA384 Hash key for the file. 
 * 
 * @alias Jaxer.File.SHA384
 * @see Jaxer.Util.Crypto.File.SHA384
 * @param {String} path
 * 		the absolute path to the file 
 * @return {String} 
 * 		A string containing the SHA384 hash key for the provided file
 */
File.SHA384 = function SHA384(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.SHA384(file);
};

/**
 * Generate an SHA512 Hash key for the file. 
 * 
 * @alias Jaxer.File.SHA512
 * @see Jaxer.Util.Crypto.File.SHA512
 * @param {String} path
 * 		the absolute path to the file 
 * @return {String} 
 * 		A string containing the SHA512 hash key for the provided file
 */
File.SHA512 = function SHA512(path)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.SHA512(file);
};

/**
 * Verify an MD2 Hash key for the file. 
 * 
 * @alias Jaxer.File.MD2
 * @see Jaxer.Util.Crypto.File.MD2
 * @param {String} path
 * 		the absolute path to the file 
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */
File.MD2 = function MD2(path,hash)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.verifyMD2(file);
};

/**
 * Verify an MD5 Hash key for the file. 
 * 
 * @alias Jaxer.File.MD5
 * @see Jaxer.Util.Crypto.File.MD5
 * @param {String} path
 * 		the absolute path to the file 
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */
File.MD5 = function MD5(path,hash)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.verifyMD5(file);
};

/**
 * Verify an SHA1 Hash key for the file. 
 * 
 * @alias Jaxer.File.SHA1
 * @see Jaxer.Util.Crypto.File.SHA1
 * @param {String} path
 * 		the absolute path to the file 
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */
File.SHA1 = function SHA1(path,hash)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.verifySHA1(file);
};

/**
 * Verify an SHA256 Hash key for the file. 
 * 
 * @alias Jaxer.File.SHA256
 * @see Jaxer.Util.Crypto.File.SHA256
 * @param {String} path
 * 		the absolute path to the file 
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */
File.SHA256 = function SHA256(path,hash)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.verifySHA256(file);
};

/**
 * Verify an SHA384 Hash key for the file. 
 * 
 * @alias Jaxer.File.SHA384
 * @see Jaxer.Util.Crypto.File.SHA384
 * @param {String} path
 * 		the absolute path to the file 
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */
File.SHA384 = function SHA384(path,hash)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.verifySHA384(file);
};

/**
 * Verify an SHA512 Hash key for the file. 
 * 
 * @alias Jaxer.File.SHA512
 * @see Jaxer.Util.Crypto.File.SHA512
 * @param {String} path
 * 		the absolute path to the file 
 * @param {String} hash
 * 		The hash value to compare.
 * @return {Boolean} 
 * 		true if the hash matches, false if not.
 */
File.SHA512 = function SHA512(path,hash)
{
	var fullPath = Dir.resolve(path);
	var file = new File(fullPath);
	
	if (file.exists && !file.isFile)
	{
		throw path+" is not a file" ;
	}

	return Jaxer.Util.Crypto.File.verifySHA512(file);
};

Jaxer.File = File;

Log.trace("*** File.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/IO > Dir.js
 */
coreTraceMethods.TRACE('Loading fragment: Dir.js');
Jaxer.lastLoadedFragment = 'Dir.js';

(function() {

/**
 * @classDescription {Jaxer.FileUtils} This is a general class that wraps XPCOM filesystem functionality and from which File and Dir objects are derived.
 */
var fileUtils = new Jaxer.FileUtils();

/**
 * @classDescription {Jaxer.DirUtils} This is a utility class that wraps XPCOM directory/folder utility functions
 */
var dirUtils = new Jaxer.DirUtils();

/**
 * @classDescription {Jaxer.NetworkUtils} This is a utility class that wraps XPCOM Network utility functions
 */
var networkUtils = new Jaxer.NetworkUtils();

var fileProtocolHandler = Components.classes["@mozilla.org/network/protocol;1?name=file"].createInstance(Components.interfaces.nsIFileProtocolHandler);
// Not used yet: var resourceProtocolHandler = Components.classes["@mozilla.org/network/protocol;1?name=resource"].createInstance(Components.interfaces.nsIResProtocolHandler);

var resourcePattern = /^resource\:\/{2,}/i;
var filePattern = /^file\:\/{2,}/i;
var optFilePattern = /^(file\:\/{2,})?/i;

/**
 * @classDescription {Jaxer.Filesystem} File System Object contains methods useful for accessing the basic file and directory objects.
 */

/**
 * @classDescription {Jaxer.Dir} Utility object for filesystem directory access.
 */

/**
 * Convert a URL in string format to a native filesystem path.
 * The URL must begin with "file:..."
 * 
 * @alias Jaxer.Dir.urlToPath
 * @param {String} url
 * 		The URL to convert
 * @return {String|null}
 * 		The full path, or null if the URL could not be converted
 */
Dir.urlToPath = function urlToPath(url)
{
	var candidate = fileUtils.urlToPath(url);
	return (typeof candidate == "string") ? candidate : null;
}

/**
 * Convert a native filesystem path to a URL format, which will begin
 * with "file:...".
 * 
 * @alias Jaxer.Dir.pathToUrl
 * @param {String} path
 * 		The full path to be converted
 * @return {String|null}
 * 		The URL, or null if the path could not be converted
 */
Dir.pathToUrl = function pathToUrl(path)
{
	var candidate = fileUtils.pathToURL(path);
	return (typeof candidate == "string") ? candidate : null;
}

/**
 * Combines any number of path fragments into a single path, using the current
 * operating system's filesystem path separator. Before joining two fragments
 * with the path separator, it strips any existing path separators on the
 * fragment ends to be joined
 * 
 * @alias Jaxer.Dir.combine
 * @param {String} ... 
 * 		Takes any number of string path fragments
 * @return {String}
 * 		The fragments joined into a path
 */
Dir.combine = function combine()
{
	if (arguments.length == 0) return '';
	if (arguments.length == 1) return arguments[0];
	var isUrl = resourcePattern.test(arguments[0]) || filePattern.test(arguments[0]);
	var sep = isUrl ? '/' : System.separator;
	var stripRight = new RegExp("\\" + sep + "+$");
	var stripLeft  = new RegExp("^\\" + sep + "+");
	var stripBoth  = new RegExp("^\\" + sep + "|\\" + sep + "$", 'g');
	pieces = [];
	pieces.push(arguments[0].replace(stripRight, ''));
	for (var i=1; i<arguments.length-1; i++)
	{
		pieces.push(arguments[i].replace(stripBoth, ''));
	}
	pieces.push(arguments[arguments.length - 1].replace(stripLeft, ''));
	return pieces.join(sep);
}

/**
 * Resolves a path to an absolute path on the filesystem, using as a reference
 * (base) the given path or the current page's path.
 * 
 * @alias Jaxer.Dir.resolve
 * @param {String} pathToResolve
 * 		The path to resolve, e.g. a filename. It can also be a resource pattern
 * 		(e.g. "resource:///...") or a file pattern (e.g. "file:///...")
 * @param {String} [referencePath]
 * 		An optional path to use as a reference. By default, it uses the current
 * 		page's path.
 * @return {String}
 * 		The full path on the filesystem
 */
Dir.resolve = function resolve(pathToResolve, referencePath)
{
	var absoluteUrl;
	var urlToResolve = pathToResolve.replace(/\\/g, '/');
	
	if (filePattern.test(urlToResolve) ||
		/^(\w\:)?\//.test(urlToResolve)) 
	{
		absoluteUrl = urlToResolve;
	}
	else if (resourcePattern.test(urlToResolve))
	{
		absoluteUrl = Util.Url.combine(Dir.pathToUrl(System.executableFolder), urlToResolve.replace(resourcePattern, ''));
	}
	else
	{
		if (!referencePath)
		{
			if (Jaxer.request && Jaxer.request.app && (typeof Jaxer.request.app.PATH == "string")) 
			{
				referencePath = Jaxer.request.app.PATH;
			}
			else
			{
				throw new Exception("Could not resolve path '" + pathToResolve + "' because there was neither a referencePath nor a current application with a (default) PATH");
			}
		}
		if (filePattern.test(referencePath))
		{
			referenceUrl = referencePath;
		}
		else if (resourcePattern.test(referencePath))
		{
			referenceUrl = Util.Url.combine(Dir.pathToUrl(System.executableFolder), referencePath.replace(resourcePattern, ''));
		}
		else
		{
			referenceUrl = Dir.pathToUrl(referencePath);
		}
		absoluteUrl = Util.Url.combine(referenceUrl, urlToResolve);
	}
	
	var fullyResolvedUrl = absoluteUrl.replace(optFilePattern, "file:///"); // This forces it to be "truly" absolute
	var resolvedPath = fileProtocolHandler.getFileFromURLSpec(fullyResolvedUrl).path;
	return resolvedPath;
}

/**
 * Does the directory exist on disk?
 * 
 * @alias Jaxer.Dir.exists
 * @param {String} path
 * 		The full or partial (to be resolved) path to test
 * @return {Boolean}
 * 		true if exists, false otherwise
 */
Dir.exists = function exists(path)
{
	var fullPath = Dir.resolve(path);
	var dir = new Dir(fullPath);
	
	if (dir.exists && !dir.isDir)
	{
		throw path+" is not a folder" ;
	}

	return dir.exists;
};

/**
 * Creates a new folder (directory) at the specified path and returns it
 * 
 * The format of the permissions is a unix style numeric chmod i.e. 0777 or 444
 * 
 * on Windows, you can only set the Read/Write bits of a file. And User/Group/Other will have the SAME 
 * settings based on the most-relaxed setting (Read 04, 040, 0400, Write 02, 020, 0200). When a file is created, 
 * by default it has both Read and Write permissions. Also, you cannot set the file permission to WRITE-ONLY, doing 
 * so would set it to read-write
 *		
 * @method
 * @alias Jaxer.Dir.create
 * @param {String} path
 * 		The path of the new folder
 * @param {String} aPermissions
 * 		The permissions used to create the filesystem object.
 * @return {Jaxer.Dir}
 * 		The new directory object
 * @exception {Error} 
 * 		Throws a Exception containing the error code if filesytem object is unable to be created.
 */
Dir.create = function create(path, aPermissions)
{
	var fullPath = Dir.resolve(path);
	var dir = new Dir(fullPath);
	dir.create();
	return dir;
}

/**
 * Creates a hierarchy of folders as needed to contain the current folder's path.
 * The format of the permissions is the same as for the create method.
 * 
 * @method
 * @alias Jaxer.Dir.createHierarchy
 * @param {String} path
 * 		The path of the new folder
 * @param {String} aPermissions
 * 		The permissions used to create all the filesystem objects
 * @return {Jaxer.Dir}
 * 		The new directory object
 * @exception {Error} 
 * 		Throws a Exception containing the error code if filesytem object is unable to be created.
 */
Dir.createHierarchy = function createHierarchy(path, aPermissions)
{
	var fullPath = Dir.resolve(path);
	var dir = new Dir(fullPath);
	dir.createHierarchy();
	return dir;
}

/**
 * Scan a folder tree from the provided path and find files
 * that match the provided regular expression pattern.
 * 
 * The available options properties are
 * <ul>
 * 	<li>pattern  : a string containing a regular expression e.g. "^.*\.js$"</li>
 * 	<li>flags    : the flags to use with the regular expression, e.g. "i" to ignore case</li>
 * 	<li>recursive: true/false indication of whether to search sub folders for the match</li>
 * </ul>
 *
 * @alias Jaxer.Dir.grep
 * @param {String} path
 *   The starting path for the search. This must be a folder.
 * @param {Object} [options]
 *   Optional An Associative Array of optional parameters
 * @exception {Jaxer.Exception}
 *   A Jaxer.Exception object is thrown when the path is not a valid folder
 * @return {Jaxer.File[]}
 *   An Array of Jaxer.File objects that matched the provided pattern
 */
Dir.grep = function grep(path, options)
{
    /*
     * Validate the provided path
     */
    if (path.length == 0) 
	{
		throw new Exception("missing path");
    }           
    try 
	{
        var dir = new Dir(path);
        if (dir.exists && dir.isFile) 
		{
			throw new Exception("path is not a Folder : " + path);
        }
    } 
    catch (e) 
	{
		throw new Exception("Invalid path " + path);
    }
    /*
     * Marshall optional parameters
     */
    var pattern 	= (options) ? (options.pattern 		|| undefined) 	: undefined;
    var recursive 	= (options) ? (options.recursive 	|| undefined) 	: undefined;
    var flags 		= (options) ? (options.flags 		|| '') 			: '';
    
	var regexp;
	
    if (typeof pattern != 'string') 
	{
		pattern = undefined;	
    } 
	else
	{
        regexp = new RegExp(pattern, flags);
	}
    /*
     * Setup the search variables
     */
    var directoryList = new Array(dir);
    var matchedFiles = new Array();
    
    /*
     * Stack based search of the folder structure
     */
    while (directoryList.length > 0) 
	{
        var directoryContents = directoryList.shift().readDir();               
        for (var index = 0; index < directoryContents.length; index++) 
		{
            var fileSystemObject = directoryContents[index];   
            /*
             * Check files for a match and push onto the result stack
             */
            if (fileSystemObject.isFile) 
			{
                if ((typeof pattern == 'undefined') || regexp.test(fileSystemObject.leaf)) 
				{
                    matchedFiles.push(new Jaxer.File(fileSystemObject));
                }
            }
            /*
             * Add folders to the directory list if we are searching sub folders
             */
            if (recursive && fileSystemObject.isDir) 
			{
                directoryList.push(fileSystemObject);
            }
        }
    }
	
    /*
     * return the matched files as an array of Jaxer.File objects
     */
    return matchedFiles;
}
/**
 * Scan a folder tree from the provided path and find files
 * that match the provided regular expression pattern and
 * run the provided function against each match
 *
 * @alias Jaxer.Dir.map
 * @param {String} path
 *   The starting path for the search. This must be a folder.
 * @param {Object} [options]
 *   Optional An Associative Array of optional parameters
 * @param {Function(Jaxer.File):Object} [fn]
 *   Optional The function to run. It will be invoked for each the matched 
 *   Jaxer.File object, with the Jaxer.File object being passed as its 
 *   parameter
 * @exception {Jaxer.Exception}
 *   A Jaxer.Exception object is thrown when the path is not a valid folder
 * @return {Object[]}
 *   An Array of objects created by invoking the provided function on each
 *   file which matched the provided pattern
 */
Dir.map = function map(path, options, fn)
{
    fn = fn || function(file){ return file };
    return Dir.grep(path, options).map(function(file) { return fn(file) });
}

Jaxer.Dir = Dir;

Log.trace("*** Dir.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/IO > Includer.js
 */
coreTraceMethods.TRACE('Loading fragment: Includer.js');
Jaxer.lastLoadedFragment = 'Includer.js';

(function(){

var log = Log.forModule("Includer"); // Only if Log itself is defined at this point of the includes

/**
 * @namespace {Jaxer.Includer}	Namespace object holding functions and members
 * used to get and include HTML and JavaScript from external sources.
 */
var Includer = {};

var INCLUDE_TAG = "jaxer:include";

/**
 * Replaces the element with the contents of its source or path
 * 
 * @private
 * @alias Jaxer.Includer.includeElement
 * @param {DocumentElement} doc
 * 		The document of the element
 * @param {HTMLElement} includeTag
 * 		The HTML element to replace
 * @return {Boolean}
 * 		true if successful, false otherwise
 */
Includer.includeElement = function includeElement(doc, includeTag)
{
	log.trace("Entering with element to include having src = " + includeTag.getAttribute("src") + " and path = " + includeTag.getAttribute("path"));
	// Read in file contents
	var htmlToInclude = "";
	var from;

	var error = null;
	try
	{
		if (includeTag.getAttribute("src")) // url-type path given, either of file type or web type
		{
			from = includeTag.getAttribute("src");
			htmlToInclude = Web.get(from, {cacheBuster: true});
		}
		else
		{
			from = '';
			log.warn("No src attribute was given for this " + includeTag.tagName + " element");
		}
		
		if (from) 
		{
			if (htmlToInclude.length == 0) 
			{
				log.warn("No content was read from included file at " + from + " for this " + includeTag.tagName + " element");
			}
			else 
			{
				log.debug("Successfully included file at " + from + " for this " + includeTag.tagName + " element");
			}
		}
	}
	catch (e)
	{
		error = e;
	}
	
	// Replace includeTag with the parsed HTML
	Util.DOM.insertHTML(htmlToInclude, includeTag, 0);
	
	if (error)
	{
		if (Config.INCLUDE_ERRORS_ARE_RESPONSE_ERRORS) 
		{
			throw new Exception(error);
		}
		else
		{
			log.error(error);
		}
	}

	return (error == null);
}

/**
 * Evaluate the given JavaScript string in the given global context
 * 
 * @advanced
 * @alias Jaxer.Includer.evalOn
 * @param {String} contents
 * 		The string of script code to evaluate
 * @param {Object} [global]
 * 		An optional global context (usually a window object) in which to
 * 		evaluate it
 * @param {String} [effectiveUrl]
 * 		An optional parameter to indicate (e.g. in error messages) the effective
 * 		URL from which this code originates.
 * @return {Object}
 * 		The result of the last JavaScript expression evaluated.
 */
Includer.evalOn = function evalOn(contents, global, effectiveUrl)
{
	if (Jaxer.request)
	{
		log.trace("Evaluating using Jaxer.request.evaluateScript: contents = " + contents.substr(0, 10) + "... with global = " + global + " and effectiveUrl = " + effectiveUrl);
		return Jaxer.request.evaluateScript(contents, global, effectiveUrl)
	}
	else 
	{
		var tempPath = Dir.combine(System.tempFolder, "_script_" + (new Date().getTime()) + Math.random());
		var tempUrl = Dir.pathToUrl(tempPath);
		log.trace("Evaluating using temporary file " + tempUrl + ": " + contents.substr(0, 10) + "...");
		File.write(tempPath, contents);
		try 
		{
			Jaxer.include(tempUrl, global);
		}
		finally 
		{
			File.remove(tempPath);
		}
	}
}

/**
 * Compile the given JavaScript string in the given global context
 * 
 * @advanced
 * @alias Jaxer.Includer.compile
 * @param {String} contents
 * 		The string of script code to compile
 * @param {Object} [global]
 * 		An optional global context (usually a window object) in which to
 * 		compile it
 * @param {String} [effectiveUrl]
 * 		An optional parameter to indicate (e.g. in error messages) the effective
 * 		URL from which this code originates.
 * @return {String}
 * 		The compiled bytecode, as a string.
 */
Includer.compile = function compile(contents, global, effectiveUrl)
{
	if (Jaxer.request)
	{
		log.trace("Compiling using Jaxer.request.compileScript: contents = " + contents.substr(0, 10) + "... with global = " + global + " and effectiveUrl = " + effectiveUrl);
		return Jaxer.request.compileScript(contents, global, effectiveUrl)
	}
	else 
	{
		throw new Exception("Must have a Jaxer.request object before compiling a script")
	}
}

/**
 * Evaluate the given JavaScript bytecode string in the given global context
 * 
 * @advanced
 * @alias Jaxer.Includer.evalCompiledOn
 * @param {String} contents
 * 		The string of script code to evaluate
 * @param {Object} [global]
 * 		An optional global context (usually a window object) in which to
 * 		evaluate it
 * @return {Object}
 * 		The result of the last JavaScript expression evaluated.
 */
Includer.evalCompiledOn = function evalCompiledOn(compiledContents, global)
{
	if (!compiledContents)
	{
		log.debug("Ignoring empty or null compiledContents");
	}
	else if (Jaxer.request)
	{
		log.trace("Evaluating using Jaxer.request.evaluateCompiledScript: compiledContents.length = " + compiledContents.length + "... with global = " + global);
		return Jaxer.request.evaluateCompiledScript(compiledContents, global)
	}
	else 
	{
		throw new Exception("Must have a Jaxer.request object before evaluating a compiled script")
	}
}

/**
 * Loads and evaluates a JavaScript file on the given global execution object
 * with the given runat attribute.
 * 
 * @alias Jaxer.Includer.load
 * @param {String} src
 * 		The URL from which the JavaScript file should be retrieved. If the src
 * 		is an absolute file://... URL then it is retrieved directly from the
 * 		file system, otherwise it is retrieved via a web request.
 * @param {Object} [global]
 * 		The global (usually a window object) on which to evaluate it. By
 * 		default, it is the same global as the one in which the calling function
 * 		is executing.
 * @param {String} [runat]
 * 		The value of the effective runat "attribute" to use when evaluating this
 * 		code. By default, it uses the same runat attribute as the last evaluated
 * 		script block.
 * @param {Boolean} [useCache]
 * 		If true, the file is loaded from a cached compiled version if available,
 * 		and if not available the file's contents are fetched, compiled and cached.
 * 		By default this is false.
 * @param {Boolean} [forceCacheRefresh]
 * 		If true, force loading from src even if found in cache. The loaded contents
 * 		will then be cached.
 * 		By default this is false.
 * @param {Boolean} [dontSetRunat]
 * 		If true, any functions created in this script block will not have a runat
 * 		property set on them, not even the default runat of the last script block.
 * 		By default this is false.
 * @return {Object}
 * 		The result of the last JavaScript expression evaluated, if any.
 */
Includer.load = function load(src, global, runat, useCache, forceCacheRefresh, dontSetRunat)
{
	var result;
	var oldNewFunctions = Jaxer.pageWindow.Jaxer.__newFunctions;
	var useNewFunctions = false;
	
	src = Web.resolve(src);
	
	try
	{
		
		if (!global) global = Util.getGlobalContext(load.caller);
		runat = runat || Jaxer.lastScriptRunat;
		
		if (!dontSetRunat) 
		{
			if (runat && runat.match(RUNAT_ANY_SERVER_REGEXP)) 
			{
				useNewFunctions = true;
			}
		}
		
		var cachedContents, isInCache;
		if (useCache) 
		{
			if (forceCacheRefresh) 
			{
				isInCache = false;
			}
			else 
			{
				cachedContents = CacheManager.autoloadScripts[src];
				isInCache = (cachedContents != undefined);
				log.trace("Is '" + src + "' in cache? " + isInCache);
			}
		}
		
		var contents;
		if (!useCache || !isInCache) 
		{
			if (Util.Url.isFile(src)) 
			{
				contents = File.read(src);
			}
			else 
			{
				contents = Web.get(src);
			}
			log.trace("Retrieved " + contents.length + " characters from '" + src + "'");
		}
		
		if (useCache && !isInCache)
		{
			if (Config.CACHE_USING_SOURCE_CODE)
			{
				log.trace("Caching as plain text '" + src + "'");
				cachedContents = contents;
			}
			else
			{
				log.trace("Compiling and caching '" + src + "'");
				cachedContents = Includer.compile(contents, global, src);
			}
			CacheManager.autoloadScripts[src] = cachedContents;
		}
		
		if (useNewFunctions) // turn this on right before evaluation
		{
			Jaxer.pageWindow.Jaxer.__newFunctions = [];
		}
		
		if (useCache) 
		{
			if (Config.CACHE_USING_SOURCE_CODE)
			{
				log.trace("Evaluating '" + src + "' from source code");
				result = Includer.evalOn(cachedContents, global, src);
			}
			else
			{
				log.trace("Evaluating '" + src + "' from compiled code");
				result = Includer.evalCompiledOn(cachedContents, global, src);
			}
		}
		else 
		{
			log.trace("Evaluating '" + src + "'");
			result = Includer.evalOn(contents, global, src);
		}
		
		if (Jaxer.pageWindow.Jaxer.__newFunctions) 
		{
			log.trace("Jaxer.pageWindow.Jaxer.__newFunctions contains " + (Jaxer.pageWindow.Jaxer.__newFunctions.length) + " items");
			Jaxer.pageWindow.Jaxer.__newFunctions.forEach(function setRunat(name)
			{
				if (name && (typeof name == "string"))
				{
					var func = global[name];
					if (func && (func != null) && (func.toSource) && (typeof func == "function") && // Need to do some extraordinary checking because XDR compilation can leave function "stubs"
						!Util.isNativeFunction(func) &&
						(typeof func[RUNAT_ATTR] != "string"))
					{
						func[RUNAT_ATTR] = runat;
						log.trace("Set runat='" + runat + "' on function named '" + func.name + "'");
					}
				}
			});
		}
		
		log.debug("Included: " + src);

	}
	finally // clean up Jaxer.pageWindow.Jaxer.__newFunctions whether or not there was an error
	{
		if (useNewFunctions) 
		{
			Jaxer.pageWindow.Jaxer.__newFunctions = oldNewFunctions;
		}
	}
	
	return result;
	
}

Jaxer.load = Includer.load;

frameworkGlobal.Includer = Jaxer.Includer = Includer;

Log.trace("*** Includer.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/IO > Web.js
 */
coreTraceMethods.TRACE('Loading fragment: Web.js');
Jaxer.lastLoadedFragment = 'Web.js';

(function() {

var log = Log.forModule("Web");

/**
 * @namespace {Jaxer.Web} Namespace object holding functions and members used to
 * resolve and fetch web resources. Fetching is done via XMLHttpRequests.
 */
var Web = {};

// private variables
var networkUtils = new Jaxer.NetworkUtils();

// On the server side, XHR should be defined on the frameworkGlobal like the rest of the framework
frameworkGlobal.XHR = Jaxer.XHR;

// The following is documented in XHR.js:
XHR.getTransport = function getTransport()
{
	var xhr;
	if (Jaxer.pageWindow) 
	{
		xhr = new Jaxer.pageWindow.XMLHttpRequest();
	}
	else 
	{
		var xhr = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
		xhr.QueryInterface(Components.interfaces.nsIXMLHttpRequest);
	}
	return xhr;
}

/**
 * Resolves a URL to an absolute URL (one starting with protocol://domain...)
 * To resolve a relative URL (with or without a leading /), use a current
 * document or callback for reference. Uses the base href of the current
 * document, if specified. 
 * If Jaxer.Config.REWRITE_TO_FILE_URL_REGEX exists and matches the url,
 * the url is resolved as a file-type URL: it will use the given referenceUrl if
 * it's already a file-based one, otherwise it will use the Jaxer.request.documentRoot
 * for an absolute url or Jaxer.request.currentFolder for a relative url.
 * If Jaxer.Config.REWRITE_RELATIVE_URL exists (and we're not dealing in file-based URLs),
 * its value is used to rewrite the relative url -- replacing
 * Jaxer.Config.REWRITE_RELATIVE_URL_REGEX pattern, if it exists, else replacing
 * http[s]:// followed by anything but a slash.
 *  
 * @alias Jaxer.Web.resolve
 * @param {String} url 
 * 		The URL to resolve
 * @param {String} [referenceUrl] 
 * 		An optional reference URL to use, overriding the built-in logic
 * @return {String}
 * 		The fully-resolved URL, or the original URL if the input was already an
 * 		absolute URL
 */
Web.resolve = function resolve(url, referenceUrl)
{
	// absolute URL with protocol are unchanged
	if (/^\w+\:\/\//.test(url)) 
	{
		if (/^resource/.test(url)) 
		{
			resolvedUrl = url.replace(/^resource\:\/\//, System.executableUrl);
		}
		else 
		{
			resolvedUrl = url;
		}
	}
	else
	{
		if (Config.REWRITE_TO_FILE_URL_REGEX && 					// If we're supposed to rewrite some URLs to be file-based...
			Config.REWRITE_TO_FILE_URL_REGEX.test(url) &&			// ... and this is such a URL...
		    (!referenceUrl || !Util.Url.isFileUrl(referenceUrl)))	// ... and we're not given a file-based reference URL
		{															// ... then use the document root (for absolute URLs) or current folder (for relative ones)
			referenceUrl = "file://" + (/^\//.test(url) ? Jaxer.request.documentRoot : Jaxer.request.currentFolder) + "/";
		}															// as the file-based reference URL for resolving
		else if (!referenceUrl) 									// otherwise get a web-based URL as the reference, if needed
		{
			referenceUrl = Web.getDefaultReferenceUrl();
		}
		var currentUriObj = networkUtils.fixupURI(referenceUrl);
		var resolvedUrl = currentUriObj.resolve(url);
		if (Jaxer.Config.REWRITE_RELATIVE_URL)
		{
			var regex;
			if (Config.REWRITE_RELATIVE_URL_REGEX)
			{
				regex = (typeof Jaxer.Config.REWRITE_RELATIVE_URL_REGEX == "string") ? new RegExp(Jaxer.Config.REWRITE_RELATIVE_URL_REGEX) : Jaxer.Config.REWRITE_RELATIVE_URL_REGEX;
			}
			else
			{
				regex = /^http[s]?\:\/\/[^\/]+/;
			} 
			resolvedUrl = resolvedUrl.replace(regex, Jaxer.Config.REWRITE_RELATIVE_URL);
		}
	}
	return resolvedUrl;
}

/**
 * Returns the URL to be used as a reference for resolving relative URLs if no
 * other reference is given
 * 
 * @advanced
 * @alias Jaxer.Web.getDefaultReferenceUrl
 * @return {String}
 * 		The absolute URL
 */
Web.getDefaultReferenceUrl = function getDefaultReferenceUrl()
{
	if (!Jaxer.pageWindow || !Jaxer.pageWindow.document || !Jaxer.request || !Jaxer.request.parsedUrl) 
	{
		throw new Exception("No default reference URL could be constructed; cannot use relative URLs outside the context of a page or callback");
	}
	var baseElt = Jaxer.pageWindow.document.getElementsByTagName('base')[0];
	if (baseElt && baseElt.href && (baseElt.href != '')) 
	{
		referenceUrl = baseElt.href;
	}
	else 
	{
		referenceUrl = Jaxer.request.parsedUrl.url;
	}
	return referenceUrl;
}

/**
 * A generalized method to access a web URL via the built-in XMLHttpRequest object.
 * 
 * @alias Jaxer.Web.send
 * @param {String} url 
 * 		The url to access
 * @param {String} [method] 
 * 		Usually 'GET' (default) or 'POST'
 * @param {String|Object} [data] 
 * 		Use for POST submissions, or for GET requests if the url does not
 * 		already contain the data. This may be a string (usually of the form
 * 		name1=value&name2=value), or an object whose name->value property pairs
 * 		will be used to construct such a string.
 * @param {Jaxer.XHR.SendOptions|Object} [options] 
 * 		Options for finer control of how the request is made.
 * @return {Object}
 * 		The text of the requested document, or the XML DOM if the response was
 * 		an XML document. Set the "as" property in the options argument to "text"
 * 		or "xml" or "e4x" to force what is returned. An Exception is thrown if not
 * 		successful.
 */
Web.send = function send(url, method, data, options)
{
	if ((typeof url != "string") || !url.match(/\w/)) 
	{
		throw new Exception("No URL specified");
	}
	options = options || {};
	if ((data != null) && (data != undefined) && (typeof data != "string")) 
	{
		data = Util.Url.hashToQuery(data);
	}
	log.trace("Parameters are: url: " + url + "; method: " + method + "; data: " + data + "; options: " + uneval(options));
	var resolvedUrl = Web.resolve(url);
	log.trace("Resolved URL to: " + resolvedUrl);
	options.url = resolvedUrl;
	if (typeof method != "undefined") options.method = method;
	var response = XHR.send(data, options);
	log.trace("Received response of type '" + (typeof response) + 
		((typeof response == "string") ? 
			"' and length " + response.length + ": " + response.substr(0, 100) + (response.length > 100 ? "..." : "") :
			"'"));
	return response;
}

/**
 * Fetch a document from a URL by resolving it to a local file
 * (if it starts with file://) or by a GET command.
 * 
 * @alias Jaxer.Web.get
 * @param {String} url 
 * 		The URL to fetch, which may be a file:// URL if desired. This will first
 * 		be resolved by Dir.resolve() or Web.resolve().
 * @param {Jaxer.XHR.SendOptions|Object} options 
 * 		Options for finer control of how the request is made.
 * @return {Object}
 * 		The text of the requested document, or the XML DOM if the response was
 * 		an XML document. Set the "as" property in the options argument to "text"
 * 		or "xml" to force what is returned. An Exception is thrown if not
 * 		successful.
 */
Web.get = function get(url, options)
{
	var content;
	var url = Web.resolve(url); // Do this explicitly in case it's turned into a file-type URL
	if (Util.Url.isFile(url)) 
	{
		try 
		{
			log.trace("Retrieving from file URL: " + url);
			var path = Dir.resolve(url);
			log.trace("Resolved to path: " + path);
			content = File.read(path);
			log.trace("Read " + (content ? content.length : 0) + " characters from file");
		} 
		catch (e) 
		{
			throw new Exception("Could not read file from url='" + url + "' (as '" + path + "'): " + e);
		}
	}
	else
	{
		log.trace("Retrieving from web URL: " + url);
		content = Web.send(url, Web.ACTIONS.GET, null, options);
	}
	return content;
}

/**
 * POST data to a URL and return the response web page.
 * 
 * @alias Jaxer.Web.post
 * @param {String} url 
 * 		The URL of the page to POST to and fetch. This will first be resolved by
 * 		Web.resolve().
 * @param {String|Object} data 
 * 		The data to submit. If a string, it should be a query string in a format
 * 		(name1=value1&name2=value2) suitable for a Content-Type of
 * 		'application/x-www-form-urlencoded'. If an object, its enumerable
 * 		properties will be used to construct the query string.
 * @param {Jaxer.XHR.SendOptions|Object} [options] 
 * 		Options for finer control of how the request is made.
 * @return {Object}
 * 		The text of the response, or the XML DOM if the response was
 * 		an XML document. Set the "as" property in the options argument to "text"
 * 		or "xml" to force what is returned. An Exception is thrown if not
 * 		successful.
 */
Web.post = function post(url, data, options)
{
	return Web.send(url, Web.ACTIONS.POST, data, options);
}

/**
 * Send an OPTIONS-type HTTP request to a URL and return the response.
 * 
 * @alias Jaxer.Web.options
 * @param {String} url 
 * 		The URL of the page to send the request. This will first be resolved by
 * 		Web.resolve().
 * @param {String|Object} data 
 * 		The data to submit. If a string, it should be a query string in a format
 * 		(name1=value1&name2=value2) suitable for a Content-Type of
 * 		'application/x-www-form-urlencoded'. If an object, its enumerable
 * 		properties will be used to construct the query string.
 * @param {Jaxer.XHR.SendOptions|Object} [options] 
 * 		Options for finer control of how the request is made.
 * @return {Object}
 * 		The text of the response, or the XML DOM if the response was
 * 		an XML document. Set the "as" property in the options argument to "text"
 * 		or "xml" to force what is returned. An Exception is thrown if not
 * 		successful.
 */
Web.options = function options(url, data, options)
{
	return Web.send(url, Web.ACTIONS.OPTIONS, data, options);
}

/**
 * Send a HEAD-type HTTP request to a URL and return the response.
 * 
 * @alias Jaxer.Web.head
 * @param {String} url 
 * 		The URL of the page to send the request. This will first be resolved by
 * 		Web.resolve().
 * @param {Jaxer.XHR.SendOptions|Object} [options] 
 * 		Options for finer control of how the request is made.
 * @return {Object}
 * 		The text of the response, or the XML DOM if the response was
 * 		an XML document. Set the "as" property in the options argument to "text"
 * 		or "xml" to force what is returned. An Exception is thrown if not
 * 		successful.
 */
Web.head = function head(url, options)
{
	return Web.send(url, Web.ACTIONS.HEAD, null, options);
}

/**
 * Send a PUT-type HTTP request to a URL and return the response.
 * 
 * @alias Jaxer.Web.put
 * @param {String} url 
 * 		The URL of the page to send the request. This will first be resolved by
 * 		Web.resolve().
 * @param {String|Object} data 
 * 		The data to submit. If a string, it should be a query string in a format
 * 		(name1=value1&name2=value2) suitable for a Content-Type of
 * 		'application/x-www-form-urlencoded'. If an object, its enumerable
 * 		properties will be used to construct the query string.
 * @param {Jaxer.XHR.SendOptions|Object} [options] 
 * 		Options for finer control of how the request is made.
 * @return {Object}
 * 		The text of the response, or the XML DOM if the response was
 * 		an XML document. Set the "as" property in the options argument to "text"
 * 		or "xml" to force what is returned. An Exception is thrown if not
 * 		successful.
 */
Web.put = function put(url, data, options)
{
	return Web.send(url, Web.ACTIONS.PUT, data, options);
}

/**
 * Send a DELETE-type HTTP request to a URL and return the response.
 * 
 * @alias Jaxer.Web.del
 * @param {String} url 
 * 		The URL of the page to send the request. This will first be resolved by
 * 		Web.resolve().
 * @param {Jaxer.XHR.SendOptions|Object} [options] 
 * 		Options for finer control of how the request is made.
 * @return {Object}
 * 		The text of the response, or the XML DOM if the response was
 * 		an XML document. Set the "as" property in the options argument to "text"
 * 		or "xml" to force what is returned. An Exception is thrown if not
 * 		successful.
 */
Web.del = function del(url, options)
{
	return Web.send(url, Web.ACTIONS.DELETE, null, options);
}

/**
 * GET or POST data to a URL, loading the result into the window of
 * a new Jaxer.Sandbox object.
 * 
 * @alias Jaxer.Web.open
 * @param {String} url 
 * 		The URL of the page to GET or POST to. This will first be resolved by
 * 		Web.resolve().
 * @param {String|Object} [data]
 * 		The data to submit, if any. If this parameter is omitted or is null,
 * 		a GET is used; otherwise a POST is used. 
 * 		If this is a string, it should usually be a query string in a format
 * 		(name1=value1&name2=value2) suitable for a Content-Type of
 * 		'application/x-www-form-urlencoded'. If an object, its enumerable
 * 		properties will be used to construct the query string.
 * @param {Jaxer.Sandbox.OpenOptions|Object} options 
 * 		Options for finer control of how the request is made.
 * @return {Jaxer.Sandbox}
 * 		The Sandbox, which will usually have a window and document in it 
 * 		(if the request was successful and returned an HTML page)
 * @see Jaxer.Sandbox
 */
Web.open = function open(url, data, options)
{
	return new Jaxer.Sandbox(url, data, options);
}


/**
 * An enumeration of constants for various standard HTTP methods or actions 
 * 
 * @alias Jaxer.Web.ACTIONS
 * @property {Object}
 */
Web.ACTIONS = {};

/**
 * A constant describing the standard HTTP GET method (or action) 
 * 
 * @alias Jaxer.Web.ACTIONS.GET
 * @property {String}
 */
Web.ACTIONS.__defineGetter__("GET", function() { return "GET"; });
/**
 * A constant describing the standard HTTP POST method (or action) 
 * 
 * @alias Jaxer.Web.ACTIONS.POST
 * @property {String}
 */
Web.ACTIONS.__defineGetter__("POST", function() { return "POST"; });
/**
 * A constant describing the standard HTTP PUT method (or action) 
 * 
 * @alias Jaxer.Web.ACTIONS.PUT
 * @property {String}
 */
Web.ACTIONS.__defineGetter__("PUT", function() { return "PUT"; });
/**
 * A constant describing the standard HTTP DELETE method (or action) 
 * 
 * @alias Jaxer.Web.ACTIONS.DELETE
 * @property {String}
 */
Web.ACTIONS.__defineGetter__("DELETE", function() { return "DELETE"; });
/**
 * A constant describing the standard HTTP HEAD method (or action) 
 * 
 * @alias Jaxer.Web.ACTIONS.HEAD
 * @property {String}
 */
Web.ACTIONS.__defineGetter__("HEAD", function() { return "HEAD"; });
/**
 * A constant describing the standard HTTP OPTIONS method (or action) 
 * 
 * @alias Jaxer.Web.ACTIONS.OPTIONS
 * @property {String}
 */
Web.ACTIONS.__defineGetter__("OPTIONS", function() { return "OPTIONS"; });


frameworkGlobal.Web = Jaxer.Web = Web;

Log.trace("*** Web.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/IO > Socket.js
 */
coreTraceMethods.TRACE('Loading fragment: Socket.js');
Jaxer.lastLoadedFragment = 'Socket.js';

(function() {

var log = Log.forModule("Socket");

/**
 * @classDescription {Jaxer.Socket} Network socket utility object for simple 
 * 		character-based (non-binary) socket access.
 */

/**
 * The constructor of a network socket object used for character-based (non-binary) operations
 * 
 * @alias Jaxer.Socket
 * @constructor
 * @return {Jaxer.Socket}
 * 		Returns an instance of Socket.
 */
function Socket()
{
	this._transportService = Components.classes["@mozilla.org/network/socket-transport-service;1"].
			getService(Components.interfaces.nsISocketTransportService);	
}

/**
 * Open the socket for communication
 * 
 * @alias Jaxer.Socket.prototype.open
 * @param {String} host
 * 		The host to connect to
 * @param {Number} port
 * 		The port on which to connect
 */
Socket.prototype.open = function open(host, port)
{
	
	this._transport = this._transportService.createTransport(null,0,host,port,null);

	if (!this._transport) {
		throw ("Cannot connect to server '" + host + ":" + port);
	}
	
	this._transport.setTimeout(Components.interfaces.nsISocketTransport.TIMEOUT_READ_WRITE, 5);
	
	// Set up output stream
	
	this._ostream = this._transport.openOutputStream(Components.interfaces.nsITransport.OPEN_BLOCKING,0,0);		
	
	this._outcharstream = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
		createInstance(Components.interfaces.nsIConverterOutputStream);
	this._outcharstream.init(this._ostream, "UTF8", 80, 0x0);

	// Set up input stream
	
	this._istream = this._transport.openInputStream(Components.interfaces.nsITransport.OPEN_BLOCKING,0,0);
		
	this._incharstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].
		createInstance(Components.interfaces.nsIConverterInputStream);
	this._incharstream.init(this._istream, "UTF8", 80, 0x0);

};

/**
 * Close the socket
 * 
 * @alias Jaxer.Socket.prototype.close
 */
Socket.prototype.close = function close() 
{
	try {
		this._incharstream.close();
		this._outcharstream.close();
    }
	catch(e) {
		// ignore this exception, we're just trying to close this socket down
	}
	
	this._transport.close(0);
};

/**
 * Write a string to the socket
 * 
 * @alias Jaxer.Socket.prototype.writeString
 * @param {String} data
 * 		The text to write
 */
Socket.prototype.writeString = function writeString(data) 
{
	this._outcharstream.writeString(data);
};

/**
 * Read a single line from the socket
 * 
 * @alias Jaxer.Socket.prototype.readLine
 * @return {String}
 * 		The text read in
 */
//Socket.prototype.readLine = function()
//{
//	if (this._incharstream instanceof Components.interfaces.nsIUnicharLineInputStream) 
//	{
//		var line = {};
//		this._incharstream.readLine(line);
//		return line.value;
//	}
//};
Socket.prototype.readLine = function readLine()
{ // this fake newline function is required to workaround the issue in jxr-140
	var buf = "";
	var str = {value : "0"};
	
	while (str.value != "") 
	{
		this._incharstream.readString(1, str);
		if ( str.value != '\n' && str.value != '\r')
		{
			buf += str.value;
		}
		if ( str.value == '\n') {
			return buf;
		}	
	}
};


/**
 * Read characters from the socket into a string
 * 
 * @alias Jaxer.Socket.prototype.readString
 * @param {Number} count
 * 		How many characters to read
 * @return {String}
 * 		The text read in
 */
Socket.prototype.readString = function readString(count)
{
	var str = {}
	this._incharstream.readString(count, str);
	return str.value;
};

/**
 * How many bytes (not characters) are currently available on the stream?
 * 
 * @alias Jaxer.Socket.prototype.available
 * @return {Number}
 * 		the number of bytes available
 */
Socket.prototype.available = function available()
{
	return this._istream.available();
};

/**
 * Flush the socket's output stream
 * 
 * @alias Jaxer.Socket.prototype.flush
 */
Socket.prototype.flush = function flush()
{
	this._outcharstream.flush();
};

frameworkGlobal.Socket = Jaxer.Socket = Socket;

Log.trace("*** Socket.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/IO > BinarySocket.js
 */
coreTraceMethods.TRACE('Loading fragment: BinarySocket.js');
Jaxer.lastLoadedFragment = 'BinarySocket.js';

(function() {

var log = Log.forModule("BinarySocket");

/**
 * @classDescription {Jaxer.BinarySocket} Network socket utility object for simple 
 * 		binary socket access.
 */

/**
 * The constructor of a network socket object used for binary data operations
 * 
 * @alias Jaxer.BinarySocket
 * @constructor
 * @return {Jaxer.BinarySocket}
 * 		Returns an instance of BinarySocket.
 */
function BinarySocket()
{
	this._transportService = Components.classes["@mozilla.org/network/socket-transport-service;1"].
			getService(Components.interfaces.nsISocketTransportService);	
}

const BinaryInputStream = Components.Constructor("@mozilla.org/binaryinputstream;1", "nsIBinaryInputStream", "setInputStream");
const BinaryOutputStream = Components.Constructor("@mozilla.org/binaryoutputstream;1", "nsIBinaryOutputStream", "setOutputStream");

/**
 * Open the socket for communication
 * 
 * @alias Jaxer.BinarySocket.prototype.open
 * @param {String} host
 * 		The host to connect to
 * @param {Number} port
 * 		The port on which to connect
 */
BinarySocket.prototype.open = function open(host, port)
{
	
	this._transport = this._transportService.createTransport(null,0,host,port,null);

	if (!this._transport) {
		throw ("Cannot connect to server '" + host + ":" + port);
	}
	
	this._transport.setTimeout(Components.interfaces.nsISocketTransport.TIMEOUT_READ_WRITE, 5);
	
	// Set up output stream
	this._ostream = this._transport.openOutputStream(Components.interfaces.nsITransport.OPEN_BLOCKING,0,0);
	this._bostream = new BinaryOutputStream(this._ostream);
	
	// Set up input stream
	this._istream = this._transport.openInputStream(Components.interfaces.nsITransport.OPEN_BLOCKING,0,0);
	this._bistream = new BinaryInputStream(this._istream);

};

/**
 * Close the socket
 * 
 * @alias Jaxer.BinarySocket.prototype.close
 */
BinarySocket.prototype.close = function close() 
{
	try {
		this._bostream.close();
		this._bistream.close();
    }
	catch(e) {
		// ignore this exception, we're just trying to close this socket down
	}

	this._transport.close(0);
};

/**
 * Write a binary (byte) data array of integers to the socket
 * 
 * @alias Jaxer.BinarySocket.prototype.writeByteArray
 * @param {Array} data
 * 		The binary data array to write
 */
BinarySocket.prototype.writeByteArray = function writeByteArray(data) 
{
	this._bostream.writeByteArray(data, data.length);
};

/**
 * Write a binary (byte) data string to the socket
 * 
 * @alias Jaxer.BinarySocket.prototype.writeByteString
 * @param {Array} data
 * 		The binary data string to write
 */
BinarySocket.prototype.writeByteString = function writeByteString(data) 
{
	this._bostream.writeBytes(data, data.length);
};

/**
 * Read binary data from the socket into an array of bytes (integers)
 * 
 * @alias Jaxer.BinarySocket.prototype.readByteArray
 * @param {Number} count
 * 		How many bytes to read
 * @return {Array}
 * 		The bytes read in, as an array of integers
 */
BinarySocket.prototype.readByteArray = function readByteArray(count)
{
	return this._bistream.readByteArray(count);
};

/**
 * Read binary data from the socket into a string
 * 
 * @alias Jaxer.BinarySocket.prototype.readByteString
 * @param {Number} count
 * 		How many bytes to read
 * @return {String}
 * 		The bytes read in, as a string
 */
BinarySocket.prototype.readByteString = function readByteString(count)
{
	return this._bistream.readBytes(count);
};

/**
 * How many bytes are currently available on the stream?
 * 
 * @alias Jaxer.BinarySocket.prototype.available
 * @return {Number}
 * 		the number of bytes available
 */
BinarySocket.prototype.available = function available()
{
	return this._istream.available();
};

/**
 * Flush the socket's output stream
 * 
 * @alias Jaxer.BinarySocket.prototype.flush
 */
BinarySocket.prototype.flush = function flush()
{
	this._bostream.flush();
};

frameworkGlobal.BinarySocket = Jaxer.BinarySocket = BinarySocket;

Log.trace("*** BinarySocket.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/IO > SMTP.js
 */
coreTraceMethods.TRACE('Loading fragment: SMTP.js');
Jaxer.lastLoadedFragment = 'SMTP.js';

(function(){

var log = Log.forModule("SMTP");

/**
 * @namespace {Jaxer.SMTP} A namespace object holding functions and members used
 * for sending emails via SMTP (Simple Mail Transfer Protocol).
 */
var SMTP = {};

/*
 * The default port used to connect to an SMTP server. Initially set to 25.
 * 
 * @alias Jaxer.SMTP.DEFAULT_PORT
 * @property {Number}
 */
SMTP.DEFAULT_PORT = 25;

/**
 * Sends an email via SMTP
 * 
 * @alias Jaxer.SMTP.sendEmail
 * @param {String} mailhost
 * 		The host to connect to
 * @param {Number} mailport
 * 		The port to connect on
 * @param {String} from
 * 		The address this message is coming from
 * @param {String} to
 * 		The address this message is going to
 * @param {String} subject
 * 		The subject of the message
 * @param {String} msg
 * 		The body of the message
 * @param {Array} headers
 * 		Array of extra msg headers, [['header1','value1'],['header2','value2'], ... ]
 */
SMTP.sendEmail = function sendEmail(mailhost, mailport, from, to, subject, msg, headers)
{
	var s = new Jaxer.Socket();
	s.open(mailhost, mailport);
	log.trace('connecting to ' + mailhost + " on port " + mailport);
	
	// Read in initial welcome string
	res = s.readLine();
	log.trace('<' + res);
	
	if (Jaxer.Util.String.startsWith(res, "220") == false) 
	{
		throw new Exception("SMTP: introduction resulted in: " + res);
	}
	
	s.writeString("HELO " + "localhost\r\n");
	log.trace('>' + "HELO " + "localhost\r\n");

	s.flush();
	res = s.readLine();
//	res = s.readString(1024);
	log.trace('<' + res );
	
	if (Jaxer.Util.String.startsWith(res, "250") == false) 
	{
		throw new Exception("SMTP: expected 250 return code when sending HELO, received: " + res);
	}
	
	s.writeString("MAIL FROM:<" + from + ">\r\n");
	log.trace('>' + "MAIL FROM:<" + from + ">\r\n");
	
	s.flush();
	res = s.readLine();
	log.trace('<' + res + ": bytes available " + s.available());

	if (Jaxer.Util.String.startsWith(res, "250") == false) 
	{
		throw new Exception("SMTP: expected 250 return code when sending MAIL FROM, received: " + res);
	}
	
	if (to.constructor == to.__parent__.Array) 
	{
		for (var i = 0; i < to.length; i++) 
		{
			s.writeString("RCPT TO:<" + to[i] + ">\r\n");
			log.trace('>' + "RCPT TO:<" + to[i] + ">\r\n");
			s.flush();
			res = s.readLine();
			log.trace('<' + res);
			
			if (Jaxer.Util.String.startsWith(res, "250") == false) 
			{
				throw new Exception("SMTP: expected 250 return code when sending RCPT TO, received: " + res);
			}
		}
	}
	else 
	{
		s.writeString("RCPT TO:<" + to + ">\r\n");
		log.trace('>' + "RCPT TO:<" + to + ">\r\n");
		s.flush();
		res = s.readLine();
		log.trace('<' + res);
		
		if (Jaxer.Util.String.startsWith(res, "250") == false) 
		{
			throw new Exception("SMTP: expected 250 return code when sending RCPT TO, received: " + res);
		}
	}
	
	s.writeString("DATA\r\n");
	log.trace('>' + "DATA\r\n");
	s.flush();
	res = s.readLine();
	log.trace('<' + res);
	
	if (Jaxer.Util.String.startsWith(res, "354") == false) 
	{
		throw new Exception("SMTP: expected 354 return code when sending DATA, received: " + res);
	}
	
	s.writeString("From: " + from + "\r\n");
	log.trace('>' + "From: " + from + "\r\n");

	if (to.constructor == to.__parent__.Array) 
	{
		s.writeString("To: ");
		log.trace('>' + "To: ");
		for (var i = 0; i < to.length; i++) 
		{
			if(i>0) { s.writeString(","); }
			s.writeString(to[i]);
			log.trace('>' + to[i]);
		}
		s.writeString("\r\n");
	}
	else
	{
		s.writeString("To: " + to + "\r\n");
		log.trace('>' + "To: " + to + "\r\n");
	}

	s.writeString("Subject: " + subject + "\r\n");
	log.trace('>' + "Subject: " + subject + "\r\n");
	s.writeString("Date: " + new Date().toString() + "\r\n");
	log.trace('>' + "Date: " + new Date().toString() + "\r\n");

	// output any extra headers
	if (headers && headers.length > 0)
	{
		for (var i = 0; i < headers.length; i++) 
		{
			s.writeString(headers[i][0]+": " + headers[i][1] + "\r\n");
			log.trace('>' + headers[i][0]+": " + headers[i][1] + "\r\n");
		}
	}

	// Finish the header section
	s.writeString("\r\n");
	
	var msgLines = msg.split('\n');
	for (var i = 0; i < msgLines.length; i++) 
	{
		var line = msgLines[i];
		if (Jaxer.Util.String.startsWith(line, ".")) 
		{
			line = "." + line;
		}
		s.writeString(line + "\n");
		log.trace('>' + "To: " + to + "\r\n");
	}
	
	s.writeString("\r\n.\r\n");
	s.flush();
	res = s.readLine();
	log.trace('<' + res);
	
	if (Jaxer.Util.String.startsWith(res, "250") == false) 
	{
		throw new Exception("SMTP: expected 250 return code when closing conversation, received: " + res);
	}
	
	s.writeString("QUIT\r\n");
	log.trace('>' + "QUIT\r\n");
	s.flush();
	s.close();
}

/**
 * Sends an email message object via SMTP
 * 
 * @alias Jaxer.SMTP.sendMessage
 * @param {String} mailhost
 * 		The host to connect to
 * @param {Number} mailport
 * 		The port to connect on
 * @param {Jaxer.SMTP.MailMessage} mailMessage
 * 		The Jaxer.SMTP.MailMessage object to send
 */
SMTP.sendMessage = function sendMessage(mailhost, mailport, mailMessage)
{
	SMTP.sendEmail(mailhost, mailport, mailMessage._from, mailMessage._recipients, mailMessage._subject, mailMessage._body, mailMessage._extraHeaders);
}

/**
 * @classDescription {Jaxer.SMTP.MailMessage} A structure holding email message
 * information.
 */

/**
 * A structure holding email message information
 * 
 * @constructor
 * @alias Jaxer.SMTP.MailMessage
 * @return {Jaxer.SMTP.MailMessage}
 * 		Returns an instance of MailMessage.
 */
function MailMessage()
{
	this._date = new Date();
	this._from = "";
	this._recipients = [];
	this._subject = "";
	this._body = "";
	this._extraHeaders = [];
}

/**
 * Adds a recipient to the message
 * 
 * @alias Jaxer.SMTP.MailMessage.prototype.addRecipient
 * @param {String} recipient
 * 		The email address
 */
MailMessage.prototype.addRecipient = function addRecipient(recipient)
{
	this._recipients.push(recipient);
};

/**
 * Sets the "From" address on the message
 * 
 * @alias Jaxer.SMTP.MailMessage.prototype.setFrom
 * @param {String} from
 * 		The email address from which this message is coming
 */
MailMessage.prototype.setFrom = function setFrom(from)
{
	this._from = from;
};

/**
 * Sets the "Subject" of the message
 * 
 * @alias Jaxer.SMTP.MailMessage.prototype.setSubject
 * @param {String} subject
 * 		The subject text
 */
MailMessage.prototype.setSubject = function setSubject(subject)
{
	this._subject = subject;
};

/** 
 * Sets the timestamp on the message
 * 
 * @alias Jaxer.SMTP.MailMessage.prototype.setDate
 * @param {Object} date
 * 		The date it's sent
 */
MailMessage.prototype.setDate = function setDate(date)
{
	this._date = date;
};

/** 
 * Sets extra SMTP headers on the message, the provided header parameter is an two element array consisting of the
 * header name value pair.
 * 
 * @alias Jaxer.SMTP.MailMessage.prototype.addHeader,
 * @param {Array} header
 * 		The header to add.
 */
MailMessage.prototype.addHeader = function addHeader(header)
{
	this._extraHeaders.push(header);
};

/**
 * Sets the body (contents) of the message
 * 
 * @alias Jaxer.SMTP.MailMessage.prototype.setBody
 * @param {String} body
 * 		The text of the message
 */
MailMessage.prototype.setBody = function setBody(body)
{
	this._body = body;
};

SMTP.MailMessage = MailMessage;
frameworkGlobal.SMTP = Jaxer.SMTP = SMTP;

Log.trace("*** SMTP.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Exception > Exception.js
 */
coreTraceMethods.TRACE('Loading fragment: Exception.js');
Jaxer.lastLoadedFragment = 'Exception.js';

(function() {

/**
 * @classDescription {Jaxer.Exception} Exception used by the Jaxer framework.
 */

/**
 * The exception used by the Jaxer framework. At runtime this is available from
 * the window object
 * 
 * @constructor
 * @alias Jaxer.Exception
 * @param {String, Error} info
 * 		The descriptive text of the Exception to be thrown, or an Error-derived
 * 		object
 * @param {Object} [logger]
 * 		An optional reference to an instance of the framework logger to be used.
 * 		A default setting is used if this parameter is omitted
 * @return {Jaxer.Exception}
 * 		An instance of Exception
 */
var Exception = function Exception(info, logger)
{
	this.name = "Exception";
	var infoIsError = (info instanceof Error);
	this.innerErrorName = infoIsError ? info.name : null;
	var error;
	if (infoIsError)
	{
		error = info;
	}
	else
	{
		error = new Error((info == null || info == "" || (typeof info.toString != "function")) ? "(unknown error)" : info.toString());
		if (info != null && typeof info == "object") // try to extract more information from info
		{
			for (var p in info)
			{
				error[p] = info[p];
			}
		}
	}
	var details = [];
	
	// message 
	// fileName
	// lineNumber
	// name 
	
	for (var prop in error)
	{
		var val = error[prop];
		var type = typeof val;
		if (prop != 'details' &&
			prop != 'stack' && // we show our own stack
			val != null &&
			type != "undefined" &&
			type != "function" &&
			typeof val.toString == "function")
		{
			this[prop] = error[prop];
			var v = Util.String.trim(val.toString());
			var p = '' + prop + ": ";
			var indent = p.replace(/.{1}/g, ' ');
			if (prop != 'message') 
			{
				details.push(p + v.replace(/\n/g, "\n" + indent));
			}
		}
	}
	
	var tmp_stack = Components.stack.caller;
	
	var orig_location = 'UNKNOWN';
	
	while (tmp_stack)
	{
		var orig_location = tmp_stack.filename.replace(/^.*\//, '')+':'+tmp_stack.lineNumber;
		tmp_stack = tmp_stack.caller;
	}

	this.details = 'Error : ['+orig_location+']\n'+ this.message;
	this.description = this.message;
	
	logger = logger || Log.genericLogger;

	logger.error(this.description+'\n'+this.details, null, this.constructor.caller);
};

Exception.prototype = new Error();
Exception.prototype.constructor = Exception;

/**
 * Provides a string representation of the Exception description.
 * 
 * @alias Jaxer.Exception.prototype.toString
 * @return {String}
 * 		A description of the exception
 */
Exception.prototype.toString = function toString()
{
	return this.description;
};

// Static utility functions
/**
 * Returns a JavaScript Error (or Error-derived) object based on the given
 * object
 * 
 * @alias Jaxer.Exception.toError
 * @method
 * @param {Object} obj
 * 		If this is already derived from an Error, it will just be returned.
 * 		Otherwise it will be stringified and used as the description of the
 * 		error.
 * @return {Error}
 * 		The Error-derived representation
 */
Exception.toError = function toError(obj)
{
	if (typeof obj == "undefined") 
	{
		return new Error("undefined");
	}
	else if (obj instanceof Error || obj instanceof Exception) 
	{
		return obj;
	}
	else if (typeof obj.toString == "function") 
	{
		return new Error(obj.toString());
	}
	else 
	{
		return new Error("Cannot convert error object to text message");
	}
};

var detailProperties = ["message", "innerErrorName", "fileName", "lineNumber", "stack"];

/**
 * Get verbose details on the error
 * 
 * @alias Jaxer.Exception.toDetails
 * @param {Object} obj
 * 		The error object on which details are desired. An attempt is made to
 * 		convert it into an Error-derived object before details are retrieved.
 * @return {String}
 * 		The detailed description
 */
Exception.toDetails = function toDetails(obj)
{
	var error = Exception.toError(obj);
	var details = [];
	detailProperties.forEach(function(prop)
	{
		if (typeof error[prop] != "undefined")
		{
			var val = error[prop];
			if (val != null && val != "")
			{
				details.push([prop + ": ", val].join(prop == "stack" ? "\n" : ""));
			}
		}
	});
	return details.join("\n");
}

frameworkGlobal.Exception = Jaxer.Exception = Exception;

Jaxer.Log.trace("*** Exception.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Exception > ClientError.js
 */
coreTraceMethods.TRACE('Loading fragment: ClientError.js');
Jaxer.lastLoadedFragment = 'ClientError.js';

(function() {

/**
 * @classDescription {Jaxer.ClientError} An error that can be thrown on the client during a callback
 */

/**
 * An error that can be thrown on the client during a callback.
 * If you want to throw a meaningful (i.e., non-generic) error on the browser
 * from a callback, throw a new Jaxer.ClientError -- just be mindful not to
 * pass sensitive server-side information. On the client, a new Error will
 * be thrown by your proxy, or you can specify you'd like something else
 * to be thrown.
 * 
 * @constructor
 * @alias Jaxer.ClientError
 * @param {String, Object} info
 * 		The descriptive text of the Error to be thrown, or an object whose
 * 		properties will be copied to the Error object to be thrown. But
 * 		if options.wrapped is specified to be false, this argument itself
 * 		is thrown on the client.
 * @param {Object} [options]
 * 		A hashmap of name-value property pairs. Currently one option is supported:
 * 		if there is a 'wrapped' property and
 * 		it is set to false, the info object itself is thrown on the client,
 * 		rather than a new Error.
 */
var ClientError = function ClientError(info, options)
{
	if (typeof info == "undefined") info = "Unspecified server error";
	
	this.info = info;
	this.options = options || {};
};

frameworkGlobal.ClientError = Jaxer.ClientError = ClientError;

Jaxer.Log.trace("*** ClientError.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/DB > DB.js
 */
coreTraceMethods.TRACE('Loading fragment: DB.js');
Jaxer.lastLoadedFragment = 'DB.js';

(function(){

var log = Log.forModule("DB"); // Only if Log itself is defined at this point of the includes

/**
 * @namespace {Jaxer.DB} The namespace that holds functions and other objects
 * for working with a database.
 */
var DB =
{
	defaultConnections: {},
	SQL_ERROR_CODE_PROPERTY: 'sqlErrorCode',
	SQL_ERROR_DESCRIPTION_PROPERTY: 'sqlErrorDescription',
	FRAMEWORK: "FRAMEWORK_" + Math.random() + (new Date()).getTime()
};

/**
 * Returns a boolean value to indicate whether a connection exists (regardless
 * of whether it's open) with the given key
 * 
 * @private  
 * @alias Jaxer.DB.isSpecified
 * @param {String} name 
 * 		The name of the connection, usually the name of the application
 * @return {Boolean}
 * 		True of the connection has been defined
 */
DB.isSpecified = function isSpecified(name)
{
	return Boolean(defaultConnections[name]);
};

/**
 * The default implementation of execute if there is no connection: just throws
 * an exception
 * 
 * @private
 * @alias Jaxer.DB.executeWithoutConnection
 */
DB.executeWithoutConnection = function executeWithoutConnection()
{
	throw new Exception("Attempted to execute SQL query without having a valid default connection", log);
};

DB.execute = DB.frameworkExecute = DB.executeWithoutConnection; // The default value, before initialization

/**
 * The default implementation of a connection if there is no implementation
 * defined: just throws an exception
 * 
 * @private
 * @alias Jaxer.DB.connectionWithoutImplementation
 */
DB.connectionWithoutImplementation = function connectionWithoutImplementation()
{
	throw new Exception("Attempted to create a new Connection without having a valid default DB implementation", log);
};

/**
 * Initializes the database subsystem, including the database used by the framework itself
 * and any databases that will be needed by the apps in configApps.js whose names are known
 * in advance (i.e. they're not determined dynamically by the request's URL).
 * 
 * @private
 * @alias Jaxer.DB.init
 */
DB.init = function init()
{
	DB.initDefault(DB.FRAMEWORK, Config.FRAMEWORK_DB);
	DB.setDefault(DB.FRAMEWORK); // This sets the default actions for the framework connection
	
	for (var appName in Config.appsByName)
	{
		var app = Config.appsByName[appName];
		if (app.DB)
		{
			DB.initDefault(appName, app.DB);
		}
	}

}

/**
 * Initializes a default database connection, which entails creating it (not necessarily opening it)
 * and adding it to the Jaxer.DB.defaultConnections hashmap
 * 
 * @advanced
 * @alias Jaxer.DB.initDefault
 * @param {String} name
 * 		The (resolved) name of the app for which this connection should be used
 * @param {Object} params
 * 		The parameters to use for the database connection. In particular this object
 * 		must have an IMPLEMENTATION property equal to "MySQL", "SQLite", or other 
 * 		supported databases. 
 */
DB.initDefault = function initDefault(name, params)
{
	var isFramework = (name == DB.FRAMEWORK);
	var impl = DB[params.IMPLEMENTATION];
	if (!impl)
	{
		var message = "The IMPLEMENTATION property " + params.IMPLEMENTATION + " of the database params was not set to a reasonable value: ";
		Jaxer.Log.error(message + "params = " + uneval(params));
		throw message + "see the log file for more information";
	}
	log.trace("Creating database (if necessary) for " + (isFramework ? "Jaxer framework" : "app: " + name));
	impl.createDB(params);

	var conn = new impl.Connection(params);
	DB.defaultConnections[name] = conn;
	return conn;
};

/**
 * Sets the given named connection as the default one from now on (though this
 * is by default set anew for each request). If the given name is not already
 * a recognized (i.e. initialized) connection, it will first be initialized.
 * 
 * @advanced
 * @alias Jaxer.DB.setDefault
 * @param {String} name
 * 		The (resolved) name of the app for which this connection should be used
 * @param {Object} [params]
 * 		The parameters to use for the database connection if the name is not
 * 		already an initialized connection. In particular this object
 * 		must have an IMPLEMENTATION property equal to "MySQL", "SQLite", or other 
 * 		supported databases. 
 */
DB.setDefault = function setDefault(name, params)
{
	var isFramework = (name == DB.FRAMEWORK);
	log.trace("Setting default connection for " + (isFramework ? "Jaxer framework" : "app: " + name));

	var connectionName = isFramework ? "frameworkConnection" : "connection";
	var constructorName = isFramework ? "FrameworkConnection" : "Connection";
	var exec = isFramework ? "frameworkExecute" : "execute";
	var mapExec = isFramework ? "mapFrameworkExecute" : "mapExecute";
	var lastId = isFramework ? "frameworkLastInsertId" : "lastInsertId";
	var lastRowId = isFramework ? "frameworkLastInsertRowId" : "lastInsertRowId";

	var conn = DB.defaultConnections[name];
	if (!conn && params) // initialize a new default connection
	{
		conn = DB.initDefault(name, params);
	}
	
	if (conn)
	{
		DB[connectionName] = conn;
		DB[constructorName] = DB[conn.implementation].Connection; // This is the constructor for the current implementation's Connection
		DB[exec] = function() { return DB.defaultConnections[name].execute.apply(DB.defaultConnections[name], arguments)};
		DB[mapExec] = function() { return DB.defaultConnections[name].mapExecute.apply(DB.defaultConnections[name], arguments)};
		DB.__defineGetter__(lastId, function() { return this.defaultConnections[name].getLastId(); });
		DB.__defineGetter__(lastRowId, function() { return this.defaultConnections[name].getLastId(); });
	}
	else
	{
		DB[connectionName] = DB.connectionWithoutImplementation;
		DB[constructorName] = null;
		DB[exec] = DB.executeWithoutConnection;
		DB[mapExec] = DB.executeWithoutConnection;
		DB.__defineGetter__(lastId, function() { throw new Exception("Attempted to access " + lastId + " without having a valid default DB connection", log); });
		DB.__defineGetter__(lastRowId, function() { throw new Exception("Attempted to access " + lastRowId + " without having a valid default DB connection", log); });
	}
}

/**
 * A hashmap that holds references to the currently-recognized default 
 * database connections, according to configApps.js, config.js, and the
 * page requests encountered so far. It's keyed off the (resolved) name
 * of the current app.
 * 
 * @advanced
 * @alias Jaxer.DB.defaultConnections
 * @property {Object}
 */

/**
 * Holds a reference to the constructor of the current default database connection used
 * for database interactions, e.g. by Jaxer.DB.execute. This is determined
 * by the settings in configApps.js and in config.js. It can be different
 * for different requests. Its type is Jaxer.DB.MySQL.Connection or
 * Jaxer.DB.SQLite.Connection, etc.
 * 
 * @advanced
 * @alias Jaxer.DB.Connection
 * @property {Object}
 */

/**
 * Holds a reference to the constructor of the current default connection used
 * for the Jaxer framework's internal database interactions, e.g. by 
 * Jaxer.DB.frameworkExecute. This is determined by the settings in config.js. 
 * Its type is Jaxer.DB.MySQL.Connection or Jaxer.DB.SQLite.Connection, etc.
 * 
 * @advanced
 * @alias Jaxer.DB.FrameworkConnection
 * @property {Object}
 */

/**
 * Holds a reference to the current default connection that will be used
 * for database interactions, e.g. by Jaxer.DB.execute. This is determined
 * by the settings in configApps.js and in config.js. It can be different
 * for different requests. Its type is Jaxer.DB.MySQL.Connection or
 * Jaxer.DB.SQLite.Connection, etc.
 * 
 * @alias Jaxer.DB.connection
 * @property {Object}
 * @see Jaxer.DB.Connection
 */

/**
 * Holds a reference to the current default connection that will be used
 * for the Jaxer framework's internal database interactions, e.g. by 
 * Jaxer.DB.frameworkExecute. This is determined by the settings in config.js. 
 * Its type is Jaxer.DB.MySQL.Connection or Jaxer.DB.SQLite.Connection, etc.
 * 
 * @alias Jaxer.DB.frameworkConnection
 * @property {Object}
 * @see Jaxer.DB.FrameworkConnection
 */

/**
 * Executes the given SQL query string on the current default database 
 * (as defined in configApps.js). If the SQL includes ?'s (question
 * marks) as parameter placeholders, the values of those parameters
 * should be passed in as extra arguments to this function, either
 * as individual arguments or as a single array.
 * If the last argument is a (non-Array) object, it is used to pass in options.
 * Currently two options are supported: dateHandler and useLocalTimezone.
 * If dateHandler is given, it should be a function that takes
 * the raw MySQL date/time/datetime string representation of a returned cell value,
 * and a string describing the declared type,
 * and returns the desired JavaScript representation.
 * If dateHandler is not given, set useLocalTimezone to true to store date/time values using the local timezone.
 * Otherwise, by default they are stored as UTC.
 * 
 * @example
 *		<pre>
 *			rs = Jaxer.DB.execute("SELECT * FROM myTable");
 * 			rs = Jaxer.DB.execute("SELECT * FROM myTable WHERE id=? AND zip=?", myId, myZip);
 * 			rs = Jaxer.DB.execute("SELECT * FROM myTable WHERE id=? AND zip=?", [myId, myZip]);
 * 		</pre>
 * @alias Jaxer.DB.execute
 * @param {String} sql
 * 		The SQL to execute.
 * @return {Jaxer.DB.ResultSet, Number, Object[]}
 * 		The results of the query.
 * 		For a SELECT-type query, a Jaxer.DB.ResultSet is returned, with 0 or more rows.
 * 		For an INSERT/UPDATE/DELETE-type query, the number of rows affected is returned. 
 * 		On MySQL only: if multiple queries were issued (or a stored procedure was executed)  
 * 		the result will be a corresponding array of Jaxer.DB.ResultSet or Number objects.
 * @see Jaxer.DB.ResultSet
 */

/**
 * Prepares the given SQL query string on the current default database 
 * (as defined in configApps.js) and then iteratively executes it
 * over the given array of parameters.
 * 
 * @example
 *		<pre>
 * 			[rsA, rsB] = Jaxer.DB.mapExecute("SELECT * FROM myTable WHERE id=?", [idA, idB]);
 * 			[rsA, rsB] = Jaxer.DB.mapExecute("SELECT * FROM myTable WHERE id=? AND zip=?", [ [idA, zipA], [idB, zipB] ]);
 * 		</pre>
 * @alias Jaxer.DB.mapExecute
 * @param {String} sql
 * 		The SQL to execute, using ?'s (question marks) as parameter placeholders
 * @param {Array} arrayOfParameters
 * 		An array of parameters to use for each execution. Each element of the array
 * 		may itself be a single value or an array of values (corresponding to
 * 		the ?'s in the SQL)
 * @param {Object} [options]
 * 		An optional hashmap of options. Currently three options are supported: flatten, dateHandler, and useLocalTimezone.
 * 		If flatten is true, the returned result will be a single ResultSet
 * 		with its rows being the concatenated rows of each query.
 *		If dateHandler is given, it should be a function that takes
 * 		the raw MySQL date/time/datetime string representation of a returned cell value,
 * 		and a string describing the declared type,
 * 		and returns the desired JavaScript representation.
 * 		If dateHandler is not given, set useLocalTimezone to true to store date/time values using the local timezone.
 * 		Otherwise, by default they are stored as UTC.
 * @see Jaxer.DB.ResultSet
 */

/**
 * Executes the given SQL query string on the default framework database 
 * (as defined in Jaxer.Config.DB_FRAMEWORK). If the SQL includes ?'s (question
 * marks) as parameter placeholders, the values of those parameters
 * should be passed in as extra arguments to this function, either
 * as individual arguments or as a single array.
 * 
 * @example
 *		<pre>
 *			rs = Jaxer.DB.frameworkExecute("SELECT * FROM containers");
 * 			rs = Jaxer.DB.frameworkExecute("SELECT * FROM containers WHERE id=? AND name=?", myId, myName);
 * 			rs = Jaxer.DB.frameworkExecute("SELECT * FROM containers WHERE id=? AND name=?", [myId, myName]);
 * 		</pre>
 * @advanced
 * @alias Jaxer.DB.frameworkExecute
 * @param {String} sql
 * 		The SQL to execute.
 * @return {Jaxer.DB.ResultSet}
 * 		The results of the query (which may be an empty resultset)
 * @see Jaxer.DB.ResultSet
 */

/**
 * Prepares the given SQL query string on the default framework database 
 * (as defined in Jaxer.Config.DB_FRAMEWORK) and then iteratively executes it
 * over the given array of parameters.
 * 
 * @example
 *		<pre>
 * 			[rsA, rsB] = Jaxer.DB.mapFrameworkExecute("SELECT * FROM containers WHERE id=?", [idA, idB]);
 * 			[rsA, rsB] = Jaxer.DB.mapFrameworkExecute("SELECT * FROM containers WHERE id=? AND name=?", [ [idA, nameA], [idB, nameB] ]);
 * 		</pre>
 * @alias Jaxer.DB.mapFrameworkExecute
 * @param {String} sql
 * 		The SQL to execute, using ?'s (question marks) as parameter placeholders
 * @param {Array} arrayOfParameters
 * 		An array of parameters to use for each execution. Each element of the array
 * 		may itself be a single value or an array of values (corresponding to
 * 		the ?'s in the SQL)
 * @param {Object} [options]
 * 		An optional hashmap of options. Currently one option is supported: flatten.
 * 		If its value is true, the returned result will be a single ResultSet
 * 		with its rows being the concatenated rows of each query.
 * @return {Object}
 * 		A corresponding array of Jaxer.DB.ResultSet's for each query, 
 * 		or a single Jaxer.DB.ResultSet if the 'flatten' option is true.
 * @see Jaxer.DB.ResultSet
 */

/**
 * When you INSERT a row that has an AUTO_INCREMENT-type column in the default developer database, the value of that 
 * column in this row is automatically set by the database. To know what it was set to (an integer), 
 * retrieve the lastInsertId right after you execute the INSERT statement. Under other circumstances, 
 * the behavior of lastInsertId depends on the database implementation; for example, SQLite always 
 * returns the rowid of the last successfully inserted row, whether or not it had an 
 * INTEGER PRIMARY KEY AUTO_INCREMENT column.
 * 
 * @alias Jaxer.DB.lastInsertId
 * @property {Number}
 */

/**
 * When you INSERT a row that has an AUTO_INCREMENT-type column in the default developer database, the value of that 
 * column in this row is automatically set by the database. To know what it was set to (an integer), 
 * retrieve the lastInsertRowId right after you execute the INSERT statement. Under other circumstances, 
 * the behavior of lastInsertRowId depends on the database implementation; for example, SQLite always 
 * returns the rowid of the last successfully inserted row, whether or not it had an 
 * INTEGER PRIMARY KEY AUTO_INCREMENT column.
 * 
 * @alias Jaxer.DB.lastInsertRowId
 * @property {Number}
 */

/**
 * When you INSERT a row that has an AUTO_INCREMENT-type column in the default framework database, the value of that 
 * column in this row is automatically set by the database. To know what it was set to (an integer), 
 * retrieve the lastInsertId right after you execute the INSERT statement. Under other circumstances, 
 * the behavior of lastInsertId depends on the database implementation; for example, SQLite always 
 * returns the rowid of the last successfully inserted row, whether or not it had an 
 * INTEGER PRIMARY KEY AUTO_INCREMENT column.
 * 
 * @advanced
 * @alias Jaxer.DB.lastInsertId
 * @property {Number}
 */

/**
 * When you INSERT a row that has an AUTO_INCREMENT-type column in the default framework database, the value of that 
 * column in this row is automatically set by the database. To know what it was set to (an integer), 
 * retrieve the lastInsertRowId right after you execute the INSERT statement. Under other circumstances, 
 * the behavior of lastInsertRowId depends on the database implementation; for example, SQLite always 
 * returns the rowid of the last successfully inserted row, whether or not it had an 
 * INTEGER PRIMARY KEY AUTO_INCREMENT column.
 * 
 * @advanced
 * @alias Jaxer.DB.lastInsertRowId
 * @property {Number}
 */

/**
 * Closes all the default DB connections that are open. This is called by the
 * framework when there is a fatal or response error, or after every request if
 * CLOSE_AFTER_REQUEST is set to true in the connection's configuration
 * parameters
 * 
 * @advanced
 * @alias Jaxer.DB.closeAllConnections
 * @param {Boolean} onlyIfCloseAfterRequest
 * 		Set this to true if you only want to close connections whose
 * 		CLOSE_AFTER_REQUEST parameter is true
 */
DB.closeAllConnections = function closeAllConnections(onlyIfCloseAfterRequest)
{
	for (var connName in this.defaultConnections) 
	{
		var conn = this.defaultConnections[connName];
		if (conn && 
			(typeof conn.close == "function") &&
			(!onlyIfCloseAfterRequest || conn.closeAfterRequest)) 
		{
			conn.close();
		}
	}
}

/**
 * Attempts to convert the given sql to a string, if needed, and then trim it.
 * If the conversion fails or the string is empty, throws a Jaxer.Exception.
 * 
 * @advanced
 * @alias Jaxer.DB.sqlToString
 * @param {Object} sql
 * 		The sql to convert to a string, if needed
 * @param {Jaxer.Log.ModuleLogger} [log]
 * 		The logger into which errors should be logged. Defaults to the DB
 * 		module's logger.
 * @return {String}
 * 		The string representation of the sql.
 */
DB.sqlToString = function sqlToString(sql, logger)
{
	var e = null;
	logger |= log;
	
	if (typeof sql == 'xml')
	{
		sql = String(sql);
	}
	else if ((typeof sql != "string") && 
		(typeof sql != "undefined") && 
		(sql != null) &&
		(typeof sql.toString == "function"))
	{
		sql = sql.toString();
	}
	
	if (typeof sql == "string") 
	{
		sql = Jaxer.Util.String.trim(sql);
		if (sql == '')
		{
			e = new Exception("The 'sql' parameter must not be an empty string", logger);
		}
	}
	else
	{
		e = new Exception("The 'sql' parameter must be of type 'string' (not '" + typeof sql + "')", logger);
	}
	
	if (e)
	{
		e[DB.SQL_ERROR_CODE_PROPERTY] = -1;
		e[DB.SQL_ERROR_DESCRIPTION_PROPERTY] = e.message;
		throw e;
	}
	
	return sql;
}

/**
 * Inspects the caller's arguments "array" to determine whether it has been 
 * given prepared-statements parameters and if so whether they are already
 * array-like (versus not, in which case they'll need to be wrapped in an
 * Array).
 * 
 * @private
 * @alias Jaxer.DB.getParamsFromArgs
 * @param {Arguments} args
 * 		The arguments "array" of the caller (within a function, use: arguments)
 * @param {Number} paramsIndex
 * 		The index within args at which the params argument is expected to appear
 * 		when a params argument is present
 * @return {Array}
 * 		An array with two members: 
 * 		the first is an array of the params, which may be empty;
 * 		the second is an options object, which may be empty
 */
DB.getParamsFromArgs = function getParamsFromArgs(args, paramsIndex)
{
	var params, opts;
	
	var numArgs = args.length - paramsIndex;
	if (numArgs > 0) 
	{
		// First, if the last parameter is a non-Array object, it'll always be interpreted as the options
		var lastParam = args[args.length - 1];
		var lastParamIsArray, lastParamIsDate, firstParamIsArray; // it might be that the first param is the last param
		if (lastParam && (typeof lastParam == "object"))
		{
			lastParamIsArray = Util.isArray(lastParam);
			lastParamIsDate = Util.isDate(lastParam);
			if ((args.length - 1) == paramsIndex)
			{
				firstParamIsArray = lastParamIsArray;
			}
			if (!lastParamIsArray && !lastParamIsDate)
			{
				opts = lastParam;
				numArgs--;
			}
		}
	}
	
	// If there are still args, let's see if we're given an array vs. we need to turn them into an array
	if (numArgs > 0)
	{
		var firstParam = args[paramsIndex];
		if (firstParamIsArray == undefined) // we have not already calculated it
		{
			firstParamIsArray = Util.isArray(firstParam);
		}
		if (firstParamIsArray)
		{
			params = firstParam;
		}
		else
		{
			params = [];
			for (var iArg=paramsIndex; iArg<paramsIndex+numArgs; iArg++)
			{
				params.push(args[iArg]);
			}
		}
	}
	else
	{
		params = [];
	}
	
	opts = opts || {};
	
	return [params, opts];
}

frameworkGlobal.DB = Jaxer.DB = DB;

Log.trace("*** DB.js loaded");  // Only if Log itself is defined at this point of the includes

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/DB > ResultSet.js
 */
coreTraceMethods.TRACE('Loading fragment: ResultSet.js');
Jaxer.lastLoadedFragment = 'ResultSet.js';

(function(){

var log = Log.forModule("ResultSet"); // Only if Log itself is defined at this point of the includes

/**
 * @classDescription {Jaxer.DB.ResultSet} Contains the returned value of a SQL
 * query.
 */

/**
 * Returned value of a SQL query, containing the named rows and columns of the
 * result and to be used as the return value of execute(). 
 * The rowsAsArray array is similar to the rows array but each row in it
 * is an array itself: it consists of the cells in that row, in
 * the same order as the columns array. 
 * 
 * To see if there is any data, check whether hasData is true or whether
 * rows.length or rowsAsArrays.length exceed 0. To get a single result (the
 * first column of the first row) grab singleResult.
 * 
 * @example
 * If the third column is named "account" you can get to a given cell value
 * either through
 * resultSet.rows[10].account or through
 * resultSet.rowsAsArrays[10][2]
 * 
 * @constructor
 * @alias Jaxer.DB.ResultSet
 * @return {Jaxer.DB.ResultSet}
 * 		Returns an instance of ResultSet.
 */
var ResultSet = function ResultSet()
{
	/**
	 * The array of rows in the resultSet in the order retrieved from the database.
	 * Each row has properties corresponding to the column names in the returned data.
	 * @alias Jaxer.DB.ResultSet.prototype.rows
	 * @property {Array}
	 */
	this.rows = [];
	
	/**
	 * An alternate representation of the rows of the resultSet:
	 * each row is itself an array, containing the values (cells) in that row
	 * in the same order as the columns array.
	 * @alias Jaxer.DB.ResultSet.prototype.rowsAsArrays
	 * @property {Array}
	 */
	this.rowsAsArrays = [];
	
	/**
	 * An array of column names for all rows in this resultSet.
	 * TODO - Note that (depending on the DB "driver" implementation used)
	 * the columns array may be empty if there are no rows of data;
	 * this will be fixed in the future.
	 * @alias Jaxer.DB.ResultSet.prototype.columns
	 * @property {Array}
	 */
	this.columns = [];
	
	/**
	 * This contains the first value (cell) in the first row
	 * in the resultSet, if any, or else it contains null.
	 * (You can disambiguate DB nulls from no data by checking the
	 * hasData property or rows.length). This is convenient
	 * for queries (e.g. "SELECT COUNT(*) FROM mytable") that
	 * are known to return a single value.
	 * @alias Jaxer.DB.ResultSet.prototype.singleResult
	 * @property {Object}
	 */
	this.singleResult = null;
	
	/**
	 * True if this resultSet contains any data, false otherwise.
	 * @alias Jaxer.DB.ResultSet.prototype.hasData
	 * @property {Boolean}
	 */
	this.hasData = false;
	
	var currentRowIndex = 0;
	
	/**
	 * True if this resultSet's cursor is positioned on a valid row,
	 * which means you can access the row's data.
	 * @alias Jaxer.DB.ResultSet.prototype.isValidRow
	 * @return {Boolean}
	 * 		true if positioned on a valid row, false otherwise
	 */
	this.isValidRow = function isValidRow()
	{
		return currentRowIndex < this.rows.length;
	}
	
	/**
	 * Advances this resultSet's cursor to the next row of results.
	 * Use isValidRow() to determine if you've reached the end 
	 * of the rows.
	 * @alias Jaxer.DB.ResultSet.prototype.next
	 */
	this.next = function next()
	{
		currentRowIndex++;
	}
	
	/**
	 * Closes this resultSet and empties its internal data structures.
	 * This is optional.
	 * @alias Jaxer.DB.ResultSet.prototype.close
	 */
	this.close = function close()
	{
		this.rows = [];
		this.rowsAsArrays = [];
		this.columns = [];
		this.singleResult = null;
		this.hasData = false;
	}
	
	/**
	 * Returns the number of fields (columns) in this resultSet,
	 * the same as this.columns.length.
	 * @alias Jaxer.DB.ResultSet.prototype.fieldCount
	 * @return {Number}
	 * 		The number of fields (columns)
	 */
	this.fieldCount = function fieldCount()
	{
		return this.columns.length;
	}
	
	/**
	 * Returns the name of the column at the given (0-based) index,
	 * the same as this.columns[fieldIndex].
	 * Throws a Jaxer.Exception if fieldIndex is out of range.
	 * @alias Jaxer.DB.ResultSet.prototype.fieldName
	 * @param {Number} fieldIndex
	 * 		The 0-based index of the desired field (column),
	 * 		bounded by this.columns.length.
	 * @return {String}
	 * 		The name of the field (column)
	 */
	this.fieldName = function fieldName(fieldIndex)
	{
		if (fieldIndex < 0 || (fieldIndex >= this.columns.length))
		{
			throw new Exception("fieldIndex out of range: " + fieldIndex + " is not between 0 and " + this.columns.length);
		}
		return this.columns[fieldIndex];
	}

	/**
	 * For the current row pointed to by the cursor,
	 * returns the value of the field (column) at the given (0-based) index,
	 * the same as this.rowsAsArrays[currentRowIndex][fieldIndex]
	 * Throws a Jaxer.Exception if fieldIndex is out of range.
	 * @alias Jaxer.DB.ResultSet.prototype.field
	 * @param {Number} fieldIndex
	 * 		The 0-based index of the desired field (column),
	 * 		bounded by this.columns.length.
	 * @return {Object}
	 * 		The value of the field (column)
	 */
	this.field = function field(fieldIndex)
	{
		if (fieldIndex < 0 || (fieldIndex >= this.columns.length))
		{
			throw new Exception("fieldIndex out of range: " + fieldIndex + " is not between 0 and " + this.columns.length);
		}
		var row = this.rowsAsArrays[currentRowIndex];
		return row[fieldIndex];
	}

	/**
	 * For the current row pointed to by the cursor,
	 * returns the value of the field (column) at the given fieldName (column name),
	 * the same as this.rows[currentRowIndex][fieldName]
	 * Throws a Jaxer.Exception if fieldName is not the name of a field (column).
	 * @alias Jaxer.DB.ResultSet.prototype.fieldByName
	 * @param {String} fieldByName
	 * 		The name of the desired field (column), which should be an
	 * 		element of the Array this.columns.
	 * @return {Object}
	 * 		The value of the field (column)
	 */
	this.fieldByName = function fieldByName(fieldName)
	{
		var row = this.rows[currentRowIndex];
		if (!row.hasOwnProperty(fieldName))
		{
			throw new Exception("No such fieldName in row: '" + fieldName + "'");
		}
		return row[fieldName];
	}

};

/**
 * Adds a row, where its structure is assumed to be the same as
 * all the other rows.
 * 
 * @alias Jaxer.DB.ResultSet.prototype.addRow
 * @param {Object} row
 * 		The row to add 
 */
ResultSet.prototype.addRow = function addRow(row)
{
	this.rows.push(row);
	var values = this.columns.map(function(col) { return row[col]; });
	this.rowsAsArrays.push(values);
	if (!this.hasData) 
	{
		this.hasData = true;
		this.singleResult = row[this.columns[0]];
	}
};

/**
 * Returns the index of the column with the given name
 * 
 * @alias Jaxer.DB.ResultSet.prototype.indexOfColumn
 * @param {String} columnName
 * 		The textual name of the database column 
 * @return {Number}
 * 		The 0-based index in the columns array (and in each row in the rows
 * 		array)
 */
ResultSet.prototype.indexOfColumn = function indexOfColumn(columnName)
{
	return this.columns.indexOf(columnName);
};

/**
 * Returns an array of objects, one per row, that only have properties
 * corresponding to the given columns.
 * 
 * @alias Jaxer.DB.ResultSet.prototype.extractColumns
 * @param {Array} columns
 * 		The names of the columns that should be made available for each row.
 * @return {Array}
 * 		An array of simple objects, each with the requested properties.
 */
ResultSet.prototype.extractColumns = function extractColumns(columns)
{
	var result = [];
	if (columns == "*") columns = this.columns;
	for (var i=0; i<this.rows.length; i++)
	{
		var obj = {};
		for (var ip=0; ip<columns.length; ip++)
		{
			var column = columns[ip];
			obj[column] = this.rows[i][column];
		}
		result.push(obj);
	}
	return result;
};

/**
 * Returns a string representation of the resultset object
 * 
 * @alias Jaxer.DB.ResultSet.prototype.toString
 * @return {String}
 * 		A string representation of the resultset object
 */
ResultSet.prototype.toString = function toString()
{
	if (!this.hasData) return "(empty)";
	var columnSeparator = " | ";
	var lineSeparator = "\n";
	var lines = [];
	lines.push("Columns: " + this.columns.join(columnSeparator));
	for (var i=0; i<this.rowsAsArrays.length; i++)
	{
		lines.push("Row " + i + ": " + this.rowsAsArrays[i].join(columnSeparator));
	}
	return lines.join(lineSeparator);
};

/**
 * Returns a HTML table snippet containing the resultset items
 * 
 * @alias Jaxer.DB.ResultSet.prototype.toHTML
 * @param {Object} [tableAttributes]
 * 		An optional hashmap which will be turned into attribute-value pairs on the
 * 		table tag
 * @param {Object} [headingAttributes]
 * 		An optional hashmap which will be turned into attribute-value pairs on the
 * 		thead tag
 * @param {Object} [bodyAttributes]
 * 		An optional hashmap which will be turned into attribute-value pairs on the 
 * 		tbody tag
 * @return {String}
 * 		HTML table snippet containing the resultset items
 */
ResultSet.prototype.toHTML = function toHTML(tableAttributes, headingAttributes, bodyAttributes)
{
	var lines = [];
	lines.push("<table " + Util.DOM.hashToAttributesString(tableAttributes) + ">");
	lines.push("\t<thead " + Util.DOM.hashToAttributesString(headingAttributes) + ">");
	lines.push("\t\t<tr>");
	for (var i=0; i<this.columns.length; i++)
	{
		lines.push("\t\t\t<td>" + this.columns[i] + "</td>");
	}
	lines.push("\t\t</tr>");
	lines.push("\t</thead>");
	if (this.hasData)
	{
		lines.push("\t<tbody " + Util.DOM.hashToAttributesString(bodyAttributes) + ">");
		for (var i=0; i<this.rowsAsArrays.length; i++)
		{
			var values = this.rowsAsArrays[i];
			lines.push("\t\t<tr>");
			for (var j=0; j<values.length; j++)
			{
				lines.push("\t\t\t<td>" + values[j] + "</td>");
			}
			lines.push("\t\t</tr>");
		}
		lines.push("\t</tbody>");
	}
	lines.push("</table>");
	return lines.join("\n");
};

/**
 * This contains the data in the first row of the resultSet as an object,
 * or else it contains an empty object.
 * 
 * (You can disambiguate DB nulls from no data by checking the
 * hasData property or rows.length). This is convenient
 * for queries (e.g. "SELECT * FROM mytable where key = 'value'") that
 * are known to return a single value.
 *
 * @alias Jaxer.DB.ResultSet.prototype.singleRow
 * @property {Array}
 *         A javascript array containing the  column values of first row from the current resultset
 */
ResultSet.prototype.__defineGetter__('singleRow', function singleRow()
{
    return (this.rows.length>0) ? this.rows[0] : {} ;
//    return (this.rows.length>0) ? this.rowsAsArrays[0] : [] ;
});

/**
 * An alias of the Jaxer.DB.ResultSet.prototype.singleRow method
 *
 * @alias Jaxer.DB.ResultSet.prototype.firstRow
 * @see Jaxer.DB.ResultSet.prototype.singleRow
 * @property {Array}
 *         A javascript array containing the  column values of first row from the current resultset
 */
ResultSet.prototype.__defineGetter__('firstRow', ResultSet.prototype.__lookupGetter__('singleRow'));

/**
 * This returns the data in the last row of the resultSet as an object,
 * or else it contains an empty object.
 * 
 * (You can disambiguate DB nulls from no data by checking the
 * hasData property or rows.length).
 *
 * @alias Jaxer.DB.ResultSet.prototype.finalRow
 * @property {Array}
 *         A javascript array containing the column values of last row from the current resultset
 */
ResultSet.prototype.__defineGetter__('finalRow', function finalRow()
{
    return (this.hasData) ? this.rows[this.rows.length - 1] : {} ;
//    return (this.hasData) ? this.rowsAsArrays[this.rows.length - 1] : [] ;
});

/**
 * This returns the data in each of the first columns of the resultSet as an array,
 * or else it contains an empty array.
 *
 * (You can disambiguate DB nulls from no data by checking the
 * hasData property or rows.length). This is convenient
 * for queries that are used to populate dropdowns.
 *
 * @alias Jaxer.DB.ResultSet.prototype.singleColumn
 * @property {Array}
 *         A javascript array containing each of the first column values from the current resultset
 */
ResultSet.prototype.__defineGetter__('singleColumn', function singleColumn()
{
    return this.columnsAsArray(0);
});

/**
 * This return the data in the provided columns of the resultSet as an array,
 * or else it contains null.
 *
 * @alias Jaxer.DB.ResultSet.prototype.columnsAsArray
 * @method
 * @param {Number|String}
 *         identifies the columns to return, either as an array index value,
 *         or a column label value, you can specify 1 or more columns to be returned
 * @return {Array}
 *         A javascript array of arrays containg each of the values of the requested column from the current resultset
 */
ResultSet.prototype.columnsAsArray = function columnsAsArray()
{
    var cols = Array.slice(arguments);
	
	if (cols == "*") 
	{
		return this.rowsAsArrays;
	}
	
    for (var col in cols)
    {
        if (typeof cols[col] != 'number')
        {
            cols[col] = this.columns.indexOf(cols[col]);
        }
    }

	var results = [];	
	for (var i=0; i<this.rowsAsArrays.length; i++)
	{
		var row = [];
		for (var col in cols)
		{
			row.push(this.rowsAsArrays[i][cols[col]]);
		}
		results.push(row);
	}
	
	// return flattened array for single column results
	return ( (results.length) > 1 && (results[0].length) > 1) ? results : results.reduce(function(a,b) {  return a.concat(b);}, []);

};

/**
 * This contains the requested columns from the first row of the resultSet as an array,
 * or else it contains an empty array.
 *
 * @alias Jaxer.DB.ResultSet.prototype.singleRowAsArray
 * @method
 * @param {Number|String}
 *         identifies the columns to return, either as an array index value,
 *         or a column label value, you can specify 1 or more columns to be returned
 * @return {Array}
 *         A javascript array the values of the requested columns from the first row of the current resultset
 */
ResultSet.prototype.singleRowAsArray = function singleRowAsArray()
{
    var cols = Array.slice(arguments);
    for (var col in cols)
    {
    	if (typeof cols[col] != 'number')
        {
            cols[col] = this.columns.indexOf(cols[col]);
        }
    }
    var rows = this.rowsAsArrays;

    return  (this.hasData) ? cols.map(function(col) { return rows[0][col] }) : [] ;
};

/**
 * An alias of the Jaxer.DB.ResultSet.prototype.singleRowAsArray method
 *
 * @alias Jaxer.DB.ResultSet.prototype.singleRowAsArray
 * @method
 * @see Jaxer.DB.ResultSet.prototype.singleRowAsArray
 */
ResultSet.prototype.firstRowAsArray = ResultSet.prototype.singleRowAsArray;

/**
 * This contains the requested columns from the last row of the resultSet as an array,
 * or else it contains an empty array.
 *
 * @alias Jaxer.DB.ResultSet.prototype.finalRowAsArray
 * @method
 * @param {Number|String}
 *         identifies the columns to return, either as an array index value,
 *         or a column label value, you can specify 1 or more columns to be returned
 * @return {Array}
 *         A javascript array the values of the requested columns from the last row of the current resultset
 */
ResultSet.prototype.finalRowAsArray = function finalRowAsArray()
{
    var cols = Array.slice(arguments);
    for (var col in cols)
    {
        if (typeof cols[col] != 'number')
        {
            cols[col] = this.columns.indexOf(cols[col]);
        }
    }
    var rows = this.rowsAsArrays;

    return cols.map(function(col) /*! +this !*/ 
	{
        return (this.hasData0) ? rows[rows.length - 1][col] : [] ;
    });
};

/**
 * An alias of the Jaxer.DB.ResultSet.prototype.finalRowAsArray method
 *
 * @alias Jaxer.DB.ResultSet.prototype.lastRowAsArray
 * @method
 * @see Jaxer.DB.ResultSet.prototype.finalRowAsArray
 */
ResultSet.prototype.lastRowAsArray = ResultSet.prototype.finalRowAsArray;

/**
 * indexOf compares the value of the requested column in each row of the results using strict
 * equality (the same method used by the ===, or triple-equals, operator). it returns either the
 * index of the first matched item or -1 if no items match
 *
 * @alias Jaxer.DB.ResultSet.prototype.indexOf
 * @method
 * @param {Number|String} column
 * @param {Object} value
 * @param {Number} fromIndex
 * @return {Number}
 */
ResultSet.prototype.indexOf = function indexOf(column, value, fromIndex)
{
	if (typeof column != 'number')
    {
        column = this.columns.indexOf(column);
    }
    return this.columnsAsArray(column).indexOf(value, fromIndex || 0);
};

/**
 * indexOf compares the value of the requested column in each row of the results using strict
 * equality (the same method used by the ===, or triple-equals, operator). it returns either the
 * index of the last matched item or -1 if no items match
 *
 * @alias Jaxer.DB.ResultSet.prototype.lastIndexOf
 * @method
 * @param {Number|String} column
 * @param {Object} value
 * @param {Number} fromIndex
 * @return {Number}
 */
ResultSet.prototype.lastIndexOf = function lastIndexOf(column, value, fromIndex)
{
	if (typeof column != 'number')
    {
        column = this.columns.lastIndexOf(column);
    }
    return this.columnsAsArray(column).lastIndexOf(value, fromIndex || Number.MAX_VALUE );
};

/**
 * map runs a function on every row in the resultset and returns the results in an array.
 * The row and index of the current item are passed as parameters to the current function.
 *
 * @alias Jaxer.DB.ResultSet.prototype.map
 * @method
 * @param {Function} fn
 * @return {Array}
 */
ResultSet.prototype.map = function map(fn)
{
    return this.rowsAsArrays.map(function(row, index) 
	{
        return fn(row, index);
    }, this);
};

/**
 * reduce runs a function on every item in the resultset and collects the results returned.
 * reduce executes the callback function once for each element present in the resultset,
 * receiving four arguments:
 * - the initial value (or value from the previous callback call),
 * - the value of the current row of the resultset,
 * - the current index,
 * - an array representing the resultset over which iteration is occurring.
 *
 * @alias Jaxer.DB.ResultSet.prototype.reduce
 * @method
 * @param {Function} fn
 * @param {Object} initialValue
 * @return {Object}
 */
ResultSet.prototype.reduce = function reduce(fn, initialValue)
{
    return this.rowsAsArrays.reduce(function(previousValue, currentValue, index, array) 
	{
        return fn(previousValue, currentValue, index, array)
    }, initialValue || null);
};

/**
 * reduceRight runs a function on every item in the resultset and collects the results
 * returned, but in reverse order starting with the last element of the recordset.
 *
 * reduceRight executes the callback function once for each element present in the resultset,
 * excluding holes in the array, receiving four arguments:
 * - the initial value (or value from the previous callback call),
 * - the value of the current row of the resultset,
 * - the current index,
 * - an array representing the resultset over which iteration is occurring.
 *
 * @alias Jaxer.DB.ResultSet.prototype.reduceRight
 * @method
 * @param {Function} fn
 * @param {Object} initialValue
 * @return {Object}
 */
ResultSet.prototype.reduceRight = function reduce(fn, initialValue)
{
    return this.rowsAsArrays.reduceRight(function(previousValue, currentValue, index, array) 
	{
        return fn(previousValue, currentValue, index, array)
    }, initialValue || null);
};

/**
 * forEach executes the provided function (callback) once for each element present in the recordset.
 *
 * The callback is invoked with three arguments:
 * - the value of the current row in the resultset,
 * - the index of the current row in the resultset,
 * - an array representing the resultset being traversed.
 *
 * @alias Jaxer.DB.ResultSet.prototype.forEach
 * @method
 * @param {Function} fn
 *         Function to execute against each row of the recordset
 */
ResultSet.prototype.forEach = function forEach(fn)
{
    this.rowsAsArrays.forEach(function(element, index, array) 
	{
        return fn(element, index, array);
    }, this);
};

/**
 * filter returns a new array with all of the elements of this array for which the 
 * provided filtering function returns true.
 * 
 * The function is invoked with three arguments:
 * - the value of the current row in the resultset,
 * - the index of the current row in the resultset,
 * - an array representing the resultset being traversed.
 * 
 * @alias Jaxer.DB.ResultSet.prototype.filter
 * @method
 * @param {Function} fn
 *         Function to test each row of the recordset
 * @return {Array}
 */
ResultSet.prototype.filter = function filter(fn) 
{
    return this.rowsAsArrays.filter(function(element, index, array) 
	{
        return fn(element, index, array);
    }, this);
};

/**
 * every runs a function against each row in the recordset while that function is returning true.
 * returns true if the function returns true for every row it could visit
 * 
 * The function is invoked with three arguments:
 * - the value of the current row in the resultset,
 * - the index of the current row in the resultset,
 * - an array representing the resultset being traversed.
 * 
 * @alias Jaxer.DB.ResultSet.prototype.every
 * @method
 * @param {Function} fn
 * @return {Boolean}
 */
ResultSet.prototype.every = function every(fn) 
{
    return this.rowsAsArrays.every(function(element, index, array) 
	{
        return fn(element, index, array);
    }, this);
};

/**
 * some runs a function against each row in the recordset while that function until returning true.
 *
 * returns true if the function returns true for at least one row it could visit
 *
 * The function is invoked with three arguments:
 * - the value of the current row in the resultset,
 * - the index of the current row in the resultset,
 * - an array representing the resultset being traversed.
 * 
 * @alias Jaxer.DB.ResultSet.prototype.some
 * @method
 * @param {Function} fn
 * @return {Boolean}
 */
ResultSet.prototype.some = function some(fn)
{
    return this.rowsAsArrays.some(function(element, index, array) 
	{
        return fn(element, index, array);
    }, this);
};

/**
 * split runs a function against each row in the recordset.
 *
 * returns A two element array containing the recorset items for
 * which the function returned true as the first element and the
 * items which returned false as the 2nd element.
 *
 * The function is invoked with three arguments:
 * - the value of the current row in the resultset,
 * - the index of the current row in the resultset,
 * - an array representing the resultset being traversed.

 * @alias Jaxer.DB.ResultSet.prototype.split
 * @method
 * @param {Function} fn
 * @return {Array[]}
 */
ResultSet.prototype.split = function split(fn)
{
    var isTrue = this.rowsAsArrays.filter(function(element, index, array) 
	{
        return fn(element, index, array);
    }, this);
    var isFalse = this.rowsAsArrays.filter(function(element, index, array) 
	{
        return !fn(element, index, array);
    }, this);
	
    return [isTrue, isFalse];
};

DB.ResultSet = ResultSet;

Log.trace("*** ResultSet.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/DB > DB_MySQL.js
 */
coreTraceMethods.TRACE('Loading fragment: DB_MySQL.js');
Jaxer.lastLoadedFragment = 'DB_MySQL.js';

(function() {

var log = Log.forModule("DB.MySQL");

/**
 * @namespace {Jaxer.DB.MySQL} Namespace that holds the MySQL implementation of
 * the Jaxer DB API.
 */

var MySQL = {};

var MYSQL50_CLASS_ID		= "@aptana.com/jxMySQL50;1"
var MYSQL50_INTERFACE       = Components.interfaces.jxIMySQL50;

var VALUE_TYPE_NULL		= "null"; 		// Null data type.
var VALUE_TYPE_NUMBER	= "double"; 	// Used for MySQL integer, floating point, etc. data types.
var VALUE_TYPE_DATETIME	= "datetime"; 	// Datetime data type.
var VALUE_TYPE_DATE		= "date"; 		// Date data type.
var VALUE_TYPE_TIME		= "time"; 		// Time data type.
var VALUE_TYPE_STRING	= "string"; 	// String data type.
var VALUE_TYPE_TEXT		= "text"; 		// Text (CLOB) data type.
var VALUE_TYPE_BLOB		= "blob"; 		// Blob data type.

var BLOB_FLAG = 63; // A way to distinguish binary-lobs (BLOBs) from character-lobs (TEXT) -- see http://dev.mysql.com/doc/refman/5.0/en/c-api-datatypes.html

var RS_HAS_ERROR 	= 0; 	// Not used -- errors are thrown instead
var RS_HAS_RECORDS 	= 1;	// Can call fetch() on it to get the records
var RS_HAS_ROWCOUNT = 2; 	// Can only get the rowcount (e.g. number of rows INSERTed)
var RS_IS_NULL 		= 3;	// Signals the end of a multiple-result-set interaction

var CR_UNKNOWN_ERROR = 2000; // See http://dev.mysql.com/doc/refman/5.0/en/error-messages-client.html

// The following are used to fill in the date portions of a JS Date object 
// being created from a MySQL time-type column
MySQL.TIME_COLUMN_YEAR	= 1970;
MySQL.TIME_COLUMN_MONTH	= 0; // January
MySQL.TIME_COLUMN_DAY	= 1;

MySQL.IMPLEMENTATION = "MySQL";

/**
 * Validate the provided connection parameters
 * 
 * @alias Jaxer.DB.MySQL.validateConnectionParameters
 * @param {Object} connectionParams
 * 		A hashmap of required parameters to connect to the database. Required
 * 		properties are HOST (hostname of the server), USER (username for
 * 		authentication), PASS (password for authentication), NAME (database
 * 		name)
 */
MySQL.validateConnectionParameters = function validateConnectionParameters(connectionParams)
{
	var errors = [];
	['HOST', 'USER', 'PASS', 'NAME'].forEach(function(propName)
	{
		if (!connectionParams.hasOwnProperty(propName))
		{
			errors.push("Missing '" + propName + "' property");
		}
	});
	if (errors.length > 0) 
	{
		if (log.getLevel() == Log.TRACE) log.trace('Connection parameters incomplete: ' + errors.join("; ") + " params: "+ uneval(connectionParams));
		throw new Exception("Invalid database connection parameters provided: " + errors.join("; "), log);
	} 
	else
	{
		if (log.getLevel() == Log.TRACE) log.trace('Connection parameters are all present (OK):' + uneval(connectionParams) )
		return; // no action if OK.
	}
}

/**
 * Creates a new database named according to connectionParams.NAME, 
 * if one does not already exist.
 * 
 * @alias Jaxer.DB.MySQL.createDB
 * @param {Object} connectionParams 
 * 		A hashmap of required parameters to connect to the database. Required
 * 		properties are HOST (hostname of the server), USER (username for
 * 		authentication), PASS (password for authentication), NAME (database
 * 		name), PORT (connection port, default value is "3306"), and
 * 		CLOSE_AFTER_EXECUTE (whether to close the connection after each call to
 * 		execute, default is open).
 *  @return {Jaxer.DB.MySQL.Connection}
 *  	Returns and instance of Connection.
 */
MySQL.createDB = function createDB(connectionParams)
{
	var dbName = connectionParams.NAME;
	var conn, sql;
	
	var noNameConnectionParams = {};
	for (var p in connectionParams)
	{
		noNameConnectionParams[p] = connectionParams[p];
	}
	noNameConnectionParams.NAME = '';
	
	conn = new MySQL.Connection(noNameConnectionParams);

	try
	{
		sql = "CREATE DATABASE IF NOT EXISTS `" + dbName + "`";
		conn.open();
		conn.execute(sql);
		conn.close();
		return new MySQL.Connection(connectionParams);
	}
	catch (e)
	{
		if (conn) conn.close();
		throw e;
	}
}

/**
 * @classDescription {Jaxer.DB.MySQL.Connection} Creates a new connection to the
 * given databaseName (file).
 */

/**
 * Creates a new connection to the given databaseName. The resulting connection object 
 * is the only way to interact with the database.
 * 
 * @alias Jaxer.DB.MySQL.Connection
 * @constructor
 * @param {Object} connectionParams 
 * 		A hashmap of parameters for connecting to the database. Required
 * 		properties are:
 * 		<ul>
 * 			<li>HOST (hostname of the server), </li>
 * 			<li>USER (username for authentication), </li>
 * 			<li>PASS (password for authentication, can be the empty string), and</li>
 * 			<li>NAME (database name, can be the empty string).</li>
 *		</ul>
 * 		Optional parameters are:
 * 		<ul>
 * 			<li>PORT (connection port, default value is 3306),</li>
 * 			<li>SOCKET (absolute path to socket file, default value is null),</li>
 * 			<li>AUTORECONNECT (whether to autoreconnect the connection is the MySQL server drops the connection, default is true), and</li>
 * 			<li>CLOSE_AFTER_EXECUTE (whether to close the connection after each call to execute, default is false), and</li>
 * 			<li>CLOSE_AFTER_REQUEST (whether to close the connection after each request, default is true).</li>
 *		</ul>
 *  @return {Jaxer.DB.MySQL.Connection}
 *  	Returns an instance of Connection.
 */
MySQL.Connection = function Connection(connectionParams)
{
	MySQL.validateConnectionParameters(connectionParams);

	this.serverName = connectionParams.HOST;
	this.userName = connectionParams.USER;
	this.password = connectionParams.PASS;
	this.databaseName = connectionParams.NAME;
	this.socket = connectionParams.SOCKET || null;
	this.port = connectionParams.PORT || 3306;
	this.opt = (1<<16|1<<17); // Enables support for multiple statements and stored procedures
	this.isOpen = false;
	this.conn = Components.classes[MYSQL50_CLASS_ID].createInstance(MYSQL50_INTERFACE);
	
	// force autoreconnect
	this.conn.optionBool(this.conn.OPT_RECONNECT, true);
	
	this.autoReconnect     = (typeof connectionParams.AUTORECONNECT == 'boolean') ? connectionParams.AUTORECONNECT : true;
	this.closeAfterExecute = (typeof connectionParams.CLOSE_AFTER_EXECUTE == 'boolean') ? connectionParams.CLOSE_AFTER_EXECUTE : false;
	this.closeAfterRequest = (typeof connectionParams.CLOSE_AFTER_REQUEST == 'boolean') ? connectionParams.CLOSE_AFTER_REQUEST : true;
};

/**
 * Is the connection currently open? Recall that even if the answer is no
 * the connection would automatically be opened when needed.
 * 
 * @alias Jaxer.DB.MySQL.Connection.prototype.isOpen
 * @property {Boolean}
 */

/**
 * Returns the string identifying the database implementation of this connection.
 * You can compare this e.g. to Jaxer.DB.SQLite.IMPLEMENTATION or
 * Jaxer.DB.MySQL.IMPLEMENTATION
 * 
 * @alias Jaxer.DB.MySQL.Connection.prototype.implementation
 * @property {String}
 */
MySQL.Connection.prototype.__defineGetter__('implementation', function getImplementation()
{
	return MySQL.IMPLEMENTATION;
});

/**
 * Returns the string identifying the version of the database to which you are connected.
 * 
 * @alias Jaxer.DB.MySQL.Connection.prototype.version
 * @property {String}
 */
MySQL.Connection.prototype.__defineGetter__('version', function getVersion()
{
	return this.execute("SELECT version()").singleResult;
});

/**
 * Opens the connection so queries can be executed. This is optional, since if
 * the connection is not open when it's asked to execute some SQL, it will open
 * the connection automatically. Also closing the connection is optional.
 * 
 * @alias Jaxer.DB.MySQL.Connection.prototype.open
 */
MySQL.Connection.prototype.open = function open()
{
	if (this.isOpen) return;
	if (log.getLevel() == Log.TRACE) 
	{
		var that = this;
		log.trace("Opening database: " + this.databaseName + " with connection parameters: " + 
			['serverName', 'userName', 'password', 'databaseName', 'port', 'socket', 'opt'].map(function(prop)
				{
					return prop + ' = ' + that[prop];
				}).join('; '));
	}
	var errorCode = null, errorMessage = null;
	
	try 
	{
		// force autoreconnect
		if (this.autoReconnect)
		{ 
			this.conn.optionString(this.conn.OPT_RECONNECT, "1");
		}

		this.conn.connect(this.serverName, this.userName, this.password, this.databaseName, this.port, this.socket, this.opt);
		try 
		{
			this.conn.autocommit(1);
		} 
		catch (e) 
		{
			errorCode = this.conn.errno();
			errorString = this.conn.error();
		}
	} 
	catch (e) 
	{
		errorCode = CR_UNKNOWN_ERROR;
		errorString = "Unknown error occurred while attempting to connect to MySQL server: " + e;
	}
	
	if (errorCode != null)
	{
		var errorMessage = "MySQL error " + errorCode + " while opening connection to database; perhaps check your parameters and the availability of the MySQL server. Error message: " + errorString + ".";
		var err = new Exception(errorMessage, log);
		err[DB.SQL_ERROR_CODE_PROPERTY] = errorCode;
		err[DB.SQL_ERROR_DESCRIPTION_PROPERTY] = errorString;
		throw err;
	}
	
	this.isOpen = true;
	log.debug("Opened");
};

/**
 * Executes the given sql using the connection. If the SQL includes ?'s (question
 * marks) as parameter placeholders, the values of those parameters
 * should be passed in as extra arguments to this function, either
 * as individual arguments or as a single array.
 * If the last argument is a (non-Array) object, it is used to pass in options.
 * Currently two options are supported: dateHandler and useLocalTimezone.
 * If dateHandler is given, it should be a function that takes
 * the raw MySQL date/time/datetime string representation of a returned cell value,
 * and a string describing the declared type,
 * and returns the desired JavaScript representation.
 * If dateHandler is not given, set useLocalTimezone to true to store date/time values using the local timezone.
 * Otherwise, by default they are stored as UTC.
 * 
 * @example
 *		<pre>
 *			rs = conn.execute("SELECT * FROM myTable");
 * 			rs = conn.execute("SELECT * FROM myTable WHERE id=? AND zip=?", myId, myZip);
 * 			rs = conn.execute("SELECT * FROM myTable WHERE id=? AND zip=?", [myId, myZip]);
 * 		</pre>
 * @alias Jaxer.DB.MySQL.Connection.prototype.execute
 * @param {String} sql
 * 		The sql statement to be executed as a prepared statement
 * @return {Jaxer.DB.ResultSet, Number, Object[]}
 * 		The results of the query.
 * 		For a SELECT-type query, a Jaxer.DB.ResultSet is returned, with 0 or more rows.
 * 		For an INSERT/UPDATE/DELETE-type query, the number of rows affected is returned. 
 * 		If multiple queries were issued (or a stored procedure was executed) the result will be 
 * 		a corresponding array of Jaxer.DB.ResultSet or Number objects.
 */
MySQL.Connection.prototype.execute = function execute(sql)
{

	log.trace("Starting execute " + Array.slice(arguments));
	
	var result;
	
	sql = DB.sqlToString(sql, log);

	this.open(); // In case it hasn't been opened

	try
	{
		// determine what params we've been given, if any
		var params, options;
		[params, options] = DB.getParamsFromArgs(arguments, 1);
		
		var useStatement = params && params.length;
		log.trace((useStatement ? "Using a prepared statement" : "Not using a prepared statement") + " to process: " + sql);
		if (useStatement)
		{
			log.trace("Will use a prepared statement");
			result = executeWithStatement(this, sql, [params], options)[0];
		}
		else
		{
			result = executeWithoutStatement(this, sql, options);
		}
		
		if (result.constructor == DB.ResultSet) 
		{
			log.trace("Populated resultSet with " + result.rows.length + " rows of " + result.columns.length + " columns");
		}
		else if (result.constructor == Array)
		{
			log.trace("Populated " + result.length + " results");
		}
		
	}
	finally
	{
		try
		{
			if (this.closeAfterExecute) 
			{
				log.trace("Closing the connection");
				this.close();
			}
		}
		catch (e) // log but do not throw again
		{
			log.error("Error trying to close the statement: " + e);
		}
	}
	
	log.trace("Finished executing");
	return result;
	
};

/**
 * Prepares the given SQL query string on the current default database 
 * (as defined in configApps.js) and then iteratively executes it
 * over the given array of parameters.
 * 
 * @example
 *		<pre>
 * 			[rsA, rsB] = conn.mapExecute("SELECT * FROM myTable WHERE id=?", [idA, idB]);
 * 			[rsA, rsB] = conn.mapExecute("SELECT * FROM myTable WHERE id=? AND zip=?", [ [idA, zipA], [idB, zipB] ]);
 * 		</pre>
 * @alias Jaxer.DB.MySQL.Connection.prototype.mapExecute
 * @param {String} sql
 * 		The SQL to execute, using ?'s (question marks) as parameter placeholders
 * @param {Array} arrayOfParameters
 * 		An array of parameters to use for each execution. Each element of the array
 * 		may itself be a single value or an array of values (corresponding to
 * 		the ?'s in the SQL)
 * @param {Object} [options]
 * 		An optional hashmap of options. Currently three options are supported: flatten, dateHandler, and useLocalTimezone.
 * 		If flatten is true, the returned result will be a single ResultSet
 * 		with its rows being the concatenated rows of each query.
 *		If dateHandler is given, it should be a function that takes
 * 		the raw MySQL date/time/datetime string representation of a returned cell value,
 * 		and a string describing the declared type,
 * 		and returns the desired JavaScript representation.
 * 		If dateHandler is not given, set useLocalTimezone to true to store date/time values using the local timezone.
 * 		Otherwise, by default they are stored as UTC.
 * @return {Object[]}
 * 		A corresponding array of Jaxer.DB.ResultSets or Numbers for each query, 
 * 		or a combined Jaxer.DB.ResultSet or Number if the 'flatten' option is true.
 * 		For SELECT-type queries one or more Jaxer.DB.ResultSets are returned;
 * 		for INSERT/UPDATE/DELETE-type queries the number of affected rows is returned.
 * @see Jaxer.DB.ResultSet
 */
MySQL.Connection.prototype.mapExecute = function mapExecute(sql, arrayOfParams, options)
{

	log.trace("Starting execute");
	
	var result;
	
	sql = DB.sqlToString(sql, log);

	this.open(); // In case it hasn't been opened

	try
	{
		result = executeWithStatement(this, sql, arrayOfParams, options);
	}
	finally
	{
		try
		{
			if (this.closeAfterExecute) 
			{
				log.trace("Closing the connection");
				this.close();
			}
		}
		catch (e) // log but do not throw again
		{
			log.error("Error trying to close the connection: " + e);
		}
	}
	
	log.trace("Finished executing");
	return result;
	
}

function executeWithStatement(conn, sql, arrayOfParams, options)
{

	var stmt;
	var flatten = options && options.flatten;
	var results = flatten ? null : [];
	var result = null;
	try // will close (release) the statement even if there are any errors
	{

		// First prepare the statement
		try
		{
			stmt = conn.conn.prepare(sql);
		}
		catch (e)
		{
			var errorCode = conn.conn.errno();
			var errorString = conn.conn.error();
			var errorMessage = "MySQL error " + errorCode + " while preparing statement. Error message: " + errorString + ". SQL: " + sql;
			var err = new Exception(errorMessage, log);
			err[DB.SQL_ERROR_CODE_PROPERTY] = errorCode;
			err[DB.SQL_ERROR_DESCRIPTION_PROPERTY] = errorString;
			throw err;
		}
		if (!stmt)
		{
			throw new Exception("Could not prepare statement. SQL: " + sql, log);
		}
		
		arrayOfParams.forEach(function executeOneWithStatement(params)
		{
			params = DB.getParamsFromArgs([params], 0)[0];
			var stmtParams = stmt.paramCount();
			if (params.length != stmtParams)
			{
				throw new Exception("Prepared statement " + sql + " has " + stmtParams + " parameters while " + params.length + " parameter values were given", log);
			}
			
			result = bindAndExecute(stmt, sql, params, result, options);
			if (!flatten) 
			{
				results.push(result);
				result = null;
			}
		});
		
		if (flatten)
		{
			results = result;
		}
	
	}
	finally
	{
		if (stmt) 
		{
			log.trace("Closing statement");
			try 
			{
				stmt.close(); // Important to always do this to free up resource
			} 
			catch (e) // log but do not throw again
			{
				log.error("Error trying to close the statement: " + e);
			}
		}
	}

	return results;

}

// Get the params array ready for logging
function truncateArrayForDisplay(arr)
{
	var maxLen = 4;
	var maxMember = 4;
	var strBuf = [];
	var truncated;
	arr.forEach(function(param)
	{
		truncated = false;
		if (typeof param == 'string')
		{
			truncated = (param.length < maxMember);
			if (truncated) 
			{
				param = param.substr(0, maxMember) + '...';
			}
		}
		else if (
			param != null && 
			typeof param == 'object' && 
			param.constructor == param.__parent__.Array &&
			param.length > maxMember)
		{
			truncated = (param.length > maxMember);
			if (truncated) 
			{
				param = param.slice(0, maxMember);
				param.push('...')
			}
			param = '[' + param.join(',') + ']';
		}
		strBuf.push(String(param));
	});
	return '[' + strBuf.join(',') + ']';
}

// If you pass in a resultSet or a number, the results of this execution will be appended to it.
// If you pass in null, a new resultSet or number will be created.
// In either case, the resultSet or number is returned.
// We don't currently do anything in here with the options hashmap -- it's reserved for future use
function bindAndExecute(stmt, sql, params, result, options)
{
	
	// TODO: fix it such that even if there are no rows to return, the returned columns could be meaningful
	// First bind the parameters
	if (log.getLevel() == Log.TRACE) log.trace("Binding statement '" + sql + "' with params array: " + truncateArrayForDisplay(params));
	var boundAs = [];
	params.forEach(function(param, index)
	{
		switch (typeof param)
		{
			case "number":
				if (isFinite(param)) 
				{
					stmt.bindDoubleParameter(index, param);
					boundAs.push('double');
				}
				else 
				{
					log.warn("Parameter " + index + " is not a finite number - using NULL instead. SQL: " + sql, log);
					stmt.bindNullParameter(index);
					boundAs.push('null');
				}
				break;
			case "boolean":
				stmt.bindDoubleParameter(index, (param ? 1 : 0));
				boundAs.push('double');
				break;
			case "string":
				stmt.bindUTF8StringParameter(index, param);
				boundAs.push('utf8String')
				break;
			case "object": // can only be used for Blob (from integer array) or Date binding
				if (param == null) 
				{
					stmt.bindNullParameter(index);
					boundAs.push('null')
				}
				else if (Util.isDate(param)) 
				{
					var offset = (options && options.useLocalTimezone) ? param.getTimezoneOffset() * 60 : 0;
					stmt.bindDatetimeParameter(index, Math.round(param.getTime() / 1000) - offset); // seconds since midnight 1/1/1970.
					boundAs.push('datetime')
				}
				else if (Util.isArray(param)) 
				{
					stmt.bindBlobParameter(index, param, param.length);
					boundAs.push('blob');
				}
				else 
				{
					log.warn("Parameter " + index + " is not a Date or a (byte) Array - using NULL instead. SQL: " + sql, log);
					stmt.bindNullParameter(index);
					boundAs.push('null')
				}
				break;
			case "undefined":
				stmt.bindNullParameter(index);
				boundAs.push('null')
				break;
			default:
				log.warn("Parameter " + index + " is of an unsupported type (" + (typeof param) + " - using NULL instead. SQL: " + sql, log);
				stmt.bindNullParameter(index);
				boundAs.push('null')
				break;
		}
	});
	log.trace("Parameters were bound as: " + boundAs.join('; '));
	
	// Then execute the statement	
	log.trace("Executing prepared statement");
	try
	{
		stmt.execute();
	}
	catch (e)
	{
		var errorCode = stmt.errno();
		var errorString = stmt.error();
		var errorMessage = "MySQL error " + errorCode + " while executing prepared statement. Error message: " + errorString + ". SQL: " + sql;
		var err = new Exception(errorMessage, log);
		err[DB.SQL_ERROR_CODE_PROPERTY] = errorCode;
		err[DB.SQL_ERROR_DESCRIPTION_PROPERTY] = errorString;
		throw err;
	}
	
	// And finally extract any results
	var appendToResult = (result != null); // If you pass in null, a new resultSet will be created
	var rm = stmt.resultMetadata();
	
	switch (rm.type)
	{

		case RS_HAS_RECORDS:
		
			log.trace("Fetching prepared statement return values to populate resultSet");
			
			if (!appendToResult) result = new DB.ResultSet();
			
			var numCols = stmt.fieldCount();
			var colTypes = [];
			for (var iCol = 0; iCol < numCols; iCol++) 
			{
				if (!appendToResult) 
				{
					log.trace("Column " + iCol + ": " + stmt.getColumnName(iCol));
					result.columns[iCol] = stmt.getColumnName(iCol);
				}
				var declType = stmt.getColumnDecltype(iCol);
				if (declType == VALUE_TYPE_BLOB) // May have to adjust it for TEXT-type BLOB
				{
					var field = rm.fetchFieldDirect(iCol);
					if (field.charsetnr() != BLOB_FLAG)
					{
						declType = VALUE_TYPE_TEXT;
					}
				}
				colTypes[iCol] = 
				{
					type: declType
				};
			}
			
			while (stmt.fetch()) 
			{
				var row = {};
				var colName, value, retrievedAs;
				var retrievedTypes = [];
				for (var iCol = 0; iCol < numCols; iCol++) 
				{
					colName = result.columns[iCol];
					[value, retrievedAs] = getAsTypePrepared(stmt, iCol, colTypes[iCol], options);
					retrievedTypes.push(retrievedAs);
					row[colName] = value;
				}
				log.trace("Retrieved row with the following column types: " + retrievedTypes.join("; "));
				result.addRow(row);
			}
			
			break;
			
		case RS_HAS_ROWCOUNT:
		
			log.trace("Fetching prepared statement's number of affected rows to set (or add to) total");

			if (!appendToResult) result = 0;
			
			result += rm.rowCount();
			
			break;
		
	}
	
	return result;

}

function executeWithoutStatement(conn, sql, options)
{
	// TODO: fix it such that even if there are no rows to return, the returned columns could be meaningful
	log.trace("Executing non-prepared statement");
	
	// First execute the query
	try 
	{
		var rs = conn.conn.query(sql);
	} 
	catch (e) 
	{
		var errorCode = conn.conn.errno();
		var errorString = conn.conn.error();
		var errorMessage = "MySQL error " + errorCode + " while executing non-prepared statement. Error message: " + errorString + ". SQL: " + sql;
		var err = new Exception(errorMessage, log);
		err[DB.SQL_ERROR_CODE_PROPERTY] = errorCode;
		err[DB.SQL_ERROR_DESCRIPTION_PROPERTY] = errorString;
		throw err;
	}
	
	var results = [];
	try
	{
		while (rs.type != RS_IS_NULL)
		{
			switch (rs.type)
			{
				case RS_HAS_RECORDS:
					var resultSet = new DB.ResultSet();
					var colTypes = [];
					var numCols = rs.fieldCount();
					for (var iCol = 0; iCol < numCols; iCol++) 
					{
						var field = rs.fetchFieldDirect(iCol);
						log.trace("Column " + iCol + ": " + field.name());
						resultSet.columns[iCol] = field.name();
						var declType = field.typeName();
						if (declType == VALUE_TYPE_BLOB) // May have to adjust it for TEXT-type BLOB
						{
							if (field.charsetnr() != BLOB_FLAG)
							{
								declType = VALUE_TYPE_TEXT;
							}
						}
						colTypes[iCol] = 
						{
							type: declType
						};
					}
					log.trace("Fetching non-prepared-statement return values to populate resultSet");
					while (rs.fetchRow()) 
					{
						var row = {};
						var colName, value, retrievedAs;
						var retrievedTypes = [];
						for (var iCol = 0; iCol < numCols; iCol++) 
						{
							colName = resultSet.columns[iCol];
							[value, retrievedAs] = getAsTypeQuery(rs, iCol, colTypes[iCol], options);
							retrievedTypes.push(retrievedAs);
							row[colName] = value;
						}
						if (log.getLevel() == Log.TRACE) log.trace("Retrieved row with the following column types: " + retrievedTypes.join("; "));
						resultSet.addRow(row);
					}
					results.push(resultSet);
					break;
				case RS_HAS_ROWCOUNT:
					results.push(rs.rowCount());
					break;
			}
			try
			{
				rs = conn.conn.nextResult();
			}
			catch (e)
			{
				var errorCode = conn.conn.errno();
				var errorString = conn.conn.error();
				var errorMessage = "MySQL error " + errorCode + " while executing query #" + results.length + ". Error message: " + errorString + ". SQL: " + sql;
				var err = new Exception(errorMessage, log);
				err[DB.SQL_ERROR_CODE_PROPERTY] = errorCode;
				err[DB.SQL_ERROR_DESCRIPTION_PROPERTY] = errorString;
				throw err;
			}
		}
	}
	finally 
	{
		if (rs)
		{
			rs.close();
		}
	}
	
	switch (results.length)
	{
		case 0:
			return null;
		case 1:
			return results[0];
		default:
			return results;
	}

}

/**
 * Retrieves the specified value from the prepared statement (at its current
 * cursor location), casting to the given type.
 * 
 * @private
 * @param {Object} stmt
 * 		The statement object
 * @param {Object} iCol
 * 		The index of the column whose value is to be fetched
 * @param {Object} iType
 * 		The type object containing information on how to return this value
 * @param {Object} options
 * 		An optional hashmap of options. Currently two options are supported: dateHandler, and useLocalTimezone.
 *		If dateHandler is given, it should be a function that takes
 * 		the raw MySQL date/time/datetime string representation of a returned cell value,
 * 		and a string describing the declared type,
 * 		and returns the desired JavaScript representation.
 * 		If dateHandler is not given, set useLocalTimezone to true to store date/time values using the local timezone.
 * 		Otherwise, by default they are stored as UTC.
 * @return {Array}
 * 		The value as the requested type, and the description of what type was used to retrieve it
 */
function getAsTypePrepared(stmt, iCol, iType, options)
{
	var value, retrievedAs;
	if (stmt.getIsNull(iCol)) 
	{
		value = null;
		retrievedAs = 'null';
	}
	else 
	{
		var mysqlType = iType.type;
		pageDate = Jaxer.pageWindow ? Jaxer.pageWindow.Date : Date;
		switch (mysqlType)
		{
			case VALUE_TYPE_NULL:
				value = null;
				retrievedAs = 'null';
				break;
			case VALUE_TYPE_NUMBER:
				value = stmt.getDouble(iCol);
				retrievedAs = 'double';
				break;
			case VALUE_TYPE_DATETIME:
				if (options && (typeof options.dateHandler == "function")) 
				{
					value = options.dateHandler(stmt.getDatetimeString(iCol), mysqlType);
				}
				else 
				{
					var dtValues = stmt.getDatetimeString(iCol).split(/[\-\:\s]0?/); // getDatetimeString: "YYYY-MM-DD HH:MM:SS" where 12>=MM>=1, 31>=DD>=1, 23>=HH>=0, 59>=MM>=0, 59>=SS>=0
					value = (options && options.useLocalTimezone) ?
						new pageDate(         dtValues[0], parseInt(dtValues[1]) - 1, dtValues[2], dtValues[3], dtValues[4], dtValues[5], 0) :
						new pageDate(Date.UTC(dtValues[0], parseInt(dtValues[1]) - 1, dtValues[2], dtValues[3], dtValues[4], dtValues[5], 0));
				}
				retrievedAs = 'datetime';
				break;
			case VALUE_TYPE_DATE:
				if (options && (typeof options.dateHandler == "function")) 
				{
					value = options.dateHandler(stmt.getDateString(iCol), mysqlType);
				}
				else 
				{
					var dateValues = stmt.getDateString(iCol).split(/\-0?/); // getDateString: "YYYY-MM-DD" where 12>=MM>=1, 31>=DD>=1
					value = (options && options.useLocalTimezone) ?
						new pageDate(         dateValues[0], parseInt(dateValues[1]) - 1, dateValues[2], 0) :
						new pageDate(Date.UTC(dateValues[0], parseInt(dateValues[1]) - 1, dateValues[2], 0));
				}
				retrievedAs = 'date';
				break;
			case VALUE_TYPE_TIME:
				if (options && (typeof options.dateHandler == "function")) 
				{
					value = options.dateHandler(stmt.getTimeString(iCol), mysqlType);
				}
				else 
				{
					var timeValues = stmt.getTimeString(iCol).split(/\:0?/); // getTimeString: "HH:MM:SS" where 23>=HH>=0, 59>=MM>=0, 59>=SS>=0
					value = (options && options.useLocalTimezone) ?
						new pageDate(         MySQL.TIME_COLUMN_YEAR, MySQL.TIME_COLUMN_MONTH, MySQL.TIME_COLUMN_DAY, timeValues[0], timeValues[1], timeValues[2], 0) :
						new pageDate(Date.UTC(MySQL.TIME_COLUMN_YEAR, MySQL.TIME_COLUMN_MONTH, MySQL.TIME_COLUMN_DAY, timeValues[0], timeValues[1], timeValues[2], 0));
				}
				retrievedAs = 'time';
				break;
			case VALUE_TYPE_STRING:
				value = stmt.getUTF8String(iCol);
				retrievedAs = 'string';
				break;
			case VALUE_TYPE_TEXT:
				value = stmt.getUTF8Text(iCol);
				retrievedAs = 'text';
				break;
			case VALUE_TYPE_BLOB:
				var blobLengthWrapper = {};
				var blobValueWrapper = {};
				stmt.getBlob(iCol, blobLengthWrapper, blobValueWrapper);
				value = blobValueWrapper.value;
				retrievedAs = 'blob';
				break;
			default:
				throw new Exception("MySQL statement returned an unknown data type: " + mysqlType, log);
		}
	}
	return [value, retrievedAs];
}

/**
 * Retrieves the specified value from the MySQL resultset (at its current cursor
 * location), casting to the given type.
 * 
 * @private
 * @param {Object} rs
 * 		The MySQL resultset
 * @param {Object} iCol
 * 		The index of the column whose value is to be fetched
 * @param {Object} iType
 * 		The type object containing information on how to return this value
 * @param {Object} options
 * 		An optional hashmap of options. Currently two options are supported: dateHandler, and useLocalTimezone.
 *		If dateHandler is given, it should be a function that takes
 * 		the raw MySQL date/time/datetime string representation of a returned cell value,
 * 		and a string describing the declared type,
 * 		and returns the desired JavaScript representation.
 * 		If dateHandler is not given, set useLocalTimezone to true to store date/time values using the local timezone.
 * 		Otherwise, by default they are stored as UTC.
 * @return {Array}
 * 		The value as the requested type, and the description of what type was used to retrieve it
 */
function getAsTypeQuery(rs, iCol, iType, options)
{
	var value, retrievedAs;
	if (rs.getIsNull(iCol)) 
	{
		value = null;
		retrievedAs = 'null';
	}
	else 
	{
		var mysqlType = iType.type;
		pageDate = Jaxer.pageWindow ? Jaxer.pageWindow.Date : Date;
		switch (mysqlType)
		{
			case VALUE_TYPE_NULL:
				value = null;
				retrievedAs = 'null';
				break;
			case VALUE_TYPE_NUMBER:
				value = rs.getDouble(iCol);
				retrievedAs = 'double';
				break;
			case VALUE_TYPE_DATETIME:
				if (options && (typeof options.dateHandler == "function")) 
				{
					value = options.dateHandler(rs.getDatetimeString(iCol), mysqlType);
				}
				else 
				{
					var dtValues = rs.getDatetimeString(iCol).split(/[\-\:\s]0?/); // getDatetimeString: "YYYY-MM-DD HH:MM:SS" where 12>=MM>=1, 31>=DD>=1, 23>=HH>=0, 59>=MM>=0, 59>=SS>=0
					value = (options && options.useLocalTimezone) ?
						new pageDate(         dtValues[0], parseInt(dtValues[1]) - 1, dtValues[2], dtValues[3], dtValues[4], dtValues[5], 0) :
						new pageDate(Date.UTC(dtValues[0], parseInt(dtValues[1]) - 1, dtValues[2], dtValues[3], dtValues[4], dtValues[5], 0));
				}
				retrievedAs = 'datetime';
				break;
			case VALUE_TYPE_DATE:
				if (options && (typeof options.dateHandler == "function")) 
				{
					value = options.dateHandler(rs.getDateString(iCol), mysqlType);
				}
				else 
				{
					var dateValues = rs.getDateString(iCol).split(/\-0?/); // getDateString: "YYYY-MM-DD" where 12>=MM>=1, 31>=DD>=1
					value = (options && options.useLocalTimezone) ?
						new pageDate(         dateValues[0], parseInt(dateValues[1]) - 1, dateValues[2], 0) :
						new pageDate(Date.UTC(dateValues[0], parseInt(dateValues[1]) - 1, dateValues[2], 0));
				}
				retrievedAs = 'date';
				break;
			case VALUE_TYPE_TIME:
				if (options && (typeof options.dateHandler == "function")) 
				{
					value = options.dateHandler(rs.getTimeString(iCol), mysqlType);
				}
				else 
				{
					var timeValues = rs.getTimeString(iCol).split(/\:0?/); // getTimeString "HH:MM:SS" where 23>=HH>=0, 59>=MM>=0, 59>=SS>=0
					value = (options && options.useLocalTimezone) ?
						new pageDate(         MySQL.TIME_COLUMN_YEAR, MySQL.TIME_COLUMN_MONTH, MySQL.TIME_COLUMN_DAY, timeValues[0], timeValues[1], timeValues[2], 0) :
						new pageDate(Date.UTC(MySQL.TIME_COLUMN_YEAR, MySQL.TIME_COLUMN_MONTH, MySQL.TIME_COLUMN_DAY, timeValues[0], timeValues[1], timeValues[2], 0));
				}
				retrievedAs = 'time';
				break;
			case VALUE_TYPE_STRING:
				value = rs.getUTF8String(iCol);
				retrievedAs = 'string';
				break;
			case VALUE_TYPE_TEXT:
				value = rs.getUTF8Text(iCol);
				retrievedAs = 'text';
				break;
			case VALUE_TYPE_BLOB:
				var blobLengthWrapper = {};
				var blobValueWrapper = {};
				rs.getBlob(iCol, blobLengthWrapper, blobValueWrapper);
				value = blobValueWrapper.value;
				retrievedAs = 'blob';
				break;
			default:
				throw new Exception("MySQL query returned an unknown data type: " + mysqlType, log);
		}
	}
	return [value, retrievedAs];
}

/**
 * Closes the connection if it's open. This is optional, and only does something
 * if the connection is open.
 * 
 * @alias Jaxer.DB.MySQL.Connection.prototype.close
 */
MySQL.Connection.prototype.close = function close()
{
	if (this.isOpen)
	{
		log.trace("Closing connection to database " + this.databaseName);
		this.conn.close();
		this.isOpen = false;
	}
};

/**
 * Returns the unique ID used for an AUTO_INCREMENT column in the most recent successful
 * INSERT command on the current connection. 
 * If no successful INSERTs have ever occurred on this connection, 0 is returned. 
 * Note that unsuccessful INSERTs do not change this value.
 * This is the same as asking for the lastInsertId or lastInsertRowId properties.
 * See http://dev.mysql.com/doc/refman/5.0/en/getting-unique-id.html for more details.
 * 
 * @alias Jaxer.DB.MySQL.Connection.prototype.getLastInsertId
 * @return {Number}
 * 		The id, or 0
 */
MySQL.Connection.prototype.getLastInsertId = function getLastInsertId()
{
	if (this.conn && this.isOpen) 
	{
		return this.conn.insertID();
	}
	else
	{
		return 0;
	}
}

MySQL.Connection.prototype.getLastId = MySQL.Connection.prototype.getLastInsertId;

/**
 * Returns the unique ID used for an AUTO_INCREMENT column in the most recent successful
 * INSERT command on the current connection. 
 * If no successful INSERTs have ever occurred on this connection, 0 is returned. 
 * Note that unsuccessful INSERTs do not change this value.
 * This is a synonym for lastInsertId.
 * See http://dev.mysql.com/doc/refman/5.0/en/getting-unique-id.html for more details.
 * 
 * @alias Jaxer.DB.MySQL.Connection.prototype.lastInsertRowId
 * @property {Number}
 */
MySQL.Connection.prototype.__defineGetter__('lastInsertRowId', MySQL.Connection.prototype.getLastInsertId);

/**
 * Returns the unique ID used for an AUTO_INCREMENT column in the most recent successful
 * INSERT command on the current connection. 
 * If no successful INSERTs have ever occurred on this connection, 0 is returned. 
 * Note that unsuccessful INSERTs do not change this value.
 * This is a synonym for lastInsertRowId.
 * See http://dev.mysql.com/doc/refman/5.0/en/getting-unique-id.html for more details.
 * 
 * @alias Jaxer.DB.MySQL.Connection.prototype.lastInsertId
 * @property {Number}
 */
MySQL.Connection.prototype.__defineGetter__('lastInsertId', MySQL.Connection.prototype.getLastInsertId);

/**
 * Tests the connection by trying to connect and catching and returning any error 
 * encountered. If the connection is successful, returns a null.
 * 
 * @alias Jaxer.DB.MySQL.Connection.prototype.test
 * @param {Boolean} keepOpen
 * 		If true, the connection will be kept open (if the test was successful).
 * 		If false, the connection will be left in the same state as before the test:
 * 		if it was open before it will be kept open, otherwise it will be closed.
 * @return {Object}
 * 		If successful, returns null; if unsuccessful, returns the error.
 * 		Usually you can use the error's sqlErrorCode and sqlErrorDescription
 * 		to see what the error was (or just its toString() method).
 */
MySQL.Connection.prototype.test = function test(keepOpen)
{
	var wasOpen = this.isOpen;
	var error = null;
	try
	{
		this.open();
	}
	catch (e)
	{
		error = e;
	}
	if (!wasOpen && !keepOpen)
	{
		this.close();
	}
	return error;
}

DB.MySQL = MySQL;

Jaxer.Log.trace("*** DB_MySQL.js loaded");
	
})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/DB > DB_SQLite.js
 */
coreTraceMethods.TRACE('Loading fragment: DB_SQLite.js');
Jaxer.lastLoadedFragment = 'DB_SQLite.js';

(function() {

var log = Log.forModule("DB.SQLite");

/**
 * @namespace {Jaxer.DB.SQLite} Namespace that holds the SQLite implementation
 * of the Jaxer DB API.
 */

var SQLite = {};

var SQLITE_CLASS_ID		= "@mozilla.org/storage/service;1"
var SQLITE_INTERFACE	= Components.interfaces.mozIStorageService;

var VALUE_TYPE_NULL		= 0; 	// Null data type.
var VALUE_TYPE_INTEGER	= 1; 	// INTEGER data type.
var VALUE_TYPE_FLOAT	= 2; 	// FLOAT data type.
var VALUE_TYPE_TEXT		= 3; 	// TEXT data type.
var VALUE_TYPE_BLOB		= 4; 	// BLOB data type.

var SPECIAL_HANDLING_FLAG = "__!jaxerSpecialHandling!__";
var SPECIAL_HANDLING_FLAG_NUMBER = SPECIAL_HANDLING_FLAG + "(number)";
var SPECIAL_HANDLING_FLAG_NUMBER_LENGTH = SPECIAL_HANDLING_FLAG_NUMBER.length;

SQLite.IMPLEMENTATION = "SQLite";

/**
 * Validate the provided connection parameters
 * 
 * @alias Jaxer.DB.SQLite.validateConnectionParameters
 * @param {Object} connectionParams
 * 		A hashmap of parameters needed to connect to the database. The
 * 		properties required of connectionParams are:
 * 		PATH: the path to the file of the database
 */
SQLite.validateConnectionParameters = function validateConnectionParameters(connectionParams)
{
	var errors = [];
	['PATH'].forEach(function(propName)
	{
		if (!connectionParams.hasOwnProperty(propName))
		{
			errors.push("Missing '" + propName + "' property");
		}
	});
	if (errors.length > 0) 
	{
		if (log.getLevel() == Log.TRACE) log.trace('Connection parameters incomplete: ' + errors.join("; ") + " params: "+ uneval(connectionParams));
		throw new Exception("Invalid database connection parameters provided: " + errors.join("; "), log);
	} 
	else
	{
		if (log.getLevel() == Log.TRACE) log.trace('Connection parameters OK :'+ uneval(connectionParams) )
		return; // no action if OK.
	}
}


/**
 * Creates a new database file according to connectionParams.PATH
 * 
 * @alias Jaxer.DB.SQLite.createDB
 * @param {Object} connectionParams
 * 		A hashmap of parameters needed to connect to the database. The
 * 		properties required of connectionParams are:
 * 		PATH: the path to the file of the database
 *  @return {Jaxer.DB.MySQL.Connection}
 *  	Returns an instance of Connection. 
*/
SQLite.createDB = function createDB(connectionParams)
{
	var conn, sql;
	
	conn = new SQLite.Connection(connectionParams);
	log.debug("Creating/verifying connection to database file at " + conn.filepath)

	try
	{
		conn.open();
		conn.close();
		return new SQLite.Connection(connectionParams);
	}
	catch (e)
	{
		if (conn) conn.close();
		throw e;
 	}
}

/**
 * @classDescription {Jaxer.DB.SQLite.Connection} Creates a new connection to
 * the given databaseName (file).
 */

/**
 * Creates a new connection to the given database (file). If the given database does not
 * yet exist, it is created for you when you try to open it. The resulting connection 
 * object is the only way you interact with the database.
 * 
 * @constructor
 * @alias Jaxer.DB.SQLite.Connection
 * @param {Object} connectionParams 
 * 		A hashmap of parameters for connecting to the database. Required
 * 		properties are:
 * 		<ul>
 * 			<li>PATH (the path to the database file).</li>
 *		</ul>
 * 		Optional parameters are:
 * 		<ul>
 * 			<li>CLOSE_AFTER_EXECUTE (whether to close the connection after each call to execute, default is false), and</li>
 * 			<li>CLOSE_AFTER_REQUEST (whether to close the connection after each request, default is true).</li>
 *		</ul>
 *  @return {Jaxer.DB.SQLite.Connection}
 *  	Returns an instance of Connection.
 */
SQLite.Connection = function Connection(connectionParams)
{
	SQLite.validateConnectionParameters(connectionParams);

	this.filepath = Dir.resolve(connectionParams.PATH, System.executableFolder);
	this.file = new Jaxer.File(this.filepath);
	if (!this.file)
	{
		throw new Exception("Could not access database file at path: " + this.filepath);
	}
	this.iFile = this.file.nsIFile;
	this.service = Components.classes[SQLITE_CLASS_ID].getService(SQLITE_INTERFACE);
	this.conn = null;
	this.closeAfterExecute = (typeof connectionParams.CLOSE_AFTER_EXECUTE == 'boolean') ? connectionParams.CLOSE_AFTER_EXECUTE : false;
	this.closeAfterRequest = (typeof connectionParams.CLOSE_AFTER_REQUEST == 'boolean') ? connectionParams.CLOSE_AFTER_REQUEST : true;
	this.maxNumTries = connectionParams.MAX_NUM_TRIES || 100;
	this.millisBetweenTries = connectionParams.MILLIS_BETWEEN_TRIES || 37;
};

/**
 * Is the connection currently open? Recall that even if the answer is no
 * the connection would automatically be opened when needed.
 * 
 * @alias Jaxer.DB.SQLite.Connection.prototype.isOpen
 * @property {Boolean}
 */
SQLite.Connection.prototype.__defineGetter__('isOpen', function getIsOpen()
{
	return Boolean(this.conn && this.conn.connectionReady);
});

/**
 * Returns the string identifying the database implementation of this connection.
 * You can compare this e.g. to Jaxer.DB.SQLite.IMPLEMENTATION or
 * Jaxer.DB.MySQL.IMPLEMENTATION
 * 
 * @alias Jaxer.DB.SQLite.Connection.prototype.implementation
 * @property {String}
 */
SQLite.Connection.prototype.__defineGetter__('implementation', function getImplementation()
{
	return SQLite.IMPLEMENTATION;
});

/**
 * Returns the string identifying the version of the database to which you are connected.
 * 
 * @alias Jaxer.DB.SQLite.Connection.prototype.version
 * @property {String}
 */
SQLite.Connection.prototype.__defineGetter__('version', function getVersion()
{
	return this.execute("SELECT sqlite_version()").singleResult;
});

/**
 * Opens the connection so queries can be executed. This is optional, since if
 * the connection is not open when it's asked to execute some SQL, it will open
 * the connection automatically. Also closing the connection is optional.
 * 
 * @alias Jaxer.DB.SQLite.Connection.prototype.open
 */
SQLite.Connection.prototype.open = function open()
{
	if (!this.isOpen)
	{
		log.debug("Opening connection to database: " + this.filepath);
		var numTries = 0;
		var err = null;
		var timer = (new Date()).getTime();
		var errorCode = 0;
		var errorString = '';
		while (numTries < this.maxNumTries) 
		{
			try 
			{
				err = null;
				this.conn = this.service.openDatabase(this.iFile);
				break;
			} 
			catch (e) 
			{
				if (this.conn && this.conn.conectionReady) 
				{
					errorString = this.conn.lastErrorString;
					errorCode = this.conn.lastError;
				}
				else
				{
					if (!this.file.exists) 
					{
						errorString = "Database file not found at " + this.filepath;
						errorCode = -1;
					}
					else 
					{
						errorString = "Error initializing connection to database file " + this.filepath + ": " + e.message;
						errorCode = e.result;
					}
				}
				err = "Error opening database: " + errorString + "; \nmozStorage exception: " + e;
				if ((errorCode != 5) && (errorCode != 6) && (errorCode != Components.results.NS_ERROR_FILE_IS_LOCKED)) // not due to a locking issue -- so don't bother retrying
				{
					break; 
				}
				numTries++;
				Util.sleep(this.millisBetweenTries);
			}
		}
		var msgStats = 'Tried ' + (numTries + 1) + ' time(s) in ' + ((new Date()).getTime() - timer) + ' ms to open connection to SQLite database file ' + this.filepath;
		if (err)
		{
			log.debug(msgStats);
			err = new Exception(err);
			if (errorCode) err[DB.SQL_ERROR_CODE_PROPERTY] = errorCode;
			if (errorString) err[DB.SQL_ERROR_DESCRIPTION_PROPERTY] = errorString;
			throw err;
		}
		else
		{
			log.trace(msgStats)
		}
		log.debug("Opened");
	}
};

/**
 * Executes the given sql using the connection. If the SQL includes ?'s (question
 * marks) as parameter placeholders, the values of those parameters
 * should be passed in as extra arguments to this function, either
 * as individual arguments or as a single array.
 * If the last argument is a (non-Array) object, it is used to pass in options.
 * Currently two options are supported: dateHandler and useLocalTimezone.
 * If dateHandler is given, it should be a function that takes
 * the raw MySQL date/time/datetime string representation of a returned cell value,
 * and a string describing the declared type,
 * and returns the desired JavaScript representation.
 * If dateHandler is not given, set useLocalTimezone to true to store date/time values using the local timezone.
 * Otherwise, by default they are stored as UTC.
 * 
 * @example
 *		<pre>
 *			rs = conn.execute("SELECT * FROM myTable");
 * 			rs = conn.execute("SELECT * FROM myTable WHERE id=? AND zip=?", myId, myZip);
 * 			rs = conn.execute("SELECT * FROM myTable WHERE id=? AND zip=?", [myId, myZip]);
 * 		</pre>
 * @alias Jaxer.DB.SQLite.Connection.prototype.execute
 * @param {String} sql
 * 		The sql statement to be executed as a prepared statement
 * @return {Jaxer.DB.ResultSet, Number, Object[]}
 * 		The results of the query.
 * 		For a SELECT-type query, a Jaxer.DB.ResultSet is returned, with 0 or more rows.
 * 		For an INSERT/UPDATE/DELETE-type query, the number of rows affected is returned. 
 */
SQLite.Connection.prototype.execute = function execute(sql, params)
{
	log.trace("Starting execute");
	
	sql = massageSql(sql);
	
	this.open(); // In case it hasn't been opened
	try
	{
		// determine what params we've been given, if any
		var params, options;
		[params, options] = DB.getParamsFromArgs(arguments, 1);
		var result = executeWithStatement(this, sql, [params], options)[0];
		if (result.constructor == DB.ResultSet) 
		{
			log.trace("Populated resultSet with " + result.rows.length + " rows of " + result.columns.length + " columns");
		}
		else if (result.constructor == Array)
		{
			log.trace("Populated " + result.length + " results");
		}
	}
	finally
	{
		try
		{
			if (this.closeAfterExecute) 
			{
				log.trace("Closing the connection");
				this.close();
			}
		}
		catch (e) // log but do not throw again
		{
			log.error("Error trying to close the statement: " + e);
		}
	}
	
	log.trace("Finished executing");
	return result;
};

/**
 * Prepares the given SQL query string on the current default database 
 * (as defined in configApps.js) and then iteratively executes it
 * over the given array of parameters.
 * 
 * @example
 *		<pre>
 * 			[rsA, rsB] = conn.mapExecute("SELECT * FROM myTable WHERE id=?", [idA, idB]);
 * 			[rsA, rsB] = conn.mapExecute("SELECT * FROM myTable WHERE id=? AND zip=?", [ [idA, zipA], [idB, zipB] ]);
 * 		</pre>
 * @alias Jaxer.DB.SQLite.Connection.prototype.mapExecute
 * @param {String} sql
 * 		The SQL to execute, using ?'s (question marks) as parameter placeholders
 * @param {Array} arrayOfParameters
 * 		An array of parameters to use for each execution. Each element of the array
 * 		may itself be a single value or an array of values (corresponding to
 * 		the ?'s in the SQL)
 * @param {Object} [options]
 * 		An optional hashmap of options. Currently three options are supported: flatten, dateHandler, and useLocalTimezone.
 * 		If flatten is true, the returned result will be a single ResultSet
 * 		with its rows being the concatenated rows of each query.
 *		If dateHandler is given, it should be a function that takes
 * 		the raw MySQL date/time/datetime string representation of a returned cell value,
 * 		and a string describing the declared type,
 * 		and returns the desired JavaScript representation.
 * 		If dateHandler is not given, set useLocalTimezone to true to store date/time values using the local timezone.
 * 		Otherwise, by default they are stored as UTC.
 * @return {Object}
 * 		A corresponding array of Jaxer.DB.ResultSets or Numbers for each query, 
 * 		or a combined Jaxer.DB.ResultSet or Number if the 'flatten' option is true.
 * 		For SELECT-type queries one or more Jaxer.DB.ResultSets are returned;
 * 		for INSERT/UPDATE/DELETE-type queries the number of affected rows is returned.
 * @see Jaxer.DB.ResultSet
 */
SQLite.Connection.prototype.mapExecute = function mapExecute(sql, arrayOfParams, options)
{
	log.trace("Starting execute");
	var result;
	
	sql = massageSql(sql);

	this.open(); // In case it hasn't been opened
	var transactionBegun = false;
	try
	{
		if (!this.conn.transactionInProgress)
		{
			transactionBegun = true;
			this.conn.beginTransactionAs(this.conn.TRANSACTION_DEFERRED);
			log.trace("Beginning a new transaction");
		}
		result = executeWithStatement(this, sql, arrayOfParams, options);
	}
	finally
	{
		try
		{
			if (transactionBegun)
			{
				log.trace("Committing the transaction");
				this.conn.commitTransaction();
			}
			if (this.closeAfterExecute) 
			{
				log.trace("Closing the connection");
				this.close();
			}
		}
		catch (e) // log but do not throw again
		{
			log.error("Error trying to close the connection: " + e);
		}
	}
	
	log.trace("Finished executing");
	return result;
	
}

// Since SQLite uses a slightly different syntax for the following very specific and common case,
// rewrite the more common syntax to adhere to SQLite's syntax
function massageSql(sql)
{
	return DB.sqlToString(sql, log).replace(/INTEGER PRIMARY KEY AUTO_INCREMENT/gi, "INTEGER PRIMARY KEY AUTOINCREMENT");
}

function executeWithStatement(conn, sql, arrayOfParams, options)
{
	
	var stmt;
	var flatten = options && options.flatten;
	var results = flatten ? null : [];
	var result = null;
	try // will close (release) the statement even if there are any errors
	{

		// First prepare the statement
		try
		{
			stmt = conn.conn.createStatement(sql);
		}
		catch (e)
		{
			e = new Exception("Error preparing statement: [" + conn.conn.lastError + "] " + conn.conn.lastErrorString + "; \nSQL: " + sql + "; \nmozStorage exception: " + e, log);
			e[DB.SQL_ERROR_CODE_PROPERTY] = conn.conn.lastError;
			e[DB.SQL_ERROR_DESCRIPTION_PROPERTY] = conn.conn.lastErrorString;
			throw e;
		}
		if (!stmt)
		{
			throw new Exception("Could not prepare statement: " + sql, log);
		}
		
		arrayOfParams.forEach(function executeOneWithStatement(params)
		{
			params = DB.getParamsFromArgs([params], 0)[0];
			var stmtParams = stmt.parameterCount;
			if (params.length != stmtParams)
			{
				throw new Exception("Prepared statement " + sql + " has " + stmtParams + " parameters while " + params.length + " parameter values were given", log);
			}
			
			result = bindAndExecute(conn, stmt, sql, params, result, options);
			if (!flatten) 
			{
				results.push(result);
				result = null;
			}
			
			stmt.reset();
		});
		
		if (flatten)
		{
			results = result;
		}
	
	}
	finally
	{
		if (stmt) 
		{
			log.trace("Closing statement");
			try 
			{
				log.trace("Resetting and finalizing statement");
				stmt.reset(); // Important to always do this to prevent locks! http://developer.mozilla.org/en/docs/Storage#Resetting_a_statement
				stmt.finalize();
			} 
			catch (e) // log but do not throw again
			{
				log.error("Error trying to reset and finalize the statement: " + e);
			}
		}
	}

	return results;

}

// If you pass in a resultSet or number, the results of this execution will be appended to it.
// If you pass in null, a new resultSet or number will be created.
// In either case, the resultSet or number is returned.
// We don't currently do anything in here with the options hashmap -- it's reserved for future use
function bindAndExecute(conn, stmt, sql, params, result, options)
{

	// First bind the parameters
	if (params && params.length) // bind them
	{
		log.trace("Binding statement " + sql + "\nwith params: " + params);
		params.forEach(function(param, index)
		{
			switch (typeof param)
			{
				case "number":
					if (isFinite(param))
					{
						stmt.bindDoubleParameter(index, param);
					}
					else
					{
						stmt.bindStringParameter(index, SPECIAL_HANDLING_FLAG_NUMBER + param.toString());
					}
					break;
				case "boolean":
					stmt.bindInt32Parameter(index, (param ? 1 : 0));
					break;
				case "string":
					stmt.bindStringParameter(index, param);
					break;
				case "object":
					if (param == null)
					{
						stmt.bindNullParameter(index);
					}
					else if (Util.isDate(param))
					{
						var offset = (options && options.useLocalTimezone) ? param.getTimezoneOffset() * 60 * 1000 : 0;
						stmt.bindInt64Parameter(index, param.getTime() - offset); // milliseconds since midnight 1/1/1970.
					}
					else
					{
						log.warn("Parameter " + index + " is not a Date (the only parameter of JavaScript type 'object' that can be persisted) - using NULL instead. SQL: " + sql, log);
						stmt.bindNullParameter(index);
					}
					break;
				case "undefined":
					stmt.bindNullParameter(index);
					break;
				default:
					log.warn("Parameter " + index + " is of an unsupported type (" + (typeof param) + " - using NULL instead. SQL: " + sql, log);
					stmt.bindNullParameter(index);
					break;
			}
		});
	}
		
	// Now execute the statement and return any values as a resultset or number
	// TODO: fix it such that even if there are no rows, meaningful columns could be returned
	var appendToResult = (result != null); // If you pass in null, a new resultSet or number will be created
	var columnsSet = appendToResult;
	var iRow = 0;
	var execute = true;
	while (execute)
	{
		var numTries = 0;
		var err = null;
		var timer = (new Date()).getTime();
		// We'll try multiple times if we get an error because of the database or a table being locked
		var errorCode = 0;
		var errorString = '';
		while (numTries < conn.maxNumTries) 
		{
			try 
			{
				err = null;
				execute = stmt.executeStep();
				break;
			} 
			catch (e) 
			{
				errorString = conn.conn.lastErrorString;
				errorCode = conn.conn.lastError;
				err = "Error executing statement: [" + errorCode + "] " + errorString + "; \nSQL: " + sql + "; \nmozStorage exception: " + e;
				if ((errorCode != 5) && (errorCode != 6)) // not due to a locking issue -- so don't bother retrying
				{
					break; 
				}
				Util.sleep(conn.millisBetweenTries);
			}
			numTries++;
		}
		var msgStats = 'Tried ' + (numTries + 1) + ' time(s) in ' + ((new Date()).getTime() - timer) + ' ms to execute statement on SQLite database file ' + conn.filepath;
		if (err)
		{
			if (numTries > 0) log.warn(msgStats);
			err = new Exception(err);
			if (errorCode) err[DB.SQL_ERROR_CODE_PROPERTY] = errorCode;
			if (errorString) err[DB.SQL_ERROR_DESCRIPTION_PROPERTY] = errorString;
			throw err;
		}
		else
		{
			log.trace(msgStats)
		}
		
		var returnResultSet = (/^\W*SELECT\b/i).test(sql); // TODO: This will need to be more robust when stored procedures are supported
		
		if (returnResultSet) // There is resultSet to be had
		{
			if (!appendToResult) 
			{
				result = new DB.ResultSet();
				appendToResult = true;
			}
			if (execute) 
			{
				var numCols = stmt.columnCount;
				// The first time only, get the names of the columns in the returned value
				if (!columnsSet) 
				{
					log.trace("Populating resultSet");
					for (var iCol = 0; iCol < numCols; iCol++) 
					{
						log.trace("Column " + iCol + ": " + stmt.getColumnName(iCol));
						result.columns[iCol] = stmt.getColumnName(iCol);
					}
					columnsSet = true;
				}
				var row = {};
				for (var iCol = 0; iCol < numCols; iCol++) 
				{
					var colType = 
					{
						declared: stmt.getColumnDecltype(iCol),
						sqlite: stmt.getTypeOfIndex(iCol)
					};
					var colName = result.columns[iCol];
					var value = getAsType(stmt, iCol, colType, options);
					row[colName] = value;
				}
				result.addRow(row);
				iRow++;
			}
		}
		else // There's just the number f affected rows to return
		{
			if (!appendToResult) 
			{
				result = 0;
				appendToResult = true;
			}
			result += stmt.changedRowCount;
		}
	}
	
	return result;
	
}

/**
 * Retrieves the specified value from the prepared statement (at its current
 * cursor location), casting to the given type.
 * 
 * @private
 * @alias Jaxer.DB.SQLite.getAsType
 * @param {Object} stmt
 * 		The statement object
 * @param {Object} iCol
 * 		The index of the column whose value is to be fetched
 * @param {Object} iType
 * 		The type object containing information on how to return this value
 * @param {Object} options
 * 		An optional hashmap of options. Currently two options are supported: dateHandler, and useLocalTimezone.
 *		If dateHandler is given, it should be a function that takes
 * 		the raw MySQL date/time/datetime string representation of a returned cell value,
 * 		and a string describing the declared type,
 * 		and returns the desired JavaScript representation.
 * 		If dateHandler is not given, set useLocalTimezone to true to store date/time values using the local timezone.
 * 		Otherwise, by default they are stored as UTC.
 * @return {String}
 * 		The value as the requested type
 */
function getAsType(stmt, iCol, iType, options)
{
	if (stmt.getIsNull(iCol)) return null;
	var declaredType = iType.declared;
	var sqliteType = iType.sqlite;
	if (sqliteType == VALUE_TYPE_NULL) return null;
	var value;
	switch (sqliteType)
	{
		case VALUE_TYPE_INTEGER:
			value = stmt.getInt64(iCol);
			break;
		case VALUE_TYPE_FLOAT:
			value = stmt.getDouble(iCol);
			break;
		case VALUE_TYPE_TEXT:
			value = stmt.getString(iCol);
			break;
		case VALUE_TYPE_BLOB:
			value = stmt.getString(iCol); // TODO: revisit blobs
			break;
		default:
			throw new Exception("SQLite statement returned an unknown data type: " + sqliteType, log);
	}
	if (declaredType.match(/bool/i))
	{
		value = Boolean(value);
	}
	else if ((declaredType.match(/date/i) || declaredType.match(/time/i)) && (sqliteType == VALUE_TYPE_INTEGER))
	{
		var offset = (options && options.useLocalTimezone) ? param.getTimezoneOffset() * 60 * 1000 : 0;
		value = (options && (typeof options.dateHandler == "function")) ? options.dateHandler(value, declaredType) : new Date(value + offset);
	}
	else if ((sqliteType == VALUE_TYPE_TEXT) && (value.indexOf(SPECIAL_HANDLING_FLAG) == 0))
	{
		if (value.indexOf(SPECIAL_HANDLING_FLAG_NUMBER) == 0)
		{
			value = Number(value.substr(SPECIAL_HANDLING_FLAG_NUMBER_LENGTH));
		}
	}
	return value;
}

/**
 * Closes the connection if it's open. This is optional, and only does something
 * if the connection is open.
 * 
 * @alias Jaxer.DB.SQLite.Connection.prototype.close
 */
SQLite.Connection.prototype.close = function close()
{
	if (this.isOpen) 
	{
		log.trace("Closing the connection");
		this.conn.close();
		this.conn = null;
	}
}

/**
 * Returns the unique "rowid" of the most recent successful INSERT command
 * on the current connection. If the table has a column of type INTEGER PRIMARY KEY,
 * this is used as the rowid. If no successful INSERTs have ever occurred on this
 * connection, 0 is returned. Note that unsuccessful INSERTs do not change this value.
 * This is the same as asking for the lastInsertRowId or lastInsertId properties.
 * See http://www.sqlite.org/c3ref/last_insert_rowid.html for more details.
 * 
 * @alias Jaxer.DB.SQLite.Connection.prototype.getLastInsertRowId
 * @return {Number}
 * 		The rowid, or 0
 */
SQLite.Connection.prototype.getLastInsertRowId = function getLastInsertRowId()
{
	if (this.isOpen) 
	{
		return this.conn.lastInsertRowID;
	}
	else
	{
		return 0;
	}
}

SQLite.Connection.prototype.getLastId = SQLite.Connection.prototype.getLastInsertRowId;

/**
 * Returns the unique "rowid" of the most recent successful INSERT command
 * on the current connection. If the table has a column of type INTEGER PRIMARY KEY,
 * this is used as the rowid. If no successful INSERTs have ever occurred on this
 * connection, 0 is returned. Note that unsuccessful INSERTs do not change this value.
 * This is a synonym for lastInsertId.
 * See http://www.sqlite.org/c3ref/last_insert_rowid.html for more details.
 * 
 * @alias Jaxer.DB.SQLite.Connection.prototype.lastInsertRowId
 * @property {Number}
 */
SQLite.Connection.prototype.__defineGetter__('lastInsertRowId', SQLite.Connection.prototype.getLastInsertRowId);

/**
 * Returns the unique "rowid" of the most recent successful INSERT command
 * on the current connection. If the table has a column of type INTEGER PRIMARY KEY,
 * this is used as the rowid. If no successful INSERTs have ever occurred on this
 * connection, 0 is returned. Note that unsuccessful INSERTs do not change this value.
 * This is a synonym for lastInsertRowId.
 * See http://www.sqlite.org/c3ref/last_insert_rowid.html for more details.
 * 
 * @alias Jaxer.DB.SQLite.Connection.prototype.lastInsertId
 * @property {Number}
 */
SQLite.Connection.prototype.__defineGetter__('lastInsertId', SQLite.Connection.prototype.getLastInsertRowId);

/**
 * Tests the connection by trying to connect and catching and returning any error 
 * encountered. If the connection is successful, returns a null.
 * 
 * @alias Jaxer.DB.SQLite.Connection.prototype.test
 * @param {Boolean} keepOpen
 * 		If true, the connection will be kept open (if the test was successful).
 * 		If false, the connection will be left in the same state as before the test:
 * 		if it was open before it will be kept open, otherwise it will be closed.
 * @return {Object}
 * 		If successful, returns null; if unsuccessful, returns the error.
 * 		Usually you can use the error's sqlErrorCode and sqlErrorDescription
 * 		to see what the error was (or just its toString() method).
 */
SQLite.Connection.prototype.test = function test(keepOpen)
{
	var wasOpen = this.isOpen;
	var error = null;
	try
	{
		this.open();
	}
	catch (e)
	{
		error = e;
	}
	if (!wasOpen && !keepOpen)
	{
		this.close();
	}
	return error;
}

DB.SQLite = SQLite;

Jaxer.Log.trace("*** DB_SQLite.js loaded");
	
})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/System > System.js
 */
coreTraceMethods.TRACE('Loading fragment: System.js');
Jaxer.lastLoadedFragment = 'System.js';

(function()
{
   
/**
 * @namespace {Jaxer.System} Namespace object holding functions and members used
 * to access operating system resources and processes.
 */
var System = {};

var du = new Jaxer.DirUtils();
var fu = new Jaxer.FileUtils();

try
{
   /**
    * The path on disk of the current executable's folder
    * 
	* @alias Jaxer.System.executableFolder
 	* @property {String}
	*/
	System.executableFolder = du.current;
}
catch (e)
{
	coreTraceMethods.WARN("Could not set System.executableFolder: " + e);
	System.executableFolder = null;
}

try
{
   /**
    * The file://... URL of the current executable's folder
    * 
	* @alias Jaxer.System.executableUrl
 	* @property {String}
	*/
	System.executableUrl = fu.pathToURL(du.current);
}
catch (e)
{
	coreTraceMethods.WARN("Could not set System.executableUrl: " + e);
	System.executableUrl = null;
}

try
{
   /**
    * The path on disk of the current user's home folder
    * 
 	* @alias Jaxer.System.homeFolder
 	* @property {String}
	*/
	System.homeFolder = du.home;
}
catch (e)
{
	coreTraceMethods.WARN("Could not set System.homeFolder, this can be caused by an invalid HOME environement variable see Jaxer Known Limitations for more info. (http://www.aptana.com/view/jaxer_known_limitations): " + e);
	System.homeFolder = null;
}

try
{
	/**
 	* The path on disk of the current user's desktop folder
 	* 
	* @alias Jaxer.System.desktopFolder
	* @property {String}
 	*/
	System.desktopFolder = du.desktop;
}
catch (e)
{
	coreTraceMethods.WARN("Could not set System.desktopFolder: " + e);
	System.desktopFolder = null;
}
    

try
{
   /**
    * The path on disk of the system's temp folder
    * 
    * @alias Jaxer.System.tempFolder
    * @property {String}
    */
	System.tempFolder = du.temp;
}
catch (e)
{
	coreTraceMethods.WARN("Could not set System.tempFolder: " + e);
	System.tempFolder = null;
}

try
{
	/**
    * The filesystem separator character (either \ or /)
    * 
    * @alias Jaxer.System.separator
    * @property {String}
    * @return {String}
    * 		fileSystem path separator
    */
	System.separator = (System.executableFolder.indexOf('\\') != -1) ? '\\': '/';
}
catch (e)
{
	coreTraceMethods.WARN("Could not set System.separator: " + e);
	System.separator = null;
}

/**
 * Ask the operating system to attempt to open the file. This simulates "double clicking" the file on your platform. 
 * This routine only works on platforms which support this functionality. This is non-blocking and script execution will
 * continue.
 * 
 * @alias Jaxer.System.launch
 * @method
 * @param {String} path 
 * 		A String containing the path to the file or a Jaxer.File object referencing the filesystem object
 */
System.launch = function launch(path)
{
	if (Jaxer.File.exists(path)) {
	    var cmd = new Jaxer.File(path)._nsIFile; // get the internal XPCOM nsIFile wrapper 
	    cmd.launch();
	}
};

/**
 * A string identifying the current operating system
 * @alias Jaxer.System.OS
 * @property {String}
 */
System.OS = Jaxer['private'].OS;

frameworkGlobal.System = Jaxer.System = System;

Log.trace("*** System.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/System > Process.js
 */
coreTraceMethods.TRACE('Loading fragment: Process.js');
Jaxer.lastLoadedFragment = 'Process.js';

(function(){

var log = Log.forModule("Process");

var PROCESS_CLASS_ID = "@aptana.com/utils/jxProcess;1"
var PROCESS_INTERFACE = Components.interfaces.jxIProcess;

/**
 * @classDescription {Jaxer.Process} 
 * 		Used to execute operating system processes
 */

/**
 * The constructor for an object that wraps an operating system process. This also provides
 * static functions for more easily executing operating system processes.
 * 
 * @constructor
 * @alias Jaxer.Process
 * @param {String} [path]
 * 		The absolute path to the executable file to execute. This must be specified 
 * 		before execution begins.
 * @param {Boolean} [async]
 * 		By default, the process executes synchronously: it blocks until complete.
 * 		If async is true, it will execute asynchronously, not blocking before completion.
 * 		This can be specified at any time until execution begins.
 * @return {Jaxer.Process}
 * 		The wrapper around the operating system process
 */
function Process(path, async)
{
	/**
	 * The absolute path to the executable file to execute
	 * @alias Jaxer.Process.prototype.path
	 * @property {String}
	 */
	this.path = path;

	/**
	 * If true, the process will be executed asynchronously (without blocking)
	 * @alias Jaxer.Process.prototype.async
	 * @property {Boolean}
	 */
	this.async = async;

	/**
	 * The array of arguments to this process.
	 * @alias Jaxer.Process.prototype.args
	 * @property {Array}
	 */
	this.args = null;

	/**
	 * The internal process handle
	 * @advanced
	 * @alias Jaxer.Process.prototype._proc
	 * @property {Object}
	 */
	this._proc = Components.classes[PROCESS_CLASS_ID].createInstance(PROCESS_INTERFACE);

	/**
	 * How to handle the standard input stream (STDIN) to the process. 
	 * If this is a string, it is written to STDIN as a character stream;
	 * if this is an array, it is written to STDIN as a binary (byte array) stream;
	 * otherwise no writing to STDIN is performed.
	 * Note that this property is only used by methods like exec and execAsync;
	 * you can always just explicitly write to STDIN using writeString or writeBinary.
	 * @alias Jaxer.Process.prototype.stdin
	 * @property {String, Number[]}
	 */
	this.stdin = null;

	/**
	 * The size in bytes of the buffer to use when reading from STDOUT and STDERR.
	 * By default this is 1024 bytes.
	 * @advanced
	 * @alias Jaxer.Process.prototype.readBufferSize
	 * @property {Number}
	 */
	this.readBufferSize = 1024;

	/**
	 * How to handle the standard output stream (STDOUT) from the process. 
	 * If this is a string, it read from STDOUT as a character stream;
	 * if this is an array, it is read from STDOUT as a binary (byte array) stream;
	 * otherwise no reading from STDOUT is performed.
	 * Note that this property is only used by methods like exec and execAsync;
	 * you can always just explicitly read from STDOUT using readString or readBinary.
	 * @alias Jaxer.Process.prototype.stdout
	 * @property {String, Number[]}
	 */
	this.stdout = null;

	/**
	 * How to handle the standard error stream (STDERR) from the process. 
	 * If this is a string, it read from STDERR as a character stream;
	 * otherwise no reading from STDERR is performed.
	 * Note that this property is only used by methods like exec and execAsync;
	 * you can always just explicitly read from STDERR using readErrString.
	 * @alias Jaxer.Process.prototype.stderr
	 * @property {String}
	 */
	this.stderr = null;

//	this.timeout = null;

	/**
	 * Whether to detach the process (if it's asynchronous) after any writing to STDIN is complete. 
	 * This is true by default
	 * Note that this property is only used by methods like exec and execAsync;
	 * you can always just explicitly detach by calling endExec.
	 * @alias Jaxer.Process.prototype.autoDetachIfAsync
	 * @property {String}
	 */
	this.autoDetachIfAsync = true;

	/**
	 * The internal status (state) of the process: one of Jaxer.Process.CREATED,
	 * Jaxer.Process.EXEC_BEGUN, Jaxer.Process.WRITE_ENED, and Jaxer.Process.EXEC_ENDED.
	 * @advanced
	 * @alias Jaxer.Process.prototype._status
	 * @property {Number}
	 */
	this._status = 0;

	/**
	 * The exit status (i.e. return code) of the process, if any.
	 * For an async process this is null.
	 * @alias Jaxer.Process.prototype.exitStatus
	 * @property {Number}
	 */
	this.exitStatus = null;
}

/**
 * The internal status indicating the process wrapper has been created but no execution has begun
 * @alias Jaxer.Process.CREATED
 * @property {Number}
 */
Process.CREATED = 0;
/**
 * The internal status indicating the process has begun executing, but any writing to STDIN is not necessarily finished
 * @alias Jaxer.Process.EXEC_BEGUN
 * @property {Number}
 */
Process.EXEC_BEGUN = 1;
/**
 * The internal status indicating the process has begun executing and any writing to STDIN is finished
 * @alias Jaxer.Process.WRITE_ENDED
 * @property {Number}
 */
Process.WRITE_ENDED = 2;
/**
 * The internal status indicating the process has finished executing or has been detached (if async)
 * @alias Jaxer.Process.EXEC_ENDED
 * @property {Number}
 */
Process.EXEC_ENDED = 3;

/**
 * Begins execution of the process. Any arguments to this method are treated as
 * arguments to the process; if no arguments are given, and this.args has been
 * set, it will be used instead.
 * You can start to write to STDIN and read from STDOUT and STDERR after you call this method.
 * 
 * @alias Jaxer.Process.prototype.beginExec
 */
Process.prototype.beginExec = function beginExec()
{
	
	// Verify path is reasonable:
	var file = new File(this.path);
	if (!file.exists)
	{
		throw new Exception("The path '" + this.path + "' to the process was not found (make sure an absolute path is given)");
	}
	if (!file.isFile)
	{
		throw new Exception("The path '" + this.path + "' to the process is not a file");
	}
	if (!file.isExec)
	{
		throw new Exception("The path '" + this.path + "' to the process is not an executable file");
	}
	
	if (this._status > Process.CREATED) throw new Exception("Cannot begin executing again a process that has previously begun executing");
	if ((this.args == null) || (arguments.length > 0)) this.args = Array.slice(arguments);
	log.trace("Starting execution of " + this.path + " with arguments: " + this.args);
	var argv = [this.path].concat(this.args);
	this._proc.run(!this.async, argv, argv.length);
	this._status = Process.EXEC_BEGUN;
	this.exitStatus = null;
}

/**
 * Writes the given string as a character stream to the process's STDIN.
 * 
 * @alias Jaxer.Process.prototype.writeString
 * @param {String} str
 * 		The string to write
 */
Process.prototype.writeString = function writeString(str)
{
	if (this._status < Process.EXEC_BEGUN) throw new Exception("Cannot write to the STDIN of a process that has not begun executing");
	if (this._status >= Process.WRITE_ENDED) throw new Exception("Cannot write to the STDIN of a process that has ended its write phase (e.g. because readString() was called)");
	log.trace("Writing a string of length " + str.length + " to STDIN of " + this.path);
	this._proc.writeString(str);
}

/**
 * Writes the given byte array as a binary stream to the process's STDIN
 * 
 * @alias Jaxer.Process.prototype.writeBinary
 * @param {Number[]} data
 * 		The byte array (array of integers)
 */
Process.prototype.writeBinary = function writeBinary(data)
{
	if (this._status < Process.EXEC_BEGUN) throw new Exception("Cannot end the writing phase of a process that has not begun executing");
	if (this._status >= Process.WRITE_ENDED) throw new Exception("Cannot write to the STDIN of a process that has ended its write phase (e.g. because readString() was called)");
	log.trace("Writing a byte array of length " + data.length + " to STDIN of " + this.path);
	this._proc.writeBytes(data, data.length);
}

/**
 * Closes STDIN for further writing, which may be needed by the process before it can proceed.
 * This is automatically called by reading anything from STDOUT and STDERR and by endExec.
 * 
 * @alias Jaxer.Process.prototype.endWrite
 */
Process.prototype.endWrite = function endWrite()
{
	if (this._status < Process.EXEC_BEGUN) throw new Exception("Cannot write to the STDIN of a process that has not begun executing");
	if (this._status >= Process.WRITE_ENDED) return; // already ended writing so nothing to do
	log.trace("Closing STDIN of " + this.path);
	this._proc.endStdin();
	this._status = Process.WRITE_ENDED;
}

/**
 * Reads the process's STDOUT stream as a character string.
 * 
 * @alias Jaxer.Process.prototype.readString
 * @param {Number} [maxLength]
 * 		If specified, limits reading of STDOUT to maxLength characters
 * @return {String}
 * 		The string value of STDOUT
 */
Process.prototype.readString = function readString(maxLength)
{
	if (this._status < Process.EXEC_BEGUN) throw new Exception("Cannot read from the STDOUT of a process that has not begun executing");
	if (this._status >= Process.EXEC_ENDED) throw new Exception("Cannot read from the STDOUT of a process whose execution has ended or that has been detached");
	this.endWrite();
	var hasMaxLength = Util.Math.isInteger(maxLength);
	var stdout = this._proc.readStdoutString();
	var output = '';
	while (stdout.length > 0)
	{
		if (!hasMaxLength || (output.length < maxLength))
		{
			output += stdout;
		}
		stdout = this._proc.readStdoutString(); // keep reading even if past maxLength, to flush out buffer
	}
	if (hasMaxLength)
	{
		output = output.substr(0, maxLength);
	}
	log.trace("Returning a string of length " + output.length + " from STDOUT of " + this.path);
	return output;
}

/**
 * Reads the process's STDOUT stream as a byte array.
 * 
 * @alias Jaxer.Process.prototype.readBinary
 * @param {Number} [maxLength]
 * 		If specified, limits reading of STDOUT to maxLength bytes
 * @return {Number[]}
 * 		The binary value of STDOUT as an array of integers
 */
Process.prototype.readBinary = function readBinary(maxLength)
{
	if (this._status < Process.EXEC_BEGUN) throw new Exception("Cannot read from the STDOUT of a process that has not begun executing");
	if (this._status >= Process.EXEC_ENDED) throw new Exception("Cannot read from the STDOUT of a process whose execution has ended or that has been detached");
	this.endWrite();
	var hasMaxLength = Util.Math.isInteger(maxLength);
	var stdoutDataHolder = {};
	this._proc.readStdoutBytes(stdoutDataHolder, {});
	var stdout = stdoutDataHolder.value;
	var output = [];
	while (stdout.length > 0)
	{
		if (!hasMaxLength || (output.length < maxLength))
		{
			output.push.apply(output, stdout);
		}
		this._proc.readStdoutBytes(stdoutDataHolder, {}); // keep reading even if past maxLength, to flush out buffer
		stdout = stdoutDataHolder.value;
	}
	if (hasMaxLength && (output.length > maxLength))
	{
		output.splice(maxLength, output.length - maxLength);
	}
	log.trace("Returning a byte array of length " + output.length + " from STDOUT of " + this.path);
	return output;
}

/**
 * Reads the process's STDERR stream as a character string.
 * 
 * @alias Jaxer.Process.prototype.readErrString
 * @param {Number} [maxLength]
 * 		If specified, limits reading of STDERR to maxLength characters
 * @return {String}
 * 		The string value of STDERR
 */
Process.prototype.readErrString = function readErrString(maxLength)
{
	if (this._status < Process.EXEC_BEGUN) throw new Exception("Cannot read from the STDERR of a process that has not begun executing");
	if (this._status >= Process.EXEC_ENDED) throw new Exception("Cannot read from the STDERR of a process whose execution has ended or that has been detached");
	this.endWrite();
	var hasMaxLength = Util.Math.isInteger(maxLength);
	var stderr = this._proc.readStderrString();
	var output = '';
	while (stderr.length > 0)
	{
		if (!hasMaxLength || (output.length < maxLength))
		{
			output += stderr;
		}
		stderr = this._proc.readStderrString(); // keep reading even if past maxLength, to flush out buffer
	}
	if (hasMaxLength)
	{
		output = output.substr(0, maxLength);
	}
	log.trace("Returning a string of length " + output.length + " from STDERR of " + this.path);
	return output;
}

/**
 * Completes the execution of the process (if synchronous) or detaches it (if asynchronous).
 * A running process may be stopped via kill() anytime before endExec() is called.
 * 
 * @alias Jaxer.Process.prototype.endExec
 * @return {Number}
 * 		If the process is synchronous, its exit status (i.e. return code) is returned.
 */
Process.prototype.endExec = function endExec()
{
	if (this._status < Process.EXEC_BEGUN) throw new Exception("Cannot finish execution of a process that has not begun executing");
	if (this._status >= Process.EXEC_ENDED) return; // already ended -- nothing to do
	if (this._status < Process.WRITE_ENDED) 
	{
		this.endWrite();
	}
	log.trace("Ending the execution of (or detaching) " + this.path);
	this._proc.wait();
	this.exitStatus = this.async ? null : this._proc.exitValue;
	log.trace("Ended the execution of (or detached) " + this.path + " with exitStatus: " + this.exitStatus);
	this._status = Process.EXEC_ENDED;
	return this.exitStatus;
}

/**
 * Kills a running process. This can only be called before endExec() has been called.
 * 
 * @alias Jaxer.Process.prototype.kill
 */
Process.prototype.kill = function kill()
{
	if (this._status < Process.EXEC_BEGUN) throw new Exception("Cannot kill a process that has not begun executing");
	if (this._status >= Process.EXEC_ENDED) return; // the process is finished or detached when endExec is called so there's nothing to kill
	log.trace("Killing process " + this.path);
	this._proc.kill();
	log.trace("Killed process " + this.path);
	this.exitStatus = null;
	this._status = Process.EXEC_ENDED;
}

/**
 * Executes the process. The path to the executable file should already have been
 * set when creating the Process or via the path property. The arguments to this
 * method are used as the arguments to the process.
 * By default, the process is executed synchronously (i.e. it blocks), 
 * and nothing is written to STDIN nor read from STDOUT or STDERR. 
 * To override these defaults, set any of the following properties before calling this: 
 * async, stdin, stdout, stderr, and autoDetachIfAsync.
 * If any of these are set they will be used; for stdout and stderr they will
 * be used only if the process is synchronous, in which case they'll be set to STDOUT/STDERR.  
 * If the process is asycnhronous and autoDetachIfAsync is false, it will not be detached
 * until it falls out of scope, so you can still read STDOUT or STDERR and kill it until
 * it falls out of scope, at which point it will be detached; 
 * otherwise it will be detached immediately (or after any STDIN is written).
 * 
 * @alias Jaxer.Process.prototype.exec
 * @return {Number}
 * 		If the process is synchronous, its exit status (i.e. return code) is returned.
 */
Process.prototype.exec = function exec()
{
	this.beginExec.apply(this, arguments);
	if (typeof this.stdin == "string")
	{
		this.writeString(this.stdin);
	}
	else if (this.stdin && (this.stdin.constructor == this.stdin.__parent__.Array))
	{
		this.writeBinary(this.stdin);
	}
	this.endWrite();
	if (!this.async) // auto read from STDOUT/STDERR for blocking process
	{
		if (typeof this.stdout == "string") 
		{
			this.stdout = this.readString();
		}
		else if (this.stdout && (this.stdout.constructor == this.stdout.__parent__.Array)) 
		{
			this.stdout = this.readBinary();
		}
		if (typeof this.stderr == "string") 
		{
			this.stderr = this.readErrString();
		}
	}
	if (!this.async || this.autoDetachIfAsync) // finish execution or detach
	{
		this.endExec();
	}
	if (!this.async)
	{
		return this.exitStatus;
	}
}

/**
 * Executes the process asynchronously (i.e. without blocking). 
 * The path to the executable file should already have been
 * set when creating the Process or via the path property. The arguments to this
 * method are used as the arguments to the process.
 * By default, nothing is written to STDIN, and the process
 * is immediately detached after it is launched. 
 * To override these defaults, set stdin and/or autoDetachIfAsync on the process
 * before calling this.
 * If stdin is set, it will be used. 
 * If autoDetachIfAsync is not set (or set to the default value of true), 
 * the process will be detached immediately after any STDIN is written.
 * If autoDetachIfAsync is set to false, the process will not be detached,
 * so you can still read STDOUT or STDERR and kill it until
 * it falls out of scope, at which point it will be detached.
 * 
 * @alias Jaxer.Process.prototype.execAsync
 */
Process.prototype.execAsync = function execAsync()
{
	this.async = true;
	this.exec.apply(this, arguments);
}

////////// STATIC METHODS ////////////

/**
 * Executes the process specified by the given absolute path. 
 * Any remaining arguments to this function are used as the arguments to the process, 
 * except possibly for the last argument if it is an object, 
 * in which case it's removed and used to set options.
 * By default, the process is executed synchronously (i.e. it blocks), 
 * and nothing is written to STDIN. 
 * To override these defaults, pass as a final argument an object containing 
 * the properties to be overridden: async, stdin, stdout, stderr, autoDetachIfAsync.
 * If any of these are set they will be used; for stdout and stderr they will
 * be used only if the process is synchronous, in which case 
 * their values in your object will be set to STDOUT/STDERR. 
 * For a synchronous process, the return value will be the STDOUT of the process,
 * unless you specify stdout in your options object, in which case the return value
 * is the exitStatus; and unless
 * you specify stderr, an error will be thrown if the process's exitStatus is non-zero
 * or if it writes to STDERR.
 * If the process is executed asynchronously and autoDetachIfAsync is false, 
 * it will not be detached until it falls out of scope; 
 * otherwise it will be detached immediately (or after any STDIN is written).
 * 
 * @alias Jaxer.Process.exec
 * @param {String} path
 * 		The absolute path of the executable file to execute
 * @return {String}
 * 		For a synchronous process (without having a stdout property in an options
 * 		object), returns the STDOUT of the process; otherwise does not return anything.
 * @example
 *		<pre>
 *			document.write("The folder contains:\n" + Jaxer.Process.exec("/bin/ls"));
 *
 *			var opts = {stdin: 'Hello world', stdout: '', stderr: ''};
 *			var exitStatus = Jaxer.Process.exec("/bin/cat", "-", opts);
 *			document.write("Finished /bin/cat with status " + exitStatus + ": opts = " + uneval(opts));
 * 		</pre>
 */
Process.exec = function exec(path)
{
	var proc = new Process(path);
	var options = preProcessOptions(proc, Array.slice(arguments, 1)); 
	var procArgs = options.procArgs;
	var userOpts = options.userOpts;
	var exitStatus = proc.exec.apply(proc, procArgs);
	if (!proc.async)
	{
		if ('stdout' in userOpts) 
		{
			userOpts.stdout = proc.stdout;
		}
		if ('stderr' in userOpts)
		{
			userOpts.stderr = proc.stderr;
		}
		else if (exitStatus || proc.stderr)
		{
			var err = new Exception("Process " + proc.path + " returned an exit status of " + exitStatus + (proc.stderr ? (" and STDERR of '" + proc.stderr + "'") : " and no STDERR"));
			err.exitStatus = exitStatus;
			err.stderr = proc.stderr;
			throw err;
		}
		if ('stdout' in userOpts)
		{
			return exitStatus;
		} 
		else
		{ 
			return proc.stdout;
		}
	}
}

/**
 * Asynchronously executes the process specified by the given absolute path (so it does not block). 
 * Any remaining arguments to this function are used as the arguments to the process, 
 * except possibly for the last argument if it is an object, 
 * in which case it's removed and used to set options.
 * By default, nothing is written to STDIN nor read from STDOUT or STDERR,
 * and the process is immediately detached after it is launched. 
 * To override these defaults, pass as a final argument an object containing 
 * the properties to be overridden: stdin and/or autoDetachIfAsync.
 * If stdin is set, it will be used. 
 * If autoDetachIfAsync is not set (or set to the default value of true), 
 * the process will be detached immediately after any STDIN is written.
 * If autoDetachIfAsync is set to false, the process will not be detached until
 * it falls out of scope, at which point it will be detached.
 * 
 * @alias Jaxer.Process.execAsync
 * @param {String} path
 * 		The absolute path of the executable file to execute
 * @example
 *		<pre>
 *			Jaxer.Process.execAsync("/bin/sleep", 1, {autoDetachIfAsync: false});
 *			var opts = {stdout: ''};
 *			Jaxer.Process.exec('/bin/ps', '-ax', opts);
 *			print("Sleep is running? " + (Jaxer.Util.String.grep(opts.stdout, "/bin/sleep").length > 0));
 *			Jaxer.Util.sleep(2000);
 *			Jaxer.Process.exec('/bin/ps', '-ax', opts);
 *			print("Sleep is running? " + (Jaxer.Util.String.grep(opts.stdout, "/bin/sleep").length > 0));
 * 		</pre>
 */
Process.execAsync = function execAsync(path)
{
	var proc = new Process(path, true);
	var options = preProcessOptions(proc, Array.slice(arguments, 1)); 
	var procArgs = options.procArgs;
	var userOpts = options.userOpts;
	proc.execAsync.apply(proc, procArgs);
}

function preProcessOptions(proc, args)
{
	var userOpts = {};
	if (args && args.length)
	{
		var candidateOpts = args[args.length - 1]; // the last argument is the options -- if it's of type "object"
		if (candidateOpts && (typeof candidateOpts == "object"))
		{
			userOpts = candidateOpts;
			args = args.slice(0, args.length - 1);
		}
	}
	var procOpts = (proc.async || userOpts.async) ? userOpts : Util.extend({stdout: '', stderr: ''}, userOpts);
	log.trace("Applying options: " + uneval(procOpts));
	['async', 'stdin', 'stdout', 'stderr', 'path', 'autoDetachIfAsync' /*, 'timeout'*/].forEach(function(name) 
	{ 
		if (name in procOpts) proc[name] = procOpts[name]; 
	});
	return {
		procArgs: args,
		userOpts: userOpts
	};
}

Jaxer.Process = Process;

Log.trace("*** Process.js loaded");

})();


/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Threading > Thread.js
 */
coreTraceMethods.TRACE('Loading fragment: Thread.js');
Jaxer.lastLoadedFragment = 'Thread.js';

(function(){

var log = Log.forModule("Thread");

/**
 * @classDescription {Jaxer.Thread} 
 * 		A namespace object used to access threading-related functionality, such as async processing
 */
var Thread = {};

/**
 * The default number of milliseconds to wait before timing out waitFor.
 * Set to 3000 (3 seconds) by default).
 * 
 * @alias Jaxer.Thread.DEFAULT_MAX_MILLIS
 * @property {Number}
 */
Thread.DEFAULT_MAX_MILLIS = 3000;

const currentThread = Components.classes["@mozilla.org/thread-manager;1"].getService().currentThread;

/**
 * The currently executing thread.
 * 
 * @alias Jaxer.Thread.currentThread
 * @property {Object}
 */
Thread.__defineGetter__("currentThread", function() { return currentThread; });

/**
 * Allows asynchronous processing (e.g. async XHR requests, async Sandbox loading, etc.) to happen
 * and waits for them to complete -- completion is indicated by a test function returning true.
 * You can specify a maximum time you want to wait before giving up and continuing.
 * 
 * @alias Jaxer.Thread.waitFor
 * @param {Function} testFunction
 * 		The function to evaluate periodically to see whether we should continue to wait.
 * 		When testFunction returns true, the waitFor function exits.
 * @param {Number} [maxMillis]
 * 		The number of milliseconds to wait for testFunction to return true
 * 		before timing out and exiting. If this is zero or negative,
 * 		waits indefinitely (though other timeouts may intervene)
 * @return {Boolean} 
 * 		true if testFunction returned true, false if the timeout was reached before then
 */
Thread.waitFor = function waitFor(testFunction, maxMillis)
{
	maxMillis = Jaxer.Util.Math.forceInteger(maxMillis, Thread.DEFAULT_MAX_MILLIS);
	
	// Will use pageWindow's setTimeout and clearTimeout
	var win = Jaxer.pageWindow;
	
	// If timeoutCallback is ever called, that means we timed out
	var timedout = false;
	var timeoutCallback = function()
	{
		timedout = true;
	}
	
	log.trace("Starting to waitFor...");
	
	// Set the timeout, then start testing for it and for completion while pumping event loop
	var timeoutHandle = (maxMillis >= 0) ? win.setTimeout(timeoutCallback, maxMillis) : null;
	while (!testFunction() && !timedout) 
	{
		if (log.getLevel() == Log.TRACE) log.trace("...waitFor iteration; currentThread.hasPendingEvents = " + currentThread.hasPendingEvents());
		currentThread.processNextEvent(true);
	}
	if (timeoutHandle) win.clearTimeout(timeoutHandle);

	log.trace("Ending waitFor; timed out? " + timedout);
	
	return !timedout;
}


frameworkGlobal.Thread = Jaxer.Thread = Thread;

Log.trace("*** Thread.js loaded");

})();


/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Cache > CacheManager.js
 */
coreTraceMethods.TRACE('Loading fragment: CacheManager.js');
Jaxer.lastLoadedFragment = 'CacheManager.js';

(function(){

var log = Log.forModule("CacheManager");

/**
 * @namespace {Jaxer.Cache}
 * A namespace object holding functions and members for in-memory caches
 * @advanced
 */
var CacheManager = {};

CacheManager.callbackPages = {};

CacheManager.autoloadScripts = {};

frameworkGlobal.CacheManager = Jaxer.CacheManager = CacheManager;

Log.trace("*** CacheManager.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Container > Container.js
 */
coreTraceMethods.TRACE('Loading fragment: Container.js');
Jaxer.lastLoadedFragment = 'Container.js';

(function(){

var log = Log.forModule("Container");

/**
 * @classDescription {Jaxer.Container} 
 * 		Container object that is used for all types of containers (e.g. session, sessionPage, etc).
 * 
 */

/**
 * This is the contructor for the Container object, used for all types of
 * containers (session, sessionPage, etc).
 * 
 * @advanced
 * @constructor
 * @alias Jaxer.Container
 * @param {String} type
 * 		The type of the container
 * @param {String} key
 * 		The key for the specific instance of the container (e.g. the sessionPage
 * 		container is per page, and the page's key is used here)
 * @param {Object} persistor
 * 		An instance of the persistor (e.g. a DBPersistor) to be used to persist
 * 		this container
 * @param {String} name
 * 		The name of this container
 * @return {Jaxer.Container}
 * 		Returns an instance of Container.
 */
function Container(type, key, persistor, name)
{
	this.type = type;
	this.key = key;
	this.id = this.type + ":" + this.key;
	this.persistor = persistor;
	this.name = name;
	this.isLoaded = false;
	this.names = [];
	this.data = {};
	this.addedData = {}; 	// true ==> newly added
	this.changedData = {};	// defined ==> changed, holds previous value
	this.deletedData = {};	// defined ==> deleted, holds previous value
}

/**
 * Load the container from its store, but only if it has not yet been loaded
 * 
 * @private
 * @alias Jaxer.Container.prototype.loadIfNeeded
 */
Container.prototype.loadIfNeeded = function loadIfNeeded()
{
	if (!this.isLoaded)
	{
		log.debug("Loading container " + this.id + " for first time")
		this.data = this.persistor.loadAll(this.type, this.key);
		for (var p in this.data)
		{
			this.data[p] = Serialization.fromJSONString(this.data[p], {as: Serialization.JAXER_METHOD});
			this.names.push(p);
		}
		this.isLoaded = true;
	}
};

/**
 * Gets the value of the given property
 * 
 * @private
 * @alias Jaxer.Container.prototype.get
 * @param {String} name
 * 		The name of the property whose value we need
 * @return {Object}
 * 		The value
 */
Container.prototype.get = function get(name)
{
	this.loadIfNeeded();
	
	return this.data[name];
}

/**
 * Sets a name-value pair in the current container.
 * 
 * @private
 * @alias Jaxer.Container.prototype.set
 * @param {String} name
 * 		The name of the property to set
 * @param {Object} value
 * 		The value of the property
 */
Container.prototype.set = function set(name, value)
{
	var valueForLogging = String(value);
	valueForLogging = valueForLogging.substr(0, 30) + ((valueForLogging.length > 30) ? "..." : "");
	log.trace("For container " + this.id + ": setting '" + name + "' = " + valueForLogging);
	this.loadIfNeeded();
	var nowExists = this.data.hasOwnProperty(name);
	var newlyAdded = this.addedData.hasOwnProperty(name);
	var wasDeleted = this.deletedData.hasOwnProperty(name);
	var wasChanged = this.changedData.hasOwnProperty(name);
	var previouslyPersisted = (nowExists && !newlyAdded) || wasDeleted;
	delete this.deletedData[name];
	if (previouslyPersisted)
	{
		if (!wasChanged) // This is the first time it's changed since we loaded it
		{
			this.changedData[name] = this.data[name]; // Hold the previous value
		}
	}
	else
	{
		if (!newlyAdded)  // This is the first time it's being set
		{
			this.addedData[name] = true;
		}
	}
	if (!nowExists)
	{
		this.names.push(name);
	}
	this.data[name] = (typeof value == "undefined") ? Container.DEFAULT_VALUE : value;
	valueForLogging = String(this.data[name]);
	valueForLogging = valueForLogging.substr(0, 30) + ((valueForLogging.length > 30) ? "..." : "");
	var changedValueForLogging = String(this.changedData[name]);
	changedValueForLogging = changedValueForLogging.substr(0, 30) + ((changedValueForLogging.length > 30) ? "..." : "");
	log.debug("For container " + this.id + ": this.data['" + name + "'] = " + valueForLogging + "; this.changedData['" + name + "'] = " + changedValueForLogging);
}

/**
 * Mark a property as changed so it persists
 * 
 * @private
 * @alias Jaxer.Container.prototype.touch
 * @param {String} name
 * 		The name of the property to touch
 */
Container.prototype.touch = function touch(name)
{
	log.trace("For container " + this.id + ": Touching " + name);
	this.loadIfNeeded();
	var nowExists = this.data.hasOwnProperty(name);
	var value = nowExists ? this.data[name] : Container.DEFAULT_VALUE;
	this.set(name, value);
}

/**
 * Does the container have the given property set?
 * 
 * @private
 * @alias Jaxer.Container.prototype.exists
 * @param {String} name
 * 		The name of the property to look for
 * @return {Boolean} true if it exists, false otherwise
 */
Container.prototype.exists = function exists(name)
{
	this.loadIfNeeded();
	return this.data.hasOwnProperty(name);
}

/**
 * Was this property just created, or was it previously persisted?
 * 
 * @private
 * @alias Jaxer.Container.prototype.isPreviouslyPersisted
 * @param {String} name
 * 		The name of the property to query
 * @return {Boolean}
 * 		true if it was already there before, false if it's newly added
 */
Container.prototype.isPreviouslyPersisted = function isPreviouslyPersisted(name)
{
	this.loadIfNeeded();
	var nowExists = this.data.hasOwnProperty(name);
	var newlyAdded = this.addedData.hasOwnProperty(name);
	var wasDeleted = this.deletedData.hasOwnProperty(name);
	return (nowExists && !newlyAdded) || wasDeleted;
}

/**
 * Remove (unset) a property
 * 
 * @private
 * @alias Jaxer.Container.prototype.remove
 * @param {String} name
 * 		The name of the property to remove
 */
Container.prototype.remove = function remove(name)
{
	log.trace("For container " + this.id + ": Removing " + name);
	this.loadIfNeeded();
	if (!this.data.hasOwnProperty(name))
	{
		log.debug("Nothing to remove: " + name);
		return; // Nothing to do
	}
	if (this.isPreviouslyPersisted(name)) // otherwise we'll need this info to remove the name-value from the persistent store
	{
		log.debug("We still need to remember that '" + name + "' was changed because it was previously persisted");
		this.deletedData[name] = this.data[name];
	}
	else
	{
		log.debug("No need to remember that '" + name + "' was changed because it was not previously persisted");
	}
	var iName = this.names.indexOf(name);
	delete this.names[iName];
	delete this.data[name];
	delete this.changedData[name];
}

/**
 * Removes (unsets) all properties on this container
 * 
 * @private
 * @alias Jaxer.Container.prototype.removeAll
 */
Container.prototype.removeAll = function removeAll()
{
	log.trace("For container " + this.id + ": Removing all");
	this.loadIfNeeded();
	for (var iName=0, numNames=this.names.length; iName<numNames; iName++) 
	{
		var name = this.names[iName];
		if (this.isPreviouslyPersisted(name)) // otherwise we'll need this info to remove the name-value from the persistent store
		{
			this.deletedData[name] = this.data[name];
		}
	}
	this.names = [];
	this.data = {};
	this.changedData = {};
}

/**
 * Revert a property to its previously-persisted value
 * 
 * @private
 * @alias Jaxer.Container.prototype.revert
 * @param {String} name
 * 		The name of the property to revert
 */
Container.prototype.revert = function revert(name)
{
	log.trace("For container " + this.id + ": Reverting " + name);
	this.loadIfNeeded();
	var nowExists = this.data.hasOwnProperty(name);
	var newlyAdded = this.addedData.hasOwnProperty(name);
	var wasDeleted = this.deletedData.hasOwnProperty(name);
	var wasChanged = this.changedData.hasOwnProperty(name);
	if (newlyAdded)
	{
		var iName = this.names.indexOf(name);
		delete this.names[iName];
		delete this.data[name];
	}
	else if (wasDeleted)
	{
		this.data[name] = this.deletedData[name];
	}
	else if (wasChanged)
	{
		this.data[name] = this.changedData[name];
	}
	delete this.addedData[name];
	delete this.changedData[name];
	delete this.deletedData[name];
}

/**
 * Persists a container.
 * 
 * @private
 * @alias Jaxer.Container.prototype.persist
 * @param {Object} doc
 * 		The document into which container information may be persisted (currently not used)
 */
Container.prototype.persist = function persist(doc)
{
	log.trace("For container " + this.id + ": Persisting");
	var exposedContainer = exposedContainers[this.name];
	var dataIsSerialized = false;
	var that = this;
	if (exposedContainer) // the exposedContainer has been used, so harvest its data
	{
		dataIsSerialized = true; // we'll end up serializing all the data
		if (Util.isEmptyObject(exposedContainer)) 
		{
			this.removeAll(); // optimization
		}
		else 
		{
			// delete any properties that are no longer in exposedContainer
			var namesToDelete = []
			this.names.forEach(function(name)
			{
				if (!(name in exposedContainer)) 
					namesToDelete.push(name);
			});
			namesToDelete.forEach(function(name)
			{
				that.remove(name);
			});
			// then deal with all data that is in exposedContainer
			var namesToUnchange = [];
			for (var p in exposedContainer)
			{
				if (typeof exposedContainer[p] == "undefined") exposedContainer[p] = Container.DEFAULT_VALUE;
				if (p in this.addedData) // data was newly added in container and was never persisted -- just overwrite it
				{
					this.data[p] = Serialization.toJSONString(exposedContainer[p], { as: Serialization.JAXER_METHOD });
				}
				else if (p in this.changedData) // data was changed in container -- overwrite it unless it was set back to the original
				{
					var original = Serialization.toJSONString(this.changedData[p], { as: Serialization.JAXER_METHOD });
					var latest = Serialization.toJSONString(exposedContainer[p], { as: Serialization.JAXER_METHOD });
					if (original == latest) // set back to original
					{
						namesToUnchange.push(p);
					}
					else // yes, it's changed -- to the latest value, in container
					{
						this.data[p] = latest;
					}
				}
				else if (p in this.data) // data was not changed in container, but maybe was changed in exposedContainer
				{
					var original = Serialization.toJSONString(this.data[p], { as: Serialization.JAXER_METHOD });
					var latest = Serialization.toJSONString(exposedContainer[p], { as: Serialization.JAXER_METHOD });
					if (original != latest) // set back to original
					{
						this.set(p, latest);
					}
				}
				else // add any data that is new
				{
					this.set(p, Serialization.toJSONString(exposedContainer[p], { as: Serialization.JAXER_METHOD }));
				}
			}
			namesToUnchange.forEach(function(name)
			{
				delete that.changedData[name];
			});
		}
	}
	var didSomething = false;
	if ((this.names.length == 0) &&
		!Util.isEmptyObject(this.deletedData)) // optimization to bulk-delete
	{
		this.persistor.removeAll(this.type, this.key);
		didSomething = true;
	}
	else
	{
		if (this.persistor.persistByName)
		{
			for (var name in this.addedData)
			{
				log.debug("For container " + this.id + ": inserting " + name + " into persistent store");
				this.persistor.persist(this.type, this.key, name, dataIsSerialized ? this.data[name] : Serialization.toJSONString(this.data[name], { as: Serialization.JAXER_METHOD }));
				didSomething = true;
			}
			for (var name in this.changedData)
			{
				log.debug("For container " + this.id + ": updating " + name + " in persistent store");
				this.persistor.persist(this.type, this.key, name, dataIsSerialized ? this.data[name] : Serialization.toJSONString(this.data[name], { as: Serialization.JAXER_METHOD }));
				didSomething = true;
			}
			for (var name in this.deletedData)
			{
				log.debug("For container " + this.id + ": removing " + name + " from persistent store");
				this.persistor.remove(this.type, this.key, name);
				didSomething = true;
			}
		}
		else
		{
			log.debug("For container " + this.id + ": persisting all data");
			var serialized;
			if (dataIsSerialized) 
			{
				serialized = this.data;
			}
			else 
			{
				serialized = {};
				for (var name in this.data) 
				{
					serialized[name] = Serialization.toJSONString(this.data[name], { as: Serialization.JAXER_METHOD });
				}
			}
			this.persistor.persist(this.type, this.key, serialized);
			didSomething = true;
		}
	}
	if (didSomething) 
	{
		this.addedData = {};
		this.changedData = {};
		this.deletedData = {};
		if (Jaxer.response)
		{
			Jaxer.response.noteSideEffect();
		}
	}
}

// Static methods

var containerTypes = ["APPLICATION", "PAGE", "SESSION", "SESSION_PAGE"];
var jaxerContainerNames = [];

for (var i = 0; i < containerTypes.length; i++)
{
	var containerType = containerTypes[i];
	
	Container[containerType] = containerType;
	containerName = Util.String.upperCaseToCamelCase(containerType);
	jaxerContainerNames.push(containerName);
}

var containers = {}; // these are instances of Container;
var exposedContainers = {}; // these are plain objects exposed to the developer off the Jaxer namespace

/**
 * Initialize the Containers subsystem for the current request
 * 
 * @private
 * @alias  Jaxer.Container.init
 * @param {String} appKey
 * 		The string identifying the application associated with the current request
 * @param {String} pageKey
 * 		The string identifying the page associated with the current request
 */
Container.init = function init(appKey, pageKey)
{
	var dbPersistor = new Container.DBPersistor();
	var keys = {};
	keys.application = appKey;
	keys.page = pageKey;
	keys.session = SessionManager.keyFromRequest(keys.application);
	keys.sessionPage = keys.session + "$$" + keys.page;
	for (var i=0; i<containerTypes.length; i++)
	{
		var containerType = containerTypes[i];
		var containerName = jaxerContainerNames[i];
		var container = new Container(containerType, keys[containerName], dbPersistor, containerName);
		containers[container.type] = container;
		exposedContainers[container.name] = null;
		Jaxer.__defineGetter__(containerName, createGetter(container.type, container.name));
		Jaxer.__defineSetter__(containerName, createSetter(container.type, container.name));
		log.debug("Created " + container.type + " container as Jaxer." + container.name + " with key " + container.key);
	}
	Jaxer.clientData = {};
};

function createGetter(containerType, containerName)
{
	var func = function getContainer()
	{
		log.trace("Getting exposedContainer: " + containerName);
		var exposedContainer = exposedContainers[containerName];
		if (!exposedContainer) 
		{
			exposedContainer = {};
			var _container = containers[containerType];
			_container.loadIfNeeded();
			log.trace("Populating Jaxer." + containerName + " with properties: " + _container.names);
			_container.names.forEach(function(name)
			{
				exposedContainer[name] = _container.get(name);
			});
			exposedContainers[containerName] = exposedContainer;
		}
		return exposedContainer;
	};
	return func;
}

function createSetter(containerType, containerName)
{
	var func = function setContainer(value)
	{
		log.trace("Setting exposedContainer: " + containerName);
		if (typeof value == "object")
		{
			var exposedContainer = {};
			for (var p in value)
			{
				exposedContainer[p] = value[p];
			}
			exposedContainers[containerName] = exposedContainer;
		}
		else
		{
			throw "You can only set Jaxer." + containerName + " to a value of type 'object'";
		}
	};
	return func;
}

/**
 * A persistent session-like container that can store and persist name-value 
 * pairs in the context of an entire application. Whether a given page belongs
 * to a given application is determined by configApps.js, usually from the
 * page's URL. All pages belonging to an application, and their callbacks, have
 * read/write access to this application container, regardless of user session,
 * and to no other application-level container.
 * 
 * @alias Jaxer.application
 * @private
 * @property {Object}
 */

/**
 * A persistent session-like container that can store and persist name-value
 * pairs in the context of one page. What constitutes a page is defined by
 * configApps.js, usually from the page's URL (i.e. it determines which URLs
 * constitute unique pages). A page and its callbacks have read/write access to
 * this page container regardless of user session, and to no other page-level
 * container.
 * 
 * @alias Jaxer.page
 * @private
 * @property {Object}
 */

/**
 * A persistent session container that can store and persist name-value pairs in
 * the context of a user/browser session across all pages of an application. 
 * What constitutes an application is defined by configApps.js, usually from
 * the request's URL. A page and its callbacks have read/write access to this
 * page container regardless of user session, and to no other page-level
 * container.
 * 
 * @alias Jaxer.session
 * @private
 * @property {Object}
 */

/**
 * A persistent session-like container that can store and persist name-value
 * pairs in the context of a user/browser session on a given page. What
 * constitutes a page is defined by configApps.js, usually from the request's
 * URL. A page and its callbacks have read/write access to this sessionPage
 * container as long as the session continues, and to no other sessionPage
 * containers.
 * 
 * @alias Jaxer.sessionPage
 * @private
 * @property {Object}
 */

/**
 * A JavaScript Object that can be used to communicate data from the server at
 * the end of server-side page processing to the client. When Jaxer starts to
 * process a page server-side, Jaxer.clientData is an empty object: {}. If you
 * set any properties on this object, the entire object will be JSON-serialized
 * at the end of server-side processing, and will be automatically de-serialized
 * when it gets to the client, so you can access your data as Jaxer.clientData
 * in the browser. Note that if there is no data, Jaxer.clientData will not be
 * created at all on the client.
 * 
 * @alias Jaxer.clientData
 * @private
 * @property {Object}
 */

/**
 * Persists all container data to the store (as needed).
 * 
 * @private
 * @alias Jaxer.Container.persistAll
 * @param {Object} doc
 * 		The current document, if any, into which the clientData container's data
 * 		will be inserted. Not applicable for callbacks.
 */
Container.persistAll = function persistAll(doc)
{
	// Persist session key to client
	SessionManager.keyToResponse(containers[Container.APPLICATION].key, containers[Container.SESSION].key);
	// Persist all containers to the DB and then clear them to make sure nobody has access to their data
	for (var i=0; i<containerTypes.length; i++)
	{
		var containerType = containerTypes[i];
		var containerName = jaxerContainerNames[i];
		containers[containerType].persist();
		delete containers[containerType];
		delete exposedContainers[containerName];
		delete Jaxer[containerName];
	}
	// Persist clientData to client and then clear it
	var hasClientData = !Util.isEmptyObject(Jaxer.clientData);
	if (hasClientData && doc)
	{
		Jaxer.response.noteSideEffect();
		Jaxer.response.noteDomTouched();
		var dataString = Serialization.toJSONString(Jaxer.clientData, { as: Serialization.JAXER_METHOD });
		var js = "Jaxer.clientData = Jaxer.Serialization.fromJSONString('" + Util.String.escapeForJS(dataString) + "', {as: Jaxer.Serialization.JAXER_METHOD});";
		var head = doc.getElementsByTagName("head")[0];
		Util.DOM.insertScriptAtBeginning(js, head, null);
	}
	delete Jaxer.clientData;
};

Container.DEFAULT_VALUE = true; // The default value for name-value pairs

frameworkGlobal.Container = Jaxer.Container = Container;

Log.trace("*** Container.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Container > DBPersistor.js
 */
coreTraceMethods.TRACE('Loading fragment: DBPersistor.js');
Jaxer.lastLoadedFragment = 'DBPersistor.js';

(function(){

var log = Log.forModule("DBPersistor"); // Only if Log itself is defined at this point of the includes

/**
 * @classDescription {Jaxer.DBPersistor} A database-based persistor for Jaxer
 * Container objects (session, sessionPage, etc.)
 */

/**
 * A database-based persistor for Jaxer Container objects (session, sessionPage,
 * etc.)
 * 
 * @advanced
 * @constructor
 * @alias Jaxer.DBPersistor
 * @return {Jaxer.DBPersistor}
 * 		Returns an instance of DBPersistor.
 */
function DBPersistor()
{
	this.persistByName = true;
}

/**
 * Retrieve a given container type's and name's property, by name
 * 
 * @advanced
 * @alias Jaxer.DBPersistor.prototype.load
 * @param {String} type
 * 		The type of the container
 * @param {String} key
 * 		The key for the specific instance of the container (e.g. the sessionPage 
 * 		ontainer is per page, and the page's key is used here)
 * @param {String} name
 * 		The name of the property to query for
 * @return {String}
 * 		The value of the (usually serialized) requested property, 
 * 		or the empty string if there is none
 */
DBPersistor.prototype.load = function load(type, key, name)
{
	log.debug("Loading: " + [type, key, name]);
	var rs = DB.frameworkExecute("SELECT value FROM containers WHERE `type` = ? AND `key` = ? AND `name` = ?",
		[type, key, name]);
	if (rs.rows.length == 0)
	{
		log.debug("No values found");
		return {};
	}
	else
	{
		var value = rs.rows[0].value;
		log.debug("Found: " + value);
		return value;
	}
};

/**
 * Load all the name-value properties at once for the given container type and
 * key
 * 
 * @advanced
 * @alias Jaxer.DBPersistor.prototype.loadAll
 * @param {String} type
 * 		The type of the container
 * @param {String} key
 * 		The key for the specific instance of the container (e.g. the sessionPage
 * 		container is per page, and the page's key is used here)
 * @return {Object}
 * 		A hashmap of name-value pairs; the values are usually serialized
 * 		and need to be deserialized via Serialization.fromJSONString
 */
DBPersistor.prototype.loadAll = function loadAll(type, key)
{
	log.debug("Loading all: " + [type, key]);
	var rs = DB.frameworkExecute("SELECT name, value FROM containers WHERE `type` = ? AND `key` = ?",
		[type, key]);
	var results = {};
	var iReturned = 0;
	for (var i=0; i<rs.rows.length; i++)
	{
		var row = rs.rows[i];
		results[row.name] = row.value;
		iReturned++;
	}
	log.debug("Returning " + iReturned + " results");
	return results;
};

/**
 * Persist a particular property (by name) for the given container type and key
 * 
 * @advanced
 * @alias Jaxer.DBPersistor.prototype.persist
 * @param {String} type
 * 		The type of the container
 * @param {String} key
 * 		The key for the specific instance of the container (e.g. the sessionPage
 * 		container is per page, and the page's key is used here)
 * @param {String} name
 * 		The name of the property to persist
 * @param {String} data
 * 		The value to persist for this property, which should have already
 * 		been serialized (using Serialization.toJSONString)
 */
DBPersistor.prototype.persist = function persist(type, key, name, data)
{
	log.debug("Persisting " + [type, key, name, data]);
	var now = new Date();
	// In MySQL we could use the following statement:
	//DB.frameworkExecute("INSERT INTO containers (" + fields + ") VALUES (" + placeholders + ")" +
	//	" ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `modification_datetime` = VALUES(`modification_datetime`)",
	//	values);
	// But to be DB-independent, we need to first see if it exists and update, or else insert
	// TODO: This is NOT race-condition-safe
	var rs = DB.frameworkExecute("SELECT id FROM containers WHERE `type`=? AND `key`=? AND `name`=?", [type, key, name]);
	if (rs.rows.length > 0)
	{
		DB.frameworkExecute("UPDATE containers SET `value`=?, `modification_datetime`=? WHERE id=?", [data, now, rs.rows[0].id]);
	}
	else
	{
		var fields = "`" + ['type', 'key', 'name', 'value', 'creation_datetime', 'modification_datetime'].join("`,`") + "`";
		var values = [type, key, name, data, now, now];
		var placeholders = values.map(function(field) { return "?"; });
		DB.frameworkExecute("INSERT INTO containers (" + fields + ") VALUES (" + placeholders + ")", values);
	}
};

/**
 * Completely remove the given property from the database
 * 
 * @advanced
 * @alias Jaxer.DBPersistor.prototype.remove
 * @param {String} type
 * 		The type of the container
 * @param {String} key
 * 		The key for the specific instance of the container (e.g. the sessionPage
 * 		container is per page, and the page's key is used here)
 * @param {String} name
 * 		The name of the property to remove
 */
DBPersistor.prototype.remove = function remove(type, key, name)
{
	log.debug("Deleting " + [type, key, name]);
	DB.frameworkExecute("DELETE FROM containers WHERE `type` = ? AND `key` = ? AND `name` = ?",
		[type, key, name]);
};

/**
 * Completely remove all the container's properties from the database
 * 
 * @advanced
 * @alias Jaxer.DBPersistor.prototype.removeAll
 * @param {String} type
 * 		The type of the container
 * @param {String} key
 * 		The key for the specific instance of the container (e.g. the sessionPage
 * 		container is per page, and the page's key is used here)
 */
DBPersistor.prototype.removeAll = function removeAll(type, key)
{
	log.debug("Removing all from " + [type, key]);
	DB.frameworkExecute("DELETE FROM containers WHERE `type` = ? AND `key` = ?",
		[type, key]);
};

/**
 * Creates the database schema needed to persist containers
 * 
 * @advanced
 * @alias Jaxer.DBPersistor.createSchema
 */
DBPersistor.createSchema = function createSchema() // static
{
	sql = "CREATE TABLE IF NOT EXISTS containers (" +
		" `id` INTEGER PRIMARY KEY AUTO_INCREMENT," +
		" `type` VARCHAR(32) NOT NULL," +
		" `key` VARCHAR(255) NOT NULL," +
		" `name` VARCHAR(255) NOT NULL," +
		" `value` LONGTEXT," + 
		" `creation_datetime` DATETIME NOT NULL," +
		" `modification_datetime` DATETIME NOT NULL" +
		")";
	DB.frameworkExecute(sql);
};

Container.DBPersistor = DBPersistor;

Log.trace("*** DBPersistor.js loaded");  // Only if Log itself is defined at this point of the includes

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Container > SessionManager.js
 */
coreTraceMethods.TRACE('Loading fragment: SessionManager.js');
Jaxer.lastLoadedFragment = 'SessionManager.js';

(function(){

var log = Log.forModule("SessionManager"); // Only if Log itself is defined at this point of the includes

/**
 * @namespace {Jaxer.SessionManager} A namespace object holding functions and
 * members used to manage a user session across multiple requests.
 */
var SessionManager = 
{
	COOKIE_PREFIX: "JaxerSessionId$$"
};

/**
 * Get session key from the client via cookie, or create one as needed
 * 
 * @advanced
 * @alias Jaxer.SessionManager.keyFromRequest
 * @param {String} appKey
 * 		The key that uniquely identifies the current application
 * @return {String}
 * 		A session key that can be used to track the current session (new or
 * 		existing)
 */
SessionManager.keyFromRequest = function keyFromRequest(appKey)
{
	var cookieName = SessionManager.COOKIE_PREFIX + appKey;
	var key = Util.Cookie.get(cookieName);
	log.debug("Getting session key from the client via cookie " + cookieName + ": " + key);
	if (key == null)
	{
		key = "" + (new Date().getTime()) + Math.random().toString().replace(/[^\d]/g, "");
		log.debug("Creating a new session key: " + key);
	}
	return key;
};


/**
 * Set session key on the response to the client via a cookie
 * 
 * @advanced
 * @alias Jaxer.SessionManager.keyToResponse
 * @param {String} appKey
 * 		The key that uniquely identifies the current application
 * @param {String} key
 * 		The session key to use
 */
SessionManager.keyToResponse = function keyToResponse(appKey, key)
{
	var cookieName = SessionManager.COOKIE_PREFIX + appKey;
	log.debug("Saving session key to the client via cookie " + cookieName + ": " + key);
	Util.Cookie.set(SessionManager.COOKIE_PREFIX + appKey, key);
}

frameworkGlobal.SessionManager = Jaxer.SessionManager = SessionManager;

Log.trace("*** SessionManager.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > Request.js
 */
coreTraceMethods.TRACE('Loading fragment: Request.js');
Jaxer.lastLoadedFragment = 'Request.js';

(function() {

var log = Log.forModule("Request");

/**
 * @classDescription {Jaxer.Request} An instance of this object has 
 * the lifecycle of the current request and contains information about it.
 */

/**
 * An instance of this object has the lifecycle of the current request and
 * contains information about it.
 * 
 * This constructor is typically never invoked by the user. During the processing
 * of the page Jaxer will create an instance of this object named Jaxer.request, 
 * this instance should be used to introspect the request details.
 * 
 * @constructor
 * @alias Jaxer.Request
 * @param {Object} evt
 * 		The core event whose data is used to initialize this Request object
 * 		instance
 * @return {Jaxer.Request}
 * 		Returns an instance of Request.
 */
var Request = function Request(evt)
{
	
	this.constructorErrors = [];

	var _request = evt.Request; 
	this._request = _request; // For internal (Jaxer framework) use only -- APIs may change
	
	for (var p in _request)
	{
		if ((typeof _request[p] == "string") || 
			(typeof _request[p] == "boolean"))
		{
			this[p] = _request[p];
		}
	}
	
	/**
	 * The location on disk of the top folder from which all web pages are served
	 * by the web server, as an absolute URL (without the preceding file://).
	 * This is usually only meaningful if the web server is on the same
	 * filesystem as Jaxer.
	 * @alias Jaxer.Request.prototype.documentRoot
	 * @property {String}
	 */
	
	/**
	 * The location on disk of the current page's file, served
	 * by the web server, as an absolute URL (without the preceding file://).
	 * This is usually only meaningful if the web server is on the same
	 * filesystem as Jaxer.
	 * @alias Jaxer.Request.prototype.pageFile
	 * @property {String}
	 */
	
	/**
	 * The type of HTTP request this is: usually "GET" or "POST".
	 * Guaranteed to be all upper-case, and the same as
	 * the action property.
	 * @alias Jaxer.Request.prototype.method
	 * @property {String}
	 * @alias Jaxer.Request.prototype.action
	 * @see Jaxer.Request.ACTIONS
	 */
	/**
	 * The type of HTTP request this is: usually "GET" or "POST".
	 * Guaranteed to be all upper-case, and the same as
	 * the method property.
	 * @alias Jaxer.Request.prototype.action
	 * @property {String}
	 * @see Jaxer.Request.ACTIONS
	 */
	if (typeof this.method == "string")
	{
		this.method = this.method.toUpperCase();
		this.action = this.method;
	}
	
	/**
	 * Whether the current page is being requested and served over 
	 * the HTTPS protocol.
	 * @alias Jaxer.Request.prototype.isHTTPS
	 * @property {Boolean}
	 */
	
	/**
	 * True if Jaxer is the main "handler" for the current request,
	 * rather than is filtering a page served by a different handler.
	 * @alias Jaxer.Request.prototype.isHandler
	 * @property {Boolean}
	 */
	
	/**
	 * The protocol declared in the HTTP request, e.g. "HTTP/1.1".
	 * @alias Jaxer.Request.prototype.protocol
	 * @property {String}
	 */
	
	/**
	 * The query part of the current request's URL, after the "?".
	 * This is also available as Jaxer.request.parsedUrl.query
	 * and is parsed into the JavaScript object Jaxer.request.parsedUrl.queryParts.
	 * @alias Jaxer.Request.prototype.queryString
	 * @property {String}
	 */
	
	/**
	 * The value of the Referer HTTP header for this request, which should indicate
	 * the complete URL of the page that made this request. If this is a callback,
	 * the referer is taken from the "callingPage" parameter of the request, only
	 * using the Referer header if for some reason "callingPage" is not available.
	 * @alias Jaxer.Request.prototype.referer
	 * @property {String}
	 */
	
	/**
	 * The Internet Protocol (IP) address of the client (browser) that sent the request.
	 * @alias Jaxer.Request.prototype.remoteAddr
	 * @property {String}
	 */
	
	/**
	 * The hostname of the client (browser) that sent the request,
	 * or the IP address of the client if the hostname cannot be determined.
	 * @alias Jaxer.Request.prototype.remoteHost
	 * @property {String}
	 */
	
	/**
	 * If the browser making the request submitted HTTP authentication credentials,
	 * this is the username submitted. Otherwise it is the empty string.
	 * @alias Jaxer.Request.prototype.remoteUser
	 * @property {String}
	 */
	
	/**
	 * The URL (and URI) of the current request.
	 * @alias Jaxer.Request.prototype.uri
	 * @property {String}
	 */
	
	/**
	 * A collection of the HTTP headers received from the web server for this request,
	 * as properties on this simple JavaScript object. 
	 * If multiple headers had the same name, their values are given as an array.
	 * 
	 * @alias Jaxer.Request.prototype.headers
	 * @property {Object}
	 */
	this.headers = {}; // This will be a MultiHash

	try
	{
		var headerCount = _request.GetHeaderCount();
		for (var i=0; i<headerCount; i++)
		{
			var name = _request.GetHeaderName(i);
			var value = _request.GetValueByOrd(i);
			Jaxer.Util.MultiHash.add(this.headers, name, value);
		}
	}
	catch (e)
	{
		this.constructorErrors.push("Error reading header properties: " + e);
	}
	
	if (log.getLevel() == Log.TRACE) log.trace("Constructing request from: " + uneval(this));
	
	/**
	 * A collection of the environment variables received from the web server for this request,
	 * as properties on this simple JavaScript object.
	 * If multiple variables had the same name, their values are given as an array.
	 * 
	 * @alias Jaxer.Request.prototype.env
	 * @property {Object}
	 */
	this.env = {}; // This will be a MultiHash

	try
	{
		var envCount = _request.GetEnvCount();
		for (var i = 0; i<envCount; i++)
		{
			var name = _request.GetEnvName(i);
			var value = _request.GetEnvValueByOrd(i);
			Jaxer.Util.MultiHash.add(this.env, name, value);
		}
	}
	catch (e)
	{
		this.constructorErrors.push("Error reading env variables: " + e);
	}
	
	/**
	 * Holds the parsed URL information of the current page, which on a callback
	 * is different from the original page.
	 * 
	 * @alias Jaxer.Request.prototype.current
	 * @property {Jaxer.Util.Url.ParsedUrl}
	 * @see Jaxer.Request.parsedUrl
	 */
	if ((typeof this.headers.Host == "string") && (typeof this.uri == "string"))
	{
		var uriIsAbsolutePath = (this.uri.charAt(0) == "/");
		if (uriIsAbsolutePath)
		{
			try
			{
				this.current = Util.Url.parseUrlComponents(this.headers.Host, this.uri, _request.isHTTPS ? 'https' : 'http');
			}
			catch (e)
			{
				this.constructorErrors.push("Error parsing the URL components, Host='" + this.headers.Host + "' and uri='" + this.uri + "': " + e);
			}
		}
		else
		{
			try
			{
				this.current = Util.Url.parseUrl(this.uri);
			}
			catch (e)
			{
				this.constructorErrors.push("Error parsing the URL, uri='" + this.uri + "': " + e);
			}
		}
	}
	if (!this.current) this.current = null;

	/**
	 * The folder (directory) on disk holding the file (pageFile) being served
	 * in this request. This is '' if there is no pageFile information, e.g. if
	 * the web server is on a different filesystem than Jaxer.
	 * 
	 * @alias Jaxer.Request.prototype.currentFolder
	 * @property {String}
	 */
	try
	{
		this.currentFolder = this.pageFile.replace(/[\/\\][^\/\\]*$/, '');
	}
	catch (e)
	{
		this.currentFolder = '';
		this.constructorErrors.push("Error constructing currentFolder property from pageFile=" + this.pageFile);
	}
	
	/**
	 * The body of this request (usually the payload of a POST request) as a string,
	 * which may be empty. For example, a GET request always has an empty body. 
	 * NOTE that when the contentType is 'multipart/form-data' this will
	 * always be '', indicating that the body of the request has been
	 * pre-processed by Jaxer and is instead available via the files and data
	 * properties.
	 * 
	 * @alias Jaxer.Request.prototype.bodyAsString
	 * @property {String}
	 */
	var _bodyAsString;
	this.__defineGetter__("bodyAsString", function() 
	{
		if (_bodyAsString == undefined)
		{
			if (_request.GetRawPostDataLength() > 0) 
			{
				_bodyAsString = _request.GetRawPostDataAsString();
			}
			else
			{
				_bodyAsString = '';
			}
		}
		return _bodyAsString; 
	});
	
	/**
	 * The Content-Type (i.e. mime-type) of the body of this request, which describes
	 * the body of this request. Usually this will be 'application/x-www-form-urlencoded'
	 * or 'multipart/form-data'.
	 * 
	 * @alias Jaxer.Request.prototype.contentType
	 * @property {String}
	 */
	this.__defineGetter__("contentType", function()
	{
		return this._request.GetRawPostDataContentType();
	});
	
	/** 
	 * The string used to identify the user agent of the client
	 * making the request.
	 * 
	 * @alias Jaxer.Request.prototype.userAgent
	 * @property {String}
	 */
	this.__defineGetter__("userAgent", function()
	{
		return this.headers['User-Agent'] || 'Unknown';
	});
	
	/**
	 * The Content-Length in bytes of the body of this request.
	 * NOTE that when the contentType is 'multipart/form-data' this will
	 * always return 0, indicating that the body of the request has been
	 * pre-processed by Jaxer and is instead available via the files and data
	 * properties.
	 * 
	 * @alias Jaxer.Request.prototype.contentLength
	 * @property {Number}
	 */
	this.__defineGetter__("contentLength", function()
	{
		return this._request.GetRawPostDataLength();
	});
	
	var _body;
	/**
	 * The body of the HTTP request, which usually contains the data during
	 * a POST request, and is often of type 'application/x-www-form-urlencoded'
	 * (i.e. "name1=value1&name2=value2&..."). The type of data returned by this 
	 * property depends on the Content-Type of the request and on Config.REQUEST_BODY_AS.
	 * @alias Jaxer.Request.prototype.body
	 * @property {Object}
	 */
	this.__defineGetter__("body", function() 
	{
		if (_body == undefined) 
		{
			_body = null;
			if (Config.REQUEST_BODY_AS && (typeof Config.REQUEST_BODY_AS == "object")) 
			{
				var contentType = this.contentType.toLowerCase();
				var values = Config.REQUEST_BODY_AS;
				for (var mimeTypePrefix in values) 
				{
					var value = values[mimeTypePrefix];
					if (typeof value != 'string') continue;
					if (contentType.indexOf(mimeTypePrefix.toLowerCase()) == 0) 
					{
						var matched;
						switch (value.toLowerCase())
						{
							case 'string':
								_body = this.bodyAsString;
								matched = true;
								break;
							case 'bytearray':
								_body = this.bodyAsByteArray;
								matched = true;
								break;
							case 'stream':
								_body = this.bodyAsStream;
								matched = true;
								break;
						}
						if (matched) break;
					}
				}
			}
		}
		return _body; 
	});
	
	/**
	 * The body of this request (usually the payload of a POST request) as a byte array,
	 * which may be empty. For example, a GET request always has an empty body. 
	 * 
	 * @alias Jaxer.Request.prototype.bodyAsByteArray
	 * @property {Number[]}
	 */
	var _bodyAsByteArray;
	this.__defineGetter__("bodyAsByteArray", function() 
	{
		if (_bodyAsByteArray == undefined) 
		{
			if (_request.GetRawPostDataLength() > 0) 
			{
				var baval = {};
				_request.GetRawPostDataAsByteArray({}, baval);
				_bodyAsByteArray = baval.value;
			}
			else
			{
				_bodyAsByteArray = [];
			}
		}
		return _bodyAsByteArray; 
	});
	
	/**
	 * The body of this request (usually the payload of a POST request) as a stream,
	 * which may be empty. For example, a GET request always has an empty body. 
	 * 
	 * @alias Jaxer.Request.prototype.bodyAsStream
	 * @property {Object}
	 */
	var _bodyAsStream;
	this.__defineGetter__("bodyAsStream", function() 
	{
		if (_bodyAsString == undefined)
		{
			if (_request.GetRawPostDataLength() > 0) 
			{
				_bodyAsStream = _request.GetRawPostDataAsInputStream();
			}
			else
			{
				_bodyAsStream = '';
			}
		}
		return _bodyAsStream; 
	});
	
	var data = {};
	var files = [];
	var paramIsBody = false;
	
	// First fill data from query string, which may also change how we will interpret the body (if any)
	if (this.current)
	{
		for (var p in this.current.queryParts)
		{
			data[p] = this.current.queryParts[p];
		}
		if (data.hasOwnProperty(Callback.PARAMS_AS) && data[Callback.PARAMS_AS] == Callback.PARAMS_AS_TEXT)
		{
			paramIsBody = true;
		}
	}
	
	// Now fill data from the request's body
	if (paramIsBody)
	{
		data[Callback.PARAMETERS] = [this.body];
	}
	else
	{
		try
		{
			for (var i = 0, dataItemCount = _request.GetDataItemCount(); i < dataItemCount; i++) 
			{
				var name = _request.GetDataItemName(i);
				var value = _request.GetDataItemValue(i);
				
				data[name] = value;
			}
		}
		catch (e)
		{
			this.constructorErrors.push("Error reading data items from Core: " + e);
		}
		try
		{
			for (var i=0, fileCount = _request.GetFileCount(); i<fileCount; i++) 
			{
				files.push(new FileInfo(_request, i));
			}
		}
		catch (e)
		{
			this.constructorErrors.push("Error reading file upload items from Core: " + e);
		}
	}
	
	/**
	 * An object holding the name=value pairs of the current request's body
	 * (assumed to be of type application/x-www-form-urlencoded) as properties
	 * 
	 * @alias Jaxer.Request.prototype.data
	 * @property {Object}
	 */
	this.data = data;

	/**
	 * An array of Jaxer.Request.FileInfo objects describing any uploaded files.
	 * You must call save(newFileName) on each of these if you'd like to save
	 * them, otherwise they will be purged at the end of the request.
	 * 
	 * @alias Jaxer.Request.prototype.files
	 * @property {Array}
	 * @see Jaxer.FileInfo.prototype.save
	 */
	this.files = files;

	/**
	 * True if the entire body of the request is to be considered as the
	 * single data parameter of this request.
	 * 
	 * @alias Jaxer.Request.prototype.paramIsBody
	 * @property {Boolean}
	 */
	this.paramIsBody = paramIsBody;
	
	/**
	 * The Jaxer.App object constructed by searching in configApps.js for an object that matches 
	 * the current request's parsedUrl and using it to set application-specific settings 
	 * (such as the database connection to use) during this request
	 * 
	 * @alias Jaxer.Request.prototype.app
	 * @property {Jaxer.App}
	 */
	this.app = null;

	/**
	 * A string used to identify what application the current request is asking for
	 * 
	 * @advanced
	 * @alias Jaxer.Request.prototype.appKey
	 * @property {String}
	 */
	this.appKey = null;

	/**
	 * A string used to identify what page in the application the current request is asking for
	 * 
	 * @advanced
	 * @alias Jaxer.Request.prototype.pageKey
	 * @property {String}
	 */
	this.pageKey = null;

	/**
	 * True if Jaxer is handling the current request as a callback (RPC).
	 * This requires Jaxer to be the handler of the request and the
	 * path of the request to start with Config.CALLBACK_URI (which must
	 * not be blank)
	 * @alias Jaxer.Request.prototype.isCallback
	 * @property {Boolean}
	 */
	this.isCallback = this.isHandler && 
		(this.current && 
		 Config.CALLBACK_URI &&
		 (this.current.path.indexOf(Config.CALLBACK_URI) == 0)
		);

	/**
	 * The "Referer", if any, of the request: the URL of the page that submitted
	 * the request
	 * 
	 * @alias Jaxer.Request.prototype.referer
	 * @property {String}
	 */
	var effectiveReferer = data[Callback.CALLING_PAGE] || this.headers.Referer;
	if (typeof effectiveReferer == "string")
	{
		try
		{
			this.referer = Util.Url.parseUrl(effectiveReferer);
		}
		catch (e)
		{
			this.constructorErrors.push("Error parsing the effective Referer URL '" + effectiveReferer + "': " + e);
		}
	}
	if (!this.referer) this.referer = null;
	
	/**
	 * Holds the parsed URL information of the true page: this is the current
	 * URL for a regularly-served page, but for a callback this is the URL of
	 * the original page (now the Referer) that requested the callback.
	 * 
	 * @alias Jaxer.Request.prototype.parsedUrl
	 * @property {Jaxer.Util.Url.ParsedUrl}
	 */
	if (this.isCallback) // callback page flow - we should have a referer
	{
		this.parsedUrl = this.referer;
		if (this.parsedUrl)
		{
			this.parsedUrlError = "";
		}
		else
		{
			var headerNames = [];
			
			for (var headerName in this.headers)
			{
				headerNames.push(headerName + "=" + this.headers[headerName]);
			}
			
			headerNames = headerNames.sort();

			this.parsedUrlError = "This is a callback but there was no '" + Callback.CALLING_PAGE + "' value in the callback request nor " +
				"a Referer in evt.Request.headers:\n" + headerNames.join("; ");
		}
	}
	else // normal (page) or service flow - we should have this.current
	{
		this.parsedUrl = this.current;
		
		if (this.parsedUrl)
		{
			this.parsedUrlError = "";
		}
		else
		{
			this.parsedUrlError = "This is not a callback and there was no evt.Request.uri and/or no evt.Request.headers.Host";
		}
	}
	
	/**
	 * Low-level method to evaluate a string of JavaScript source code in a
	 * given global context and with a certain effectiveUrl as its "file".
	 * 
	 * @alias Jaxer.Request.prototype.evaluateScript
	 * @param {String} contents
	 * 		The string of script code to evaluate
	 * @param {Object} [global]
	 * 		An optional global context (usually a window object) in which to
	 * 		evaluate it
	 * @param {String} [effectiveUrl]
	 * 		An optional parameter to indicate (e.g. in error messages) the
	 * 		effective URL from which this code originates.
	 * @return {Object}
	 * 		The result of the evaluation, if any
	 * @see Jaxer.Includer.evalOn
	 */
	this.evaluateScript = function evaluateScript(contents, global, effectiveUrl)
	{
		if (typeof contents != "string")
		{
			try
			{
				contents = String(contents);
			}
			catch (e)
			{
				throw new Exception("Non-string contents passed to Jaxer.Request.evaluateScript()");
			}
		}
		if (effectiveUrl == undefined)
		{
			effectiveUrl = "javascript:" + contents.substr(0, 60).replace(/\n/g, '\\n') + (contents.length > 60 ? '...' : ''); 
		}
		return _request.ExecuteJavascript(contents, effectiveUrl, global);
	}
	
	/**
	 * Low-level method to compile a string of JavaScript source code in a
	 * given global context and with a certain effectiveUrl as its "file".
	 * 
	 * @alias Jaxer.Request.prototype.compileScript
	 * @param {String} contents
	 * 		The string of script code to evaluate
	 * @param {Object} [global]
	 * 		An optional global context (usually a window object) in which to
	 * 		evaluate it
	 * @param {String} [effectiveUrl]
	 * 		An optional parameter to indicate (e.g. in error messages) the
	 * 		effective URL from which this code originates.
	 * @return {String}
	 * 		The compiled code
	 * @see Jaxer.Includer.compile
	 */
	this.compileScript = function compileScript(contents, global, effectiveUrl)
	{
		if (typeof contents != "string")
		{
			try
			{
				contents = String(contents);
			}
			catch (e)
			{
				throw new Exception("Non-string contents passed to Jaxer.Request.compileScript()");
			}
		}
		if (effectiveUrl == undefined)
		{
			effectiveUrl = "javascript:" + contents.substr(0, 60).replace(/\n/g, '\\n') + (contents.length > 60 ? '...' : ''); 
		}
		return _request.CompileScript(contents, effectiveUrl, global);
	}
	
	/**
	 * Low-level method to evaluate a string of compiled JavaScript code in a
	 * given global context.
	 * 
	 * @alias Jaxer.Request.prototype.evaluateCompiledScript
	 * @param {String} compiledContents
	 * 		The bytecode string of script code to evaluate
	 * @param {Object} [global]
	 * 		An optional global context (usually a window object) in which to
	 * 		evaluate it
	 * @return {Object}
	 * 		The result of the evaluation, if any
	 * @see Jaxer.Includer.evalCompiledOn
	 */
	this.evaluateCompiledScript = function evaluateCompiledScript(compiledContents, global)
	{
		if (typeof compiledContents != "string")
		{
			try
			{
				compiledContents = String(compiledContents);
			}
			catch (e)
			{
				throw new Exception("Non-string contents passed to Jaxer.Request.evaluateCompiledScript()", log);
			}
		}
		return _request.RunScript(compiledContents, global);
	}
	
}

/**
 * Create a string representation of all request header key/value pairs
 * 
 * @private
 * @alias Jaxer.Request.prototype.listHeaders
 * @param {String} [separator]
 * 		This optional parameter can be used to specify the string to use between
 * 		request header entries. If this value is not specified, then the string
 * 		"; " will be used
 * @return {String}
 * 		A string of all header key/value pairs
 */
Request.prototype.listHeaders = function listHeaders(separator)
{
	if (typeof separator == "undefined")
	{
		separator = "; ";
	}
	
	var headers = [];
	
	for (var headerName in this.headers)
	{
		headers.push(headerName + "=" + this.headers[headerName]);
	}
	
	headers = headers.sort();
	
	return headers.join(separator);
};

/**
 * @classDescription {Jaxer.Request.FileInfo} Container for information about
 * uploaded files.
 */

/**
 * A container for information about uploaded files. The constructor is not
 * meant to be called directly.
 * 
 * @advanced
 * @constructor
 * @alias Jaxer.Request.FileInfo
 * @param {Object} req
 * 		The Jaxer Core's request object
 * @param {Number} i
 * 		An index into the list of uploaded files
 * @return {Jaxer.Request.FileInfo}
 * 		Returns an instance of FileInfo.
 */
var FileInfo = function FileInfo(req, i)
{
	this.elementName = req.GetFileName(i);
	this.fileName = req.GetOriginalFileName(i);
	this.originalFileName = req.GetOriginalFileName(i);
	this.tempFileName = req.GetTmpFileName(i);
	this.contentType = req.GetFileContentType(i);
	this.fileSize = req.GetFileSize(i);
	this.index = i;
}

/**
 * The name of the field as specified in the HTML form
 * 
 * @alias Jaxer.Request.FileInfo.prototype.elementName
 * @property {String}
 */

/**
 * The original name of the file that was actually uploaded
 * from the user's filesystem
 * 
 * @alias Jaxer.Request.FileInfo.prototype.fileName
 * @property {String}
 */

/**
 * The original name of the file that was actually uploaded
 * from the user's filesystem
 * 
 * @alias Jaxer.Request.FileInfo.prototype.originalFileName
 * @property {String}
 */

/**
 * The name under which the file was temporarily saved
 * 
 * @alias Jaxer.Request.FileInfo.prototype.tempFileName
 * @advanced
 * @property {String}
 */

/**
 * The content type of this file, as reported by the web server
 * 
 * @alias Jaxer.Request.FileInfo.prototype.contentType
 * @property {String}
 */

/**
 * The size of the file contents, in bytes
 * 
 * @alias Jaxer.Request.FileInfo.prototype.fileSize
 * @property {Number}
 */

/**
 * An index into the list of uploaded files
 * 
 * @alias Jaxer.Request.FileInfo.prototype.index
 * @property {Number}
 */

/**
 * Save the uploaded file to the given path -- otherwise it will be
 * automatically purged after this request
 * 
 * @alias Jaxer.Request.FileInfo.prototype.save
 * @param {String} newFileName
 * 		The name (or full path) of the file to which the uploaded file should be
 * 		saved.
 */
FileInfo.prototype.save = function save(newFileName)
{
	var file = new Jaxer.File(this.tempFileName);
	var newFile = new Jaxer.File(newFileName);
	if (newFile.exists)
	{
		newFile.remove();
	}
	file.copy(newFileName);
}

/**
 * An enumeration of constants for various standard HTTP methods or actions 
 * 
 * @alias Jaxer.Request.ACTIONS
 * @property {Object}
 */
Request.ACTIONS = Web.ACTIONS;

/**
 * A constant describing the standard HTTP GET method (or action) 
 * 
 * @alias Jaxer.Request.ACTIONS.GET
 * @property {String}
 */
/**
 * A constant describing the standard HTTP POST method (or action) 
 * 
 * @alias Jaxer.Request.ACTIONS.POST
 * @property {String}
 */
/**
 * A constant describing the standard HTTP PUT method (or action) 
 * 
 * @alias Jaxer.Request.ACTIONS.PUT
 * @property {String}
 */
/**
 * A constant describing the standard HTTP DELETE method (or action) 
 * 
 * @alias Jaxer.Request.ACTIONS.DELETE
 * @property {String}
 */
/**
 * A constant describing the standard HTTP HEAD method (or action) 
 * 
 * @alias Jaxer.Request.ACTIONS.HEAD
 * @property {String}
 */
/**
 * A constant describing the standard HTTP OPTIONS method (or action) 
 * 
 * @alias Jaxer.Request.ACTIONS.OPTIONS
 * @property {String}
 */

frameworkGlobal.Request = Jaxer.Request = Request;

Jaxer.Log.trace("*** Request.js loaded");

})();


/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > Response.js
 */
coreTraceMethods.TRACE('Loading fragment: Response.js');
Jaxer.lastLoadedFragment = 'Response.js';

(function() {

var log = Log.forModule("Response");

/**
 * @classDescription {Jaxer.Response} Current response and its associated
 * information.
 */

/**
 * An instance of this object has the lifecycle of the current response and
 * contains information about it.
 * 
 * This constructor is typically never invoked by the user. During the processing
 * of the page Jaxer will create an instance of this object named Jaxer.response, 
 * this instance should be used to introspect and manage the response details.
 * 
 * @constructor
 * @alias Jaxer.Response
 * @param {Object} evt
 * 		The Jaxer Core event whose data is used to initialize this Response
 * 		object instance and to output to the client
 * @return {Jaxer.Response}
 * 		Returns an instance of Response.
 */
var Response = function Response(evt)
{

	var _response = evt.Response;
	this._response = _response; // For internal (Jaxer framework) use only -- APIs may change
	
	var _earlyExit = false;
	
	var hasDomBeenTouched = false;
	var hasSideEffect = false;
	var error = null;
	var errorLogged = false;
	var errorShown = false;
	var clientFrameworkOverridden = false;
	var overriddenClientFrameworkValue = undefined;
	var overriddenClientFrameworkIsSrc = false;
	var willSerializeDOM = true;
	
	// If a fatal error has already occurred, the DOM coming out of Jaxer
	// will surely be different than what went in
	if (Jaxer.fatalError) hasDomBeenTouched = true;
	
	this.allow = function allow(isAllowed)
	{
		_response.frameworkFailed = !Boolean(isAllowed);
	}
	
	/**
	 * This will be true when the document processing has been exited before
	 * reaching the end of the document, via the exit() method or another method
	 * such as redirect() which uses exit() internally. When that happens,
	 * some post-processing steps such as callback proxying will be omitted. 
	 * 
	 * @advanced
	 * @alias Jaxer.Response.prototype.earlyExit
	 * @property {Boolean}
	 */
	this.__defineGetter__("earlyExit", function() 
	{ 
		return this._earlyExit; 
	});
	
	/**
	 * Remembers that the DOM has been altered in some way, which ensures that
	 * the final response will be the Jaxer-produced one rather than the
	 * original document Jaxer received.
	 * 
	 * @advanced
	 * @alias Jaxer.Response.prototype.noteDomTouched
	 */
	this.noteDomTouched = function noteDomTouched()
	{
		hasDomBeenTouched = true;
	}
	
	/**
	 * Remembers that processing this page has had some side effect, which
	 * ensures that the final response will be treated as having been processed
	 * by Jaxer, whether or not its contents have been modified.
	 * 
	 * @advanced
	 * @alias Jaxer.Response.prototype.noteSideEffect
	 */
	this.noteSideEffect = function noteSideEffect()
	{
		hasSideEffect = true;
	}
	
	/**
	 * Has the DOM possibly been modified in any way?
	 * 
	 * @advanced
	 * @alias Jaxer.Response.prototype.getDomTouched
	 * @return {Boolean} 
	 * 		true if it has (or might have), false if it could not have been
	 */
	this.getDomTouched = function getDomTouched()
	{
		return hasDomBeenTouched;
	}
	
	/**
	 * Has there been any possible side effect (e.g. database accessed, etc.)?
	 * 
	 * @advanced
	 * @alias Jaxer.Response.prototype.getSideEffect
	 * @return {Boolean}
	 * 		true if there has been (or might have been), false if there could
	 * 		not have been
	 */
	this.getSideEffect = function getSideEffect()
	{
		return hasSideEffect;
	}
	
	/**
	 * A collection of the HTTP response headers that will be returned to the browser,
	 * as properties on this simple JavaScript object. 
	 * If multiple headers have the same name, their values are given as an array.
	 * NOTE: some headers are set by the web server after Jaxer is done, and they
	 * will not appear here.
	 * 
	 * @alias Jaxer.Response.prototype.headers
	 * @property {Object}
	 */
	this.headers = {}; // This will be a MultiHash

	var headerCount = _response.getHeaderCount();
	for (var i=0; i<headerCount; i++)
	{
		var name = _response.getHeaderName(i);
		var value = _response.getValueByOrd(i);
		Jaxer.Util.MultiHash.add(this.headers, name, value);
	}
	
	var originalHeaders = Jaxer.Util.clone(this.headers, true);
	
	/**
	 * Adds an HTTP header to the response. If an existing header with this name exists, 
	 * this value will be appended -- if you don't want that, just set
	 * Jaxer.response.headers[name] = value
	 * 
	 * @alias Jaxer.Response.prototype.addHeader
	 * @param {String} name
	 * 		The name of the HTTP header
	 * @param {String} value
	 * 		The value to use
	 */
	this.addHeader = function addHeader(name, value)
	{
		Jaxer.Util.MultiHash.add(this.headers, name, value);
	}
	
	/**
	 * Removes an HTTP header with a specific value from the response.
	 * If there is no such name-value pair, it does nothing.
	 * If an existing header with this name exists and has multiple values, 
	 * this value will be removed -- if you don't want that, just delete
	 * Jaxer.response.headers[name]
	 * 
	 * @alias Jaxer.Response.prototype.removeHeader
	 * @param {String} name
	 * 		The name of the HTTP header
	 * @param {String} value
	 * 		The value to remove
	 */
	this.removeHeader = function removeHeader(name, value)
	{
		Jaxer.Util.MultiHash.remove(this.headers, name, value);
	}
	
	/**
	 * Actually sets the name-value pairs on the underlying response object.
	 * This should be called automatically at the end of the procesing
	 * 
	 * @private
	 * @alias Jaxer.Response.prototype.persistHeaders
	 */
	this.persistHeaders = function persistHeaders()
	{
		var diff = Jaxer.Util.MultiHash.diff(this.headers, originalHeaders);
		var name;
		for (name in diff.deleted)
		{
			setHeaderValues(this, name, '');
		}
		for (name in diff.added)
		{
			setHeaderValues(this, name, String(diff.added[name]));
		}
		for (name in diff.changed)
		{
			setHeaderValues(this, name, String(diff.changed[name]));
		}
	}
	
	// A utility function
	function setHeaderValues(self, name, values)
	{
		self._response.deleteHeader(name);
		if (values || (values == 0))
		{
			if (!values.__parent__ || (values.constructor != values.__parent__.Array))
			{
				values = [values];
			}
			values.forEach(function(value)
			{
				self._response.addHeader(name, value, false);
			});
		}
	}
	
	/**
	 * Sets the contents (body) of the response. Once the response's contents
	 * are set this way, the DOM is no longer serialized into the response
	 * contents at the end of page processing.
	 * 
	 * @alias Jaxer.Response.prototype.setContents
	 * @param {String, XMLDocument, XML, Object} contents
	 * 		The contents to use for the body of the response. 
	 * 		If this is an XMLDocument or an E4X XML object, its string representation
	 * 		will be used, and a Content-Type header of "application/xml" will be returned;
	 * 		if this is another type of object, its JSON representation
	 * 		will be used, and a Content-Type header of "application/json" will be returned;
	 * 		otherwise the contents will be the String() of the passed-in value with no
	 * 		Content-Type impact.
	 * 		Note if a Content-Type header was already specified in this response, that will not
	 * 		be changed in any case.
	 * @param {Number} [statusCode]
	 * 		The integer value of the HTTP status code to return. 
	 * 		If 0 or null or not specified, it is not set.
	 * @param {String} [reasonPhrase]
	 * 		The string description of the HTTP status code to return.
	 * 		If the statusCode is 0 or null or not specified, the reasonPhrase is not set.
	 * 		Otherwise it defaults to the standard reason phrase for the statusCode
	 * 		("OK" for 200)
	 */
	this.setContents = function setContents(contents, statusCode, reasonPhrase)
	{
		willSerializeDOM = false;
		var htmlDocType = contents ? Util.findInGlobalContext("HTMLDocument", contents) : null;
		var htmlEltType = contents ? Util.findInGlobalContext("HTMLElement", contents) : null;
		
		var setContentType = false;
		if (contents == null || contents == undefined)
		{
			contents = '';
		}
		else if (typeof contents == 'xml') // e4x
		{
			contents = contents.toXMLString();
			setContentType = 'application/xml';
		}
		else if (contents.constructor == Util.findInGlobalContext("XMLDocument", contents))
		{
			var serializer = Util.findInGlobalContext("XMLSerializer", contents);
			contents = serializer.serializeToString(contents);
			setContentType = 'application/xml';
		}
		else if ((htmlDocType && (contents instanceof htmlDocType)) ||
				 (htmlEltType && (contents instanceof htmlEltType)) )
		{
			contents = Util.DOM.toHTML(contents);
			setContentType = 'text/html';
		}
		else if (typeof contents == "object")
		{
			contents = Serialization.toJSONString(contents, { as: Serialization.JAXER_METHOD });
			setContentType = 'application/json';
		}
		else
		{
			contents = String(contents);
		}
		
		if (statusCode)
		{
			this.setStatus(statusCode, reasonPhrase);
		}
		
		if ((typeof setContentType == "string") && !('Content-Type' in this.headers))
		{
			this.headers['Content-Type'] = setContentType;
		}
		
		_response.setContents(contents);
	}
	
	/**
	 * Sets the contents (body) of the response to the given binary (byte array) data. 
	 * Once the response's contents are set this way, the DOM is no longer serialized 
	 * into the response contents at the end of page processing.
	 * 
	 * @alias Jaxer.Response.prototype.setContentsBinary
	 * @param {Number[]} contents
	 * 		The contents to use for the body of the response. 
	 * 		It should be an array of numbers between 0 and 255, to be treated
	 * 		as a byte array.
	 * 		The data should be appropriate for the Content-Type header used in this response.
	 * @param {String} [contentType]
	 * 		The Content-Type to be used for this response. If this is not specified or
	 * 		is null, a Content-Type should be set separately.
	 * @param {Number} [statusCode]
	 * 		The integer value of the HTTP status code to return. 
	 * 		If 0 or null or not specified, it is not set.
	 * @param {String} [reasonPhrase]
	 * 		The string description of the HTTP status code to return.
	 * 		If the statusCode is 0 or null or not specified, the reasonPhrase is not set.
	 * 		Otherwise it defaults to the standard reason phrase for the statusCode
	 * 		("OK" for 200)
	 * @example
	 * 		<pre>
	 * 			// If the image is in your current folder rather than the default file location:
	 * 			var path = Jaxer.Dir.resolve("image.png", Jaxer.request.currentFolder);
	 * 			var file = new Jaxer.File(path);
	 * 			file.open('rb');
	 * 			var contents = file.read();
	 * 			file.close();
	 * 			Jaxer.response.setContentsBinary(contents, "image/png");
	 * 		</pre>
	 */
	this.setContentsBinary = function setContentsBinary(contents, contentType, statusCode, reasonPhrase)
	{
		willSerializeDOM = false;
		
		var setContentType = false;
		if (contents == null || contents == undefined)
		{
			contents = [];
		}
		else if (!Util.isArray(contents))
		{
			throw new Exception("For setContentsBinary, the contents must be a (byte) Array")
		}
		
		if (typeof contentType == "string")
		{
			setContentType = contentType;
		}
		
		if (statusCode)
		{
			this.setStatus(statusCode, reasonPhrase);
		}
		
		if ((typeof setContentType == "string"))
		{
			this.headers['Content-Type'] = setContentType;
		}
		
		_response.setBinaryContents(contents, contents.length);
	}
	
	/**
	 * Sets the contents (body) of the response to the given file. 
	 * The file's contents will be streamed directly back to the web server,
	 * chunk by chunk via the socket to the web server,
	 * without going through the Jaxer JavaScript framework.
	 * Once the response's contents are set this way, the DOM is no longer serialized 
	 * into the response contents at the end of page processing.
	 * 
	 * @alias Jaxer.Response.prototype.setContentsFile
	 * @param {String} path
	 * 		The path to the file on disk.
	 * 		The file should be appropriate for the Content-Type header used in this response.
	 * @param {String} [contentType]
	 * 		The Content-Type to be used for this response. If this is not specified or
	 * 		is null, it will be set from Jaxer.File.mimeType(path), unless that too returns a null.
	 * 		If so, then a Content-Type should be set separately.
	 * @param {Number} [statusCode]
	 * 		The integer value of the HTTP status code to return. 
	 * 		If 0 or null or not specified, it is not set.
	 * @param {String} [reasonPhrase]
	 * 		The string description of the HTTP status code to return.
	 * 		If the statusCode is 0 or null or not specified, the reasonPhrase is not set.
	 * 		Otherwise it defaults to the standard reason phrase for the statusCode
	 * 		("OK" for 200)
	 * @example
	 * 		<pre>
	 * 			// If the image is in your current folder rather than the default file location:
	 * 			var path = Jaxer.Dir.resolve("image.png", Jaxer.request.currentFolder);
	 * 			Jaxer.response.setContentsFile(path, "image/png");
	 * 		</pre>
	 */
	this.setContentsFile = function setContentsFile(path, contentType, statusCode, reasonPhrase)
	{
		willSerializeDOM = false;

		var setContentType = false;
		
		if (typeof path != "string")
		{
			throw new Exception("For setContentsFile, the path must be a string")
		}
		path = Dir.resolve(path);
		if (!File.exists(path))
		{
			throw new Exception("No file found at path: " + path);
		}
		
		if (typeof contentType != "string")
		{
			contentType = File.mimeType(path);
		}
		if (typeof contentType == "string")
		{
			setContentType = contentType;
		}
		
		if (statusCode)
		{
			this.setStatus(statusCode, reasonPhrase);
		}
		
		if ((typeof setContentType == "string"))
		{
			this.headers['Content-Type'] = setContentType;
		}
		
		_response.sendFile(path);
	}

	/**
	 * Gets the contents (body) of the response.
	 * For regular page requests, this will return null unless setContents has
	 * been called, in which case it will return the value set by the 
	 * last call to setContents.
	 * This should only be used for non-binary return types, i.e. it should
	 * not be used after calling setContentsBinary or setContentsFile.
	 * For callbacks, this should only be called at the
	 * very end of callback processing, when the contents have been explicitly
	 * set by the Jaxer framework using the setContents method.
	 * 
	 * @advanced
	 * @alias Jaxer.Response.prototype.getContents
	 * @return {String}
	 * 		The explicitly-set contents at this time, or null if no explicit
	 * 		contents have been set (so the DOM will be serialized if
	 * 		this is a regular page request).
	 */
	this.getContents = function getContents()
	{
		return (willSerializeDOM ? null : _response.contents);
	}
	
	/**
	 * Sets the HTTP status code and reason phrase for the response.
	 * By default 
	 * 
	 * @alias Jaxer.Response.prototype.setStatus
	 * @param {Number} [statusCode]
	 * 		The integer value of the HTTP status code.
	 * 		Defaults to 200
	 * @param {String} [reasonPhrase]
	 * 		The string description of the HTTP status code.
	 * 		Defaults to the standard reason phrase for the statusCode
	 * 		("OK" for 200)
	 */
	this.setStatus = function setStatus(statusCode, reasonPhrase)
	{
		statusCode = Util.Math.forceInteger(statusCode, 200); // 200: OK
		this._response.statusCode = statusCode;
		
		// HTTP Reason Phrase:
		if (typeof reasonPhrase != "string") 
		{
			reasonPhrase = this.statusCodeToReasonPhrase(statusCode);
		}
		this._response.statusPhrase = reasonPhrase;
	}
	
	/**
	 * Gets the integer value of the HTTP status code for the request
	 * 
	 * @alias Jaxer.Response.prototype.statusCode
	 * @property {Number}
	 */
	this.__defineGetter__("statusCode", function() 
	{ 
		return this._response.statusCode; 
	});
	
	/**
	 * Gets the string description of the HTTP status code for the request
	 * 
	 * @alias Jaxer.Response.prototype.reasonPhrase
	 * @property {String}
	 */
	this.__defineGetter__("reasonPhrase", function() 
	{ 
		return this._response.statusPhrase; 
	});
	
	/**
	 * Once this is called, the contents of the response will be the same as the
	 * contents that Jaxer received in this request, i.e. all DOM changes will
	 * be discarded. This is ONLY effective for regular requests, not callbacks.
	 * 
	 * @advanced
	 * @alias Jaxer.Response.prototype.useOriginalContents
	 */
	this.useOriginalContents = function useOriginalContents()
	{
		log.trace("Jaxer did not end up modifying this page or having any (known) side-effects - using original response in lieu of a Jaxer-generated one")
		_response.shouldUseOriginalContent = true;
	}
	
	/**
	 * Stops processing the current request's HTML page and JavaScript, and returns this
	 * response to the browser via the web server.
	 * 
	 * @alias Jaxer.Response.prototype.exit
	 * @param {Number} [statusCode]
	 * 		The HTTP status code to return to the browser: by default it is 200.
	 * @param {String, XMLDocument, XML} [contents]
	 * 		The contents to use for the body of the response. If this is null
	 * 		or undefined, and setContents has not been called on this response,
	 * 		the current DOM will be serialized and returned as the response contents.
	 * 		If this is an XMLDocument or an E4X XML object, its string representation
	 * 		will be used, and a Content-Type header of "application/xml" will be returned
	 * 		(unless a Content-Type header was already specified in this response)
	 * @param {String} [reasonPhrase]
	 * 		The text description (e.g. "OK") of the status code. For all the standard status codes
	 * 		this is optional, as the standard description for the status code will
	 * 		be used by default.
	 * @see Jaxer.Response.prototype.setContents
	 * @see Jaxer.Response.prototype.addHeader
	 * @see Jaxer.Response.prototype.redirect
	 * @see Jaxer.Response.prototype.statusCodeToReasonPhrase
	 */
	this.exit = function exit(statusCode, contents, reasonPhrase)
	{
		// response contents (body of response):
		if (contents != null && contents != undefined) 
		{
			this.setContents(contents);
		}
		
		// HTTP Status Code:
		statusCode = Util.Math.forceInteger(statusCode, 200); // 200: OK
		this.setStatus(statusCode, reasonPhrase);
		
		// Indicate the premature exit:
		_earlyExit = true;
		
		// Now stop DOM processing and JS processing
		Jaxer.request._request.StopRequest();
		Jaxer.request._request.Exit();
	}
	
	/**
	 * Stops processing the current request's HTML page and JavaScript, and returns
	 * a redirect-type HTTP response to the browser. No contents (response body)
	 * are returned to the browser, and the DOM is not serialized.
	 * 
	 * @alias Jaxer.Response.prototype.redirect
	 * @param {String} url
	 * 		The URL to which the browser should redirect the request. This is mandatory
	 * 		unless the Location header has already been set for this response.
	 * @param {Number} [statusCode]
	 * 		The HTTP status code to return to the browser: by default it is 307 (temporary redirect).
	 * @param {String} [reasonPhrase]
	 * 		The text description of the status code. For all the standard status codes
	 * 		this is optional, as the standard description for the status code will
	 * 		be used by default.
	 * @see Jaxer.Response.prototype.setContents
	 * @see Jaxer.Response.prototype.addHeader
	 * @see Jaxer.Response.prototype.exit
	 * @see Jaxer.Response.prototype.statusCodeToReasonPhrase
	 */
	this.redirect = function redirect(url, statusCode, reasonPhrase)
	{
		if (typeof url == "string")
		{
			this.addHeader("Location", url, true);
		}
		else
		{
			url = this.getHeader("Location");
			if (!url) 
			{
				throw new Exception("For a redirect, the Location header must have previously been set, or a string URL parameter must be specified");
			}
		}
		
		statusCode = Util.Math.forceInteger(statusCode, 307); // 307: Temporary Redirect

		log.trace("Redirecting to '" + url + "' with status code " + statusCode);
		this.exit(statusCode, '', reasonPhrase);
	}
	
	/**
	 * Returns the standard W3C reason phrase for the given standard status code.
	 * For example, passing in 200 returns "OK", and passing in 404 returns "Not Found".
	 * 
	 * @alias Jaxer.Response.prototype.statusCodeToReasonPhrase
	 * @param {Number} statusCode
	 * 		The status code, as an integer (or a string that can be parsed to an integer).
	 * 		If this is not a recognized status code, "Unknown Status Code" is returned.
	 */
	this.statusCodeToReasonPhrase = function statusCodeToReasonPhrase(statusCode)
	{
		statusCode = Util.Math.forceInteger(statusCode, -1);
		switch (statusCode)
		{
			case 100: return "Continue";
			case 101: return "Switching Protocols";
			case 200: return "OK";
			case 201: return "Created";
			case 202: return "Accepted";
			case 203: return "Non-Authoritative Information";
			case 204: return "No Content";
			case 205: return "Reset Content";
			case 206: return "Partial Content";
			case 300: return "Multiple Choices";
			case 301: return "Moved Permanently";
			case 302: return "Found";
			case 303: return "See Other";
			case 304: return "Not Modified";
			case 305: return "Use Proxy";
			case 307: return "Temporary Redirect";
			case 400: return "Bad Request";
			case 401: return "Unauthorized";
			case 402: return "Payment Required";
			case 403: return "Forbidden";
			case 404: return "Not Found";
			case 405: return "Method Not Allowed";
			case 406: return "Not Acceptable";
			case 407: return "Proxy Authentication Required";
			case 408: return "Request Time-out";
			case 409: return "Conflict";
			case 410: return "Gone";
			case 411: return "Length Required";
			case 412: return "Precondition Failed";
			case 413: return "Request Entity Too Large";
			case 414: return "Request-URI Too Large";
			case 415: return "Unsupported Media Type";
			case 416: return "Requested range not satisfiable";
			case 417: return "Expectation Failed";
			case 500: return "Internal Server Error";
			case 501: return "Not Implemented";
			case 502: return "Bad Gateway";
			case 503: return "Service Unavailable";
			case 504: return "Gateway Time-out";
			case 505: return "HTTP Version not supported";
			default: return "Unknown Status Code";
		}
	}
	
	/**
	 * Notifies the framework that an error has occurred during the handling of
	 * this request and generation of this response. How this is handled is then
	 * determined by the Jaxer.Config settings.
	 * 
	 * @alias Jaxer.Response.prototype.notifyError
	 * @param {Object} newError
	 * 		The error describing what happened. If the framework has already
	 * 		been notified of an error during the current request, this newError
	 * 		is not used.
	 * @param {Boolean} [avoidLogging]
	 * 		If this evaluates to true, an error message will not be logged
	 * 		during this call. Note that if an error message has been logged
	 * 		already in this request, another message will not be logged in any
	 * 		case.
	 */
	this.notifyError = function notifyError(newError, avoidLogging)
	{
		if (!error) 
		{
			error = newError || "Unspecified error";
		}
		if (!errorLogged && !avoidLogging)
		{
			errorLogged = true;
			log.error("Error processing this request: " + error);
		}
	}
	
	/**
	 * Has the framework been notified of an error during the handling of this
	 * request and generation of this response?
	 * 
	 * @alias Jaxer.Response.prototype.hasError
	 * @return {Boolean}
	 * 		True if an error was submitted.
	 */
	this.hasError = function hasError()
	{
		return error ? true : false;
	}
	
	/**
	 * Gets the error, if any, of which the framework has been notified during
	 * the handling of this request and generation of this response.
	 * 
	 * @alias Jaxer.Response.prototype.getError
	 */
	this.getError = function getError()
	{
		return error;
	}
	
	/**
	 * Notifies the framework that an error has already been reported in the output page
	 * so it need not be reported in the output page again.
	 * @alias Jaxer.Response.prototype.notifyErrorShown
	 */
	this.notifyErrorShown = function notifyErrorShown()
	{
		errorShown = true;
	}
	
	/**
	 * True if an error has already been reported in the output page
	 * so it need not be reported in the output page again.
	 * @alias Jaxer.Response.prototype.wasErrorShown
	 * @return {Boolean} True if notifyErrorShown() was called in this response, false otherwise.
	 */
	this.wasErrorShown = function wasErrorShown()
	{
		return errorShown;
	}

	/**
	 * Sets headers on this response to mark it as a dynamic one and avoid its
	 * being cached. This will always be called by the framework during callback
	 * processing. For regular (non-callback) requests, this will only be called
	 * by the framework if the DOM has been changed or a side-effect has (or
	 * could have) occurred during the processing of this request and the
	 * generation of the response.
	 * 
	 * @alias Jaxer.Response.prototype.setNoCacheHeaders
	 */
	this.setNoCacheHeaders = function setNoCacheHeaders()
	{
		log.trace("Setting no-cache headers");
		Jaxer.response.headers["Expires"] = "Fri, 23 May 1997 05:00:00 GMT";
		Jaxer.response.headers["Cache-Control"] = "no-cache, must-revalidate";
		Jaxer.response.addHeader("Cache-Control", "post-check=0, pre-check=0");
		Jaxer.response.headers["Pragma"] = "no-cache";
		delete Jaxer.response.headers["Last-Modified"];
		delete Jaxer.response.headers["ETag"];
	}
	
	/**
	 * If Jaxer.Config.EXPOSE_JAXER, this sets an "X-Powered-By" header on the
	 * response indicating that Jaxer processing has occurred and noting the
	 * build number.
	 * 
	 * @alias Jaxer.Response.prototype.exposeJaxer
	 */
	this.exposeJaxer = function exposeJaxer()
	{
		// Expose the Jaxer processing (in addition to any previous processors)
		if (Jaxer.Config.EXPOSE_JAXER) 
		{
			Jaxer.response.addHeader("X-Powered-By", "Jaxer/" + Jaxer.buildNumber + " (Aptana)");
		}
	}
	
	/**
	 * Overrides the automatic injection of the client framework into the
	 * response page. If neither src nor contents are given, then NO client
	 * framework is injected into the page. Make sure you do not rely
	 * (implicitly or explicitly) on the presence of the default Jaxer client
	 * framework if you call this method!
	 * 
	 * @alias Jaxer.Response.prototype.setClientFramework
	 * @param {String} [src]
	 * 		The url of the alternate client framework to use, if any. If this
	 * 		src argument is given, any contents argument will not be used.
	 * @param {String} [contents]
	 * 		The contents of the script block to use as an alternate client
	 * 		framework. If a src argument is specified, the contents argument
	 * 		will not be used.
	 */
	this.setClientFramework = function setClientFramework(src, contents)
	{
		clientFrameworkOverridden = true;
		if (src)
		{
			overriddenClientFrameworkIsSrc = true;
			overriddenClientFrameworkValue = src;
		}
		else
		{
			overriddenClientFrameworkIsSrc = false;
			overriddenClientFrameworkValue = contents; // May well be undefined
		}
	}
	
	/**
	 * Restores the use of the default client framework (using the Jaxer.Config
	 * settings), undoing any previous calls to setClientFramework().
	 * 
	 * @alias Jaxer.Response.prototype.resetClientFramework
	 */
	this.resetClientFramework = function resetClientFramework()
	{
		clientFrameworkOverridden = false;
		overriddenClientFrameworkIsSrc = false;
		overriddenClientFrameworkValue = undefined;
	}
	
	/**
	 * Checks whether the client framework has been overridden for this
	 * response, i.e. whether setClientFramework has been called.
	 * 
	 * @alias Jaxer.Response.prototype.isClientFrameworkOverridden
	 * @return {Boolean}
	 * 		true if the client framework is overridden, false otherwise
	 */
	this.isClientFrameworkOverridden = function isClientFrameworkOverridden()
	{
		return clientFrameworkOverridden;
	}
	
	/**
	 * Gets the parameters of the alternate client framework that will be
	 * injected into this response, if the default client framework has been
	 * overridden using setClientFramework().
	 * 
	 * @alias Jaxer.Response.prototype.getOverriddenClientFramework
	 * @return {Object}
	 * 		A JavaScript object with properties isSrc (Boolean indicating
	 * 		whether the value is the src or the contents of the script block to
	 * 		be injected) and value (the src or the contents).
	 */
	this.getOverriddenClientFramework = function getOverriddenClientFramework()
	{
		return clientFrameworkOverridden ? 
			{ isSrc: overriddenClientFrameworkIsSrc, value: overriddenClientFrameworkValue } : 
			null;
	}
	
}

frameworkGlobal.Response = Jaxer.Response = Response;

Jaxer.Log.trace("*** Response.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > CoreEvents.js
 */
coreTraceMethods.TRACE('Loading fragment: CoreEvents.js');
Jaxer.lastLoadedFragment = 'CoreEvents.js';

(function() {

var log = Log.forModule("CoreEvents");

/**
 * @namespace {Jaxer.CoreEvents} A namespace object holding functions and
 * members used to handle the events fired from the Jaxer Core into the Jaxer
 * Framework.
 */
var CoreEvents = {};

// private variables
var handlers = {};
var eventNames = ["SERVER_START", "REQUEST_START", "PARSE_START", "NEW_ELEMENT", "INIT_HEAD", "PARSE_COMPLETE", "REQUEST_COMPLETE", "HANDLE_PAGE", "HANDLE_CALLBACK", "HANDLE_SERVICE"];
for (var i=0; i<eventNames.length; i++)
{
	var eventName = eventNames[i];
	CoreEvents[eventName] = eventName;
	log.trace("Defining CoreEvents." + eventName);
	handlers[eventName] = [];
}

/**
 * Returns a (copy of the) array of framework event names to which you can
 * register handlers
 * 
 * @advanced
 * @alias Jaxer.CoreEvents.getEventNames
 * @return {Array}
 * 		n array of handler names (modifying it has no impact on CoreEvents)
 */
CoreEvents.getEventNames = function getEventNames()
{
	return eventNames.concat(); // returns a copy so the original is not externally modifiable
}

/**
 * Bind a handler to the specified eventType.
 * 
 * @advanced
 * @alias Jaxer.CoreEvents.addHandler
 * @param {String} eventType
 * 		One of the allowed event types (see Jaxer.CoreEvents.getEventNames)
 * @param {Function} handlerFunction
 * 		A function reference invoked when the event specified by eventType is triggered
 * @param {Function} [testFunction]
 * 		An optional function to be evaluated when the event is about to be
 * 		fired; it'll only be fired if the function evaluates to true. The one
 * 		argument passed to this function is the request (same as Jaxer.request)
 * @param {Object} [handlerFunctionObject]
 * 		Optional object on which to call the handlerFunction (it becomes the
 * 		value of 'this' within the function). 
 */
CoreEvents.addHandler = function addHandler(eventType, handlerFunction, testFunction, handlerFunctionObject)
{
	if (handlers.hasOwnProperty(eventType) == false) 
	{
		throw new Exception("Attempted to add a handler to an eventType for which there are no handler queues: " + eventType, log);
	}

	var handler = { handler: handlerFunction };
	handler.test = (testFunction ? testFunction : null);
	handler.object = (handlerFunctionObject ? handlerFunctionObject : null);
	
	log.trace("Adding a handler to " + eventType + ": " + handler.handler.toString().substr(0, 60) + "..."); // This may be verbose!
	handlers[eventType].push(handler);
	log.trace("Finished adding a handler");
};

/**
 * Remove an existing handler on an event type
 * 
 * @advanced
 * @alias Jaxer.CoreEvents.removeHandler
 * @param {String} eventType
 * 		One of the allowed event types (see Jaxer.CoreEvents.getEventNames)
 * @param {Function} handlerFunction
 * 		The handler to remove
 */
CoreEvents.removeHandler = function removeHandler(eventType, handlerFunction)
{
	if (handlers.hasOwnProperty(eventType) == false) 
	{
		throw new Exception("Attempted to add a handler to an eventType for which there are no handler queues: " + eventType, log);
	}
	log.trace("Removing a handler for " + eventType + ": " + handlerFunction.toString().substr(0, 60) + "..."); // This may be verbose!
	var removed = false;
	for (var i=handlers.length-1; i>=0; i--)
	{
		var handler = handlers[i].handler;
		if (handler == handlerFunction)
		{
			handlers.splice(i, 1); // remove the handler
			removed = true;
			break;
		}
	}
	if (removed)
	{
		log.warn("Did not find the handler to remove");
	}
	else
	{
		log.trace("Finished removing a handler");
	}
}

/**
 * Returns an array of handlers for the specified eventType.
 * 
 * @advanced
 * @alias Jaxer.CoreEvents.getHandlers
 * @param {String} eventType
 * 		One of the allowed event types (see Jaxer.CoreEvents.getEventNames)
 * @return {Array}
 * 		An array of handlers
 */
CoreEvents.getHandlers = function getHandlers(eventType)
{
	if (handlers.hasOwnProperty(eventType) == false)
	{
		throw new Exception("Invalid event queue specified: " + eventType, log);
	}
	
	return handlers[eventType];
};

/**
 * Removes the handlers for the specified eventType. 
 * 
 * @advanced
 * @alias Jaxer.CoreEvents.clearHandlers
 * @param {String} eventType
 * 		One of the allowed event types (see Jaxer.CoreEvents.getEventNames)
 */
CoreEvents.clearHandlers = function clearHandlers(eventType)
{
	var handlersForType = CoreEvents.getHandlers(eventType);
	
	handlersForType = [];
};

/**
 * Triggers the handlers for the specified eventType.

 * @advanced
 * @alias Jaxer.CoreEvents.fire
 * @param {String} eventType
 * 		One of the allowed event types (see Jaxer.CoreEvents.getEventNames)
 */
CoreEvents.fire = function fire(eventType)
{
	try 
	{
		if (Jaxer.fatalError &&
			eventType != CoreEvents.PARSE_START &&
			eventType != CoreEvents.PARSE_COMPLETE) // only these special events can deal with fatal errors meaningfully - TODO: verify this
		{
			Jaxer.notifyFatal("Aborting " + eventType + " due to Jaxer.fatalError: " + Jaxer.fatalError);
			return;
		}
		
		var evt = arguments[1];
		
		if (eventType == CoreEvents.REQUEST_START) 
		{
			Jaxer.lastScriptRunat = "";
		}
		
		if (log.getLevel() == Log.TRACE)
		{
			var msg = "At this time, ";
			if (evt.Request) msg += "evt.Request.isHandler=" + evt.Request.isHandler + " and ";
			msg += "eventType: " + eventType + (((eventType == CoreEvents.NEW_ELEMENT) && evt.Element) ? ' - ' + evt.Element.tagName : '');
			log.trace(msg);
		}
		
		var args = new Array(arguments.length - 1);
		for (var i = 1; i < arguments.length; i++) 
		{
			args[i - 1] = arguments[i];
		}
		
		if (eventType == CoreEvents.PARSE_COMPLETE)
		{
			if (Jaxer.request.isHandler) 
			{
				if (Jaxer.request.isCallback) 
				{
					fireEvent(CoreEvents.HANDLE_CALLBACK, args);
				}
				else if (Jaxer.request.app.handler)
				{
					fireEvent(CoreEvents.HANDLE_SERVICE, args);
				}
				else
				{
					Jaxer.response.notifyError("Jaxer is the handler for this request but it's not a callback or other recognized request type.\nJaxer.request: " + uneval(Jaxer.request));
					return;
				}
			}
			else 
			{
				fireEvent(CoreEvents.HANDLE_PAGE, args);
			}
		}
		
		fireEvent(eventType, args);

	} 
	catch (e) 
	{
		var eventName = (eventType == CoreEvents.NEW_ELEMENT && args.length > 2 && args[2].tagName) ? (CoreEvents.NEW_ELEMENT + " (" + args[2].tagName + ")") : String(eventType);
		var message = "Error during framework event " + eventName + ": " + e;
		if (typeof e.stack != "undefined")
		{
			message += "\n" + e.stack;
		}
		if (eventType == CoreEvents.SERVER_START || (!Jaxer.request)) 
		{
			Jaxer.notifyFatal(message);
		}
		else 
		{
			Jaxer.response.notifyError(message);
		}
	}
		
};

//var time;

function fireEvent(eventType, args)
{
//		switch (eventType)
//		{
//			case CoreEvents.REQUEST_START:
//				time = new Date().getTime();
//				break;
//			case CoreEvents.REQUEST_COMPLETE:
//				Jaxer.Log.info("Took: " + ((new Date().getTime()) - time) + " ms");
//				break;
//		}

		if (!handlers.hasOwnProperty(eventType)) 
		{
			throw new Exception("Attempted to fire an event for which there are no handler queues: " + eventType, log);
		}
		
		var handlersForType = CoreEvents.getHandlers(eventType);
		
		log.trace("Firing an event for " + eventType);
		
		for (var i = 0; i < handlersForType.length; i++) 
		{
			var handler = handlersForType[i].handler;
			var test = handlersForType[i].test;
			var object = handlersForType[i].object;
			
			if (!test || test(Jaxer.request)) 
			{
				log.trace("Calling event handler: " + handler.toString().substr(0, 60) + "..."); // This may be verbose!
				handler.apply(object, args);
			}
		}
}

/**
 * Should the given script element be evaluated (server-side) by Jaxer Core
 * rather than be handled separately by the Jaxer framework or be ignored by Jaxer
 * as far as evaluation goes. Note that if the script element has a src attribute
 * then the framework will inline a call to load the script from the src, and
 * that's why this method returns a true in that case.
 * 
 * @advanced
 * @alias Jaxer.CoreEvents.isScriptEvaluateEnabled
 * @param {Object} scriptElement
 * 		The DOM script element
 * @return {Boolean}
 * 		true if it should be evaluated, false if it should not
 */
CoreEvents.isScriptEvaluateEnabled = function isScriptEvaluateEnabled(scriptElement)
{
	var runat = scriptElement.getAttribute(RUNAT_ATTR);
	return (
		runat &&
		runat.match(RUNAT_ANY_SERVER_REGEXP)
		);
}

/**
 * Should the given script element be loaded and evaluated (server-side) by the Jaxer framework
 * 
 * @advanced
 * @alias Jaxer.CoreEvents.isScriptLoadEnabled
 * @param {Object} scriptElement
 * 		The DOM script element
 * @return {Boolean}
 * 		true if it should be loaded and valuated, false if it should not
 */
CoreEvents.isScriptLoadEnabled = function isScriptLoadEnabled(scriptElement)
{
	var runat = scriptElement.getAttribute(RUNAT_ATTR);
	var hasSrc = scriptElement.hasAttribute(SRC_ATTR);
	return (
		runat &&
		runat.match(RUNAT_ANY_SERVER_REGEXP) &&
		hasSrc);
}

frameworkGlobal.CoreEvents = Jaxer.CoreEvents = CoreEvents;

Jaxer.Log.trace("*** CoreEvents.js loaded");
	
})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > ServerStart.js
 */
coreTraceMethods.TRACE('Loading fragment: ServerStart.js');
Jaxer.lastLoadedFragment = 'ServerStart.js';

(function() {

var log = Log.forModule("ServerStart");
	
CoreEvents.clearHandlers(CoreEvents.SERVER_START); // Clear this out -- we're the first and only default handler

try
{
	CoreEvents.addHandler(CoreEvents.SERVER_START, function onServerStart(evt)
	{

		// Note that error handling configurations should be done first, so they can handle any errors in the remaining code:

		/**
		 * If Jaxer.Config.RESPONSE_ERROR_PAGE has been set, it's
		 * assumed to be the path to a file containing the error page
		 * to return when an error has occurred during the response.
		 * This file is read once at server startup and kept in memory,
		 * to be returned as required. 
		 * If Config.RESPONSE_ERROR_PAGE is not set, a default HTML
		 * string is used.
		 * You can change the behavior
		 * of the framework when it encounters errors serving requests
		 * using Jaxer.Config.DISPLAY_ERRORS.
		 * 
		 * @alias Jaxer.responseErrorPage
		 * @property {String}
		 */
		if (Config.RESPONSE_ERROR_PAGE) // used for errors encountered while processing a specific request to generate a response
		{
			Jaxer.responseErrorPage = File.read(Config.RESPONSE_ERROR_PAGE);
		}
		if (Jaxer.responseErrorPage == null)
		{
			Jaxer.responseErrorPage = '<html><head><title>Error</title></head><body><h2>Error processing your request</h2> This server is configured to not display errors on the browser. Further information may have been logged on the server.</body></html>';
		}
		
		/**
		 * If Jaxer.Config.FATAL_ERROR_PAGE has been set, it's
		 * assumed to be the path to a file containing the error page
		 * to return when a fatal error has occurred.
		 * This file is read once at server startup and kept in memory,
		 * to be returned as required. 
		 * If Config.FATAL_ERROR_PAGE is not set, a default HTML
		 * string is used.
		 * You can change the behavior
		 * of the framework when it encounters fatal errors
		 * using Jaxer.Config.DISPLAY_ERRORS.
		 * 
		 * @alias Jaxer.responseErrorPage
		 * @property {String}
		 */
		if (Config.FATAL_ERROR_PAGE) // used for fatal errors that stop the server from effectively processing any more requests
		{
			try
			{
				Jaxer.fatalErrorPage = File.read(Config.FATAL_ERROR_PAGE);
			}
			catch (e)
			{
				Jaxer.fatalErrorPage = null;
			}
		}
		if (Jaxer.fatalErrorPage == null)
		{
			Jaxer.fatalErrorPage = '<html><head><title>Server Error</title></head><body><h2>Server Error</h2> This server is configured to not display errors on the browser. Further information may have been logged on the server.</body></html>';
		}

		if (!Config.FRAMEWORK_DB)
		{
			var error = new Exception("The database connection parameters for the Jaxer framework have not been specified", log);
			Jaxer.notifyFatal(error);
			throw error;
		}

		try
		{
			loadConfigApps(Config.FRAMEWORK_DIR);
			if (typeof Config.LOCAL_CONF_DIR == "string") 
			{
				loadConfigApps(Config.LOCAL_CONF_DIR);
			}
			if (!(Config.DEFAULT_APP instanceof App)) Config.DEFAULT_APP = new App(Config.DEFAULT_APP);
			// Sanity check on the apps:
			if (!Config.apps || !(Config.apps instanceof Config.apps.__parent__.Array)) throw "Config.apps is not defined or is not an Array; please check all configApps.js files";
			Config.apps.forEach(function (app, index)
			{
				if (!app) throw "The app at position " + index + " of Config.apps is invalid; please check all configApps.js files";
				switch (typeof app.name)
				{
					case "string":
						var appName = String(app.name);
						if (appName == Config.DEFAULT_APP.name) throw "Cannot use application name of '" + appName + "' in Config.apps (it's reserved for the default); please check all configApps.js files";
						if (Config.appsByName[appName]) throw "Duplicate name '" + appName + "' found in Config.apps; please check all configApps.js files";
						Config.appsByName[appName] = new App(app);
						break;
					case "function": // The app will be determined dynamically when requests come in
						break;
					default:
						throw "The app at position " + index + " of Config.apps has no name or name function; please check all configApps.js files";
				}
			});
			
			DB.init();
					
			log.trace("About to create callbacks schema");
			createCallbacksSchema();
			
			log.trace("About to create container schema");
			Container.DBPersistor.createSchema();
			
			/**
			 * If Jaxer.Config.EMBEDDED_CLIENT_FRAMEWORK_SRC has been set, it's
			 * assumed to be the path to the embeddable (and usually compressed)
			 * version of the Jaxer client-side framework. This file is read
			 * once at server startup and kept in memory, to be embedded in
			 * pages that may require it. You can change this behavior
			 * using Jaxer.Response.prototype.setClientFramework.
			 * 
			 * @alias Jaxer.embeddedClientFramework
			 * @property {String}
			 */
			if (Config.EMBEDDED_CLIENT_FRAMEWORK_SRC) // embed the client framework in the page
			{
				log.trace("Reading embedded client framework source from: " + Config.EMBEDDED_CLIENT_FRAMEWORK_SRC);
				Jaxer.embeddedClientFramework = File.read(Config.EMBEDDED_CLIENT_FRAMEWORK_SRC);; 
				log.trace("Embedded client framework is " + Jaxer.embeddedClientFramework.length + " characters long");
			}
			else
			{
				Jaxer.embeddedClientFramework = null; // will need to get the client framework from the web server
			}
						
			Jaxer.loadAllExtensions();
		
		}
		catch (e)
		{
			var error = new Exception(e, log);
			Jaxer.notifyFatal(error);
			throw error;
		}
		
	});
}
catch (ex)
{
	throw new Exception("Could not add handler: " + ex.description, log);
}

/**
 * Creates the database schema needed by the framework.
 * 
 * @private
 */
function createCallbacksSchema()
{
	sql = "CREATE TABLE IF NOT EXISTS callback_page (" +
		" id INTEGER PRIMARY KEY AUTO_INCREMENT," +
		" crc32 INT(11) DEFAULT NULL," +
		" name VARCHAR(255) DEFAULT NULL," +
		" document_root VARCHAR(255) DEFAULT NULL," +
		" page_file VARCHAR(255) DEFAULT NULL," +
		" value LONGTEXT," + 
		" creation_datetime DATETIME DEFAULT NULL," +
		" access_datetime DATETIME DEFAULT NULL," +
		" access_count INT(11) DEFAULT 0" +
		")";
	DB.frameworkExecute(sql);
}

/**
 * Loads all files named like configApps.js found in the given folder 
 * 
 * @param {String} folderSpec
 * 		The folder to use, either as an absolute URL or relative to the executable folder
 * 
 * @private
 */
function loadConfigApps(folderSpec)
{
	var defaultRootUrl = Dir.pathToUrl(System.executableFolder);
	var absConfUrl = Web.resolve(folderSpec, defaultRootUrl);
	var confPathOnDisk = Dir.urlToPath(absConfUrl);
	var confFiles = Dir.grep(confPathOnDisk, 
	{
		pattern: '\\bconfigApps.js$',
		recursive: false
	});
	confFiles.sort(function(f1, f2)
	{
		if (f1 < f2) 
			return -1;
		if (f2 < f1) 
			return 1;
		return 0;
	}); // will load files in alphabetic order
	confFiles.forEach(function loadConfigApp(confFile)
	{
		var confFileUrl = Jaxer.Dir.pathToUrl(confFile.path);
		Jaxer.include(confFileUrl);
	});
	
}

Log.trace("*** ServerStart.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > RequestStart.js
 */
coreTraceMethods.TRACE('Loading fragment: RequestStart.js');
Jaxer.lastLoadedFragment = 'RequestStart.js';

(function() {

var log = Log.forModule("RequestStart");

CoreEvents.clearHandlers(CoreEvents.REQUEST_START); // Clear this out -- we're the first and only default handler

try
{
	
	CoreEvents.addHandler(CoreEvents.REQUEST_START, function onRequestStart(evt)
	{
		// Not much to do by default -- note we don't yet have a Request object
	});
	
}
catch (ex)
{
	throw new Exception("Could not add handler: " + ex.description, log);
}

Log.trace("*** RequestStart.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > InitHead.js
 */
coreTraceMethods.TRACE('Loading fragment: InitHead.js');
Jaxer.lastLoadedFragment = 'InitHead.js';

(function() {

var log = Log.forModule("InitHead");

CoreEvents.clearHandlers(CoreEvents.INIT_HEAD); // Clear this out -- we're the first and only default handler

try
{
	CoreEvents.addHandler(CoreEvents.INIT_HEAD, function onInitHead(evt, doc)
	{
		
		/**
		 * Loads a JavaScript file and evaluates it.
		 * 
		 * @alias Jaxer.load
		 * @param {String} src
		 * 		The URL from which the JavaScript file should be retrieved. If
		 * 		the src is an absolute file://... URL then it is retrieved
		 * 		directly from the file system, otherwise it is retrieved via a
		 * 		web request.
		 * @param {Object} [global]
		 * 		The global (usually a window object) on which to evaluate it. By
		 * 		default, it is the current window object of the page.
		 * @param {String} [runat]
		 * 		The value of the effective runat "attribute" to use when
		 * 		evaluating this code. By default, it uses the same runat
		 * 		attribute as the last evaluated script block.
		 * 
		 */
		Jaxer.load = function load(src, global, runat)
		{
			return Jaxer.Includer.load(src, global || Jaxer.pageWindow, runat); 
		}

		/**
		 * This starts out as null at the start of every request. If you set it to true,
		 * handlers for the onload event registered via addEventListener or
		 * window.onload will be called, regardless of Jaxer.Config.ONLOAD_ENABLED;
		 * if you set it to false, they will not be called, regardless of Jaxer.Config.ONLOAD_ENABLED.
		 * Thus, it is used to override Jaxer.Config.ONLOAD_ENABLED for the current request.
		 * 
		 * @alias Jaxer.onloadEnabled
		 * @property {Boolean}
		 */
		Jaxer.onloadEnabled = null;
		
		// On the server side, we need to tweak what certain basic JavaScript functionalities do:
		Jaxer.Overrides.applyAll(Jaxer.pageWindow);
		
		CallbackManager.initPage(Jaxer.pageWindow);

	});
	
}
catch (ex)
{
	throw new Exception("Could not add handler: " + ex.description, log);
}

Log.trace("*** InitHead.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > NewElement.js
 */
coreTraceMethods.TRACE('Loading fragment: NewElement.js');
Jaxer.lastLoadedFragment = 'NewElement.js';

(function() {

var log = Log.forModule("NewElement");

CoreEvents.clearHandlers(CoreEvents.NEW_ELEMENT); // Clear this out -- we're the first and only default handler

var tempLoads = {};

Jaxer.__tempLoad = {};

Jaxer.__tempLoad.set = function set(elt, src, global, runat, useCache, forceRefreshCache)
{
	var id = 'tempLoad_' + Math.random() + (new Date()).getTime();
	var contents = "Jaxer.__tempLoad.load('" + id + "')";
	elt.innerHTML = contents;

	var tempLoad = 
	{
		params: [src, global, runat, useCache, forceRefreshCache, false],
		elt: elt,
		src: src
	};
	tempLoads[id] = tempLoad;
	
	return tempLoad;
}

Jaxer.__tempLoad.load = function load(id)
{
	var tempLoad = tempLoads[id];
	var elt = tempLoad.elt;
	if (elt) 
	{
		elt.innerHTML = '';
	}
	log.trace("Loading src'ed script with [src, global, useCache, forceRefreshCache] = " + tempLoad.params);
	Includer.load.apply(null, tempLoad.params);
}

Jaxer.__tempLoad.clearAll = function clearAll()
{
	tempLoads = {};
}

try
{
	CoreEvents.addHandler(CoreEvents.NEW_ELEMENT, function onNewElement(evt, doc, elt)
	{
		switch (elt.tagName.toUpperCase())
		{
			case "SCRIPT":
				var src = elt.getAttribute(SRC_ATTR);
				var runat = elt.getAttribute(RUNAT_ATTR);
				var autoload = elt.hasAttribute(AUTOLOAD_ATTR) &&
					!elt.getAttribute(AUTOLOAD_ATTR).match(AUTOLOAD_ATTR_FALSE_REGEXP);
				log.trace("Received element: " + elt.tagName + 
					" with " + ((src == null) ? "no src" : "src='" + src + "'") +
					" and " + ((runat == null) ? "no runat" : "runat='" + runat + "'"));
				if (CoreEvents.isScriptEvaluateEnabled(elt) ||
					CoreEvents.isScriptLoadEnabled(elt)) // will Core be evaluating this script server-side?
				{                                        // if so, assume there could be a side-effect or DOM change
					Jaxer.response.noteDomTouched();
					Jaxer.response.noteSideEffect();
				}
				Jaxer.lastScriptRunat = runat;
				if (CoreEvents.isScriptLoadEnabled(elt)) 
				{
					
					if (runat.match(RUNAT_ANY_BOTH_REGEXP)) // create the client-only element in place
					{
						// The functions to be created should be tagged as server-only; the client ones will be created
						// directly on the client when the src file is loaded by the client directly.
						runat = runat.replace(RUNAT_BOTH_BASE, RUNAT_SERVER_BASE); 
					}

					if (autoload)
					{
						if (!src) 
						{
							log.warn("Could not autoload script without a valid " + SRC_ATTR + " attribute");
							autoload = false;
						}
						else if (runat.match(RUNAT_NO_CACHE_REGEXP)) 
						{
							log.warn("Could not autoload script " + src + " because its " + RUNAT_ATTR + " attribute indicates not to cache it");
							autoload = false;
						}
						else
						{
							src = Web.resolve(src);
						}
					}
					var useCache = autoload;
					var forceRefreshCache = autoload && Jaxer.Config.RELOAD_AUTOLOADS_EVERY_PAGE_REQUEST;
					
					Jaxer.__tempLoad.set(elt, src, Jaxer.pageWindow, runat, useCache, forceRefreshCache);
					
					if (autoload)
					{
						CallbackManager.addAutoload(src);
					}
				}
				break;
			case "JAXER:INCLUDE":
				var src = elt.getAttribute(SRC_ATTR);
				var path = elt.getAttribute("path");
				log.trace("Received element: " + elt.tagName + 
					" with " + ((src == null) ? "no src" : "src='" + src + "'") +
					" and " + ((path == null) ? "no path" : "path='" + path + "'"));
				Jaxer.response.noteDomTouched();
				Jaxer.response.noteSideEffect();
				Includer.includeElement(doc, elt);
				break;
		}
	});
}
catch (ex)
{
	throw new Exception("Could not add handler: " + ex.description, log);
}

Log.trace("*** NewElement.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > ParseComplete.js
 */
coreTraceMethods.TRACE('Loading fragment: ParseComplete.js');
Jaxer.lastLoadedFragment = 'ParseComplete.js';

(function() {

var log = Log.forModule("ParseComplete");

CoreEvents.clearHandlers(CoreEvents.PARSE_COMPLETE); // Clear this out -- we're the first and only default handler

try
{
	CoreEvents.addHandler(CoreEvents.PARSE_COMPLETE, function onParseComplete(evt, doc)
	{
		
		Jaxer.__tempLoad.clearAll();
		Jaxer.Sandbox.closeAll();

	});
	
}
catch (ex)
{
	throw new Exception("Could not add handler: " + ex.description, log);
}


Log.trace("*** ParseComplete.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > ParseStart.js
 */
coreTraceMethods.TRACE('Loading fragment: ParseStart.js');
Jaxer.lastLoadedFragment = 'ParseStart.js';

(function() {

var log = Log.forModule("ParseStart");

CoreEvents.clearHandlers(CoreEvents.PARSE_START); // Clear this out -- we're the first and only default handler

try
{
	
	CoreEvents.addHandler(CoreEvents.PARSE_START, function onParseStart(evt)
	{
		
		/**
		 * Contains information and methods about the current request
		 * 
		 * @alias Jaxer.request
		 * @property {Jaxer.Request}
		 */
		Jaxer.request = frameworkGlobal.request = new Jaxer.Request(evt);

		/**
		 * Contains information and methods about how to respond to the current
		 * request
		 * 
		 * @alias Jaxer.response
		 * @property {Jaxer.Response}
		 */
		Jaxer.response = frameworkGlobal.response = new Jaxer.Response(evt);
		
		var requestErrors = [];
		if (Jaxer.request.constructorErrors.length > 0)
		{
			requestErrors = Jaxer.request.constructorErrors;
		}
		if (Jaxer.request.parsedUrlError)
		{
			requestErrors.push(Jaxer.request.parsedUrlError);
		}
		
		if (requestErrors.length > 0) 
		{
			Jaxer.response.notifyError(new Error(requestErrors.join("; ")));
		}
		else 
		{

			// Determine application from request
			var app;
			var URL_TEST_PROPERTY = "urlTest";
			var parsedUrl = Jaxer.request.parsedUrl;
			if (log.getLevel() == Log.TRACE) log.trace("Matching app using parsedUrl='" + uneval(parsedUrl) + "'");
			for (var iApp=0, appsLen = Config.apps.length; iApp<appsLen; iApp++)
			{
				var candidate = Config.apps[iApp];
				var matched = false;
				if (candidate && candidate[URL_TEST_PROPERTY])
				{
					switch (typeof candidate[URL_TEST_PROPERTY])
					{
						case "function":
							matched = candidate[URL_TEST_PROPERTY](parsedUrl);
							break;
						case "string":
							matched = (parsedUrl.path.indexOf(candidate[URL_TEST_PROPERTY]) == 0);
							break;
						case "object":
							if (candidate[URL_TEST_PROPERTY] instanceof candidate[URL_TEST_PROPERTY].__parent__.RegExp)
							{
								matched = candidate[URL_TEST_PROPERTY].test(parsedUrl.path);
							}
							break;
					}
				}
				if (matched)
				{
					app = candidate;
					break;
				}
			}
			Config.DEFAULT_APP.init();
			app = app ? new App(app) : Config.DEFAULT_APP;
			Jaxer.request.app = app;
			if (log.getLevel() == Log.TRACE) log.trace("Using app '" + app.NAME + "': urlTest = " + app[URL_TEST_PROPERTY]);
			
			// Determine app and page keys from request
			Jaxer.request.appKey = app.APP_KEY;
			if (!Jaxer.request.appKey) throw "Could not calculate an application key from url: " + Jaxer.request.parsedUrl.url;
			Jaxer.request.pageKey = app.PAGE_KEY;
			if (!Jaxer.request.pageKey) throw "Could not calculate a page key from url: " + Jaxer.request.parsedUrl.url;
	
			// Initialize containers for storing/retrieving state
			Container.init(Jaxer.request.appKey, Jaxer.request.pageKey);
			DB.setDefault(app.NAME, app.DB);

		}
		
	});
	
}
catch (ex)
{
	throw new Exception("Could not add handler: " + ex.description, log);
}


Log.trace("*** ParseStart.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > HandlePage.js
 */
coreTraceMethods.TRACE('Loading fragment: HandlePage.js');
Jaxer.lastLoadedFragment = 'HandlePage.js';

(function() {

var log = Log.forModule("HandlePage");

CoreEvents.clearHandlers(CoreEvents.HANDLE_PAGE); // Clear this out -- we're the first and only default handler

try
{
	CoreEvents.addHandler(CoreEvents.HANDLE_PAGE, function onHandlePage(evt, doc)
	{
		
		// When modifying this, don't forget to think about premature exits from page processing
		// (Jaxer.request.exit(), e.g.) which result in this not being called
		
		if (checkErrors(doc)) 
		{
			// set response headers even though we'll be returning an error of some sort
			Jaxer.response.setNoCacheHeaders();
			Jaxer.response.exposeJaxer();
		}
		else 
		{
			try 
			{
				if (!Jaxer.response.earlyExit) 
				{
				
					log.trace("Processing onserverload with doc = " + doc);
					processOnServerLoad(doc);
					
					// process script blocks
					log.debug("Script processing starting");
					var scriptsInfo = CallbackManager.processCallbacks(doc);
					log.debug("Script processing complete");
					
					processAfterCallbackProcessing(doc);
					
					CallbackManager.cleanup(scriptsInfo);
					
				}

				// persist containers
				Container.persistAll(doc);
				log.trace("Containers persisted");
			} 
			catch (e) 
			{
				Jaxer.response.notifyError(e); // No need to throw again -- we'll handle it in a moment as long as we've done anything in this response
			}
		}
		
		if (Jaxer.response.getDomTouched() || Jaxer.response.getSideEffect()) 
		{
			// set any other response headers on this dynamic, Jaxer-processed contents
			Jaxer.response.setNoCacheHeaders();
			Jaxer.response.exposeJaxer();
		}

		if (!checkErrors(doc) && Jaxer.response.getDomTouched()) 
		{
			try 
			{
				// embed, or emit reference to, the client framework
				// This must come at the end, so Jaxer ends up being defined at the very beginning.
				var head = doc.getElementsByTagName("head")[0];
				if (head && !Jaxer.response.earlyExit)
				{
					var lastInsertedScript;
					if (Jaxer.response.isClientFrameworkOverridden()) 
					{
						var overrideCF = Jaxer.response.getOverriddenClientFramework();
						if (overrideCF.isSrc)
						{
							lastInsertedScript = Util.DOM.insertScriptAtBeginning("", head, { src: overrideCF.value });
						}
						else if (overrideCF.value)
						{
							lastInsertedScript = Util.DOM.insertScriptAtBeginning(overrideCF.value, head);
						}
						else
						{
							lastInsertedScript = null;
						}
					}
					else 
					{
						if (Jaxer.embeddedClientFramework) 
						{
							lastInsertedScript = Util.DOM.insertScriptAtBeginning(Jaxer.embeddedClientFramework, head);
						}
						else 
							if (Config.CLIENT_FRAMEWORK_SRC) 
							{
								var src = Config.CLIENT_FRAMEWORK_SRC.replace(/#.*$/, ''); // strip off fragment, if any
								src += (src.match(/\?/) ? "&" : "?") + "version=" + Jaxer.buildNumber;
								lastInsertedScript = Util.DOM.insertScriptAtBeginning("", head, { src: src });
							}
							else 
							{
								throw new Exception("Could not insert the client part of the Jaxer framework: please check EMBEDDED_CLIENT_FRAMEWORK_SRC and CLIENT_FRAMEWORK_SRC in your Jaxer configuration");
							}
					}
					if (Jaxer.beforeClientFramework)
					{
						for (var iScript=Jaxer.beforeClientFramework.length-1; iScript>=0; iScript--) // iterate in reverse order since we're always inserting at the beginning
						{
							var scriptInfo = Jaxer.beforeClientFramework[iScript];
							var script = Util.DOM.insertScriptAtBeginning(scriptInfo.contents || '', head, scriptInfo.src ? { src: scriptInfo.src } : null);
							lastInsertedScript |= script;
						}
					}
					if (Jaxer.afterClientFramework)
					{
						for (var iScript=0; iScript<Jaxer.afterClientFramework.length; iScript++)
						{
							var scriptInfo = Jaxer.afterClientFramework[iScript];
							if (lastInsertedScript)
							{
								lastInsertedScript = Util.DOM.insertScriptAfter(scriptInfo.contents || '', lastInsertedScript, scriptInfo.src ? { src: scriptInfo.src } : null);
							}
							else
							{
								lastInsertedScript = Util.DOM.insertScriptAtBeginning(scriptInfo.contents || '', head, scriptInfo.src ? { src: scriptInfo.src } : null);
							}
						}
					}
				}
				
				// move all meta tags that specify Content-Type and a charset to the beginning of the head element:
				var metas = Array.slice(doc.getElementsByTagName("meta"));
				metas.forEach(function moveMeta(meta)
				{
					if ((meta.getAttribute("http-equiv") == "Content-Type") &&
						(typeof meta.getAttribute("content") == "string") &&
						(/charset\=/.test(meta.getAttribute("content"))))
					{
						head.insertBefore(meta, head.firstChild);
					}
				});
			} 
			catch (e) 
			{
				Jaxer.response.notifyError(e); // No need to throw again -- we'll handle it in the next line
				checkErrors(doc);
			}
		}
		
		if (Jaxer.response.getDomTouched() || Jaxer.response.getSideEffect())
		{
			try
			{
				Jaxer.DB.closeAllConnections(true);
			}
			catch (e) 
			{
				Jaxer.response.notifyError(e); // No need to throw again -- we'll handle it in the next line
				checkErrors(doc);
			}
		}

		if (Jaxer.response.getDomTouched())
		{
			Jaxer.response.persistHeaders();
		}
		else
		{
			Jaxer.response.useOriginalContents();
		}
		
		// If we made it this far, we'll have some reasonable DOM to serialize and return;
		// If something exited prematurely, at least we won't throw bad data to the browser.
		Jaxer.response.allow(true); 
			
	});
	
}
catch (ex)
{
	throw new Exception("Could not add handler: " + ex.description, log);
}

/**
 * Do the right thing if the developer specified an onserverload handler for
 * this page.
 * 
 * @private
 * @param {DocumentElement} doc
 * 		The document whose onserverload (if any) is to be processed
 */
function processOnServerLoad(doc)
{
	processLoadEvent("serverload", doc, true);
	var pageOnloadEnabled = Jaxer.pageWindow.Jaxer.onloadEnabled;
	if (pageOnloadEnabled == true || 
		(Config.ONLOAD_ENABLED && (pageOnloadEnabled != false)))
	{
		processLoadEvent("load", doc, false);
	}
}

/**
 * Do the right thing if the developer specified an onaftercallbackprocessing handler for
 * this page
 * 
 * @private
 * @param {DocumentElement} doc
 * 		The document whose aftercallbackprocessing (if any) is to be processed
 */
function processAfterCallbackProcessing(doc)
{
	processLoadEvent("aftercallbackprocessing", doc, true);
}

/**
 * Process various load events (common wrapper for onserverload and
 * aftercallbackprocessing and others in the future)
 * 
 * @private
 * @param {String} eventname
 * 		The name of the event to be processed. This is WITHOUT the "on" prefix.
 * @param {DocumentElement} doc
 * 		The document whose onserverload (if any) is to be processed
 * @param {Boolean} removeBodyAttribute
 * 		If true, any body attribute with "on" + eventname will be stripped off.
 */
function processLoadEvent(eventname, doc, removeBodyAttribute)
{
	log.trace("Processing load event '" + eventname + "' with doc = " + doc);
	
	// Note: we remove the attribute from the body tag, if we find it, but we leave it
	// up to Jaxer Core to have registered the value as an event listener
	var oneventname = "on" + eventname;
	if (removeBodyAttribute && doc.body && doc.body.hasAttribute(oneventname))
	{
		doc.body.removeAttribute(oneventname);
		Jaxer.response.noteDomTouched();
	}
	
	var event = Jaxer.pageWindow.document.createEvent("Events");
	event.initEvent(eventname, false, false);
	Jaxer.pageWindow.dispatchEvent(event);
}

/**
 * Check for fatal or response errors, and change the DOM accordingly
 * 
 * @private
 * @return {Boolean}
 * 		true if there were any (so further processing should be stopped), false
 * 		otherwise
 */
function checkErrors(doc)
{
	if (Jaxer.fatalError) // say goodbye and go home
	{
		if (!Jaxer.response.wasErrorShown()) 
		{
			Jaxer.response.notifyErrorShown();
			if (Config.DISPLAY_ERRORS && doc && doc.body) 
			{
				var container = doc.createElement("pre");
				container.setAttribute("style", 'border: 1px solid red; background-color:wheat; font-weight:bold; padding: 4px');
				container.innerHTML = 
					[
						  "Fatal Jaxer error: " + Jaxer.fatalError
						, "(Please see the Jaxer log for more details)"
						, "After fixing the problem, you may need to force the browser to reload this page not from its cache"
					].join("<br/>\n");
				doc.body.insertBefore(container, doc.body.firstChild);
			}
			else
			{
				Jaxer.response.setContents(Jaxer.fatalErrorPage);
			}
		}
		return true;
	}
	
	if (Jaxer.response.hasError()) // say goodbye for this request and go home
	{
		Jaxer.DB.closeAllConnections();
		if (!Jaxer.response.wasErrorShown()) 
		{
			Jaxer.response.notifyErrorShown();
			if (Config.DISPLAY_ERRORS && doc && doc.body) 
			{
				var container = doc.createElement("pre");
				container.setAttribute("style", 'border: 1px solid red; background-color:wheat; font-weight:bold; padding: 4px');
				container.innerHTML = 
					[
						   "Jaxer error processing request: " + Jaxer.response.getError()
						 , "(Please see the Jaxer log for more details)"
						 , "&nbsp;"
						 , "<div style='color: red; font-weight: bold'>CAUTION: Config.DEV_MODE and Config.DISPLAY_ERRORS should be <i>false</i> in production mode</div>"
					].join("<br/>\n");
				doc.body.insertBefore(container, doc.body.firstChild);
			}
			else
			{
				Jaxer.response.setContents(Jaxer.responseErrorPage);
			}
		}
		return true;
	}
	
	return false;
}

Log.trace("*** HandlePage.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > HandleCallback.js
 */
coreTraceMethods.TRACE('Loading fragment: HandleCallback.js');
Jaxer.lastLoadedFragment = 'HandleCallback.js';

(function() {
	
var log = Log.forModule("HandleCallback");

// private constants
var METHOD_NAME = "methodName";
var RESULT_AS = "resultAs";
var RESULT_AS_TEXT = "text";
var RESULT_AS_OBJECT = "object";
var RESULT_AS_WRAPPED_OBJECT = "wrappedObject";
var NULL_AS_TEXT = ""; // What to return if the POSTPROCESS is POSTPROCESS_ASTEXT and the result is null or an exception
var NO_TOSTRING_AS_TEXT = ""; // What to return if the POSTPROCESS is POSTPROCESS_ASTEXT and the result has no toString() method
// global constants
var Callback = {};
Callback.PAGE_SIGNATURE = "pageSignature";
Callback.PAGE_NAME = "pageName";
Callback.PARAMETERS = "params";
Callback.PARAMS_AS = "paramsAs";
Callback.PARAMS_AS_TEXT = "text";
Callback.PARAMS_AS_OBJECT = "object";
Callback.PARAMS_AS_ARGUMENTS = "default";
Callback.CALLING_PAGE = "callingPage";

CoreEvents.clearHandlers(CoreEvents.HANDLE_CALLBACK); // Clear this out -- we're the first and only default handler

// add the framework's CALLBACK event handler
CoreEvents.addHandler(CoreEvents.HANDLE_CALLBACK, function onHandleCallback(evt, doc)
{

	log.trace("=== Callback processing initializing");
	
	Jaxer.response.allow(true);
	Jaxer.response.setNoCacheHeaders(); // We always want to avoid caching and get the callback
	Jaxer.response.exposeJaxer();

	// On a callback, the following need to be set from the database, which we do further below
	Jaxer.request.pageFile = "";
	Jaxer.request.documentRoot = "";

	var window = Jaxer.pageWindow;
	
	log.trace("Main callback processing starting");
	var result = null;
	var exception = null;
	
	try
	{
		var info = {};
		var functionName = null;
		var args = [];
		var crc32 = null;
		var pageName = null;
		var resultAs = null;
		
		if (log.getLevel() == Log.TRACE) log.trace("Received Jaxer.request: " + uneval(Jaxer.request));
		
		// First fill info with data from GET and/or POST request data
		var requestData = Jaxer.request.data;
		for (var p in requestData)
		{
			info[p] = Jaxer.request.data[p];
		}
		
		// Now extract data from info to specific fields: functionName, args, etc.
		if (info.hasOwnProperty(METHOD_NAME))
		{
			functionName = info[METHOD_NAME];
		}
		// PARAMS_AS_ARGUMENTS is the default and needs no special handling;
		// PARAMS_AS_OBJECT is handled here
		// PARAMS_AS_TEXT has already been handled in creating the current Request()
		var paramIsQuery = (info.hasOwnProperty(Callback.PARAMS_AS) && info[Callback.PARAMS_AS] == Callback.PARAMS_AS_OBJECT);
		if (paramIsQuery)
		{
			delete info[Callback.PARAMETERS];
			args = [info];
		}
		else if (info.hasOwnProperty(Callback.PARAMETERS))
		{
			if (info[Callback.PARAMETERS].constructor == info[Callback.PARAMETERS].__parent__.Array)
			{
				args = info[Callback.PARAMETERS];
			}
			else
			{
				args = Serialization.fromJSONString(info[Callback.PARAMETERS], {as: Serialization.JAXER_METHOD});
			}
		}
		if (info.hasOwnProperty(Callback.PAGE_SIGNATURE)) // get the signature of the callback contents
		{
			crc32 = info[Callback.PAGE_SIGNATURE];
		}
		if (info.hasOwnProperty(Callback.PAGE_NAME)) // get the name of the page that created the callback contents
		{
			pageName = info[Callback.PAGE_NAME];
		}
		if (info.hasOwnProperty(RESULT_AS))
		{
			resultAs = info[RESULT_AS];
		}
		
		// We might need the above parameters to know how to return the result, even if there's a fatal error
		if (Jaxer.fatalError)
		{
			throw "Fatal Jaxer error: " + Jaxer.fatalError;
		}
		
		// We might need the above parameters to know how to return the result, even if there's a response error
		if (Jaxer.response.hasError())
		{
			throw "Jaxer response error (before callback itself was called): " + Jaxer.response.getError();
		}
		
		// Next, reconstruct environment and call the callback
		if (functionName !== null && args !== null && crc32 && pageName)
		{
			var isPageCached = CallbackManager.isCallbackPageCached(pageName, crc32);
			
			// grab all functions in our callback page that are not being called
			var rs = DB.frameworkExecute("SELECT " + (isPageCached ? "" : "value, ") + "document_root, page_file, access_count FROM callback_page WHERE name=? AND crc32=?",
				[pageName, crc32]);
			
			if (rs.rows.length > 0)
			{
				var callbackRow = rs.rows[0];
				Jaxer.request.documentRoot = callbackRow.document_root;
				Jaxer.request.pageFile = callbackRow.page_file;
				log.debug("Setting [Jaxer.request.documentRoot, Jaxer.request.pageFile] = " + [Jaxer.request.documentRoot, Jaxer.request.pageFile]);
				
				Jaxer._autoload = function _autoload(autoloads)
				{
					log.debug("Restoring autoloads: " + autoloads);
					autoloads.forEach(function autoload(src)
					{
						try
						{
							var useCache = true;
							var forceCacheRefresh = false;
							var dontSetRunat = true;
							Includer.load(src, window, null, useCache, forceCacheRefresh, dontSetRunat);
						}
						catch (e)
						{
							throw new Error("Error during autoloading of src = '" + src + "': " + e);
						}
					});
				}
				
				if (!isPageCached)
				{
					log.debug("Callbacks found in DB but not in cache, restoring to cache using pageName=" + pageName + " and crc32=" + crc32);
					CallbackManager.cacheCallbackPage(pageName, crc32, callbackRow.value);
				}
				var cachedSource = CallbackManager.getCachedCallbackPage(pageName, crc32);
				if (Config.CACHE_USING_SOURCE_CODE)
				{
					if (log.getLevel() == Log.TRACE) log.trace("Evaluating: " + cachedSource);
					Includer.evalOn(cachedSource, window);
				}
				else
				{
					Includer.evalCompiledOn(cachedSource, window);
				}
				
				var accessCount = callbackRow.access_count - 0;
				accessCount++;
				log.trace("Updating access count to " + accessCount);
				
				try
				{
					DB.frameworkExecute("UPDATE callback_page SET access_datetime=?, access_count=? WHERE name=? AND crc32=?",
						[new Date(), accessCount, pageName, crc32]);
				}
				catch(e)
				{
					log.error(e + " [ignoring]");
				}

				if (window.hasOwnProperty("oncallback"))
				{
					try
					{
						log.debug("Executing oncallback");
						window.oncallback();
					}
					catch (e)
					{
						throw new Error("Error during oncallback: " + e);
					}
				}
				
				if (window.hasOwnProperty(functionName))
				{
					var func = window[functionName];
					if (typeof func == "function")
					{
						if (func.hasOwnProperty(PROXY_ATTR) && func[PROXY_ATTR])
						{
							try
							{
								log.debug("About to execute: " + func.name + " with " + args.length + " arguments");
								if (log.getLevel() == Log.TRACE) log.trace("Arguments: " + uneval(args));
								result = func.apply(null, args);
							}
							catch (e)
							{
								throw (e instanceof ClientError) ? e : Exception.toError(e);
							}
						}
						else
						{
							throw new Error("Function '" + functionName + "' was not marked as callable");
						}
					}
					else
					{
						throw new Error("Property '" + functionName + "' is not of type 'function' but rather '" + (typeof func) + "'");
					}
				}
				else
				{
					throw new Error("Could not locate function: " + functionName);
				}
			}
			else
			{
				throw new Error("Unable to locate callback page for name = " + pageName + " and crc32 = " + crc32);
			}
		}
		else
		{
			throw new Error("Missing function name and/or arguments and/or page name or signature");
		}
	}
	catch(e)
	{
		if (e instanceof ClientError)
		{
			exception = e;
			if (log.getLevel().isAtOrBelow(Log.DEBUG)) log.debug("ClientError being thrown: " + uneval(e));
		}
		else
		{
			exception = new Exception(e); // This will log it 
		}
	}
	// Finally, in any case, package the results
	finally
	{
		
		if ((exception != null) && !Config.DISPLAY_ERRORS && !(exception instanceof ClientError))
		{
			log.debug("An error not of type ClientError occurred during callback, and Config.DISPLAY_ERRORS is false, so returning a generic exception and discarding result: " + result);
			result = null;
			exception = {name: 'Error', message: Jaxer.fatalError ? Config.CALLBACK_FATAL_ERROR_MESSAGE : Config.CALLBACK_ERROR_MESSAGE};
			exception.description = exception.message;
		}

		if (log.getLevel() == Log.TRACE) log.trace("result = " + result);
		
		if (resultAs == RESULT_AS_TEXT)
		{
			Jaxer.response.setContents((result == null) ? NULL_AS_TEXT : ((typeof result.toString == "function") ? result.toString() : NO_TOSTRING_AS_TEXT));
		}
		else if (resultAs == RESULT_AS_OBJECT)
		{
			Jaxer.response.setContents((result == null) ? NULL_AS_TEXT : Serialization.toJSONString(result, { as: Serialization.JAXER_METHOD }));
		}
		else
		{
			var content = {};
			if (exception !== null)
			{
				content.exception = exception;
				content.isClientError = (exception instanceof ClientError);
			}
			else if (result !== undefined)
			{
				content.returnValue = result;
			}
			Jaxer.response.setContents(Serialization.toJSONString(content, { as: Serialization.JAXER_METHOD }));
		}

		if (log.getLevel() == Log.TRACE) log.trace("Jaxer.response.contents = " + Jaxer.response.getContents());
		if (log.getLevel() == Log.DEBUG)
		{
			log.debug("Jaxer.response.contents (first 200 chars) = " + Jaxer.response.getContents().substr(0, 200));
		}
		
		Container.persistAll();
		log.debug("Containers persisted");

		Jaxer.DB.closeAllConnections(true);
		Jaxer.response.persistHeaders();

		log.trace("=== Callback processing complete");
	}
	
});

frameworkGlobal.Callback = Jaxer.Callback = Callback;

Log.trace("*** HandleCallback.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > HandleService.js
 */
coreTraceMethods.TRACE('Loading fragment: HandleService.js');
Jaxer.lastLoadedFragment = 'HandleService.js';

(function() {
	
var log = Log.forModule("HandleService");

CoreEvents.clearHandlers(CoreEvents.HANDLE_SERVICE); // Clear this out -- we're the first and only default handler

// add the framework's HANDLE_SERVICE event handler
CoreEvents.addHandler(CoreEvents.HANDLE_SERVICE, function onHandleService(evt, doc)
{

	log.trace("=== Service processing initializing");
	if (log.getLevel() == Log.TRACE) log.trace("Received Jaxer.request: " + uneval(Jaxer.request));	
	
	Jaxer.response.allow(true);
	var exception = null;
	
	try
	{

		// We might need the above parameters to know how to return the result, even if there's a fatal error
		if (Jaxer.fatalError)
		{
			throw "Fatal Jaxer error: " + Jaxer.fatalError;
		}
		
		// We might need the above parameters to know how to return the result, even if there's a response error
		if (Jaxer.response.hasError())
		{
			throw "Jaxer response error (before callback itself was called): " + Jaxer.response.getError();
		}
		
		// Jaxer.request.app should be defined at this point, with a HANDLER property that points to the JS file to load (if any)
		var src = Jaxer.request.app.callHandler();
		if (typeof src == 'string') 
		{
			src = Util.Url.ensureFileProtocol(src);
			var global = Jaxer.pageWindow;
			var runat = "";
			var useCache = true;
			var forceCacheRefresh = Config.RELOAD_AUTOLOADS_EVERY_PAGE_REQUEST;
			var dontSetRunat = true;
			Includer.load(src, global, runat, useCache, forceCacheRefresh, dontSetRunat);
		}
		
	}
	catch(e)
	{
		exception = new Exception(e); // This will log it 
	}
	// Finally, in any case, package the results
	finally
	{
		
		if (exception)
		{
			if (!Config.DISPLAY_ERRORS) 
			{
				log.debug("An error occurred during service handling, and Config.DISPLAY_ERRORS is false, so returning a generic error message");
				exception = 
				{
					name: 'Error',
					message: Jaxer.fatalError ? Config.SERVICE_FATAL_ERROR_MESSAGE : Config.SERVICE_ERROR_MESSAGE
				};
				exception.description = exception.message;
			}
			var content = {};
			content.exception = exception;
			Jaxer.response.setContents(Serialization.toJSONString(content, { as: Serialization.JAXER_METHOD }));
			Jaxer.response.setStatus(500); // 500: Internal server error
		}

		if (log.getLevel() == Log.TRACE) log.trace("Jaxer.response.contents = " + Jaxer.response.getContents());
		if (log.getLevel() == Log.DEBUG)
		{
			log.debug("Jaxer.response.contents (first 200 chars) = " + Jaxer.response.getContents().substr(0, 200));
		}
		
		Container.persistAll();
		log.debug("Containers persisted");

		Jaxer.DB.closeAllConnections(true);
		Jaxer.response.persistHeaders();

		log.trace("=== Service processing complete");
	}
	
});

Log.trace("*** HandleService.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/CoreEvents > RequestComplete.js
 */
coreTraceMethods.TRACE('Loading fragment: RequestComplete.js');
Jaxer.lastLoadedFragment = 'RequestComplete.js';

(function() {

var log = Log.forModule("RequestComplete");

CoreEvents.clearHandlers(CoreEvents.REQUEST_COMPLETE); // Clear this out -- we're the first and only default handler

try
{
	CoreEvents.addHandler(CoreEvents.REQUEST_COMPLETE, function onRequestComplete(evt){});
}
catch (ex)
{
	throw new Exception("Could not add handler: " + ex.description, log);
}

Log.trace("*** RequestComplete.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Sandbox > Sandbox.js
 */
coreTraceMethods.TRACE('Loading fragment: Sandbox.js');
Jaxer.lastLoadedFragment = 'Sandbox.js';

(function() {

var log = Log.forModule("Sandbox");

/**
 * @classDescription {Jaxer.Sandbox} The Class describing a Sandbox: 
 * a container that can load a server-side window with its own DOM, 
 * and executes JavaScript server-side, but is more protected than the regular Jaxer 
 * server-side window.
 */

// private variables
const networkUtils = new Jaxer.NetworkUtils();
const jxWindow = Components.Constructor('@aptana.com/utils/jxWindow;1', "jxIWindow");
var openSandboxes = []; // used to close() all created ones at the end of a request

/**
 * The constructor of a Sandbox: 
 * a container that can load a server-side window with its own DOM, 
 * and executes JavaScript server-side, but is more protected than the regular Jaxer 
 * server-side window.
 * 
 * @alias Jaxer.Sandbox
 * @constructor
 * @param {String} [url]
 * 		The url to load. If no url is given, nothing is loaded -- you can later use 
 * 		the load method to load it.
 * @param {String, Object} [data]
 * 		To GET a page from the url, leave this parameter undefined or pass in null.
 * 		To POST to the url, set this parameter to the data to be POSTed.
 * 		It may be a string (usually of the form name1=value&name2=value), 
 * 		or an object whose name->value property pairs will be used to construct such a string.
 * @param {Object, Jaxer.Sandbox.OpenOptions} [options]
 * 		A JavaScript object (hashmap) of name: value property pairs specifying
 * 		how to load this Sandbox.
 * @return {Jaxer.Sandbox}
 * 		Returns an instance of Jaxer.Sandbox
 * @see Jaxer.Sandbox.OpenOptions
 */
function Sandbox(url, data, options)
{
	this._jxWindow = new jxWindow();
	
	url = this.url = normalizeUrl(url, true);
	data = this.data = normalizeData(data);
	options = normalizeAndApplyOptions(this, options);
	
	if (this.url)
	{
		this.open(this.url, data, options);
	}
}

/**
 * Returns the window that's been loaded into this sandbox,
 * or null if a url has not been loaded yet.
 * 
 * @alias Jaxer.Sandbox.prototype.window
 * @property {ChromeWindow}
 */
Sandbox.prototype.__defineGetter__('window', function getWindow()
{
	return this._jxWindow.window;
});

/**
 * Returns the DOM document that's been loaded into this sandbox's window,
 * or null if a url has not been loaded yet.
 * 
 * @alias Jaxer.Sandbox.prototype.document
 * @property {HTMLDocument}
 */
Sandbox.prototype.__defineGetter__('document', function getDocument()
{
	return this._jxWindow.document;
});

/**
 * Opens the sandbox's window and document by creating them (if needed)
 * and then loading a url into them, via a GET or POST request. You usually do not
 * need to explicitly close() this, except to cancel async requests.
 * 
 * @alias Jaxer.Sandbox.prototype.open
 * @param {String} url
 * 		The url to load from
 * @param {String, Object} [data]
 * 		To GET a page from the url, leave this parameter undefined or pass in null.
 * 		To POST to the url, set this parameter to the data to be POSTed.
 * 		It may be a string (usually of the form name1=value&name2=value), 
 * 		or an object whose name->value property pairs will be used to construct such a string.
 * @param {Object, Jaxer.Sandbox.OpenOptions} [options]
 * 		A JavaScript object (hashmap) of name: value property pairs specifying
 * 		how to load this Sandbox.
 * @see Jaxer.Sandbox.prototype.close
 */
Sandbox.prototype.open = function open(url, data, options)
{
	url = this.url = normalizeUrl(url, false);
	data = this.data = normalizeData(data);
	options = normalizeAndApplyOptions(this, options);
	
	log.trace("Opening url '" + this.url + "' with data " + (data == null ? 'null' : ' not null') + " and options " + uneval(this.options));
	
	var referer = (typeof this.options.referer == "string") ? networkUtils.fixupURI(this.options.referer) : null;
	
	var getStream, postStream;
	if (data == null) // GET
	{
		getStream = this.options.headers ? createInputStream(this.options.headers) : null;
		postStream = null;
	}
	else // POST
	{
		getStream = null;
		postStream = createInputStream(this.options.headers, data);
	}

	this._jxWindow.loadURI(url, referer, postStream, getStream);
	
	var index = openSandboxes.indexOf(this);
	if (index < 0)
	{
		openSandboxes.push(this);
	}
}

/**
 * Loads the sandbox's window and document from a string by creating them (if needed)
 * and then loading the string into them. You do not need to explicitly close() this.
 * 
 * @alias Jaxer.Sandbox.prototype.setContents
 * @param {String, Node, Document, Object} [contents]
 * 		The contents to load into the window, usually an HTML string. If a DOM
 * 		node or document are used, they are converted to HTML, and if an object
 * 		is passed in its toString() is used.
 * @param {Object, Jaxer.Sandbox.OpenOptions} [options]
 * 		A JavaScript object (hashmap) of name: value property pairs specifying
 * 		how to load this Sandbox.
 * @see Jaxer.Sandbox.prototype.close
 */
Sandbox.prototype.setContents = function setContents(contents, options)
{
	var htmlDocType = contents ? Util.findInGlobalContext("HTMLDocument", contents) : null;
	var htmlEltType = contents ? Util.findInGlobalContext("HTMLElement", contents) : null;

	if (contents == null || contents == undefined)
	{
		contents = '';
	}
	else if ((htmlDocType && (contents instanceof htmlDocType)) ||
			 (htmlEltType && (contents instanceof htmlEltType)) )
	{
		contents = Util.DOM.toHTML(contents);
	}
	else
	{
		contents = String(contents);
	}
	
	url = this.url = normalizeUrl(null, true);
	data = this.data = normalizeData(null);
	options = normalizeAndApplyOptions(this, options);
	
	log.trace("Loading contents '" + contents.substr(0, 50) + "'... with options " + uneval(this.options));
	
	var inputStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
	inputStream.data = contents;

	this._jxWindow.loadStream(inputStream, null, null, null);
	
	var index = openSandboxes.indexOf(this);
	if (index < 0)
	{
		openSandboxes.push(this);
	}
}

/**
 * Closes the Sandbox's window, which terminates any async loading and 
 * removes the window and its document. This call is usually optional, since
 * the window and its document are automatically removed at the end of
 * the Jaxer request, and they are safely reused if you open (load) the same
 * Sandbox more than once. It's therefore mostly useful for stopping
 * open async requests.
 * 
 * @alias Jaxer.Sandbox.prototype.close
 */
Sandbox.prototype.close = function close()
{
	var index = openSandboxes.indexOf(this);
	_close(this);
	if (index > -1)
	{
		openSandboxes.splice(index, 1);
	}
}

// This internal implementation does not modify the openSandboxes array
function _close(sb)
{
	sb._jxWindow.close();
}

/**
 * Waits for the Sandbox's window to complete loading, allowing asynchronous
 * processing of events to continue, up to a maximum number of milliseconds
 * (if specified).
 * 
 * @alias Jaxer.Sandbox.prototype.waitForCompletion
 * @param {Number} [maxMillis]
 * 		The number of milliseconds to wait for the sandbox to complete loading
 * 		before timing out and exiting. If this is zero or negative,
 * 		waits indefinitely (though other timeouts may intervene).
 * @return {Boolean}
 * 		Returns true if the Sandbox window loaded successfully (or was never initialized),
 * 		false if the timeout occurred before that.
 */
Sandbox.prototype.waitForCompletion = function waitForCompletion(maxMillis)
{
	var that = this;
	var testLoaded = function testLoaded()
	{
		return (that.readyState == that._jxWindow.UNINITIALIZED) || (that.readyState == that._jxWindow.COMPLETED);
	}
	var didComplete = Thread.waitFor(testLoaded, maxMillis);
	return didComplete;
}

/**
 * Returns the HTTP status of the response to the request to fetch this Sandbox's URL,
 * e.g. 200 (i.e. OK)
 * 
 * @alias Jaxer.Sandbox.prototype.status
 * @property {Number}
 */
Sandbox.prototype.__defineGetter__('status', function getStatus()
{
	var docChannel = this._jxWindow.documentChannel;
	return docChannel ? docChannel.responseStatus : null;
});

/**
 * Returns the HTTP status text of the response to the request to fetch this Sandbox's URL,
 * e.g. 'OK' (for a status of 200)
 * 
 * @alias Jaxer.Sandbox.prototype.statusText
 * @property {String}
 */
Sandbox.prototype.__defineGetter__('statusText', function getStatusText()
{
	var docChannel = this._jxWindow.documentChannel;
	return docChannel ? docChannel.responseStatusText : null;
});

/**
 * Returns the loading state of the window in the Sandbox. The possible values
 * are:
 * <ul>
 * 		<li>0 UNINITIALIZED -- the contents have not been set or the url has not been loaded</li>
 * 		<li>1 LOADING -- the contents are being set or the url is being loaded</li>
 * 		<li>2 LOADED -- the contents have been set or the url has been loaded</li>
 * 		<li>3 INTERACTIVE -- all network operations have completed</li>
 * 		<li>4 COMPLETED -- all operations have completed</li>
 * </ul>
 * 
 * @alias Jaxer.Sandbox.prototype.readyState
 * @property {String}
 */
Sandbox.prototype.__defineGetter__('readyState', function getReadyState()
{
	return this._jxWindow.readyState;
});

/**
 * Returns the HTTP method (action) of the request to fetch this Sandbox's URL,
 * e.g. 'GET' ir 'POST'
 * 
 * @alias Jaxer.Sandbox.prototype.method
 * @property {String}
 */
Sandbox.prototype.__defineGetter__('method', function getMethod()
{
	var docChannel = this._jxWindow.documentChannel;
	return docChannel ? docChannel.requestMethod : null;
});

/**
 * Returns the HTTP headers of the request to fetch this Sandbox's URL
 * as properties on the returned object
 * 
 * @alias Jaxer.Sandbox.prototype.requestHeaders
 * @property {Object}
 */
Sandbox.prototype.__defineGetter__('requestHeaders', function getRequestHeaders()
{
	var docChannel = this._jxWindow.documentChannel;
	var headers;
	if (docChannel) 
	{
		headers = {};
		var headerVisitor = 
		{
			visitHeader: function visitHeader(name, value)
			{
				headers[name] = value;
			}
		};
		docChannel.visitRequestHeaders(headerVisitor);
	}
	else
	{
		headers = null;
	}
	return headers;
});

/**
 * Returns the HTTP headers of the response to the request to fetch this Sandbox's URL
 * as properties on the returned object
 * 
 * @alias Jaxer.Sandbox.prototype.responseHeaders
 */
Sandbox.prototype.__defineGetter__('responseHeaders', function getResponseHeaders()
{
	var docChannel = this._jxWindow.documentChannel;
	var headers;
	if (docChannel) 
	{
		headers = {};
		var headerVisitor = 
		{
			visitHeader: function visitHeader(name, value)
			{
				headers[name] = value;
			}
		};
		docChannel.visitResponseHeaders(headerVisitor);
	}
	else
	{
		headers = null;
	}
	return headers;
});

/**
 * Calls close() on all Sandbox windows, and removes them from the openSandboxes array
 * 
 * @private
 * @alias Jaxer.Sandbox.closeAll
 */
Sandbox.closeAll = function closeAll()
{
	openSandboxes.forEach(function closeOne(sb, index)
	{
		log.trace("For Sandbox #" + index + ", sb = " + sb + " and sb._jxWindow = " + sb._jxWindow);
		if (sb && sb._jxWindow) 
		{
			_close(sb);
			log.trace("Auto-closed Sandbox #" + index);
		}
	});
	openSandboxes = [];
}

/**
 * Returns the HTML of the given node in the Sandbox's DOM, 
 * or of the entire Sandbox's document DOM.
 * If the Sandbox has not yet been loaded from a url, 
 * returns an empty string ('').
 * 
 * @alias Jaxer.Sandbox.prototype.toHTML
 * @param {Node, Document} [node]
 * 		The HTML element or document (or DOM node) to be serialized.
 * 		By default the entire Sandbox document is used.
 * @return {String}
 * 		The complete HTML representation of the node or document
 * 		and its contents, or '' if the Sandbox has no document
 */
Sandbox.prototype.toHTML = function toHTML(node)
{
	if (this.document) 
	{
		return Util.DOM.toHTML(node || this.document);
	}
	else
	{
		return '';
	}
}

////// Private functions:

function normalizeUrl(url, allowEmpty)
{
	if ((typeof url != "string") || !url.match(/\w/)) 
	{
		if (!allowEmpty) throw new Exception("No URL specified");
		url = null;
	}
	else 
	{
		url = Web.resolve(url);
	}
	return url;
}

function normalizeData(data)
{
	if (data == null || data == undefined) // will be a GET
	{
		data = null;
	}
	else if (typeof data != "string") 
	{
		if (typeof data == "object") 
		{
			data = Util.Url.hashToQuery(data);
		}
		else
		{
			throw new Exception("The data argument, if specified and not null, must be a string or an object");
		}
	}
	return data;
}

function normalizeAndApplyOptions(sb, options)
{
	// first make sure the sandbox has a set of default options
	if ((!sb.options) || (typeof sb.options != 'object'))
	{
		sb.options = Jaxer.Util.clone(Sandbox.defaults);
	}
	
	options = options || {};
	
	// iterate over the options that should always be there, and normalize each
	for (var p in Sandbox.defaults)
	{
		// if the option is missing, add the default
		if (!(p in sb.options))
		{
			sb.options[p] = Sandbox.defaults[p];
		}
		// if the option is being overridden by the supplied options, use the overridden value
		if (p in options)
		{
			sb.options[p] = options[p];
		}
	}
	
	// Now apply options on the jxWindow:
	if (typeof sb.options.onload == "function")
	{
		sb._jxWindow.onload = sb.options.onload;
	}
	if (typeof sb.options.onlocationchange == "function")
	{
		sb._jxWindow.onlocationchange = function onlocationchange(nsIURI, isHTTPRedirect)
		{
			return sb.options.onlocationchange.call(sb._jxWindow, nsIURI.spec, isHTTPRedirect);
		}
	}
	if (typeof sb.options.onsslcerterror == "function")
	{
		sb._jxWindow.onsslcerterror = function onsslcerterror(socketInfo, sslStatus, targetSite)
		{
			var cert = sslStatus.serverCert; /* nsIX509Cert */
			var certInfo = new Util.Certificate.CertInfo(socketInfo, sslStatus, targetSite);
			return sb.options.onsslcerterror.call(certInfo, cert, socketInfo, sslStatus, targetSite);
		}
	}
	sb._jxWindow.async = Boolean(sb.options.async);
	sb._jxWindow.allowJavascript = Boolean(sb.options.allowJavaScript); // slight capitalization discrepancy
	sb._jxWindow.allowMetaRedirects = Boolean(sb.options.allowMetaRedirects);
	sb._jxWindow.allowSubframes = Boolean(sb.options.allowSubFrames); // slight capitalization discrepancy
	// Not yet implemented in Core:
	sb._jxWindow.allowImages = false; // Boolean(sb.options.allowImages); // slight capitalization discrepancy
	
	return this.options;
}

function createInputStream(headers, body)
{
	var mimeStream = Components.classes["@mozilla.org/network/mime-input-stream;1"].createInstance(Components.interfaces.nsIMIMEInputStream);

	if (!headers || typeof headers != "object")
	{
		headers = {};
	}
	
	if (typeof body == "string")
	{
		if (!'Content-Type' in headers)
		{
			headers['Content-Type'] = "application/x-www-form-urlencoded";
		}
		delete headers['Content-Length'];
		mimeStream.addContentLength = true;
		var inputStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
		inputStream.data = body;
		mimeStream.setData(inputStream);
	}
	
	for (var headerName in headers)
	{
		mimeStream.addHeader(headerName, String(headers[headerName]));
	}
	
	return mimeStream;
}

/**
 * @classDescription {Jaxer.Sandbox.OpenOptions} Options used to define the behavior
 * of Jaxer.Sandbox opening.
 */

/**
 * Options used to define the behavior of Jaxer.Sandbox loading. Create a new Jaxer.Sandbox loading()
 * to get the default options, then modify its properties as needed before
 * passing it to new Jaxer.Sandbox() or to load() on an instance of Jaxer.Sandbox.
 * 
 * @constructor
 * @alias Jaxer.Sandbox.OpenOptions
 * @return {Jaxer.Sandbox.OpenOptions}
 * 		Returns an instance of OpenOptions.
 */
Sandbox.OpenOptions = function OpenOptions()
{

	/**
	 * Set to true for asynchronous, false for synchronous (default). 
	 * To use it asynchronously, see also Jaxer.Thread.waitFor.
	 *
	 * @alias Jaxer.Sandbox.OpenOptions.prototype.async
	 * @property {Boolean}
	 * @see Jaxer.Thread.waitFor
	 */	
	this.async = false;
	
	/**
	 * Whether to allow (server-side) execution of JavaScript, if any, within
	 * the loaded page. By default, this is true. This applies to JavaScript in the page
	 * inside this Sandbox instance, not the JavaScript of the loading page.
	 * Note that the JavaScript inside this Sandbox instance in any case does
	 * not have access to the Jaxer framework, and is running without the
	 * usual Jaxer server-side privileges.
	 *
	 * @alias Jaxer.Sandbox.OpenOptions.prototype.allowJavaScript
	 * @property {Boolean}
	 */
	this.allowJavaScript = true;
	
	/**
	 * Whether to allow refresh-based redirects within the loaded page.
	 * By default, this is true;
	 *
	 * @alias Jaxer.Sandbox.OpenOptions.prototype.allowMetaRedirects
	 * @property {Boolean}
	 */
	this.allowMetaRedirects = true;
	
	/**
	 * Whether to allow the loaded page to itself load frames or iframes.
	 * By default, this is true.
	 *
	 * @alias Jaxer.Sandbox.OpenOptions.prototype.allowSubFrames
	 * @property {Boolean}
	 */
	this.allowSubFrames = true;
	
	// Not yet implemented in core:
//	this.allowImages = false;
	
	/**
	 * The value of this, if any, will be used as the Sandbox's
	 * onload handler. The onload handler will be called after the page is loaded,
	 * and after the page's own onload is invoked, if any. 
	 * It's particularly useful when the page is loaded asynchronously, in which case it
	 * may be used in conjunction with the Sandbox's waitForCompletion method or
	 * with Jaxer.Thread.waitFor.
	 *
	 * @alias Jaxer.Sandbox.OpenOptions.prototype.onload
	 * @property {Function}
	 * @see Jaxer.Sandbox.prototype.waitForCompletion
	 * @see Jaxer.Thread.waitFor
	 */
	this.onload = null;
	
	/**
	 * Set this to an event handler function you want called if the document in the Sandbox redirects (changes its location).
	 * This will happen whether the redirect is due to an HTTP status code or header  (e.g. the web server
	 * returned a 307 Temporary Redirect and a Location header), or it is in the HTML either as a meta element
	 * with a HTTP-Equiv attribute or a JavaScript action (e.g. window.location = ...). 
	 * <br><br>
	 * The function will be called with two arguments: 
	 * <ol>
	 * <li>the new url to which the location would be changed, </li>
	 * <li>and a boolean flag that will be true if it's an HTTP status+location redirect 
	 * and false if it's a location change due to HTML or JavaScript. </li>
	 * </ol>
	 * <br><br>
	 * If the function returns a true, the redirection is allowed; if it returns a false the location is not changed.
	 * 
	 * @alias Jaxer.Sandbox.OpenOptions.prototype.onlocationchange
	 * @property {Function}
	 */
	this.onlocationchange = null;
	
	/**
	 * Set to a custom callback function to call if an SSL request fails
	 * due to a certificate error. 
	 * <br><br>
	 * The function will be called with the following arguments: 
	 * <ol>
	 * <li>the certInfo (an object containing properties describing the certificate and its status), </li>
	 * <li>the cert (certificate) itself (an object containing properties describing the certificate and its status), </li>
	 * <li>the XHR's socketInfo</li>
	 * <li>the XHR's sslStatus</li>
	 * <li>the XHR's targetSite</li>
	 * </ol>
	 * <br><br>
	 * It should return true to ignore the error,
	 * or false to abort the request. This is only available server-side.
	 * If (and only if) this is set to a function that returns true, 
	 * information about the failure can be retrieved from the extended 
	 * response's certInfo property.
	 * 
	 * @alias Jaxer.Sandbox.OpenOptions.prototype.onsslcerterror
	 * @property {Function}
	 */
	this.onsslcerterror = null;
	
	/**
	 * Add name-value pairs to this object to set headers on the http request.
	 * Both the name and the value should be strings.
	 * For POST requests, a 'Content-Type' header with value "application/x-www-form-urlencoded"
	 * will be added automatically unless you specify a different one, and a
	 * 'Content-Length' header with the appropriate value will also be set.
	 *
	 * @alias Jaxer.Sandbox.OpenOptions.prototype.headers
	 * @property {Object}
	 */
	this.headers = {};
}

/**
 * The default OpenOptions which new calls to new Jaxer.Sandbox() or Jaxer.Web.load() will use, 
 * unless overridden by the options argument.
 * 
 * @alias Jaxer.Sandbox.defaults
 * @property {Jaxer.Sandbox.OpenOptions}
 */
Sandbox.defaults = new Sandbox.OpenOptions();

frameworkGlobal.Sandbox = Jaxer.Sandbox = Sandbox;

Log.trace("*** Sandbox.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/App > App.js
 */
coreTraceMethods.TRACE('Loading fragment: App.js');
Jaxer.lastLoadedFragment = 'App.js';

(function() {

var log = Log.forModule("App");

/**
 * @classDescription {Jaxer.App} Class for the current app's metadata
 */

/**
 * The constructor of an object that describes the current app's metadata
 * 
 * @alias Jaxer.App
 * @constructor
 * @param {Object} props
 * 		The properties to use for initializing this application: urlTest, name, db, path, etc.
 * @return {Jaxer.App}
 * 		Returns an instance of App
 */
function App(props)
{
	
	var defaultApp = Jaxer.Config.DEFAULT_APP || {};
	
	if (!props) throw new Exception("When constructing a new App, you must specify the props argument");

	if (log.getLevel() == Log.TRACE) log.trace("Constructing App from props: " + uneval(props) + " and a default app of: " + uneval(defaultApp));
	
	/**
	 * The object that determines whether this app should be used for the current request.
	 * If a function, it takes the request's parsedUrl as its sole parameter, and returns true if this app should be used.
	 * If a regular expression, it should match against the request's parsedUrl's path if this app should be used.
	 * If a string, it should match the beginning of the request's parsedUrl's path if this app should be used.
	 * 
	 * @alias Jaxer.App.prototype.urlTest
	 * @property {Function, RegExp, String}
	 */
	this.urlTest = props.urlTest || defaultApp.urlTest;
	
	/**
	 * The name to use for the current application. This can be a string or a function:
	 * the function takes the request's parsedUrl as its sole parameter, 
	 * and returns the name.
	 * The name should be unique across all applications (this is checked at server start).
	 * 
	 * @alias Jaxer.App.prototype.name
	 * @property {String, Function}
	 * @see Jaxer.App.prototype.NAME
	 */
	this.name = props.name || defaultApp.name;
	
	/**
	 * The key to use when persisting or restoring values in the scope of the current application, using Jaxer.application. 
	 * This can be a string or a function:
	 * the function takes the request's parsedUrl as its sole parameter, 
	 * and returns the key.
	 * The key should be unique across all applications.
	 * 
	 * The appKey will first default to the application name if not specified, then finally to the default appKey 
	 * in the case of the standard install the default appKey will be localhost:8081
	 * 
	 * @alias Jaxer.App.prototype.appKey
	 * @property {String, Function}
	 * @see Jaxer.application
	 * @see Jaxer.App.prototype.APP_KEY
	 */
	this.appKey = props.appKey || props.name || defaultApp.appKey;
	
	/**
	 * The key to use when persisting or restoring values in the scope of the current page, 
	 * using Jaxer.page or Jaxer.sessionPage. 
	 * This can be a string or a function:
	 * the function takes the request's parsedUrl as its sole parameter, 
	 * and returns the key.
	 * The key should be unique across all pages for any application.
	 * 
	 * @alias Jaxer.App.prototype.pageKey
	 * @property {String, Function}
	 * @see Jaxer.pageKey
	 * @see Jaxer.App.prototype.PAGE_KEY
	 */
	this.pageKey = props.pageKey || defaultApp.pageKey;
	
	/**
	 * The database connection parameters to use by default for the current application. 
	 * This can be an object or a function: 
	 * the function takes the app's name and the request's parsedUrl as its two parameters, 
	 * and returns the database connection parameters to use.
	 * 
	 * @alias Jaxer.App.prototype.db
	 * @property {Object, Function}
	 * @see Jaxer.App.prototype.DB
	 */
	this.db = props.db || defaultApp.db;
	
	/**
	 * The filesystem path to use by default for the current application. 
	 * This can be a string or a function:
	 * the function takes the app's name and the request's parsedUrl as its two parameters, 
	 * and returns the parameters to use.
	 * 
	 * @alias Jaxer.App.prototype.path
	 * @property {String, Function}
	 * @see Jaxer.App.prototype.PATH
	 */
	this.path = props.path || defaultApp.path;
	
	/**
	 * For service-type (not page-type) requests where Jaxer is the handler (and it's not a callback),
	 * this determines how the request is handled. It can be a string or a function:
	 * the function takes the app's name and the request's parsedUrl as its two parameters, 
	 * and is executed right after the (empty) DOM is created and ready. If it returns a string,
	 * or if the handler property is already a string, that string should be the file://...-type URL  
	 * location of a JavaScript file to be loaded and executed to handle this request.
	 * 
	 * @alias Jaxer.App.prototype.handler
	 * @property {String, Function}
	 * @see Jaxer.App.prototype.HANDLER
	 */
	this.handler = props.handler || defaultApp.handler;
	
	this.init();
	
	// You can add properties to an app as long as they don't conflict with existing properties
	for (var extraProp in props)
	{
		if (!(extraProp in this))
		{
			this[extraProp] = props[extraProp];
		}
	}

}

/**
 * Initializes or re-initializes this App object, using any needed values from Jaxer.request (if any)
 * @private
 */
App.prototype.init = function init()
{
	
	var parsedUrl = (Jaxer.request ? Jaxer.request.parsedUrl : null);
	
	/**
	 * The fully-evaluated name to use for the current application. 
	 * If this app's "name" property was a function, it will have been evaluated to a string using the current request.
	 * 
	 * @alias Jaxer.App.prototype.NAME
	 * @property {String}
	 * @see Jaxer.App.prototype.name
	 */
	var _NAME = extractFunctionOrString(this.name, [parsedUrl]);
	this.__defineGetter__("NAME", function() { return _NAME; });
	
	log.trace("Initializing app '" + _NAME + "' (urlTest: " + this.urlTest + ")");
	
	/**
	 * The fully-evaluated key to use when persisting or restoring values in the scope of the current application, using Jaxer.application. 
	 * If this app's "appKey" property was a function, it will have been evaluated to a string using the current request.
	 * 
	 * @alias Jaxer.App.prototype.APP_KEY
	 * @property {String}
	 * @see Jaxer.App.prototype.appKey
	 */
	var _APP_KEY = parsedUrl ? extractFunctionOrString(this.appKey, [parsedUrl]) : null;
	this.__defineGetter__("APP_KEY", function() { return _APP_KEY; });
	log.trace("APP_KEY for app '" + this.NAME + "': " + _APP_KEY);

	/**
	 * The fully-evaluated key to use when persisting or restoring values in the scope of the current page, using Jaxer.page or Jaxer.sessionPage. 
	 * If this app's "pageKey" property was a function, it will have been evaluated to a string using the current request.
	 * 
	 * @alias Jaxer.App.prototype.PAGE_KEY
	 * @property {String}
	 * @see Jaxer.App.prototype.pageKey
	 */
	var _PAGE_KEY = parsedUrl ? extractFunctionOrString(this.pageKey, [parsedUrl]) : null;
	this.__defineGetter__("PAGE_KEY", function() { return _PAGE_KEY; });
	log.trace("PAGE_KEY for app '" + this.NAME + "': " + _PAGE_KEY);

	/**
	 * The fully-evaluated database parameters to use by default for the current application. 
	 * If this app's "db" property was a function, it will have been evaluated to an object using the current request.
	 * 
	 * @alias Jaxer.App.prototype.DB
	 * @property {Object}
	 * @see Jaxer.App.prototype.DB
	 */
	var _DB = extractFunctionOrObject(this.db, [_NAME, parsedUrl]);
	this.__defineGetter__("DB", function() { return _DB; });

	/**
	 * The fully-evaluated filesystem path to use by default for the current application. 
	 * If this app's "path" property was a function, it will have been evaluated to a string using the current request.
	 * 
	 * @alias Jaxer.App.prototype.PATH
	 * @property {String}
	 * @see Jaxer.App.prototype.path
	 */
	var _PATH = extractFunctionOrString(this.path, [_NAME, parsedUrl]);
	this.__defineGetter__("PATH", function() { return _PATH; });
	log.trace("PATH for app '" + this.NAME + "': " + _PATH);
	if (_PATH) this.initPath();

}

function extractFunctionOrString(obj, args)
{
	switch (typeof obj)
	{
		case "function":
			return String(obj.apply(null, args));
		case "string":
			return obj;
		default:
			return null;
	}
}

function extractFunctionOrObject(obj, args)
{
	switch (typeof obj)
	{
		case "function":
			return obj.apply(null, args);
		case "object":
			return obj;
		default:
			return null;
	}
}

/**
 * Initializes (creates if necessary) the path for this app, if any
 * 
 * @alias Jaxer.App.prototype.initPath
 */
App.prototype.initPath = function initPath()
{
	if (this.PATH)
	{
		var path = Dir.resolve(this.PATH);
		var dir = new Dir(path);
		if (dir.exists)
		{
			if (!dir.isDir)
			{
				throw new Exception("The path '" + path + "' for app '" + this.NAME + "' exists but is not a folder!");
			}
		}
		else if (Config.AUTO_CREATE_APP_PATHS)
		{
			log.trace("Creating or verifying hierarchy for app '" + this.NAME + "': " + path);
			dir.createHierarchy();
		}
	}
}

/**
 * Calls the handler function for this app, if there is a handler and it's a function.
 * In any case it also sets the HANDLER property for this app.
 * 
 * @alias Jaxer.App.prototype.callHandler
 */
App.prototype.callHandler = function callHandler()
{
	/**
	 * The fully-evaluated file://...-type URL location of a JavaScript file to be loaded and executed to handle this request
	 * If this app's "handler" property was a function, it will have been evaluated to a string using the current request.
	 * If this app's "handler" function did not return a string, this property will be set to null,
	 * and no JavaScript file will be loaded.
	 * 
	 * @alias Jaxer.App.prototype.HANDLER
	 * @property {String}
	 * @see Jaxer.App.prototype.handler
	 */
	var _HANDLER;
	var parsedUrl = (Jaxer.request ? Jaxer.request.parsedUrl : null);
	switch (typeof this.handler)
	{
		case "function":
			_HANDLER = this.handler(this.NAME, parsedUrl);
			if (typeof _HANDLER != 'string') _HANDLER = null;
			break;
		case "string":
			_HANDLER = this.handler;
			break;
		default:
			_HANDLER = null;
	}
	this.__defineGetter__("HANDLER", function() { return _HANDLER; });
	log.trace("HANDLER for app '" + this.NAME + "': " + _HANDLER);
	return _HANDLER;
}

/**
 * Initialize the static apps: those whose names are known in advance
 * @private
 */
App.initStatic = function initStatic()
{
	for (var appName in Config.appsByName)
	{
		var app = Config.appsByName[appName];
		app.initPath();
	}
}

frameworkGlobal.App = Jaxer.App = App;

Log.trace("*** App.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Extend > Extend.js
 */
coreTraceMethods.TRACE('Loading fragment: Extend.js');
Jaxer.lastLoadedFragment = 'Extend.js';

(function() {

var log = Log.forModule("Extend");

/**
 * @namespace {Jaxer.Extensions} A container for all the loaded extensions to
 * the Jaxer framework.
 */
Jaxer.Extensions = {}; // This will hold all the extensions

/**
 * Loads a framework extension (already defined in memory). If the
 * namespaceObject defines an onLoad method, it will be called (without
 * arguments)
 * 
 * @alias Jaxer.loadExtension
 * @param {String} name
 * 		The (unique) name to use for this extension
 * @param {Object} namespaceObject
 * 		The object holding all the members of this extension
 */
Jaxer.loadExtension = function loadExtension(name, namespaceObject)
{
	if (!namespaceObject)
	{
		throw new Exception("No namespaceObject specified for extension '" + name + "' -- extension not loaded");
	}
	Jaxer.unloadExtension(name, true); // Unload any previous version, if any
	log.trace("Adding extension '" + name + "'");
	Jaxer.Extensions[name] = namespaceObject;
	if (typeof namespaceObject.onLoad == "function")
	{
		log.trace("Loading extension '" + name + "'...");
		namespaceObject.onLoad();
		log.trace("Loaded extension '" + name + "'");
	}
}

/**
 * Unloads a previously-loaded framework extension. If its namespaceObject
 * defines an onUnload method, it will be called (without arguments)
 * 
 * @alias Jaxer.unloadExtension
 * @param {String} name
 * 		The name used to load this extension
 * @param {Boolean} noWarnings
 * 		Whether to warn if the extension was not loaded when this was called, or
 * 		its namespaceObject was not there.
 */
Jaxer.unloadExtension = function unloadExtension(name, noWarnings)
{
	var namespaceObject = Jaxer.Extensions[name];
	if (!namespaceObject)
	{
		if (!noWarnings) log.warn("No namespaceObject found for extension '" + name + "' -- extension not unloaded");
		return;
	}
	if (typeof namespaceObject.onUnload == "function") 
	{
		log.trace("Unloading extension '" + name + "'...");
		namespaceObject.onUnload();
		log.trace("Unloaded extension '" + name + "'");
	}
	delete Jaxer.Extensions[name];
	log.trace("Removed extension '" + name + "'");
}

/**
 * @private
 * @param {Object} configPath
 */
function getDirContents(configPath)
{
	if (!configPath) return [];
	var extensionsPath = Dir.resolve(configPath, System.executableFolder);
	log.trace("Looking for extensions in path: " + extensionsPath);
	var dir = new Dir(extensionsPath);
	var dirContents;
	if (dir.exists)
	{
		dirContents = dir.readDir();
		log.trace("Found " + dirContents.length + " objects in path");
	}
	else
	{
		dirContents = [];
	}
	return dirContents;
}

/**
 * Loads all extensions from the folder defined in Config.EXTENSIONS_DIR.
 * 
 * @alias Jaxer.loadAllExtensions
 */
Jaxer.loadAllExtensions = function loadAllExtensions()
{
	log.trace("Loading all extensions...");
	var dirContents = getDirContents(Config.EXTENSIONS_DIR);
	dirContents = dirContents.concat(getDirContents(Config.LOCAL_EXTENSIONS_DIR));
	var numIncluded = 0;
	dirContents.forEach(function loadFile(file)
	{
		if (file.isFile && (file.URL.match(/\.js$/)))
		{
			log.trace("Included extension: " + file.path + " (from URL: " + file.URL + ")");
			numIncluded++;
			Jaxer.include(file.URL);
		}
	});
	log.debug("Included " + numIncluded + " extensions");
}

Log.trace("*** Extend.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Serialization > Serialization.js
 */
coreTraceMethods.TRACE('Loading fragment: Serialization.js');
Jaxer.lastLoadedFragment = 'Serialization.js';

// NOTE! This is a server- and client-side, *compressible* module -- be sure to
// end each assignment of function literals with a semicolon

/*
 * Based on original code from Douglas Crockford's json.js, 2007-04-30
 */

(function(){

/**
 * @namespace {Jaxer.Serialization}
 * 
 * This is the namespace that contains Jaxer serialization methods.
 * 
 * The Jaxer serializer uses the familiar and popular JSON format. However,
 * additional functionality has been provided to allow for serialization of more
 * complex data structures. Specifically, this module supports cyclical data
 * structures, multiple references, and custom typeserializers. Each of these is
 * described below.
 * 
 * Cyclical data structures occur when an object (or array) contains a
 * descendent structure that also references that same object. For example, a
 * DOM node has references to its children and these children also have
 * references to the DOM node (their parentNode). In a traditional JSON
 * environment, if you were to try to serialize this structure, you would end up
 * in an infinite loop or an exception would occur as the serializer traversed
 * the parent node, its child nodes, and then back up to the parent node through
 * the child's parentNode property. Indeed, the serializer couldn't get past the
 * first child in this scenario. The Jaxer serializer bypasses this via the use
 * of marker properties and specially formatted strings referred to as
 * "references".
 * 
 * Multiple references are similar to cyclical data structures in that an object
 * is referenced two or more times. However, this does not necessarily create a
 * cycle. For example, say you have the following code:
 * 
 * 		<pre>var car = {
 * 			color: "blue",
 * 			price: 10000
 * 		};
 * 		var cars = [car, car];</pre>
 * 
 * As you can see, the same car object has been referenced twice in the array.
 * In a traditional JSON serializer, each instance of car would be serialized
 * separately. Unfortunately, that alters the data structure that will be
 * accessed after deserialization in a subtle way. You will end up with two
 * independent car objects which means that changing the price of one will not
 * change the price of the other as would have happened before the
 * serialization/deserialization cycle. In order to restore the same references,
 * Jaxer serializes the car only once and then leaves placeholders to point to
 * that single instance. During deserialization, the placeholders are replaced
 * with actual references to the deserialized object, thus restoring the
 * original data structure as it appeared before serialization.
 * 
 * Some data types cannot be expressed in JSON. For example, the Date type is
 * not listed as a valid type in JSON. So, in order to support this type and
 * potentially many others, the serializer allows the developer to register
 * custom serializers and associated deserializers for a given type. When the
 * serializer sees these types, the custom handlers are used to convert the item
 * to a string. It is then the responsibility of the custom deserializer to
 * restore the string to the original type. For example, Jaxer supports
 * XMLDocuments. The custom serializer creates an XML string which is specially
 * tagged so the deserializer can restore the XML string back to an XMLDocument.
 * 
 * Next, we briefly discuss how Jaxer recognizes cycles, multi-references, and
 * how it represents references and custom serialized objects.
 * 
 * The Jaxer serializer makes an initial pass over the data being serialized.
 * Each object, array, and custom serialization object is tagged with a unique
 * index. (Note that some objects do not allow properties to be added to them.
 * In this situation, the Jaxer serializer maintains an array of these items.
 * This array is searched when new items are encountered and serves the same
 * purpose as the id property). Before adding the index, we first check if we
 * have already indexed the item. If the tag already exists, then we've either
 * exposed a cycle or a multi-reference. At this point, the serializer knows to
 * switch to another JSON format that minimizes the amount of data to be
 * serialized.
 * 
 * References and custom serialization objects each make use of specially
 * formatted strings. To make this a bit clearer, we create an array of two
 * references to the same date object.
 * 
 * 		<pre>var d = new Date();
 * 		var items = [d, d];
 * 		var json = Jaxer.Serialization.toJSONString(items);</pre>
 * 
 * The resulting JSON string will look like the following:
 * 
 * 		<pre>[["~1~","~1~"], "~Date:2007-08-17T11:57:30~"]</pre>
 * 
 * This format always has a top-level array whose first element is the root
 * item that was originally being serialized. In this case, our top-most element
 * was an array. As an aside, the only top-level elements that can generate this
 * format are arrays, objects, and custom serialization objects. The first
 * special format  used for references and is defined with "~#~" where # is a
 * number. The number is the index into the top-level array. The element at that
 * index is the item that needs to be referenced where the reference string
 * lives. In this example, once deserialization has completed, both instances of
 * "~1~" will have been replaced with references to the deserialized date
 * object.
 * 
 * The next custom format, the date, shows how custom serializers emit text. The
 * first item after the ~ but before the : is the name of the type. This is the
 * fully-qualified type as you would have to type it in JavaScript to get to
 * that type's constructor. The string after the : is in a format as generated
 * by the type's custom serializer. The resulting string generated by the custom
 * serializer is in turn serialized as a string, so the deserializer does not
 * need to handle special characters or escape sequences. It is the
 * responsibility of the custom deserializer to consume that text and to return
 * effectively a clone of the original object.
 * 
 * This module also allows a developer to register alternate top-level
 * serialization and deserialization methods. The default method for
 * serialization is 'nativeJSON' which attempts to use the built-in JSON support
 * in the user agent, when available. In cases where 'nativeJSON' is not
 * supported, the 'JSON' mode will be used. The developer can also use 'JSON'
 * along with more options to customize serialization for special values like
 * 'undefined', and 'INFINITY', for example. Finally, there is a 'Jaxer' mode as
 * described above. This mode is used by Jaxer's framework and callback
 * mechanisms and is available to developers that may need this advanced
 * functionality. These serialization methods are specificed in a separate
 * optional parameter to the "toJSONString" and 'fromJSONString" functions. Note
 * that if the developer uses a non-default serialization method, then the
 * developer is also responsible for using this same method for deserialization.
 * Currenty, this implementation cannot detect which method was used for the
 * original serialization step
 * 
 * @see Jaxer.Serialization.toJSONString
 * @see Jaxer.Serialization.fromJSONString
 */

// create Serialization container
var Serialization = {};

// action enumeration
Serialization.SERIALIZE_ACTION = "serialize";
Serialization.THROW_ACTION = "throw";
Serialization.TRUNCATE_ACTION = "truncate";
Serialization.NULLIFY_ACTION = "nullify";
Serialization.RETURN_OBJECT_ACTION = "return object";

// message emitted by the truncate action
var TRUNCATION_MESSAGE = "__truncated__";

// public serialization option properties and default settings
var DEFAULT_MAX_DEPTH = 10;
var MAX_DEPTH_PROPERTY = "maxDepth";
var MAX_DEPTH_ACTION_PROPERTY = "maxDepthAction";
var DATE_SERIALIZATION_ACTION_PROPERTY = "dateSerializationAction";
var SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY = "specialNumberSerializationAction";
var UNDEFINED_SERIALIZATION_ACTION_PROPERTY = "undefinedSerializationAction";
var USE_CUSTOM_SERIALIZERS_PROPERTY = "useCustomSerializers";

// private property names used internally during serialization
var ID_PROPERTY = "$id";
var ITEMS_PROPERTY = "$items";

// our supported serializer method names
Serialization.JAXER_METHOD = "Jaxer";
Serialization.JSON_METHOD = "JSON";
Serialization.NATIVE_JSON_METHOD = "nativeJSON";

var JSON_SYNTAX_ERROR_NAME = "JSONSyntaxError";
var JSON_EVAL_ERROR_NAME = "JSONEvalError";

// default serialization result
var NO_RESULT = "undefined";

// patterns used to query text patterns for special string values
var VALID_TYPE_PATTERN = /^[a-zA-Z_$](?:[-a-zA-Z0-9_$]*)(?:\.[a-zA-Z_$](?:[-a-zA-Z0-9_$]*))*$/;
var DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;

// custom type handler, serializer, and deserializer hashes
var typeHandlers = {};
var serializers = {};
var deserializers = {};

/*
 * BEGIN: Private functions section
 */

/**
 * Convert an Array to a JSON string
 * 
 * @private
 * @param {Array} ary
 * 		The source Array to be serialized
 * @param {Object} options
 * 		This is the options object passed into the top-level toJSONString
 * 		function.
 * @return {String}
 * 		The resulting JSON string
 */
function ArrayToJSON(ary, options)
{
	// clone options object so as not to alter the original
	options = Jaxer.Util.protectedClone(options);
	
	// decrease recursion depth counter
	options[MAX_DEPTH_PROPERTY]--;
	
	// perform max-depth action if we've reached our maximum recursion depth
	if (options[MAX_DEPTH_PROPERTY] < 0)
	{
		var action = options[MAX_DEPTH_ACTION_PROPERTY] || Serialization.THROW_ACTION;
		
		switch (action)
		{
			case Serialization.TRUNCATE_ACTION:
				return '"' + TRUNCATION_MESSAGE + '"';
				
			case Serialization.THROW_ACTION:
				throw new Error("Maximum recursion depth has been exceeded");
				break;
		}
	}
	
	var result = [];
	var length = ary.length;
	
	// For each value in this array...
	for (var i = 0; i < length; i++)
	{
		var item = ary[i];
		
		// Note that we ignore elements that are not serializeable
		if (isSerializeable(item)) 
		{
			result.push(toCrockfordJSONString(item, options));
		}
	}

	// Join all of the fragments together and return.
	return "[" + result.join(",") + "]";
}

/**
 * Clear the lookup table used to match a type with its constructor. This needs
 * to be performed before serialization and deserialization since the global
 * context changes depending on when in the page life cycle serialization is
 * being performed.
 * 
 * @private
 */
function clearHandlerCache()
{
	for (var name in typeHandlers) 
	{
		typeHandlers[name].constructor = null;
	}
}

/**
 * Convert a date to a our special string format for later deserizliation
 * 
 * @private
 * @param {Date} data
 * 		The source Date to be serialized
 * @return {String}
 * 		The resulting JSON string
 */
function DateToJSON(data)
{
	// Format integers to have at least two digits.
	function pad(n)
	{
		return n < 10 ? '0' + n : n;
	}

	// Ultimately, this method will be equivalent to the date.toISOString
	// method.
	return '"' +
		data.getFullYear() + '-' +
		pad(data.getUTCMonth() + 1) + '-' +
		pad(data.getUTCDate()) + 'T' +
		pad(data.getUTCHours()) + ':' +
		pad(data.getUTCMinutes()) + ':' +
		pad(data.getUTCSeconds()) + '"';
}

/**
 * Traverse the resulting JSON object to perform any post-processing needed
 * to convert references and custom serialization objects to their proper
 * instances.
 * 
 * @private
 * @param {String} property
 * 		The name of the propery to visit
 * @param {Object} obj
 * 		The object whose property will be visited
 * @param {Function} filter
 * 		The function to apply to each element in the data graph
 * @return {Object}
 * 		The resulting filter property value
 */
function walk(property, obj, filter)
{
	if (obj && typeof obj === 'object')
	{
		for (var p in obj)
		{
			if (obj.hasOwnProperty(p))
			{
				obj[p] = walk(p, obj[p], filter);
			}
		}
	}
	
	return filter(property, obj);
}

/**
 * This is a shared function used by both the "jaxer" and the "json"
 * serialization methods. The options object is used to determine if special
 * numbers should be allowed in the source json string
 * 
 * @private
 * @param {Object} json
 * @param {Object} options
 * @return {Object}
 */
function evalJSONString(json, options)
{
	var result = NO_RESULT;
	var simpleValuePattern =
		(options[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] === Serialization.SERIALIZE_ACTION)
			?	/"[^"\\\n\r]*"|true|false|null|undefined|NaN|[-+]?Infinity|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
			:	/"[^"\\\n\r]*"|true|false|null|undefined|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	
	// Run the text against a regular expression to look for non-JSON
	// characters. We are especially concerned with '()' and 'new' because they
	// can cause invocation, and '=' because it can cause mutation. But just to
	// be safe, we will reject all unexpected characters.

	// if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+EINaefilnr-uy \n\r\t])+?$/.test(json))
	
	// We split the second stage into 4 regexp operations in order to work around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace all backslash pairs with '@' (a non-JSON character). Second, we
	// replace all simple value tokens with ']' characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text. Finally,
	// we look to see that the remaining characters are only whitespace or ']' or
	// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
    if (
		/^[\],:{}\s]*$/.
			test
			(
				json.replace(/\\["\\\/bfnrtu]/g, '@').
					replace(simpleValuePattern, ']').
					replace(/(?:^|:|,)(?:\s*\[)+/g, '')
			)
	)
	{
		// We use the eval function to compile the text into a JavaScript
		// structure. The '{' operator is subject to a syntactic ambiguity in
		// JavaScript: it can begin a block or an object literal. We wrap the
		// text in parens to eliminate the ambiguity.

		try
		{
			result = eval('(' + json + ')');
		}
		catch (e)
		{
			var err = new Error("parseJSON: exception '" + e + "' when evaluating: " + json);
			err.name = JSON_EVAL_ERROR_NAME;
			throw err;
		}
	}
	else
	{
		var err = new Error("parseJSON: unexpected characters in: " + json);
		err.name = JSON_SYNTAX_ERROR_NAME;
		throw err;
	}
	
	return result;
}

/**
 * Find the type handler name for the specified object's type. If no handler
 * exists, then this function will return null.
 * 
 * @private
 * @param {Object} item
 * 		The item for which a custom serialization handler name is being queried.
 * @return {String}
 * 		If the item's type is not registered with a custom serialization
 * 		handler, then this function will return null; otherwise, the fully-
 * 		qualified type name will be returned. This type name is also the name
 * 		of the handler.
 */
function findHandlerName(item)
{
	var result = null;
	
	for (var name in typeHandlers)
	{
		if (typeHandlers[name].canSerialize(item))
		{
			result = name;
			break;
		}
	}
	
	return result;
}

/**
 * fromCrockfordJSONString
 * 
 * @private
 * @param {String} json
 * @param {Object} options
 * @return {Object}
 */
function fromCrockfordJSONString(json, options)
{
	/**
	 * For JSON strings that do not contain references, we make a
	 * post-processing step to replace all custom serialization string with
	 * their deserialized instances.
	 * 
	 * @private
	 * @param {String} property
	 * 		The property name to filter
	 * @param {Object} value
	 * 		The value of the property being filtered
	 */
	function filter(property, value)
	{
		var result = value;
		
		if (typeof value === "string")
		{
			var match;
			
			if (match = value.match(DATE_PATTERN))
			{
				var win = getWindow();
				
				result = new win.Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));
			}
		}
		
		return result;
	}
	
	var result = evalJSONString(json, options);
	
	if (result)
	{
		result = walk('', result, filter);
	}
	
	return result;
}

/**
 * fromJaxerJSONString
 * 
 * @private
 * @param {String} json
 * @param {Object} options
 * @return {Object}
 */
function fromJaxerJSONString(json, options)
{
	var REFERENCE_PATTERN = /^~(\d+)~$/;
	var REFERENCE_STRING = /('~\d+~'|"~\d+~")/;
	var CUSTOM_SERIALIZATION_PATTERN = /^~([a-zA-Z_$](?:[-a-zA-Z0-9_$]*)(?:\.[a-zA-Z_$](?:[-a-zA-Z0-9_$]*))*):([\s\S]+)~$/; // Use \s\S to match newlines too
	
	/**
	 * A reference constitutes an object and a property on the object. This
	 * class is used to specify a specific property on an object for later
	 * setting of that value.
	 *
	 * @private
	 * @constructor
	 * @param {Object} object
	 * 		The source object of this reference
	 * @param {String} property
	 * 		the property on the object representing this reference value
	 * @param {Number} index
	 * 		The reference ID that uniquely identifies this reference 
	 */
	function Reference(object, property, index)
	{
		this.object = object;
		this.property = property;
		this.index = index;
	}
	
	/**
	 * Walks the list of nodes passed in the method and sets all properties
	 * on this instance's underlying object to the values in the node list
	 *
	 * @private
	 * @param {Array} nodes
	 * 		A list of all nodes in the data graph. This array is used to
	 * 		extract the value of this reference via this reference's unique id.
	 */
	Reference.prototype.setValue = function(nodes)
	{
		var result = false;
		
		if (0 <= this.index && this.index < nodes.length)
		{
			this.object[this.property] = nodes[this.index];
			result = true;
		}
		
		return result;
	};
	
	/**
	 * This post-processing step replaces all reference strings with the actual
	 * object reference to which they refer.
	 * 
	 * @private
	 * @param {Array} input
	 * 		The source array created by the first step of eval'ing the JSON
	 * 		source string.
	 * @return {Object}
	 * 		The resulting object created by dereferencing all reference values
	 * 		and rewiring of the object graph
	 */
	function postProcess(input)
	{
		var result = input;
		
		if (input.length > 0)
		{
			var valid = true;
			
			inputLoop:
			for (var i = 0; i < input.length; i++)
			{
				var item = input[i];
				
				if (item === null || item === undefined)
				{
					valid = false;
					break;
				}
				
				var type = item.constructor;
				var itemGlobal = getWindow(item);
				
				// add any references
				switch (type)
				{
					case itemGlobal.Array:
						postProcessArray(item);
						break;
						
					case itemGlobal.Object:
						postProcessObject(item);
						break;

                    case itemGlobal.String:
                        postProcessMember(input, i);
                        break;
						
					default:
						valid = false;
						break inputLoop;
				}
			}

			if (valid)
			{
				if (references.length > 0)
				{
					result = input[0];
					
					for (var i = 0; i < references.length; i++)
					{
						var success = references[i].setValue(input);
						
						if (success === false)
						{
							result = input;
							break;
						}
					}
				}
			}
		}
		
		return result;
	}
	
	/**
	 * This post-processing step replaces all object references that are members
	 * of the specified array with actual references to the object to which they
	 * refer
	 * 
	 * @private
	 * @param {Array} ary
	 * 		The source array to process
	 * @return {Boolean}
	 * 		Returns true if the specified array was a valid reference array
	 */
	function postProcessArray(ary)
	{
		var result = true;
		
		for (var i = 0; i < ary.length; i++)
		{
			if (postProcessMember(ary, i) === false)
			{
				result = false;
				break;
			}
		}
		
		return result;
	}
	
	/**
	 * This post-processing step replaces all object references that are members
	 * of the specified object with actual references to the object to which
	 * they refer
	 * 
	 * @private
	 * @param {Object} obj
	 * 		The source object to process
	 * @param {Array} references
	 * 		An array of reference instances
	 * @return {Boolean}
	 * 		Returns true if the specified object was a valid reference object
	 */
	function postProcessObject(obj, references)
	{
		var result = true;
		
		for (var p in obj)
		{
			if (postProcessMember(obj, p) === false)
			{
				result = false;
				break;
			}
		}
		
		return result;
	}
	
	/**
	 * This post-processing steps replaces all reference strings with the actual
	 * object reference to which they refer. Also, custom deserializers are
	 * invoked for any matching custom serializer strings that are encountered.
	 * 
	 * @private
	 * @param {Object} obj
	 * 		The object to post-process
	 * @param {String|Number} property
	 * 		The name or index of the object to process.
	 * @return {Boolean}
	 * 		Returns true if the obj[property] value is a valid reference object
	 */
	function postProcessMember(obj, property)
	{
		var item = obj[property];
		var result = true;
		
		if (item !== null && item !== undefined)
		{
			var type = item.constructor;
			var itemGlobal = getWindow(item);
			
			switch (type)
			{
				case itemGlobal.Array:
					// we only allow empty arrays
					if (item.length > 0)
					{
						result = false;
					}
					break;

				case itemGlobal.Object:
					// we only allow empty objects
					for (var p in item)
					{
						result = false;
						break;
					}
					break;
											
				case itemGlobal.String:
					var match;
					
					if (match = item.match(REFERENCE_PATTERN))
					{
						var index = match[1] - 0;
						var ref = new Reference(obj, property, index);
						
						references.push(ref);
					}
					else if (match = item.match(CUSTOM_SERIALIZATION_PATTERN))
					{
						var name = match[1];
						var serializedString = match[2];
						var handler = typeHandlers[name];
						
						if (handler && handler.canDeserialize && handler.canDeserialize(serializedString))
						{
							obj[property] = handler.deserializer(serializedString);
						}
					}
					break;
			}
		}
		
		return result;
	}
	
	/**
	 * For JSON strings that do not contain references, we make a
	 * post-processing step to replace all custom serialization string with
	 * their deserialized instances.
	 * 
	 * @private
	 * @param {String} property
	 * 		The property name to filter
	 * @param {Object} value
	 * 		The value of the property being filtered
	 */
	function filter(property, value)
	{
		var result = value;
		
		if (typeof value === "string")
		{
			var match;
			
			if (match = value.match(CUSTOM_SERIALIZATION_PATTERN))
			{
				var name = match[1];
				var serializedString = match[2];
				var handler = typeHandlers[name];
				
				if (handler && handler.canDeserialize && handler.canDeserialize(serializedString))
				{
					result = handler.deserializer(serializedString);
				}
			}
		}
		
		return result;
	}
	
	var result = evalJSONString(json, options);
	var references = [];
	
	if (result)
	{
		var itemGlobal = getWindow(result);
		
		// if the result is an array, it may be in our format to support
		// cycles and multi-references
		if (result.constructor === itemGlobal.Array)
		{
			// It is an array, so next test for reference strings
			if (REFERENCE_STRING.test(json))
			{
				// found one, so process references
				result = postProcess(result);
			}
			else
			{
				// no references, so process custom serialization strings only
				result = walk('', result, filter);
			}
		}
		else
		{
			// not a "references" structure, so process custom serialization
			// strings only
			result = walk('', result, filter);
		}
	}
	
	return result;
}

/**
 * Find the window object that created the specified object. This returns the
 * correct global context when performing comparisons against the object's
 * constructor.
 * 
 * @private
 * @param {Object} object
 * 		The object from which determine the global context
 * @return {Object}
 * 		Returns the object's owning window
 */
function getWindow(object)
{
	var globalContext;

	var hasParent =
			object !== null
		&&	typeof(object) !== "undefined"
		&&	object.__parent__ !== null
		&&	typeof(object.__parent__) !== "undefined";
	
	if (hasParent)
	{
		var current = object;
		var parent = object.__parent__;
		while (parent && parent !== current)
		{
			current = parent;
			parent = parent.__parent__;
		}
		if (current != object)
		{
			globalContext = current;
		}
	}
	
	if (!globalContext) 
	{
		if (Jaxer.isOnServer) 
		{
			globalContext = Jaxer.pageWindow || Jaxer.frameworkGlobal;
		}
		else 
		{
			globalContext = window;
		}
	}
	
	return globalContext;
}

/**
 * Checks whether the given argument is JSON-serializable (i.e. JSON-
 * representible) or not (e.g. functions are not).
 * 
 * @private
 * @param {Object} obj
 * 		The object to test, which can be of any type or even undefined
 * @return {Boolean}
 * 		true if representable in JSON, false otherwise.
 */
function isSerializeable(obj)
{
	var result = false;
	
	if (obj === null || obj === undefined) 
	{
		result = true;
	}
	else 
	{
		switch (typeof obj)
		{
			case "string":
			case "number":
			case "boolean":
			case "object": // also includes Dates and Arrays
				result = true;
				break;
				
			case "function": // only RegExp "functions" are serializable
				result = (obj.constructor === getWindow(obj).RegExp);
				break;
		}
	}
	
	return result;
}

/**
 * Convert an object to a JSON string
 * 
 * @private
 * @param {Object} data
 * 		The source object to be serialized
 * @param {Object} options
 * 		This is the options object passed into the top-level toJSONString
 * 		function.
 * @return {String}
 * 		The resulting JSON string
 */
function ObjectToJSON(data, options)
{
	// clone options object so as not to alter the original
	options = Jaxer.Util.protectedClone(options);
	
	// decrease recursion depth counter
	options[MAX_DEPTH_PROPERTY]--;
	
	// perform max-depth action if we've reached our maximum recursion depth
	if (options[MAX_DEPTH_PROPERTY] < 0)
	{
		var action = options[MAX_DEPTH_ACTION_PROPERTY] || Serialization.THROW_ACTION;
		
		switch (action)
		{
			case Serialization.TRUNCATE_ACTION:
				return '"' + TRUNCATION_MESSAGE + '"';
				
			case Serialization.THROW_ACTION:
				throw new Error("Maximum recursion depth has been exceeded");
				break;
		}
	}
	
	var result = [];

	// Iterate through all of the keys in the object, ignoring the proto chain.
	for (var k in data)
	{
		var p = '"' + k + '":';
		var v = data[k];
		
		// Note that we ignore elements that are not serializeable
		if (isSerializeable(v)) 
		{
			result.push(p + toCrockfordJSONString(v, options));
		}
	}

	// Join all of the fragments together and return.
	return "{" + result.join(',') + "}";
}

/**
 * Convert a string to a JSON string
 * 
 * @private
 * @param {Object} data
 * 		The source string to be serialized
 * @param {Object} options
 * 		This is the options object passed into the top-level toJSONString
 * 		function.
 * @return {String}
 * 		The resulting JSON string
 */
function StringToJSON(data, options)
{
	// m is a table of character substitutions.
	var characterMap = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	};
	
	// If the string contains no control characters, no quote characters,
	// and no backslash characters, then we can simply slap some quotes
	// around it. Otherwise we must also replace the offending characters
	// with safe sequences.

	if (/["\\\x00-\x1f]/.test(data))
	{
		return '"' + data.replace(
			/([\x00-\x1f\\"])/g,
			function (a, b)
			{
				var c = characterMap[b];
				
				if (c)
				{
					return c;
				}
				
				c = b.charCodeAt();
				
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}
		) + '"';
	}
	
	return '"' + data + '"';
}

/**
 * Convert the specified object into a JSON string
 * 
 * @private
 * @param {Object} data
 * 		The Javascript value to be serialized
 * @param {Object} options
 * 		The options object
 * @return {String}
 * 		The resulting JSON string
 */
function toCrockfordJSONString(data, options)
{
	var result = NO_RESULT;
	
	if (isSerializeable(data)) 
	{
		if (data === null) 
		{
			result = "null";
		}
		else if (data === undefined) 
		{
			var action = options[UNDEFINED_SERIALIZATION_ACTION_PROPERTY] || Serialization.THROW_ACTION;
			
			switch (action)
			{
				case Serialization.SERIALIZE_ACTION:
					result = "undefined";
					break;
					
				case Serialization.NULLIFY_ACTION:
					result = "null";
					break;
					
				case Serialization.THROW_ACTION:
				default:
					throw new Error("Serialization of 'undefined' is not supported unless the undefinedSerializationAction option is set to 'serialize'");
			}
		}
		else 
		{
			var ctor = data.constructor;
			var dataGlobal = getWindow(data);
			
			switch (ctor)
			{
				case dataGlobal.Array:
					result = ArrayToJSON(data, options);
					break;
					
				case dataGlobal.Boolean:
					result = String(data, options);
					break;
					
				case dataGlobal.Number:
					if (isFinite(data) === false) 
					{
						var action = options[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] || Serialization.THROW_ACTION;
						
						switch (action)
						{
							case Serialization.SERIALIZE_ACTION:
								result = String(data, options);
								break;
								
							case Serialization.NULLIFY_ACTION:
								result = "null";
								break;
									
							case Serialization.THROW_ACTION:
							default:
								throw new Error("Serialization of special numbers is not supported unless the specialNumberSerializationAction option is set to 'serialize'");
						}
					}
					else 
					{
						result = String(data, options);
					}
					break;
					
				case dataGlobal.Object:
					result = ObjectToJSON(data, options);
					break;
					
				case dataGlobal.String:
					result = StringToJSON(data, options);
					break;
					
				case dataGlobal.Function:
					// should not get here because we've checked for being
					// serializable, but just in case
					break;
					
				default: // custom built-ins
					if (options[USE_CUSTOM_SERIALIZERS_PROPERTY]) 
					{
						var typeName = findHandlerName(data);
					
						if (typeName !== null) 
						{
							result = StringToJSON("~" + typeName + ":" + typeHandlers[typeName].serializer(data) + "~");
						}
						else 
						{
							// isSerializeable said we could serialize this object,
							// so treat it as a generic object
							result = ObjectToJSON(data, options);
						}
					}
					else if (ctor === dataGlobal.Date) 
					{
						var action = options[DATE_SERIALIZATION_ACTION_PROPERTY] || Serialization.THROW_ACTION;
						
						switch (action)
						{
							case Serialization.SERIALIZE_ACTION:
								result = DateToJSON(data);
								break;
								
							case Serialization.NULLIFY_ACTION:
								result = "null";
								break;
								
							case Serialization.RETURN_OBJECT_ACTION:
								result = "{}";
								break;
								
							case Serialization.THROW_ACTION:
							default:
								throw new Error("Serialization of Dates is not supported unless the dateSerializationAction option is set to 'serialize'");
						}
					}
					else 
					{
						// isSerializeable said we could serialize this object,
						// so treat it as a generic object
						result = ObjectToJSON(data, options);
					}
					break;
			}
		}
	}
	
	return result;
}

/**
 * toJaxerJSONString
 * 
 * @private
 * @param {Object} data
 * @param {Object} options
 */
function toJaxerJSONString(data, options)
{
	var result = NO_RESULT;
	var wrappedItems = [];
	
	/**
	 * A wrapped object is used to hold objects that are not expandable. We
	 * need to be able to add an id property to each object to find cycles and
	 * mult-references in the data graph. If that object doesn't allow new
	 * properties to be added to it (typically XPCOM wrapper objects), then we
	 * can use an instance of WrappedObject in its place. This object will
	 * serve only as a container for an object and its id. This later will be
	 * expanded back into the serialization stream as the underlying object so
	 * this will never appear in the final JSON string
	 * 
	 * @private
	 * @constructor
	 * @param {Object} id
	 * @param {Object} object
	 */
	function WrappedObject(id, object)
	{
		// set id
		this[ID_PROPERTY] = id;
		
		// save reference so we can test if this is exactly equivalent to other
		// references to this object
		this.object = object;
		
		// add to wrapped item list
		wrappedItems.push(this);
	}
	
	/**
	 * Since wrapped objects can't have properties added to them, we need to
	 * check the wrappedItems array to see if it exists there. This is
	 * equivalent to checking if the id property has been defined on an object
	 * that couldn't have that property added to it
	 * 
	 * @private
	 * @param {Object} object
	 * @return {Boolean}
	 */
	function isWrappedItem(object)
	{
		var length = wrappedItems.length;
		var result = false;
		
		for (var i = 0; i < length; i++)
		{
			var wrappedItem = wrappedItems[i];
			
			if (wrappedItem.object === object)
			{
				result = true;
				break;
			}
		}
		
		return result;
	}
	
	/**
	 * This function will return either a WrappedItem instance or the object
	 * passed into the function. If the object has been wrapped, then its
	 * wrapper is returned; othewise, we return the object itself
	 * 
	 * @private
	 * @param {Object} object
	 * @return {Object}
	 */
	function getWrappedItem(object)
	{
		var length = wrappedItems.length;
		var result = object;
		
		for (var i = 0; i < length; i++)
		{
			var wrappedItem = wrappedItems[i];
			
			if (wrappedItem.object === object)
			{
				result = wrappedItem;
				break;
			}
		}
		
		return result;
	}
	
	/**
	 * Walk the object graph and tag all items in the graph. Note that cycles
	 * and multi-references are detected in this process and all special
	 * properties used for this discovery process are later removed.
	 * 
	 * @private
	 * @return {Boolean}
	 * 		Return true if this specifed object contains references; otherwise,
	 * 		return false. This value can be used to decide if this object needs
	 * 		to be represented as standard JSON or in our extended format.
	 */
	function tagReferences()
	{
		var result = false;
		
		var index = 0;
		var queue = [data];
		
		while (queue.length > 0)
		{
			var item = queue.shift();
			
			if (item !== null && item !== undefined)
			{
				if (!item.hasOwnProperty || (item.hasOwnProperty(ID_PROPERTY) === false && isWrappedItem(item) === false))
				{
					// NOTE: In some browsers, such as Safari 3 and possibly
					// Firefox 2, RegExp's yield "function" here, and there are
					// other such examples
					if (typeof(item) === "object" || typeof(item) === "function") 
					{
						var type = item.constructor;
						var itemGlobal = getWindow(item);
						
						if (type === itemGlobal.Array) 
						{
							if (item.length > 0) 
							{
								item[ID_PROPERTY] = index;
								options[ITEMS_PROPERTY][index] = item;
								index++;
								
								for (var i = 0; i < item.length; i++) 
								{
									// We only need to process elements that
									// are serializeable since non-serializeable
									// elements will be skipped later
									if (isSerializeable(item[i])) 
									{
										queue.push(item[i]);
									}
								}
							}
						}
						else 
						{
							var handlerName = findHandlerName(item);
							
							if (type === itemGlobal.Object || handlerName !== null) 
							{
								try 
								{
									item[ID_PROPERTY] = index;
									options[ITEMS_PROPERTY][index] = item;
								} 
								catch (e) 
								{
									// Some objects, like XPCOM objects, don't
									// allow properties to be added to them, so,
									// we wrap these objects in WrappedObjects
									// for later special processing
									options[ITEMS_PROPERTY][index] = new WrappedObject(index, item);
								}
								
								index++;
							}
							
							// only process child properties for objects that
							// don't have custom serialization
							if (handlerName === null) 
							{
								for (var p in item) 
								{
									// no need to process id properties that were just added
									if (p !== ID_PROPERTY) 
									{
										try 
										{
											// We only need to process elements that
											// are serializeable since non-serializeable
											// elements will be skipped later
											if (isSerializeable(item[p])) 
											{
												queue.push(item[p]);
											}
										} 
										catch (e) 
										{
											Jaxer.Log.debug("During serialization, could not access property " + p + " so it will be ignored");
										}
									}
								}
							}
						}
					}
				}
				else
				{
					// found multiple references to the same object or array
					result = true;
				}
			}
		}
		
		return result;
	}
	
	/**
	 * Convert the specified items into a JSON string emitting special
	 * string values for references
	 * 
	 * @private
	 * @return {String}
	 * 		The resulting JSON string
	 */
	function toJSONWithReferences()
	{
		var items = options[ITEMS_PROPERTY];
		var references = [];
			
		for (var i = 0; i < items.length; i++)
		{
			var item = items[i];
			
			// grab stand-in object if this is a WrappedObject
			if (item.constructor === WrappedObject)
			{
				item = item.object;
			}
			
			var type = item.constructor;
			var itemGlobal = getWindow(item);

			switch (type)
			{
				case itemGlobal.Array:
					var parts = [];
					
					for (var j = 0; j < item.length; j++)
					{
						var elem = getWrappedItem(item[j]);
						
						if (elem !== undefined && elem !== null && elem.hasOwnProperty && elem.hasOwnProperty(ID_PROPERTY))
						{
							parts.push('"~' + elem[ID_PROPERTY] + '~"');
						}
						else
						{
							parts.push(toCrockfordJSONString(elem, options));
						}
					}
					
					references.push("[" + parts.join(",") + "]");
					break;
					
				case itemGlobal.Object:
					var parts = [];
					
					for (var p in item)
					{
						if (p !== ID_PROPERTY)
						{
							var elem = getWrappedItem(item[p]);
							var k = '"' + p + '":';
							
							if (elem !== undefined && elem !== null && elem.hasOwnProperty && elem.hasOwnProperty(ID_PROPERTY))
							{
								parts.push(k + '"~' + elem[ID_PROPERTY] + '~"');
							}
							else
							{
								parts.push(k + toCrockfordJSONString(elem, options));
							}
						}
					}
					
					references.push("{" + parts.join(",") + "}");
					break;
					
				default:
					var typeHandler = findHandlerName(item);
					
					if (typeHandler !== null)
					{
						references.push(toCrockfordJSONString(item, options));
					}
					else
					{
						// log and/or throw exception?
					}
					break;
			}
		}
		
		return "[" + references.join(",") + "]";
	}
	
	/**
	 * Remove id properties used to detect cycles and multi-references
	 */
	function untagReferences()
	{
		var items = options[ITEMS_PROPERTY];
		
		for (var i = 0; i < items.length; i++) 
		{
			var item = items[i];
			
			// only non-wrapped objects were able to have the id property added to them
			if (item.constructor !== WrappedObject) 
			{
				delete item[ID_PROPERTY];
			}
		}
	}
	
	// start of function body
	
	if (data !== undefined)
	{
		if (tagReferences() === false)
		{
			// we didn't find any cycles or multi-references, so remove the
			// properties we used to identify those structures
			untagReferences();
			
			// and then serialize the data as standard JSON
			result = toCrockfordJSONString(data, options);
		}
		else
		{
			// we did find a cycle or multi-reference, so emit our semantically
			// special JSON structure
			result = toJSONWithReferences();
			
			// we're done with our object tags, so remove those
			untagReferences();
		}
	}

	return result;
}

/*
 * BEGIN: Public Serialization functions section
 */

/**
 * Add a top-level JSON serializer
 * 
 * @alias Jaxer.Serialization.addDeserializer
 * @param {String} name
 * 		The unique name of the deserializer. This name can be specified in the
 * 		options object provided to the fromJSONString function. That will select
 * 		this deserializer as the top-level function to deserialize the specified
 * 		object. Note that case is not significant
 * @param {Function} deserializer
 * 		The function used to deserialized the JSON string created by the
 * 		associated serializer.
 * @param {Function} [beforeDeserialization]
 * 		An optional function that will be called before the top-level
 * 		deserialization process begins. This function should take a single
 * 		parameter which will be the options object provided to the
 * 		fromJSONString function. Note that the options object will be an
 * 		inherited clone of the object sent to fromJSONString. This allows this
 * 		function to initialize any data structures needed by the deserializer
 * 		without altering the original options object passed into fromJSONString
 * @param {Function} [afterDeserialization]
 * 		An optional function that will be called after the top-level
 * 		deserialization process ends. This function should take a single
 * 		parameter which will be the options object provided to the
 * 		fromJSONString function. Note that the options object will be an
 * 		inherited clone of the object sent to the fromJSONString.
 */
Serialization.addDeserializer = function(name, deserializer, beforeDeserialization, afterDeserialization)
{
	if (typeof(name) === "string" && typeof(deserializer) === "function")
	{
		name = name.toLocaleLowerCase();
		
		// Only allow "jaxer" to be registered once
		if (name !== Serialization.JAXER_METHOD || deserializers.hasOwnProperty(Serialization.JAXER_METHOD) === false)
		{
			var handler = {
				deserializer: deserializer,
				beforeDeserialization: (typeof(beforeDeserialization) === "function") ? beforeDeserialization : function() {},
				afterDeserialization: (typeof(afterDeserialization) === "function") ? afterDeserialization : function() {}
			};
			
			deserializers[name] = handler;
		}
	}
};

/**
 * Add a top-level JSON serializer
 * 
 * @alias Jaxer.Serialization.addSerializer
 * @param {String} name
 * 		The unique name of the serializer. This name can be specified in the
 * 		options object provided to the toJSONString function. That will select
 * 		this serializer as the top-level function to serialize the specified
 * 		object. Note that case is not significant
 * @param {Function} serializer
 * 		The function used to serialize data. This function should take two
 * 		arguments: the actual data to serialize and an options object
 * @param {Function} [beforeSerialization]
 * 		An optional function that will be called before the top-level
 * 		serialization process begins. This function should take a single
 * 		parameter which will be the options object provided to the toJSONString
 * 		function. Note that the options object will be an inherited clone of
 * 		the object sent to the toJSONString. This allows this function to
 * 		initialize any data structures needed by the serializer without altering
 * 		the original options object passed into toJSONString
 * @param {Function} [afterSerialization]
 * 		An optional function that will be called after the top-level
 * 		serialization process ends. This function should take a single
 * 		parameter which will be the options object provided to the toJSONString
 * 		function. Note that the options object will be an inherited clone of
 * 		the object sent to the toJSONString.
 */
Serialization.addSerializer = function(name, serializer, beforeSerialization, afterSerialization)
{
	if (typeof(name) === "string" && typeof(serializer) === "function")
	{
		name = name.toLocaleLowerCase();
		
		// Only allow "jaxer" to be registered once
		if (name !== Serialization.JAXER_METHOD || serializers.hasOwnProperty(Serialization.JAXER_METHOD) === false)
		{
			var handler = {
				serializer: serializer,
				deserializer: (typeof(deserializer) === "function") ? deserializer : function() {},
				beforeSerialization: (typeof(beforeSerialization) === "function") ? beforeSerialization : function() {},
				afterSerialization: (typeof(afterSerialization) === "function") ? afterSerialization : function() {}
			};
			
			serializers[name] = handler;
		}
	}
};

/**
 * Add handlers for custom serialization/deserialization
 * 
 * @alias Jaxer.Serialization.addTypeHandler
 * @param {String} name
 * 		The fully-qualified name of the type. This should reflect the full,
 * 		potentially dotted, notation you would need to use to access this type's
 * 		constructor from the global context.
 * @param {Function} serializer
 * 		A function that takes an instance of the type it serializes and that
 * 		returns a string representation of the type suitable as input into
 * 		the deserializer
 * @param {Function} deserializer
 * 		A function that takes a string produced by the custom serializer and
 * 		that returns a new instance of the custom supported type.
 * @param {Function} [canSerialize]
 * 		An optional function that takes an object instance and returns a
 * 		boolean. This function should return true if it the current handler is
 * 		able to serialize the object passed to it.
 * @param {Function} [canDeserialize]
 * 		An optional function that takes an object instance and returns a
 * 		boolean. This function should return true if it the current handler is
 * 		able to deserialize the string passed to it.
 */
Serialization.addTypeHandler = function(name, serializer, deserializer, canSerialize, canDeserialize)
{
	if
	(
			typeof(name) === "string"
		&&	VALID_TYPE_PATTERN.test(name)
		&&	typeof(serializer) === "function"
		&&	typeof(deserializer) === "function"
	)
	{
		// add handlers
		var handler = {
			constructor: null,
			serializer: serializer,
			deserializer: deserializer
		};
		
		// set serialization test function
		if (typeof(canSerialize) === "function")
		{
			handler.canSerialize = canSerialize;
		}
		else
		{
			handler.canSerialize = function(item)
			{
//				var candidate = handler.constructor;
				var result = false;
				
//				// We have to do lazy loading of constructors so we have references
//				// from the correct global
//				if (candidate === null) 
//				{
					// look up constructor
					var parts = name.split(/\./);
					
					// start at global
					var candidate = getWindow(item);
					
					// and traverse each segment of the type
					for (var i = 0; i < parts.length; i++) 
					{
						var part = parts[i];
						
						if (candidate && ((candidate.hasOwnProperty && candidate.hasOwnProperty(part)) || (part in candidate)))
						{
							candidate = candidate[part];
						}
						else 
						{
							candidate = null;
							break;
						}
					}
					
//					if (candidate !== null) 
//					{
//						handler.constructor = candidate;
//					}
//					else 
//					{
//						handler.constructor = undefined;
//					}
//				}
				
				if (candidate !== null) 
				{
					result = candidate === item.constructor;
				}
				
				return result;
			}
		}
		
		// set deserialization test function
		if (typeof(canDeserialize) === "function")
		{
			handler.canDeserialize = canDeserialize;
		}
		else
		{
			handler.canDeserialize = function(str)
			{
				return true; // By default we should be able to handle any string we've serialized
			}
		}
		
		typeHandlers[name] = handler;
	}
};

/**
 * Reconstructs a Javascript data structure from a JSON string. Note that the
 * serialization mode ('Jaxer', 'JSON', or 'nativeJSON') can be specified in
 * the "options" parameter with the 'as' property. This will default to
 * 'nativeJSON' when either no options are passed in or if the 'as' property is
 * not defined. See Jaxer.Serialization.toJSONString for more details.
 * 
 * @alias Jaxer.Serialization.fromJSONString
 * @param {String} json
 * 		A string in the JSON format
 * @param {Object} options
 * 		The options objecct which can be used to control deserialization
 * @return {Object}
 * 		The resulting object graph after converting the JSON string to the
 * 		equivalent Javascript data structure
 * @see Jaxer.Serialization.toJSONString
 */
Serialization.fromJSONString = function fromJSONString(json, options)
{
	var result = NO_RESULT;
	
	// setup default values
	if (options && typeof(options) === "object")
	{
		// prevent changes to the original options object
		var clone = Jaxer.Util.protectedClone(options);
		
		// add properties to our clone when the original options object does
		// not contain them
		
		if (options.hasOwnProperty("as") === false)
		{
			clone.as = Serialization.NATIVE_JSON_METHOD;
		}
		
		// make sure we use the clone from here on
		options = clone;
	}
	else
	{
		// create a new object with default values
		options = {
			as: Serialization.NATIVE_JSON_METHOD
		};
	}
	
	// get the name of the serializer we're supposed to use	
	var deserializerName = options.as.toLocaleLowerCase();
	
	// grab appropriate serializer
	if (serializers.hasOwnProperty(deserializerName))
	{
		// grab handler functions for this serialization method
		var handler = deserializers[deserializerName];
		
		// allow serializer to perform any initialization it needs
		handler.beforeDeserialization(options);
		
		// deserialize
		result = handler.deserializer(json, options);
		
		// allow serializer to perform any cleanup it needs
		handler.afterDeserialization(options);
	}
	else
	{
		throw new Error("Unknown deserialization method: '" + options.as + "'");
	}
	
	return result;
};

/**
 * Remove support for the custom JSON serializer
 * 
 * @alias Jaxer.Serialization.removeSerializer
 * @param {String} name
 * 		The name of the serializer to remove. Note that case is not significant
 * @return {Boolean}
 * 		Returns true if the serializer was successfully removed. Note that this
 * 		function will return false if you attempt to remove a handler that is
 * 		not already registered or if it is a built-in serializer like "jaxer".
 */
Serialization.removeSerializer = function(name)
{
	var result = false;
	
	if (typeof(name) === "string")
	{
		name = name.toLocaleLowerCase();
		
		if (name !== Serialization.JAXER_METHOD) 
		{
			result = delete serializers[name];
		}
	}
	
	return result;
};

/**
 * Remove support for custom serialization/deserialization for the specified
 * type
 * 
 * @alias Jaxer.Serialization.removeTypeHandler
 * @param {String} name
 * 		The fully qualified name of the type to remove
 * @return {Boolean}
 * 		Returns true if the handler was successfully removed. Note that this
 * 		function will return false if you attempt to remove a handler that is
 * 		not already registered.
 */
Serialization.removeTypeHandler = function(name)
{
	var result = false;
	
	if (typeof(name) === "string") 
	{
		result = delete typeHandlers[name];
	}
	
	return result;
};

/**
 * Convert the specified object into a JSON representation. Note that we have
 * modified JSON to support object references (cycles) and to convert Dates into
 * a special format that will be recognized by our code during deserialization.
 * 
 * This function includes an optional second parameter which can be used to
 * control how the data is serialized. If the options parameter defines an 'as'
 * property, that will be used to select the serialization format. Currently,
 * the values 'Jaxer', 'JSON', and 'nativeJSON' are supported. 'Jaxer' includes
 * support for cycles, multi-refs, and custom type serializers. 'JSON' and
 * 'nativeJSON' follow the serialization format and semantics as defined by
 * Douglas Crockford on the json.org website.
 * 
 * When specifying the 'Jaxer' serializer, additional options are available. The
 * "useCustomSerializers" has a boolean value which defaults to true. When this
 * property is true, any type serializers that have been registered via
 * addTypeHandler will be used in the serialization process. When this value is
 * false, items needing custom serialization will be ignored as they would be in
 * the "JSON" format. The "undefinedSerializationAction" property determines how
 * the 'undefined' value is handled. The action defaults to 'serialize', but
 * 'throw' is also supported which will throw an exception when trying to
 * serialize 'undefined'.
 * 
 * When specifying the 'JSON' serializer, additional options are available. The
 * 'maxDepth' property, which defaults to 10, is used to prevent deep recursion.
 * If the recursion level is encountered, the 'maxDepthAction' property
 * determines the serializer's action. 'truncate' will emit a "__truncated__"
 * string in place of the object that would cause the recursion level to be
 * exceeded. 'throw' will throw an exception. The 'dateSerializationAction'
 * property is used to determine how dates are processed. A value of 'serialize'
 * will convert the date to a specially formatted string as described in the
 * json.org example code. A value of 'throw' will throw an exception when a date
 * is encountered. Finally, a value of "return object" will return an empty
 * object in place of the Date itself. The 'undefinedSerializationAction'
 * property is used to determine how 'undefined' is processed. A value of
 * 'serialize' will convert the value to 'undefined'. 'throw' will throw an
 * exception and 'nullify' will return 'null'. The
 * 'specialNumberSerializationAction' property is used to determine how
 * Infinity, -Infinity, and NaN are processed. A value of 'serialize' will
 * convert the value to their text representation which is the same as the
 * identifier used to represent them. 'throw' will throw an exception and
 * 'nullify' will return null.
 * 
 * When specifying the 'nativeJSON' serializer, the built-in native support for
 * JSON serialization will be used, when available. This serialization does not
 * support any custom options. In the case where 'nativeJSON' is specified but
 * is not available, this mode will fallback to the 'JSON' mode with options
 * specified in that mode to match the behavior of the native JSON
 * implementation as specificed in the ECMAScript 3.1 specification.
 * 
 * Note that other serializers can be registered with Jaxer. Most likely those
 * serializers will define their own set of options. You will need to refer to
 * the implementors documentation to determine those properties, their values,
 * and their associated semantics.
 * 
 * @alias Jaxer.Serialization.toJSONString
 * @param {Object} data
 * 		The source object to convert to a JSON string
 * @param {Object} [options]
 * 		An optional object used to specify configuration info to the selected
 * 		serializer
 * @return {String}
 * 		The resulting JSON string which can be reversed back into the source
 * 		object via Serialization.fromJSONString
 */
Serialization.toJSONString = function(data, options)
{
	var result = NO_RESULT;
	
	// setup default values
	if (options && typeof(options) === "object")
	{
		// prevent changes to the original options object
		var clone = Jaxer.Util.protectedClone(options);
		
		// add properties to our clone when the original options object does
		// not contain them
		
		if (options.hasOwnProperty("as") === false)
		{
			clone.as = Serialization.NATIVE_JSON_METHOD;
		}
		
		// make sure we use the clone from here on
		options = clone;
	}
	else
	{
		// create a new object with default values
		options = {
			as: Serialization.NATIVE_JSON_METHOD
		};
	}
	
	// get the name of the serializer we're supposed to use	
	var serializerName = options.as.toLocaleLowerCase();
	
	// grab appropriate serializer
	if (serializers.hasOwnProperty(serializerName))
	{
		// grab handler functions for this serialization method
		var handler = serializers[serializerName];
		
		// allow serializer to perform any initialization it needs
		handler.beforeSerialization(options);
		
		// serialize
		result = handler.serializer(data, options);
		
		// allow serializer to perform any cleanup it needs
		handler.afterSerialization(options);
	}
	else
	{
		throw new Error("Unknown serialization method: '" + options.as + "'");
	}
	
	return result;
};

/*
 * BEGIN: Serializer registration section
 */

// register Jaxer-style serialization which supports cycles, multi-references
// and customer serialization by type
(function() {
	// common options handling
	function initOptions(options)
	{
		// make sure the following values are defined
		var defaults = {};
		
		// NOTE: These properties are not used by the "jaxer" serializer proper,
		// but in cases where there are no cycles or multi-refs, we simply call
		// the "json" serializer which does use these properties.
		defaults[MAX_DEPTH_PROPERTY] = DEFAULT_MAX_DEPTH;
		defaults[MAX_DEPTH_ACTION_PROPERTY] = Serialization.TRUNCATE_ACTION;
		
		defaults[USE_CUSTOM_SERIALIZERS_PROPERTY] = true;
		defaults[UNDEFINED_SERIALIZATION_ACTION_PROPERTY] = Serialization.SERIALIZE_ACTION;
		defaults[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] = Serialization.SERIALIZE_ACTION;
		
		Jaxer.Util.safeSetValues(options, defaults);
		
		// clear custom serializer cache
		clearHandlerCache();
	}
	
	Serialization.addSerializer(
		Serialization.JAXER_METHOD,
		toJaxerJSONString,
		function beforeJaxerSerialization(options)
		{
			// do common options setup
			initOptions(options);
			
			// make sure "items" array exists
			options[ITEMS_PROPERTY] = [];
		},
		function afterJaxerSerialization(options)
		{
			// release any references we might have in the "items" array
			delete options[ITEMS_PROPERTY];
		}
	);
	
	Serialization.addDeserializer(
		Serialization.JAXER_METHOD,
		fromJaxerJSONString,
		initOptions
	);
})();

// register Crockford-style serialization
(function() {
	function initOptions(options)
	{
		// make sure the following values are defined
		var defaults = {};
		
		defaults[MAX_DEPTH_PROPERTY] = DEFAULT_MAX_DEPTH;
		defaults[MAX_DEPTH_ACTION_PROPERTY] = Serialization.THROW_ACTION;
		defaults[DATE_SERIALIZATION_ACTION_PROPERTY] = Serialization.SERIALIZE_ACTION;
		defaults[UNDEFINED_SERIALIZATION_ACTION_PROPERTY] = Serialization.NULLIFY_ACTION;
		defaults[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] = Serialization.NULLIFY_ACTION;
		
		Jaxer.Util.safeSetValues(options, defaults);
		
		// make sure we don't use our custom serializers in "Crockford" mode
		options[USE_CUSTOM_SERIALIZERS_PROPERTY] = false;
	}
	
	Serialization.addSerializer(
		Serialization.JSON_METHOD,
		toCrockfordJSONString,
		initOptions
	);
	
	Serialization.addDeserializer(
		Serialization.JSON_METHOD,
		fromCrockfordJSONString,
		initOptions
	);
})();

// register native JSON serialization
(function() {
	// These defaults cause the JS-based serialization to match the native
	// implementation. These are used when the native code is not available
	var defaults = {};
	
	defaults[MAX_DEPTH_PROPERTY] = DEFAULT_MAX_DEPTH;
	defaults[MAX_DEPTH_ACTION_PROPERTY] = Serialization.THROW_ACTION;
	defaults[DATE_SERIALIZATION_ACTION_PROPERTY] = Serialization.RETURN_OBJECT_ACTION;
	defaults[UNDEFINED_SERIALIZATION_ACTION_PROPERTY] = Serialization.NULLIFY_ACTION;
	defaults[SPECIAL_NUMBER_SERIALIZATION_ACTION_PROPERTY] = Serialization.NULLIFY_ACTION;
	
	function hasNativeJSON()
	{
		var window = getWindow();
		var result = false;
				
		if (window && "JSON" in window)
		{
			if ("stringify" in window.JSON)
			{
				result = true;
			}
		}
		
		return result;
	}
	
	Serialization.addSerializer(
		Serialization.NATIVE_JSON_METHOD,
		function(data, options)
		{
			if (hasNativeJSON())
			{
				return JSON.stringify(data);
			}
			else
			{
				return toCrockfordJSONString(data, defaults);
			}
		}
	);
	
	Serialization.addDeserializer(
		Serialization.NATIVE_JSON_METHOD,
		function(json, options)
		{
			if (hasNativeJSON())
			{
				return JSON.parse(json);
			}
			else
			{
				return fromCrockfordJSONString(json, defaults);
			}
		}
	);
})();

/*
 * BEGIN: Custom serialization handlers section
 */

// register Date serializer/deserializer
Serialization.addTypeHandler(
	"Date",
	function serializeDate(date)
	{
		// Format integers to have at least two digits.
		function pad(n)
		{
			return n < 10 ? '0' + n : n;
		}
	
		return date.getUTCFullYear() + '-' +
			pad(date.getUTCMonth() + 1) + '-' +
			pad(date.getUTCDate()) + 'T' +
			pad(date.getUTCHours()) + ':' +
			pad(date.getUTCMinutes()) + ':' +
			pad(date.getUTCSeconds());
	},
	function deserializeDate(serializedDate)
	{
		var match = serializedDate.match(DATE_PATTERN);
		var result = null;
						
		if (match !== null)
		{
			var win = getWindow();
			result = new win.Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));
		}
		
		return result;
	}
);

// register RegExp serializer/deserializer
Serialization.addTypeHandler(
	"RegExp",
	function serializeRegExp(regex)
	{
		return regex.toString();
	},
	function deserializeRegExp(serializedRegex)
	{
		// NOTE: Some browsers add custom regex flags. Since we can't know what
		// all of those might be at any given point in time, we allow any
		// character to serve as a flag as opposed to simply [img]
		var match = serializedRegex.match(/^\/(.+)\/([a-zA-Z]+)?$/);
		var result = serializedRegex;
		
		if (match !== null)
		{
			var win = getWindow();
			result = new win.RegExp(match[1], match[2]);
		}
		
		return result;
	}
);

// NOTE: If this is set to false, we won't bother trying to use the type handler
// client-side
var tryXMLDocument = true;

// register XMLDocument serializer/deserializer
Serialization.addTypeHandler(
	"XMLDocument",
	function serializeXMLDocument(doc)
	{
		var win = getWindow();
		var result = null;
		
		if (win.XMLSerializer) 
		{
			var serializer = new win.XMLSerializer();
			result = serializer.serializeToString(doc);
		}
		else
		{
			result = doc.xml;
		}
		
		return result;
	},
	function deserializeXMLDocument(xml)
	{
		var win = getWindow();
		var result = null;
		
		if (win.DOMParser) 
		{
			var parser = new win.DOMParser();
			result = parser.parseFromString(xml, "application/xml");
		}
		else if (win.ActiveXObject) 
		{
			try 
			{
				var doc = new win.ActiveXObject("Microsoft.XMLDOM");
				doc.async = false;
				doc.loadXML(xml);
				result = doc;
			} 
			catch (e) 
			{
				if (!Jaxer.isOnServer) tryXMLDocument = false;
			}
		}
		
		return result;
	},
	function canSerializeXMLDocument(data)
	{
		if (!Jaxer.isOnServer && !tryXMLDocument) return false;
		var win = getWindow(data);
		if (data && win.XMLSerializer && data.constructor == win.XMLDocument) return true;
		if (data && win.ActiveXObject && (typeof data.constructor == "undefined") && (typeof data.xml == "string")) return true;
		if (!Jaxer.isOnServer) tryXMLDocument = false;
		return false;
	},
	function canDeserializeXMLDocument(str)
	{
		if (!Jaxer.isOnServer && !tryXMLDocument) return false;
		var win = getWindow();
		if (win.DOMParser) return true;
		if (win.ActiveXObject) return true; // There's no way to know more without trying: if it turns out we can't actually deserialize, we'll find out the first time we try to do so. 
		if (!Jaxer.isOnServer) tryXMLDocument = false;
		return false;
	}
);

/*
 * END: Custom serialization handlers section
 */

// expose Serialization in Jaxer namespace
Jaxer.Serialization = Serialization;

if (Jaxer.isOnServer)
{
	frameworkGlobal.Serialization = Jaxer.Serialization;
}

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Parsing > FunctionInfo.js
 */
coreTraceMethods.TRACE('Loading fragment: FunctionInfo.js');
Jaxer.lastLoadedFragment = 'FunctionInfo.js';

(function(){

var log = Log.forModule("FunctionInfo");

// private constants
var INVOKE_NAME = "remote";

/**
 * @classDescription {Jaxer.FunctionInfo} Encapsulates function information
 * needed for generating client-side proxies and for server-side storage of
 * functions used in callbacks.
 */

/**
 * This class encapsulates function information needed for generating
 * client-side proxies and for server-side storage of functions used in
 * callbacks.
 * 
 * @constructor
 * @alias Jaxer.FunctionInfo
 * @param {String} functionName
 * 		This parameter is the name of the function this info represents.
 * @param {String[]} parameterNames
 * 		This parameter is an array of parameter names for the function this
 * 		info represents.
 * @param {String} source
 * 		This parameter is the actual source code of the function this info
 * 		represents.
 * @return {Jaxer.FunctionInfo}
 * 		Returns an instance of FunctionInfo.
 */

/**
 * This class encapsulates function information needed for generating
 * client-side proxies and for server-side storage of functions used in
 * callbacks.
 * 
 * @advanced
 * @constructor
 * @alias Jaxer.FunctionInfo
 * @param {Function} functionReference
 * 		This is a reference to the actual Javascript function instance this
 * 		info represents.
 * @param {Node} [functionNode]
 * 		This is an optional parameter that is the root node of an AST
 * 		representing the function this info represents.
 * @return {Jaxer.FunctionInfo}
 * 		Returns an instance of FunctionInfo.
 */
function FunctionInfo(functionReference, functionNode)
{
	if (arguments.length == 3)
	{
		this.name = arguments[0];
		this.parameterNames = arguments[1];
		this.source = arguments[2];
		this.prototypeProperties = [];
	}
	else
	{
		if (functionNode === undefined)
		{
			var source = functionReference.toString();
			var ast = parse(source, "<none>", 1);
			
			functionNode = ast.funDecls[0];
		}
		
		this.name = functionNode.name;
		this.parameterNames = functionNode.params;
		this.source = functionReference.toString();
		this.prototypeProperties = [];
		
		if (functionReference.hasOwnProperty("prototype"))
		{
			var proto = functionReference.prototype;
			var properties = [];
			
			for (var p in proto)
			{
				// make sure this is a local property only and a function
				if (proto.hasOwnProperty(p) && typeof(proto[p]) == "function")
				{
					properties.push(p);
				}
			}
			
			var self = this;
			
			properties.sort().forEach(function(p)
			{
				var ref = proto[p];
				var source = p + " = " + ref.toString();
				var ast = parse(source, "<none>", 1);
				var node = ast[0].expression[1];
				
				node.name = p;
				
				self.prototypeProperties.push(new FunctionInfo(ref, node));
			});
		}
	}
	this.removeFromClient = null;
	this.removeFromServer = null;
}

/**
 * Is the underlying function a native one (for which no actual source is
 * available)?
 * 
 * @advanced
 * @alias Jaxer.FunctionInfo.prototype.isNative
 * @return {Boolean}
 */
FunctionInfo.prototype.isNative = function isNative()
{
	return Util.isNativeFunctionSource(this.source);
}

/**
 * Create a string representation of the underlying function to be used
 * client-side as the source of this function.
 * 
 * @advanced
 * @alias Jaxer.FunctionInfo.prototype.createClientSource
 * @return {String}
 * 		Returns a string representation of this function info's underlying
 * 		Javascript function in a form needed to execute the function on the
 * 		client
 */
FunctionInfo.prototype.createClientSource = function()
{
	var buffer = [];
	var parentName = this.name;
	
	buffer.push(this.source);
	
	this.prototypeProperties.forEach(function(f)
	{
		buffer.push([parentName, ".prototype.", f.name, " = ", f.createClientSource(), ";"].join(""));
	});
	
	return buffer.join("\n");
};

/**
 * Create a string representation of the underlying function to be used
 * during a callback. This source will be stored in the callback database and
 * will be used to reconstitute the function during a callback. This is used
 * for cached and proxied functions.
 * 
 * @advanced
 * @alias Jaxer.FunctionInfo.prototype.createServerFunction
 * @param {String} [namespace]
 * 		If specified, the function is specified as a property on the given
 * 		namespace object. Otherwise, the function is specified as a global
 * 		property.
 * @param {Boolean} [proxied]
 * 		If specified and true, the function will have a property called "proxy"
 * 		and set to true.
 * @param {Boolean} [noLocalScope]
 * 		If specified and true, the function will NOT be assigned to a global
 * 		property with its name. That is, this.<name> will NOT be created.
 * @return {String}
 * 		Returns a string representation of this function info's underlying
 * 		Javascript function in a form needed to execute the function on the
 * 		server.
 */
FunctionInfo.prototype.createServerFunction = function(namespace, proxied, noLocalScope)
{
	var sources = [];
	
	var assignments = [];
	var refString = (namespace ? (namespace + ".") : "") + this.name;
	assignments.push(refString);
	if (!noLocalScope)
	{
		assignments.push("this." + this.name);
	}
	assignments.push(this.source);
	
	sources.push(assignments.join(" = ") + ";"); // main assignments of function body to properties
	if (proxied)
	{
		sources.push(refString + ".proxy = true;")
	}
	
	// add prototype methods
	this.prototypeProperties.forEach(function(f)
	{
		sources.push(refString + ".prototype." + f.name + " = " + f.source + ";");
	});
	
	return sources.join("\n");
};

frameworkGlobal.FunctionInfo = Jaxer.FunctionInfo = FunctionInfo;

Log.trace("*** FunctionInfo.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Parsing > TextParser.js
 */
coreTraceMethods.TRACE('Loading fragment: TextParser.js');
Jaxer.lastLoadedFragment = 'TextParser.js';

(function(){

/**
 * @classDescription {Range} Represents a block of text within a string.
 */

/**
 * The Range class is used to represent a block of text within a string.
 * 
 * @private
 * @constructor
 * @alias Range
 * @param {Number} start
 * 		The offset to the beginning of the range
 * @param {Number} end
 * 		The offset to the end of the range
 * @return {Range}
 * 		Returns an instance of Range.
 */
function Range(start, end)
{
	this.start = start;
	this.end = end;
}

/**
 * Determine if the specified value is contained by this range. Note that the
 * value must be contained by the half-open interval [start,end). This means
 * that a value equal to the ending offset of this range is not considered to
 * be contained by the range. However, an offset equal to the start of this
 * range is within the ragne.
 * 
 * @private
 * @alias Range.prototype.contains
 * @param {Number} value
 * 		The value to test
 * @return {Boolean}
 * 		Returns true if the value is contained within this range
 */
Range.prototype.contains = function(value)
{
	return (this.start <= value && value < this.end);
};

/**
 * Determine if this range contains any content. This method will return true
 * if the start of this rang eis greater than or equal to the end of this range.
 * 
 * @private
 * @alias Range.prototype.isEmpty
 * @return {Boolean}
 * 		Returns true if this range is empty
 */
Range.prototype.isEmpty = function()
{
	return (this.start >= this.end);
};

/**
 * Determines if two ranges are overlapping. Note this uses the contains method
 * to determine the overlap so the same rules about half-open intervals
 * mentioned in that method's description also apply here.
 * 
 * @private
 * @alias Range.prototype.isOverlapping
 * @param {Range} range
 * 		The range to test
 * @return {Boolean}
 * 		Returns true if the ranges overlap
 */
Range.prototype.isOverlapping = function(range)
{
	var result;
	
	if (this.isEmpty() || range.isEmpty())
	{
		result = false;
	}
	else
	{
		result = (
			this.contains(range.start)   ||
			this.contains(range.end - 1) ||
			range.contains(this.start)   ||
			range.contains(this.end - 1)		
		);
	}
	
	return result;
};

var log = Log.forModule("TextParser");

var JS_COMMENT_PATTERN = /(?:\/\*(?:.|[\r\n])+?\*\/)|(?:\/\/[^\r\n]*)/mg;
var NAMED_FUNCTION_PATTERN = /function\s+([\w\$]+)\s*\(([^\)]*)\)/mg;
var WHITESPACE_PATTERN = /^\s+$/;

/**
 * @namespace {Jaxer.TextParser} Namespace object holding functions and members
 * used for simple parsing of source code for reading runat values, proxy
 * values, which functions were defined in which script blocks, etc.
 * @advanced
 */
var TextParser = {};

/**
 * Find all comments in the specified source and return an array of Ranges, one
 * for each comment.
 * 
 * @alias Jaxer.TextParser.getCommentRanges
 * @private
 * @param {String} source
 * 		The Javascript source code to parse
 * @return {Range[]}
 * 		A list of range objects representing the range of all multi-line
 * 		comments in the source code
 */
TextParser.getCommentRanges = function(source)
{
	var commentRanges = [];
	var commentMatcher = JS_COMMENT_PATTERN.exec(source);
	
	while (commentMatcher != null)
	{
		var start = commentMatcher.index;
		var end = JS_COMMENT_PATTERN.lastIndex;
		var range = new Range(start, end);
		
		commentRanges.push(range);
		
		commentMatcher = JS_COMMENT_PATTERN.exec(source);
	}
	
	return commentRanges;
};

/**
 * Find all uncommented function definitions in the specified source and return
 * an array of FunctionInfos, one for each function found.
 * 
 * @alias Jaxer.TextParser.getFunctionInfos
 * @private
 * @param {String} source
 * 		The Javascript source code to parse
 * @return {Jaxer.FunctionInfo[]}
 * 		A list of function info instances, one for each Javascript function
 * 		found in the source code
 */
TextParser.getFunctionInfos = function(source)
{
	var result;
	
	if (SIMPLE_PARSE)
	{
		result = simpleParse(source);
	}
	else
	{
		result = fullParse(source);
	}
	
	return result;
};

/**
 * NOT CURRENTLY USED
 * Use a parser to create an AST of the specified source.
 * 
 * @private
 * @alias Jaxer.TextParser.fullParse
 * @param {String} source
 * 		The Javascript source code to parse
 * @return {Node}
 * 		The resulting parser AST of the source code
 */
function fullParse(source)
{
	var ast;
	var result = [];
		
	try
	{
		ast = parse(source);
	}
	catch (e)
	{
		// create empty AST so we can continue processing
		ast = parse("");
	}
	
	// temp
	TextParser.ast = ast;
	
	var functionNodes = ast.funDecls;
	
	for (var i = 0; i < functionNodes.length; i++)
	{
		var functionNode = functionNodes[i];
		var name = functionNode.name;
		
		if (Jaxer.pageWindow.hasOwnProperty(name))
		{
			if (typeof Jaxer.pageWindow[name] == "function")
			{
				var func = Jaxer.pageWindow[name];
				
				result.push(new FunctionInfo(func, functionNode));
			}
			else
			{
				log.debug("Global property is no longer a function: " + name);
			}
		}
		else
		{
			log.debug("Function no longer exists: " + name)
		}
	}
	
	return result;
}

/**
 * Create a list of function info instances, one for each function in the source
 * code. Note that special checks are done so as not to include functions
 * contained within multi-line comments. This function is used in place of
 * fullParse when a parser is not available.
 * 
 * @private
 * @alias Jaxer.TextParser.simpleParse
 * @param {String} source
 * 		The Javascript source code to parse
 * @return {Jaxer.FunctionInfo[]}
 * 		A list of function info instances, one for each Javascript function
 * 		found in the source code
 */
function simpleParse(source)
{
	// find comment ranges
	var commentRanges = TextParser.getCommentRanges(source);
	
	// find named functions not within comments
	var result = [];
	var functionMatcher = NAMED_FUNCTION_PATTERN.exec(source);
	var rangeIndex = 0;
	
	while (functionMatcher != null)
	{
		var range = new Range(functionMatcher.index, NAMED_FUNCTION_PATTERN.lastIndex);
		var insideComment = false;
		
		// NOTE: We advance until we find we're in a comment or until we've passed the end
		// of the current function. This prevents us from looping through all comments for
		// each function we find. This should result in better scaling with large files and
		// files containing a lot of comments.
		for (; rangeIndex < commentRanges.length; rangeIndex++)
		{
			var commentRange = commentRanges[rangeIndex];
			
			if (range.isOverlapping(commentRange))
			{
				insideComment = true;
				break;
			}
			else if (commentRange.start >= range.end)
			{
				break;
			}
		}
		
		if (insideComment == false)
		{
			var name = functionMatcher[1];
			var paramText = functionMatcher[2];
			var params;
			
			// process parameters
			if (paramText && WHITESPACE_PATTERN.test(paramText) == false)
			{
				params = functionMatcher[2].split(/\s*,\s*/);
			}
			else
			{
				params = [];
			}
			
			// process function body
			var startingIndex = functionMatcher.index;
			var index = startingIndex;
			var braceCount = 0;
			
			// advance to '{'
			while (index < source.length)
			{
				if (source[index] == '{')
				{
					break;
				}
				else
				{
					index++;
				}
			}
			
			// find end of function
			while (index < source.length)
			{
				var c = source[index];
				
				if (source[index] == '{')
				{
					braceCount++;
				}
				else if (source[index] == '}')
				{
					braceCount--;
					
					if (braceCount == 0)
					{
						// include close brace
						index++;
						
						// and exit loop
						break;
					}
				}
				
				index++;
			}
			
			// save function info if the function exists in global
			if (Jaxer.pageWindow.hasOwnProperty(name))
			{
				if (typeof Jaxer.pageWindow[name] == "function")
				{
					var functionSource = Jaxer.pageWindow[name].toString();
					var info = new FunctionInfo(name, params, functionSource);
					
					info.startingIndex = startingIndex;
					info.endingIndex = index;
					
					result.push(info);
				}
			}
			
			// advance over function body
			NAMED_FUNCTION_PATTERN.lastIndex = index;
		}
		
		functionMatcher = NAMED_FUNCTION_PATTERN.exec(source);
	}
	
	return result;
}

frameworkGlobal.TextParser = Jaxer.TextParser = TextParser;

Log.trace("*** TextParser.js loaded");

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Parsing > RunatConstants.js
 */
coreTraceMethods.TRACE('Loading fragment: RunatConstants.js');
Jaxer.lastLoadedFragment = 'RunatConstants.js';

(function(){
	
var RUNAT_SEPARATOR = "-";
var RUNAT_SERVER_BASE = "server";
var RUNAT_BOTH_BASE = "both";

var consts =
{
	RUNAT_ATTR: "runat",
	SRC_ATTR: "src",
	PROXY_ATTR: "proxy",
	TYPE_ATTR: "type",
	AUTOLOAD_ATTR: "autoload",
	
	RUNAT_CLIENT: "client",
	RUNAT_SEPARATOR: RUNAT_SEPARATOR,
	RUNAT_SERVER_BASE: RUNAT_SERVER_BASE,
	RUNAT_SERVER_NO_CACHE: RUNAT_SERVER_BASE + RUNAT_SEPARATOR + "nocache",
	RUNAT_SERVER_AND_CACHE: RUNAT_SERVER_BASE,
	RUNAT_SERVER_AND_PROXY: RUNAT_SERVER_BASE + RUNAT_SEPARATOR + "proxy",
	RUNAT_BOTH_BASE: RUNAT_BOTH_BASE,
	RUNAT_BOTH_NO_CACHE: RUNAT_BOTH_BASE + RUNAT_SEPARATOR + "nocache",
	RUNAT_BOTH_AND_CACHE: RUNAT_BOTH_BASE,
	RUNAT_BOTH_AND_PROXY: RUNAT_BOTH_BASE + RUNAT_SEPARATOR + "proxy",
	
	RUNAT_ANY_SERVER_REGEXP: /^\s*(both|server)/i,
	RUNAT_ANY_BOTH_REGEXP: /^\s*both/i,
	RUNAT_NO_CACHE_REGEXP: /^\s*nocache/i,
	AUTOLOAD_ATTR_FALSE_REGEXP: /^false$/i,
	
	// NOTE: This flag is temporary and should no longer be needed
	// once we access a fast JS parser
	SIMPLE_PARSE: true
};

for (var p in consts)
{
	frameworkGlobal[p] = Jaxer[p] = consts[p];
}

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Parsing > ScriptInfo.js
 */
coreTraceMethods.TRACE('Loading fragment: ScriptInfo.js');
Jaxer.lastLoadedFragment = 'ScriptInfo.js';

(function(){

var log = Log.forModule("ScriptInfo"); // Only if Log itself is defined at this point of the includes

/**
 * @classDescription {Jaxer.ScriptInfo} Container object used during runat
 * attribute and property processing.
 */

/**
 * This is a container object used during runat attribute and property
 * processing. This allows all runat-related state to be passed around in one
 * simple container object. At the same time, this formalizes what is being
 * passed around which is preferable to using a simple anonymous object.
 * 
 * @advanced
 * @constructor
 * @alias Jaxer.ScriptInfo
 * @return {Jaxer.ScriptInfo}
 * 		Returns an instance of ScriptInfo.
 */
function ScriptInfo()
{
	this.functionNames = {};
	this.cacheInfos = [];
	this.proxyInfos = [];
	this.hasProxies = false;
	if (Jaxer.proxies)
	{
		var proxies = {};
		Jaxer.proxies.forEach(function(proxy)
		{
			if (typeof proxy == "function" && proxy.name)
			{
				proxies[proxy.name] = true;
			}
			else if (typeof proxy == "string")
			{
				proxies[proxy] = true;
			}
			else
			{
				log.warn("The following Jaxer.proxies element was neither a named function nor a string: " + proxy);
			}
		});
		this.jaxerProxies = proxies;
	}
	else
	{
		this.jaxerProxies = null;
	}
}

frameworkGlobal.ScriptInfo = Jaxer.ScriptInfo = ScriptInfo;

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Parsing > ScriptProcessor.js
 */
coreTraceMethods.TRACE('Loading fragment: ScriptProcessor.js');
Jaxer.lastLoadedFragment = 'ScriptProcessor.js';

(function(){

var log = Log.forModule("ScriptProcessor"); // Only if Log itself is defined at this point of the includes

/**
 * @classDescription {Jaxer.ScriptProcessor} This class processes script
 * elements to determine which of its functions fall into the various runat
 * categories.
 */

/**
 * This class processes script elements to determine which of its functions fall
 * into the various runat categories. This class collects each function into
 * its appropriate category and provides convenience functions to generate
 * the necessary source code for this block needed for both client-side and
 * server-side use.
 * 
 * @advanced
 * @constructor
 * @alias Jaxer.ScriptProcessor
 * @param {ScriptElement} element
 * 		The underlying script element to be processed by this class
 * @param {Object} jaxerProxies
 * 		If a non-null object, its properties are the function names that should
 * 		be proxied even if not explicitly marked as such. If null, no functions
 * 		should be proxied.
 * @return {Jaxer.ScriptProcessor}
 * 		Returns an instance of ScriptProcessor.
 */
function ScriptProcessor(element, jaxerProxies)
{
	this.element = element;
	this.jaxerProxies = jaxerProxies;
	
	this.clientInfos = [];
	this.proxyInfos = [];
	this.bothProxyInfos = [];
	this.cacheInfos = [];
	
	this.ast = null;
	this.source = "";
	this.srcAttr = null;
	this.localFunctionNames = {};
	this.functionInfos = [];
	this.runatAttr = null;
	this.isBothVariant = false;
	this.hasProxies = false;
}

/**
 * Generates the source code for all functions that will live as callbacks on
 * the server and as client-side code. This effectively generates the original
 * function source for the client as well as a namespaced version of the
 * function which can be used to call the server-side function from the client.
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.getBothClientSource
 * @return {String}
 * 		The source code of all functions in this underlying script element
 */
ScriptProcessor.prototype.getBothClientSource = function getBothClientSource()
{
	var source;
	
	if (SIMPLE_PARSE)
	{
		source = this.removeRunatAssignmentsSimple();
		
		for (var i = 0; i < this.functionInfos.length; i++)
		{
			var functionInfo = this.functionInfos[i];
			
			if (functionInfo.removeFromClient)
			{
				// grab the source before and after the assignment
				var start = functionInfo.startingIndex;
				var end = functionInfo.endingIndex;
				var before = source.substring(0, start);
				var after = source.substring(end, source.length);
				
				// create a string of spaces to match the size of the assignment
				var padding = (new Array(end - start + 1)).join(" ");
				
				// recreate the source with the padding applied over the assignment
				source = [before, padding, after].join("");
			}
		}
	}
	else
	{
		source = this.removeRunatAssignments();
	}
	
	if (this.proxyInfos.length > 0 || this.bothProxyInfos.length > 0)
	{
		this.hasProxies = true;
		
		var sources = [source];
		
		if (this.proxyInfos.length > 0) 
		{
			var names = this.proxyInfos.map(function(info) { return info.name; });
			sources.push("eval(Jaxer.Callback.createProxies(['" + names.join("', '") + "']));");
		}
		
		if (this.bothProxyInfos.length > 0)
		{
			var namespacedNames = this.bothProxyInfos.map(function(info) { return info.name; });
			sources.push("eval(Jaxer.Callback.createProxies(['" + namespacedNames.join("', '") + "'], 'Jaxer.Server'));");
		}
		
		source = sources.join("\n");
	}
	
	// collapse to empty string if we only have whitespace
	if (source.match(/^\s+$/))
	{
		source = "";
	}
	
	return source;
};

/**
 * Generates the source code for all functions that will execute on the client
 * only. This comes into play, for example, when a server script element has
 * tagged one of its containing functions for client-side execution. Other cases
 * include dynamic generation of functions that did not actually exist in the
 * script element's source text.
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.getClientSource
 * @return {String}
 * 		The source code of all functions in this underlying script element
 */
ScriptProcessor.prototype.getClientSource = function getClientSource()
{
	var sources = [];
			
	// emit client functions
	this.clientInfos.forEach(function(clientInfo)
	{
		sources.push(clientInfo.createClientSource());
	});
	
	// emit proxies
	if (this.proxyInfos.length > 0)
	{
		this.hasProxies = true;
			
		var names = this.proxyInfos.map(function(info) { return info.name; });
		sources.push("eval(Jaxer.Callback.createProxies(['" + names.join("', '") + "']));");
	}
	
	// emit namespaced proxies
	if (this.bothProxyInfos.length > 0)
	{
		this.hasProxies = true;
		
		var namespacedNames = this.bothProxyInfos.map(function(info) { return info.name; });
		sources.push("eval(Jaxer.Callback.createProxies(['" + namespacedNames.join("', '") + "'], 'Jaxer.Server'));");
	}
	
	return sources.join("\n");
};

/**
 * Determine the value of the underlying script elements runat attribute. If the
 * attribute does not exist, then this method will return the default value of
 * "client"
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.getRunatAttribute
 * @return {String}
 * 		The runat attribute value 
 */
ScriptProcessor.prototype.getRunatAttribute = function getRunatAttribute()
{
	var result = RUNAT_CLIENT;
	
	if (this.element.hasAttribute(RUNAT_ATTR))
	{
		// get attribute value
		result = this.element.getAttribute(RUNAT_ATTR);
	}
	
	return result;
};

/**
 * Removes any runat attribute, and also the type attribute if present
 * and if the runat attribute is server-only
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.removeRunatAttribute
 */
ScriptProcessor.prototype.removeRunatAttribute = function removeRunatAttribute()
{
	if (this.element.hasAttribute(RUNAT_ATTR))
	{
		var runatAttr = this.element.getAttribute(RUNAT_ATTR);
		// remove attribute
		this.element.removeAttribute(RUNAT_ATTR);
		// then see if we need to do more cleanups
		var isBothVariant = runatAttr.match(RUNAT_ANY_BOTH_REGEXP);
		// -If it's not designated by the developer as "both" then any
		// client-bound code injected by Jaxer should not have a type
		// attribute, in case the developer's type attribute was inappropriate
		// for all clients. 
		// - If the developer did designate as "both" and had a type
		// attribute they must have meant that type value to go to the client.
		if (!isBothVariant && runatAttr != RUNAT_CLIENT)
		{
			this.element.removeAttribute(TYPE_ATTR);
		}
		Jaxer.response.noteDomTouched();
	}
};

/**
 * Process the content of all functions inside this instance's underlying script
 * element. The script element's runat attribute is applied to all function
 * instances that exist in global. FunctionInfo's are created for all of those
 * functions. Any changes to the role of a function in this script element are
 * updated. For example, if a script element is tagged to run on the server, but
 * upon execution, if one of the functions in that element is tagged to run
 * client-side, then the content of the script element served to the client will
 * contain only that one client-side function. If that function has not been
 * tagged for client-side execution, the entire script element would have been
 * removed since the functions were intended to run on the server only.
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.process
 */
ScriptProcessor.prototype.process = function process()
{

	this.srcAttr = this.element.getAttribute(SRC_ATTR);
	this.runatAttr = this.getRunatAttribute();
	this.removeRunatAttribute();

	if (this.runatAttr != RUNAT_CLIENT)
	{

		this.source = (this.srcAttr == null) ? this.element.innerHTML : '';
		var shortContents = (this.source == null) ? "no contents" : "contents='" + this.source.substr(0, 100) + (this.source.length > 100 ? "..." : "") + "'";
		log.debug("Post-processing script block" + 
			" with " + ((this.srcAttr == null) ? "no src" : "src='" + this.srcAttr + "'") +
			" and " + ((this.runatAttr == null) ? "no runat" : "runat='" + this.runatAttr + "'") +
			" and " + shortContents);
					
		// get function infos
		this.functionInfos = TextParser.getFunctionInfos(this.source);
		log.debug("Found " + this.functionInfos.length + " functions to process");
		
		if (SIMPLE_PARSE == false)
		{
			// needed for removal of runat properties
			this.ast = TextParser.ast;
		}
		
		for (var i = 0; i < this.functionInfos.length; i++)
		{
			var functionInfo = this.functionInfos[i];
			var name = functionInfo.name;
			
			// keep track of what we've visited in this script element
			this.localFunctionNames[name] = true;
			
			// get a reference to the function
			var func = Jaxer.pageWindow[name];
			
			// determine the runat and proxy values
			var runatProp = (func.hasOwnProperty(RUNAT_ATTR)) ? func[RUNAT_ATTR] : this.runatAttr;
			var proxyProp = CallbackManager.calculateProxyAttribute(func, this.jaxerProxies, runatProp);
			var effectiveRunat = CallbackManager.calculateEffectiveRunat(runatProp, proxyProp);
			log.trace("Processing function '" + name + "' with runat=" + runatProp + ", proxy=" + proxyProp + ", effectiveRunat=" + effectiveRunat);
		
			// process
			this.processFunctionInfo(functionInfo, effectiveRunat);
		}
		
		// build source for client-bound script element
		this.isBothVariant = this.runatAttr.match(RUNAT_ANY_BOTH_REGEXP);
		if (this.isBothVariant)
		{
			this.source = this.getBothClientSource();
		}
		else
		{
			this.source = this.getClientSource();
		}

	}
};

/**
 * This method applies any needed changes to the DOM and to global functions
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.apply
 */
ScriptProcessor.prototype.apply = function apply()
{

	if (this.element && (this.runatAttr != RUNAT_CLIENT)) 
	{
		if (this.source) 
		{
			this.element.innerHTML = "\n" + this.source + "\n\t\t";
			Jaxer.response.noteDomTouched();
			log.debug("This script block will be sent to the browser");
		}
		else if (this.srcAttr &&
			this.runatAttr.match(RUNAT_ANY_BOTH_REGEXP)) // create the client-only element in place
		{
			this.element.removeAttribute(RUNAT_ATTR);
			this.element.removeAttribute(AUTOLOAD_ATTR);
			Jaxer.response.noteDomTouched();
		}
		else 
		{
			this.element.parentNode.removeChild(this.element);
			this.element = null;
			Jaxer.response.noteDomTouched();
			log.debug("Removed script block from DOM");
		}
	}
	
	for (var i=0; i<this.functionInfos.length; i++)
	{
		var functionInfo = this.functionInfos[i];
		// remove function from window
		if (functionInfo.removeFromServer)
		{
			var name = functionInfo.name;
			Jaxer.pageWindow[name] = undefined;
		}
	}
	
};

/**
 * NOT CURRENTLY USED
 * This is a convenience function which creates a FunctionInfo from a parser
 * AST node and then calls the processFunctionInfo method.
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.processFunctionNode
 * @param {Node} functionNode
 * 		A top-level parser AST node representing the parse tree of the
 * 		specified function
 * @param {Function} functionReference
 * 		A reference to the actual Javascript function instance
 * @param {String} runatProperty
 * 		The runat property value active for this function
 */
ScriptProcessor.prototype.processFunctionNode = function processFunctionNode(functionNode, functionReference, runatProperty)
{
	var functionInfo = new FunctionInfo(functionReference, functionNode);
	
	this.processFunctionInfo(functionInfo, runatProperty);
};

/**
 * This method is responsible for classifying each function based on the
 * specified runat and proxy property values. The classifications are later used for
 * emission of client-side functions, proxies, and callback storage.
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.processFunctionInfo
 * @param {Jaxer.FunctionInfo} functionInfo
 * 		A function info instance representing a Javascript function
 * @param {String} runatProperty
 * 		The runat property value active for this function
 */
ScriptProcessor.prototype.processFunctionInfo = function processFunctionInfo(functionInfo, runatProperty)
{
	switch (runatProperty)
	{
		case RUNAT_CLIENT:
			functionInfo.removeFromServer = true;
			functionInfo.removeFromClient = false;
			this.clientInfos.push(functionInfo);
			break;
			
		case RUNAT_BOTH_NO_CACHE:
			functionInfo.removeFromServer = false;
			functionInfo.removeFromClient = false;
			this.clientInfos.push(functionInfo);
			break;
			
		case RUNAT_BOTH_AND_CACHE:
			functionInfo.removeFromServer = false;
			functionInfo.removeFromClient = false;
			this.clientInfos.push(functionInfo);
			this.cacheInfos.push(functionInfo);
			break;
			
		case RUNAT_BOTH_AND_PROXY:
			functionInfo.removeFromServer = false;
			functionInfo.removeFromClient = false;
			this.cacheInfos.push(functionInfo);
			this.clientInfos.push(functionInfo);
			this.bothProxyInfos.push(functionInfo);
			break;
			
		case RUNAT_SERVER_NO_CACHE:
			functionInfo.removeFromServer = false;
			functionInfo.removeFromClient = true;
			break;
			
		case RUNAT_SERVER_AND_CACHE:
			functionInfo.removeFromServer = false;
			functionInfo.removeFromClient = true;
			this.cacheInfos.push(functionInfo);
			break;
			
		case RUNAT_SERVER_AND_PROXY:
			functionInfo.removeFromServer = false;
			functionInfo.removeFromClient = true;
			this.cacheInfos.push(functionInfo);
			this.proxyInfos.push(functionInfo);
			break;
		
		default:
			log.warn("Unrecognized " + RUNAT_ATTR + " property value: " + runatProperty);
			break;
	}
};

/**
 * This method removes all runat property assignments in the underlying script
 * element's source. This prevents the runat property from being exposed on the
 * client. This method relies on an underlying parser AST node to function
 * properly.
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.removeRunatAssignments
 * @return {String}
 * 		The original source code with all runat assignments whited out
 */
ScriptProcessor.prototype.removeRunatAssignments = function removeRunatAssignments()
{
	var source = this.source;
	var localFunctionNames = this.localFunctionNames;
	
	// get all runat properties
	var assignments = this.ast.select(
		"/semicolon/assign[1]",
		function(node)
		{
			var lhs = node[0];
			var result = false;
			
			if (lhs.type == DOT)
			{
				var rhs = lhs[1];
				var lhs = lhs[0];
				
				result = (lhs.type == IDENTIFIER && rhs.value == RUNAT_ATTR && localFunctionNames.hasOwnProperty(lhs.value));
			}
			
			return result;
		}
	);
	
	// blot out each statement
	for (var i = 0; i < assignments.length; i++)
	{
		var node = assignments[i];
		var start = node.start;
		var end = node.end;
		
		// Following semicolons are not included in the node range. Advance
		// until we hit a semicolon, or something other than a tab or space
		while (end < source.length)
		{
			var c = source[end];
			
			if (c == ' ' || c == '\t')
			{
				end++;
			}
			else
			{
				if (c == ';')
				{
					end++;
				}
				
				break;
			}
		}
		
		// grab the source before and after the assignment
		var before = source.substring(0, start);
		var after = source.substring(end, source.length);
		
		// create a string of spaces to match the size of the assignment
		var padding = (new Array(end - start + 1)).join(" ");
		
		// recreate the source with the padding applied over the assignment
		source = [before, padding, after].join("");
	}
	
	return source;
};

/**
 * This method removes all runat property assignments in the underlying script
 * element's source. This prevents the runat property from being exposed on the
 * client. This method is used to remove these assignments when we do not have
 * a parser AST node for this script element's source.
 * 
 * @private
 * @alias Jaxer.ScriptProcessor.prototype.removeRunatAssignmentsSimple
 * @return {String}
 * 		The original source code with all runat assignements whited out
 */
ScriptProcessor.prototype.removeRunatAssignmentsSimple = function removeRunatAssignmentsSimple()
{
	// start with the original source
	var source = this.source;
	var localFunctionNames = this.localFunctionNames;
	if (localFunctionNames.length == 0)
	{
		return source; // There's nothing to remove
	}
	
	// build list of names
	var names = [];
	
	for (var name in localFunctionNames)
	{
		names.push(name);
	}
	
	names.sort().reverse();
	
	// build runat property regex (note names cannot be empty by this point)
	var singleQuotedString = "'(\\\\.|[^\'\\\\\\n\\r])*?\'";
	var doubleQuotedString = "\"(\\\\.|[^\"\\\\\\n\\r])*?\"";
	var runatPart = RUNAT_ATTR + "\\s*=\\s*" + "(" + singleQuotedString + "|" + doubleQuotedString + ")";
	var proxyPart = PROXY_ATTR + "\\s*=[^\r\n;]+";
	var runatPattern = new RegExp("(" + names.join("|") + ")\\.(" + runatPart + "|" + proxyPart + ")(\\s*;)?", "g");
	// replace
	var match = runatPattern.exec(source);
	
	while (match !== null)
	{
		var start = match.index;
		var end = runatPattern.lastIndex;
		
		// grab the source before and after the assignment
		var before = source.substring(0, start);
		var after = source.substring(end, source.length);
		
		// create a string of spaces to match the size of the assignment
		var padding = (new Array(end - start + 1)).join(" ");
		
		// recreate the source with the padding applied over the assignment
		source = [before, padding, after].join("");
		
		match = runatPattern.exec(source);
	}
	
	return source;
};

frameworkGlobal.ScriptProcessor = Jaxer.ScriptProcessor = ScriptProcessor;

})();

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework/Parsing > CallbackManager.js
 */
coreTraceMethods.TRACE('Loading fragment: CallbackManager.js');
Jaxer.lastLoadedFragment = 'CallbackManager.js';

(function(){

var log = Log.forModule("CallbackManager");

// private variables
var document;
var runatFunctions = {};
var autoloads = [];

/**
 * @namespace {Jaxer.CallbackManager}
 * A namespace object holding functions and members for preparing the callback
 * data at the end of page processing that will allow the page to call back its
 * server-side functions.
 * @advanced
 */
var CallbackManager = {};

/**
 * Process all functions for possible caching, proxying, and callback
 * invocation.
 * 
 * @advanced
 * @alias Jaxer.CallbackManager.processCallbacks
 * @param {Document} doc
 * 		The current document's DocumentElement. This is used to create elements
 * 		in the active DOM as needed.
 */
CallbackManager.processCallbacks = function processCallbacks(doc)
{
	// save reference to complete document
	document = doc;
	
	var scriptsInfo = new ScriptInfo();
	
	// process all script elements in the document
	processScriptElements(scriptsInfo);
	
	// processs all globally defined functions
	processGlobalFunctions(scriptsInfo);
	
	// cache server-side functions for future callbacks
	cacheServerFunctions(scriptsInfo);

	return scriptsInfo;
};

/**
 * Once all functions have been processed, we need to make sure all cached and
 * proxied functions are added to the database so we can reconstitute those
 * functions during callbacks.
 * 
 * @private
 * @alias Jaxer.CallbackManager.cacheServerFunctions
 * @param {Jaxer.ScriptInfo} scriptsInfo
 * 		The active scriptInfo being used to manage state in this callback
 * 		manager session
 */
function cacheServerFunctions(scriptsInfo)
{
	log.trace("Going to cache " + scriptsInfo.cacheInfos.length + " functions...");
	if (scriptsInfo.cacheInfos.length > 0)
	{
		
		Jaxer.response.noteSideEffect();
		
		// build source
		var sources = [];
		
		// get page key
		var pageName = Jaxer.request.pageKey;
		var namespace = null;

		// Build a hashmap to quickly identify which cached functions should be client-callable
		var callables = {};
		scriptsInfo.proxyInfos.forEach(function(info)
		{
			callables[info.name] = true;
		});
		
		// accumulate functions to cache on the server
		scriptsInfo.cacheInfos.forEach(function(info)
		{
			var isCallable = callables.hasOwnProperty(info.name);
			if (info.isNative())
			{
				if (isCallable)
				{
					throw new Exception("Cannot cache and proxy a native function: " + uneval(info));
				}
				else
				{
					log.warn("Cannot cache a native function -- skipping: " + uneval(info));
				}
			}
			else
			{
				sources.push(info.createServerFunction(namespace, isCallable));
			}
		});
		
		// append oncallback function, if it exists
		var oncallback = Jaxer.pageWindow.oncallback;
		if (typeof oncallback == "function")
		{
			var onCallbackInfo;
			var onCallbackName = "oncallback";
			if (SIMPLE_PARSE)
			{
				var onCallbackSource = oncallback.toString();
				if (onCallbackSource.indexOf("function (") == 0) 
				{
					onCallbackSource = onCallbackSource.replace(/^function \(/, "function " + onCallbackName + "(");
				}
				else
				{
					onCallbackSource = onCallbackSource.replace(/^function \w+\(/, "function " + onCallbackName + "(");
				}
				onCallbackInfo = new FunctionInfo(onCallbackName, [], onCallbackSource);
			}
			else
			{
				onCallbackInfo = new FunctionInfo(oncallback)
			}
			if (onCallbackInfo.isNative()) 
			{
				log.warn("Cannot cache oncallback because it is a native function: " + uneval(onCallbackInfo));
			}
			else 
			{
				sources.push(onCallbackInfo.createServerFunction(namespace, false, true));
			}
		}
		
		// append all autoloads for this page
		var strAutoloads = Serialization.toJSONString(autoloads, { as: Serialization.JAXER_METHOD });
		log.trace("Saving autoloads for this page: " + strAutoloads);
		sources.unshift("Jaxer._autoload(" + strAutoloads + ");");
		sources.unshift("/* callback.js */");
		
		var source = sources.join("\n");
				
		// calculate crc32
		var crc32 = Util.CRC32.getStringCRC(source);
		
		// determine if we have a page like this already in the db
		var rs = DB.frameworkExecute(
			"SELECT COUNT(*) FROM callback_page WHERE name = ? AND crc32 = ?",
			[pageName, crc32]
		);
		var countExisting = rs.singleResult;
		
		// if we don't, then add it to the db
		if (countExisting == 0)
		{
			log.debug("Storing this page's callbacks in the DB with name='" + pageName + "' and crc32=" + crc32);
			
			// build field list
			var fields = [
				'crc32',
				'name',
				'value',
				'document_root',
				'page_file',
				'creation_datetime',
				'access_datetime',
				'access_count'
			];
			
			// build value list
			var values = [
				crc32,
				pageName,
				source,
				Jaxer.request.documentRoot,
				Jaxer.request.pageFile,
				new Date(),
				null,
				0
			];

			var placeholders = values.map(function(field) { return "?"; });
			
			// build query
			query = "INSERT INTO callback_page(" + fields.join(",") + ") VALUES(" + placeholders + ")";
			
			// commit source to db
			DB.frameworkExecute(query, values);
		}
		
		// determine whether we've cached this page already, else cache it
		if (!CallbackManager.isCallbackPageCached(pageName, crc32))
		{
			CallbackManager.cacheCallbackPage(pageName, crc32, source);
		}
		
		if (scriptsInfo.hasProxies)
		{
			Jaxer.response.noteDomTouched();
			// Pass callback-related parameters to the client
			var head = document.getElementsByTagName("head")[0];
			Util.DOM.insertScriptAtBeginning(
				[
					"Jaxer.Callback." + Callback.PAGE_SIGNATURE + " = " + crc32,
					"Jaxer.Callback." + Callback.PAGE_NAME + " = '" + pageName + "'",
					"Jaxer.Callback." + Callback.CALLING_PAGE + " = '" + Util.String.escapeForJS(Jaxer.request.parsedUrl.url) + "'",
				 	"Jaxer.CALLBACK_URI = '" + Jaxer.Config.CALLBACK_URI + "'",
					"Jaxer.ALERT_CALLBACK_ERRORS = " + Boolean(Jaxer.Config.ALERT_CALLBACK_ERRORS)
				].join("; ") + ";",
				head,
				null
			);
		}
	}
}

/**
 * Generate the unique key by which callbacks are stored/cached
 * 
 * @advanced
 * @alias Jaxer.CallbackManager.getCallbackKey
 * @param {String} pageName
 * 		The name identifying the page that was served
 * @param {String} crc32
 * 		The crc32 signature of the callback contents,
 * 		used to see whether the code was changed
 * @return {String}
 * 		The key uniquely identifying the callback page
 */
CallbackManager.getCallbackKey = function getCallbackKey(pageName, crc32)
{
	return crc32 + "::" + pageName;
}

/**
 * Cache the callback page in memory for faster execution on callback
 * 
 * @private
 * @alias Jaxer.CallbackManager.cacheCallbackPage
 * @param {String} pageName
 * 		The name identifying the page that was served
 * @param {String} crc32
 * 		The crc32 signature of the callback contents,
 * 		used to see whether the code was changed
 * @param {String} source
 * 		The JavaScript source code (function definitions) to execute
 */
CallbackManager.cacheCallbackPage = function cacheCallbackPage(pageName, crc32, source)
{
	var key = CallbackManager.getCallbackKey(pageName, crc32);
	log.debug("Caching this page under key = " + key);
	CacheManager.callbackPages[key] = Config.CACHE_USING_SOURCE_CODE ? source : Includer.compile(source);
}

/**
 * Retrieve the callback page cached in memory
 * 
 * @private
 * @alias Jaxer.CallbackManager.getCachedCallbackPage
 * @param {String} pageName
 * 		The name identifying the page that was served
 * @param {String} crc32
 * 		The crc32 signature of the callback contents,
 * 		used to see whether the code was changed
 * @return {String} source
 * 		The (compiled) cached callback page
 */
CallbackManager.getCachedCallbackPage = function getCachedCallbackPage(pageName, crc32)
{
	var key = CallbackManager.getCallbackKey(pageName, crc32);
	log.debug("Retrieving cached page using key = " + key);
	return CacheManager.callbackPages[key];
}

/**
 * Has the callback page been cached in memory?
 * 
 * @private
 * @alias Jaxer.CallbackManager.isCallbackPageCached
 * @param {String} pageName
 * 		The name identifying the page that was served
 * @param {String} crc32
 * 		The crc32 signature of the callback contents,
 * 		used to see whether the code was changed
 * @return {Boolean}
 * 		true if cached (in memory on this instance of Jaxer), false otherwise
 */
CallbackManager.isCallbackPageCached = function isCallbackPageCached(pageName, crc32)
{
	var key = CallbackManager.getCallbackKey(pageName, crc32);
	return CacheManager.callbackPages.hasOwnProperty(key);
}

/**
 * Initialize any functionality that will later be needed to setup callbacks
 * for this page. This should be called before any developer code could run.
 * Right now it just sets up a registry of any functions that have their runat
 * property set, so we can track them and make sure we process them at the end 
 * of the page, rather than searching the global context to find them.
 * 
 * @private
 * @alias Jaxer.CallbackManager.initPage
 * @param {Object} global
 * 		The global (window) context on which to instrument the Function prototype
 * 		such that setting a runat property registers the function.
 */
CallbackManager.initPage = function initPage(global)
{
	
	/**
	 * Adding functions (or their names) to this array is equivalent to
	 * setting their proxy property to true. To enforce no proxies,
	 * overriding any proxy property or runat="server-proxy", set
	 * Jaxer.proxies = null.
	 * 
	 * @alias Jaxer.proxies
	 * @property {Function[]}
	 */
	Jaxer.proxies = [];
	
	runatFunctions = {};
	Util.setSafeSetter(global.Function.prototype, RUNAT_ATTR, function setRunat(func, value)
	{
		func[RUNAT_ATTR] = value; 
		var name = func.name;
		if (name && 
			(name != 'anonymous') && 
			(!runatFunctions.hasOwnProperty(name))) // We will only process non-anonymous global functions
		{
			runatFunctions[name] = func;
		}
	});
	
	autoloads = [];
}

/**
 * Add a script location ot the autoloads of the current page
 * 
 * @private
 * @alias Jaxer.CallbackManager.processGlobalFunctions
 * @param {String} src
 * 		The fully-resolved src (location) of the autoloaded script
 */
CallbackManager.addAutoload = function addAutoload(src)
{
	autoloads.push(src);
}

/**
 * Visit all functions hanging off of global and process each one that has a
 * runat property defined. This approach allows server-executed code to modify
 * the role a function plays regardless of its containing script elements runat
 * attribute value. This also allows functions to be generated on the fly and
 * for functions to change roles based on queries performed in the server-side
 * code.
 * 
 * @private
 * @alias Jaxer.CallbackManager.processGlobalFunctions
 * @param {Jaxer.ScriptInfo} scriptsInfo
 * 		The active scriptInfo being used to manage state in this callback
 * 		manager session
 */
function processGlobalFunctions(scriptsInfo)
{
	var processor = new ScriptProcessor(null, scriptsInfo.jaxerProxies);
	var handledInScripts = scriptsInfo.functionNames;
	
	// only process functions not handled in script elements
	function shouldHandle(name, value)
	{
		return !handledInScripts.hasOwnProperty(name) &&
			typeof value == "function" && 
			value.hasOwnProperty(RUNAT_ATTR);
	}
	
	for (var name in runatFunctions)
	{
		var candidate = runatFunctions[name];
		log.trace("For runatFunctions member " + name + ": handledInScripts.hasOwnProperty=" + handledInScripts.hasOwnProperty(name) + "; typeof candidate: " + typeof candidate);
		if (handledInScripts.hasOwnProperty(name) || 
			!candidate || 
			(typeof candidate != "function"))
		{
			continue;
		}
		var source = candidate.toString(); // get function source
		var info = null;
		
		if (SIMPLE_PARSE) 
		{
			log.trace("source before: " + source);
			if (source.indexOf("function (") == 0) 
			{
				source = source.replace(/^function \(/, "function " + name + "(");
			}
			else
			{
				source = source.replace(/^function \w+\(/, "function " + name + "(");
			}
			log.trace("source after: " + source);
			
			info = new FunctionInfo(name, [], source);
		}
		else 
		{
			// parse source into a function info
			var infos = TextParser.getFunctionInfos(source);
			
			if (infos.length > 0) 
			{
				info = infos[0];
			}
		}
		
		if (info) 
		{
			// get runat and proxy attributes
			var runatProp = candidate[RUNAT_ATTR];
			var proxyProp = CallbackManager.calculateProxyAttribute(candidate, scriptsInfo.jaxerProxies, runatProp);
			var effectiveRunat = CallbackManager.calculateEffectiveRunat(runatProp, proxyProp);
			log.debug("Processing global function '" + name + "' with runat=" + runatProp + ", proxy=" + proxyProp + ", effectiveRunat=" + effectiveRunat);
			
			// process content
			processor.processFunctionInfo(info, effectiveRunat);
		}
		else 
		{
			log.error("Error parsing '" + name + "': " + source);
		}
	}
	
	// NOTE: This has to be called before you can rely on hasProxies
	var source = processor.getClientSource();
	
	if (source != "")
	{
		// add client script element
		Util.DOM.insertScriptAtEnd(
			"\n" + source + "\n\t\t",
			document.getElementsByTagName("head")[0],
			null,
			true
		);
	}
	
	// see if we had proxies
	if (processor.hasProxies)
	{
		scriptsInfo.hasProxies = true;
	}
	
	// accumulate cache and proxy infos
	scriptsInfo.cacheInfos = scriptsInfo.cacheInfos.concat(processor.cacheInfos);
	scriptsInfo.proxyInfos = scriptsInfo.proxyInfos.concat(processor.proxyInfos, processor.bothProxyInfos);
}

/**
 * Process each script element in this page. Each function in each script
 * element is visited. All processing is delegated to the
 * ScriptProcessor.process method.
 * 
 * @private
 * @alias Jaxer.CallbackManager.processScriptElements
 * @param {Jaxer.ScriptInfo} scriptInfo
 * 		The active scriptInfo being used to manage state in this callback
 * 		manager session
 */
function processScriptElements(scriptsInfo)
{
	try
	{
		// TODO: why do we need to use documentElement to see all the scripts??
		var scripts = Array.slice(document.documentElement.getElementsByTagName("script"));
		log.debug("Found " + scripts.length + " script blocks to conditionally post-process");
		// process each script element
		var processors = scripts.map(
			function processElement(element) 
			{
				var processor = new ScriptProcessor(element, scriptsInfo.jaxerProxies);
				processor.process();
				return processor;
			}
		);
		
		// perform any post-processing
		processors.forEach(
			function postProcess(processor) 
			{
				// see if we had proxies
				if (processor.hasProxies)
				{
					scriptsInfo.hasProxies = true;
				}
				
				// accumulate cacheInfos, proxyInfos
				scriptsInfo.cacheInfos = scriptsInfo.cacheInfos.concat(processor.cacheInfos);
				scriptsInfo.proxyInfos = scriptsInfo.proxyInfos.concat(processor.proxyInfos, processor.bothProxyInfos);
				
				// add top-level function names to accumulated list of names
				for (var p in processor.localFunctionNames)
				{
					scriptsInfo.functionNames[p] = processor.localFunctionNames[p];
				}
				
				// apply any needed changes to the DOM and the window object
				processor.apply();
			}
		);
	}
	catch(e)
	{
		log.error("Error: " + e);
	}
}

/**
 * Calculates the effective proxy attribute of a function based on settings on
 * the function and on global settings.
 * 
 * @private
 * @alias Jaxer.CallbackManager.calculateProxyAttribute
 * @param {Function} func
 * 		The function whose proxy attribute is to be calculated
 * @param {Object} jaxerProxies
 * 		An object containing names (as its properties) of functions to
 * 		implicitly proxy. If null, no functions will be proxied.
 * @param {String} runat
 * 		The runat property value from which to extract the proxy attribute, if
 * 		the function does not have its own runat property.
 */
CallbackManager.calculateProxyAttribute = function calculateProxyAttribute(func, jaxerProxies, runat)
{
	if (jaxerProxies == null)
	{
		return false;
	}
	else if (jaxerProxies.hasOwnProperty(func.name))
	{
		return true;
	}
	else if (func.hasOwnProperty(PROXY_ATTR))
	{
		return Boolean(func[PROXY_ATTR]);
	}
	else if (!runat)
	{
		return false;
	}
	else
	{
		switch(runat)
		{
			case RUNAT_CLIENT:
			case RUNAT_BOTH_NO_CACHE:
			case RUNAT_BOTH_AND_CACHE:
			case RUNAT_SERVER_NO_CACHE:
			case RUNAT_SERVER_AND_CACHE:
				return false;
				
			case RUNAT_BOTH_AND_PROXY:
			case RUNAT_SERVER_AND_PROXY:
				return true;
			
			default:
				var src = func.toSource();
				if (src.length > 60) src = src.substr(0, 60) + "...";
				log.error("Unrecognized " + RUNAT_ATTR + " property value '" + runat + "' for function: " + src);
				return false;
		}
	}
}

// private lookup table mapping runat values + proxy values to effective runat value
var PROPERTY_VALUE_MAP = {};
PROPERTY_VALUE_MAP[RUNAT_CLIENT + "-false"] = RUNAT_CLIENT;
PROPERTY_VALUE_MAP[RUNAT_CLIENT + "-true"] = RUNAT_CLIENT;
PROPERTY_VALUE_MAP[RUNAT_SERVER_AND_CACHE + "-false"] = RUNAT_SERVER_AND_CACHE;
PROPERTY_VALUE_MAP[RUNAT_SERVER_AND_CACHE + "-true"] = RUNAT_SERVER_AND_PROXY;
PROPERTY_VALUE_MAP[RUNAT_SERVER_AND_PROXY + "-false"] = RUNAT_SERVER_AND_CACHE;
PROPERTY_VALUE_MAP[RUNAT_SERVER_AND_PROXY + "-true"] = RUNAT_SERVER_AND_PROXY;
PROPERTY_VALUE_MAP[RUNAT_SERVER_NO_CACHE + "-false"] = RUNAT_SERVER_NO_CACHE;
PROPERTY_VALUE_MAP[RUNAT_SERVER_NO_CACHE + "-true"] = RUNAT_SERVER_AND_PROXY;
PROPERTY_VALUE_MAP[RUNAT_BOTH_AND_CACHE + "-false"] = RUNAT_BOTH_AND_CACHE;
PROPERTY_VALUE_MAP[RUNAT_BOTH_AND_CACHE + "-true"] = RUNAT_BOTH_AND_PROXY;
PROPERTY_VALUE_MAP[RUNAT_BOTH_AND_PROXY + "-false"] = RUNAT_BOTH_AND_CACHE;
PROPERTY_VALUE_MAP[RUNAT_BOTH_AND_PROXY + "-true"] = RUNAT_BOTH_AND_PROXY;
PROPERTY_VALUE_MAP[RUNAT_BOTH_NO_CACHE + "-false"] = RUNAT_BOTH_NO_CACHE;
PROPERTY_VALUE_MAP[RUNAT_BOTH_NO_CACHE + "-true"] = RUNAT_BOTH_AND_PROXY;

CallbackManager.calculateEffectiveRunat = function calculateEffectiveRunat(runatProp, proxyProp)
{
	return PROPERTY_VALUE_MAP[runatProp + "-" + proxyProp];
}

CallbackManager.cleanup = function cleanup(scriptsInfo)
{
	if (scriptsInfo) 
	{
		for (var name in scriptsInfo.functionNames) 
		{
			Jaxer.pageWindow[name] = undefined;
		}
	}
	
	runatFunctions = null;
	Jaxer.proxies = null;

}

frameworkGlobal.CallbackManager = Jaxer.CallbackManager = CallbackManager;

Log.trace("*** CallbackManager.js loaded");

})();

/*
 * Please note this exists only to add documentation for the "runat" and
 * "proxy" attributes. This documentation will drive content assist in
 * Aptana Studio by making these properties available on all JS functions
 */

/**
 * @classDescription {Function} A collection of Jaxer extensions for the JavaScript
 * Function object
 */

/**
 * Use the runat property inside of a "script" tag to specify whether to run the JavaScript on the server-side, 
 * client-side, or both. Use this property to inject proxies into the client. Valid values are "client", "server," "both",
 * "server-proxy", "server-nocache", "both-proxy", and "both-nocache".
 * 
 * @alias Function.prototype.runat
 * @property {String}
 */

/**
 * Use the proxy property to specify if this function should be callable
 * from the client. If a function is not marked for proxy, it will not be callable on the server.
 * Valid values are "true" or "false".
 * 
 * @alias Function.prototype.proxy
 * @property {Boolean}
 */

 /*
 * Please note this exists only to add documentation for the top-level Jaxer
 * object. Many of these properties are defined in the JavaScript bridge code
 * needed to handle events from the Jaxer engine itself
 */

/**
 * @namespace {Jaxer} The Jaxer namespace.
 */

/**
 * This property exposes the current build number of the Jaxer engine
 * 
 * @alias Jaxer.buildNumber
 * @property {String}
 */

/**
 * This gives read-only access to the Jaxer Core's preferences, each of which
 * become a property on this object.
 * 
 * @alias Jaxer.corePreferences
 * @property {Object}
 */

/**
 * This is the global execution context for JavaScript code you define in 
 * (or load into) a page on the server. It's aliased as window in the page,
 * so it behaves just like the window global object on the client (browser).
 * 
 * @advanced
 * @alias Jaxer.pageWindow
 * @property {ChromeWindow}
 */

/**
 * Loads and evaluates JavaScript from the given location against the given global
 * execution context.
 * This is a low-level wrapper around "@mozilla.org/moz/jssubscript-loader;1" and
 * mozIJSSubScriptLoader.loadSubScript.
 * It's best to use the higher-level Jaxer.Includer.load(src, global, runat)
 * which is also conveniently available as Jaxer.load(src, global, runat) inside
 * any Jaxer server-side page (where global is defaulted to window).
 * 
 * @advanced
 * @alias Jaxer.include
 * @param {String} url
 * 		The url of the file to include, either as an absolute URL in the form
 * 		"file:///..." or relative to the current executable's folder (with
 * 		or without the "resource:///" prefix.
 * @param {Object} [global]
 * 		An optional global context in which to evaluate the script.
 */

/**
 * True on the server side, false on the client (browser).
 * 
 * @alias Jaxer.isOnServer
 * @property {Boolean}
 */

/**
 * The value of the runat attribute of the last script block encountered.
 * 
 * @advanced
 * @alias Jaxer.lastScriptRunat
 * @property {String}
 */

/**
 * Notifies the framework that a fatal error has occurred, one which
 * will require fixing and restarting Jaxer.
 * How this is handled is then determined by the Jaxer.Config settings.
 * 
 * @advanced
 * @alias Jaxer.notifyFatal
 * @param {Object} error
 * 	The error describing what happened. If the framework has already been notified
 * 	of an error, this error is not used.
 */

/*
 * fragment : /opt/aptana-Jaxer-f7994fc/server/src/mozilla/aptana/../../../framework > frameworkEnd.js
 */
coreTraceMethods.TRACE('Loading fragment: frameworkEnd.js');
Jaxer.lastLoadedFragment = 'frameworkEnd.js';
Jaxer.frameworkLoaded = true;
}
catch (e)
{
	Jaxer.fatalError = e;
}

/*
 * This is the end of the Jaxer server framework JavaScript code.
 */