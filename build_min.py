#!/usr/bin/env python

from local_settings import cfg
from global_settings import gcfg

import os
import re
import shutil
import stat
import sys
import platform
import time
import datetime

WINDOWS = 'win'
MACOS   = 'mac'
LINUX   = 'linux'
SOLARIS = 'sunos'

def system(cmd):
	sys.stdout.flush()
	rc = os.system(cmd)
	if not sys.platform.startswith("win"):
		rc = rc >> 8
	if rc != 0:
		print "Command failed with status %d: %s" % (rc, cmd)
		exit(rc)

def do_remove_dir(dirname):
	print "Removing ", dirname
	try:
		shutil.rmtree(dirname)
	except OSError, err:
		print "***Failed to remove ", dirname, " ***"
		print "errno=" + str(err.errno)
		print "error=" + err.strerror 
		print "filename=" + err.filename

def remove_dir_if_not_created_today(dirname):
	today = datetime.datetime.now().timetuple()[7]
	info = os.stat(dirname)
	dirtime = datetime.datetime.fromtimestamp(info.st_ctime)
	dirday = dirtime.timetuple()[7]
	if today != dirday:
		do_remove_dir(dirname)

def copyfile(src, dst):
	shutil.copy2(src, dst)

def replaceinfile(filepath, pattern, replacement):
	f = open(filepath, 'r+')
	contents = f.read()
	contents = re.sub(pattern, replacement, contents)
	f.seek(0)
	f.truncate(0)
	f.write(contents)
	f.close()

def unlinkifexists(filepath):
	if os.path.exists(filepath):
		os.unlink(filepath)

def unlinkifexistsexecutable(filepath):
	if os.path.exists(filepath + '.exe'):
		os.unlink(filepath + '.exe')
	elif os.path.exists(filepath):
		os.unlink(filepath)

def filesmatching(path, prefix, pattern):
	all = os.listdir(path)
	selected = []
	for filename in all:
		if re.search(pattern, filename):
			selected.append(prefix + filename)
	return selected


unlinkifexists('distro/Jaxer_package_withApache.zip')
unlinkifexists('distro/Jaxer_package.zip')
unlinkifexists('distro/Jaxer_update.zip')

# Put the build number into a header file.  Don't touch the header file unless
# the number actually changes in order to minimize recompilations.
f = open('src/mozilla/aptana/jaxerBuildId.h', 'r')
contents = f.read()
f.close()
matches = re.search(r'#define JAXER_BUILD_ID "([0-9.]+)\.([x0-9]+)(.*)"', contents)
fullversion=None
if 'BUILDNO' in os.environ:
	buildno = os.environ['BUILDNO']
	if buildno != matches.group(2):
		fullversion = matches.group(1) + '.' + buildno
		fullversionstring = fullversion + matches.group(3)
		fullversioncommas = ','.join(fullversionstring.split('.'))
		print "Updating version to %s." % fullversionstring
		replaceinfile('src/mozilla/aptana/jaxerBuildId.h', r'#define JAXER_BUILD_ID "([0-9.]+)\.(.+)"', '#define JAXER_BUILD_ID "%s"' % fullversionstring)
		replaceinfile('src/mozilla/aptana/jaxerBuildId.h', r'#define JAXER_BUILD_NUMBER "xxxx', '#define JAXER_BUILD_NUMBER "%s' % buildno)
		replaceinfile('src/mozilla/aptana/jaxerBuildId.h', r'#define JAXER_BUILD_ID_L L"([0-9.]+)\.(.+)"', '#define JAXER_BUILD_ID_L L"%s"' % fullversionstring)
		replaceinfile('src/connectors/apache/apache-modules/mod_jaxer/mod_jaxer.rc', r'X\.X\.X\.X', fullversionstring)
		replaceinfile('src/connectors/apache/apache-modules/mod_jaxer/mod_jaxer.rc', r'X\,X\,X\,X', fullversioncommas)


# Regenerate localinc.h
localinc = "src/mozilla/aptana/JaxerPro/localinc.h"
tmpfp = open("src/mozilla/aptana/JaxerPro/localinc.h", "w")
tmpfp.write("#define TIME_NOW %d\n" % time.time())
tmpfp.close()

# Find out where mozilla is putting the stuff it builds.
mozconfig_file = 'src/mozilla/'
if platform.machine().endswith('64'):
	mozconfig_file = '.mozconfig-linux64'
else:
	mozconfig_file = '.mozconfig-linux'

if gcfg['generateDebuggerSymbols'] == True:
	mozconfig_file += '_crs'
	print "\n======= Debug-symbols will be generated in this build ======="

copyfile('src/mozilla/' + mozconfig_file, 'src/mozilla/.mozconfig')

f = open('src/mozilla/.mozconfig', 'r')
x = f.read()
f.close()
y = re.search('MOZ_OBJDIR=@TOPSRCDIR@/(.+)', x)
ffdir = y.group(1)


path = os.path.abspath('src/mozilla').replace('\\', '/')
framework = path + '/' + ffdir + '/dist/bin/framework'
connectors = path + '/' + ffdir + '/dist/bin/connectors'
bindir = path + '/' + ffdir + '/dist/bin/'
	
dirs_to_be_removed = [
	bindir,
	path + '/' + ffdir + '/i386/dist/bin/',
	path + '/' + ffdir + '/ppc/dist/bin/',
	path + '/' + ffdir + '/dist/crashreporter-symbols/',
	path + '/' + ffdir + '/i386/dist/crashreporter-symbols/',
	path + '/' + ffdir + '/ppc/dist/crashreporter-symbols/'
]

#Remove working dirs if needed
if os.path.exists('src/mozilla/' + ffdir):
	if gcfg['doCleanBuild'] == True:
		do_remove_dir('src/mozilla/' + ffdir)
		print "\n======= This is a clean build of Jaxer ======="
	else:
		remove_dir_if_not_created_today('src/mozilla/' + ffdir)

for adir in dirs_to_be_removed:
	try:
		if os.path.exists(adir):
			shutil.rmtree(adir)
	except OSError, err:
		print "***Failed to remove ", adir, " *** "
		exit(1)

#Create dirs if not exist
if not os.path.exists(bindir):
	os.makedirs(bindir)

# Build google_breakpad that we will use late
print "\n===== Building google_breakpad."
system('cd src/google/google_breakpad && ./configure && make')

# Build libevent
print "\n===== Building libevent."
system('cd src/libevent/libevent-1.4.2-rc && ./configure && make')
copyfile('src/libevent/libevent-1.4.2-rc/.libs/libevent-1.4.so.2', 'src/mozilla/' + ffdir + '/dist/bin/')

print "\n===== Building Jaxer." 
os.environ['LD_LIBRARY_PATH'] = '.'
system('cd %s && touch configure && make -f client.mk build && cd %s/dist/bin' % (path, ffdir))
system('cd %s/%s/dist/bin && ./jaxer -reg' % (path, ffdir))

# Cleanup Jaxer and XPCOM files
jaxer = 'src/mozilla/' + ffdir + '/dist/bin'
path = os.path.abspath(jaxer)
xpts = ' '.join(filesmatching('%s/components' % path, 'components/', r'\.xpt$'))
system('cd %s && ../sdk/bin/xpt_link components/components.xpt_ %s' % (path, xpts))
system('rm %s/components/*.xpt' % path)
system('mv %s/components/components.xpt_ %s/components/components.xpt' % (path, path))
unlinkifexists(jaxer + '/components/compreg.dat')
unlinkifexists(jaxer + '/components/xpti.dat')
unlinkifexistsexecutable(jaxer + '/mangle')
unlinkifexistsexecutable(jaxer + '/shlibsign')
unlinkifexistsexecutable(jaxer + '/xpcshell')
unlinkifexistsexecutable(jaxer + '/xpicleanup')
unlinkifexistsexecutable(jaxer + '/xpidl')
unlinkifexistsexecutable(jaxer + '/xpt_dump')
unlinkifexistsexecutable(jaxer + '/xpt_link')

if not os.path.exists('src/mozilla/' + ffdir + '/dist/bin/framework'):
	os.mkdir('src/mozilla/' + ffdir + '/dist/bin/framework')
if not os.path.exists('src/mozilla/' + ffdir + '/dist/bin/connectors'):
	os.mkdir('src/mozilla/' + ffdir + '/dist/bin/connectors')

# Build servlet.
print "\n===== Building servlet."
system('cd src/connectors/servlet && bash ./build.sh')
copyfile('src/connectors/servlet/products/jaxer-app.war',	'src/mozilla/' + ffdir + '/dist/bin/connectors')
copyfile('src/connectors/servlet/products/jaxer-server.war', 'src/mozilla/' + ffdir + '/dist/bin/connectors')

# Build mod_jaxer.
print "\n===== Building mod_jaxer."
system('cd src/connectors/apache/apache-modules/mod_jaxer && ' + cfg['apxs-name'] + ' -c *.c')
copyfile('src/connectors/apache/apache-modules/mod_jaxer/.libs/mod_jaxer.so', 'src/mozilla/' + ffdir + '/dist/bin/connectors/mod_jaxer.so')


# Build jam distribution.
print "\n===== Building jam distributions."
sys.stdout.flush()

# First clone the distribution in svn (minus the svn directories) to produce a
# master.
if os.path.exists('jam'):
	print "\n  === Remove jam folder."
	shutil.rmtree('jam')

print "\n  === Copy data from distro/jam."
for root, dirs, files in os.walk('distro/jam'):
	destdir = root.partition('distro/')[2]
	os.mkdir(destdir)
	root = root + '/'
	destdir = destdir + '/'

	for file in files:
		copyfile(root + file, destdir + file)

	if '.svn' in dirs:
		dirs.remove('.svn')

	# We don't ship MySQL any more in any package.
	if 'mysql' in dirs:
		dirs.remove('mysql')

# Now copy the built stuff into the master clone.
print "\n  === Copying data from src/mozilla/" + ffdir + "/dist/bin to jam/jaxer."
for root, dirs, files in os.walk('src/mozilla/' + ffdir + '/dist/bin'):
	destdir = root.replace('src/mozilla/' + ffdir + '/dist/bin', 'jam/jaxer')
	if not os.path.exists(destdir):
		os.mkdir(destdir)
	root = root + '/'
	destdir = destdir + '/'
	if destdir == 'jam/jaxer/':
		if 'firefox' in files:
			files.remove('firefox')
		if 'firefox-bin' in files:
			files.remove('firefox-bin')
		if 'jaxerpro' in files:
			files.remove('jaxerpro')
		if 'JaxerPro' in files:
			files.remove('JaxerPro')
		if 'chrome' in dirs:
			dirs.remove('chrome')
		if 'dictionaries' in dirs:
			dirs.remove('dictionaries')
		if 'plugins' in dirs:
			dirs.remove('plugins')
		if 'searchplugins' in dirs:
			dirs.remove('searchplugins')
	for file in files:
		copyfile(root + file, destdir + file)

print "\n  === Renaming/Removing extra stuff."
print "\n   == Renaming jam/Apache22-local to jam/Apache22."
#os.mkdir('jam/Apache22')
shutil.copytree('src/scripts/unix', 'jam/scripts')
os.remove('jam/StartServers.bat')
os.remove('jam/ConfigureFirewall.exe')

print "\n  === Copying chrome (should be reviewed/removed in the future)"
os.mkdir('jam/jaxer/chrome');
copyfile('src/mozilla/' + ffdir +'/dist/bin/chrome/en-US.manifest',
		 'jam/jaxer/chrome/en-US.manifest')
copyfile('src/mozilla/' + ffdir +'/dist/bin/chrome/en-US.jar',
		 'jam/jaxer/chrome/en-US.jar')


# Create a version file in NSIS format
print "\n  === Creating a version file in NSIS format."
lines = open("src/mozilla/aptana/jaxerBuildId.h").readlines()
for line in lines:
	if line.find("#define JAXER_BUILD_ID") >= 0:
		f = open("jam/jaxer/version.txt", "w")
		f.write('!define JAXER_BUILD_ID ' + line.split()[2])
		f.close()
		break

# Create subset distributions and zip them.
print "\n===== Creating and zipping distributions."
topdirname = 'AptanaJaxer'

if os.path.exists(topdirname):
	shutil.rmtree(topdirname)

os.rename('jam', topdirname)