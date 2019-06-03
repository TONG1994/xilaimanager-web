/**
 *   Create by Malson on 2018/4/25
 */

var Reflux = require('reflux');

var DiscountManageActions = Reflux.createActions([
    'retrieveDiscountManage',
    'getDiscountManageDetail',
    'createDiscountManage'
]);

module.exports = DiscountManageActions;