loq
===


__NOTE:__ If you used the packages [lucendio:dlog](https://atmospherejs.com/lucendio/dlog), 
[lucendio:dlog-activated](https://atmospherejs.com/lucendio/dlog-activated) or
[lucendio:clog](https://atmospherejs.com/lucendio/clog) before, they are now deprecated. It is
 recommended to `loq` (and `loq-enabled`).
 
__Supported Meteor version: 1.3 (only with `modules` enabled)__
 


### Why?

The motivation to create such thing, was to make sure that no debugging `console.log`s 
unintentionally get called in production, and thereby leaking data to the outside and/or 
increasing its finger print of resource consumption. But without removing even just a 
single call. 


### Key features

+   isomorphic
+   no unintended data leaking
+   no need to remove debug code for production
+   mobile device support


### Quick start

Add the package(s) to your project or package

    $   meteor add lucendio:loq
    $   meteor add lucendio:loq-enabled


(optional) configure some basic needs

    import Log from 'meteor/lucendio:loq';
    
    Log.configure({
        stringify: false,
        enabledForProduction: true
    });


and then let's log some stuff

    import Log from 'meteor/lucendio:loq';

    Log.info( 'some info might be worth knowing' );
    Log.warn( { obj: 'no worry, its just a waring' } );
    Log.debug( 'alias for Log( ... )' );
    Log.error( 'shit, this is serious. what are we gonna do about it?' );


### Rules to activate output

The following rules can be seen as stages, which are build upon each other in their 
ascending order. This means, if the fist one does not apply, it doesn't matter what comes after,
it results negatively.

1.  whether the app is in development or production mode, the package `lucendio:loq-enabled`
    needs to be installed
    
2.  additionally in production `loq` needs to be configured with `enabledForProduction` set 
    to the boolean value `true` - (currently) the client has no output in production
    
3.  if the configuration `activatedLevels` is defined (as a array) it has to contain the 
    level names 



#### Good to know

+   if you like to configure some things with `.configure( things )`, you have to do it in the
    very beginning within your app code (e.g. `main.js`) and you are able to do it only once
    
+   for *on screen* logging (`mobile`, `tv`) it is not guaranteed that log-call its correlating 
    output will be in symmetric 



### API

#### .{LEVELS}( ... )

Current supported output __LEVELS__ are:
+   log     (color: none)
+   info    (color: green)
+   debug   (color: blue)
+   warn    (color: yellow)
+   error   (color: red)

Different output level for different needs (with different colors). The standard out is defined 
by environment (nodejs, browser, mobile, etc.) and based on the `console` if exists.

The *default* export of the `loq` package is also a function and therefore can be called
as an alias for `.log`, e.g.:
    
    import Log from 'meteor/lucendio:loq';
    Log( 'a simple log message' );


#### .if( scopeName ).{LEVELS}( ... )
```
    @arg {String} scopeName
```

There is a concept so called *output scopes*, which essentially is just an optional way to 
filter, group or generally restrict outputs. The scoped output only happens, if its `scopeName`
was activated (or in other words: the out put was limited to) somewhere in the code before 
triggering that output. Please see `.limit()`.



#### .limit( scopeName_s )
```
    @arg {String, Array} scopeName_s
```

Before any kind of scoped output can appear, the corresponding `scopeName` needs to be activated.
Todo so, restrict the output pipeline to certain `scopeName_s`



#### .undo( scopeName_s )
```
    @arg {undefined, String, Array} scopeName_s
```
This is the corresponding opposite function to the `.limit()` function. It removed one or more 
given scope names from the list of passing scopes. To remove all at once, omit any argument.

 

#### .flood()

The so called *flood-mode* ignores the list of active scopes and will cause the output of
all following outputs, whether they are scoped or not.



#### .shut()

This is the corresponding counterpart of `.flood()` and revokes the activated *flood-mode*
immediately.



#### .event( eventName [, content] )

The idea behind this function, is to have a centralized side-channel e.g. for tracking user 
interaction or other meta information. It works more or less like a typical *meteor method*. 
To make use out of this, please see `eventEmitting`, `events` and `eventTap` to `.configure()`.

__NOTE:__ if there is no such event called `eventName` configured on the server, the function 
will *silently* fail!

+   *@client:* it's a remote method call, which then sends it's arguments to the server and 
    calls its counterpart

+   *@server:* depending on the event configuration, it either `check`s the content for the
    configured schema and if it matches, the `eventTap` handler gets called with the original 
    arguments, or if it si function configured, it simply gets called with the given arguments



#### .monitor( ... )

Similar to `.event()` this function is the one place to handle monitoring data (e.g. 
environment measurements like memory usage) to process them locally or maybe send 
them out. It is just a proxy function for the `monitorTap`.
 
+   *@client:* not available

+   *@server:* if configured, it just calls the `monitorTap` function with all given arguments



#### .configure( configurations )

+   `levels: [ String ]`
    -   *@client:* available
    -   *@server:* available
    -   enables output only for listed *LEVELS*

+   `stringify: Boolean`
    -   *@client:* available
    -   *@server:* available
    -   converts all output data to a *String* (with `JSON.stringify`)
    
+   `hideDelay: Number`
    -   *@client:* available
    -   *@server:* available, but has no impact
    -   defines the amount of time (in *ms*) between on-screen output and disappearing

+   `enableForProduction: Boolean`
    -   *@client:* not available
    -   *@server:* available
    -   needs to be set to true, if the output should appear in production environments. 
        It only does apply to *LEVEL* outputs and does not effect *events* or *monitoring*
        (default: `false`)

+   `eventEmitting: Boolean`
    -   *@client:* available
    -   *@server:* available
    -   enable or disable event emitting (default: `false`)

+   `events: { eventId: MatchPattern || Function, ... }`
    -   *@client:* not available
    -   *@server:* available
    -   `eventId`: String, unique identifier
    -   `matchPattern`: any supported match pattern of meteor's `check` packages
    -   `Function`: overwrites `eventTap` for this event; NOTE: content checking is your
        responsibility

+   `eventTap: Function`
    -   *@client:* not available
    -   *@server:* available
    -   default handler for events

+   `monitorTap: Function`
    -   *@client:* not available
    -   *@server:* available
    -   handler for calling `.monitor()`

+   `monitoring: Boolean`
    -   *@client:* not available
    -   *@server:* available
    -   enables or disables monitoring handling (default: `false`)    
    
+   `mimic: 'desktop', 'mobile', 'tv'`
    -   *@client:* available
    -   *@server:* available, but has no impact
    -   overwrites environment detection by one of the possible categories


### Future work

+   add automated testing
+   propagate `enableForProduction` server-side defined flag down to the client with remote method,
    to enable output on the client in production 
+   connect server's and client's filter pool w/ remote methods, to create a greater debug 
    experience
+   convenient API for levels (number synonym w/ >, <, = )
+   sort of regex/wildcard -ing scopes



### License

[FVUS](./LICENSE.md)
