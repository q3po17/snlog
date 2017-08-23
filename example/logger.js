const log = require( '../' );

// default errorlevel of xlog is 3!
const dbgLog = log.clog( log.colors.FgYellow );
const errLog = log.clog( log.colors.FgRed, log.colors.BgWhite, 0 );

errLog( "Current Error Level", log.getErrorLevel() );

let o = {
	name: "snlog",
	arr: [ 1, 2, 3, 4 ],
	f: function test() {}
};

dbgLog( o ); // prints the object
log.setErrorLevel( 1 );
dbgLog( o ); // no output, because of low error level
errLog( "End-of-Example" );