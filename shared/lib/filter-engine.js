
'use strict';



import { Match } from 'meteor/check';



const FILTER_POOL = new Map();
const DEFAULT_FILTER_NAME = 'global';   // NOTE: currently not used


const engine = {
    defaultFilter: DEFAULT_FILTER_NAME,

    filter( filterNames ){
        filterNames = checkFilterName( filterNames );

        for( const filterName of filterNames ){
            if( !FILTER_POOL.has( filterName ) ){ return false; }
        }

        return true;
    },

    add( filterNames ){
        filterNames = checkFilterName( filterNames );

        filterNames.forEach( ( filterName )=>{
            FILTER_POOL.set( filterName, Date.now() );
        });
    },

    remove( filterNames ){
        filterNames = checkFilterName( filterNames );

        return filterNames.reduce( ( result, filterName )=>{
            result[ filterName ] = FILTER_POOL.delete( filterName );
            return result;
        }, { /*results*/ } );
    },

    reset(){
        FILTER_POOL.clear();
    }
};

export { engine as default };




// @return  [ String ]
// @throw   invalid param
function checkFilterName( filterNames ){
    if( typeof  filterNames === 'string' && filterNames.trim().length > 0 ){
        filterNames = [ filterNames ];
    }

    if( Match.test( filterNames, [ String ] ) === false ){
        throw new Error( 'filterNames has to be a string or an array with string' );
    }

    return filterNames;
}