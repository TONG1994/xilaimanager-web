var Reflux = require('reflux');
var TBillActions = require('../action/ManageBillActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var TBillStore = Reflux.createStore({
  listenables: [TBillActions],

  filter: '',
  recordSet: [],
  startPage : 0,
  pageRow : 0,
  totalRow : 0,
  billStartPage:0,
  billPageRow:0,
  billTotalRow:0,

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
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg,
	  billDetail:self.billDetail
    });

    MsgActions.showError('manageBill', operation, errMsg);
  },

  onRetrieveTBill: function(filter) {
    var self = this;

    var url = this.getServiceUrl('manageBill/queryBillList');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.recordSet = result.object.list;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;

        self.fireEvent('queryBillList', '', self);
      }
      else{
        Utils.handleServer(result.errCode);
        self.fireEvent('queryBillList', "["+result.errCode+"]处理错误，"+result.errDesc, self);
      }
    }, function(value){
      self.fireEvent('queryBillList', "调用服务错误", self);
    });
  },

  onRetrieveTBillPage: function(filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveTBill( filter );
  },

  onInitTBill: function(filter) {
    if( this.recordSet.length > 0 ){
      if( this.filter === filter ){
        this.fireEvent('retrieve', '', this);
        return;
      }
    }

    // FIXME 翻页
    // this.startPage = 1;
    // this.pageRow = 10;
    this.onRetrieveTBill(filter);
  },
  onGetBillDetail:function(filter){
    var self = this;
    var url = this.getServiceUrl('manageBill/queryBillDetailList');
    Utils.doRetrieveService(url, filter, self.billStartPage, self.billPageRow, self.billTotalRow).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){

        self.billDetail=result.object;
        self.filter = filter;

        self.fireEvent('retrieve', '', self);
      }
      else{
        Utils.handleServer(result.errCode);
        self.fireEvent('retrieve', "["+result.errCode+"]处理错误，"+result.errDesc, self);
      }
    }, function(value){
      self.fireEvent('retrieve', "调用服务错误", self);
    });
  },
  onGetBillDetailPage:function(filter, startPage, pageRow) {
    this.billStartPage = startPage;
    this.billPageRow = pageRow;
    this.onGetBillDetail( filter );
  },

  onCreateTBill: function(tBill) {
    var url = this.getServiceUrl('t_bill/createBill');
    Utils.recordCreate(this, tBill, url);
  },

  onUpdateTBill: function(tBill) {
    var url = this.getServiceUrl('t_bill/queryBillDetailList');
    Utils.recordUpdate(this, tBill, url);
  },

  onDeleteTBill: function(uuid) {
    var url = this.getServiceUrl('t_bill/createBill');
    Utils.recordDelete(this, uuid, url);
  }
});

module.exports = TBillStore;