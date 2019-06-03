/**
 *   Create by Malson on 2018/5/10
 */
let Reflux = require('reflux');
let CommonActions = require('../action/BusinessCenterActions');
let Utils = require('../../../../public/script/utils');

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
  //获取所有经营中心  根据机构名称
  onGetBusinessCenter: function(organization) {
    var url = this.getServiceUrl('organization/getByOrgName');
    
    var self = this;
    Utils.doCreate(url, organization).then(function (result) {
      // 修改下面的程序
      self.recordSet = result;
      self.fireEvent('getBusinessCenter', '', self);
    }, function(errMsg){
      self.fireEvent('getBusinessCenter', errMsg, self);
    });
  },
  //获取所有经营中心  根据机构NO
  onGetBusinessCenterByNo: function(organization) {
    var url = this.getServiceUrl('organization/getByOrgno');
    
    var self = this;
    Utils.doCreate(url, organization).then(function (result) {
      // 修改下面的程序
      self.recordSet = result;
      self.fireEvent('getBusinessCenterByNo', '', self);
    }, function(errMsg){
      self.fireEvent('getBusinessCenterByNo', errMsg, self);
    });
  },
});

module.exports = CommonStore;