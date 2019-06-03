let Reflux = require('reflux');
var $ = require('jquery');
let WorksheetManagementActions = require('../action/WorksheetManagementActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let worksheetManagementStore = Reflux.createStore({
  listenables: [WorksheetManagementActions],
  filter: '',
  recordSet: [],
  startPage: 0,
  pageRow: 0,
  oldSearchData:[],
  totalRow: 0,
  detailData:[],
  dataSource: [],
  dataArr: [],

  init: function () { },

  fireEvent: function (operation, errMsg, errCode, self,errOperation) {
    self.trigger({
      filter: self.filter,
      recordSet: self.recordSet,
      startPage: self.startPage,
      pageRow: self.pageRow,
      totalRow: self.totalRow,
      operation: operation,
      errMsg: errMsg,
      errCode: errCode,
      detailData : self.detailData,
      errOperation : errOperation,
      dataSource: self.dataSource,
      dataArr: self.dataArr,
    });

    MsgActions.showError(errOperation, operation, errMsg);
  },

  getServiceUrl: function (action) {

    return Utils.customerUrl + action;
  },

  //查询工单列表 && 根据条件查询
  onRetrieveWorksheet: function (filter, startPage, pageRow ) {
    let self = this;
    let url = this.getServiceUrl('worksheet/findList');
    Utils.doRetrieveService(url, filter, startPage, pageRow, self.totalRow).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object.list;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;
        self.fireEvent('findList', '', result.errCode, self,"worksheet");
      } else {
          Utils.handleServer(result.errCode);
          self.fireEvent('findList', '[' + result.errCode + ']处理错误，' + result.errDesc, result.errCode , self,"worksheet");
      }
    }, (value) => {
      self.fireEvent('findList', '调用服务错误',null, self,"worksheet");
    });
  },

// 查询受理人
onFindAssignee: function(filter){
    let self = this;
    let url = this.getServiceUrl('worksheet/getUserListForWorksheetCreate');
    self.dataArr = [];
    self.dataSource = [];
    Utils.doRetrieveService(url, filter, 0, 0, 0).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
          self.dataArr = result.object == null ? [] : result.object;
          self.dataSource = [];
          for (var i in result.object) {
            self.dataSource.push(result.object[i].name);
          }
        self.fireEvent('findAssignee', '',result.errCode, self,"worksheet");
      } else {
          Utils.handleServer(result.errCode);
          self.fireEvent('getUserListForWorksheetCreate', '[' + result.errCode + ']处理错误，' + result.errDesc, result.errCode , self,"worksheet");
      }
    }, (value) => {
      self.fireEvent('getUserListForWorksheetCreate', '调用服务错误', null, self,"worksheet");
    });
  },

  // 查询受理人2
onFindAccepMan: function(filter){
  let self = this;
  let url = this.getServiceUrl('worksheet/getUserListForWorksheetCreate');
  Utils.doRetrieveService(url, filter, 0, 0, 0).then((result) => {
    if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
      self.recordSet = result.object;
      self.filter = filter;
      self.fireEvent('findAccepMan', '' , result.errCode , self,"worksheet");
    } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('getUserListForWorksheetCreate', '[' + result.errCode + ']处理错误，' + result.errDesc, result.errCode , self,"worksheet");
    }
  }, (value) => {
    self.fireEvent('getUserListForWorksheetCreate', '调用服务错误', null, self,"worksheet");
  });
},

  // 新增
  onCreateWorksheet: function(data){
    let self = this;
    let url = this.getServiceUrl('worksheet/create');
    Utils.doCreateService(url, data).then(function(result) {
        if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
          self.fireEvent('create', '',result.errCode, self,"worksheet");
        } else {
          self.fireEvent('create',  '[' + result.errCode + ']处理错误，' + result.errDesc, result.errCode , self,"worksheet");
        }
    }, function(value) {
      self.fireEvent('create','调用服务错误', null, self,"worksheet");
    });
  },

  //解决工单
  onResolve: function(data){
    let self = this;
    let url = this.getServiceUrl('worksheet/resolve');
    Utils.doUpdateService(url, data).then(function(result){
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.fireEvent('resolve', '',result.errCode, self,"worksheet");
      } else {
        self.fireEvent('resolve',  '[' + result.errCode + ']处理错误，' + result.errDesc, result.errCode , self,"worksheet");
      }
    },function(value){
      self.fireEvent('resolve','调用服务错误', null, self,"worksheet");
    })
  },

  //关闭工单
  onFinish: function(data){
    let self = this;
    let url = this.getServiceUrl('worksheet/close');
    Utils.doUpdateService(url, data).then(function(result){
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.fireEvent('close', '',result.errCode, self,"worksheet");
      } else {
        self.fireEvent('close',  '[' + result.errCode + ']处理错误，' + result.errDesc, result.errCode , self,"worksheet");
      }
    },function(value){
      self.fireEvent('close','调用服务错误',null, self,"worksheet");
    })
  },

  //激活工单
  onReActive: function(data){
    let self = this;
    let url = this.getServiceUrl('worksheet/activate');
    Utils.doUpdateService(url, data).then(function(result){
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.filter = data;
        self.fireEvent('activate', '',result.errCode, self,"worksheet");
      } else {
        self.fireEvent('activate',  '[' + result.errCode + ']处理错误，' + result.errDesc, result.errCode, self,"worksheet");
      }
    },function(value){
      self.fireEvent('activate','调用服务错误',null, self,"worksheet");
    })
  },

  //转派工单
  onForward: function(data){
    let self = this;
    let url = this.getServiceUrl('worksheet/forward');
    Utils.doUpdateService(url, data).then(function(result){
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.fireEvent('forward', '',result.errCode, self,"worksheet");
      } else {
        self.fireEvent('forward', '[' + result.errCode + ']处理错误，' + result.errDesc , result.errCode, self,"worksheet");
      }
    },function(value){
      self.fireEvent('forward','调用服务错误',null, self,"worksheet");
    })
  },

  //查询工单详情
  onRetrieveDetails: function ( filter ) {
    let self = this;
    let url = this.getServiceUrl('workSheetOperation/findList');
    this.doRetrieveService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.detailData = result.object;
        self.filter = filter;
        self.fireEvent('findList', '', result.errCode, self,'workSheetOperation');
      } else {
          Utils.handleServer(result.errCode);
          self.fireEvent('findList', '[' + result.errCode + ']处理错误，' + result.errDesc, result.errCode , self,'workSheetOperation');
      }
    }, (value) => {
      self.fireEvent('findList', '调用服务错误', null, self,'workSheetOperation');
    });
  },

  // 数据包装
  doRetrieveService: function(url, filter) {
      var query = filter;
      var filter2 = {
          flowNo: '0',
          object: query
      };

      var req = Utils.ajaxBody(url, filter2);
      var promise = new Promise(function(resolve, reject) {
          $.ajax(req).done(resolve).fail(reject);
      });

      return promise;
  },

});

module.exports = worksheetManagementStore;
