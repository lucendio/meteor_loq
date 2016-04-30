
'use strict';


import { Meteor } from 'meteor/meteor';


const IS_SERVER = Meteor.isServer;
const IS_CLIENT = Meteor.isClient;
const IS_DEVELOPMENT = Meteor.isDevelopment;
const IS_PRODUCTION  = Meteor.isProduction;



const levels = new Map([
    [
        'info',
        {
            default: false,
            color: {
                name: 'green',
                r: 2,
                g: 84,
                b: 2,
                ansi: '\u001b[32m'
            },
            fn(){

            }
        }
    ],
    [
        'warn',
        {
            default: false,
            color: {
                name: 'yellow',
                r: 255,
                g: 170,
                b: 0,
                ansi: '\u001b[33m'
            },
            fn(){

            }
        }
    ],
    [
        'error',
        {
            default: false,
            color: {
                name: 'red',
                r: 177,
                g: 0,
                b: 6,
                ansi: '\u001b[31m'
            },
            fn(){

            }
        }
    ],
    [
        'debug',
        {
            default: false,
            color: {
                name: 'blue',
                r: 17,
                g: 72,
                b: 132,
                ansi: '\u001b[34m'
            },
            fn(){

            }
        }
    ],
    [
        'log',
        {
            default: true,
            color: {
                name: 'white',
                r: 20,
                g: 20,
                b: 20,
                ansi: '\u001b[37m'      // gray: \u001b[90m
            },
            fn(){

            }
        }
    ]
]);


function functionize( loq ){
    return Array.from( levels.keys() ).reduce( ( fns, levelName )=>{
        const level = levels.get( levelName );

        if( typeof loq === 'undefined' ){
            if( typeof level.fn === 'function' ){
                loq = level.fn;
            }else{
                loq = function(){};
            }
        }

        if( level.default === true ){
            fns[ levelName ] = function( content ){
                loq( content );
            };
        }else{
            fns[ levelName ] = function( content ){
                loq( content, { level: levelName } );
            };
        }
        return fns;
    }, {/* fns */} );
}


const { levelMap: objectified, defaultLevel: defaultLevelName } = (function(){
    let defaultLevel = 'log';
    const levelMap =  Array.from( levels.keys() ).reduce( ( fns, levelName )=>{
        const level = levels.get( levelName );

        if( level.default === true ){ defaultLevel = levelName; }

        if( typeof level.fn === 'function' ){
            fns[ levelName ] = levels.get( levelName ).fn;
        }else{
            fns[ levelName ] = function(){};
        }
        return fns;
    }, {/* fns */} );
    return { levelMap, defaultLevel };
}());

Object.freeze( objectified );



export {
    levels as default,
    defaultLevelName,
    objectified,
    functionize
};