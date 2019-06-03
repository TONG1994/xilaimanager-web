'use strict';

import React from 'react';
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
        { name: 'profitSharingTable', cols: ['logisticsCompanyName','transportTypeName','orgName','thirdpartyProfit','headquartersProfit','businessCenterProfit','branchProfit'], func: 'getProfitSharingTableColumns' },
        { name: 'profitSharingTables', cols: ['orgName','logisticsCompanyName','transportTypeName','thirdpartyProfit','businessCenterProfit','branchProfit'], func: 'getProfitSharingTablesColumns' },
        { name: 'profitSharingsTable', cols: ['logisticsCompanyName','transportTypeName','thirdpartyProfit','headquartersProfit','businessCenterProfit','branchProfit'], func: 'getProfitSharingsTableColumns' },
        { name: 'profitSharingsTables', cols: ['logisticsCompanyName','transportTypeName','thirdpartyProfit','businessCenterProfit','branchProfit'], func: 'getProfitSharingsTablesColumns' }
    ],

    initProfitSharingForm(data){
        data.fromWhere = '';
        data.logisticsCompanyName = '';
    },

    getProfitSharingFormRule: function (form, attrList)
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
            { id: 'fromWhere', desc: '数据来源', ...attrMap.fromWhere },
            { id: 'logisticsCompanyName', desc: '快递公司', ...attrMap.logisticsCompanyName }
        ];

        return rules;
    },

    getProfitSharingForm: function (form, data, attrList, labelWidths, layout) {
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
            <FormItem {...itemLayouts[1] } key='fromWhere' label='数据来源'  colon={true} help={hints.fromWhereHint} validateStatus={hints.fromWhereStatus}  className={layoutItem} >
                {attr.objMap.fromWhere}
            </FormItem>,
            <FormItem {...itemLayouts[1] } key='logisticsCompanyName' label='快递公司'  colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus}  className={layoutItem} >
                {attr.objMap.logisticsCompanyName}
            </FormItem>

        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },

    getProfitSharingTableColumns: function (form) {
        var columns = [
            {
                title: '快递公司',
                dataIndex: 'logisticsCompanyName',
                key: 'logisticsCompanyName',
                width: 140
            },
            {
                title: '运输方式',
                dataIndex: 'transportTypeName',
                key: 'transportTypeName',
                width: 140
            },
            {
                title: '数据来源',
                dataIndex: 'orgName',
                key: 'orgName',
                width: 140
            },
            {
                title: '三方分成比例',
                dataIndex: 'thirdpartyProfit',
                key: 'thirdpartyProfit',
                width: 140
            },
            {
                title: '总部分成比例',
                dataIndex: 'headquartersProfit',
                key: 'headquartersProfit',
                width: 140
            },
            {
                title: '经营中心分成比例',
                dataIndex: 'businessCenterProfit',
                key: 'businessCenterProfit',
                width: 140
            },
            {
                title: '服务站分成比例',
                dataIndex: 'branchProfit',
                key: 'branchProfit',
                width: 140
            },
            // {
            //     title: '经营中心+服务站比例',
            //     dataIndex: 'extraProfit',
            //     key: 'extraProfit',
            //     width: 140
            // }
        ];

        return columns;
    },

    getProfitSharingTablesColumns: function (form) {
        var columns = [
            {
                title: '数据来源',
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
                title: '运输方式',
                dataIndex: 'transportTypeName',
                key: 'transportTypeName',
                width: 140
            },
            {
                title: '三方分成比例',
                dataIndex: 'thirdpartyProfit',
                key: 'thirdpartyProfit',
                width: 140
            },
            {
                title: '经营中心分成比例',
                dataIndex: 'businessCenterProfit',
                key: 'businessCenterProfit',
                width: 140
            },
            {
                title: '服务站分成比例',
                dataIndex: 'branchProfit',
                key: 'branchProfit',
                width: 140
            }
        ];

        return columns;
    },

    getProfitSharingsTableColumns: function (form) {
        var columns = [
            {
                title: '快递公司',
                dataIndex: 'logisticsCompanyName',
                key: 'logisticsCompanyName',
                width: 140
            },
            {
                title: '运输方式',
                dataIndex: 'transportTypeName',
                key: 'transportTypeName',
                width: 140
            },
            {
                title: '三方分成比例',
                dataIndex: 'thirdpartyProfit',
                key: 'thirdpartyProfit',
                width: 140,
                render:function (text) {
                    if(text || text == null || text == ""){
                        return '--'
                    }
                    return text
                }
            },
            {
                title: '总部分成比例',
                dataIndex: 'headquartersProfit',
                key: 'headquartersProfit',
                width: 140,
                render:function (text) {
                    if(text || text == null || text == ""){
                        return '--'
                    }
                    return text
                }
            },
            {
                title: '经营中心分成比例',
                dataIndex: 'businessCenterProfit',
                key: 'businessCenterProfit',
                width: 140
            },
            {
                title: '服务站分成比例',
                dataIndex: 'branchProfit',
                key: 'branchProfit',
                width: 140
            }
        ];

        return columns;
    },

    getProfitSharingsTablesColumns: function (form) {
        var columns = [
            {
                title: '快递公司',
                dataIndex: 'logisticsCompanyName',
                key: 'logisticsCompanyName',
                width: 140
            },
            {
                title: '运输方式',
                dataIndex: 'transportTypeName',
                key: 'transportTypeName',
                width: 140
            },
            {
                title: '三方分成比例',
                dataIndex: 'thirdpartyProfit',
                key: 'thirdpartyProfit',
                width: 140
            },
            {
                title: '经营中心分成比例',
                dataIndex: 'businessCenterProfit',
                key: 'businessCenterProfit',
                width: 140
            },
            {
                title: '服务站分成比例',
                dataIndex: 'branchProfit',
                key: 'branchProfit',
                width: 140
            }
        ];

        return columns;
    }
};

