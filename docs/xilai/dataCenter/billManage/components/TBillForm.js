'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'antd';
const FormItem = Form.Item;



module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: '账单表', cols: ['uuid','billNo','billDate','orgNo','orgName','profitAmount','createTime','active'], func: 'getManageBillColumns' }
	],
	

	getManageBillColumns: function (form) {
		var columns = [
			{
				title: 'uuid',
				dataIndex: 'uuid',
				key: 'uuid',
				width: 140
			},
			{
				title: '账单编号',
				dataIndex: 'billNo',
				key: 'billNo',
				width: 140
			},
			{
				title: '账单日期',
				dataIndex: 'billDate',
				key: 'billDate',
				width: 140
			},
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
			{
				title: '分成金额',
				dataIndex: 'profitAmount',
				key: 'profitAmount',
				width: 140
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: 140
			},
			{
				title: '是否有效(1:有效，0:失效)',
				dataIndex: 'active',
				key: 'active',
				width: 140
			}
		];

		return columns;
	}
};

