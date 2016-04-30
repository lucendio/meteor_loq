
'use strict';



import configs from './../shared/configs';



const clientConfigs = {
    mimickedDevice: null,
    showtime: 10000
};

Object.assign( configs, clientConfigs );



export { configs as default };
