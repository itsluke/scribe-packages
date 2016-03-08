var _ = require('lodash');

var COMMENT_START = /^\s*\/\*\*/,
  COMMENT_END = /^\s*\*\//;

/**
 * @dgService lessdocFileReader
 * @description
 * This file reader will create a simple doc for each less
 * file including a code AST of the LESS in the file.
 * It doesn't parse tags inside comments.
 */

module.exports = function lessdocFileReader(log) {
  return {
    name: 'lessdocFileReader',
    defaultPattern: /\.less$/,
    getDocs: function(fileInfo) {
      var isComment = false;
      var commentLines = String(fileInfo.content)
        .trim()
        .replace(/\r\n|\r|\n *\n/g, '\n')
        .split('\n');

      /**
       * Reduce lines to comment blocks
       */
      fileInfo.comments = _.reduce(commentLines, function (commentBlocks, commentLine) {
        if (COMMENT_START.test(commentLine)) {
          isComment = true;
          commentBlocks.push(['*']);
          return commentBlocks;
        }
        if (isComment) {
          if (COMMENT_END.test(commentLine)) {
            commentBlocks[commentBlocks.length - 1].push('*');
            isComment = false;
          } else {
            commentBlocks[commentBlocks.length - 1].push(commentLine);
          }
        }
        return commentBlocks;
      }, []).map(function (block) {
        return {
          type: 'Block',
          value: block.join('\n')
        };
      });

      return [{
        docType: 'lessFile'
      }];
    }
  };
};
