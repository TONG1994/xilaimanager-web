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
		{ name: 'printTemplateTable', cols: ['logisticsCompanyName','expresstemplate','createtime','updatetime'], func: 'getPrintTemplateTableColumns' }
	],
	
	getPrintTemplateTableColumns: function (form) {
		var columns = [
			{
				title: '快递公司',
				dataIndex: 'logisticsCompanyName',
				key: 'logisticsCompanyName',
				width: 140
			},
			{
				title: '快递模板名称',
				dataIndex: 'expresstemplate',
				key: 'expresstemplate',
				width: 140
			},
			{
				title: '创建时间',
				dataIndex: 'createtime',
				key: 'createtime',
				width: 140
			},
			{
				title: '修改时间',
				dataIndex: 'updatetime',
				key: 'updatetime',
				width: 140
			}
		];

		return columns;
	},

	//修改表单
	initCreateTemplatePrintForm(data){
		data.logisticsCompanyName = '';
		data.expresstemplate = '';
		data.base64pic = '';
		data.preView = '';
	},


	getUpdateTemplatePrintFormRule: function (form, attrList)
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
			{ id: 'logisticsCompanyName', desc: '快递公司', required: true, max: '50', ...attrMap.logisticsCompanyName },
			{ id: 'expresstemplate', desc: '模板名称', required: true, max: '50', ...attrMap.expresstemplate },
			{ id: 'base64pic', desc: '快递模板', max: '50', ...attrMap.base64pic },
			{ id: 'preView', desc: '模板预览', ...attrMap.preView }
		];

		return rules;
	},
	
	getUpdateTemplatePrintForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [16, 8, 6, 4];
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
			<FormItem {...itemLayouts[1] } key='logisticsCompanyName' label='快递公司' required={true} colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='logisticsCompanyName' id='logisticsCompanyName' value={data.logisticsCompanyName} onChange={form.handleOnChange}    placeholder='请输入模板名称' {...attrMap.logisticsCompanyName}/>
			</FormItem >,
			<FormItem {...itemLayouts[1] } key='expresstemplate' label='模板名称' required={true} colon={true} help={hints.expresstemplateHint} validateStatus={hints.expresstemplateStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='expresstemplate' id='expresstemplate' value={data.expresstemplate} onChange={form.handleOnChange}    placeholder='请输入模板名称' {...attrMap.expresstemplate}/>
			</FormItem >,
			<FormItem {...itemLayouts[1] } key='base64pic' label='快递模板'  colon={true} help={hints.base64picHint} validateStatus={hints.base64picStatus} newLine={true} className={layoutItem} >
				{attr.objMap.base64pic}
			</FormItem >,
			<FormItem {...itemLayouts[1] } key='preView' label='模板预览'  colon={true} help={hints.preViewHint} validateStatus={hints.preViewStatus}  newLine={true} className={layoutItem} >
				{attr.objMap.preView}
			</FormItem >
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

	//新增表单
	initCreateTemplatePrintForm(data){
		data.logisticsCompanyName = '';
		data.expresstemplate = '';
		data.base64pic = '';
		data.preView = '';
	},

	getCreateTemplatePrintFormRule: function (form, attrList)
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
			{ id: 'logisticsCompanyName', desc: '快递公司', required: true, max: '50', ...attrMap.logisticsCompanyName },
			{ id: 'expresstemplate', desc: '模板名称', required: true, max: '50', ...attrMap.expresstemplate },
			{ id: 'base64pic', desc: '快递模板', max: '50', ...attrMap.base64pic },
			{ id: 'preView', desc: '模板预览', ...attrMap.preView }
		];

		return rules;
	},
	
	getCreateTemplatePrintForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [16, 8, 6, 4];
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
			<FormItem {...itemLayouts[1]} key='logisticsCompanyName' label='快递公司' required={true} colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus} newLine={true} className={layoutItem} >
				{attr.objMap.logisticsCompanyName}
			</FormItem>,
			<FormItem {...itemLayouts[1] } key='expresstemplate' label='模板名称' required={true} colon={true} help={hints.expresstemplateHint} validateStatus={hints.expresstemplateStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='expresstemplate' id='expresstemplate' value={data.expresstemplate} onChange={form.handleOnChange}    placeholder='请填写模板名称' {...attrMap.expresstemplate}/>
			</FormItem >,
			<FormItem {...itemLayouts[1] } key='base64pic' label='快递模板' colon={true} help={hints.base64picHint} validateStatus={hints.base64picStatus} newLine={true} className={layoutItem} >
				{attr.objMap.base64pic}
			</FormItem >,
			<FormItem {...itemLayouts[1] } key='preView' label='模板预览'  colon={true} help={hints.preViewHint} validateStatus={hints.preViewStatus}  newLine={true} className={layoutItem} >
				{attr.objMap.preView}
			</FormItem >
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

};

