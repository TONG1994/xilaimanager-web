/**
 *   Create by FYSW on 2018/4/26
 */

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

let TemplatePrintStore = require('../data/TemplatePrintStore');
let TemplatePrintActions = require('../action/TemplatePrintActions');
import UpdateButton from './UpdateButton';
import LogisticsCompanySelect from '../../../lib/Components/logisticsCompany/LogisticsCompanySelect';

//person component
let FormDef = require('./PrintTemplateForm');
import PreViewModal from './PreViewModal';


var UpdatePrintTemplatePage = React.createClass({
  getInitialState : function() {
    return {
      PrintTemplateSet: {},
      loading: false,
      modal: false,
      printTemplateInfo: {},
      hints: {},
      validRules: [],
      onlyLoding:''
    }
  },
  
  mixins: [Reflux.listenTo(TemplatePrintStore, "onServiceComplete"), ModalForm('printTemplateInfo')],
  onServiceComplete: function(data) {
    if(this.state.modal && data.operation === 'update'){
      if( data.errMsg === ''){
        // 成功，关闭窗口
        this.setState({
          modal: false
        });
      }
      else{
        // 失败
        this.setState({
          loading: false,
          PrintTemplateSet: data
        });
      }
    }
  },
  
  // 第一次加载
  componentDidMount : function(){
    this.state.validRules = FormDef.getUpdateTemplatePrintFormRule(this);
  },

  
  initPage: function(printTemplateInfo)
  {
    this.state.hints = {};
    Utils.copyValue(printTemplateInfo, this.state.printTemplateInfo);
    this.setState({
      loading: false,
    });
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
  },
  
  onClickSave : function(){
    let myBase64=this.refs.getBase64pic.state.base64pic;
    this.state.printTemplateInfo.base64pic=myBase64;
    let checkFields={
      logisticsCompanyName:this.state.printTemplateInfo.logisticsCompanyName,
      expresstemplate:this.state.printTemplateInfo.expresstemplate
    }
    if (Common.formValidator(this, checkFields)) {
      this.setState({loading: true});
      TemplatePrintActions.updateTemplatePrint(this.state.printTemplateInfo,this);
    }
  },

 clear: function (filter) {
    FormDef.initCreateForm(this.state.printTemplateInfo);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.printTemplateInfo.uuid = '';
    this.state.printTemplateInfo.filter = filter;
    
    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  beforeClose:function(){
    if(typeof (this.refs.getBase64pic) !== 'undefined'){
      this.refs.getBase64pic.initDemo();
      this.refs.getPreView.clear();
    }
  },

  onUpdateChange:function(data){
    Utils.copyValue(data, this.state.printTemplateInfo);
    this.setState({
      onlyLoding:"44"
    })
  },

  render : function() {
    var layout='horizontal';
    let attrList = [
      {
        name:'base64pic',
        id:'base64pic',
        object:this.state.modal?<UpdateButton name='Updatebase64pic' id='Updatebase64pic' ref="getBase64pic" onUpdateChange={this.onUpdateChange} Action={this.props.Action}/>:<div/>
      },
      {
        name:'preView',
        id:'preView',
        object:<PreViewModal name='UpdatepreView' id='UpdatepreView' ref="getPreView" PicData={this.state.printTemplateInfo}/>
      },
    ];
    let  items  = FormDef.getUpdateTemplatePrintForm(this, this.state.printTemplateInfo, attrList),
         modalFoot = [
          <div key="footerDivUp" style={{display:'block', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['organizationInfo/update']}/>
            <Button key="btnOK" title="保存"  type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" title="取消"  size="large" onClick={this.toggle}>取消</Button>
          </div>
        ];
    return (
        <Modal visible={this.state.modal} width='540px' title="修改信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
               footer={modalFoot}
        >
          <Form layout={layout}>
            { items }
          </Form>
        </Modal>
    );
  }
});

export default UpdatePrintTemplatePage;