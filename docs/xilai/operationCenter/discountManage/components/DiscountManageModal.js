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

let timeFormat = 'YYYY-MM-DD HH:mm:ss';
let DiscountManageModal = React.createClass({
    getInitialState: function () {
        return {
            tabIndex: '2',
            hints: {},
            validRules: [],
            discountManage:{
                voucherTypeUuid:'CONDITION_DECREASE',
                timeTypeUuid:'SECTION_TIMES',
                validDate:'',
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
        if(data.operation == 'create' || data.operation == 'searchVoucherList'){
            this.setState({loading: false});
            this.goBack();
        }
    },
    //第一次加载
    componentDidMount: function () {
        this.state.validRules = FormDef.getModalFormRule(this);
    },
    //初始化
    addData:function () {
        FormDef.initCreateModalForm(this.state.discountManage);
    },
    initEditData: function (record) {
        this.state.discountManage = Utils.deepCopyValue(record)
        console.log(this.state.discountManage);
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
            this.state.voucherNewType = 'INCREASE_DECREASE';
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

    timeChange: function (value, dateString) {
        if(dateString == ','){
            this.state.discountManage.validDate = '';
        }else {
            this.state.discountManage.timeSectionStart = dateString.toString().slice(0,19);
            this.state.discountManage.timeSectionEnd = dateString.toString().slice(20,39);
            this.state.discountManage.validDate = this.state.discountManage.timeSectionStart+','+this.state.discountManage.timeSectionEnd;
        }
        console.log(this.state.discountManage.validDate);
        this.setState({ loading: false }, () => { Common.validator(this, this.state.discountManage, 'validDate') });
    },

    //禁止选择今天之前的日期
    disabledUpDate: function (current) {
        return current && current < moment(Date.now()).add(-1, 'd');
    },
    //不可选分秒
    disabledRangeTime: function (value, type) {
        let hour;
        let hour2;
        if (value) {
            if (value.length) {
                hour = moment(value[0]).format('HH').toString();
                hour2 = moment(value[1]).format('HH').toString();
            }
        }
        return {
            disabledHours: () => {
                const result = [];
                return result;
            },
            disabledMinutes: () => {
                const result = [];
                for (let i = 1; i < 60; i++) {
                    result.push(i);
                }
                return result;
            },
            disabledSeconds: () => {
                const result = [];
                for (let i = 1; i < 60; i++) {
                    result.push(i);
                }
                return result;
            },
        };
    },
    //保存
    onClickSave: function () {
        // console.log(this.state.discountManage);
        let discountManage=this.state.discountManage;
        if (Common.formValidator(this, this.state.discountManage)) { //新建优惠卷
        let obj = {};
        obj.voucherName = discountManage.voucherName;
        obj.voucherTypeUuid = discountManage.voucherTypeUuid;
        if(this.state.discountManage.voucherTypeUuid == 'CONDITION_DECREASE'){
            obj.conditionDecreasePrice = discountManage.conditionDecreasePrice;
            obj.satisfyConditionPrice = discountManage.satisfyConditionPrice;
            obj.instantDecreasePrice = "";
        }else {
            obj.instantDecreasePrice = discountManage.instantDecreasePrice;
            obj.conditionDecreasePrice = "";
            obj.satisfyConditionPrice = "";
        }
        obj.ruleInfo = discountManage.ruleInfo;
        obj.timeTypeUuid = discountManage.timeTypeUuid;
        if(this.state.discountManage.timeTypeUuid == 'SECTION_TIMES'){
            obj.timeSectionStart = discountManage.timeSectionStart;
            obj.timeSectionEnd = discountManage.timeSectionEnd;
            obj.timeFixed = "";
        }else {
            obj.timeSectionStart = "";
            obj.timeSectionEnd = "";
            obj.timeFixed = discountManage.timeFixed;
        }
        obj.creator = "cccc"
        this.setState({ loading: true });
        DiscountManageActions.createDiscountManage(obj);

        }
    },
    render: function () {
        let tabIndex = this.state.tabIndex;
        let title = this.props.actionType === 'add' ? '新建优惠券' : '查看优惠券';
        let attrList = [
        ];
        let voucherNewType='',timeNewType='';
        if(this.props.actionType === 'add'){
            voucherNewType = this.state.voucherNewType ? this.state.voucherNewType:'CONDITION_DECREASE';
            timeNewType = this.state.timeNewType ? this.state.timeNewType:'SECTION_TIMES';
        }else {
            voucherNewType = this.state.discountManage.voucherTypeUuid ? this.state.discountManage.voucherTypeUuid:'';
            timeNewType = this.state.discountManage.timeTypeUuid ? this.state.discountManage.timeTypeUuid:'';
        }

        let disabled = this.props.actionType === 'add' ? false:true;
        console.log(this.state.discountManage)
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