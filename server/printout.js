
'use strict';



import clc from 'cli-color';

import platform from './../shared/lib/platform';
import levels, { defaultLevelName } from './../shared/levels';

import configs from './configs';



function printout( body, options = {} ){

    let {
        level: levelName = defaultLevelName,
        file = '???.js',
        line = '??',
        environment
    } = options;

    const levelLabel = levelName.toUpperCase();
    const { color } = levels.get( levelName );
    const origin = `${ file }:${ line }`;

    switch( platform ){

        case 'server': {
            if( typeof console === 'undefined' ){ return; }

            let { log, [ levelName ]: print } = console;

            if( typeof print !== 'function' ){
                print = log;
            }

            if( environment === 'production' ){

                if( configs.stringifyOutput === true ){
                    body = `${ levelLabel }  ${ JSON.stringify( body ) }  (${ origin })`;
                }else{
                    if( typeof body !== 'string' ){
                        print( `${ levelLabel }  Attention, raw output follows...  (${ origin })` );
                    }
                }
                print( body );

            }else{
                const { name: colorName } = color;
                let output = body;
                const clcolor = ( levelName !== defaultLevelName ) ? clc[ colorName ] : clc;

                if( typeof body !== 'string' ){
                    if( configs.stringifyOutput === true ){
                        output = JSON.stringify( body );
                    }else{
                        output = 'Attention, raw output follows...';
                    }
                }

                output = `${ clcolor.bold( `[${ levelLabel }]` ) }`
                       + `  ${ output }  `
                       + `${ clc.italic( `(${ origin })` ) }`;

                print( output );

                if( typeof body !== 'string' && configs.stringifyOutput === false ){
                    print( body );
                }
            }

            break;
        }

        default: {

            break;
        }
    }

}



export { printout as default };