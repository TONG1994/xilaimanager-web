import {SubAdminManagePage} from "../SubAdminManagePage";

/**
 *   Create by Malson on 2018/4/25
 */
let Reflux = require('reflux');
let SubAdminManageActions = require('../action/SubAdminManageActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let SubAdminManageStore = Reflux.createStore({
    listenables: [SubAdminManageActions],

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

        MsgActions.showError('user', operation, errMsg);
    },
    getBeforeData:function (data) {
        var beforeData = [
            { prop: 'name', label: '姓名', value: data.name },
            { prop: 'phone', label: '手机号码', value: data.phone },
            { prop: 'roleName', label: '角色名称', value: data.roleName },
        ];
        return beforeData;
    },
    // 增加
    onCreateSubAdminManage: function(subAdminManage) {
        var self = this;
        var url = this.getServiceUrl('user/createManager');
        let myData=Utils.deepCopyValue(subAdminManage);
        myData.beforeData = this.getBeforeData(subAdminManage);
        Utils.doCreateService(url, myData).then(function (result) {
            if (self.resuleReturn(result.errCode)) {
                self.recordSet.unshift(result.object);
                self.totalRow = self.totalRow + 1;
                self.fireEvent('createManager', '', self);
            }else{
                Utils.handleServer(result.errCode);
                self.fireEvent('createManager', '[' + result.errCode + ']处理错误，' + result.errDesc,  self);
            }
           
        }, function (errMsg) {
            self.fireEvent('createManager', errMsg, self);
        });
    },
// 修改
    onUpdateSubAdminManage: function (data, oldValue) {
        var self = this;
        var url = this.getServiceUrl('user/updateManager');
        let myData=Utils.deepCopyValue(data);
        myData.beforeData = this.getBeforeData(oldValue);
        myData.logicCode = data.userCode;
        var idx = Utils.findRecord(self, data.uuid);
        if (idx < 0) {
            self.fireEvent('updateManager', '没有找到记录[' + data.uuid + ']', self);
            return;
        }
        if (Utils.compareTo(self.recordSet[idx], data)) {
            //console.log('数据没有变更');
            self.fireEvent('updateManager', '', self);
            return;
        }

        Utils.doUpdateService(url, myData).then(function (result) {
            if (self.resuleReturn(result.errCode)) {
                Utils.copyValue(data, self.recordSet[idx]);
                self.fireEvent('updateManager','',self);
            }else{
                Utils.handleServer(result.errCode);
                self.fireEvent('updateManager', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
           
        }, function (errMsg) {
            self.fireEvent('updateManager', errMsg, self);
        });
    },
    onDeleteSubAdminManage(data) {
        var user = Utils.deepCopyValue(data);
        user.uuid = data.uuid;
        user.logicCode = data.userCode;
        user.menuName = '账号管理';
        user.beforeData = this.getBeforeData(data);
        var url = this.getServiceUrl('user/remove');
        Utils.recordDeleteUsedForLog(this, user, url);
    },
    onRetrieveSubAdminManage: function (filter) {
        let self = this;
        let url = this.getServiceUrl('user/findManagerList');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then((result) => {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.recordSet = result.object.list;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.filter = filter;

                self.fireEvent('findManagerList', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('findManagerList', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        }, (value) => {
            self.fireEvent('findManagerList', '调用服务错误', self);
        });
    },
    onRetrieveSubAdminManagePage: function (filter, startPage, pageRow) {
        this.startPage = startPage;
        this.pageRow = pageRow;
        this.onRetrieveSubAdminManage(filter);
    },
    resuleReturn: function (errCode) {
        if (errCode === null || errCode === '' || errCode === '000000') {
            return true;
        } else {
            return false;
        }
    }
});

module.exports = SubAdminManageStore;
