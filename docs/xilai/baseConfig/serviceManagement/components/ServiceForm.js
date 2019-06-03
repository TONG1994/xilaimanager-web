'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'ServiceManagementTable', cols: ['userCode','name','nickName','phone','mail'], func: 'getServiceManagementTableColumns' }
	],
	
	initFilterForm(data){
		data.customerName = '';
		data.customerId='';
	},

	getFilterFormRule: function (form, attrList)
	{
		var attrMap = {};
		if (attrList) {
			var count = attrList.length;
			for (var x = 0; x < count; x++) {
				var {
					name,
					...attrs
				} = attrList[x];

				if (attrs) attrMap[name] = attrs;
			}
		}

		var rules = [
			{ id: 'customerName', desc: '客服姓名', max: '20', ...attrMap.customerName },
			{ id: 'customerId', desc: '客服ID', max: '20', ...attrMap.customerId },
		];

		return rules;
	},
	
	getFilterForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [8, 8, 6, 8];
		}
		
		var attr = FormUtil.getParam(form, attrList);
		var attrMap = attr.attrMap;

		if (!layout) {
			layout = this.layout;
		}

		var layoutItem = 'form-item-' + layout;
		var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);
		var hints = form.state.hints;
		var items = [
			<FormItem {...itemLayouts[0]} key='perName' label='客服姓名'  colon={true} help={hints.customerNameHint} validateStatus={hints.customerNameStatus}  className={layoutItem} >
				<Input type='text'  name='perName' id='customerName' value={data.customerName} onChange={form.handleOnInputChange}    placeholder='输入客服姓名' {...attrMap.customerName}/>
			</FormItem>,
			<FormItem {...itemLayouts[0] } key='userCode' label='客服ID'  colon={true} help={hints.customerIdHint} validateStatus={hints.customerIdStatus}  className={layoutItem} >
				<Input type='text'  name='userCode' id='customerId' value={data.customerId} onChange={form.handleOnInputChange}    placeholder='输入客服ID' {...attrMap.customerId}/>
			</FormItem>,
		];
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
	initCreateForm(data){
		data.customerName = '';
		data.customerNickname = '';
		data.cutomerPhone = '';
		data.customerMail = '';
	},

	getCreateFormRule: function (form, attrList)
	{
		var attrMap = {};
		if (attrList) {
			var count = attrList.length;
			for (var x = 0; x < count; x++) {
				var {
					name,
					...attrs
				} = attrList[x];

				if (attrs) attrMap[name] = attrs;
			}
		}

		var rules = [
			{ id: 'customerName', desc: '姓名', required: true, max: '20', ...attrMap.customerName },
			{ id: 'customerNickname', desc: '昵称', required: true, max: '20', ...attrMap.customerNickname },
			{ id: 'customerPhone', desc: '联系方式', required: true,min:'11', max:'11',dataType: 'mobile', ...attrMap.customerPhone },
			{ id: 'customerMail', desc: '邮箱', required: true, max: '30',dataType: 'email', ...attrMap.customerMail },
		];

		return rules;
	},
	
	getCreateForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [16, 8, 6, 5];
		}
		
		var attr = FormUtil.getParam(form, attrList);
		var attrMap = attr.attrMap;

		if (!layout) {
			layout = this.layout;
		}

		var layoutItem = 'form-item-' + layout;
		var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);
		
		var hints = form.state.hints;
		var items = [
			<FormItem {...itemLayouts[3]} key='customerName' label='姓名' required={true} colon={true} help={hints.customerNameHint} validateStatus={hints.customerNameStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='customerName' id='customerName'  value={data.customerName} onChange={form.handleOnInputChange}    placeholder='输入姓名' required={true}    {...attrMap.customerName}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='customerNickname' label='昵称' required={true} colon={true} help={hints.customerNicknameHint} validateStatus={hints.customerNicknameStatus}  className={layoutItem} >
				<Input type='text' name='customerNickname' id='customerNickname'  value={data.customerNickname} onChange={form.handleOnInputChange}    placeholder='用于访客端聊天窗口显示' required={true}    {...attrMap.customerNickname}/>
			</FormItem>,
			
			<FormItem {...itemLayouts[3] } key='customerPhone' label='联系方式' required={true} colon={true} help={hints.customerPhoneHint} validateStatus={hints.customerPhoneStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='customerPhone' id='customerPhone' value={data.customerPhone} onChange={form.handleOnInputChange}    placeholder='输入手机号' {...attrMap.customerPhone}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='customerMail' label='邮箱' required={true} colon={true} help={hints.customerMailHint} validateStatus={hints.customerMailStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='customerMail' id='customerMail' value={data.customerMail} onChange={form.handleOnInputChange}    placeholder='输入邮箱' {...attrMap.customerMail}/>
			</FormItem>,
			

		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

	getServiceManagementTableColumns: function (form) {
		var columns = [
			{
				title: 'ID',
				dataIndex: 'userCode',
				key: 'userCode',
				width: 80
			},
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: 140
			},
           
			{
				title: '昵称',
				dataIndex: 'nickName',
				key: 'nickName',
				width: 140
			},
		  	{
				title: '手机号',
				dataIndex: 'phone',
				key: 'phone',
				width: 140
		  	},
			{
				title: '邮箱',
				dataIndex: 'mail',
				key: 'mail',
				width: 200
			},
		];

		return columns;
	}
};

