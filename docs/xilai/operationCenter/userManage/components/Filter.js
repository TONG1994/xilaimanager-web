/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import Common from '../../../../public/script/common';
let FormDef = require('./UserManageForm');
var Filter = React.createClass({
    getInitialState: function () {
        return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],
            filter: {
                telephone:'',
            },
            dataSource:[]
        }
    },

    mixins: [ModalForm('filter')],

    getFilter:function () {
        if(Common.validator(this,this.state.filter)){
            let obj = Object.assign(this.state.filter);
            return obj;
        }
    },
    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = FormDef.getFilterFormRule(this);
        this.clear();
    },
    clear:function(){
        FormDef.initFilterForm(this.state.filter);
        Common.validator(this,this.state.filter);
    },

    render: function () {
        var layout = 'horizontal';
        let  attrList = null;
        let  items  = FormDef.getFilterForm(this, this.state.filter, attrList);
        return (
            <div className='filter-wrap'>
                <Form layout={layout}>
                    { items }
                </Form>
            </div>
        );
    }
});

module.exports = Filter;