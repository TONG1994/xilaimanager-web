import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
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
      systemAccount: {},
      hints: {},
      validRules: [],
      title:'',
      disType:''
    };
  },

  mixins: [Reflux.listenTo(worksheetManagementStore, 'onServiceComplete'), ModalForm('systemAccount')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
    if(data.errMsg){
      if(data.errMsg && data.operation === 'close'){
        if(data.errCode==="90018"){
          this.setState({errMsg:data.errMsg});
          this.doConfirm("该用户已被删除，请重新登录");
          this.setState({modal: false});
          return;
        }
        this.setState({loading:false});
        return;
      }
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

  componentDidMount: function () {
    this.state.validRules = FormDef.getDealFormRule(this);
  },

  // 做新增和修改操作
  initEditData:function (systemAccounts) {
    this.state.hints = {};
    let data= Utils.deepCopyValue(systemAccounts);
    //处理数据
    this.setState({
      title: <span style={{fontWeight:"bold",fontSize:"14px"}}>关闭</span>,
    });
    let systemAccount2 = Object.assign({},this.state.systemAccount,data);
    this.setState({systemAccount:systemAccount2});
  },

  //初始化
  clear: function () {
    // 初始化form
    FormDef.initDealForm(this.state.systemAccount);
    // 初始化组件
    this.state.hints = {};
    this.setState({loading:false});
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
    let systemAccount=this.state.systemAccount;
    if(Validator.validator(this,systemAccount)){
      let loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
      let obj=Object.assign({},{
        editor: loginData.staffInfo.userUuid,
        remark: systemAccount.remark,
        uuid : systemAccount.uuid,
        code: systemAccount.code
      });
      this.setState({ loading: true });
      worksheetManagementActions.finish(obj);
    }
  },

  render: function () {
      let  attrList = [];
    let items = FormDef.getDealForm(this, this.state.systemAccount, attrList);
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

