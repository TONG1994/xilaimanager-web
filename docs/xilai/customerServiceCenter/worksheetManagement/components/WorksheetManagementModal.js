import React from 'react';
import Reflux from 'reflux';
import { Form, Modal, Button, Input, Select, Row, Col ,Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
let WorksheetManagementStore = require('../store/WorksheetManagementStore');
let WorksheetManagementActions = require('../action/WorksheetManagementActions.js');
let FormDef = require('./WorksheetManagementForm');

//person component
import PrioritySelect from './PrioritySelect';
import SeachAssignee from './SeachAssignee';
import AsssigneeSelect from './AsssigneeSelect';

let worksheetManagementModal = React.createClass({
  getInitialState: function () {
    return {
      worksheetManagemen: {},
      loading: false,
      modal: false,
      hints: {},
      validRules: [],
      tabIndex:'2'
    };
  },

  mixins: [Reflux.listenTo(WorksheetManagementStore, 'onServiceComplete'), ModalForm('worksheetManagemen')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
      if(data.errMsg){
        if(data.errCode==="90018"){
          this.setState({errMsg:data.errMsg});
          this.doConfirm("该用户已被删除，请重新登录");
        }
        this.setState({loading: false});
        return;
      }
    if (this.state.modal && data.operation === 'create') {
          this.setState({ modal: false });
          this.beforeClose();
      }
      if (this.state.modal && data.operation === 'update') {
          this.setState({ modal: false });
          this.beforeClose();
      }
  },

  doConfirm: function (content) {
    Modal.error({
      title: '错误',
      content: content,
      onOk: this.reload
    });  
  },

  reload: function(){
    window.sessionStorage.removeItem('loginData');
    window.location.reload();
  },

  componentDidMount: function(){
    let attrs=[
      {
        name: 'level',
        customizeMethod: true,
      },
      {
        name: 'acceptMan',
        customizeMethod: true,
      },
      {
        name: 'userPhone',
        dataType:'mobile',
      },
      {
        name: 'userMail',
        allowed: true,
        validator: this.myCheck,
      },
      {
        name: 'content',
        allowed: true
      },
    ];
    this.state.validRules=FormDef.getWorksheetManagemenFormRule(this,attrs);
    if (typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  //自写检测特殊字符和邮箱格式
  myCheck: function(value){
    console.log(value);
    let valid = /[/。……（）【】——《》￥*`~!#$%^&*()+<>?:|?<>"{},\/\\;'[\]]/img;
    let emailValid = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    let validResult = valid.test(value);
    let emailValidResult = emailValid.test(value);
    if(validResult){
      return "不能输入特殊符号";
    }
    if(!emailValidResult){
      return "请输入电子邮件地址";
    }
  },

  showModal: function () {
    this.setState({ modal: true });
  },

  clear: function(){
    FormDef.initWorksheetManagemenForm(this.state.worksheetManagemen);
    this.state.hints = {};
    this.state.loading = false;
    if (typeof(this.refs.mxgBox) !== 'undefined') {
        this.refs.mxgBox.clear();
    }
  },

  onClickSave: function () {
    let worksheetManagemen=this.state.worksheetManagemen;
    if (Common.formValidator(this, this.state.worksheetManagemen)) {
      let loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
      let obj=Object.assign({},worksheetManagemen,{creator:loginData.staffInfo.userUuid,editor:loginData.staffInfo.userUuid});
      this.setState({ loading: true });
      WorksheetManagementActions.createWorksheet(obj);
    }
  },

  handleChange: function(value){
    this.state.worksheetManagemen.level=value;
    Common.validator(this,this.state.worksheetManagemen,'level');
    this.setState({ loading:false})
  },

  getAcceptMan: function(acceptMan){
    this.handleSelect(acceptMan);
  },

  handleSelect: function(value) {
    this.state.worksheetManagemen.acceptMan=value;
    Common.validator(this,this.state.worksheetManagemen,'acceptMan');
    this.setState({ loading:false})
    if(this.refs.mxgBox){
      this.refs.mxgBox.clear();
    }
  },

  goBack: function(){
    this.clear();
    this.props.goBack();
  },

  onTabChange:function(key){
    if(key==="1"){
      this.goBack();
    }else{
      this.setState({ tabIndex: key })
    }
  },

  render: function () {
      let allowClearFlag = this.state.worksheetManagemen.acceptMan ? true : false;
      let  attrList = [
          {
              name:'level',
              id:'level',
              object:<PrioritySelect
                  name="level"
                  id="level"
                  ref = {ref=>this.PrioritySelect = ref}
                  onChange={this.handleChange}
              />
          },
          {
            id:'acceptMan',
            name:'acceptMan',
            object: <AsssigneeSelect
                ref={ref=>this.AsssigneeSelect=ref}
                id="acceptMan"
                name="acceptMan"
                onChange={this.getAcceptMan}
                allowClear={allowClearFlag}
              />
          }
      ];
    let items = FormDef.getWorksheetManagemenForm(this, this.state.worksheetManagemen, attrList),
    title = this.props.actionType === 'create'?'创建工单': this.props.actionType ==='update'?'编辑工单':'模态框',
    tabIndex = this.state.tabIndex;
    return (
      <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
        <Tabs  activeKey={tabIndex}  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
            <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
            </TabPane>
            <TabPane tab={title} key="2" style={{width: '100%', height: '100%'}}>
                <div style={{padding:'8px 0 16px 8px', height: '100%',width:'800px'}}>
                    {/* <ServiceMsg ref='mxgBox' svcList={['worksheet/create','worksheet/update']}/> */}
                    <Form layout='horizontal'>
                      { items }
                      <FormItem style={{textAlign:'right',margin:'4px 0'}} >
                          <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading} disabled={this.state.loading}>保存</Button>{' '}
                      </FormItem>
                    </Form>
                </div>
            </TabPane>
        </Tabs>
      </div>
    );
  }
});
export default worksheetManagementModal;