/**
 *   Create by Malson on 2018/4/25
 */

var Reflux = require('reflux');

var AddressActions = Reflux.createActions([
  'retrieveTripleOrganizationPage',
  'queryLogisticsCompanys',
  'queryLogisticsCompanysRetrieve',
  'searchSitesByFilter',
  'searchSitesByFilter1',
  'getNeedParams',
  'create',
  'updateActive',
  'getUpdateNeedParams',
  'update',
  'check',
]);

module.exports = AddressActions;