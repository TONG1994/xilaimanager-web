/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import ReactMixin from 'react-mixin';

let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Spin, Col ,Tabs} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import ReactDOM from 'react-dom'

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';

let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let OrganizationInfoStore = require('../data/OrganizationInfoStore.js');
let OrganizationInfoActions = require('../action/OrganizationInfoActions');

//person component

let FormDef = require('./OrganizationForm');
import BusinessCenter from './BusinessCenter';
import BranchSelect from './BranchSelect';
import AreaPosition from '../../../lib/Components/AreaPosition';
import BusinessTime from './BusinessTime';
import CommonActions from '../action/BusinessCenterActions';
import CommonStore from '../data/BusinessCenterStore';
import OperateLog from '../../../lib/Components/OperateLog';

let CreateOrganizationInfoPage = React.createClass({
  getInitialState: function () {
    return {
      organizationInfoSet: {},
      loading: false,
      modal: false,
      organizationInfo: {defaultAccountType:'1'},
      hints: {},
      validRules: []
    };
  },
  
  mixins: [Reflux.listenTo(CommonStore, 'getBusinessCenter'), ModalForm('organizationInfo')],
  initPage: function(organizationInfo)
  {
    this.state.hints = {};
    Utils.copyValue(organizationInfo, this.state.organizationInfo);
    this.state.organizationInfo.area = Number(this.state.organizationInfo.area)/1000;
    this.setState({loading:true});
    CommonActions.getBusinessCenterByNo({orgNo:organizationInfo.parentOrgNo});
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
  },
  getBusinessCenter:function(data){
    if(data.operation==='getBusinessCenterByNo'){
      let d = data.recordSet?data.recordSet.orgName:'获取失败';
      this.state.organizationInfo.parentOrgNo = d;
      this.setState({loading:false});
    }
  },
  componentWillMount() {
    // if (this.getBusinessCenterFun) {
    //   this.getBusinessCenterFun();
    // }
  },
  // 第一次加载
  componentDidMount: function () {
    // this.getBusinessCenterFun = CommonStore.listen(this.getBusinessCenter);
    this.state.organizationInfo.manageCounty = '';
    let attrList = [
      {
        name:'headTelephone',
        dataType:'mobile',
        validator:this.checkHeadTelephone
      },
      {
        name:'area',
        dataType:'number',
      },
      {
        name:'bankCardno',
        dataType:'number'
      },
      {
        name:'orgName',
        validator:this.checkOrgName
      },
      {
        name:'payNo',
        validator:this.checkPayNo
      }
    ];
    this.state.validRules = FormDef.getCreateFormRule(this,attrList);
  },
  checkPayNo:function (value) {
    let regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        regPhone = /^((\(\d{1,5}\))|(\d{1,5}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(-\d{1,5})?$/;
    if(!regEmail.test(value)&&!regPhone.test(value)){
      return '请输入邮箱或者手机号'
    }
  },
  checkOrgName:function (value,rule) {
    //检查机构名称唯一性
  },
  checkHeadTelephone:function (value,rule) {
    //检查手机号是否唯一
  },
  clear: function (filter) {
    FormDef.initCreateForm(this.state.organizationInfo);
    this.state.organizationInfo.manageCounty = '';
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.organizationInfo.uuid = '';
    this.state.organizationInfo.filter = filter;
    
    
    
    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  
  onClickSave: function () {
    if(this.state.organizationInfo.orgType=='2'){
      this.state.organizationInfo.area = 3 ;
    }
    else{
      this.state.organizationInfo.manageCity = 'no';
      this.state.organizationInfo.manageCounty = 'no';
    }
    if (Common.formValidator(this, this.state.organizationInfo)) {
      this.setState({ loading: true });
      OrganizationInfoActions.createOrganizationInfo(this.state.organizationInfo);
    }
  },
  set:function (id,val,f) {
    let organizationInfo = Object.assign({},this.state.organizationInfo);
    organizationInfo[id] = val;
    //是否检验
    // if(!f){
    //   Common.validator(this,organizationInfo,id);
    // }
    this.setState({organizationInfo});
  },
  //经营中心 选择组件 回调
  //type改变类型  1:改变省市  2:改变区域
  areaChange:function (type,val) {
    if(type==='1'){
      let organizationInfo = Object.assign({},this.state.organizationInfo);
      organizationInfo.manageCity= val;
      organizationInfo.manageCounty= '';
      this.setState({organizationInfo});
    }
    if(type==='2'){
      this.set('manageCounty',val);
    }
  },
  //营业时间
  businessChange:function (data) {
    this.set('businessHours',data,true);
  },
  //地区选择回调
  areaPosition:function (val) {
    this.handleOnSelected('orgAddress',val.toString());
  },
  setDef:function (e) {
    let id = e.target.id,
        organizationInfo = Object.assign({},this.state.organizationInfo);
    if(id==='payNo'){
      organizationInfo.defaultAccountType = '2';
    }
    else if(id==='bankCardno'){
      organizationInfo.defaultAccountType = '1';
    };
    this.setState({organizationInfo});
  },
  setDefH:function(id){
    return '';
    // return <span id={id} style={{cursor:'pointer',color:'#49a9ee'}} onClick={this.setDef}>设为默认</span>
  },
  beforeClose:function () {
    if(this.state.modal&&this.formList){
      ReactDOM.findDOMNode(this.formList).scrollTop = 0;
    }
  },
  onTabChange:function(activeKey){
      if(activeKey === '1'){
          this.props.goBack();
      }
  },
  render: function () {
    let oData = this.state.organizationInfo;
    let defA = <span style={{color:'#999'}}>默认账号</span>,
        def = this.state.organizationInfo.defaultAccountType;
    let bankBtn = def==="1"?defA :this.setDefH('bankCardno'),
        payNo = def==="2"?defA :this.setDefH('payNo');
    let attrList = [
      {
        name:'orgAddress',
        id:'orgAddress',
        object:<AreaPosition disabled name='orgAddress' id='orgAddress' onChange={this.areaPosition} value={this.state.organizationInfo['orgAddress']} />
      },
        //收件范围
        {
            name:'area',
            id:'area',
            visible:oData.orgType=="3"||oData.orgType=="服务站"?'':'hidden',
        },
      //经营范围
      {
        name:'manageCity',
        id:'manageCity',
        visible:oData.orgType=="2"||oData.orgType=="经营中心"?'':'hidden',
        object:<BranchSelect
            name='manageCity'
            id='manageCity'
            onChange={this.areaChange}
            manageCity={this.state.organizationInfo['manageCity']}
            manageCounty={this.state.organizationInfo['manageCounty']}
            disabled = {true}
        />
      },
      //所属经营中心
      {
        name:'parentOrgNo',
        id:'parentOrgNo',
        visible:oData.orgType=="3"||oData.orgType=="服务站"?'':'hidden',
        object:<Input
            size='large'
            id='parentOrgNo'
            name='parentOrgNo'
            value={this.state.organizationInfo['parentOrgNo']}
            disabled = {true}
        />
      },
      //营业时间
      {
        name:'businessHours',
        id:'businessHours',
        object:<BusinessTime
            id='businessHours'
            onChange={this.businessChange}
            value={this.state.organizationInfo['businessHours']}
            disabled
        />
      },
      //获取经纬度
      {
        name:'orgLocation',
        id:'orgLocation',
        object:<Input
            size='large'
            id='orgLocation'
            name='orgLocation'
            value={this.state.organizationInfo['orgLocation']}
            disabled = {true}
        />
      },
    ];
    let rules = Utils.deepCopyValue(this.state.validRules);
    let allList = [];
    rules.map(item=>{
      let f;
      attrList.map(jtem=>{
        if(item.id===jtem.id){
          jtem['disabled'] = true;
          allList.push(jtem);
          f = true;
        }
      });
      if(!f){
        allList.push({
          name:item.id,
          id:item.id,
          disabled:true
        })
      }
    });
    let items = allList.length?FormDef.getCreateForm(this, this.state.organizationInfo, allList):'';
    let layout = 'horizontal';
    return (
          <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
              <Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                  <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                  </TabPane>
                  <TabPane tab="查看机构信息" key="2" style={{width: '100%', height: '100%'}}>
                      <div style={{padding:'8px 0 16px 8px', height: '100%',overflowY: 'auto',width:'1080px'}}>
                          <ServiceMsg ref='mxgBox' svcList={['']}/>
                          <Form layout={layout} ref={ref=>this.formList=ref} >
                              { items }
                              <OperateLog  uuid ={oData.uuid} modal={this.state.modal}/>
                          </Form>
                      </div>
                  </TabPane>
              </Tabs>
          </div>
    );
  }
});

export default CreateOrganizationInfoPage;