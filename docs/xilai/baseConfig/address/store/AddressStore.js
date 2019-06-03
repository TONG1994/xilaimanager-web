/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let AddressActions = require('../action/AddressActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let AddressStore = Reflux.createStore({
  listenables: [AddressActions],

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

    MsgActions.showError('address', operation, errMsg);
  },

  onRetrieveAddress: function (filter) {
    let self = this;
    let url = this.getServiceUrl('addressBook/queryFromManage');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then((result) => {
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
  onRetrieveAddressPage: function (filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveAddress(filter);
  },
});

module.exports = AddressStore;
