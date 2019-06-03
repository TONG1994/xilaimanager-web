var Reflux = require('reflux');
var logisticsCompanyActions = require('../action/logisticsCompanyActions');
var Utils = require('../../../../../public/script/utils');
var MsgActions = require('../../../../../lib/action/MsgActions');

var ProductStore = Reflux.createStore({
  listenables: [logisticsCompanyActions],
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
      recordSet: self.recordSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg
    });

    MsgActions.showError('logistics_price', operation, errMsg);

  },

  onGetCompany: function(filter) {
    var self = this;
    var url = this.getServiceUrl('logistics_price/getCompanyInfo');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.filter = filter;
        self.recordSet=result.object;
        self.fireEvent('getCompany', '', self);
      }
      else{
        self.fireEvent('getCompany', '['+result.errCode+']处理错误，'+result.errDesc, self);
      }
    }, function(value){
      self.fireEvent('getCompany', '调用服务错误', self);
    });
  },




});

module.exports = ProductStore;