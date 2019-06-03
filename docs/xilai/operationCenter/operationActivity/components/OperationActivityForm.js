'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input,Tooltip,Icon,Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import DictSelect from '../../../../lib/Components/DictSelect';

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'OperationActivityTable', cols: ['orgNo','orgName','size',], func: 'getOrganizationInfoTableColumns' }
	],
	
	initFilterForm(data){
		data.orgName = '';
      	data.orgNo = '';
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
			{ id: 'orgName', desc: '机构名称', max: '50', ...attrMap.orgName },
		    { id: 'orgNo', desc: '机构编号', max: '50', ...attrMap.orgNo },
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
        var type = Common.getUserType();
        if(type==3){
            var items = '';
            return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
		}else{
            var items = [
                <FormItem {...itemLayouts[0] } key='orgName' label='机构名称'  colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}  className={layoutItem} >
                    <Input type='text' name='orgName' id='orgName' value={data.orgName} onChange={form.handleOnChange}    {...attrMap.orgName} placeholder='输入机构名称'/>
                </FormItem >,
                <FormItem {...itemLayouts[0] } key='orgNo' label='机构编号'  colon={true} help={hints.orgNoHint} validateStatus={hints.orgNoStatus}  className={layoutItem} >
                    <Input type='text' name='orgNo' id='orgNo' value={data.orgNo} onChange={form.handleOnChange}    {...attrMap.orgNo} placeholder='输入机构编号'/>
                </FormItem >,
            ];
            return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
		}
	},
	getOrganizationInfoTableColumns: function (form) {
		var columns = [
			{
				title: '机构编号',
				dataIndex: 'orgNo',
				key: 'orgNo',
				width: 140
			},
			{
				title: '机构名称',
				dataIndex: 'orgName',
				key: 'orgName',
				width: 140
			},
			// {
			// 	title: <div>
             //        二维码选择尺寸
             //        <Tooltip placement="topLeft" title='30cm*30cm，建议扫描距离1.5米 15cm*15cm，建议扫描距离1米 8cm*8cm，建议扫描距离0.5米'>
             //            <Icon type="exclamation-circle-o" style={{marginLeft:10}} />
             //        </Tooltip>
             //    </div>,
			// 	dataIndex: 'size',
			// 	key: 'size',
			// 	width: 140,
             //    render:function (text,record) {
             //        return (<div>
			// 					<Select defaultValue="30" style={{ width: 120 }} onChange={form.handleSize.bind(form,record)}>
			// 						<Option value="30">30cm*30cm</Option>
			// 						<Option value="15">15cm*15cm</Option>
			// 						<Option value="8">8cm*8cm</Option>
			// 					</Select>
			// 				</div>)
             //    }
			// },
		];

		return columns;
	}
};

