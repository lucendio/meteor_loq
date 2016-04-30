
'use strict';



import { Meteor} from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';

import weAreOn from './../shared/lib/platform';
import levels, { defaultLevelName } from './../shared/levels';

import configs from './configs';

import './templates/loq_onscreen';
import './templates/loq_message';



let view = undefined;
let $domWrap = null;
let messageViewStack = [];
let onScreenMessageQueue = [];


const printout = function printout( body, options = {} ){

    let platform = weAreOn;
    if( typeof configs.mimickedDevice === 'string' ){
        platform = configs.mimickedDevice;
    }

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

        case 'desktop': {
            if( typeof console === 'undefined' ){ return; }


            // NOTE: invoking from console does not work on the client
            //const { log, [ levelName ]: print } = console;

            const { r, g, b } = color;
            let styles = [ `color: rgb( ${ r }, ${ g }, ${ b } )` ].join( ';' );
            if( levelName === defaultLevelName ){
                styles = [];
            }

            let output = '';
            if( typeof body !== 'string' ){
                if( configs.stringifyOutput === true ){
                    output = `%c[${ levelLabel }]%c  ${ JSON.stringify( body ) }  (${ origin })`;
                }else{
                    output = `%c[${ levelLabel }]%c`
                           + `  ${ 'Attention, raw output follows...' }`
                           + `  (${ origin })`;
                }
            }else{
                output = `%c[${ levelLabel }]%c  ${ body }  (${ origin })`;
            }

            if( typeof console[ levelName ] === 'function' ){
                console[ levelName ]( output, styles );
            }else{
                console.log( output, styles );
            }

            if( typeof body !== 'string' && configs.stringifyOutput === false ){
                if( typeof console[ levelName ] === 'function' ){
                    console[ levelName ]( body );
                }else{
                    console.log( body );
                }
            }

            break;
        }

        case 'mobile':
        case 'tv': {

            if( typeof view === 'undefined' || $domWrap === null ){
                return onScreenMessageQueue.push( { body, options } );
            }

            let msgView = Blaze.renderWithData(
                Template[ 'loq_message' ],
                {
                    message: ( typeof body !== 'string' ) ? JSON.stringify( body ) : body,
                    isString: ( typeof body === 'string' ),
                    level: levelName,
                    origin,
                    device: platform
                },
                $domWrap.childNodes[ 1 ],
                view
            );

            messageViewStack.push( msgView );

            msgView.timerToRemove = setTimeout( function(  ){

                for( var i = 0; i < messageViewStack.length; i += 1 ){
                    if( messageViewStack[i] === this ){
                        messageViewStack.splice( i, 1 );
                        break;
                    }
                }
                Blaze.remove( this );
                msgView = undefined;

            }.bind( msgView ), configs.showtime );


            break;
        }

        default: {

            break;
        }
    }

};


Meteor.startup( ()=>{
    view = Blaze.render( Template[ 'loq_onscreen' ], document.body );
    $domWrap = document.getElementById( 'loq' );

    while( onScreenMessageQueue.length > 0 ){
        const {
            body,
            options
        } = onScreenMessageQueue.shift();
        printout( body, options );
    }
});



export { printout as default };