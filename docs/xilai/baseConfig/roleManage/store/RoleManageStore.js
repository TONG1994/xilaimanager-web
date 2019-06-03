/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let RoleManageActions = require('../action/RoleManageActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let RoleManageStore = Reflux.createStore({
    listenables: [RoleManageActions],

    filter: '',
    recordSet: [],
    startPage: 0,
    pageRow: 0,
    totalRow: 0,
    object:{},

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
            errMsg: errMsg,
            object: self.object
        });

        MsgActions.showError('role', operation, errMsg);
    },
    getBeforeData:function (data) {
      var beforeData = [
          { prop: 'roleName', label: '角色', value: data.roleName },
          { prop: 'alias1', label: '菜单权限', value: data.menuListText },
      ];
      return beforeData;
    },
    // 增加
    onCreateRoleManage: function(roleManage) {
      var self = this;
      var url = this.getServiceUrl('role/create');
      let myData=Utils.deepCopyValue(roleManage);
      myData.beforeData = this.getBeforeData(roleManage);
      myData.alias1 = roleManage.menuListText;
      Utils.recordCreate(this, myData, url);
    },

    // 修改
    onUpdateRoleManage: function (newValue, oldValue) {
      var roleManage = Utils.deepCopyValue(newValue);
      roleManage.beforeData = this.getBeforeData(oldValue);
      roleManage.alias1 = newValue.menuListText;
      roleManage.logicCode = newValue.roleId;
      var url = this.getServiceUrl('role/update');
      Utils.recordUpdate(this, roleManage, url);
    },

    // 删除
    onDeleteRoleManage: function(data) {
        var roleManage = Utils.deepCopyValue(data);
        roleManage.uuid = data.uuid;
        roleManage.logicCode = data.roleId;
        roleManage.beforeData = this.getBeforeData(data);
        var url = this.getServiceUrl('role/remove');
        Utils.recordDeleteUsedForLog(this, roleManage, url);
    },

    onRetrieveRoleManage: function (filter) {
        let self = this;
        let url = this.getServiceUrl('role/getRoleListForEdit');
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
    onRetrieveRoleManagePage: function (filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveRoleManage(filter);
    },
    // 根据UUID查询机构信息
    onGetRoleManageByUuid: function(filter) {
        var self = this;
        var url = this.getServiceUrl('role/get-by-uuid');
        Utils.doGetRecord(url, filter).then(function(result) {
            self.object = result;
            self.fireEvent('get', '', self);
        }, function(value) {
            self.fireEvent('get', '调用服务错误', self);
        });
    }


});

module.exports = RoleManageStore;
