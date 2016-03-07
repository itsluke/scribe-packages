var cssParserImpl = require('css');

module.exports = function cssParser() {
	return function ( code ) {
		return cssParserImpl.parse( code, {
			// Makes errors and source maps more helpful, by letting them know where code comes from.
			// source: './path/to/css',

			// silently fail on parse errors.
			silent: false
		})
	}
}