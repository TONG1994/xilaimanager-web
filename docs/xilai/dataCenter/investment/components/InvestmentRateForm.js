'use strict';

import React from 'react';
import { Form } from 'antd';
const FormItem = Form.Item;


module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [
        { name: 'investmentRateTable', cols: ['orgName','logisticsCompanyName','entryCounts','normalReceiptCounts','abnormalReceiptCounts','courierName','entryTime','deliveryRate'], func: 'getInvestRateTableColumns' }
    ],

    getInvestRateTableColumns: function (form) {
        var columns = [
            {
                title: '机构名称',
                dataIndex: 'orgName',
                key: 'orgName',
                width: 140
            },
            {
                title: '快递公司',
                dataIndex: 'logisticsCompanyName',
                key: 'logisticsCompanyName',
                width: 140
            },
            {
                title: '入库量',
                dataIndex: 'entryCounts',
                key: 'entryCounts',
                width: 140
            },
            {
                title: '正常签收量',
                dataIndex: 'normalReceiptCounts',
                key: 'normalReceiptCounts',
                width: 140
            },
            {
                title: '异常签收量',
                dataIndex: 'abnormalReceiptCounts',
                key: 'abnormalReceiptCounts',
                width: 140
            },
            {
                title: '快递员',
                dataIndex: 'courierName',
                key: 'courierName',
                width: 140
            },
            {
                title: '日期',
                dataIndex: 'entryTime',
                key: 'entryTime',
                width: 140
            },
            {
                title: '妥投率',
                dataIndex: 'deliveryRate',
                key: 'deliveryRate',
                width: 140
            },
        ];

        return columns;
    }
};

