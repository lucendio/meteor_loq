
'use strict';



import { Meteor } from 'meteor/meteor';
import Sniffr from 'sniffr';



const IS_SERVER = Meteor.isServer;
const IS_CLIENT = Meteor.isClient;

const TV_REGEX = /googletv|smarttv|smart-tv|internet.tv|netcast|nettv|appletv|boxee|kylo|roku|dlnadoc|roku|pov_tv|hbbtv|ce\-html/;


// @value   {String}    'server', 'desktop', 'mobile', 'tv', 'unknown'
const platform = (function(){

    if( IS_SERVER ){
        return 'server';
    }else if( IS_CLIENT ){

        const platform = new Sniffr();
        platform.sniff();
        const { userAgent } = window.navigator;
        const {
            browser: { name: browser } = {},
            os: { name: os } = {},
            device: { name: device } = {}
        } = platform;

        // NOTE: all three variables defaulting to 'Unknown'


        switch( os ){

            case 'windows':
            case 'macos':
            case 'linux':
            case 'openbsd': {
                return 'desktop';
            }

            case 'android':
            case 'ios':
            case 'windows.phone':
            case 'windows.mobile':
            case 'blackberryos':
            case 'firefoxos': {
                return 'mobile';
            }

            default: {
                if( TV_REGEX.test( userAgent ) ){
                    return 'tv';
                }
            }

        }

        return 'unknown';
    }

}());



export { platform as default };