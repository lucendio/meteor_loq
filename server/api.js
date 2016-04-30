
'use strict';



import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import {
    objectified as objectifiedLevels,
    functionize as functionizeLevels,
    defaultLevelName
} from './../shared/levels';
import filterEngine from './../shared/lib/filter-engine';
import locate from './../shared/lib/locator';

import configs from './configs';
import printout from './printout';
import isPermitted from './is';

import './methods/transfer-event';



const IS_DEVELOPMENT = Meteor.isDevelopment;
const IS_PRODUCTION  = Meteor.isProduction;


function loq( subject, options ){

    const { level = defaultLevelName } = options || {};

    if( isPermitted( level ) ){

        const { line, file } = locate();
        const environment = IS_PRODUCTION ? 'production' : 'development';

        printout( subject, { level, file, line, environment } );
    }

    return this;
}


const levels = functionizeLevels( loq );
Object.assign( loq, levels );


const api = {

    if( filterNames ){
        if( configs.outputAll === true || filterEngine.filter( filterNames ) ){
            return this;
        }else{
            return objectifiedLevels;
        }
    },

    limit( filterNames ){
        filterEngine.add( filterNames );
    },

    undo( filterNames ){
        if( typeof filterNames === 'undefined' ){
            filterEngine.reset();
        }else{
            filterEngine.remove( filterNames );
        }
    },

    flood( force ){
        if( IS_PRODUCTION && force !== true ){
            const msg = 'You are in production mode. If you really what to open the flood'
                      + ' gate, call `Log.flood( true )`';
            //TODO check syntax
            printout( msg, { level: 'warn' } );
            return;
        }

        configs.outputAll = true;
    },

    shut(){
        configs.outputAll = false;
    },

    
    event( eventName, content ){
        const { events, eventEmittingEnabled, eventTap } = configs;

        if( eventEmittingEnabled !== true || !events.has( eventName ) ){ return; }

        const event = events.get( eventName );

        if( typeof event === 'function' ){
            event.call( null, eventName, content );
        }else{
            // NOTE: failing silently on purpose if content does not match the pattern
            if( typeof eventTap === 'function' && Match.test( content, event ) ){
                eventTap( eventName, content );
            }
        }
    },

    monitor( /* arguments */ ){
        const { monitorTap } = configs;
        if( typeof monitorTap === 'function' ){
            monitorTap.apply( null, arguments );
        }
    },

    configure( options ){
        const schema = {
            eventEmitting: Match.Maybe( Boolean ),
            stringify: Match.Maybe( Boolean ),

            levels: Match.Maybe( [ String ] ),

            // NOTE: not used, but supporting isomorphic configure code
            mimic: Match.Maybe( Match.OneOf( 'desktop', 'mobile', 'tv' ) ),
            hideDelay: Match.Maybe( Number ),


            enableForProduction: Match.Maybe( Boolean ),
            monitoring: Match.Maybe( Boolean ),

            events: Match.Maybe( Object ),

            eventTap: Match.Maybe( Function ),
            monitorTap: Match.Maybe( Function )
        };

        if( !Match.test( options, schema ) ){
            throw new Error( 'no valid configuration' );
        }

        const {
            eventEmitting,
            stringify,

            levels,


            enableForProduction,
            monitoring,

            events,

            eventTap,
            monitorTap,
        } = options;

        if( typeof eventEmitting === 'boolean' ){
            configs.eventEmittingEnabled = eventEmitting;
        }

        if( typeof stringify === 'boolean' ){
            configs.stringifyOutput = stringify;
        }

        if( Array.isArray( levels ) ){
            if( levels.length <= 0 ){
                throw new Error( 'levels has to be not empty' );
            }
            if( configs.activatedLevels.size > 0 ){
                throw new Error( 'levels can only be configured once' );
            }
            levels.forEach( ( level )=>{
                configs.activatedLevels.set( level, true );
            });
        }

        if( typeof enableForProduction === 'boolean' ){
            configs.enabled = enableForProduction;
        }

        if( typeof monitoring === 'boolean' ){
            configs.monitoringEnabled = monitoring;
        }

        if( Match.test( events, Object ) ){
            if( Object.keys( events ).length <= 0 ){
                throw new Error( 'events has to be not empty' );
            }
            if( configs.events.size > 0 ){
                throw new Error( 'events can only be configured once' );
            }
            Object.keys( events ).forEach( ( eventName )=>{
                configs.events.set( eventName, [ eventName ] );
            });
        }



        if( typeof eventTap === 'function' ){
            configs.eventTap = eventTap;
        }

        if( typeof monitorTap === 'function' ){
            configs.monitorTap = monitorTap;
        }
    }

};


Object.assign( loq, api );



export { loq as default };