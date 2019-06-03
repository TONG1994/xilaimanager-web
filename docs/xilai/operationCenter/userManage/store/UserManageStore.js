/**
 *   Create by Malson on 2018/4/25
 */
var Reflux = require('reflux');
var UserManageActions = require('../action/UserManageActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');
var UserManageStore = Reflux.createStore({
    listenables: [UserManageActions],
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
        MsgActions.showError('userManage', operation, errMsg);
    },


    onRetrieveUserManage: function(filter, startPage, pageRow) {
        var self = this;
        var url = this.getServiceUrl('user/getMember');
        // let url = "http://10.10.10.201:1882/baomimanager_s/details/retrieve";
        Utils.doRetrieveService(url,filter, startPage, pageRow, self.totalRow).then(function(result) {
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    self.recordSet = result.object.list;
                    self.startPage = result.object.startPage;
                    self.pageRow = result.object.pageRow;
                    self.totalRow = result.object.totalRow;
                    self.filter = filter;
                    self.fireEvent('getMember', '', self);
                } else {
                    Utils.handleServer(result.errCode);
                    self.fireEvent('getMember', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
                }
            },
            function(errMsg){
                self.fireEvent('getMember', '调用服务错误', self);
            });
    },


});
module.exports = UserManageStore;
