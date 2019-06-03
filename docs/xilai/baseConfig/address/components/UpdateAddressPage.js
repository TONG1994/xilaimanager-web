/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
let FormDef = require('./organizationForm');

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let AddressStore = require('../store/AddressStore.js');
let AddressActions = require('../action/AddressActions');

let UpdateAddressPage = React.createClass({
  getInitialState: function () {
    return {
      addressSet: {},
      loading: false,
      modal: false,
      address: {},
      hints: {},
      validRules: []
    };
  },

  mixins: [Reflux.listenTo(AddressStore, 'onServiceComplete'), ModalForm('address')],
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
          addressSet: data
        });
      }
    }
  },

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getAddressFormRule(this);
  },

  initPage: function (address) {
    this.state.hints = {};
    Utils.copyValue(address, this.state.address);

    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  onClickSave: function () {
    if (Common.formValidator(this, this.state.address)) {
      this.setState({ loading: true });
      AddressActions.updateAddress(this.state.address);
    }
  },

  render: function () {
    let layout = 'horizontal';
    let layoutItem = 'form-item-' + layout;
    const formItemLayout = {
      labelCol: ((layout == 'vertical') ? null : { span: 4 }),
      wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
    };
    const formItemLayout2 = {
      labelCol: ((layout == 'vertical') ? null : { span: 8 }),
      wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
    };

    let hints = this.state.hints;
    var attrList = null;
    var items = FormDef.getAddressForm(this, this.state.address, attrList);
    return (
      <Modal
        visible={this.state.modal} width="540px" title="修改门店管理信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
            <ServiceMsg ref="mxgBox" svcList={['address/update']} />
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
        ]}
      >
        <Form layout={layout}>
          {items}
        </Form>
      </Modal>
    );
  }
});

export default UpdateAddressPage;
