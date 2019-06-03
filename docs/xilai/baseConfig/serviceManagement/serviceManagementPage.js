'use strict';
import React from 'react';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ServiceManagementStore = require('./data/ServiceManagementStore');
var ServiceManagementActions = require('./action/ServiceManagementActions');
import ServiceManagementModal from './components/ServiceManagementModal';

//table
var FormDef = require('./components/ServiceForm');
const tableName = 'ServiceManagementTable';
import DictTable from '../../../lib/Components/DictTable';
import FormUtil from '../../../lib/Components/FormUtil';

//filter
import Filter from './components/Filter';
var ServiceManagementPage = React.createClass({
  getInitialState: function () {
    return {
      serviceManagementSet: {
        recordSet: [],
        startPage:1,
        pageRow:10,
        errMsg: ''
      },
      loading: false,
      actionType:'retrieve',
      initStartPageFlag:false,
      lastPageRow:10,
      lastStartPage:1,
    }
  },
  
  mixins: [Reflux.listenTo(ServiceManagementStore, "onServiceComplete")],
  onServiceComplete: function (data) {
    if(data.errMsg){
      this.setState({loading: false});
      return;
    }
    let serviceManagementSet = Utils.deepCopyValue(data);
    this.setState({
      loading: false,
      serviceManagementSet: Object.assign({}, this.state.serviceManagementSet, data)
      // serviceManagementSet
    });
  },
  handleQueryClick: function (obj={}) {
    ServiceManagementActions.retrieve(obj, this.state.serviceManagementSet.startPage, this.state.serviceManagementSet.pageRow);
    this.setState({loading: true});
  },
  componentDidMount: function () {
      let dataSet = this.state.serviceManagementSet;
      let conf = FormUtil.getTableConf(tableName);
      dataSet.pageRow = (conf.page !== true) ? 0 : Number(conf.pageRow);
      dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },
  onClickOpenModal: function (customerInfo, actionType) {
    let data = {
      customerName:'',
      customerNickName:'',
      customerPhone:'',
      customerMail:''
    };
    if(actionType != 'create'){
      data = {
        uuid:customerInfo.uuid,
        customerName:customerInfo.name ? customerInfo.name :'',
        customerNickname:customerInfo.nickName ? customerInfo.nickName :'',
        customerPhone:customerInfo.phone ? customerInfo.phone :'',
        customerMail:customerInfo.mail ? customerInfo.mail :'',
      };
    }
    this.setState({
      actionType
    },()=>{
      this.serviceModal.init(data, actionType);
    });
  },
  onClickDelete: function (customerInfo, event) {
    Modal.confirm({
      title: '确认',
      content:`是否确定删除【${customerInfo.name}】？` ,
      okText: '确定',
      cancelText: '取消',
      onOk: this.onClickDelete2.bind(this, customerInfo)
    });
  },
  
  onClickDelete2: function (customerInfo) {
    this.setState({loading: true});
    ServiceManagementActions.delete(customerInfo.uuid);
  },
  initStartPage:function(){
    this.setState({initStartPageFlag: true});
  },
  onTableRefresh: function (current, pageRow) {
    let obj = this.filter.getFilter(), startPage=1;
    let lastStartPage = this.state.serviceManagementSet.startPage;
    let lastPageRow = this.state.serviceManagementSet.pageRow;
   
    if(this.state.initStartPageFlag  || lastPageRow != pageRow){
      startPage = 1;
    }
    if(!this.state.initStartPageFlag && lastStartPage != current){
      startPage = current;
    }
    this.setState({
      loading:true,
      initStartPageFlag:false,
      lastPageRow,
      lastStartPage
    },()=>{
      this.state.serviceManagementSet.startPage = startPage;
      this.state.serviceManagementSet.pageRow = pageRow;
      ServiceManagementActions.retrieve(obj, startPage, pageRow);
    });
   
  },
  filterSearch: function () {
    let obj = this.filter.getFilter();
    this.state.serviceManagementSet.startPage = 1;
    ServiceManagementActions.retrieve(obj, this.state.serviceManagementSet.startPage, this.state.serviceManagementSet.pageRow);
    this.setState({loading: true});
  },
  resetFilter: function () {
    this.filter.clear();
    this.state.serviceManagementSet.startPage = 1;
    this.handleQueryClick({name:'',userCode:''});
  },
  goBack(){
    this.setState({
      actionType:'retrieve',
      loading:false
    },()=>{
      // this.handleQueryClick();
    });
  },
  render: function () {
    let recordSet = this.state.serviceManagementSet.recordSet;
    let leftButtons = [
          <Button type='primary' icon={Common.iconSearch} title="查询" onClick={this.filterSearch} key='查询'>查询</Button>,
          <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} key="重置" className='btn-margin' >重置</Button>,
          <Button icon = { Common.iconAdd } title = "新增客服" onClick = { this.onClickOpenModal.bind(this, null, 'create') }  key='新增' className="btn-margin">新增</Button>
        ],
        operCol = {
          title: '操作',
          key: 'action',
          width: 200,
          render: (text, record) => (
              <span>
                 <a href="#" onClick={this.onClickOpenModal.bind(this, record, 'check')} title='查看客服信息'><Button>查看</Button></a>
                 <a href="#" onClick={this.onClickOpenModal.bind(this, record, 'edit')} title='修改客服信息' className='btn-margin'><Button>修改</Button></a>
                 <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除客服' className='btn-margin'><Button  type = "danger">删除</Button></a>
              </span>    
          ),
        };
    let attrs = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      rightButtons: null,
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: tableName,
      totalPage: this.state.serviceManagementSet.totalRow,
      currentPage: this.state.serviceManagementSet.startPage,
      onRefresh: this.onTableRefresh,
      // onRefresh: false,//不分页
    };
    let actionType = this.state.actionType, modalProps = {
      actionType,
      goBack:this.goBack,
    };
    return (
        <div className='grid-page'>
          <ServiceMsg ref='mxgBox' svcList={['user/findSupportStaffs', 'user/deleteSupportStaff']}/>
          {
            actionType === 'retrieve'?(
                <div>
                    {/* <div style={{ margin: "0px 20px" }}>
                        <p style={{ color: "#999999", lineHeight: "50px", fontSize: '20px' }}>客服管理</p>
                        <hr />
                    </div> */}
                    <div className="content-wrap">
                    <Filter ref={ref => this.filter = ref} initStartPage={this.initStartPage}/>
                    <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs}/>  
                    </div>
                </div>
                ):
                <div style = {{paddingLeft:20}}>
                    <ServiceManagementModal ref={ref=>this.serviceModal=ref}  {...modalProps}/>
                </div>
          }
         
         
        </div>
    );
  }
});

module.exports = ServiceManagementPage;