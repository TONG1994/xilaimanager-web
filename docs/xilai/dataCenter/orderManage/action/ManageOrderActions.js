var Reflux = require('reflux');

var ManageOrderActions = Reflux.createActions([
  'createManageOrder',
  'deleteManageOrder',
  'updateManageOrder',
  'retrieveManageOrder',
  'retrieveManageOrderPage',
  'initManageOrder',
  'getCacheData',
  'getManageOrderDetail',
  'searchSitesByFilter',
  'retrieveStatus'
]);

module.exports = ManageOrderActions;