'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'antd';
const FormItem = Form.Item;



module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'tradingFlowTable', 
		  cols: ['tradingNo','orderNo','orderOrginalName','logisticsCompanyName',
		
		'fromOrgName','toOrgName','tradingTypeName','tradingAmount','createTime'],
		 func: 'getTradingFlowTableColumns' }
	],
	

	getTradingFlowTableColumns: function (form) {
		var columns = [
			{
				title: '流水编号',
				dataIndex: 'tradingNo',
				key: 'tradingNo',
				width: 140
			},
			
			{
				title: '订单编号',
				dataIndex: 'orderNo',
				key: 'orderNo',
				width: 140
			},
			{
				title: '订单来源',
				dataIndex: 'orderOrginalName',
				key: 'orderOrginalName',
				width: 140
			},
			{
				title: '快递公司',
				dataIndex: 'logisticsCompanyName',
				key: 'logisticsCompanyName',
				width: 140
			},
			
			{
				title: '支出方',
				dataIndex: 'fromOrgName',
				key: 'fromOrgName',
				width: 140
			},
			
			{
				title: '收入方',
				dataIndex: 'toOrgName',
				key: 'toOrgName',
				width: 140
			},
			{
				title: '流水分类',
				dataIndex: 'tradingTypeName',
				key: 'tradingTypeName',
				width: 140
			},
			{
				title: '金额（元）',
				dataIndex: 'tradingAmount',
				key: 'tradingAmount',
				width: 140
			},
			{
				title: '流水创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: 140
			},
		];

		return columns;
	}
};

