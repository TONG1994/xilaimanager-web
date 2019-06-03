/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form,Col,Row,Input } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
const FormItem = Form.Item;
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
let Filter = React.createClass({
    getInitialState: function () {
        return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],
            filter: {
                voucherName:'',
            },
            dataSource:[]
        }
    },

    mixins: [ModalForm('filter')],

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'voucherName', desc: '优惠券名称', max:20,},
        ];
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
    clear:function(){
        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
        this.state.filter.voucherName='';
        this.forceUpdate();
    },
    render: function () {
        let hints=this.state.hints;
        let layout='horizontal';
        let layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        return (
            <div className='filter-wrap'>
                <Form layout={layout} style={{width:'100%'}}>
                    <Row  gutter={24}>
                        <Col className="gutter-row" span={6}>
                            <FormItem {...formItemLayout} className={layoutItem} label='优惠券名称'  help={hints.voucherNameHint} validateStatus={hints.voucherNameStatus}>
                                <Input placeholder="请输入优惠券名称" type='text' name='voucherName' id='voucherName' value={this.state.filter.voucherName} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
});

module.exports = Filter;