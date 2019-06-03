import React from 'react';
let Reflux = require('reflux');
import { Form, Button,Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
let ServiceManagementStore = require('../data/ServiceManagementStore.js');
let ServiceManagementActions = require('../action/ServiceManagementActions');
let FormDef = require('./ServiceForm');
let ServiceManagementModalPage = React.createClass({
    getInitialState: function() {
        return {
            customerInfoSet: {},
            loading: false,
            customerInfo: {  },
            hints: {},
            validRules: [],
            actionType:'',
            tabIndex: '2',
        };
    },
    mixins: [Reflux.listenTo(ServiceManagementStore, 'onServiceComplete'), ModalForm('customerInfo')],
    onServiceComplete: function(data) {
        if (data.errMsg) {
            this.setState({
                loading: false,
            });
            return;
        } else {
           this.clear();
           this.goBack();
        }
    },
    componentDidMount: function() {
        let attrList = [
            {
                name: 'customerMail',
                allowed: true,
            },
        ];
        this.state.validRules = FormDef.getCreateFormRule(this, attrList);
    },
    handleOnInputChange: function (e) {
        if (typeof(this.refs.mxgBox) !== 'undefined') {
            this.refs.mxgBox.clear();
        }
        let customerInfo = this.state.customerInfo;
        // let specialChar = /[/。……（）【】——《》￥*`~!@#$%^&*()_+<>?:|?<>"{},.\/\\;'[\]]/img;
        let specialChar = /[/。……（）【】——《》￥*`~!#$%^&*()+<>?:|?<>"{},\/\\;'[\]]/img;
        customerInfo[e.target.id] = e.target.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        Common.validator(this, customerInfo, e.target.id);
        customerInfo[e.target.id] = customerInfo[e.target.id].replace(specialChar, '');
      },
    clear: function(filter) {
        FormDef.initCreateForm(this.state.customerInfo);
        this.state.hints = {};
        this.state.loading = false;
        if (typeof(this.refs.mxgBox) !== 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    init:function(customerInfo, actionType){
        this.setState({
            customerInfo,
            actionType
        });
    },
    onClickSave: function() {
        if (Common.formValidator(this, this.state.customerInfo)) {
            this.setState({ loading: true });
            let customerInfo = Utils.deepCopyValue(this.state.customerInfo);
            let sendData = {
                name:customerInfo.customerName,
                nickName:customerInfo.customerNickname,
                phone:customerInfo.customerPhone,
                mail:customerInfo.customerMail
            };
            if (this.state.actionType === 'edit') {
                sendData.uuid = customerInfo.uuid;
                ServiceManagementActions.update(sendData);
              } else if (this.state.actionType === 'create'){
                ServiceManagementActions.create(sendData);
              }
        }
    },
    onCancel:function(){
        this.clear();
        this.toggle();
    },
    goBack:function() {
        this.clear();
        this.props.goBack()
    },
    onTabChange(key) {
        if (key === '1') {
          this.goBack();
        } else {
          this.setState({tabIndex: key});
        }
      },
    render: function () {
        let actionType = this.state.actionType, title = '', unableEdit = actionType === 'check' ? true : false;
        if(actionType === 'check'){
            title = '查看客服信息';
        }else if(actionType === 'create'){
            title = '新增客服';
        }else if(actionType === 'edit'){
            title = '编辑客服信息';
        }
        let attrList = [
            {
            name:'customerName',
            id:'customerName',
            disabled:unableEdit
            },
            {
            name:'customerNickname',
            id:'customerNickname',
            disabled:unableEdit
            },
            {
            name:'customerPhone',
            id:'customerPhone',
            disabled:unableEdit
            },
            {
            name:'customerMail',
            id:'customerMail',
            disabled:unableEdit
            },
        ];
        let items = FormDef.getCreateForm(this, this.state.customerInfo, attrList);
        let tabIndex = this.state.tabIndex;
        return (
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs  activeKey={tabIndex}  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab={title} key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:'8px 0 16px 8px', height: '100%',overflow: 'hidden',width:'800px'}}>
                        <div style={{margin:'10px 0'}}><ServiceMsg ref='mxgBox' svcList={['user/createSupportStaff', 'user/updateSupportStaff']}/></div> 
                            <Form layout='horizontal'>
                                { items }
                                {actionType != 'check' ?
                               <FormItem style={{textAlign:'right',margin:'4px 0'}} >
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                    {/* <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button> */}
                                </FormItem> : null}
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

export default ServiceManagementModalPage;
