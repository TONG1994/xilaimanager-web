/**
 *   Create by Malson on 2018/4/25
 */

var Reflux = require('reflux');

var RoleManageActions = Reflux.createActions([
  'retrieveRoleManagePage',
    'createRoleManage',
    'updateRoleManage',
    'deleteRoleManage',
    'getRoleManageByUuid'
]);

module.exports = RoleManageActions;