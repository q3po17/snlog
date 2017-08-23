///////////////////////////////////////////////////////////////////////////////
//	Version 1: 14.08.2017 (33) 09:44:25 
//		clear subscriptions by module
//
//
/* global console, module */
var path = require( 'path' );
var fs = require( "fs" );
var colors = {};
colors.Reset = "\x1b[0m";
colors.Bright = "\x1b[1m";
colors.Dim = "\x1b[2m";
colors.Underscore = "\x1b[4m";
colors.Blink = "\x1b[5m";
colors.Reverse = "\x1b[7m";
colors.Hidden = "\x1b[8m";
colors.FgBlack = "\x1b[30m";
colors.FgRed = "\x1b[31m";
colors.FgGreen = "\x1b[32m";
colors.FgYellow = "\x1b[33m";
colors.FgBlue = "\x1b[34m";
colors.FgMagenta = "\x1b[35m";
colors.FgCyan = "\x1b[36m";
colors.FgWhite = "\x1b[37m";
colors.BgBlack = "\x1b[40m";
colors.BgRed = "\x1b[41m";
colors.BgGreen = "\x1b[42m";
colors.BgYellow = "\x1b[43m";
colors.BgBlue = "\x1b[44m";
colors.BgMagenta = "\x1b[45m";
colors.BgCyan = "\x1b[46m";
colors.BgWhite = "\x1b[47m";
var currentErrorLevel = 5;

function prep( arr ) {
	var msg = '';
	for ( var idx = 0; idx < arr.length; ++idx ) {
		var arg = arr[ idx ];
		if ( arg === undefined ) {
			msg += "undefined ";
		} else if ( typeof arg === 'function' ) {
			msg += "function ";
		} else if ( typeof arg === 'object' ) {
			for ( let a in arg ) {
				if ( typeof arg[ a ] !== "function" ) {
					msg += "[" + a + "]=" + arg[ a ] + "; ";
				} else {
					msg += "[" + a + "]=function; ";
				}
			}
		} else {
			msg += arg + " ";
		}
	}
	return msg;
} ///////////////////////////////////////////////////////////////////////////////
// enhance the stack
var s = global.__stack;
if ( s === undefined ) {
	Object.defineProperty( global, '__stack', {
		get: function() {
			var orig = Error.prepareStackTrace;
			Error.prepareStackTrace = function( _, stack ) {
				return stack;
			};
			var err = new Error;
			Error.captureStackTrace( err, arguments.callee );
			var stack = err.stack;
			Error.prepareStackTrace = orig;
			return stack;
		}
	} );
	Object.defineProperty( global, '__line', {
		get: function() {
			return __stack[ 1 ].getLineNumber();
		}
	} );
	Object.defineProperty( global, '__filename', {
		get: function() {
			return __stack[ 1 ].getFileName();
		}
	} );
}
///////////////////////////////////////////////////////////////////////////////
// colored log
function xlog( fg = colors.FgGreen, bg = colors.BgBlack, level = 3 ) {
	return function() {
		if ( currentErrorLevel > level ) {
			let s = showStack( 2 );
			console.log( fg + bg + "[" + s.name + "#" + s.line + "]", prep( arguments ), colors.Reset );
		}
	};
}

function ylog( title, level ) {
	"use strict";
	level = level || 0;
	return function() {
		if ( currentErrorLevel > level ) {
			var s = showStack( 2 );
			console.log( title, "#" + s.line, s.name, prep( arguments ) );
		}
	};
}

function showStack( start ) {
	var s = __stack;
	var p = s[ start ].getFileName();
	var fobj = path.parse( p );
	return {
		line: s[ start ].getLineNumber(),
		name: fobj.name
	};
};

function flog( filename ) {
	"use strict";
	fs.writeFile( filename, '########\n', function( err ) {
		if ( err ) throw err;
	} );
	return function() {
		fs.appendFile( filename, prep( arguments ) + "\n", function( err ) {} );
	};
}
///////////////////////////////////////////////////////////////////////////////
//
module.exports.setErrorLevel = function( level ) {
	"use strict";
	// console.log( "[log] error level to", level );
	currentErrorLevel = level;
};
///////////////////////////////////////////////////////////////////////////////
//
module.exports.getErrorLevel = function() {
	"use strict";
	// console.log( "error level is", currentErrorLevel );
	return currentErrorLevel;
};
module.exports.colors = colors;
module.exports.xlog = xlog;
module.exports.ylog = ylog;
module.exports.flog = flog;
module.exports.showStack = showStack;
module.exports.log = function( title, level ) {
	"use strict";
	return ylog( title, level );
};