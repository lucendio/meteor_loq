
'use strict';



import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import loq from './../api';



Meteor.methods({

    'loq.transferEvent': function( eventName, content ){
        if( typeof eventName !== 'string' || eventName.trim().length <= 0 ){
            return;
        }

        loq.event( eventName, content );
    }

});