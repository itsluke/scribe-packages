module.exports = function(extractTypeTransform, extractNameTransform, wholeTagTransform) {
  return {
    name: 'css',
    transforms: [ extractNameTransform, wholeTagTransform ]
  };
};