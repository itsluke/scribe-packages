/**
 * @dgService scribeFileReader
 * @description
 * This file reader will pull the contents from a text file (by default .scribe)
 *
 * The doc will initially have the form:
 * ```
 * {
 *   content: 'the content of the file',
 *   startingLine: 1
 * }
 * ```
 */
module.exports = function scribeFileReader() {
  return {
    name: 'scribeFileReader',
    defaultPattern: /\.scribe$/,
    getDocs: function(fileInfo) {
      // We return a single element array because scribe files only contain one document
      return [{
        content: fileInfo.content,
        startingLine: 1
      }];
    }
  };
};