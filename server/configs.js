
'use strict';



import configs from './../shared/configs';



const serverConfigs = {
    enabled: null,
    monitoringEnabled: false,

    events: new Map(),

    eventTap: undefined,
    monitorTap: undefined
};


Object.assign( configs, serverConfigs );



export { configs as default };
