/**
 *   Create by Malson on 2018/4/25
 */
var Reflux = require('reflux');
var DiscountManageActions = require('../action/DiscountManageActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');
var DiscountManageStore = Reflux.createStore({
    listenables: [DiscountManageActions],
    filter: '',
    recordSet: [],
    startPage: 0,
    pageRow: 0,
    totalRow: 0,
    init: function () {
    },
    getServiceUrl: function (action) {
        return Utils.xilaimanagerUrl + action;
    },
    fireEvent: function (operation, errMsg, self) {
        self.trigger({
            filter: self.filter,
            recordSet: self.recordSet,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });
        MsgActions.showError('discountManage', operation, errMsg);
    },
    // 根据过滤条件查询优惠卷信息
    onRetrieveDiscountManage: function (filter, startPage, pageRow) {
        var self = this;
        // var url = this.getServiceUrl('marketCampaign/retrieveOrgBaseInfo');
        let url = "http://10.10.10.201:1504/marketing_s/value_voucher/searchVoucherList";
        Utils.doRetrieveService(url, filter, startPage, pageRow, self.totalRow).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.filter = filter;
                self.fireEvent('searchVoucherList', '', self);
            }
            else {
                Utils.handleServer(result.errCode);
                self.fireEvent('searchVoucherList', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        }, function (value) {
            self.fireEvent('searchVoucherList', '调用服务错误', self);
        });
    },

    //新建优惠卷
    onCreateDiscountManage: function (filter) {
        let self = this;
        let url =  "http://10.10.10.201:1504/marketing_s/value_voucher/create";
        Utils.doCreateService(url, filter).then((result) => {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object;
                self.filter = filter;
                self.fireEvent('create', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('create', '[' + result.errCode + ']处理错误，' + result.errDesc , self);
            }
        }, (value) => {
            self.fireEvent('create', '调用服务错误', self);
        });
    },



});
module.exports = DiscountManageStore;
