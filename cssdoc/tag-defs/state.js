module.exports = function(extractTypeTransform, extractNameTransform, wholeTagTransform) {
  return {
    name: 'state',
    multi: true,
    docProperty: 'states',
    transforms: [ extractNameTransform, wholeTagTransform ]
  };
};