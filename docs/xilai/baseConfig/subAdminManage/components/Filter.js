/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import Common from '../../../../public/script/common';
let FormDef = require('./SubAdminManageForm');
var RoleManageFilter = React.createClass({
    getInitialState: function () {
        return {
            // modal: this.props.moreFilter,
            hints: {},
            validRules: [],
            roleManage: {
                belongsOrgNo:Common.getLoginData()?Common.getLoginData().staffInfo.orgNo:''
            },
        }
    },

    mixins: [ModalForm('roleManage')],

    getFilter:function () {
        if(Common.validator(this,this.state.roleManage)){
            let obj = Object.assign(this.state.roleManage);
            return obj;
        }
    },
    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = FormDef.getFilterFormRule(this);
        this.clear();
    },
    clear:function(){
        FormDef.initFilterForm(this.state.roleManage);
        Common.validator(this,this.state.roleManage);
    },

    render: function () {
        var layout = 'horizontal';
        let  attrList = null;
        let  items  = FormDef.getFilterForm(this, this.state.roleManage, attrList);
        return (
            <div className='filter-wrap'>
                <Form layout={layout}>
                    { items }
                </Form>
            </div>
        );
    }
});

module.exports = RoleManageFilter;