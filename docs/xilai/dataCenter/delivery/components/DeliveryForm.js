'use strict';

import React from 'react';
import { Form } from 'antd';
const FormItem = Form.Item;


module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [
        { name: 'deliveryTable', cols: ['logisticsNo','logisticsCompanyName','organizationName','entryOperator','courierName','receiverName','receiverPhone','shelfNumber','entryTime','signatureTime','orderStatus','thirdOrderStatus','signRemark'], func: 'getDeliveryTableColumns' }
    ],

    getDeliveryTableColumns: function (form) {
        var columns = [
            {
                title: '物流单号',
                dataIndex: 'logisticsNo',
                key: 'logisticsNo',
                fixed: 'left',
                width: 140
            },
            {
                title: '快递公司',
                dataIndex: 'logisticsCompanyName',
                key: 'logisticsCompanyName',
                width: 140
            },
            {
                title: '机构名称',
                dataIndex: 'organizationName',
                key: 'organizationName',
                width: 140
            },
            {
                title: '入库人姓名',
                dataIndex: 'entryOperator',
                key: 'entryOperator',
                width: 140
            },
            {
                title: '派件人姓名',
                dataIndex: 'courierName',
                key: 'courierName',
                width: 140
            },
            {
                title: '收件人姓名',
                dataIndex: 'receiverName',
                key: 'receiverName',
                width: 140
            },
            {
                title: '收件人电话',
                dataIndex: 'receiverPhone',
                key: 'receiverPhone',
                width: 140
            },
            {
                title: '货架号',
                dataIndex: 'shelfNumber',
                key: 'shelfNumber',
                width: 140
            },
            {
                title: '入库时间',
                dataIndex: 'entryTime',
                key: 'entryTime',
                width: 140
            },
            {
                title: '签收时间',
                dataIndex: 'signatureTime',
                key: 'signatureTime',
                width: 140
            },
            {
                title: '喜来签收状态',
                dataIndex: 'orderStatus',
                key: 'orderStatus',
                width: 140,
                render:(text,record)=>{
                    let orderSource='';
                    switch(text){
                        case '0':
                            orderSource='入库';
                            break;
                        case '1':
                            orderSource='正常签收';
                            break;
                        case '2':
                            orderSource='异常签收';
                            break;
                    }
                    return <span>{orderSource}</span>
                }
            },
            {
                title: '三方签收状态',
                dataIndex: 'thirdOrderStatus',
                key: 'thirdOrderStatus',
                width: 140,
                render:(text,record)=>{
                    let orderSource='';
                    switch(text){
                        case '1':
                            orderSource='正常签收';
                            break;
                        case '0':
                            orderSource='异常签收';
                            break;
                    }
                    return <span>{orderSource}</span>
                }
            },
            {
                title: '备注',
                dataIndex: 'signRemark',
                key: 'signRemark',
                width: 140
            }
        ];

        return columns;
    }
};

