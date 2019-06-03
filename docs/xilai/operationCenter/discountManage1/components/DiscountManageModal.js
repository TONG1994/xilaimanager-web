import React from 'react';
let Reflux = require('reflux');
import moment from 'moment';
import ReactDOM from 'react-dom'
const RadioGroup = Radio.Group;
import { Form, Tabs, Radio, Input, DatePicker, Checkbox, Button } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
var DiscountManageStore = require('../store/DiscountManageStore');
var DiscountManageActions = require('../action/DiscountManageActions');
var FormDef = require('../components/DiscountManagePageForm');
import ModalForm from '../../../../lib/Components/ModalForm';

let DiscountManageModal = React.createClass({
    getInitialState: function () {
        return {
            tabIndex: '2',
            hints: {},
            validRules: [],
            discountManage:{
                voucherTypeUuid:'CONDITION_DECREASE',
                timeTypeUuid:'SECTION_TIMES',
            },
            voucherNewType:'',
            timeNewType:'',
        };
    },
    mixins: [Reflux.listenTo(DiscountManageStore, 'onServiceComplete'),ModalForm('discountManage')],
    onServiceComplete: function () {
        this.setState({
            loading: false,
        });
    },
    //第一次加载
    componentDidMount: function () {
        this.state.validRules = FormDef.getModalFormRule(this);
    },

    //保存
    onClickSave: function () {

    },
    //初始化
    addData:function () {
        FormDef.initCreateModalForm(this.state.discountManage);
    },
    initEditData: function (record) {
        this.state.discountManage = Utils.deepCopyValue(record);
        this.setState({loading:false});
    },
    tabsChange: function (key) {
        if (key == '1') {
            this.goBack();
        } else {
            this.setState({ tabIndex: key });
        }
    },
    goBack: function () {
        this.clear();
        this.props.goBack()
    },
    clear:function(){
        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
        this.forceUpdate();
    },
    onVoucherTypeChange:function(e){
        this.state.discountManage.voucherTypeUuid = e.target.value;

        if(this.state.discountManage.voucherTypeUuid == 'CONDITION_DECREASE'){
            this.state.voucherNewType = 'CONDITION_DECREASE';
        }else{
            this.state.voucherNewType = 'CONDITION_INCREASE';
        }
        this.setState({loading:false});
    },
    onTimeTypeChange:function(e){
        this.state.discountManage.timeTypeUuid = e.target.value;

        if(this.state.discountManage.timeTypeUuid == 'SECTION_TIMES'){
            this.state.timeNewType = 'SECTION_TIMES';
        }else{
            this.state.timeNewType = 'FIXED_TIMES';
        }
        this.setState({loading:false});
    },
    render: function () {
        let tabIndex = this.state.tabIndex;
        let title = this.props.actionType === 'add' ? '新建优惠券' : '查看优惠券';
        let attrList = [
        ];
        let voucherNewType = this.state.voucherNewType ? this.state.voucherNewType:'CONDITION_DECREASE';
        let timeNewType = this.state.timeNewType ? this.state.timeNewType:'SECTION_TIMES';
        let disabled = this.props.actionType === 'add' ? false:true;
        let items = FormDef.getModalForm(this, this.state.discountManage, attrList,voucherNewType,timeNewType,disabled);
        let layout = 'horizontal';
        return (
            <div style={{ paddingLeft: '20px' }}>
                <Tabs activeKey={tabIndex} onChange={this.tabsChange}>
                    <TabPane tab="返回" key="1"></TabPane>
                    <TabPane tab={title} key="2">
                        <Form layout='horizontal' style={{ width: '800px' }} layout={layout}>
                            {items}
                            {
                                this.props.actionType === 'add' ?<div style={{ textAlign: 'right' }}>
                                    <Button type='primary' loading={this.state.loading} onClick={this.onClickSave}>保存</Button>
                                </div>:''
                            }

                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

module.exports = DiscountManageModal;