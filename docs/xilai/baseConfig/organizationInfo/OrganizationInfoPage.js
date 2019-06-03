/**
 *   Create by Malson on 2018/4/19
 */

'use strict';

import React from 'react';

var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';

const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var OrganizationInfoStore = require('./data/OrganizationInfoStore');
var OrganizationInfoActions = require('./action/OrganizationInfoActions');
import CheckOrganizationInfoPage from './components/CheckOrganizationInfoPage';
import CreateOrganizationInfoPage from './components/CreateOrganizationInfoPage';
import UpdateOrganizationInfoPage from './components/UpdateOrganizationInfoPage';

//table
var FormDef = require('./components/OrganizationForm');
const tableName = 'OrganizationInfoTable';
import DictTable from '../../../lib/Components/DictTable'
import FormUtil from '../../../lib/Components/FormUtil';

//filter
import Filter from './components/Filter'
import CommonActions from '../../../lib/action/CommonActions';
import CommonStore from '../../../lib/data/CommonStore';
import ExportExcel from '../../lib/Components/ExportExcel';

var filterValue = '';
var OrganizationInfoPage = React.createClass({
  getInitialState: function () {
    return {
      organizationInfoSet: {
        recordSet: [],
        errMsg: ''
      },
      loading: false,
       actionType:'retrieveByFilter',
    }
  },
  
  mixins: [Reflux.listenTo(OrganizationInfoStore, "onServiceComplete"),Reflux.listenTo(CommonStore, "onAddressComplete")],
  onServiceComplete: function (data) {
    if(data.errMsg){
      this.setState({loading: false});
      return;
    }
    if (data.operation === 'retrieveByFilter') {
      this.setState({
        loading: false,
        organizationInfoSet: Object.assign({}, this.state.organizationInfoSet, data)
      });
      if(!window.sessionStorage.address){
        CommonActions.getAddress();
      }
    }else if(data.operation === 'create'){
      this.setState({actionType: 'retrieveByFilter'});
      this.handleQueryClick();
    }else if(data.operation === 'update'){
      this.setState({actionType: 'retrieveByFilter'});
      this.filterSearch1();
    }else if(data.operation === 'updateDisableAndEnable'){
      this.filterSearch();
    }
  },
  onAddressComplete:function (data) {
    if(data.operation==="getAddress"){
      window.sessionStorage.address = JSON.stringify(data.recordSet[0]);
    }
  },
  
  // 刷新
  handleQueryClick: function (obj={}) {
    OrganizationInfoActions.retrieveOrganizationInfo(obj, this.state.organizationInfoSet.startPage, this.state.organizationInfoSet.pageRow);
    this.setState({loading: true});
  },
  // 第一次加载
  componentDidMount: function () {
      let dataSet = this.state.organizationInfoSet;
      let conf = FormUtil.getTableConf(tableName);
      dataSet.pageRow = (conf.page !== true) ? 0 : Number(conf.pageRow);
      dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },
  
  handleOpenCreateWindow: function (event) {
    let type = Common.getUserType();
    this.setState({actionType:'create'},()=>{
        this.refs.createWindow.clear();
        if(type=='1'){//总部

        }
        else if(type=='2'){//经营中心
            this.refs.createWindow.managerInit('2');
        }
        else if(type=='3'){//服务站
            return;
        }
        this.refs.createWindow.toggle();
    })
  },
  createSuccess:function (data) {
    this.handleQueryClick();
  },
  onClickCheck: function (organizationInfo, event) {
    if (organizationInfo != null) {
        this.setState({actionType:'check'},()=>{
            this.refs.checkWindow.initPage(organizationInfo);//organizationInfo
            this.refs.checkWindow.toggle();
        });
    }
  },
  onClickUpdate: function (organizationInfo, event) {
    if (organizationInfo != null) {
        this.setState({actionType:'update'},()=> {
            this.refs.updateWindow.initPage(organizationInfo);//organizationInfo
            this.refs.updateWindow.toggle();
        })
    }
  },
  onClickDelete: function (organizationInfo, event) {
    let text = organizationInfo.isEnabled == '2'?'启用':'禁用';
    Modal.confirm({
      title: '确认',
      content:`是否确定${text}【${organizationInfo.orgName}】？` ,
      okText: '确定',
      cancelText: '取消',
      onOk: this.onClickDelete2.bind(this, organizationInfo)
    });
  },
  
  onClickDelete2: function (organizationInfo) {
    this.setState({loading: true});
    let isEnabled = organizationInfo.isEnabled==2?'1':'2';
    OrganizationInfoActions.updateDisableAndEnable({uuid:organizationInfo.uuid,isEnabled,logicCode:organizationInfo.orgNo});
  },
  onFilterRecord: function (e) {
    filterValue = e.target.value;
    this.setState({loading: this.state.loading});
  },
  onTableRefresh: function (current, pageRow) {
    let obj = this.filter.state.organizationInfo;
    let orgAddress = obj.orgAddress;
    if(orgAddress){
        obj.province = orgAddress.split(',')[0] ?  orgAddress.split(',')[0] : '';
        obj.city = orgAddress.split(',')[1] ?  orgAddress.split(',')[1] : '';
        obj.region = orgAddress.split(',')[2] ?  orgAddress.split(',')[2] : '';
    }else{
      obj.province = '';
      obj.city = '';
      obj.region = '';
    }
    this.state.organizationInfoSet.startPage = current;
    this.state.organizationInfoSet.pageRow = pageRow;
    this.setState({loading:true});
    OrganizationInfoActions.retrieveOrganizationInfo(obj, current, pageRow);
  },
  filterSearch: function () {
    let obj = this.filter.getFilter();
    if(obj){
      let orgAddress = obj.orgAddress;
      if(orgAddress){
          obj.province = orgAddress.split(',')[0] ?  orgAddress.split(',')[0] : '';
          obj.city = orgAddress.split(',')[1] ?  orgAddress.split(',')[1] : '';
          obj.region = orgAddress.split(',')[2] ?  orgAddress.split(',')[2] : '';
      }
      this.state.organizationInfoSet.startPage = 1;
      // this.handleQueryClick(obj);
      OrganizationInfoActions.retrieveOrganizationInfo(obj, this.state.organizationInfoSet.startPage, this.state.organizationInfoSet.pageRow);
      this.setState({loading: true});
    }
  },
  filterSearch1: function () {
      let obj = this.filter.getFilter();
      if(obj){
          let orgAddress = obj.orgAddress;
          if(orgAddress){
              obj.province = orgAddress.split(',')[0] ?  orgAddress.split(',')[0] : '';
              obj.city = orgAddress.split(',')[1] ?  orgAddress.split(',')[1] : '';
              obj.region = orgAddress.split(',')[2] ?  orgAddress.split(',')[2] : '';
          }
          this.handleQueryClick(obj);
      }
  },
  resetFilter: function () {
    this.filter.clear();
    this.state.organizationInfoSet.startPage = 1;
    this.handleQueryClick({orgName:'',orgType:'',orgAddress:'',headName:''});
  },
  goBack: function(){
      this.setState({actionType: 'retrieveByFilter'});
  },
  render: function () {
    let type = Common.getUserType();//登录类型
    let orgNoCom = "";
    try {
      orgNoCom = Common.getLoginData().staffInfo.orgNo;
    } catch (e){}
    let recordSet = Common.filter(this.state.organizationInfoSet.recordSet, filterValue);
    let leftButtons = [
          <Button type={type=='3'?'primary':''} icon={Common.iconSearch} title="查询" onClick={this.filterSearch} key='查询' className='btn-margin'>查询</Button>,
          <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} className='btn-margin'
                  key="重置">重置</Button>,
          <ExportExcel module='organizationInfo' filter={this.filter?this.filter.state.organizationInfo:{}} key="导出" />,
          
        ],
        operCol = {
          title: '操作',
          key: 'action',
          width: 200,
          render: (text, record) => (
              <span>
                    <a href="#" onClick={this.onClickCheck.bind(this, record)} title='查看机构信息'><Button>查看</Button></a>
                    {
                      (type!=3 && record.orgNo!==orgNoCom)?<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改机构信息' className='btn-margin'><Button>修改</Button></a>:''
                    }
                    {
                      (type==1 && record.orgNo!==orgNoCom)?<a href="#" onClick={this.onClickDelete.bind(this, record)} title={record.isEnabled=='2'?'启用机构':'禁用机构'} className='btn-margin'><Button>{record.isEnabled=='2'?'启用':'禁用'}</Button></a>:''
                    }
              </span>
          ),
        },
        rightButtons = '';
    if(type=='1'||type=='2'){//不是服务站
      leftButtons.unshift(<Button icon={Common.iconAdd} title="新增" type='primary' onClick={this.handleOpenCreateWindow} key='增加合同'>新增</Button>);
    }
    // 表格属性
    let attrs = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      rightButtons: rightButtons,
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'organizationInfoTable',//tableForm的 tableView的一个name
      totalPage: this.state.organizationInfoSet.totalRow,//修改state
      currentPage: this.state.organizationInfoSet.startPage,//修改state
      onRefresh: this.onTableRefresh,
      // onRefresh: false,//不分页
    };
    let actionType = this.state.actionType;
      let modalProps = {
          actionType,
          goBack:this.goBack,
      };
    return (
        <div className='grid-page'>
          <ServiceMsg ref='mxgBox' svcList={['organization/retrieveByFilter']}/>
            {
                actionType === 'retrieveByFilter' ?
                    (
                        <div>
                            <Filter ref={ref => this.filter = ref}/>
                            <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs}/>
                        </div>
                    )
                    :
                    actionType === 'create' ?
                        <div style = {{paddingLeft:20}}>
                            <CreateOrganizationInfoPage ref="createWindow" createSuccess={this.createSuccess} {...modalProps}/>
                        </div>
                        :
                        actionType === 'update'?
                            <div style = {{paddingLeft:20}}>
                                <UpdateOrganizationInfoPage ref="updateWindow" {...modalProps}/>
                            </div>

                            :
                            <div style = {{paddingLeft:20}}>
                                <CheckOrganizationInfoPage ref="checkWindow" {...modalProps}/>
                            </div>
            }
        </div>
    );
  }
});

module.exports = OrganizationInfoPage;