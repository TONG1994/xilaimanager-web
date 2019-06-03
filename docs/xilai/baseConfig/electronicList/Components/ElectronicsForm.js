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
        { name: 'ElectronicsTable', cols: ['uuid','logisticsCompanyName','networkAddressId','establishTime','upgradeTime'], func: 'getElectronicsTableColumns' }
    ],

    initElectronicsForm(data){
        data.logisticsCompanyId = '';
        data.networkAddressId = '';
        data.secretKey = '';
    },

    getElectronicsFormRule: function (form, attrList)
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
            { id: 'logisticsCompanyId', desc: '快递公司', required: true, max: '50', ...attrMap.logisticsCompanyId },
            { id: 'networkAddressId', desc: '服务站ID', required: true, max: '50', ...attrMap.networkAddressId },
            { id: 'secretKey', desc: '密钥', required: true, max: '50', ...attrMap.secretKey }
        ];

        return rules;
    },

    getElectronicsForm: function (form, data, attrList, labelWidths, layout) {
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
            <FormItem {...itemLayouts[3] } key='logisticsCompanyId' label='快递公司' required={true} colon={true} help={hints.logisticsCompanyIdHint} validateStatus={hints.logisticsCompanyIdStatus} newLine={true} className={layoutItem} >
                {attr.objMap.logisticsCompanyId}
            </FormItem>,
            <FormItem {...itemLayouts[3] } key='networkAddressId' label='服务站ID' required={true} colon={true} help={hints.networkAddressIdHint} validateStatus={hints.networkAddressIdStatus} newLine={true} className={layoutItem} >
                <Input type='text' name='networkAddressId' id='networkAddressId' value={data.networkAddressId} onChange={form.handleOnChange}    {...attrMap.networkAddressId} placeholder='输入服务站ID'/>
            </FormItem >,
            <FormItem {...itemLayouts[3] } key='secretKey' label='密钥' required={true} colon={true} help={hints.secretKeyHint} validateStatus={hints.secretKeyStatus} newLine={true} className={layoutItem} >
                <Input type='password' name='secretKey' id='secretKey' value={data.secretKey} onChange={form.handleOnChange}    {...attrMap.secretKey} placeholder='输入密钥'/>
            </FormItem >

        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },

    getElectronicsTableColumns: function (form) {
        var columns = [
            // {
            //     title: '唯一标识',
            //     dataIndex: 'uuid',
            //     key: 'uuid',
            //     width: 140
            // },
            {
                title: '快递公司名称',
                dataIndex: 'logisticsCompanyName',
                key: 'logisticsCompanyName',
                width: 140
            },
            {
                title: '服务站ID',
                dataIndex: 'networkAddressId',
                key: 'networkAddressId',
                width: 140
            },
            {
                title: '创建时间',
                dataIndex: 'establishTime',
                key: 'establishTime',
                width: 140
            },
            {
                title: '修改时间',
                dataIndex: 'upgradeTime',
                key: 'upgradeTime',
                width: 140
            }
        ];

        return columns;
    }
};

