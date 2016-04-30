'use strict';



import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import './loq_message.html';



const template = Template[ 'loq_message' ];



template.helpers( {} );


template.events({
    'click': function( e, template ){
        e.stopPropagation();

        const ctx = this;

        Blaze.remove( template.view );
    }
});




template.onCreated( function(){
    let instance = this;


} );


template.onRendered( function(){
    let instance = this;


} );


template.onDestroyed( function(){
    let instance = this;


} );