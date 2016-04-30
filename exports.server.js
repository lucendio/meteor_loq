
'use strict';



import api from './server/api';
import proxy from './server/proxy';
import { activated as activated } from './server/is';



const isActivated = activated();
let loq = undefined;

if( isActivated ){
    loq = api;
}else{
    loq = proxy;
}

Object.freeze( loq );



export { loq as default };