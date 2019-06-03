var Reflux = require('reflux');
var ExpressActions = require('../action/ExpressActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var ProductStore = Reflux.createStore({
  listenables: [ExpressActions],
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
      errMsg: errMsg,
      deleteRecordSet:self.deleteRecordSet
    });

    MsgActions.showError('sender', operation, errMsg);

  },

  onRetrieveExpress: function(filter) {
    var self = this;

    var url = this.getServiceUrl('sender/retrieveByFilter');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
      if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
        self.recordSet = result.object.list;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;
        self.fireEvent('retrieveByFilter', '', self);
      }
      else{
        Utils.handleServer(result.errCode);
        self.fireEvent('retrieveByFilter', '['+result.errCode+']处理错误，'+result.errDesc, self);
      }
    }, function(value){
      self.fireEvent('retrieveByFilter', '调用服务错误', self);
    });
  },

  onRetrieveExpressPage: function(filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveExpress( filter );
  },

  onUpdateExpress: function(data) {
    function isInArray(data,uuid){
      for(let i=0;i<data.length;i++){
        if(data[i].uuid==uuid){
          return -1
        }
      }
      return 1;
    }
    var url = this.getServiceUrl('sender/update');
    let self=this;
    Utils.doUpdateService(url, data).then(function (result) {

      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.totalRow =self.totalRow-result.object.length;
        let data=self.recordSet;
        let receiveData=result.object;
        let returnData=[];
        data.filter((item)=>{
          if(isInArray(receiveData,item.uuid)==1){
            returnData.push(item);
          }
        });
        self.recordSet=returnData;
        self.deleteRecordSet=result.object;
        self.fireEvent('update', '', self);
      }
      else {
        Utils.handleServer(result.errCode);
        self.fireEvent('update', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, function (value) {
      self.fireEvent('update', Utils.getResErrMsg(value), self);
    });
  },


});

module.exports = ProductStore;