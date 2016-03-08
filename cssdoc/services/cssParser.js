var cssParserImpl = require('css');

module.exports = function cssParser( log ) {
	return function ( code, sourcePath) {
		log.info( 'parsing CSS:', sourcePath);
		return cssParserImpl.parse( code, {
			// Makes errors and source maps more helpful, by letting them know where code comes from.
			source: sourcePath,

			// silently fail on parse errors.
			silent: false
		}).stylesheet
	}
}