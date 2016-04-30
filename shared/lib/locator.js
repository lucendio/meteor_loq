
'use strict';



// src: borrowed from https://github.com/meteor/meteor/blob/devel/packages/logging/logging.js#L75
// @return  {Object}    { line: Number, file: String }

function locateCaller(){

    const lineRegex = new RegExp('packages\/(?:local-test:)?lucendio(_|:)loq(?:\/|\.js)');

    var getStack = function(){
        const err = new Error;
        const stack = err.stack;
        return stack;
    };

    var stack = getStack();

    if( !stack ){ return {}; }

    let lines = stack.split( '\n' );

    let line;
    let noMatch = true;
    for( let i = 1; i < lines.length; ++i ){
        line = lines[ i ];

        if( !line.match( lineRegex ) ){
            noMatch = false;
            break;
        }
    }

    const details = {};

    const match = /(?:[@(]| at )([^(]+?):([0-9:]+)(?:\)|$)/.exec( line );
    if( !match ){
        return details;
    }

    details.line = match[ 2 ].split( ':' )[ 0 ];

    const lineSplit = /[^/]+(?=\.js)/.exec( match[ 1 ] );
    if( !noMatch && lineSplit ){
        details.file = lineSplit[ 0 ] + '.js';
    }else{
        details.file = 'console'
    }

    return details;
}



export { locateCaller as default };