/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let OperationActivityActions = require('../action/OperationActivityActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let OperationActivityStore = Reflux.createStore({
  listenables: [OperationActivityActions],

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

    MsgActions.showError('operationActivity', operation, errMsg);
  },

  onRetrieveOperationActivity: function (filter) {
    let self = this;
    let url = this.getServiceUrl('marketCampaign/retrieveOrgBaseInfo');
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
  onRetrieveOperationActivityPage: function (filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveOperationActivity(filter);
  },
});

module.exports = OperationActivityStore;
