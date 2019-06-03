﻿'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
/**
 *  component import
 */

module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [
        { name: 'RoleManageTable', cols: ['roleId','roleName','createTime','editTime'], func: 'getRoleManageTableColumns' }
    ],

    initFilterForm(data){
        data.roleName = '';
        data.roleId = '';
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
            { id: 'roleName', desc: '角色名称', max: '100', ...attrMap.roleName },
            { id: 'roleId', desc: 'ID', max: '100', ...attrMap.roleId },
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
            <FormItem {...itemLayouts[0] } key='roleName' label='角色名称'  colon={true} help={hints.roleNameHint} validateStatus={hints.roleNameStatus}  className={layoutItem} >
                <Input type='text' name='roleName' id='roleName' value={data.roleName} onChange={form.handleOnChange}    {...attrMap.roleName} placeholder='输入角色名称'/>
            </FormItem >,
            <FormItem {...itemLayouts[0] } key='roleId' label='ID'  colon={true} help={hints.roleIdHint} validateStatus={hints.roleIdStatus}  className={layoutItem} >
                <Input type='text' name='roleId' id='roleId' value={data.roleId} onChange={form.handleOnChange}    {...attrMap.roleId} placeholder='输入ID'/>
            </FormItem >,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    initRoleManageForm(data){
        data.roleName = '';
    },

    getRoleManageFormRule: function (form, attrList)
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
            { id: 'roleName', desc: '角色名称', required: true, max: '100', ...attrMap.roleName },
        ];

        return rules;
    },

    getRoleManageForm: function (form, data, attrList, labelWidths, layout,disabled) {
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
            <div style={{color:'#ccc',marginBottom:10}} key='账号'>账号</div>,
            <FormItem {...itemLayouts[3] } key='roleName' label='&nbsp;&nbsp;角&nbsp;&nbsp;色&nbsp;&nbsp;名&nbsp;&nbsp;称&nbsp;&nbsp;' required={true} colon={true} help={hints.roleNameHint} validateStatus={hints.roleNameStatus} newLine={true} className={layoutItem} >
                <Input type='text' name='roleName' id='roleName' value={data.roleName} onChange={form.handleOnChange}    placeholder='输入角色名称' {...attrMap.roleName} disabled={disabled}/>
            </FormItem >,

            <div style={{color:'#ccc',marginBottom:10}} key='菜单权限'><br/>菜单权限</div>,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    getRoleManageTableColumns: function (form) {
        var columns = [
            {
                title: 'ID',
                dataIndex: 'roleId',
                key: 'roleId',
                width: 140,
            },
            {
                title: '角色名称',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 140
            },
            // {
            //   title: '所属机构',
            //   dataIndex: 'phone',
            //   key: 'phone',
            //   width: 140
            // },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 140
            },
            // {
            //     title: '创建人',
            //     dataIndex: 'phone',
            //     key: 'phone',
            //     width: 140
            // },
            {
                title: '最后修改时间',
                dataIndex: 'editTime',
                key: 'editTime',
                width: 140
            },
        ];

        return columns;
    }
};
