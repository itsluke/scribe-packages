var _ = require('lodash');
var traverse = require('estraverse').traverse;
var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

/**
 * @dgProcessor extractCSSDocCommentsProcessor
 * @description
 * This processor will create an doc for each cssdoc style comment in each cssFile
 * doc in the docs collection.
 *
 * It will optionaly remove those cssFile docs from the collection by setting the
 * `removeCssFileDocs` property.
 *
 * The doc will initially have the form:
 * ```
 * {
 *   fileInfo: { ... },
 *   content: 'the content of the comment',
 *   startingLine: xxx,
 *   endingLine: xxx,
 *   codeNode: someASTNode
 *   codeAncestors: arrayOfASTNodes
 * }
 * ```
 */
module.exports = function extractCSSDocCommentsProcessor() {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['parsing-tags'],
    $validate: {
      removeCssFileDocs: { presence: true }
    },
    removeCssFileDocs: true,
    $process: function(docs) {

      var commentDocs = [];
      var processor = this;

      // Extract all the `cssFile` docs from the docs collection
      docs = _.filter(docs, function(doc) {

        if ( doc.docType !== 'cssFile' ) {
          return true;
        }

        // Generate a doc for each cssdoc style comment
        _.forEach(doc.fileInfo.ast.comments, function(comment) {

          // To test for a cssdoc comment (i.e. starting with /** ), we need to check for a
          // star in the first character since the parser strips off the "/*" comment identifier
          if ( comment.type === 'Block' && comment.value.charAt(0) === '*' ) {
            // Strip off any leading stars and
            // trim off leading and trailing whitespace
            var text = comment.value.replace(LEADING_STAR, '').trim();

            // Extract the information about the code directly after this comment
            var codeLocation = findNodeAfter(doc.fileInfo.ast, comment.range[1]);

            // Create a doc from this comment
            commentDocs.push({
              fileInfo: doc.fileInfo,
              startingLine: comment.loc.start.line,
              endingLine: comment.loc.end.line,
              content: text,
              codeNode: codeLocation.node,
              codeAncestors: codeLocation.path,
              docType: 'css'
            });
          }
        });
        return !processor.removeCssFileDocs;
      });

      // Add the new comment docs to the docs collection
      return docs.concat(commentDocs);
    }
  };
};

function findNodeAfter(ast, pos) {
  var found, path;
  traverse(ast, {
    enter: function(node) {
      if ( node.range[1] > pos && node.range[0] >= pos ) {
        if ( !found || found.range[0] >= node.range[0] ) {
          found = node;
          path = this.parents();
          this.skip();
        }
      }
    }
  });
  return { node: found, path: path };
}