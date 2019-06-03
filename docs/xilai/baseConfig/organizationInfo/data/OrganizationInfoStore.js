'use strict';

var Reflux = require('reflux');
var OrganizationInfoActions = require('../action/OrganizationInfoActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var OrganizationInfoStore = Reflux.createStore({
    listenables: [OrganizationInfoActions],

    filter: {},
    recordSet: [],
    object: {},
    startPage: 0,
    pageRow: 0,
    totalRow: 0,

    init: function() {},
    getServiceUrl: function(action) {
        return Utils.xilaimanagerUrl + action;
    },
    fireEvent: function(operation, errMsg, self) {
        self.trigger({
            filter: self.filter,
            recordSet: self.recordSet,
            object: self.object,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('organization', operation, errMsg);
    },
    changeCodeToText:function(data){
        var orgTypeText = data.orgType;
        if (data.orgType === '1') {
            orgTypeText = '总部';
        } else if (data.orgType === '2') {
            orgTypeText = '经营中心';
        } else if (data.orgType === '3') {
            orgTypeText = '服务站';
        }
        var time= data.businessHours.split(',');
        time[0] = time[0] ?  time[0] : '00:00';
        time[1] = time[1] ?  time[1] : '00:00';
        var businessHours= time[0] + ' ~ ' + time[1];
        return {
            orgTypeText:orgTypeText,
            businessHours:businessHours
        };
    },
    getBeforeData: function(data) {
        var changeCodeToText = this.changeCodeToText(data);
        var beforeData = [
            { prop: 'alias3', label: '机构类型', value: changeCodeToText.orgTypeText },
            { prop: 'orgName', label: '机构名称', value: data.orgName },
            { prop: 'alias1', label: '所在区域', value: data.orgAddressText },
            { prop: 'detailAddress', label: '详细地址', value: data.detailAddress },
            { prop: 'alias4', label: '营业时间', value:changeCodeToText.businessHours },
            { prop: 'alias5', label: '经营范围', value: data.manageCityCountry },
            { prop: 'headName', label: '负责人姓名', value: data.headName },
            { prop: 'headTelephone', label: '负责人电话', value: data.headTelephone },
            { prop: 'accountName', label: '开户名称', value: data.accountName },
            { prop: 'bankName', label: '开户银行', value: data.bankName },
            { prop: 'branchbankName', label: '开户支行', value: data.branchbankName },
            { prop: 'bankCardno', label: '开户银行', value: data.bankCardno },
            { prop: 'payNo', label: '支付宝账号', value: data.payNo },
            { prop: 'alias2', label: '所属经营中心', value: data.parentOrgText },
            { prop: 'orgLocation', label: '经纬度', value: data.orgLocation },
        ];
        return beforeData;
    },
    // 增加机构信息
    onCreateOrganizationInfo: function(data) {
        var organization = this.filterData(data);
        var url = this.getServiceUrl('organization/create');
        Utils.recordCreate(this, organization, url);
    },
    filterData:function (data) {
      var organization = Utils.deepCopyValue(data);
      organization.beforeData = data.beforeData?this.getBeforeData(data.beforeData):this.getBeforeData(data);
      var changeCodeToText = this.changeCodeToText(data);
      organization.alias1 = data.orgAddressText;
      organization.alias2 = data.parentOrgText;
      organization.alias3 = changeCodeToText.orgTypeText;
      organization.alias4 = changeCodeToText.businessHours;
      organization.alias5 = data.manageCityCountry;
      return organization;
    },
    // 删除机构信息
    onDeleteOrganizationInfo: function(uuid) {
        var url = this.getServiceUrl('organization/remove');
        Utils.recordDelete(this, uuid, url);
    },

    // 总部根据筛选条件,查询机构信息
    onRetrieveOrganizationInfo: function(filter, startPage, pageRow) {
        var self = this;
        var url = this.getServiceUrl('organization/retrieveByFilter');
        Utils.doRetrieveService(url, filter, startPage, pageRow, self.totalRow).then(function(result) {
          if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
              self.recordSet = result.object.list;
              self.startPage = result.object.startPage;
              self.pageRow = result.object.pageRow;
              self.totalRow = result.object.totalRow;
              self.filter = filter;
              self.fireEvent('retrieveByFilter', '', self);
            } else {
              Utils.handleServer(result.errCode);
              self.fireEvent('retrieveByFilter', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
          },
          function(errMsg) {
              self.fireEvent('retrieveByFilter', '调用服务错误', self);
          });
    },

    // 根据UUID查询机构信息
    onGetOrganizationInfo: function(filter) {
        var self = this;
        var url = this.getServiceUrl('organization/get-by-uuid');
        Utils.doGetRecord(url, filter).then(function(result) {
            self.object = result;
            self.fireEvent('get', '', self);
        }, function(value) {
            self.fireEvent('get', '调用服务错误', self);
        });
    },
  onUpdate: function (data) {
    let self = this;
    let url = this.getServiceUrl('organization/update');
    var filter = this.filterData(data);
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('update', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('update', '[' + result.errCode + ']处理错误，' + result.errDesc , self);
      }
    }, (value) => {
      self.fireEvent('update', '调用服务错误', self);
    });
  },
  onUpdateDisableAndEnable: function (filter) {
    let self = this;
    let url = this.getServiceUrl('organization/updateDisableAndEnable');
    Utils.doCreateService(url, filter).then((result) => {
      if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
        self.recordSet = result.object;
        self.filter = filter;
        self.fireEvent('updateDisableAndEnable', '', self);
      } else {
        Utils.handleServer(result.errCode);
        self.fireEvent('updateDisableAndEnable', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
      }
    }, (value) => {
      self.fireEvent('updateDisableAndEnable', '调用服务错误', self);
    });
  },
  
});

module.exports = OrganizationInfoStore;