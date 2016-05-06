
'use strict';


import { objectified as objectifiedLevels } from './levels';



function proxy(){ return proxy; }

Object.assign( proxy, objectifiedLevels, {

    if(){ return this; },

    limit(){},
    undo(){},

    flood(){},
    shut(){},

    event(){},

    configure(){}
});



export { proxy as default };
