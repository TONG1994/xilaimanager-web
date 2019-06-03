'use strict';

import React from 'react';
import { Form,Col,Row,DatePicker,Input } from 'antd';
const FormItem = Form.Item;
import ModalForm from "../../../../lib/Components/ModalForm";
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import AreaPosition from '../../../lib/Components/AreaPosition';
const Search = Input.Search;
let FormDef = require('./StoreInfoForm');
let Filter = React.createClass({
    getInitialState: function () {
        return {
            modal: this.props.moreFilter,
            filter: {
                orgName :'',
                provinces:'',
                provincesCode:'',
            },

        }
    },
    mixins: [ModalForm('filter')],

    componentDidMount: function () {
        this.state.validRules = FormDef.getFilterFormRule(this);
        this.clear();
    },

    getFilter:function () {
        if(Common.validator(this,this.state.filter)){
            let obj = Object.assign(this.state.filter);
            return obj;
        }
    },
    componentWillReceiveProps: function (newProps) {
        this.setState({
            modal: newProps.moreFilter,
        });
    },
    // clear:function(){
    //     this.state.loading = false;
    //     this.state.filter.orgName ='';
    //     this.state.filter.provinces='';
    //     this.state.filter.provincesCode='';
    //     this.forceUpdate();
    // },
    clear:function(){
        let filterData=this.state.filter;
        //清楚所有条件
        FormDef.initFilterForm(filterData);
        // 检测输出
        Common.validator(this,this.state.filter);
    },
    //地区选择回调
    areaPosition:function (val) {
        let adr = this.zhuan(val);
        this.state.filter.provinces=adr;
        this.handleOnSelected('provincesCode',val.toString());
    },
    zhuan:function(val){

        let address,d='';
        try {
            address = JSON.parse(window.sessionStorage.address)
        } catch (err) {}
        if(val.length){
            if (address) {
                let sheng = address.find(item => item.value === val[0]); //获取省
                d += sheng.label+'-';
                if(sheng.children){
                    let shi = sheng.children.find(item => item.value === val[1]); //获取市
                    d += shi.label+'-';
                    if(shi.children){
                        let xian = shi.children.find(item => item.value === val[2]); //获取县
                        d += xian.label;
                    }
                }
            }
        }
        return d;
    },

    render: function () {
        let layout='horizontal';

        let  attrList = [
            {
                name:'provinces',
                id:'provinces',
                object:<AreaPosition
                    name='provinces'
                    id='provinces'
                    onChange={this.areaPosition}
                    value={this.state.filter.provincesCode}
                />
            },
        ];
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