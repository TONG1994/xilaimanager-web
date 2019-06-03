/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let OperateLogActions = require('../action/OperateLogActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let OperateLogStore = Reflux.createStore({
  listenables: [OperateLogActions],
  
  filter: '',
  recordSet: [],
  startPage: 0,
  pageRow: 0,
  totalRow: 0,
  
  init: function () {
  },
  getServiceUrl: function (action) {
    return Utils.xilaimanagerUrl + action;
  },
  
  fireEvent: function (operation, errMsg, self) {
    self.trigger({
      filter: self.filter,
      recordSet: self.recordSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg
    });
    
    MsgActions.showError('accessLog', operation, errMsg);
  },
  
  onRetrieveOperateLog: function (filter) {
    let self = this;
    let url = this.getServiceUrl('accessLog/queryAccessLog');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
          var arr = result.object.list || [];
          arr.map(function(item,index){
              item.dataIndex = index+1;
              item.id = index;
          })
        self.recordSet = arr;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;
        
        self.fireEvent('retrieve', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('retrieve', '['+result.errCode+']处理错误，'+result.errDesc, self);
      }
    }, (result) => {
      self.fireEvent('retrieve', '['+result.errCode+']处理错误，'+result.errDesc, self);
    });
  },
  onRetrieveOperateLogPage: function (filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveOperateLog(filter);
  },
});

module.exports = OperateLogStore;
