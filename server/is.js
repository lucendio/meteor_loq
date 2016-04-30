
'use strict';



import { Meteor } from 'meteor/meteor';

import configs from './configs';



// NOTE: import has no 'weak' concept; cant wrap in try-catch; will throw if not exist
// XXX may break when meteor's global 'Package' is gone
//import { loqEnabledPkg } from 'meteor/lucendio:loq-enabled';
const loqEnabledPkg = typeof Package[ 'lucendio:loq-enabled' ] !== 'undefined';

const IS_SERVER = true;
const IS_CLIENT = !IS_SERVER;
const IS_DEVELOPMENT = Meteor.isDevelopment;
const IS_PRODUCTION  = Meteor.isProduction;


function permitted( level ){

    const { enabled } = configs;

    if( !IS_SERVER ){ return false; }

    if( typeof level === 'string'
            && configs.activatedLevels.size > 0
            && !configs.activatedLevels.has( level ) ){
        return false;
    }
    
    
    if( activated() !== true ){
        return false;
    }

    if( IS_DEVELOPMENT ){
        return true;
    }else if( IS_PRODUCTION ){
        return enabled === true;
    }

}


function activated(){

    return loqEnabledPkg;

}



export { permitted as default, activated };