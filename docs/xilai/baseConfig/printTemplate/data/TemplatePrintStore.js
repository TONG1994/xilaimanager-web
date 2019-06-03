'use strict';

var Reflux = require('reflux');
var TemplatePrintActions = require('../action/TemplatePrintActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var TemplatePrintStore = Reflux.createStore({
	listenables: [TemplatePrintActions],
	
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
			errMsg: errMsg,
			mySelf:self.mySelf
		});

		MsgActions.showError('template_print', operation, errMsg);
	},
	
	// 查询打印模板信息
	onGetTemplatePrintAll: function(filter, startPage, pageRow) {
		
		var self = this;
		var url = this.getServiceUrl('model/select');
		Utils.doRetrieve(url, filter, startPage, pageRow, self.totalRow).then(function(result) {
			self.recordSet = result.list;
			self.startPage = result.startPage;
			self.pageRow = result.pageRow;
			self.totalRow = result.totalRow;
			self.filter = filter;
			self.fireEvent('getAll', '', self);
		},
		function(errMsg){
			self.fireEvent('getAll', errMsg, self);
		});
	},

	// 增加
	onCreateTemplatePrint: function(templatePrint,$this) {
		var self = this;
		var url = this.getServiceUrl('model/create');
		let myData={
			modellist:[templatePrint]
		}
		Utils.doUpdateService(url, myData).then(function (result) {
				self.recordSet = result.object;
				self.mySelf=$this;
				self.fireEvent('create', '', self);
        }, function (errMsg) {
            self.fireEvent('create', errMsg, self);
        });
	},


	// 修改
	onUpdateTemplatePrint: function (templatePrint) {
        var self = this;
		var url = this.getServiceUrl('model/update');
		let myData={
			modellist:[templatePrint]
		}
        Utils.doUpdateService(url, myData).then(function (result) {
				self.recordSet = result.object;
				self.fireEvent('update','',self);
        }, function (errMsg) {
            self.fireEvent('update', errMsg, self);
        });
    },

	// 删除
	onDeleteTemplatePrint: function(uuid) {
		var url = this.getServiceUrl('model/remove');
		Utils.recordDelete(this, uuid, url);
	},
});

module.exports = TemplatePrintStore;
