/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import ReactDOM from 'react-dom'

let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import OperateLog from '../../../lib/Components/OperateLog';

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let TripleOrganizationStore = require('../store/TripleOrganizationStore.js');
let TripleOrganizationActions = require('../action/TripleOrganizationActions');

//person component
import TripleNames from './TripleNames';
import OrgNames from './OrgNames';
import BeforeData from './BeforeData';

let UpdateTripleOrganizationPage = React.createClass({
  getInitialState: function () {
    return {
      tripleOrganizationSet: {},
      loading: false,
      modal: false,
      tripleOrganization: {},
      hints: {},
      flag:false,
      spinning:true,
      validRules: [],
      paramsArr:[]
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
  initPage: function (tripleOrganization) {
    // this.clear();
    this.state.hints = {};
    this.state.tripleOrganization = tripleOrganization;
    this.state.paramsArr = [];
    this.state.flag = false;
    this.toggle();
    this.setState({loading:false});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  initParams:function (paramsArr) {
    this.setState({spinning:false});
    this.setParams(paramsArr);
  },
  beforeClose:function () {
    if(this.state.modal&&this.formList){
      ReactDOM.findDOMNode(this.formList).scrollTop = 0;
    }
  },
  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = [
      { id: 'logisticsCompanyName', desc: '三方公司名称', max: '50',required:true},
      { id: 'orgName', desc: '喜来服务站名称', max: '20',required:true},
    ];
    // this.clear();
  },
  clear: function (obj={id:'',name:'',uuid:''}) {
    let {tripleOrganization,paramsArr}= this.state,
        oldLogisticsCompanyName = tripleOrganization.logisticsCompanyName,
        logisticsCompanyUuid = tripleOrganization.logisticsCompanyUuid
    tripleOrganization = {};
    tripleOrganization.orgName = '';
    tripleOrganization.orgNo = '';
    if(obj.id==='orgName'){//机构
      tripleOrganization.logisticsCompanyName = oldLogisticsCompanyName;
      tripleOrganization.logisticsCompanyUuid = logisticsCompanyUuid;
      tripleOrganization.orgNo = obj.uuid;
      tripleOrganization.orgName = obj.name;
    }else{    //三方快递
      tripleOrganization.logisticsCompanyName = obj.name;
      tripleOrganization.logisticsCompanyUuid = obj.uuid;
      tripleOrganization.orgNo = '';
      tripleOrganization.orgName = '';
    }
    paramsArr = [];
    this.state.flag = false;
    this.state.hints = {};
    this.setState({loading:false,tripleOrganization,paramsArr});
    //清除数据参数
    if(this.orgNames){
      this.orgNames.setState({dataSource:[],value:''});
    }
    if (typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickSave: function () {
    if (Common.formValidator(this, this.state.tripleOrganization)) {
      let sendData = Utils.deepCopyValue(this.state.tripleOrganization);
      sendData.beforeData = BeforeData.getBeforeData(this.state.tripleOrganization,this.state.paramsArr);
      this.setState({ loading: true });
      TripleOrganizationActions.update(sendData);
    }
  },
  changeOrgNames:function (obj={id:'',text:'',value:''}) {
    this.clear({ id:'orgName', name:obj.text,uuid:obj.value });
  },
  changeTripleNames:function (obj={id:'',logisticsCompanyName:'',uuid:''}) {
    this.clear({ id:'logisticsCompanyName', name:obj.logisticsCompanyName,uuid:obj.uuid });
  },
  setParams:function (paramsArr) {
    let {validRules,tripleOrganization} = this.state;
    if(paramsArr.length){
      paramsArr.map(item=>{
        tripleOrganization[item.param] = item.defaultValue;
        if(item.must==true){
          validRules.push({
            id:item.param,
            desc:item.name,
            required:true
          })
        }
      })
    };
    this.setState({paramsArr,validRules});
  },
  clearTripleName:function () {
    this.clear({id:'orgName',name:'',uuid:''});
  },
  render: function () {
    let layout = 'horizontal';
    let {hints,tripleOrganization,paramsArr} = this.state;
    const formItemLayout = {
      labelCol: ((layout == 'vertical') ? null : { span: 8 }),
      wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
      className:'form-item-horizontal'
    };
    let params = paramsArr.map(item=>{
      let layout = Utils.deepCopyValue(formItemLayout);
      if(item.must==true){
        layout.required = true;
      }
      let returnHtml =  item.display==false?(
          <FormItem {...layout} key={item.param} label={item.name}  colon={true} help={hints[item.param+'Hint']} validateStatus={hints[item.param+'Status']}   >
            <Input name={item.param} id={item.param} defaultValue={item.defaultValue} onChange={this.handleOnChange} disabled={true} />
          </FormItem >
      ):'';
      return returnHtml;
    });
    let serviceTypeName = tripleOrganization.serviceType ==='1'?'收件':'派件';
    return (
        <Modal
            visible={this.state.modal}
            width="540px" title="代理设置"
            className='organization-class'
            maskClosable={false}
            onOk={this.onClickSave}
            onCancel={this.toggle}
            footer={null}
        >
          <Spin spinning={this.state.spinning}>
            <Form ref={ ref=>this.formList=ref } layout={layout} style={{height:280,overflowX:'hidden',overflowY:'auto',padding:16}}>
              <div style={{color:'#ccc',marginBottom:10}} key='基本信息'>基本信息</div>
              <FormItem {...formItemLayout} key='serviceTypeName' label='类型'  colon={true} help={hints.serviceTypeHint} validateStatus={hints.serviceTypeStatus}   >
                <Input value={serviceTypeName} disabled={true}/>
              </FormItem >
              <FormItem {...formItemLayout} key='logisticsCompanyName' label='三方公司名称'  colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus}   >
                <Input value={tripleOrganization.logisticsCompanyName} disabled={true}/>
              </FormItem >
              <FormItem {...formItemLayout} key='orgName' label='喜来服务站名称'  colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}   >
                <Input value={tripleOrganization.orgName} disabled={true}/>
              </FormItem >
              { params }
              <OperateLog  uuid ={tripleOrganization.uuid} modal={this.state.modal}/>
            </Form>
          </Spin>
        </Modal>
    );
  }
});

export default UpdateTripleOrganizationPage;
