var glob = require( 'glob' )
  , path = require( 'path' );

glob.sync( './routes/**/*.js' ).forEach( function( file ) {
  require( path.resolve( file ) );
});
