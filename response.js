var pj = require('./package.json');

var speak = {
  'name': pj.name,
  'version': pj.version
};

var forbidden = '403 Forbidden';

module.exports = {
  speak: speak,
  forbidden: forbidden
};
