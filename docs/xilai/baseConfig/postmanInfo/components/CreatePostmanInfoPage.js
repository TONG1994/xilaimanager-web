'use strict';
import React from 'react';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input, Form } from 'antd';
const FormItem = Form.Item;
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import PostmanInfoActions from '../action/PostmanInfoActions';
import PostmanInfoorgName from '../data/PostmanInfoStore';
import OrgBranchSelect from '../components/OrgBranchSelect';
import OperateLog from '../../../lib/Components/OperateLog';
import OrgIdTagSelect from './OrgIdTagSelect';
let loginData = Common.getLoginData();

class CreatePostmanInfoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modal: false,
            hints: {},
            validRules: [],
            user: {
                name: '',
                orgName: '',
                orgNo: '',
                phone: '',
                idCard: '',
                idTag: '',
                websit: false
            },
            edit: '',
            userOldValue: {}
        }
    }

    componentDidMount() {
        this.unsubcribe = PostmanInfoorgName.listen(this.onServiceChange);
        this.state.validRules = [
            { id: 'orgName', desc: '服务站名称', required: true },
            { id: 'name', desc: '姓名', required: true, max: 30 },
            { id: 'phone', desc: '联系方式', required: true, max: 11, min: 11, dataType: 'mobile' },
            { id: 'idCard', desc: '身份证号', required: true, dataType: 'idcard18' },
            { id: 'idTag', desc: '身份标签', required: true, },
        ];
        if (typeof(this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }

    }
    componentWillUnmount() {
        this.unsubcribe();
    }
    clear = () => {
        this.state.user = {
            name: '',
            orgName: '',
            orgNo: '',
            phone: '',
            idCard: '',
            idTag:''
        };
        this.state.hints = {};
        this.state.loading = false;
        this.setState({
            edit: 'create',
            modal: !this.state.modal
        }, () => {
            this.OrgIdTagSelect.setValue("0",'create');
            let orgData = this.getOrgData();
            if (orgData.orgType === '3') { //服务站
                this.state.user.orgName = orgData.orgName;
                this.state.user.orgNo = orgData.orgNo;
                this.setState({ websit: true });
            } else {
                this.OrgBranchSelect.setValue('');
                this.setState({ websit: false });
            }

        });
        if (typeof(this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    }
    init = (user, type) => {
        Utils.copyValue(user, this.state.user);
        Utils.copyValue(user, this.state.userOldValue);
        this.setState({
            hints: {},
            edit: type,
            modal: !this.state.modal
        }, () => {
            this.OrgIdTagSelect.setValue(user.idTag,type);
            let orgData = this.getOrgData();
            if (orgData.orgType === '3') { //服务站
                this.state.user.orgName = orgData.orgName;
                this.state.user.orgNo = orgData.orgNo;
                this.setState({ websit: true });
            } else {
                this.OrgBranchSelect.setValue(user.orgName ? user.orgName : '');
                this.setState({ websit: true });
            }

        });
        if (typeof(this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    }
    getOrgData = () => {
        let orgData = {};
        let orgName = loginData.staffInfo.orgName;
        let orgNo = loginData.staffInfo.orgNo;
        let orgType = loginData.staffInfo.orgType;
        orgData = {
            orgType: orgType === null ? '' : orgType,
            orgNo,
            orgName: orgName === null ? '' : orgName
        };
        return orgData;

    }
    toggle = () => {
        this.setState({ modal: !this.state.modal });
    }
    onCancel = () => {
        this.OrgBranchSelect.clear();
        this.toggle();
    }
    onServiceChange = (data) => {
        if (this.state.modal && (data.operation === 'createStaff' || data.operation === 'update')) {
            if (data.errMsg === '') {
                this.setState({
                    modal: false,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        }
    }
    getNowFormatDate = () => {
        Date.prototype.format = function(format) {
            var date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        }
        let currentdate = new Date().format('yyyy-MM-dd hh:mm:ss');
        return currentdate;
    }
    onClickSave = () => {
        let user = this.state.user;
        if (Common.formValidator(this, user)) {
            this.setState({ loading: true });
            if (this.state.edit === 'update') {
                user.editTime = this.getNowFormatDate();
                PostmanInfoActions.updatePostmanInfo(user, this.state.userOldValue);
            } else  if (this.state.edit === 'create')  {
                PostmanInfoActions.createPostmanInfo(user);
            }
        }
    }
    getIdTagValue=(value)=> {
        this.state.user.idTag=value;
        let user = this.state.user;
        Common.validator(this,user,'idTag');
        this.setState({ loading:false });
        this.refs.mxgBox.clear();
    }
    handleOnorgNameSelected = (data) => {
        this.handleSelect(data.orgName);
        this.state.user.orgNo = data.orgNo;
        this.setState({ user: this.state.user });
    }
    orgNameHandleSearch = (value) => {
        this.handleSelect(value);
    }

    handleSelect = (value) => {
        this.state.user.orgName = value;
        let user = this.state.user;
        Common.validator(this, user, 'orgName');
        this.setState({ loading: false });
        this.refs.mxgBox.clear();
    }
    handleOnChange = (e) => {
        let user = this.state.user;
        user[e.target.id] = e.target.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        Common.validator(this, user, e.target.id);
        this.setState({
            user: user
        });
        this.refs.mxgBox.clear();
    }
    render() {
        let { hints,edit} = this.state;
        let layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 6 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
        };
        let title='', disabledFlag=false;
        if(edit === 'view'){
            title = '查看快递员账号';
            disabledFlag=true;
        }else{
            if(edit === 'create'){
                title = '新增快递员账号';
            }else if(edit === 'update'){
                title = '修改快递员信息';
            } 
            disabledFlag=false;
        }
        return(
          <Modal visible={this.state.modal} width="540px" title={title} maskClosable={false} onOk={edit != 'view' ? this.onClickSave : null} onCancel={edit != 'view' ? this.onCancel : this.toggle}
        footer={edit != 'view' ? [
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
          <div style={{marginBottom:'10px'}}>

          <ServiceMsg  ref="mxgBox"
                        svcList={[
                            'user/createStaff',
                            'user/update'
                        ]} />
          </div>
           
            <Button
              key="btnOK" type="primary" size="large" onClick={this.onClickSave}
              loading={this.state.loading}
            >保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.onCancel}>取消</Button>
          </div>
        ] : null}>
        <Form layout={layout}  style={{height:280,overflowX:'hidden',overflowY:'auto',padding:16,}}>
         <FormItem {...formItemLayout2} className={layoutItem} label='所属服务站' required={true} colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}>
         <div style={{display: edit != 'view' ? '':'none'}}>
           <div style={{display: this.state.websit ? 'none':''}}>
            <OrgBranchSelect   ref={ref=> this.OrgBranchSelect=ref} name="orgName" id="orgName" value={this.state.user.orgName}  onSelected={this.handleOnorgNameSelected} onHandleSearch={this.orgNameHandleSearch}  />
            </div>
            <Input style={{display:this.state.websit ? '' : 'none'}} type='text' name="orgName" id="orgName" value={this.state.user.orgName} disabled />
        </div>
        <Input style={{display:edit === 'view' ? '' : 'none'}} type='text' name="orgName" id="orgName" value={this.state.user.orgName} disabled />
        </FormItem>
        <FormItem {...formItemLayout2} className={layoutItem} label='姓名' required={true} colon={true} help={hints.nameHint} validateStatus={hints.nameStatus}>
                <Input placeholder='输入姓名' type='text' name='name' id='name' value={this.state.user.name} onChange={this.handleOnChange} disabled={disabledFlag} />
            </FormItem>
          
            <FormItem {...formItemLayout2} className={layoutItem} label='联系方式' required={true} colon={true}  help={hints.phoneHint} validateStatus={hints.phoneStatus}>
                <Input placeholder='输入手机号' type='text' name='phone' id='phone' value={this.state.user.phone} onChange={this.handleOnChange} disabled={disabledFlag} />
            </FormItem>
           

            <FormItem {...formItemLayout2} className={layoutItem} label='身份证号' required={true} colon={true} help={hints.idCardHint} validateStatus={hints.idCardStatus}>
                <Input placeholder='输入身份证号' type='text' name='idCard' id='idCard' value={this.state.user.idCard}  onChange={this.handleOnChange} disabled={disabledFlag} />
            </FormItem>
            <FormItem {...formItemLayout2} className={layoutItem} label='身份标签' required={true} colon={true} help={hints.idTagHint} validateStatus={hints.idTagStatus}>
                <OrgIdTagSelect ref={ref=>this.OrgIdTagSelect=ref} name='idTag' id='idTag' onSelected={this.getIdTagValue}/>
            </FormItem>
                {
                    edit === 'view'?<OperateLog  uuid ={this.state.userOldValue.uuid} modal={this.state.modal}/>:''
                }
        </Form>
        </Modal>
    );
  }
    
}
export default CreatePostmanInfoPage;