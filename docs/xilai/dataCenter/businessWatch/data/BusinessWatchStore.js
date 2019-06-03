var Reflux = require('reflux');
var BusinessWatchActions = require('../action/BusinessWatchActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProductStore = Reflux.createStore({
  listenables: [BusinessWatchActions],
  filter: {},
  recordSet: [],
  startPage : 0,
  pageRow : 0,
  totalRow : 0,
  businessWatch:[],
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
      businessWatch:self.businessWatch,
      recordSet: self.recordSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg
    });

    MsgActions.showError('manageBill', operation, errMsg);

  },
  //查询昨日数据
  onRetrieveBusinessWatch: function(filter) {
    let self = this;
    let url = this.getServiceUrl('manageBill/business_monitoring');
    Utils.doRetrieveService(url,filter).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.businessWatch=result.object;
        self.filter = filter;
        self.fireEvent('business_monitoring', '', self);
      }
      else{
        Utils.handleServer(result.errCode);
        self.fireEvent('business_monitoring', '['+result.errCode+']处理错误，'+result.errDesc, self);
      }
    }, function(){
      self.fireEvent('business_monitoring', '调用服务错误', self);
    });
  },
  
  //获取机构或者服务站
  onGetOrg: function(filter) {
    let self = this;
    let url = this.getServiceUrl('manageBill/business_monitoring_mechanism');
    Utils.doCreateService(url,filter).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('business_monitoring_mechanism', '', self);
      }
      else{
        Utils.handleServer(result.errCode);
        self.fireEvent('business_monitoring_mechanism', '['+result.errCode+']处理错误，'+result.errDesc, self);
      }
    }, function(){
      self.fireEvent('business_monitoring_mechanism', '调用服务错误', self);
    });
  },
  
  //查询下单量
  onRetrieveNum: function(filter) {
    let self = this;
    let url = this.getServiceUrl('manageBill/queryOrderQuantityStatistics');
    Utils.doCreateService(url,filter).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.recordSet = result.object || {};
        self.filter = filter;
        self.fireEvent('queryOrderQuantityStatistics', '', self);
      }
      else{
        Utils.handleServer(result.errCode);
        self.fireEvent('queryOrderQuantityStatistics', '['+result.errCode+']处理错误，'+result.errDesc, self);
      }
    }, function(){
      self.fireEvent('queryOrderQuantityStatistics', '调用服务错误', self);
    });
  },
  //查询订单金额
  onRetrieveAmount: function(filter) {
    let self = this;
    let url = this.getServiceUrl('manageBill/business_monitoring_money');
    Utils.doCreateService(url,filter).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.recordSet = result.object || {};
        self.filter = filter;
        self.fireEvent('business_monitoring_money', '', self);
      }
      else{
        Utils.handleServer(result.errCode);
        self.fireEvent('business_monitoring_money', '['+result.errCode+']处理错误，'+result.errDesc, self);
      }
    }, function(){
      self.fireEvent('business_monitoring_money', '调用服务错误', self);
    });
  },

  onRetrieveExpressPage: function(filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveExpress( filter );
  },
    //查询列表数据
  onRetrieveTable: function(filter) {
        let self = this;
        let url = this.getServiceUrl('manageBill/business_monitoring_moneyList');
        Utils.doCreateService(url,filter).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet = result.object || {};
                self.filter = filter;
                self.fireEvent('business_monitoring_moneyList', '', self);
            }
            else{
                Utils.handleServer(result.errCode);
                self.fireEvent('business_monitoring_moneyList', '['+result.errCode+']处理错误，'+result.errDesc, self);
            }
        }, function(){
            self.fireEvent('business_monitoring_moneyList', '调用服务错误', self);
        });
    },



});

module.exports = ProductStore;