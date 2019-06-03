'use strict';

var Reflux = require('reflux');
var ServiceManagementActions = require('../action/ServiceManagementActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ServiceManagementStore = Reflux.createStore({
    listenables: [ServiceManagementActions],
    filter: {},
    recordSet: [],
    object: {},
    startPage: 1,
    pageRow: 10,
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
        MsgActions.showError('user', operation, errMsg);
    },
    onCreate: function(data) {
        var $this = this, url = this.getServiceUrl('user/createSupportStaff');
        // Utils.recordCreate(this, data, url);
        Utils.doCreateService(url, data).then(
           function (result){
                if ($this.resuleReturn(result.errCode)) {
                    $this.recordSet.unshift(result.object);
                    $this.totalRow = $this.totalRow + 1;
                    $this.fireEvent('createSupportStaff', '', $this);
                } else {
                    Utils.handleServer(result.errCode);
                    $this.fireEvent('createSupportStaff', '[' + result.errCode + ']' + result.errDesc, $this);
                }
            }, function(errMsg){
                $this.fireEvent('createSupportStaff', errMsg, $this);
            });
    },
  
    onDelete: function(uuid) {
        var url = this.getServiceUrl('user/deleteSupportStaff');
        this.recordDelete(this, uuid, url);
    },
    recordDelete: function(store, uuid, url) {
        var self = store;
        var idx = Utils.findRecord(store, uuid);

        if (idx < 0) {
            self.fireEvent('deleteSupportStaff', '没有找到记录[' + uuid + ']', self);
            return;
        }
        Utils.doRemoveService(url, uuid).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet.splice(idx, 1);
                self.totalRow = self.totalRow - 1;
                self.fireEvent('deleteSupportStaff', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('deleteSupportStaff', '处理错误[' + result.errCode + '][' + result.errDesc + ']', self);
            }
        }, function(value) {
            self.fireEvent('deleteSupportStaff', Utils.getResErrMsg(value), self);
        });
    },
    onUpdate: function (data) {
        var url = this.getServiceUrl('user/updateSupportStaff');
        this.recordUpdate(this, data, url);
    },
    recordUpdate:function (store, data, url) {
        var self = store,
            idx = Utils.findRecord(store, data.uuid);
        if (idx < 0) {
            self.fireEvent('updateSupportStaff', '没有找到记录[' + data.uuid + ']', self);
            return;
        }
        if (Utils.compareTo(self.recordSet[idx], data)) {
            //console.log('数据没有变更');
            self.fireEvent('updateSupportStaff', '', self);
            return;
        }
        Utils.doUpdateService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                Utils.copyValue(data, self.recordSet[idx]);
                self.fireEvent('updateSupportStaff', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('updateSupportStaff', '[' + result.errCode + ']' + result.errDesc, self);
            }
        }, function(value) {
            self.fireEvent('updateSupportStaff', Utils.getResErrMsg(value), self);
        });
    },
    onRetrieve: function(filter, startPage, pageRow) {
        var self = this;
        var url = this.getServiceUrl('user/findSupportStaffs');
        Utils.doRetrieve(url, filter, startPage, pageRow, self.totalRow).then(function(result) {
            self.recordSet = result.list;
            self.startPage = result.startPage;
            self.pageRow = result.pageRow;
            self.totalRow = result.totalRow;
            self.filter = filter;
            self.fireEvent('findSupportStaffs', '', self);
          },
          function(errMsg) {
              self.fireEvent('findSupportStaffs', '调用服务错误', self);
          });
    },
    resuleReturn: function(errCode) {
        if (errCode === null || errCode === '' || errCode === '000000') {
            return true;
        } else {
            return false;
        }
    }
});

module.exports = ServiceManagementStore;