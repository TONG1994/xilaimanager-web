'use strict';

var Reflux = require('reflux');
var profitSharingActions = require('../action/ProfitSharingActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var profitSharingStore = Reflux.createStore({
	listenables: [profitSharingActions],
	
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
		MsgActions.showError('profit_allocation', operation, errMsg);

	},
	
	// 根据过滤条件查询利润分配信息
	// onGetprofitSharing: function (filter) {
	// 	var self = this;
	// 	var url = this.getServiceUrl('profit_allocation/getByFilter');
	// 	Utils.doGetRecord(url, filter).then(function (result) {
     //        console.log(result);
	// 		self.object = result;
	// 		self.fireEvent('get', '', self);
	// 	}, function (value) {
    //
	// 		self.fireEvent('get',value, self);
	// 	});
	// }

    // 根据过滤条件查询利润分配信息
    onGetprofitSharing: function (filter) {
        var self = this;
        var url = this.getServiceUrl('profit_allocation/getByFilter');
        Utils.doRetrieveService(url, filter).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
            self.object = result.object;
                self.fireEvent('get', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('get', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        }, (value) => {
            self.fireEvent('get', '调用服务错误', self);
        });
    },
});

module.exports = profitSharingStore;
