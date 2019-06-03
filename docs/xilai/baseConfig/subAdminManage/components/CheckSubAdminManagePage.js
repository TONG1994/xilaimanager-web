/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
let FormDef = require('./SubAdminManageForm');

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import {SubAdminManagePage} from "../SubAdminManagePage";
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import RoleList from '../../../lib/Components/roleList/RoleList';
import OperateLog from '../../../lib/Components/OperateLog';
let SubAdminManageStore = require('../data/SubAdminManageStore.js');
let SubAdminManageActions = require('../action/SubAdminManageActions');

let SubAdminManageLogPage = React.createClass({
  getInitialState: function () {
    return {
        subAdminManageSet: {},
        loading: false,
        modal: false,
        subAdminManage: {},
        hints: {},
        validRules: [],
        oldValue: {},
        uuid: ''
    }
  },

  mixins: [Reflux.listenTo(SubAdminManageStore, 'onServiceComplete'), ModalForm('subAdminManage')],
  onServiceComplete: function (data) {
    if (this.state.modal && data.operation === 'updateManager') {
      if (data.errMsg === '') {
        // 成功，关闭窗口
        this.setState({
          modal: false
        });
      } else {
        // 失败
        this.setState({
          loading: false,
            subAdminManageSet: data
        });
      }
    }
  },

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getSubAdminManageFormRule(this);
  },

  initPage: function (subAdminManage) {
    this.state.hints = {};
    Utils.copyValue(subAdminManage, this.state.subAdminManage);
    Utils.copyValue(subAdminManage, this.state.oldValue);
    this.state.uuid = subAdminManage.uuid;
    this.toggle();
    this.setState({loading:false});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickSave: function () {
    if (Common.formValidator(this, this.state.subAdminManage)) {
      this.setState({ loading: true });
      let filter = Utils.deepCopyValue(this.state.subAdminManage);
      filter.orgNo = Common.getLoginData() ? Common.getLoginData().staffInfo.orgNo : '暂无';
        SubAdminManageActions.updateSubAdminManage(filter, this.state.oldValue);
    }
  },
    changeRoleList:function (obj={id:'',roleName:'',uuid:''}) {
        let {subAdminManage,loading,hints}= this.state;
        subAdminManage.roleName=obj.roleName;
        subAdminManage.roleUuid=obj.uuid;
        //设值
        this.setState({loading:loading,subAdminManage,hints});
    },
  render: function () {
      let layout = 'horizontal';
      let {hints} = this.state;
      const formItemLayout = {
          labelCol: ((layout == 'vertical') ? null : { span: 6 }),
          wrapperCol: ((layout == 'vertical') ? null : { span: 18 }),
          className:'form-item-horizontal'
      };

    let  attrList = [
        {
            name:'roleName',
            id:'roleName',
            object:<RoleList
                name="roleName"
                id="roleName"
                value={this.state.subAdminManage['roleName']}
                changeRoleList={this.changeRoleList} disabled={true} />
        }
    ];
    var items = FormDef.getSubAdminManageForm(this, this.state.subAdminManage, attrList,null,null,true);
    return (
      <Modal
        visible={this.state.modal}
        width="540px"
        title="查看"
        maskClosable={false}  onCancel={this.toggle}
        footer={null}
      >
        <Form layout={layout} ref={ref=>this.formList=ref} style={{height:210,overflowX:'hidden',overflowY:'auto',padding:16,}}>
          {items}
          <OperateLog  uuid ={this.state.uuid} modal={this.state.modal}/>
        </Form>
      </Modal>
    );
  }
});

export default SubAdminManageLogPage;
