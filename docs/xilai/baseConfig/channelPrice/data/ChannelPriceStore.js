'use strict';

var Reflux = require('reflux');
var channelPriceActions = require('../action/ChannelPriceActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var channelPriceStore = Reflux.createStore({
    listenables: [channelPriceActions],

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

        MsgActions.showError('channel_price', operation, errMsg);
    },

    // 根据过滤条件查询渠道价格信息
    onRetrievechannelPrice: function(filter, startPage, pageRow) {
        var self = this;
        var url = this.getServiceUrl('channel_price/retrieveByFilter');
        Utils.doRetrieveService(url,filter, startPage, pageRow, self.totalRow).then(function(result) {
              if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var arr = result.object.list;
                arr.map(function(item,index){
                  item.uuid = index;
                });
                self.recordSet = arr;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.filter = filter;
                self.fireEvent('retrieveByFilter', '', self);
              } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('retrieveByFilter', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
              }
            },
            function(errMsg){
                self.fireEvent('retrieveByFilter', '调用服务错误', self);
            });
    },

    // 根据过滤条件查询渠道价格信息
    onInitchannelPrice: function(filter) {
        if( this.recordSet.length > 0 ){
            if( Utils.compareTo(this.filter, filter) ){
                this.fireEvent('retrieve', '', this);
                return;
            }
        }

        this.onRetrievechannelPrice(filter);
    },
    //获取地址
    onGetAddress: function(organization) {
        var url = this.getServiceUrl('provinceCityRegion/getAllProvinceCityRegion');

        var self = this;
        Utils.doCreate(url, organization).then(function (result) {
            // 修改下面的程序
            self.recordSet = [];
            self.recordSet.push(result);
            self.fireEvent('getAddress', '', self);
        }, function(errMsg){
            self.fireEvent('getAddress', errMsg, self);
        });
    },
});

module.exports = channelPriceStore;