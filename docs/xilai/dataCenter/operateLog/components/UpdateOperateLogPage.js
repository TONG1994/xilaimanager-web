/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
let FormDef = require('./OperateLogForm');

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let OperateLogStore = require('../store/OperateLogStore.js');
let OperateLogActions = require('../action/OperateLogActions');

let UpdateOperateLogPage = React.createClass({
  getInitialState: function () {
    return {
      operateLogSet: {},
      loading: false,
      modal: false,
      operateLog: {},
      hints: {},
      validRules: []
    };
  },

  mixins: [Reflux.listenTo(OperateLogStore, 'onServiceComplete'), ModalForm('operateLog')],
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
          operateLogSet: data
        });
      }
    }
  },

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getOperateLogFormRule(this);
  },

  initPage: function (operateLog) {
    this.state.hints = {};
    Utils.copyValue(operateLog, this.state.operateLog);
    this.toggle();
    this.setState({loading:false});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickSave: function () {
    if (Common.formValidator(this, this.state.operateLog)) {
      this.setState({ loading: true });
      OperateLogActions.updateOperateLog(this.state.operateLog);
    }
  },

  render: function () {
    let layout = 'horizontal';
    var attrList = null;
    var items = FormDef.getOperateLogForm(this, this.state.operateLog, attrList);
    return (
      <Modal
        visible={this.state.modal}
        width="540px"
        title="修改三方网点"
        maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={null}
      >
        <Form layout={layout} ref={ref=>this.formList=ref} style={{height:380,overflowX:'hidden',overflowY:'auto',margin:-16,padding:16}}>
          {items}
        </Form>
      </Modal>
    );
  }
});

export default UpdateOperateLogPage;
