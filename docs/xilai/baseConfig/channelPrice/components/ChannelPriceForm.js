'use strict';

import React from 'react';
import { Form } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';

module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [
        { name: 'channelPriceTable', cols: ['logisticsCompanyName','transportTypeName','origin','destination','orgName','section1','firstWeightPrice1','firstWeight1','furtherWeightPrice1','section2','firstWeightPrice2','firstWeight2','furtherWeightPrice2','section3','firstWeightPrice3','firstWeight3','furtherWeightPrice3'], func: 'getChannelPriceTableColumns' }
    ],

    initChannelPriceForm(data){
        data.fromWhere = '';
        data.logisticsCompanyName = '';
        data.origin = '';
        data.destination = '';
    },

    getChannelPriceFormRule: function (form, attrList)
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

    getChannelPriceForm: function (form, data, attrList, labelWidths, layout) {
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
            <FormItem {...itemLayouts[0] } key='fromWhere' label='数据来源'  colon={true} help={hints.fromWhereHint} validateStatus={hints.fromWhereStatus}  className={layoutItem} >
                {attr.objMap.fromWhere}
            </FormItem>,
            <FormItem {...itemLayouts[0] } key='logisticsCompanyName' label='快递公司'  colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus}  className={layoutItem} >
                {attr.objMap.logisticsCompanyName}
            </FormItem>,
            <FormItem {...itemLayouts[0] } key='origin' label='始发地' colon={true} help={hints.originHint} validateStatus={hints.originStatus} className={layoutItem} >
                {attr.objMap.origin}
            </FormItem>,
            <FormItem {...itemLayouts[0] } key='destination' label='目的地' colon={true} help={hints.destinationHint} validateStatus={hints.destinationStatus} className={layoutItem} >
                {attr.objMap.destination}
            </FormItem>,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    initChannelPricesForm(data){
        data.logisticsCompanyName = '';
        data.origin = '';
        data.destination = '';
    },

    getChannelPricesFormRule: function (form, attrList)
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
            { id: 'logisticsCompanyName', desc: '快递公司', ...attrMap.logisticsCompanyName }
        ];

        return rules;
    },

    getChannelPricesForm: function (form, data, attrList, labelWidths, layout) {
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
            <FormItem {...itemLayouts[0] } key='logisticsCompanyName' label='快递公司'  colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus}  className={layoutItem} >
                {attr.objMap.logisticsCompanyName}
            </FormItem>,
            <FormItem {...itemLayouts[0] } key='destination' label='目的地' colon={true} help={hints.destinationHint} validateStatus={hints.destinationStatus} className={layoutItem} >
                {attr.objMap.destination}
            </FormItem>,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },

    getChannelPriceTableColumns: function (form) {
        var columns = [
            {
                title: '快递公司',
                dataIndex: 'logisticsCompanyName',
                key: 'logisticsCompanyName',
                fixed: 'left',
                width: 140
            },
            {
                title: '运输方式',
                dataIndex: 'transportTypeName',
                key: 'transportTypeName',
                width: 140
            },
            {
                title: '始发地',
                dataIndex: 'origin',
                key: 'origin',
                width: 140
            },
            {
                title: '目的地',
                dataIndex: 'destination',
                key: 'destination',
                width: 140
            },
            {
                title: '数据来源',
                dataIndex: 'orgName',
                key: 'orgName',
                width: 140
            },
            {
                title: '总重区间1',
                dataIndex: 'section1',
                key: 'section1',
                width: 140
            },
            {
                title: '首重价格1',
                dataIndex: 'firstWeightPrice1',
                key: 'firstWeightPrice1',
                width: 140
            },
            {
                title: '首重重量1',
                dataIndex: 'firstWeight1',
                key: 'firstWeight1',
                width: 140
            },
            {
                title: '续重价格1',
                dataIndex: 'furtherWeightPrice1',
                key: 'furtherWeightPrice1',
                width: 140
            },
            {
                title: '总重区间2',
                dataIndex: 'section2',
                key: 'section2',
                width: 140
            },
            {
                title: '首重价格2',
                dataIndex: 'firstWeightPrice2',
                key: 'firstWeightPrice2',
                width: 140
            },
            {
                title: '首重重量2',
                dataIndex: 'firstWeight2',
                key: 'firstWeight2',
                width: 140
            },
            {
                title: '续重价格2',
                dataIndex: 'furtherWeightPrice2',
                key: 'furtherWeightPrice2',
                width: 140
            },
            {
                title: '总重区间3',
                dataIndex: 'section3',
                key: 'section3',
                width: 140
            },
            {
                title: '首重价格3',
                dataIndex: 'firstWeightPrice3',
                key: 'firstWeightPrice3',
                width: 140
            },
            {
                title: '首重重量3',
                dataIndex: 'firstWeight3',
                key: 'firstWeight3',
                width: 140
            },
            {
                title: '续重价格3',
                dataIndex: 'furtherWeightPrice3',
                key: 'furtherWeightPrice3',
                width: 140
            }
        ];

        return columns;
    }
};

