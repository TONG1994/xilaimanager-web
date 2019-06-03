import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col,Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import RoleList from '../../../lib/Components/roleList/RoleList';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var SubAdminManageStore = require('../data/SubAdminManageStore');
var SubAdminManageActions = require('../action/SubAdminManageActions');
var FormDef = require('./SubAdminManageForm');
var CreateSubAdminManagePage = React.createClass({
    getInitialState : function() {
        return {
            subAdminManageSet: {},
            loading: false,
            modal: false,
            subAdminManage: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(SubAdminManageStore, "onServiceComplete"), ModalForm('subAdminManage')],
    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'createManager'){
            if( data.errMsg === ''){
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    subAdminManageSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        let attrList = [
            {
                name:'phone',
                dataType:'mobile',
                validator:this.checkHeadTelephone
            },
        ];
        this.state.validRules = FormDef.getSubAdminManageFormRule(this,attrList);
        this.clear();
    },
    checkHeadTelephone:function (value,rule) {
        //检查手机号是否唯一
    },
    clear : function(){
        FormDef.initSubAdminManageForm(this.state.subAdminManage);
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.subAdminManage.phone='';
        this.state.subAdminManage.name='';
        this.state.subAdminManage.roleUuid='';
        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },
    onClickSave : function(){
        var subAdminManage = this.state.subAdminManage;
        subAdminManage.roleUuid = subAdminManage.roleUuid;
        if(Common.formValidator(this, this.state.subAdminManage)){
            this.setState({loading: true});
            let filter = Utils.deepCopyValue(this.state.subAdminManage);
            filter.orgNo = Common.getLoginData() ? Common.getLoginData().staffInfo.orgNo : '暂无';
            filter.orgType = Common.getLoginData()? Common.getLoginData().staffInfo.orgType : '暂无';
            SubAdminManageActions.createSubAdminManage(filter);
        }
    },
    changeRoleList:function (obj={id:'',roleName:'',uuid:''}) {
        let {subAdminManage,loading,hints}= this.state;
        subAdminManage.roleName=obj.roleName;
        subAdminManage.roleUuid=obj.uuid;
        //设值
        this.setState({loading:loading,subAdminManage,hints});
    },
    render : function(){
        let {subAdminManage} = this.state;
        var layout='horizontal';
        let  attrList = [
            {
                name:'roleName',
                id:'roleName',
                object:<RoleList
                    name="roleName"
                    id="roleName"
                    value={subAdminManage.roleName}
                    changeRoleList={this.changeRoleList} />
            }
        ];
        let  items  = FormDef.getSubAdminManageForm(this, this.state.subAdminManage,attrList);
        return (
            <Modal visible={this.state.modal} width='540px' title="新增账号" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                   footer={[
                       <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                           <ServiceMsg ref='mxgBox' svcList={['user/createManager']}/>
                           <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                           <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                       </div>
                   ]}
            >
                <Form layout={layout} style={{height:'auto',overflowX:'hidden',overflowY:'auto',padding:16}}>
                    {items}
                </Form>
            </Modal>
        );
    }
});

export default CreateSubAdminManagePage;