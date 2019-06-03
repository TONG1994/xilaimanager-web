/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
let FormDef = require('./tripleOrganizationForm');

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let TripleOrganizationStore = require('../store/TripleOrganizationStore.js');
let TripleOrganizationActions = require('../action/TripleOrganizationActions');

let UpdateTripleOrganizationPage = React.createClass({
  getInitialState: function () {
    return {
      tripleOrganizationSet: {},
      loading: false,
      modal: false,
      tripleOrganization: {},
      hints: {},
      validRules: []
    };
  },

  mixins: [Reflux.listenTo(TripleOrganizationStore, 'onServiceComplete'), ModalForm('tripleOrganization')],
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
          tripleOrganizationSet: data
        });
      }
    }
  },

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getTripleOrganizationFormRule(this);
  },

  initPage: function (tripleOrganization) {
    this.state.hints = {};
    Utils.copyValue(tripleOrganization, this.state.tripleOrganization);
    this.toggle();
    this.setState({loading:false});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickSave: function () {
    if (Common.formValidator(this, this.state.tripleOrganization)) {
      this.setState({ loading: true });
      TripleOrganizationActions.updateTripleOrganization(this.state.tripleOrganization);
    }
  },

  render: function () {
    let layout = 'horizontal';
    var attrList = null;
    var items = FormDef.getTripleOrganizationForm(this, this.state.tripleOrganization, attrList);
    return (
      <Modal
        visible={this.state.modal}
        width="540px"
        title="修改三方网点"
        maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
            <ServiceMsg ref="mxgBox" svcList={['tripleOrganization/update']} />
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
        ]}
      >
        <Form layout={layout} ref={ref=>this.formList=ref} style={{height:380,overflowX:'hidden',overflowY:'auto',margin:-16,padding:16}}>
          {items}
        </Form>
      </Modal>
    );
  }
});

export default UpdateTripleOrganizationPage;
