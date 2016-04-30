
'use strict';



import api from './client/api';
import proxy from './client/proxy';
import { activated as activated } from './client/is';



const isActivated = activated();
let loq = undefined;

if( isActivated ){
    loq = api;
}else{
    loq = proxy;
}

Object.freeze( loq );



export { loq as default };