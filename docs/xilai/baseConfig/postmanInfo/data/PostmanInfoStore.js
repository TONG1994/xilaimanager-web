let Reflux = require('reflux');
let PostmanInfoActions = require('../action/PostmanInfoActions');
let MsgActions = require('../../../../lib/action/MsgActions');
import Utils from '../../../../public/script/utils';

let PostmanInfoStore = Reflux.createStore({
    listenables: [PostmanInfoActions],
    init: function() {},
    recordSet: [],
    errMsg: '',
    startPage: 1,
    pageRow: 10,
    totalRow: 0,
    dataSource: [],
    dataArr: [],
    getServiceUrl: function(action) {
        return Utils.xilaimanagerUrl + action;
    },
    onRetrievePostmanInfo(filter, startPage, pageRow) {
        let $this = this,
            url = this.getServiceUrl('user/findCouriers');
        Utils.doRetrieveService(url, filter, startPage, pageRow, $this.totalRow).then(
            (result) => {
              if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                $this.recordSet = result.object.list;
                $this.startPage = result.object.startPage;
                $this.pageRow = result.object.pageRow;
                $this.totalRow = result.object.totalRow;
                $this.filter = filter;
                $this.fireEvent('findCouriers', '', $this);
              } else {
                Utils.handleServer(result.errCode);
                $this.fireEvent('findCouriers', '[' + result.errCode + ']处理错误，' + result.errDesc, $this);
              }
            }, () => {
              $this.fireEvent('findCouriers', '调用服务错误', $this);
            }
        );
    },
    getBeforeData(data) {
        var beforeData = [
            { prop: 'orgName', label: '所属服务站', value: data.orgName },
            { prop: 'name', label: '姓名', value: data.name },
            { prop: 'phone', label: '联系方式', value: data.phone },
            { prop: 'idCard', label: '身份证号', value: data.idCard },
        ];
        return beforeData;
    },
    onDeletePostmanInfo(data) {
        var user = Utils.deepCopyValue(data);
        user.uuid = data.uuid;
        user.logicCode = data.userCode;
        user.menuName='快递员信息';
        user.beforeData = this.getBeforeData(data);
        var url = this.getServiceUrl('user/remove');
        Utils.recordDeleteUsedForLog(this, user, url);
    },
    onCreatePostmanInfo(data) {
        var user = Utils.deepCopyValue(data);
        user.beforeData = this.getBeforeData(data);
        var $this = this,
            url = this.getServiceUrl('user/createStaff');
        Utils.doCreateService(url, user).then(
            (result) => {
                if ($this.resuleReturn(result.errCode)) {
                    $this.recordSet.unshift(result.object);
                    $this.totalRow = $this.totalRow + 1;
                    $this.fireEvent('createStaff', '', $this);
                } else {
                    Utils.handleServer(result.errCode);
                    $this.fireEvent('createStaff', '[' + result.errCode + ']处理错误，' + result.errDesc, $this);
                }
            }, (errMsg) => {
                $this.fireEvent('createStaff', errMsg, $this);
            });
    },

    onUpdatePostmanInfo(userNewValue, userOldValue) {
        var user = Utils.deepCopyValue(userNewValue);
        user.beforeData = this.getBeforeData(userOldValue);
        user.logicCode = userNewValue.userCode;
        var url = this.getServiceUrl('user/update');
        this.recordUpdate(this, user, url);
    },
    recordUpdate(store, data, url, syncRecord) {
        var util = Utils,
            self = store,
            idx = util.findRecord(store, data.uuid);
        if (idx < 0) {
            self.fireEvent('update', '没有找到记录[' + data.uuid + ']', self);
            return;
        }
        if (util.compareTo(self.recordSet[idx], data)) {
            //console.log('数据没有变更');
            self.fireEvent('update', '', self);
            return;
        }
        util.doUpdateService(url, data).then(function(result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                util.copyValue(data, self.recordSet[idx]);
                self.fireEvent('update', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('update', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        }, function(value) {
            self.fireEvent('update', util.getResErrMsg(value), self);
        });
    },
    onGetBranchList(filter) {
        let $this = this,
            url = this.getServiceUrl('organization/getByOrgName');
        $this.dataArr = [];
        $this.dataSource = [];
        Utils.doGetRecordService(url, filter).then(
            (result) => {
                if ($this.resuleReturn(result.errCode)) {

                    $this.dataArr = result.object == null ? [] : result.object;
                    $this.dataSource = [];
                    for (var i in result.object) {
                        $this.dataSource.push(result.object[i].orgName);
                    }
                    $this.fireEvent('getByOrgName', '', $this);
                } else {
                    Utils.handleServer(result.errCode);
                    $this.fireEvent('getByOrgName', '[' + result.errCode + ']处理错误，' + result.errDesc, $this);
                }
            },
            () => {
                $this.fireEvent('getByOrgName', '调用服务错误', $this);
            }
        );
    },
    fireEvent: function(operation, errMsg, $this) {
        $this.trigger({
            operation: operation,
            recordSet: $this.recordSet,
            errMsg: errMsg,
            startPage: $this.startPage,
            pageRow: $this.pageRow,
            totalRow: $this.totalRow,
            dataSource: $this.dataSource,
            dataArr: $this.dataArr,
        });
        if (operation === 'getByOrgName') {
            MsgActions.showError('organization', operation, errMsg);
        } else {
            MsgActions.showError('user', operation, errMsg);
        }

    },
    resuleReturn(errCode) {
        if (errCode === null || errCode === '' || errCode === '000000') {
            return true;
        } else {
            return false;
        }
    }
});

module.exports = PostmanInfoStore;