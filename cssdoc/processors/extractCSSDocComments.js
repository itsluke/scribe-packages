var _ = require('lodash');
var traverse = require('gonzales-ast').traverse;
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
module.exports = function extractCSSDocCommentsProcessor( log ) {
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
        _.forEach(doc.fileInfo.ast.rules, function(rule) {

          // To test for a cssdoc comment (i.e. starting with /** ), we need to check for a
          // star in the first character since the parser strips off the "/*" comment identifier
          if ( rule.type === 'comment' && rule.comment.charAt(0) === '*' ) {
            // Strip off any leading stars and
            // trim off leading and trailing whitespace
            var text = rule.comment.replace(LEADING_STAR, '').trim();

            // Extract the information about the code directly after this comment

            // var codeLocation = findNodeAfter(doc.fileInfo.ast.rules, rule);
            // log.silly( '>>>>>>');
            // log.info( 'codeLocation', codeLocation )

            // Create a doc from this comment
            commentDocs.push({
              fileInfo: doc.fileInfo,
              startingLine: rule.position.start.line,
              endingLine: rule.position.end.line,
              content: text,
              // codeNode: codeLocation.node,
              // codeAncestors: codeLocation.path,
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