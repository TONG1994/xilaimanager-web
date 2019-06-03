

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Tooltip, Icon, Select } from 'antd';
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
        { name: 'GroupMsgTable', cols: ['messageTypeName', 'sendtime', 'notifyobjectName', 'numbernum', 'sendtypeName'], func: 'getOrganizationInfoTableColumns' }
    ],
    initFilterForm(data) {
        data.messageType = '';
      	data.sendtype = '';
    },

    getFilterFormRule: function (form, attrList) {
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
            { id: 'messageType', desc: '短信类型', max: '50', ...attrMap.messageType },
            { id: 'sendtype', desc: '发送状态', max: '50', ...attrMap.sendtype },
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
        var messageTypeValue=data.messageType;
        var sendtypeValue=data.sendtype;

        if(messageTypeValue == ''){
            messageTypeValue ='-请选择-'
        }
        if(sendtypeValue == ''){
            sendtypeValue ='-请选择-'
        }
        var items = [
            <FormItem {...itemLayouts[0]} key='messageType' id='messageType' label='短信类型' colon={true} help={hints.messageTypeHint} validateStatus={hints.messageTypeStatus} className={layoutItem} >
                <Select value={data.messageType} onChange={form.messageTypeChange}>
                    <Option value=''>-请选择-</Option>
                    <Option value='versions-update'>版本更新通知</Option>
                </Select>
            </FormItem >,
            <FormItem {...itemLayouts[0]} key='sendtype' id='sendtype' label='发送状态' colon={true} help={hints.sendtypeHint} validateStatus={hints.sendtypeStatus} className={layoutItem} >
                <Select value={data.sendtype} onChange={form.sendtypeChange}>
                    <Option value=''>-请选择-</Option>
                    <Option value='0'>未发送</Option>
                    <Option value='1'>已发送（发送成功）</Option>
                    <Option value='2'>已发送（发送失败）</Option>
                </Select>
            </FormItem >,
        ];
        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    getOrganizationInfoTableColumns: function (form) {
        var columns = [
            {
                title: '短信类型',
                dataIndex: 'messageTypeName',
                key: 'messageTypeName',
                width: 60
            },
            {
                title: '发送时间',
                dataIndex: 'sendtime',
                key: 'sendtime',
                width: 75
            },
            // {
            //     title: '通知对象',
            //     dataIndex: 'notifyobjectName',
            //     key: 'notifyobjectName',
            //     width: 40
            // },
            {
                title: '号码数量',
                dataIndex: 'numbernum',
                key: 'numbernum',
                width: 40
            },
            {
                title: '发送状态',
                dataIndex: 'sendtypeName',
                key: 'sendtypeName',
                width: 60
            },
        ];

        return columns;
    }
};

