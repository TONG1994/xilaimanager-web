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

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let TripleOrganizationStore = require('../store/TripleOrganizationStore.js');
let TripleOrganizationActions = require('../action/TripleOrganizationActions');

//person component

let FormDef = require('./tripleOrganizationForm');

let CreateTripleOrganizationPage = React.createClass({
  getInitialState: function () {
    return {
      tripleOrganizationSet: {},
      loading: false,
      modal: false,
      tripleOrganization: {},
      hints: {},
      flag:false,
      validRules: [],
    };
  },
  
  mixins: [Reflux.listenTo(TripleOrganizationStore, 'onServiceComplete'), ModalForm('tripleOrganization')],
  onServiceComplete: function (data) {
    if (this.state.modal && data.operation === 'create') {
      if (data.errMsg === '') {
        // 成功，关闭窗口
        this.setState({
          modal: false
        });
        // this.props.createSuccess(data.recordSet)
      } else {
        // 失败
        this.setState({
          loading: false,
          tripleOrganizationSet: data
        });
      }
    }
  },
  beforeClose:function () {
    if(this.state.modal&&this.formList){
      ReactDOM.findDOMNode(this.formList).scrollTop = 0;
    }
  },
  checkBankCardno:function (value) {
    let test = /^\d+$/;
    let testVal = test.test(value);
    if(!testVal){
      return '请输入数字'
    }
  },
  // 第一次加载
  componentDidMount: function () {
    let attrList = [
      {
        name:'bankCardno',
        validator:this.checkBankCardno
      },
    ];
    this.state.validRules = FormDef.getTripleOrganizationFormRule(this,attrList);
  },
  clear: function (filter) {
    FormDef.initTripleOrganizationForm(this.state.tripleOrganization);
    this.state.flag = false;
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.tripleOrganization.uuid = '';
    this.state.tripleOrganization.filter = filter;
    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickSave: function () {
    let curNo = Common.getLoginData()?Common.getLoginData().staffInfo.orgNo:'暂无',
        curType = Common.getUserType();
    //经营中心新建服务站
    if (Common.formValidator(this, this.state.tripleOrganization)) {
      let sendData = Utils.deepCopyValue(this.state.tripleOrganization);
      this.setState({ loading: true });
      TripleOrganizationActions.createTripleOrganization(sendData);
    }
  },
  render: function () {
    let attrList = [
      {
        name:'orgType',
        id:'orgType',
      },
    ];
    let items = FormDef.getTripleOrganizationForm(this, this.state.tripleOrganization, attrList);
    let layout = 'horizontal';
    return (
        <Modal
            visible={this.state.modal}
            width="540px" title="增加三方网点"
            className='organization-class'
            maskClosable={false}
            onOk={this.onClickSave}
            onCancel={this.toggle}
            footer={[
              <div key="footerDiv" className='organization-alert' style={{ display: 'block', textAlign: 'right' }}>
                <ServiceMsg ref="mxgBox"
                            svcList={[
                              'organization/create',
                              'organization/remove',
                              'organization/retrieveByFilter',
                              'organization/get-by-uuid'
                            ]} />
                <Button
                    key="btnOK" type="primary" size="large" onClick={this.onClickSave}
                    loading={this.state.loading}
                >保存</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
              </div>
            ]}
        >
          <Form ref={ref=>this.formList=ref} layout={layout} style={{height:380,overflowX:'hidden',overflowY:'auto',margin:-16,padding:16}}>
            {items}
          </Form>
        </Modal>
    );
  }
});

export default CreateTripleOrganizationPage;
