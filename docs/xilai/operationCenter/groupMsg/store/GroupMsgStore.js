
let Reflux = require('reflux');
let GroupMsgActions = require('../action/GroupMsgActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let GroupMsgStore = Reflux.createStore({
  listenables: [GroupMsgActions],

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
      recordSetStaff: self.recordSetStaff,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg
    });

    MsgActions.showError('activityCenter', operation, errMsg);
  },
  //查询列表
  onRetrieveGroupMsg: function (filter) {
    let self = this;
    let url = this.getServiceUrl('mass_texting/select-by-uuid');
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
  onRetrieveGroupMsgPage: function (filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveGroupMsg(filter);
  },
  //查询人数
  onRetrieveNum: function (userType) {
    //alert(value);
    let self = this;
    let url = this.getServiceUrl('user/findUserNum');
    Utils.doGetRecordService(url, userType).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;

        self.fireEvent('retrieveNum', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('retrieveNum', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('retrieveNum', '调用服务错误', self);
    });
  },
    //查询指定可发送短信人员列表
    onGetSendMsgableUserList: function (userType) {
        //alert(value);
        let self = this;
        let url = this.getServiceUrl('mass_texting/getSendMsgableUserList');
        Utils.doGetRecordService(url, userType).then((result) => {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSetStaff = result.object;

                self.fireEvent('getSendMsgableUserList', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('getSendMsgableUserList', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        }, (value) => {
            self.fireEvent('getSendMsgableUserList', '调用服务错误', self);
        });
    },
  //新建短信
  onAddMsg: function (data) {
    var $this = this,
      url = this.getServiceUrl('mass_texting/create');
    Utils.doCreateService(url, data).then(
      (result) => {
        if ($this.resuleReturn(result.errCode)) {
          $this.fireEvent('create', '', $this);
        } else {
          Utils.handleServer(result.errCode);
          $this.fireEvent('create', '[' + result.errCode + ']处理错误，' + result.errDesc, $this);
        }
      }, (errMsg) => {
        $this.fireEvent('create', errMsg, $this);
      });
  },
  //编辑短信
  onEditMsg: function (data) {
    var $this = this,
      url = this.getServiceUrl('mass_texting/update');
    Utils.doCreateService(url, data).then(
      (result) => {
        if ($this.resuleReturn(result.errCode)) {
          $this.fireEvent('update', '', $this);
        } else {
          Utils.handleServer(result.errCode);
          $this.fireEvent('update', '[' + result.errCode + ']处理错误，' + result.errDesc, $this);
        }
      }, (errMsg) => {
        $this.fireEvent('update', errMsg, $this);
      });
  },
  //删除短信
  onDeleteMsg: function (data) {
    let $this = this;
    var url = this.getServiceUrl('mass_texting/remove');
    Utils.doRemoveService(url, data).then(
      (result) => {
        if ($this.resuleReturn(result.errCode)) {
          $this.fireEvent('remove', '', $this);
        } else {
          Utils.handleServer(result.errCode);
          $this.fireEvent('remove', '[' + result.errCode + ']处理错误，' + result.errDesc, $this);
        }
      }, (errMsg) => {
        $this.fireEvent('remove', errMsg, $this);
      });
  },
  resuleReturn(errCode) {
    if (errCode === null || errCode === '' || errCode === '000000') {
        return true;
    } else {
        return false;
    }
}
});

module.exports = GroupMsgStore;
