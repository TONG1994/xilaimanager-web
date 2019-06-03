/**
 *   Created by chenhui on 2018/5/8
 **/
'use strict';

var Reflux = require('reflux');
var orgBranchSelectStore = require('../action/OrgBranchSelectActions');
var Utils = require('../../../../../public/script/utils');
var MsgActions = require('../../../../../lib/action/MsgActions');

var orgBranchSelectStore = Reflux.createStore({
    listenables: [orgBranchSelectStore],

    filter: {},
    recordSet: [],
    object: {},
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.xilaimanagerUrl+action;
    },
    fireEvent: function(operation, errMsg, self)
    {
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
    onGetBranchList: function (filter) {
        var  self = this;
        var  url =this.getServiceUrl('organization/getByOrgName');
        Utils.doGetRecord(url, filter).then(function (result) {
            self.object = result;
            self.fireEvent('get', '', self);
        }, function (value) {
            self.fireEvent('get', errMsg, self);
        });
    }
});

module.exports = orgBranchSelectStore;
