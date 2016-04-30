
'use strict';


import { objectified as objectifiedLevels } from './levels';



function proxy(){ return proxy; }

Object.assign( proxy, objectifiedLevels, {

    limit(){},
    if(){ return this; },

    flood(){},
    shut(){},

    event(){},

    configure(){}
});



export { proxy as default };
