module.exports = function() {
  return { 
  	name: '__modifiers',
  	transforms: function(doc, tag, value) {
      return value.split(' ');
    },
  };
};