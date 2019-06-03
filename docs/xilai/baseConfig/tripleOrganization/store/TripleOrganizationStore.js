/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let TripleOrganizationActions = require('../action/TripleOrganizationActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let TripleOrganizationStore = Reflux.createStore({
  listenables: [TripleOrganizationActions],
  
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
    MsgActions.showError('agent', operation, errMsg);
  },
  
  onRetrieveTripleOrganization: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/findByWhere');
    Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object.list;
        self.startPage = result.object.startPage;
        self.pageRow = result.object.pageRow;
        self.totalRow = result.object.totalRow;
        self.filter = filter;
        
        self.fireEvent('findByWhere', '', self);
      } else {
        self.fireEvent('findByWhere', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('findByWhere', '调用服务错误', self);
    });
  },
  onQueryLogisticsCompanysRetrieve: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/queryLogisticsCompanys');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
      
        self.fireEvent('queryLogisticsCompanysRetrieve', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('queryLogisticsCompanysRetrieve', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('queryLogisticsCompanysRetrieve', '调用服务错误', self);
    });
  },
  onQueryLogisticsCompanys: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/queryLogisticsCompanys');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        
        self.fireEvent('queryLogisticsCompanys', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('queryLogisticsCompanys', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('queryLogisticsCompanys', '调用服务错误', self);
    });
  },
  onSearchSitesByFilter: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/searchSitesByFilter');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('searchSitesByFilter', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('searchSitesByFilter', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('searchSitesByFilter', '调用服务错误', self);
    });
  },
  onSearchSitesByFilter1: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/searchSitesByFilter');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('searchSitesByFilter1', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('searchSitesByFilter1', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('searchSitesByFilter1', '调用服务错误', self);
    });
  },
  onGetNeedParams: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/getNeedParams');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('getNeedParams', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('getNeedParams', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('getNeedParams', '调用服务错误', self);
    });
  },
  onCreate: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/create');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('create', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('create', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('create', '调用服务错误', self);
    });
  },
  onUpdateActive: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/updateActive');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('updateActive', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('updateActive', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('updateActive', '调用服务错误', self);
    });
  },
  onGetUpdateNeedParams: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/getUpdateRecord');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('getUpdateRecord', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('getUpdateRecord', '[' + result.errCode + ']处理错误' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('getUpdateRecord', '调用服务错误', self);
    });
  },
  onUpdate: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/update');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('update', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('update', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('update', '调用服务错误', self);
    });
  },
  onCheck: function (filter) {
    let self = this;
    let url = this.getServiceUrl('agent/viewRecord');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('check', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('check', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('check', '调用服务错误', self);
    });
  },
  onRetrieveTripleOrganizationPage: function (filter, startPage, pageRow) {
    this.startPage = startPage;
    this.pageRow = pageRow;
    this.onRetrieveTripleOrganization(filter);
  },
});

module.exports = TripleOrganizationStore;
