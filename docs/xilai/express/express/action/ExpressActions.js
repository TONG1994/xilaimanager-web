var Reflux = require('reflux');

var ExpressActions = Reflux.createActions([
  'createProduct',
  'deleteProduct',
  'updateExpress',
  'retrieveExpress',
  'retrieveExpressPage',
  'initProduct',
]);

module.exports = ExpressActions;