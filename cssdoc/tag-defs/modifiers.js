module.exports = function() {
  return { 
  	name: 'modifiers',
  	transforms: function(doc, tag, value) {
      return value.split(' ');
    },
  };
};