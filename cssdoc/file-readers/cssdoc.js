var _ = require('lodash');

/**
 * @dgService cssdocFileReader
 * @description
 * This file reader will create a simple doc for each css
 * file including a code AST of the JavaScript in the file.
 */
module.exports = function cssdocFileReader(log, cssParser) {
  return {
    name: 'cssdocFileReader',
    defaultPattern: /\.css$/,
    getDocs: function(fileInfo) {
      // log.info( 'fileInfo:', fileInfo )
      // log.info( 'fileInfo filePath:', fileInfo.filePath )
      try {
        fileInfo.ast = cssParser(fileInfo.content, fileInfo.relativePath );
      } catch(ex) {
       ex.file = fileInfo.filePath;
        throw new Error(
          _.template('CSS error in file "${file}"" [line ${lineNumber}, column ${column}]: "${description}"', ex));
      }

      return [{
        docType: 'cssFile'
      }];
    }
  };
};