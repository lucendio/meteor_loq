
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
        if( configs.outputAll || filterEngine.filter( filterNames ) ){
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

    flood(){
        if( isPermitted() === false ){ return; }

        configs.outputAll = true;
    },

    shut(){
        configs.outputAll = false;
    },


    event( eventName, content ){
        if( typeof eventName !== 'string' || eventName.trim().length <= 0 ){
            throw new Error( 'invalid argument: eventName' );
        }
        
        const { eventEmittingEnabled } = configs;
        
        if( eventEmittingEnabled !== true ){ return; }
        
        Meteor.call( 'loq.transferEvent', eventName, content, ()=>{} );
    },

    // NOTE: enableForProduction wont be used on the client, but keeping field in schema, in case
    // its declared in shared code
    configure( options ){
        const schema = {
            eventEmitting: Match.Maybe( Boolean ),
            stringify: Match.Maybe( Boolean ),

            levels: Match.Maybe( [ String ] ),

            mimic: Match.Maybe( Match.OneOf( 'desktop', 'mobile', 'tv' ) ),
            hideDelay: Match.Maybe( Number ),
            
            // NOTE: not used, but supporting isomorphic configure code
            enableForProduction: Match.Maybe( Boolean )
        };

        if( !Match.test( options, schema ) ){
            throw new Error( 'no valid configuration' );
        }

        const {
            eventEmitting,
            levels,
            stringify,
            mimic,
            hideDelay
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

        if( typeof mimic === 'string' ){
            configs.mimickedDevice = mimic;
        }

        if( typeof hideDelay === 'number' ){
            configs.showtime = mimic;
        }

    }

};


Object.assign( loq, api );



export { loq as default };