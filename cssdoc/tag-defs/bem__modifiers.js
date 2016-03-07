module.exports = function() {
  return { 
  	name: 'bem__modifiers',
  	transforms: function(doc, tag, value) {
      return value.split(' ');
    },
  };
};