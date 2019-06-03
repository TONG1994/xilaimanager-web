let Reflux = require('reflux');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');
let StaffInfoActions = require('../actions/StaffInfoActions');

let StoreInfoStore = Reflux.createStore({
  listenables:[StaffInfoActions],

  filter: '',
  recordSet: [],
  startPage: 0,
  pageRow: 0,
  totalRow: 0,
  init: function () {},

  getServiceUrl: function (action) {
        return Utils.baomimanagerUrl + action;
  },

  fireEvent: function (operation, errMsg, self) {
      self.trigger({
          filter: self.filter,
          recordSet: self.recordSet,
          startPage: self.startPage,
          pageRow: self.pageRow,
          totalRow: self.totalRow,
          operation: operation,
          errMsg: errMsg,
      });

      MsgActions.showError('staffInfo', operation, errMsg);
  },

  //查询订单信息
  onRetrieveStaffInfo: function (filter, startPage, pageRow) {
    let self = this;
    let url = this.getServiceUrl('staff/retrieve');
    Utils.doRetrieveService(url, filter, startPage, pageRow, self.totalRow).then((result) => {
        // console.log(result);
        if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
            self.recordSet = result.object.list;
            self.startPage = result.object.startPage;
            self.pageRow = result.object.pageRow;
            self.totalRow = result.object.totalRow;
            self.filter = filter;
            self.fireEvent('retrieve', '', self);
        } else {
            Utils.handleServer(result.errCode);
            self.fireEvent('retrieve', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
        }
    }, (value) => {
        self.fireEvent('retrieve', '调用服务错误', self);
    });
},

});
module.exports = StoreInfoStore;