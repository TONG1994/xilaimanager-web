/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import ReactDOM from 'react-dom';
import AMapComponent from '../../../lib/Components/AMapComponent/Index';

let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col ,Tabs} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

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
import BusinessCenter from './BusinessCenter';

let CreateOrganizationInfoPage = React.createClass({
    getInitialState: function() {
        return {
            organizationInfoSet: {},
            loading: false,
            modal: false,
            organizationInfo: { defaultAccountType: '1',area:'3' },
            hints: {},
            flag: false,
            validRules: [],
            parentOrgText: '',
            manageCity:'',
        };
    },
    mixins: [Reflux.listenTo(OrganizationInfoStore, 'onServiceComplete'), ModalForm('organizationInfo')],
    onServiceComplete: function(data) {
        if (data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    loading: false,
                });
                this.goBack();
                // this.props.createSuccess(data.recordSet)
            } else {
                // 失败
                this.setState({
                    loading: false,
                    organizationInfoSet: data
                });
            }
        }
    },
    beforeClose: function() {
        if (this.state.modal && this.formList) {
            ReactDOM.findDOMNode(this.formList).scrollTop = 0;
        }
    },
    checkBankCardno: function(value) {
        let test = /^\d+$/;
        let testVal = test.test(value);
        if (!testVal) {
            return '请输入数字'
        }
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
          let shi = sheng.children.find(item => item.value === addT[1]); //获取市
          zhAddress += shi.label;
          if(shi.children){
              let xian = shi.children.find(item => item.value === addT[2]); //获取县
              zhAddress += xian.label;
          }
      }
      let returnAddress = zhAddress + detailAddress;
      return returnAddress;
    },
    // 第一次加载
    componentDidMount: function() {
        this.state.organizationInfo.manageCounty = '';
        let attrList = [{
                name: 'headTelephone',
                dataType: 'mobile',
                validator: this.checkHeadTelephone
            },
            {
                name: 'area',
                //dataType: 'number',
                validator: this.checkArea
            },
            {
                name: 'bankCardno',
                validator: this.checkBankCardno
            },
            {
                name: 'payNo',
                validator: this.checkPayNo
            },
            {
                name: 'businessHours',
                validator: this.checkBusinessHours
            }
        ];
        this.state.validRules = FormDef.getCreateFormRule(this, attrList);
    },
    checkPayNo: function(value) {
        let regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            regPhone = /^1\d{10}$/;
        if (!regEmail.test(value) && !regPhone.test(value)) {
            return '请输入邮箱或者手机号'
        }
    },
    checkArea:function(value){
        let  reg = /^(?!0(\.0{1,2})?$)(\d(\.\d{1,2})?|10(\.0{1,2})?)$/;
        if (!reg.test(value)) {
            return '请输入10公里以内的收件范围(含10公里，可保留两位小数)'
        }
    },
    //营业时间
    checkBusinessHours: function(value) {
        if (!value.split(',')[1]) {
            return '请输入完整营业时间'
        }
    },
    clear: function(filter) {
        FormDef.initCreateForm(this.state.organizationInfo);
        if (this.businessCenter) {
            this.businessCenter.clear();
        }
        if (this.businessHours) {
            this.businessHours.clear()
        }
        this.state.flag = false;
        this.state.organizationInfo.manageCounty = '';
        this.state.organizationInfo.defaultAccountType = '1';
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.organizationInfo.uuid = '';
        this.state.organizationInfo.filter = filter;
        this.state.organizationInfo.area = '3'; //收件范围
        this.state.manageCity = ''; //经营范围的省

        this.state.loading = false;
        if (!this.state.modal && typeof(this.refs.mxgBox) !== 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    managerInit: function(type) {
        this.state.organizationInfo.orgType = '3';
        this.state.flag = true;
        this.forceUpdate();
    },
    getmanageCityCountry: function(address, city, county) {
        let manageCityArr = [],
            manageCountyArr = [];
        let sheng = address.find(item => item.value === city[0]); //获取省
        manageCityArr.push(sheng.label);
        if(sheng.children){
            let shi = sheng.children.find(item => item.value === city[1]); //获取市
            manageCityArr.push(shi.label);
            county.map((countryItem) => {
                if(shi.children){
                    let xian = shi.children.find(item => item.value === countryItem); //获取县
                    manageCountyArr.push(xian.label);
                }
            });
        }
        let str = manageCityArr.join('-') + ': ' + manageCountyArr.join(',');
        return str;
    },
    onClickSave: function() {
        let curNo = Common.getLoginData() ? Common.getLoginData().staffInfo.orgNo : '暂无',
            parentOrgText = Common.getLoginData() ? Common.getLoginData().staffInfo.orgName : '暂无',
            curType = Common.getUserType();
        if (this.state.organizationInfo.parentOrgNo === curNo) {
            this.state.organizationInfo.parentOrgNo = '';
        }
        let orgType = this.state.organizationInfo.orgType;
        if (orgType == '2') {
            this.state.organizationInfo.parentOrgNo = curNo;
            this.state.organizationInfo.area = '3';
        }
        if(orgType == '3'){
            this.state.organizationInfo.manageCity = '1';
        }

        //经营中心新建服务站
        if (orgType == '3' && curType == '2') {
            this.state.organizationInfo.parentOrgNo = curNo;
            //处理经营范围为空的情况
            this.state.organizationInfo.manageCity = '1';
        }

        if (Common.formValidator(this, this.state.organizationInfo)) {
            let sendData = Utils.deepCopyValue(this.state.organizationInfo);

            //处理经营范围
                let address, addT = sendData.orgAddress.split(','),
                    manageCity = sendData.manageCity.split(','),
                    manageCounty = sendData.manageCounty.split(',');
                try {
                    address = JSON.parse(window.sessionStorage.address)

                } catch (err) {}
                let d = [],
                    manageCityCountry = '';
                if (address) {
                    let sheng = address.find(item => item.value === addT[0]); //获取省
                    d.push(sheng.label);
                    if(sheng.children){
                        let shi = sheng.children.find(item => item.value === addT[1]); //获取市
                        d.push(shi.label);
                        if(shi.children){
                            let xian = shi.children.find(item => item.value === addT[2]); //获取县
                            d.push(xian.label);
                        }
                    }
                    if(orgType == '2') {
                        manageCityCountry = this.getmanageCityCountry(address, manageCity, manageCounty);
                    }else{
                        manageCityCountry = '';
                    }
                } else {
                    Modal.error({
                        title: '错误',
                        content: '数据错误，请重新登录！',
                    });
                }

            sendData.manageCityCountry = manageCityCountry; // 经营范围
            sendData.orgAddressText = d.join('-');
            sendData.detailAddress = d.toString() + ',' + sendData.detailAddress;
            sendData.parentOrgText = orgType === '3' && curType === '2' ? parentOrgText : this.state.parentOrgText;
            sendData.area = Number(sendData.area)*1000; // 收件范围
            this.setState({ loading: true });
            OrganizationInfoActions.createOrganizationInfo(sendData);
        }
    },
  set:function (id,val,f) {
    let organizationInfo = Object.assign({},this.state.organizationInfo);
    organizationInfo[id] = val;
    Common.validator(this,organizationInfo,id);
    this.setState({organizationInfo});
  },
  //经营中心 选择组件 回调
  //type改变类型  1:改变省市  2:改变区域
  areaChange:function (type,val) {
    let organizationInfo = Object.assign({},this.state.organizationInfo);
    if(type==='1'){
      if(!val){
        organizationInfo.manageCity= val;
      }
      // organizationInfo.manageCity= val;
      organizationInfo.manageCounty= '';
      this.setState({organizationInfo,manageCity:val});
      var obj={};
      obj.manageCity = '';
      Common.validator(this,obj,'manageCity')
    }
    if(type==='2'){
      organizationInfo.manageCity = val?this.state.manageCity:'';
      organizationInfo.manageCounty = val;
      this.setState({organizationInfo});
      Common.validator(this,organizationInfo,'manageCity')
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
  handleBusinessCenter: function(data) {
      this.set('parentOrgNo', data.value);
      this.setState({
          parentOrgText: data.text
      });
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
    let curNo = Common.getLoginData()?Common.getLoginData().staffInfo.orgName:'',
        curType = Common.getUserType();
    let attrList = [
      {
        name:'orgType',
        id:'orgType',
        disabled:this.state.flag
      },
        {
            name:'area',
            id:'area',
            visible:oData.orgType=="3" ||oData.orgType=="服务站"?'':'hidden',
        },
      {
        name:'orgAddress',
        id:'orgAddress',
        object:<AreaPosition
            name='orgAddress'
            id='orgAddress'
            onChange={this.areaPosition}
            value={this.state.organizationInfo['orgAddress']}
        />
      },
        //运营中心||服务站 经营范围
      {
        name:'manageCity',
        id:'manageCity',
        visible:oData.orgType=="2" ||oData.orgType=="经营中心" ?'':'hidden',
        object:<BranchSelect
            name='manageCity'
            id='manageCity'
            onChange={this.areaChange}
            manageCity={this.state.manageCity}
            manageCounty={this.state.organizationInfo['manageCounty']}
        />
      },
        //所属经营中心
      {
        name:'parentOrgNo',
        id:'parentOrgNo',
        visible:oData.orgType=="3" ||oData.orgType=="服务站"?'':'hidden',
        object:oData.orgType=="3"&&curType=='2'?<Input value={curNo} disabled={true} />:
            <BusinessCenter
            name='parentOrgNo'
            id='parentOrgNo'
            onSelect={this.handleBusinessCenter}
            value={this.state.organizationInfo['parentOrgNo']}
            ref = {ref=>this.businessCenter = ref}
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
            ref = {ref=>this.businessHours = ref}
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
    ];
    let items = FormDef.getCreateForm(this, this.state.organizationInfo, attrList);
    let layout = 'horizontal';
    return (
          <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
              <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                  <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                  </TabPane>
                  <TabPane tab="增加机构信息" key="2" style={{width: '100%', height: '100%'}}>
                      <div style={{padding:'8px 0 16px 8px', height: '100%',overflowY: 'auto',width:'1080px'}}>
                          <ServiceMsg ref='mxgBox' svcList={['organization/create']}/>
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
