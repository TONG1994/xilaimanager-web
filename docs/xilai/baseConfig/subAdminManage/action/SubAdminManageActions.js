import {SubAdminManagePage} from "../SubAdminManagePage";

/**
 *   Create by Malson on 2018/4/25
 */

var Reflux = require('reflux');

var SubAdminManageActions = Reflux.createActions([
    'retrieveSubAdminManagePage',
    'createSubAdminManage',
    'updateSubAdminManage',
    'deleteSubAdminManage',
]);

module.exports = SubAdminManageActions;