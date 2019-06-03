/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import ReactDOM from 'react-dom'

let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import MenuList from '../../../lib/Components/menuList/MenuList';


let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let RoleManageStore = require('../store/RoleManageStore.js');
let RoleManageActions = require('../action/RoleManageActions');

//person component

let FormDef = require('./RoleManageForm');

let CreateRoleManagePage = React.createClass({
  getInitialState: function () {
    return {
        roleManageSet: {},
      loading: false,
      modal: false,
        roleManage: {},
      hints: {},
      flag:false,
      validRules: [],
        menuList:[],
    };
  },
  
  mixins: [Reflux.listenTo(RoleManageStore, 'onServiceComplete'), ModalForm('roleManage')],
  onServiceComplete: function (data) {
      if(this.state.modal && data.operation === 'create'){
          if( data.errMsg === ''){
              // 成功，关闭窗口
              this.setState({
                  modal: false,
              });
              this.menuList.setState({checkedList:[]});
          }
          else{
              // 失败
              this.setState({
                  loading: false,
                  roleManageSet: data
              });
          }
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
  clear: function (filter) {
    FormDef.initRoleManageForm(this.state.roleManage);
    this.state.flag = false;
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
      this.state.roleManage.roleName = '';
      this.state.roleManage.menuList = '';
    this.state.roleManage.filter = filter;
    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickSave: function () {
    let menuList = this.menuList.state.checkedList.slice(0);
    var list = [];
    for (var i=0;i<menuList.length;i++){
      var obj = {};
      obj.uuid = menuList[i];
      list.push(obj);
    }
    this.state.roleManage.menuList = list;
    if (Common.formValidator(this, this.state.roleManage)) {
      let sendData = Utils.deepCopyValue(this.state.roleManage);
      sendData.menuListText = this.menuList.getCheckListText(menuList) ? this.menuList.getCheckListText(menuList) :'暂无';
      this.setState({ loading: true });
      RoleManageActions.createRoleManage(sendData);
    }
  },
  render: function () {
    let attrList = [
    ];
    let items = FormDef.getRoleManageForm(this, this.state.roleManage, attrList);
    let layout = 'horizontal';
    return (
        <Modal
            bodyStyle = {{height:350,overflow:'auto'}}
            visible={this.state.modal}
            width="540px" title="新增角色"
            className='organization-class'
            maskClosable={false}
            onOk={this.onClickSave}
            onCancel={this.toggle}
            footer={[
              <div key="footerDiv" className='organization-alert' style={{ display: 'block', textAlign: 'right' }}>
                <ServiceMsg ref="mxgBox" svcList={['role/create']} />
                <Button
                    key="btnOK" type="primary" size="large" onClick={this.onClickSave}
                    loading={this.state.loading}
                >保存</Button>
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
              </div>
            ]}
        >
          <Form ref={ref=>this.formList=ref} layout={layout} style={{padding:16}}>
            {items}
            <MenuList ref={ref=>this.menuList=ref}/>
          </Form>
        </Modal>
    );
  }
});

export default CreateRoleManagePage;
