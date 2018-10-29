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

/**
 * Web Service Development Changelog:
 * 1. Removed 'Sandbox.js'
 * 2. Updated formating
 **/

coreTraceMethods.TRACE('Loading fragment: frameworkStart.js');
Jaxer.lastLoadedFragment = 'frameworkStart.js';

try {

	coreTraceMethods.TRACE('Loading fragment: Utilities.js');
	Jaxer.lastLoadedFragment = 'Utilities.js';
	include('resource:///framework/src/Utilities.js')

	coreTraceMethods.TRACE('Loading fragment: String.js');
	Jaxer.lastLoadedFragment = 'String.js';
	include('resource:///framework/src/String.js')

	coreTraceMethods.TRACE('Loading fragment: DateTime.js');
	Jaxer.lastLoadedFragment = 'DateTime.js';
	include('resource:///framework/src/DateTime.js')

	coreTraceMethods.TRACE('Loading fragment: Math.js');
	Jaxer.lastLoadedFragment = 'Math.js';
	include('resource:///framework/src/Math.js')

	coreTraceMethods.TRACE('Loading fragment: MultiHash.js');
	Jaxer.lastLoadedFragment = 'MultiHash.js';
	include('resource:///framework/src/MultiHash.js')

	coreTraceMethods.TRACE('Loading fragment: Url.js');
	Jaxer.lastLoadedFragment = 'Url.js';
	include('resource:///framework/src/Url.js')

	coreTraceMethods.TRACE('Loading fragment: CRC32.js');
	Jaxer.lastLoadedFragment = 'CRC32.js';
	include('resource:///framework/src/CRC32.js')

	coreTraceMethods.TRACE('Loading fragment: Crypto.js');
	Jaxer.lastLoadedFragment = 'Crypto.js';
	include('resource:///framework/src/Crypto.js')

	coreTraceMethods.TRACE('Loading fragment: DOM.js');
	Jaxer.lastLoadedFragment = 'DOM.js';
	include('resource:///framework/src/DOM.js')

	coreTraceMethods.TRACE('Loading fragment: Cookie.js');
	Jaxer.lastLoadedFragment = 'Cookie.js';
	include('resource:///framework/src/Cookie.js')

	coreTraceMethods.TRACE('Loading fragment: Certificate.js');
	Jaxer.lastLoadedFragment = 'Certificate.js';
	include('resource:///framework/src/Certificate.js')

	coreTraceMethods.TRACE('Loading fragment: Overrides.js');
	Jaxer.lastLoadedFragment = 'Overrides.js';
	include('resource:///framework/src/Overrides.js')

	coreTraceMethods.TRACE('Loading fragment: Both.js');
	Jaxer.lastLoadedFragment = 'Both.js';
	include('resource:///framework/src/Both.js')

	coreTraceMethods.TRACE('Loading fragment: Stopwatch.js');
	Jaxer.lastLoadedFragment = 'Stopwatch.js';
	include('resource:///framework/src/Stopwatch.js')

	coreTraceMethods.TRACE('Loading fragment: Log.js');
	Jaxer.lastLoadedFragment = 'Log.js';
	include('resource:///framework/src/Log.js')

	coreTraceMethods.TRACE('Loading fragment: Level.js');
	Jaxer.lastLoadedFragment = 'Level.js';
	include('resource:///framework/src/Level.js')

	coreTraceMethods.TRACE('Loading fragment: ModuleLogger.js');
	Jaxer.lastLoadedFragment = 'ModuleLogger.js';
	include('resource:///framework/src/ModuleLogger.js')

	coreTraceMethods.TRACE('Loading fragment: Appender.js');
	Jaxer.lastLoadedFragment = 'Appender.js';
	include('resource:///framework/src/Appender.js')

	coreTraceMethods.TRACE('Loading fragment: FileAppender.js');
	Jaxer.lastLoadedFragment = 'FileAppender.js';
	include('resource:///framework/src/FileAppender.js')

	coreTraceMethods.TRACE('Loading fragment: CoreAppender.js');
	Jaxer.lastLoadedFragment = 'CoreAppender.js';
	include('resource:///framework/src/CoreAppender.js')

	coreTraceMethods.TRACE('Loading fragment: LogInit.js');
	Jaxer.lastLoadedFragment = 'LogInit.js';
	include('resource:///framework/src/LogInit.js')

	coreTraceMethods.TRACE('Loading fragment: XHR.js');
	Jaxer.lastLoadedFragment = 'XHR.js';
	include('resource:///framework/src/XHR.js')

	coreTraceMethods.TRACE('Loading fragment: jslib_namespace_import.js');
	Jaxer.lastLoadedFragment = 'jslib_namespace_import.js';
	include('resource:///framework/src/jslib_namespace_import.js')

	coreTraceMethods.TRACE('Loading fragment: File.js');
	Jaxer.lastLoadedFragment = 'File.js';
	include('resource:///framework/src/File.js')

	coreTraceMethods.TRACE('Loading fragment: Dir.js');
	Jaxer.lastLoadedFragment = 'Dir.js';
	include('resource:///framework/src/Dir.js')

	coreTraceMethods.TRACE('Loading fragment: Includer.js');
	Jaxer.lastLoadedFragment = 'Includer.js';
	include('resource:///framework/src/Includer.js')

	coreTraceMethods.TRACE('Loading fragment: Web.js');
	Jaxer.lastLoadedFragment = 'Web.js';
	include('resource:///framework/src/Web.js')

	coreTraceMethods.TRACE('Loading fragment: Socket.js');
	Jaxer.lastLoadedFragment = 'Socket.js';
	include('resource:///framework/src/Socket.js')

	coreTraceMethods.TRACE('Loading fragment: BinarySocket.js');
	Jaxer.lastLoadedFragment = 'BinarySocket.js';
	include('resource:///framework/src/BinarySocket.js')

	coreTraceMethods.TRACE('Loading fragment: SMTP.js');
	Jaxer.lastLoadedFragment = 'SMTP.js';
	include('resource:///framework/src/SMTP.js')

	coreTraceMethods.TRACE('Loading fragment: Exception.js');
	Jaxer.lastLoadedFragment = 'Exception.js';
	include('resource:///framework/src/Exception.js')

	coreTraceMethods.TRACE('Loading fragment: ClientError.js');
	Jaxer.lastLoadedFragment = 'ClientError.js';
	include('resource:///framework/src/ClientError.js')

	coreTraceMethods.TRACE('Loading fragment: DB.js');
	Jaxer.lastLoadedFragment = 'DB.js';
	include('resource:///framework/src/DB.js')

	coreTraceMethods.TRACE('Loading fragment: ResultSet.js');
	Jaxer.lastLoadedFragment = 'ResultSet.js';
	include('resource:///framework/src/ResultSet.js')

	coreTraceMethods.TRACE('Loading fragment: DB_MySQL.js');
	Jaxer.lastLoadedFragment = 'DB_MySQL.js';
	include('resource:///framework/src/DB_MySQL.js')

	coreTraceMethods.TRACE('Loading fragment: DB_SQLite.js');
	Jaxer.lastLoadedFragment = 'DB_SQLite.js';
	include('resource:///framework/src/DB_SQLite.js')

	coreTraceMethods.TRACE('Loading fragment: System.js');
	Jaxer.lastLoadedFragment = 'System.js';
	include('resource:///framework/src/System.js')

	coreTraceMethods.TRACE('Loading fragment: Process.js');
	Jaxer.lastLoadedFragment = 'Process.js';
	include('resource:///framework/src/Process.js')

	coreTraceMethods.TRACE('Loading fragment: Thread.js');
	Jaxer.lastLoadedFragment = 'Thread.js';
	include('resource:///framework/src/Thread.js')

	coreTraceMethods.TRACE('Loading fragment: CacheManager.js');
	Jaxer.lastLoadedFragment = 'CacheManager.js';
	include('resource:///framework/src/CacheManager.js')

	coreTraceMethods.TRACE('Loading fragment: Container.js');
	Jaxer.lastLoadedFragment = 'Container.js';
	include('resource:///framework/src/Container.js')

	coreTraceMethods.TRACE('Loading fragment: DBPersistor.js');
	Jaxer.lastLoadedFragment = 'DBPersistor.js';
	include('resource:///framework/src/DBPersistor.js')

	coreTraceMethods.TRACE('Loading fragment: SessionManager.js');
	Jaxer.lastLoadedFragment = 'SessionManager.js';
	include('resource:///framework/src/SessionManager.js')

	coreTraceMethods.TRACE('Loading fragment: Request.js');
	Jaxer.lastLoadedFragment = 'Request.js';
	include('resource:///framework/src/Request.js')

	coreTraceMethods.TRACE('Loading fragment: Response.js');
	Jaxer.lastLoadedFragment = 'Response.js';
	include('resource:///framework/src/Response.js')

	coreTraceMethods.TRACE('Loading fragment: CoreEvents.js');
	Jaxer.lastLoadedFragment = 'CoreEvents.js';
	include('resource:///framework/src/CoreEvents.js')

	coreTraceMethods.TRACE('Loading fragment: ServerStart.js');
	Jaxer.lastLoadedFragment = 'ServerStart.js';
	include('resource:///framework/src/ServerStart.js')

	coreTraceMethods.TRACE('Loading fragment: RequestStart.js');
	Jaxer.lastLoadedFragment = 'RequestStart.js';
	include('resource:///framework/src/RequestStart.js')

	coreTraceMethods.TRACE('Loading fragment: InitHead.js');
	Jaxer.lastLoadedFragment = 'InitHead.js';
	include('resource:///framework/src/InitHead.js')

	coreTraceMethods.TRACE('Loading fragment: NewElement.js');
	Jaxer.lastLoadedFragment = 'NewElement.js';
	include('resource:///framework/src/NewElement.js')

	coreTraceMethods.TRACE('Loading fragment: ParseComplete.js');
	Jaxer.lastLoadedFragment = 'ParseComplete.js';
	include('resource:///framework/src/ParseComplete.js')

	coreTraceMethods.TRACE('Loading fragment: ParseStart.js');
	Jaxer.lastLoadedFragment = 'ParseStart.js';
	include('resource:///framework/src/ParseStart.js')

	coreTraceMethods.TRACE('Loading fragment: HandlePage.js');
	Jaxer.lastLoadedFragment = 'HandlePage.js';
	include('resource:///framework/src/HandlePage.js')

	coreTraceMethods.TRACE('Loading fragment: HandleCallback.js');
	Jaxer.lastLoadedFragment = 'HandleCallback.js';
	include('resource:///framework/src/HandleCallback.js')

	coreTraceMethods.TRACE('Loading fragment: HandleService.js');
	Jaxer.lastLoadedFragment = 'HandleService.js';
	include('resource:///framework/src/HandleService.js')

	coreTraceMethods.TRACE('Loading fragment: RequestComplete.js');
	Jaxer.lastLoadedFragment = 'RequestComplete.js';
	include('resource:///framework/src/RequestComplete.js')

	coreTraceMethods.TRACE('Loading fragment: App.js');
	Jaxer.lastLoadedFragment = 'App.js';
	include('resource:///framework/src/App.js')

	coreTraceMethods.TRACE('Loading fragment: Extend.js');
	Jaxer.lastLoadedFragment = 'Extend.js';
	include('resource:///framework/src/Extend.js')

	coreTraceMethods.TRACE('Loading fragment: Serialization.js');
	Jaxer.lastLoadedFragment = 'Serialization.js';
	include('resource:///framework/src/Serialization.js')

	coreTraceMethods.TRACE('Loading fragment: FunctionInfo.js');
	Jaxer.lastLoadedFragment = 'FunctionInfo.js';
	include('resource:///framework/src/FunctionInfo.js')

	coreTraceMethods.TRACE('Loading fragment: TextParser.js');
	Jaxer.lastLoadedFragment = 'TextParser.js';
	include('resource:///framework/src/TextParser.js')

	coreTraceMethods.TRACE('Loading fragment: RunatConstants.js');
	Jaxer.lastLoadedFragment = 'RunatConstants.js';
	include('resource:///framework/src/RunatConstants.js')

	coreTraceMethods.TRACE('Loading fragment: ScriptInfo.js');
	Jaxer.lastLoadedFragment = 'ScriptInfo.js';
	include('resource:///framework/src/ScriptInfo.js')

	coreTraceMethods.TRACE('Loading fragment: ScriptProcessor.js');
	Jaxer.lastLoadedFragment = 'ScriptProcessor.js';
	include('resource:///framework/src/ScriptProcessor.js')

	coreTraceMethods.TRACE('Loading fragment: CallbackManager.js');
	Jaxer.lastLoadedFragment = 'CallbackManager.js';
	include('resource:///framework/src/CallbackManager.js')

	coreTraceMethods.TRACE('Loading fragment: frameworkEnd.js');
	Jaxer.lastLoadedFragment = 'frameworkEnd.js';
	Jaxer.frameworkLoaded = true;

} catch (e) {

	Jaxer.fatalError = e;

}

/*
 * This is the end of the Jaxer server framework JavaScript code.
 */
