var _ = require('lodash');

/**
 * @dgService lessdocFileReader
 * @description
 * This file reader will create a simple doc for each less
 * file including a code AST of the JavaScript in the file.
 */
module.exports = function lessdocFileReader(log, lessParser) {
  return {
    name: 'lessdocFileReader',
    defaultPattern: /\.less$/,
    getDocs: function(fileInfo) {

      try {
        fileInfo.ast = lessParser(fileInfo.content);
      } catch(ex) {
       ex.file = fileInfo.filePath;
        throw new Error(
          _.template('Less error in file "${file}"" [line ${lineNumber}, column ${column}]: "${description}"', ex));
      }

      return [{
        docType: 'lessFile'
      }];
    }
  };
};