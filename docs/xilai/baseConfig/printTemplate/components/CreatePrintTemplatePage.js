/**
 *   Create by FYSW on 2018/4/26
 */

import React from 'react';
import ReactMixin from 'react-mixin';

let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import LogisticsCompanySelect from '../../../lib/Components/logisticsCompany/LogisticsCompanySelect';

let TemplatePrintStore = require('../data/TemplatePrintStore');
let TemplatePrintActions = require('../action/TemplatePrintActions');

//person component
let FormDef = require('./PrintTemplateForm');
import UpdateButton from './UpdateButton';
import PreViewModal from './PreViewModal';


let CreatePrintTemplatePage = React.createClass({
  getInitialState: function (){
    return {
      PrintTemplateSet: {},
      loading: false,
      modal: false,
      printTemplateInfo:{},
      hints: {},
      validRules: [],
    };
  },

  mixins: [Reflux.listenTo(TemplatePrintStore, 'onServiceComplete'), ModalForm('printTemplateInfo')],
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
          PrintTemplateSet: data
        });
      }
    }
  },

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getCreateTemplatePrintFormRule(this);
  },

  clear: function (filter) {
    FormDef.initCreateTemplatePrintForm(this.state.printTemplateInfo);

    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.printTemplateInfo.uuid = '';
    this.state.printTemplateInfo.filter = filter;
  
    //刷新引入组件
    this.setState({loading: false});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  onClickSave: function () {
    let CompanyName=this.refs.SelectCompany.getOrdNameNode(this.state.printTemplateInfo.logisticsCompanyName);
    let myBase64=this.refs.getBase64pic.state.base64pic;
    this.state.printTemplateInfo.logisticsCompanyName=CompanyName;
    this.state.printTemplateInfo.base64pic=myBase64;
    let checkFields={
      logisticsCompanyName:this.state.printTemplateInfo.logisticsCompanyName,
      expresstemplate:this.state.printTemplateInfo.expresstemplate,
    }
    if (Common.formValidator(this, checkFields)) {
      this.setState({ loading: true });
      TemplatePrintActions.createTemplatePrint(this.state.printTemplateInfo,this);
    }
    // this.beforeClose();
  },

  beforeClose:function(){
      if(typeof (this.refs.getBase64pic) !== 'undefined'){
        this.refs.getBase64pic.initDemo();
      }
      if(typeof (this.refs.getPreView) !== 'undefined'){
        this.refs.getPreView.clear();
      }
  },

  onCreateChange:function(base64picData){
    this.refs.getPreView.setState({
      base64pic:base64picData
    });
  },
  
  render: function () {
    let attrList = [
      {
        name:'logisticsCompanyName',
        id:'logisticsCompanyName',
        object:<LogisticsCompanySelect ref="SelectCompany" name='logisticsCompanyName' onSelect={this.handleOnSelected.bind(this, 'logisticsCompanyName')}/>
      },
      {
        name:'base64pic',
        id:'base64pic',
        object:this.state.modal?<UpdateButton name='Createbase64pic' id='Createbase64pic' ref="getBase64pic" onCreateChange={this.onCreateChange} Action={this.props.Action}/>:<div/>
      },
      {
        name:'preView',
        id:'preView',
        object:<PreViewModal name='CreatepreView' id='CreatepreView' ref="getPreView" PicData={this.state.printTemplateInfo.base64pic}/>
      },
    ];
    let items = FormDef.getCreateTemplatePrintForm(this, this.state.printTemplateInfo, attrList);
    let layout = 'horizontal';
    return (
      <Modal
        visible={this.state.modal} width="450px" title="增加记录" maskClosable={false} onOk={this.onClickSave}
        onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
            <ServiceMsg ref="mxgBox" svcList={['printTemplateInfo/create']} />
            <Button
              key="btnOK" title="保存" type="primary" size="large" onClick={this.onClickSave}
              loading={this.state.loading} 
            >保存</Button>{' '}
            <Button key="btnClose" title="取消" size="large" onClick={this.toggle}>取消</Button>
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

export default CreatePrintTemplatePage;
