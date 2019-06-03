'use strict';

var Reflux = require('reflux');
var DeliveryActions = require('../action/DeliveryActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var DeliveryStore = Reflux.createStore({
    listenables: [DeliveryActions],
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
        return Utils.xilaimanagerUrl+action;
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

        MsgActions.showError('order', operation, errMsg);
    },

    // 根据过滤条件查询渠道价格信息
    onRetrieveDelivery: function(filter, startPage, pageRow) {
        var self = this;
        var url = this.getServiceUrl('order/managementGetOrders');
        Utils.doRetrieveService(url,filter, startPage, pageRow, self.totalRow).then(function(result) {
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    self.recordSet = result.object.list;
                    self.startPage = result.object.startPage;
                    self.pageRow = result.object.pageRow;
                    self.totalRow = result.object.totalRow;
                    self.filter = filter;
                    self.fireEvent('managementGetOrders', '', self);
                } else {
                    Utils.handleServer(result.errCode);
                    self.fireEvent('managementGetOrders', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
                }
            },
            function(errMsg){
                self.fireEvent('managementGetOrders', '调用服务错误', self);
            });
    },

    onInitDelivery: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        // FIXME 翻页
        this.startPage = 1;
        this.pageRow = 10;
        this.onRetrieveDelivery(filter);
    },

    onSearchSitesByFilter: function (filter) {
        var  self = this;
        var  url =this.getServiceUrl('order/organizationName');
        Utils.doGetRecord(url, filter).then(function (result) {
            self.object = result;
            self.fireEvent('get', '', self);
        }, function (value) {
            self.fireEvent('get', errMsg, self);
        });
    },
    onGetCompany: function(filter) {
        var self = this;
        var url = this.getServiceUrl('order/searchLogisticsCompany');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.filter = filter;
                self.recordSet=result.object;
                self.fireEvent('searchLogisticsCompany', '', self);
            }
            else{
                self.fireEvent('searchLogisticsCompany', '['+result.errCode+']处理错误，'+result.errDesc, self);
            }
        }, function(value){
            self.fireEvent('searchLogisticsCompany', '调用服务错误', self);
        });
    },
});

module.exports = DeliveryStore;