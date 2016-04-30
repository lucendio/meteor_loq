
'use strict';



import levels from './levels';



const iterableLevels = Array.from( levels.keys() ).map( elem => [ elem ] );


const configs = {
    outputAll: false,


    eventEmittingEnabled: false,
    stringifyOutput: false,

    activatedLevels: new Map( iterableLevels )
};



export { configs as default };
