'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import RoleList from '../../../lib/Components/roleList/RoleList';
/**
 *  component import
 */

module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [
        { name: 'SubAdminManageTable', cols: ['userCode','name','roleName','createTime'], func: 'getSubAdminManageTableColumns' }
    ],

    initFilterForm(data){
        data.name = '';
        data.phone = '';
        data.roleName = '';
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
            { id: 'name', desc: '用户名称', max: '50', ...attrMap.name },
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
            <FormItem {...itemLayouts[0] } key='name' label='用户名称'  colon={true} help={hints.nameHint} validateStatus={hints.nameStatus}  className={layoutItem} >
                <Input type='text' name='name' id='name' value={data.name} onChange={form.handleOnChange}    {...attrMap.name} placeholder='输入用户名称'/>
            </FormItem >,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    initSubAdminManageForm(data){
        // data.addUserType = '';
        data.name = '';
        data.phone = '';
        data.roleName = '';
    },

    getSubAdminManageFormRule: function (form, attrList)
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
            { id: 'name', desc: '姓名',required: true, max: '20', ...attrMap.name },
            { id: 'phone', desc: '手机号码',required: true,dataType:'mobile', min:'11',max: '11', ...attrMap.phone },
            { id: 'roleName', desc: '角色名称',required: true, max: '100', ...attrMap.roleName },
        ];

        return rules;
    },

    getSubAdminManageForm: function (form, data, attrList, labelWidths, layout,disabled) {
        if (!disabled) {
            disabled = false;
        }
        if (!labelWidths) {
            labelWidths = [16, 8, 6, 6];
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
            <FormItem {...itemLayouts[3] } key='name' label='姓名' required={true} colon={true} help={hints.nameHint} validateStatus={hints.nameStatus} newLine={true} className={layoutItem} >
                <Input type='text' name='name' id='name' value={data.name} onChange={form.handleOnChange}    placeholder='输入姓名' {...attrMap.name} disabled={disabled}/>
            </FormItem >,
            <FormItem {...itemLayouts[3] } key='phone' label='手机号码' required={true} colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus} newLine={true} className={layoutItem} >
                <Input type='text' name='phone' id='phone' value={data.phone} onChange={form.handleOnChange}    placeholder='输入手机号码' {...attrMap.phone} disabled={disabled}/>
            </FormItem >,
            <FormItem {...itemLayouts[3] } key='roleName' label='角色名称' required={true} colon={true} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}  className={layoutItem} >
                {attr.objMap.roleName}
            </FormItem>,

        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    getSubAdminManageTableColumns: function (form) {
        var columns = [
            {
                title: '工号',
                dataIndex: 'userCode',
                key: 'userCode',
                width: 140
            },
            {
                title: '用户名称',
                dataIndex: 'name',
                key: 'name',
                width: 140
            },
            {
                title: '角色名称',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 140
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 140
            },
        ];

        return columns;
    }
};

