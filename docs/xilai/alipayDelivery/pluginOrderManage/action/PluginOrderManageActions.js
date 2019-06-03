var Reflux = require('reflux');

var PluginOrderManageActions = Reflux.createActions([
  'createPluginOrderManage',
  'cancelPluginOrderManage',
  'updatePluginOrderManage',
  'retrievePluginOrderManage',
  'retrievePluginOrderManagePage',
  'initPluginOrderManage',
  // 'getCacheData',
  // 'getPluginOrderManageDetail',
  // 'searchSitesByFilter',
  // 'retrieveStatus'
]);

module.exports = PluginOrderManageActions;