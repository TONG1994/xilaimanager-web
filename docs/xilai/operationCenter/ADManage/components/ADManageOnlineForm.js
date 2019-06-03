/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import ReactDOM from 'react-dom'
import moment from 'moment';
let Reflux = require('reflux');
import { Form, Modal, Button, DatePicker, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var ADCommon = require('../components/ADCommon');
let FormDef = require('./ADManageForm');
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

var ADManageStore = require('../data/ADManageStore');
var ADManageActions = require('../action/ADManageActions');
let timeFormat = 'YYYY-MM-DD HH:mm:ss';

let ADManageOnlinePage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            modal: false,
            validRules: [],
            adManage: {
                upTime:'',
                downTime:'',
            },
            hints: {},
        };
    },

    mixins: [Reflux.listenTo(ADManageStore, 'onServiceComplete'), ModalForm('adManage')],
    onServiceComplete: function (data) {
        if(this.state.modal && data.operation === 'update'){
            if( data.errMsg === ''){
                // 成功，关闭窗口
                this.setState({
                    modal: false,
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    adManage: data
                });
            }
        }
    },
    beforeClose:function () {
        this.initValidRules();
        if(this.state.modal&&this.formList){
            ReactDOM.findDOMNode(this.formList).scrollTop = 0;
        }
    },
    // 第一次加载
    componentDidMount: function () {
        this.initValidRules();
        this.clear();
    },
    initPage:function(adManage){
        this.state.adManage = Utils.deepCopyValue(adManage);
        this.clear();
    },
    initValidRules:function () {
        if(this.props.typeType!="axlMessCenter"){
            this.state.validRules = [
                { id: 'downTime', desc: '下线时间', required: true },
            ];
        }
    },
    clear: function () {
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.adManage.downTime = '';
        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    disabledDate:function(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    },
    disabledDateTime:function() {
        return {
            disabledHours: () => this.range(0, 23),
            disabledMinutes: () => this.range(0, 59),
            disabledSeconds: () => this.range(0, 59),
        };
    },
    range:function(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    },
    handleOnSelTimeChange:function(value,dateString) {
        this.state.adManage.downTime = dateString;
        this.setState({
            loading : false,
        })
    },
    onClickSave: function () {
        this.setState({loading:true});
        this.state.adManage.upTime = ADCommon.getNowFormatDate();
        this.state.adManage.state = '已上线';
        this.state.adManage.stateID = '1';
        let action = this.props.actionType1;
        let typeData = this.props.typeType;
        this.initValidRules();
        if(typeData == "axlMessCenter"){
            let adManage = this.state.adManage;
            if (action === 'create') {
                ADManageActions.create(adManage);
            } else if (action === 'edit') {
                ADManageActions.update(adManage,'edit');
            }
        }else{
            if(Common.formValidator(this, this.state.adManage)){
                let adManage = this.state.adManage;
                if (action === 'create') {
                    ADManageActions.create(adManage);
                } else if (action === 'edit') {
                    ADManageActions.update(adManage,'edit');
                }
            }
        }
    },
    render: function () {
        let { hints} = this.state;
        let layout = 'horizontal';
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        let downTime = this.state.adManage.downTime===''||  this.state.adManage.downTime==undefined ? undefined:moment( this.state.adManage.downTime, timeFormat);
        return (
            <Modal
                bodyStyle = {{height:200,overflow:'auto'}}
                visible={this.state.modal}
                width="540px" title="上线"
                className='organization-class'
                maskClosable={false}
                onOk={this.onClickSave}
                onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" className='organization-alert' style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref="mxgBox" svcList={['role/create']} />
                        <Button
                            key="btnOK" type="primary" size="large" onClick={this.onClickSave.bind(this,this.props.actionType1)}
                            loading={this.state.loading}
                        >确定</Button>
                        <Button key="btnClose" size="large" onClick={this.toggle} loading={this.state.loading}>取消</Button>
                    </div>
                ]}
            >
                {
                    this.props.typeType=="axlMessCenter"?<div style={{fontSize:"14px"}}>是否确认上线</div>
                        :
                        <Form ref={ref=>this.formList=ref} layout={layout} style={{padding:16}}>
                            <FormItem {...formItemLayout} label='下线时间'  required={true} colon={true} help={hints.downTimeHint} validateStatus={hints.downTimeStatus}>
                                <DatePicker
                                    name='downTime'
                                    id='downTime'
                                    style={{width:'100%'}}
                                    placeholder='请选择下线时间'
                                    showToday={false}
                                    value={downTime}
                                    disabledDate={this.disabledDate}
                                    disabledTime={this.disabledDateTime}
                                    onChange={this.handleOnSelTimeChange}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                                />
                            </FormItem>
                        </Form>
                }
            </Modal>
        );
    }
});

export default ADManageOnlinePage;
