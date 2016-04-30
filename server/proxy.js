
'use strict';


import proxy from './../shared/proxy';



const serverProxy = {

    monitor(){}

};


Object.assign( proxy, serverProxy );



export { proxy as default };