/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
let FormDef = require('./RoleManageForm');

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import MenuList from '../../../lib/Components/menuList/MenuList';
import ReactDOM from "react-dom";
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import OperateLog from '../../../lib/Components/OperateLog';
let RoleManageStore = require('../store/RoleManageStore.js');
let RoleManageActions = require('../action/RoleManageActions');

let RoleManageLogPage = React.createClass({
    getInitialState: function () {
        return {
            roleManageSet: {},
            loading: false,
            modal: false,
            roleManage: {},
            hints: {},
            validRules: [],
            oldValue:{}
        };
    },

    mixins: [Reflux.listenTo(RoleManageStore, 'onServiceComplete'), ModalForm('roleManage')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            } else {
                // 失败
                this.setState({
                    loading: false,
                    roleManageSet: data
                });
            }
        }else if(this.state.modal && data.operation === 'get'){
            let datas = data.object;
            let menuList = [];
            datas.menuList.map(item=>{
                menuList.push(item.uuid);
            })
          this.menuList.setState({checkedList:menuList});
            // this.menuList.state.checkedList = menuList;
            // this.menuList.forceUpdate();
            let oldValue={};
            Utils.copyValue(this.state.oldValue, oldValue);
            oldValue.menuList = menuList;
            this.setState({oldValue});
        }
    },
    beforeClose:function () {
        if(this.state.modal&&this.formList){
          ReactDOM.findDOMNode(this.formList).scrollTop = 0;
        }
        this.menuList.state.checkedList = [];
        this.menuList.forceUpdate();
    },
    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = FormDef.getRoleManageFormRule(this);
    },

    initPage: function (roleManage) {
        RoleManageActions.getRoleManageByUuid(roleManage.uuid);
        this.state.hints = {};
        Utils.copyValue(roleManage, this.state.roleManage);
        Utils.copyValue(roleManage, this.state.oldValue);
        this.toggle();
        this.setState({loading:false});
        if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
            this.refs.mxgBox.clear();
        }

    },

    render: function () {
        let layout = 'horizontal';
        var attrList = [
            {
                name:'roleName',
                id:'roleName',
                object:<Input
                size='large'
                id='roleName'
                name='roleName'
                value={this.state.roleManage['roleName']}
                disabled = {true}
                />,
            }
        ];
        var items = FormDef.getRoleManageForm(this, this.state.roleManage, attrList,null,null,true);
        return (
            <Modal
                bodyStyle = {{height:350,overflow:'auto'}}
                visible={this.state.modal}
                width="540px"
                title="查看"
                maskClosable={false} onCancel={this.toggle} footer={null}
            >
                <Form layout={layout} ref={ref=>this.formList=ref} style={{padding:16}}>
                    {items}
                    <MenuList ref={ref=>this.menuList=ref} disabled={true}/>
                    <OperateLog  uuid ={this.state.roleManage.uuid} modal={this.state.modal}/>
                </Form>
            </Modal>
        );
    }
});

export default RoleManageLogPage;
