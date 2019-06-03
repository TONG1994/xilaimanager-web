var Reflux = require('reflux');

var ExpressActions = Reflux.createActions([
  'retrieveBusinessWatch',
  'retrieveNum',
  'retrieveAmount',
  'getOrg',
  'retrieveTable'
]);

module.exports = ExpressActions;