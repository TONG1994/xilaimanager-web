'use strict';

var Reflux = require('reflux');
var StoreInfoActions = require('../action/StoreInfoActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var StoreInfoStore = Reflux.createStore({
    listenables: [StoreInfoActions],
    filter: {},
    recordSet: [],
    object: {},
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.baomimanagerUrl+action;
    },
    fireEvent: function(operation, errMsg, self)
    {
        self.trigger({
            filter: self.filter,
            recordSet: self.recordSet,
            object: self.object,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('storeInfo', operation, errMsg);
    },

    // 根据过滤条件查询门店信息
    onRetrieveStoreInfo: function(filter, startPage, pageRow) {
        var self = this;
        var url = this.getServiceUrl('details/retrieve');
        // let url = "http://10.10.10.201:1882/baomimanager_s/details/retrieve";
        Utils.doRetrieveService(url,filter, startPage, pageRow, self.totalRow).then(function(result) {
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    self.recordSet = result.object.list;
                    self.startPage = result.object.startPage;
                    self.pageRow = result.object.pageRow;
                    self.totalRow = result.object.totalRow;
                    self.filter = filter;
                    self.fireEvent('retrieve', '', self);
                } else {
                    Utils.handleServer(result.errCode);
                    self.fireEvent('retrieve', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
                }
            },
            function(errMsg){
                self.fireEvent('retrieve', '调用服务错误', self);
            });
    },

    // 根据UUID查询门店信息
    onGetStoreInfoDetail: function(filter) {
        var self = this;
        var url = this.getServiceUrl('details/findByorgUuid');
        // let url = "http://10.10.10.201:1882/baomimanager_s/details/findByorgUuid";
        Utils.doGetRecord(url, filter).then(function(result) {
            self.object = result;
            self.fireEvent('findByorgUuid', '', self);
        }, function(value) {
            self.fireEvent('findByorgUuid', '调用服务错误', self);
        });
    },

    //更新门店信息
    onUpdateStoreInfo: function (filter) {
        let self = this;
        let url = this.getServiceUrl('details/updateDetails ');
        // let url = "http://10.10.10.201:1882/baomimanager_s/details/updateDetails";
        // var filter = this.filterData(data);
        Utils.doCreateService(url, filter).then((result) => {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object;
                self.filter = filter;
                self.fireEvent('updateDetails', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('updateDetails', '[' + result.errCode + ']处理错误，' + result.errDesc , self);
            }
        }, (value) => {
            self.fireEvent('updateDetails', '调用服务错误', self);
        });
    },


});

module.exports = StoreInfoStore;