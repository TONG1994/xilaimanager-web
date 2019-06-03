import React from 'react';
let Reflux = require('reflux');
import { Form, Modal , Button } from 'antd';
import ModalForm from '../../../../lib/Components/ModalForm';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import AsssigneeSelect from './AsssigneeSelect';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
let worksheetManagementStore = require('../store/WorksheetManagementStore');
let worksheetManagementActions = require('../action/WorksheetManagementActions.js');
let FormDef = require('./WorksheetManagementForm');
var Validator = require('../../../../public/script/common');



let CloseWorkSheetModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      forwardManage: {},
      hints: {},
      validRules: [],
      title:'',
      disType:''
    };
  },

  mixins: [Reflux.listenTo(worksheetManagementStore, 'onServiceComplete'), ModalForm('forwardManage')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg && data.operation === 'forward'){
        if(data.errCode==="90018"){
          this.setState({errMsg:data.errMsg});
          this.doConfirm("该用户已被删除，请重新登录");
          this.setState({modal: false});
          return;
        }
      }
  },

  componentDidMount: function () {
    this.state.validRules = FormDef.getForwardFormRule(this);
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

  // 做新增和修改操作
  initEditData:function (systemAccounts) {
    this.state.hints = {};
    let data= Utils.deepCopyValue(systemAccounts);
    data.acceptMan="";
    //处理数据
    this.setState({
      title:<span style={{fontWeight:"bold",fontSize:"14px"}}>转派</span>,
    });
    let forwardManage = Object.assign({},this.state.forwardManage,data);
    this.setState({forwardManage:forwardManage});
  },

  //初始化
  clear: function () {
    // 初始化form
    FormDef.initForwardForm(this.state.forwardManage);
    // 初始化组件
    this.state.hints = {};
    this.setState({loading:false});
    if(this.SeachAssignee){
      this.SeachAssignee.clear();
    }
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  beforeClose:function () {
    this.clear();
  },

  showModal:function () {
    this.setState({modal:true});
  },

  // 提交
  onClickSave: function () {
    let forwardManage=this.state.forwardManage;
    if(Validator.validator(this,forwardManage)){
      let loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
      if(!loginData.staffInfo){
        Common.infoMsg("请重新登陆");
        return;
      }
      let obj=Object.assign({},forwardManage,{
        workSheetCode : forwardManage.code,
        beforeStaffCode : loginData.staffInfo.userUuid,
        afterStaffCode : forwardManage.acceptMan,
        description : forwardManage.description,
        workSheetUuid : forwardManage.uuid
      });
      this.setState({ loading: true });
      worksheetManagementActions.forward(obj);
    }
  },


   //受理人
   handleOnorgNameSelected: function(acceptMan){
    this.handleSelect(acceptMan);
  },
  //受理人  
  orgNameHandleSearch: function(value){
      this.handleSelect(value);
  },

  handleSelect: function(value) {
    this.state.forwardManage.acceptMan=value;
    Common.validator(this,this.state.forwardManage,'acceptMan');
    this.setState({ loading:false})
  },

  render: function () {
    let allowClearFlag = this.state.forwardManage.acceptMan ? true : false;
      let  attrList = [
      //   {
      //     name:'acceptMan',
      //     id:'acceptMan',
      //     object:<SeachAssignee
      //         name="acceptMan"
      //         id="acceptMan"
      //         ref = {ref=>this.SeachAssignee = ref}
      //         onSelected={this.handleOnorgNameSelected}
      //         onHandleSearch={this.orgNameHandleSearch}
      //     />
      // },
        {
          id:'acceptMan',
          name:'acceptMan',
          object: <AsssigneeSelect
              ref={ref=>this.AsssigneeSelect=ref}
              id="acceptMan"
              name="acceptMan"
              onChange={this.handleSelect}
              allowClear={allowClearFlag}
            />
        }
      ];
    let items = FormDef.getForwardForm(this, this.state.forwardManage, attrList);
    let title = this.state.title;
    return (
      <Modal
        visible={this.state.modal} width="600px" title={title} maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
        ]}
      >
        <Form layout='horizontal' >
          { items }
        </Form>
      </Modal>
    );
  }
});

export default CloseWorkSheetModal;

