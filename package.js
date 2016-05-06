
Package.describe({
    name: 'lucendio:loq',
    summary: 'isomorphic logging, that prevents untended data leaking without code changes',
    version: '0.0.1',
    git: 'https://github.com/lucendio/meteor_loq',
    documentation: 'README.md'
});




Package.onUse( function( api ){

    api.versionsFrom( 'METEOR@1.3' );


    Npm.depends({
        'cli-color': '1.1.0',
        sniffr: '1.1.4'
    });


    api.use([
        'ecmascript',
        'modules',
        'es5-shim',
        'promise',

        'meteor',
        'check',
        'ddp'

    ], ['server', 'client']); //shared

    api.use( [
        'lucendio:loq-enabled'
    ], [ 'server', 'client' ], { weak: true } ); //shared

    api.use([
        'blaze-html-templates'
    ], [ 'client' ] );


    api.addFiles([
        'client/templates/loq_onscreen.css',
        'client/templates/loq_message.css'
    ], [ 'client' ] );


    api.mainModule( 'exports.server.js', 'server' );
    api.mainModule( 'exports.client.js', 'client' );

//    api.export( 'loq', [ 'server', 'client' ] );

});




Package.onTest(function (api) {

});