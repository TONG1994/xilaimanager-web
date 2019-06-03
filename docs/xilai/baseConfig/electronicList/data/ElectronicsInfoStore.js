'use strict';

var Reflux = require('reflux');
var ElectronicsInfoActions = require('../action/ElectronicsInfoActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ElectronicsInfoStore = Reflux.createStore({
    listenables: [ElectronicsInfoActions],

    filter: {},
    recordSet: [],
    object: {},
    startPage: 0,
    pageRow: 0,
    totalRow: 0,

    init: function() {},
    getServiceUrl: function(action) {
        return Utils.xilaimanagerUrl + action;
    },
    fireEvent: function(operation, errMsg, self) {
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

        MsgActions.showError('electronics_form', operation, errMsg);
    },
    getBeforeData: function(data) {
        var beforeData = [
            // { prop: 'logisticsCompanyId', label: '快递公司', value: data.logisticsCompanyId },
            // { prop: 'logisticsCompanyUuid', label: '快递公司', value: data.logisticsCompanyUuid },
            { prop: 'alias1', label: '快递公司', value: data.logisticsCompanyName },
            { prop: 'networkAddressId', label: '服务站ID', value: data.networkAddressId },
            { prop: 'secretKey', label: '密钥', value: data.secretKey },
        ];
        return beforeData;
    },
    // 增加
    onCreateElectronicsInfo: function(data) {
        var url = this.getServiceUrl('electronics_form/create');
        var electronicsForm = Utils.deepCopyValue(data);
        electronicsForm.beforeData = this.getBeforeData(data);
        electronicsForm.alias1 = data.logisticsCompanyName;
        Utils.recordCreate(this, electronicsForm, url);
    },

    // 修改
    onUpdateElectronicsInfo: function(newValue, oldValue) {
        var electronicsForm = Utils.deepCopyValue(newValue);
        electronicsForm.beforeData = this.getBeforeData(oldValue);
        electronicsForm.alias1 = newValue.logisticsCompanyName;
        var url = this.getServiceUrl('electronics_form/update');
        Utils.recordUpdate(this, electronicsForm, url);
    },

    // 删除
    onDeleteElectronicsInfo: function(data) {
        var electronicsForm = Utils.deepCopyValue(data);
        electronicsForm.uuid = data.uuid;
        electronicsForm.beforeData = this.getBeforeData(data);
        var url = this.getServiceUrl('electronics_form/remove');
        Utils.recordDeleteUsedForLog(this, electronicsForm, url);
    },

    // 查询全部
    onGetElectronicsInfo: function(filter, startPage, pageRow) {
        var self = this;
        var url = this.getServiceUrl('electronics_form/select');
        Utils.doRetrieve(url, filter, startPage, pageRow, self.totalRow).then(function(result) {
            // self.object = result;
            self.recordSet = result.list;
            self.startPage = result.startPage;
            self.pageRow = result.pageRow;
            self.totalRow = result.totalRow;
            self.filter = filter;
            self.fireEvent('select', '', self);
        }, function(errMsg) {
            self.fireEvent('select', '调用服务错误', self);
        });
    }
});

module.exports = ElectronicsInfoStore;