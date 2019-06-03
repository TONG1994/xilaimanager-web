/**
 *   Create by Malson on 2018/5/3
 */
let Reflux = require('reflux');
let CommonActions = require('../action/CommonActions');
let Utils = require('../../public/script/utils');

let CommonStore = Reflux.createStore({
  listenables: [CommonActions],
  recordSet:[],
  init: function() {
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
    
    MsgActions.showError('organization', operation, errMsg);
  },
  getServiceUrl: function(action)
  {
    return Utils.xilaimanagerUrl+action;
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
    onRetrieveOperateLog: function (filter) {
        let self = this;
        let url = this.getServiceUrl('accessLog/queryAccessLog');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then((result) => {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                var arr = result.object.list;
                arr.map(function(item,index){
                    item.dataIndex = index+1;
                    item.uuid = index;
                })
                self.recordSet = arr;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.filter = filter;

                self.fireEvent('retrieve', '', self);
            } else {
                self.fireEvent('retrieve', '调用服务错误', self);
            }
        }, (value) => {
            self.fireEvent('retrieve', '调用服务错误', self);
        });
    },
    onRetrieveOperateLogPage: function (filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveOperateLog(filter);
    },


});

module.exports = CommonStore;
