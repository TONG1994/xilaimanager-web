'use strict';

import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;
import FormUtil from '../../../../lib/Components/FormUtil';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [
        { name: 'StoreInfoTable', cols: ['orgUuid','orgName','businessCategory','merchantName','phone','provinces'], func: 'getStoreInfoTableColumns' }
    ],
    initFilterForm(data){
        data.orgType = '';
        data.orgName = '';
        data.provinces='';
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
            { id: 'orgType', desc: '机构类型', max: '10', ...attrMap.orgType },
            { id: 'orgName', desc: '机构名称', max: '50', ...attrMap.orgName },
            { id: 'provinces', desc: '省市区', max: '50', ...attrMap.provinces }
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
            <FormItem {...itemLayouts[0] } key='orgName' label='门店名称'  colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}  className={layoutItem} >
                <Input type='text' name='orgName' id='orgName' value={data.orgName} onChange={form.handleOnChange}    placeholder='输入门店名称' {...attrMap.orgName}/>
            </FormItem>,
            <FormItem {...itemLayouts[0] } key='provinces' label='所在地区'  colon={true} help={hints.provincesHint} validateStatus={hints.provincesStatus}  className={layoutItem} >
                {/*{attr.objMap.provinces}*/}
                <Input type='text' name='provinces' id='provinces' value={data.provinces} onChange={form.handleOnChange}    placeholder='输入省市区' {...attrMap.provinces}/>
            </FormItem>,

        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    getStoreInfoTableColumns: function (form) {
        var columns = [
            {
                title: 'APPID',
                dataIndex: 'orgUuid',
                key: 'orgUuid',
                width: 100
            },
            {
                title: '门店名称',
                dataIndex: 'orgName',
                key: 'orgName',
                width: 100
            },
            // {
            //     title: '经营品类',
            //     dataIndex: 'businessCategory',
            //     key: 'businessCategory',
            //     width: 100
            // },
            {
                title: '经营品类',
                dataIndex: 'businessCategory',
                key: 'businessCategory',
                width: 100,
                render:(text,record)=>{
                    let orderSource='';
                    switch(text){
                        case '0':
                            orderSource='快递驿站';
                            break;
                        case '1':
                            orderSource='超市便利站';
                            break;
                        case '2':
                            orderSource='美食店';
                            break;
                        case '3':
                            orderSource='其他';
                            break;
                    }
                    return <span>{orderSource}</span>
                }
            },
            {
                title: '门店负责人',
                dataIndex: 'merchantName',
                key: 'merchantName',
                width: 100
            },
            {
                title: '联系方式',
                dataIndex: 'phone',
                key: 'phone',
                width: 100
            },
            {
                title: '省市区',
                dataIndex: 'provinces',
                key: 'provinces',
                width: 100
            },
        ];

        return columns;
    }
};

