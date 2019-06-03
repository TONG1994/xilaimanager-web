'use strict';

import React from 'react';
import { Form, Input,Tooltip,Icon,Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';

module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [{
        name: 'UserManageTable',
        cols: ['telephone','name','certificationStatus','experienceValue','memberGrade','integralValue','registrationTime','registrationSource','lastLoginTime',],
        func: 'getUserManageTableColumns'
    }],

    initFilterForm(data){
        data.telephone = '';
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
            { id: 'telephone', desc: '手机号码',datatype:'mobile', max: '11', ...attrMap.telephone },
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
            <FormItem {...itemLayouts[0] } key='telephone' label='手机号码'  colon={true} help={hints.telephoneHint} validateStatus={hints.telephoneStatus}  className={layoutItem} >
                <Input type='text' name='telephone' id='telephone' value={data.telephone} onChange={form.handleOnChange}    {...attrMap.telephone} placeholder='请输入手机号码'/>
            </FormItem >,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    getUserManageTableColumns: function (form) {
        var columns = [
            {
                title: '手机号',
                dataIndex: 'telephone',
                key: 'telephone',
                width: 30,
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 30,
            },
            {
                title: '认证状态',
                dataIndex: 'certificationStatus',
                key: 'certificationStatus',
                width: 30,
                render:function (text,record) {
                    if(text==1){
                        return '已认证';
                    }else if(text==0){
                        return '未认证';
                    }
                }
            },
            {
                title: '经验值',
                dataIndex: 'experienceValue',
                key: 'experienceValue',
                width: 30,
            },
            {
                title: '会员等级',
                dataIndex: 'memberGrade',
                key: 'memberGrade',
                width: 30,
            },
            {
                title: '积分',
                dataIndex: 'integralValue',
                key: 'integralValue',
                width: 30,
            },
            {
                title: '注册时间',
                dataIndex: 'registrationTime',
                key: 'registrationTime',
                width: 40,
            },
            {
                title: '注册来源',
                dataIndex: 'registrationSource',
                key: 'registrationSource',
                width: 40,
                // render:function (text,record) {
                //     if(text==0){
                //         return '快递通-微信小程序';
                //     }else if(text==1){
                //         return '快递通-支付宝小程序';
                //     }else if(text==2){
                //         return '快递通-App';
                //     }
                // }
            },
            {
                title: '用户最近登录时间',
                dataIndex: 'lastLoginTime',
                key: 'lastLoginTime',
                width: 40,
            },
        ];

        return columns;
    }
};

