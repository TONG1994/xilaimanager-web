/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import AMapComponent from '../../../lib/Components/AMapComponent/Index';

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
import BranchSelect from './BranchSelect';
import AreaPosition from '../../../lib/Components/AreaPosition';
import BusinessTime from './BusinessTime';
import CommonActions from '../action/BusinessCenterActions';
import CommonStore from '../data/BusinessCenterStore';

let CreateOrganizationInfoPage = React.createClass({
  getInitialState: function () {
    return {
      organizationInfoSet: {},
      loading: false,
      modal: false,
      organizationInfo: {defaultAccountType:'1'},
      hints: {},
      flag: false,
      flags:true,
      validRules: [],
      beforeData:{},
      parentOrgName:'',
      parentOrgText: '',
      manageCity:'',
    };
  },
  mixins: [Reflux.listenTo(CommonStore, 'onServiceComplete'),Reflux.listenTo(OrganizationInfoStore, 'onUpdateComplete'), ModalForm('organizationInfo')],
  onServiceComplete: function(data) {
    if( !this.state.modal || data.errMsg){
      this.setState({
        loading: false,
      });
      return;
    }
    if(data.operation==='getBusinessCenterByNo'){
      let d = data.recordSet?data.recordSet.orgName:'获取失败';
      this.state.parentOrgName = d;
      this.state.beforeData.parentOrgText = d;
      this.setState({loading:false});
    }
    if(data.operation=="update"){
        this.setState({
            loading: false,
        });
        this.goBack();
    }
  },
  onUpdateComplete:function (data) {
    if( !this.state.modal || data.errMsg){
      this.setState({
        loading: false,
      });
      return;
	}
  },
  
  //初始化数据
  initPage: function(organizationInfo)
  {
    //处理收件范围
    CommonActions.getBusinessCenterByNo({orgNo:organizationInfo.parentOrgNo});
    Utils.copyValue(organizationInfo, this.state.organizationInfo);
    this.state.organizationInfo.area = Number(this.state.organizationInfo.area)/1000;
    
    let beforeData = Utils.deepCopyValue(organizationInfo);

    let manageCity = beforeData.manageCity,
        manageCounty = beforeData.manageCounty.split(',');
    let allAddress = JSON.parse(window.sessionStorage.address) || [];
    if(manageCity.indexOf(',')===-1){
      allAddress.map(item=>{
        if(item.children){
          item.children.map(jtem=>{
            if(jtem.value===manageCity){
              manageCity = [item.value,jtem.value];
              this.state.organizationInfo.manageCity = manageCity.toString();
            }
          })
        }
      });
    }else{
      manageCity = manageCity.split(',');
    }

    let orgAddressArr = organizationInfo.orgAddress.split(',');
    let addAddress = [];
    allAddress.map(item=>{
      if(item.value===orgAddressArr[0]){
        addAddress.push(item.label);
        if(item.children){
          item.children.map(jtem=>{
            if(jtem.value===orgAddressArr[1]){
              addAddress.push(jtem.label);
              if(jtem.children){
                jtem.children.map(ktem=>{
                  if(ktem.value===orgAddressArr[2]){
                    addAddress.push(ktem.label);
                  }
                })
              }
            }
          })
        }
      }
    });
    beforeData.detailAddress = addAddress.toString()+','+beforeData.detailAddress;
    if(beforeData.manageCityCountry != '' && beforeData.manageCityCountry != undefined){
        beforeData.manageCityCountry = this.getmanageCityCountry(JSON.parse(window.sessionStorage.address), manageCity, manageCounty); // 经营范围
    }
    beforeData.manageCity = manageCity;
    beforeData.orgAddressText = this.getAddressText(beforeData.orgAddress.split(',')).join('-');
  
    this.setState({loading:true,beforeData,hints:{}});
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
  },
  componentWillMount() {
  },
  //地图回调
  handleMapOk:function (orgLocation) {
    this.state.organizationInfo.orgLocation = orgLocation;
    Common.validator(this,this.state.organizationInfo,'orgLocation');
    this.setState({loading:this.state.loading});
  },
  //拼接地理位置
  getLocation:function () {
    let address = this.state.organizationInfo.orgAddress,
        detailAddress = this.state.organizationInfo.detailAddress;
    if(!address || !detailAddress){
      return '';
    }
    let addT = address.split(',');
    let addressList=[],zhAddress='';
    try {
      addressList = JSON.parse(window.sessionStorage.address)
    } catch (err) {}
    let sheng = addressList.find(item => item.value === addT[0]); //获取省
    zhAddress += sheng.label;
    if(sheng.children){
        let shi = sheng.children.find(item => item.value === addT[1])||""; //获取市
        zhAddress += shi.label;
        if(shi.children){
            let xian = shi.children.find(item => item.value === addT[2])||""; //获取县
            zhAddress += xian.label;
        }
    }
    let returnAddress = zhAddress + detailAddress;
    
    return returnAddress;
  },
  // 第一次加载
  componentDidMount: function () {
      this.state.organizationInfo.manageCounty = '';
    let attrList = [
      {
        name:'headTelephone',
        dataType:'mobile',
      },
      {
        name:'area',
        validator:this.checkArea
      },
      {
        name:'bankCardno',
        validator:this.checkBankCardno
      },
      {
        name:'payNo',
        validator:this.checkPayNo
      },
        {
            name: 'businessHours',
            validator: this.checkBusinessHours
        }
    ];
    this.state.validRules = FormDef.getCreateFormRule(this,attrList);
  },
    //营业时间
    checkBusinessHours: function(value) {
        if (!value.split(',')[1]) {
            return '请输入完整营业时间'
        }
    },
    checkArea:function(value){
        let  reg = /^(?!0(\.0{1,2})?$)(\d(\.\d{1,2})?|10(\.0{1,2})?)$/;
        if (!reg.test(value)) {
            return '请输入10公里以内的收件范围(含10公里，可保留两位小数)'
        }
    },
  checkPayNo: function(value) {
    let regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        regPhone = /^1\d{10}$/;
    if (!regEmail.test(value) && !regPhone.test(value)) {
      return '请输入邮箱或者手机号'
    }
  },
  checkBankCardno: function(value) {
    let test = /^\d+$/;
    let testVal = test.test(value);
    if (!testVal) {
      return '请输入数字'
    }
  },
  clear: function (filter) {
    FormDef.initCreateForm(this.state.organizationInfo);
    this.state.organizationInfo.manageCounty = '';
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.organizationInfo.uuid = '';
    this.state.organizationInfo.filter = filter;
    
    this.setState({loading:false});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  getmanageCityCountry: function(address=[], city, county) {
    if(!city||!county) return;
    let manageCityArr = [],
        manageCountyArr = [];
    if(city.indexOf(',')===-1){//only has a city  add a province for it
      address.map(item=>{
        if(item.chidren){
          item.children.map(jtem=>{
            if(jtem.value===city[0]){
              city.unshift(item.value);
            }
          })
        }
      })
    }
    let sheng = address.find(item => item.value === city[0]); //获取省
    manageCityArr.push(sheng.label);
    if(sheng.children){
      let shi = sheng.children.find(item => item.value === city[1]); //获取市
      manageCityArr.push(shi.label);
      if(shi.children){
        county.map((countryItem) => {
          let xian = shi.children.find(item => item.value === countryItem); //获取县
          manageCountyArr.push(xian.label);
        });
      }
    }
    let str = manageCityArr.join('-') + ': ' + manageCountyArr.join(',');
    return str;
  },
  onClickSave: function () {
    if (this.state.flags && Common.formValidator(this, this.state.organizationInfo) ) {
      let sendData = Utils.deepCopyValue(this.state.organizationInfo);
          let addT = sendData.orgAddress.split(','),
              manageCity = sendData.manageCity.split(','),
              manageCounty = sendData.manageCounty.split(',');
          let d = this.getAddressText(addT);
        if(sendData.orgType == '2'){
          let manageCityCountry = this.getmanageCityCountry(JSON.parse(window.sessionStorage.address), manageCity, manageCounty);
          sendData.manageCityCountry = manageCityCountry; // 经营范围
        }
        sendData.area = Number(sendData.area) * 1000 ;
        sendData.orgAddressText = d.join('-');//处理详细地址文本
        sendData.detailAddress = d.join(',')+','+sendData.detailAddress;//详细地址拼接省市县

      sendData.parentOrgText = this.state.parentOrgName;//所属机构中文
      sendData.beforeData = this.state.beforeData;
      this.setState({ loading: true });
      OrganizationInfoActions.update(sendData);
    }
  },
  getAddressText:function (addT) {
    let address,d=[];
    try {
      address = JSON.parse(window.sessionStorage.address)
    } catch (err) {}
  
    if (address) {
      let sheng = address.find(item => item.value === addT[0]); //获取省
      d.push(sheng.label);
      if(sheng.children && addT.length > 1){
          let shi = sheng.children.find(item => item.value === addT[1]); //获取市
          d.push(shi.label);
          if(shi.children && addT.length > 2){
              let xian = shi.children.find(item => item.value === addT[2]); //获取县
              d.push(xian.label);
          }
      }
    } else {
      Modal.error({
        title: '错误',
        content: '数据错误，请重新登录！',
      });
    }
    return d;
  },
  set:function (id,val,f) {
    let organizationInfo = Object.assign({},this.state.organizationInfo);
    organizationInfo[id] = val;
    Common.validator(this,organizationInfo,id);
    // 是否检验
    // if(!f){
    //   Common.validator(this,organizationInfo,id);
    // }
    this.setState({organizationInfo});
  },
  //经营中心 选择组件 回调
  //type改变类型  1:改变省市  2:改变区域
  areaChange:function (type,val) {
      let organizationInfo = Object.assign({},this.state.organizationInfo);
      var obj = {};
      var flags ;
      if(type==='1'){
      organizationInfo.manageCity= val;
      organizationInfo.manageCounty= '';
       obj.manageCity = '';
          flags = false;
    }
    if(type==='2'){
        organizationInfo.manageCounty = val;
        obj.manageCity = val;
        if(val ==''){
            flags = false
        }else{
            flags = true;
        }
    }
      Common.validator(this,obj,'manageCity')
      this.setState({organizationInfo,flags});
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
    goBack: function () {
        this.clear();
        this.props.goBack()
    },
  render: function () {
    let oData = this.state.organizationInfo;
    let defA = <span style={{color:'#999'}}>默认账号</span>,
        def = this.state.organizationInfo.defaultAccountType;
    let attrList = [
      {
        name:'orgAddress',
        id:'orgAddress',
        object:<AreaPosition  name='orgAddress' id='orgAddress' onChange={this.areaPosition} value={this.state.organizationInfo['orgAddress']} />
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
            value={this.state['parentOrgName']}
            disabled={true}
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
        />
      },
      //获取经纬度
      {
        name:'orgLocation',
        id:'orgLocation',
        object:<div style={{height:32}}>
          <AMapComponent value={this.getLocation()}
                         position={this.state.organizationInfo['orgLocation']}
                         handlemapok={this.handleMapOk}
                         lngType={false}
          />
        </div>
      },
      {
        name:'orgType',
        id:'orgType',
        disabled:true
      },
    ];
    let items = FormDef.getCreateForm(this, this.state.organizationInfo, attrList);
    let layout = 'horizontal';
    return (
          <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
              <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                  <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                  </TabPane>
                  <TabPane tab="修改机构信息" key="2" style={{width: '100%', height: '100%'}}>
                      <div style={{padding:'8px 0 16px 8px', height: '100%',overflowY: 'auto',width:'1080px'}}>
                          <ServiceMsg ref='mxgBox' svcList={['organization/update']}/>
                          <Form layout={layout} ref={ref=>this.formList=ref}>
                              { items }
                              <FormItem style={{textAlign:'right',margin:'4px 0 30px 0'}} >
                                  <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>
                              </FormItem>
                          </Form>
                      </div>
                  </TabPane>
              </Tabs>
          </div>
    );
  }
});

export default CreateOrganizationInfoPage;