'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import DictSelect from '../../../../lib/Components/DictSelect';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'AddressTable', cols: ['addrType','name','phone','sheng','shi','qu','addrDetail','addUserName','addUserType','editTime',], func: 'getOrganizationInfoTableColumns' }
	],
	
	initFilterForm(data){
		// data.addUserType = '';
		data.name = '';
      	data.phone = '';
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
			// { id: 'addUserType', desc: '添加人角色', max: '50', ...attrMap.addUserType },
			{ id: 'name', desc: '姓名', max: '50', ...attrMap.name },
		    { id: 'phone', desc: '联系方式', max: '20', ...attrMap.phone },
		];

		return rules;
	},
	
	getFilterForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [8, 8, 6, 4];
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
			<FormItem {...itemLayouts[0] } key='phone' label='联系方式'  colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus}  className={layoutItem} >
				<Input type='text' name='phone' id='phone' value={data.phone} onChange={form.handleOnChange}    {...attrMap.phone} placeholder='输入联系方式'/>
			</FormItem >,
			<FormItem {...itemLayouts[0] } key='name' label='姓名'  colon={true} help={hints.nameHint} validateStatus={hints.nameStatus}  className={layoutItem} >
				<Input type='text' name='name' id='name' value={data.name} onChange={form.handleOnChange}    {...attrMap.name} placeholder='输入姓名'/>
			</FormItem >,
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
	getOrganizationInfoTableColumns: function (form) {
		var columns = [
			{
				title: '地址类型',
				dataIndex: 'addrType',
				key: 'addrType',
				width: 140,
			    render:(text, record)=>{
				  let add='--';
                  if(text=='1'){
                    add = '发件地址';
				  }else if(text=='2'){
                    add = '收件地址';
				  }
				  return add;
				}
			},
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: 140
			},
			{
				title: '联系方式',
				dataIndex: 'phone',
				key: 'phone',
				width: 140
			},
			{
				title: '省',
				dataIndex: 'sheng',
				key: 'sheng',
				width: 80
			},
			{
				title: '市',
				dataIndex: 'shi',
				key: 'shi',
				width: 80
			},
			{
				title: '区',
				dataIndex: 'qu',
				key: 'qu',
				width: 80
			},
			  {
				title: '详细地址',
				dataIndex: 'addrDetail',
				key: 'addrDetail',
				width: 280
			  },
			  {
				title: '添加人姓名',
				dataIndex: 'addUserName',
				key: 'addUserName',
				width: 90
			  },
			  {
				title: '添加人角色',
				dataIndex: 'addUserType',
				key: 'addUserType',
				width: 140,
                render:(text, record)=>{
                  let addUserType='--';
                  if(text=='1'){
                    addUserType = '寄件客户';
                  }else if(text=='2'){
                    addUserType = '快递员';
                  }
                  return addUserType;
                }
			  },
			  {
				title: '最近修改时间',
				dataIndex: 'editTime',
				key: 'editTime',
				width: 200
			  }
		];

		return columns;
	}
};

