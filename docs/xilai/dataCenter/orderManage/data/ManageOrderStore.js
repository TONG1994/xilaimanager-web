var Reflux = require('reflux');
var ManageOrderActions = require('../action/ManageOrderActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');
import {Modal} from 'antd';
var ManageOrderStore = Reflux.createStore({
  listenables: [ManageOrderActions],

  filter: {},
  recordSet: [],
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
      orderDetail:self.orderDetail,
      recordSet: self.recordSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg
    });

    MsgActions.showError('manageOrder', operation, errMsg);
  },
  onGetCacheData: function() {
    this.fireEvent('cache', '', this);
  },

  onRetrieveManageOrder: function(filter) {
    var self = this;
    var url = this.getServiceUrl('manageOrder/queryBySearchFilter');
    self.totalRow = self.startPage==1?0:self.totalRow;
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.recordSet = result.object.list;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;
        self.fireEvent('queryBySearchFilter', '', self);
      }
      else{
        Utils.handleServer(result.errCode);
        self.fireEvent('queryBySearchFilter', "["+result.errCode+"]处理错误，"+result.errDesc, self);
      }
    }, function(value){
      self.fireEvent('queryBySearchFilter', "调用服务错误", self);
    });
  },

  onRetrieveManageOrderPage: function(filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveManageOrder( filter );
  },

  onInitManageOrder: function(filter) {
    if( this.recordSet.length > 0 ){
      if( Utils.compareTo(this.filter, filter) ){
        this.fireEvent('retrieve', '', this);
        return;
      }
    }

    // FIXME 翻页
    this.startPage = 1;
    this.pageRow = 10;
    this.onRetrieveManageOrder(filter);
  },

  onGetManageOrderDetail: function(filter) {
    let self=this;
    var url = this.getServiceUrl('manageOrder/queryOrderDetail');
    Utils.doGetRecordService(url, filter,).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.filter = filter;
        self.orderDetail=result.object;
        self.fireEvent('queryOrderDetail', '', self);
      }
      else{
        Utils.handleServer(result.errCode);
        self.fireEvent('queryOrderDetail', "["+result.errCode+"]处理错误，"+result.errDesc, self);
      }
    }, function(value){
      self.fireEvent('queryOrderDetail', "调用服务错误", self);
    });
  },
    onSearchSitesByFilter: function (filter) {
        var  self = this;
        var  url =this.getServiceUrl('order/organizationName');
        Utils.doGetRecord(url, filter).then(function (result) {
            self.recordSet = result;
            self.fireEvent('get', '', self);
        }, function (value) {
            self.fireEvent('get', errMsg, self);
        });
    },
    onUpdateManageOrder:function(ManageOrder){
        var ManageOrder = Utils.deepCopyValue(ManageOrder);
        var url = this.getServiceUrl('sender/updataOrder');
        this.recordUpdate(this, ManageOrder, url);
    },
    onDeleteManageOrder:function(ManageOrder){
        var ManageOrder = Utils.deepCopyValue(ManageOrder);
        var url = this.getServiceUrl('sender/adminCancelOrder');
        this.recordDelete(this, ManageOrder, url);
    },
    recordDelete(store, data, url, syncRecord) {
        var util = Utils,
            self = store,
            idx = util.findRecord(store, data.uuid);
        if (idx < 0) {
            self.fireEvent('remove', '没有找到记录[' + data.uuid + ']', self);
            return;
        }
        if (util.compareTo(self.recordSet[idx], data)) {
            //console.log('数据没有变更');
            self.fireEvent('remove', '', self);
            return;
        }
        util.doUpdateService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                util.copyValue(result.object, self.recordSet[idx]);
                self.fireEvent('remove', '', self);
            } else {
                if(result.errCode == '10002'){
                    Modal.warning({
                        title: '提示',
                        content: '订单状态异常，请重新刷新页面',
                        okText: '确认',
                    });
                }
                Utils.handleServer(result.errCode);
                self.fireEvent('remove', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        }, function(value) {
            self.fireEvent('remove', util.getResErrMsg(value), self);
        });
    },
    recordUpdate(store, data, url, syncRecord) {
        var util = Utils,
            self = store,
            idx = util.findRecord(store, data.uuid);
        if (idx < 0) {
            self.fireEvent('update', '没有找到记录[' + data.uuid + ']', self);
            return;
        }
        if (util.compareTo(self.recordSet[idx], data)) {
            //console.log('数据没有变更');
            self.fireEvent('update', '', self);
            return;
        }
        util.doUpdateService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                util.copyValue(data, self.recordSet[idx]);
                self.fireEvent('update', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('update', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        }, function(value) {
            self.fireEvent('update', util.getResErrMsg(value), self);
        });
    },
    onRetrieveStatus: function(filter) {
        let self=this;
        var url = this.getServiceUrl('sender/threeStateOrder');
        var util = Utils,
            idx = util.findRecord(self, filter);
        Utils.doGetRecordService(url, filter,).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet[idx].threeStatus = result.object;
                self.fireEvent('queryStatus', '', self);
            }
            else{
                self.fireEvent('queryStatus', "["+result.errCode+"]处理错误，"+result.errDesc, self);
            }
        }, function(value){
            self.fireEvent('queryStatus', "调用服务错误", self);
        });
    },
});

module.exports = ManageOrderStore;