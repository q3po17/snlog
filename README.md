# snlog
A Simple Logger for Node.js

## Installation
`npm i snlog --save`

## Features
* shows name of printing module
* shows line number
* may use coloring
* can be controlled by an error level


Example:

```javascript
const log = require( 'snlog' );

// default errorlevel of xlog is 3!
const dbgLog = log.clog( log.colors.FgYellow );

// errLog has error level 0; it will print output 
// if currentErrorLevel is >= 1
const errLog = log.clog( log.colors.FgRed, log.colors.BgWhite, 0 );

errLog( "Current Error Level", log.getErrorLevel() );

let o = {
	name: "snlog",
	arr: [ 1, 2, 3, 4 ],
	f: function test() {}
};

dbgLog( o ); // prints the object
log.setErrorLevel( 1 ); // downgrade current error level
dbgLog( o ); // no output, because of low error level
errLog( "End-of-Example" ); // will print red on white
```

