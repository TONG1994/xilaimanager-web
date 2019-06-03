/**
 *   Create by Malson on 2018/4/25
 */
import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';


let FormDef = require('./organizationForm');


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let AddressStore = require('../store/AddressStore.js');
let AddressActions = require('../action/AddressActions');

let CreateAddressPage = React.createClass({
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
    if (this.state.modal && data.operation === 'create') {
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

  clear: function (filter) {
    
    FormDef.initAddressForm(this.state.address);

    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.address.uuid = '';
    this.state.address.filter = filter;


    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  onClickSave: function () {
    if (Common.formValidator(this, this.state.address)) {
      this.setState({ loading: true });
      AddressActions.createAddress(this.state.address);
    }
  },

  render: function () {
    let layout = 'horizontal';
    var attrList = null;
    var items = FormDef.getAddressForm(this, this.state.address, attrList);
    return (
      <Modal
        visible={this.state.modal} width="540px" title="增加门店管理" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
            <ServiceMsg ref="mxgBox" svcList={['address/create']} />
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
        ]}
      >
        <Form layout={layout} >
          { items }
        </Form>
      </Modal>
    );
  }
});

export default CreateAddressPage;
