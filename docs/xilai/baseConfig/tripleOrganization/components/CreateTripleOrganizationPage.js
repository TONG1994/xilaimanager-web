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
import TripleNames from './TripleNames';
import OrgNames from './OrgNames';
import BeforeData from './BeforeData';

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
      paramsArr:[],
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
    this.initValidRules();
    if(this.state.modal&&this.formList){
      ReactDOM.findDOMNode(this.formList).scrollTop = 0;
    }
  },
  // 第一次加载
  componentDidMount: function () {
    this.initValidRules();
  },
  initValidRules:function () {
    this.state.validRules = [
      { id: 'logisticsCompanyName', desc: '三方公司名称',required:true},
      { id: 'orgName', desc: '喜来服务站名称',required:true},
      { id: 'serviceType', desc: '类型',required:true},
    ];
    this.clear();
  },
  clear: function (obj={id:'',name:'',uuid:'',serviceType:''}) {
    let {tripleOrganization,paramsArr}= this.state;
    if(obj.id==='orgName'){//修改喜来服务站名称
      tripleOrganization.orgNo = obj.uuid;
      tripleOrganization.orgName = obj.name;
    }else if(obj.id==='serviceType'){//修改代理类型
      tripleOrganization = {serviceType:obj.serviceType}
    }
    else if(obj.id==='logisticsCompanyName'){    //修改三方公司名称
      tripleOrganization.logisticsCompanyName = obj.name;
      tripleOrganization.logisticsCompanyUuid = obj.uuid;
      tripleOrganization.orgNo = '';
      tripleOrganization.orgName = '';
    }else{
      tripleOrganization = {};
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
      let orgInfoJsonStr = {};//存放返回数据的
      let noInArr = ['logisticsCompanyName','logisticsCompanyUuid','orgNo','orgName'];
      let sendData = Utils.deepCopyValue(this.state.tripleOrganization);
      for(let i in sendData){
        if(noInArr.indexOf(i)===-1){
          orgInfoJsonStr[i] = sendData[i];
        }
      }
      sendData.orgInfoJsonStr = JSON.stringify(orgInfoJsonStr);
      sendData.beforeData = BeforeData.getBeforeData(this.state.tripleOrganization,this.state.paramsArr);
      this.setState({ loading: true });
      TripleOrganizationActions.create(sendData);
    }
  },
  changeOrgNames:function (obj={id:'',text:'',value:''}) {
    this.clear({ id:'orgName', name:obj.text,uuid:obj.value });
  },
  changeTripleNames:function (obj={id:'',logisticsCompanyName:'',uuid:''}) {
    this.checkComp();
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
            required:true,
            max:item.checkType.indexOf('max')>-1?Number(item.checkType.split('-')[1]):0,
            pattern:
                item.checkType==='phone'?/^\d{11}$/g:
                    item.checkType==='tel'?/^\d{3,4}-\d{8}$/g:
                        item.checkType==="phoneTel"?/(^\d{11}$)|(^\d{3,4}-\d{8}$)/i:null
          })
        }
      })
    };
    this.setState({paramsArr,validRules});
  },
  clearTripleName:function () {
    this.clear({id:'orgName',name:'',uuid:''});
  },
  checkComp:function () {
    Common.validator(this, this.state.tripleOrganization,'logisticsCompanyName');
  },
  handleSelectChange:function (val) {
    this.setState({tripleOrganization:Object.assign({},this.state.tripleOrganization,{serviceType:val})});
    this.clear({id:'serviceType',serviceType:val});
    this.TripleNames.getCompanyArr(val);
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
            <Input
                name={item.param}
                id={item.param}
                value={tripleOrganization[item.param]}
                onChange={this.handleOnChange}
            />
          </FormItem >
      ):'';
      return returnHtml;
    });
    return (
        <Modal
            visible={this.state.modal}
            width="540px" title="代理设置"
            className='organization-class'
            maskClosable={false}
            onOk={this.onClickSave}
            onCancel={this.toggle}
            footer={[
              <div key="footerDiv" className='organization-alert' style={{ display: 'block', textAlign: 'right' }}>
                <ServiceMsg ref="mxgBox"
                            svcList={[
                              'agent/queryLogisticsCompanys',
                              'agent/searchSitesByFilter',
                              'agent/getNeedParams',
                              'agent/create'
                            ]} />
                <Button
                    key="btnOK" type="primary" size="large" onClick={this.onClickSave}
                    loading={this.state.loading}
                >保存</Button>{' '}
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
              </div>
            ]}
        >
          <Form ref={ ref=>this.formList=ref } layout={layout} style={{height:280,overflowX:'hidden',overflowY:'auto',padding:16}}>
            <div style={{color:'#ccc',marginBottom:10}} key='基本信息'>基本信息</div>
            <FormItem {...formItemLayout} key='serviceType' label='类型'  colon={true} help={hints.serviceTypeHint} validateStatus={hints.serviceTypeStatus}   >
              <Select
                  id='serviceType'
                  name='serviceType'
                  value={tripleOrganization.serviceType}
                  onChange={this.handleSelectChange}
              >
                <Option value="0">--</Option>
                <Option value="1">收件</Option>
                <Option value="2">派件</Option>
              </Select>
            </FormItem >
            <FormItem {...formItemLayout} key='logisticsCompanyName' label='三方公司名称'  colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus}   >
              <TripleNames
                  name='logisticsCompanyName'
                  id='logisticsCompanyName'
                  value={tripleOrganization.logisticsCompanyUuid}
                  changeTripleNames={this.changeTripleNames}
                  ref = {ref=>this.TripleNames=ref}
              />
            </FormItem >
            <FormItem {...formItemLayout} key='orgName' label='喜来服务站名称'  colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}   >
              <OrgNames name='orgName' id='orgName'
                        value={tripleOrganization.orgName}
                        tripleName={tripleOrganization.logisticsCompanyUuid}
                        serviceType={tripleOrganization.serviceType}
                        changeOrgNames={this.changeOrgNames}
                        setParams={this.setParams}
                        ref = {ref=>this.orgNames=ref}
                        clearTripleName = {this.clearTripleName}
                        checkComp = {this.checkComp}
              />
            </FormItem >
            { params }
          </Form>
        </Modal>
    );
  }
});

export default CreateTripleOrganizationPage;
