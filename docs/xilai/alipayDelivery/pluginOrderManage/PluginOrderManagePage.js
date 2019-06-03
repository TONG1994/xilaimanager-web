'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal,Tooltip, Input} from 'antd';
const Search = Input.Search;
import moment from 'moment';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var PluginOrderManageStore = require('./data/PluginOrderManageStore.js');
var PluginOrderManageActions = require('./action/PluginOrderManageActions');
// import OrderDetailPage from '../../lib/Components/orderDetail/OrderDetailPage';
// import CancelPluginOrderManagePage from './Components/CancelPluginOrderManagePage';
import Filter from './components/Filter';

import ExportExcel from './components/ExportExcel';

var pageRows = 10;
var PluginOrderManagePage = React.createClass({
  getInitialState : function() {
    return {
      PluginOrderManageSet: {
        recordSet: [],
        startPage : 1,
        pageRow : 10,
        totalRow : 0,
        errMsg : '',
      },
      loading: false,
      action: 'query',
      PluginOrderManage: null,
    }
  },

  mixins: [Reflux.listenTo(PluginOrderManageStore, "onServiceComplete")],
  onServiceComplete: function(data) {
      if(data.operation=='queryBySearchFilter'){
          this.setState({
              loading: false,
              PluginOrderManageSet: data
          });
      // data.recordSet.map(item=>{
      //     PluginOrderManageActions.retrieveStatus(item.uuid);
      //     });

      }
      // if(data.operation=='queryStatus' || data.operation=='remove'){
      //     this.setState({loading:false});
      // }
  },

  // 第一次加载
  componentDidMount : function(){
    this.setState({loading: true});
    var filter = {};
    var defualtEnd = Utils.getDefualtEnd();
    var defualtStart = Utils.getDefualtStart();
    filter.startTime = defualtStart;
    filter.endTime = defualtEnd;

    // FIXME 查询条件
    // PluginOrderManageActions.initPluginOrderManage(filter);
      PluginOrderManageActions.retrievePluginOrderManagePage(filter, this.state.PluginOrderManageSet.startPage, pageRows);
  },
  // 刷新
  handleQueryClick : function() {
    const filter=this.refs.filter.state.filter;
    this.setState({loading: true});
    // FIXME 查询条件
    PluginOrderManageActions.retrievePluginOrderManagePage(filter, this.state.PluginOrderManageSet.startPage, pageRows);
  },
  // 刷新
  handleQueryClickSearch : function() {
    const filter=this.refs.filter.state.filter;
    this.setState({loading: true});
    // FIXME 查询条件
    PluginOrderManageActions.retrievePluginOrderManagePage(filter, 1, pageRows);
  },

  onChangePage: function(pageNumber){
    this.state.PluginOrderManageSet.startPage = pageNumber;
    this.handleQueryClick();
  },
  onShowSizeChange: function(current, pageSize){
    this.state.PluginOrderManageSet.startPage = 1;
    pageRows = pageSize;
    this.handleQueryClick();
  },

  // handleOpenCreateWindow : function(event) {
  //   this.setState({action: 'create'});
  // },
  // onClickUpdate : function(PluginOrderManage, event){
  //   if(PluginOrderManage != null){
  //     this.setState({PluginOrderManage: PluginOrderManage, action: 'update'});
  //   }
  // },
  // onClickCancel:function(PluginOrderManage){
  //     if(PluginOrderManage != null){
  //         this.setState({PluginOrderManage: PluginOrderManage},()=>{this.refs.cancelWindow.toggle();});
  //     }
  // },
  onGoBack: function(){
     this.setState({action: 'query',loading: true});
      const filter=this.refs.filter.state.filter;
      PluginOrderManageActions.retrievePluginOrderManagePage(filter, this.state.PluginOrderManageSet.startPage, pageRows);
  },
  reset:function(){
    this.refs.filter.reset();
    this.setState({loading: true});
    PluginOrderManageActions.retrievePluginOrderManagePage({}, this.state.PluginOrderManageSet.startPage, pageRows);
  },

  getFilter:function(){
    let obj = {};
    if(this.refs.filter){
      let filter=Utils.deepCopyValue(this.refs.filter.state.filter);
      // filter.pageRow=pageRows;
      // filter.startPage=this.state.PluginOrderManageSet.startPage;
      // filter.totalRow=this.state.PluginOrderManageSet.totalRow;
      obj = filter;
    
    }
    return obj;
  },
  showTotal:function(total) {
    return `总共 ${total} 条`;
  },
  render : function() {
    var recordSet = this.state.PluginOrderManageSet.recordSet;
    const columns = [
      {
        title: <div><div>订购信息</div><div style={{color:"gray"}}>编号|时间</div></div>,
        dataIndex: 'uuid',
        key: 'uuid',
        width: 140,
        render:(text,record)=>{
          return(
            <p style={{wordWrap:'break-word',wordBreak:'normal'}}><span>{record.commodityOrderId?record.commodityOrderId:''}<br/>{record.orderTime?record.orderTime:''}</span></p>
          )
        }
      },
      {
        title: '服务名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
        width: 120,
      },
      {
        title: <div><div>小程序信息</div><div style={{color:"gray"}}>名称|ID</div></div>,
        dataIndex: 'appName',
        key: 'appName',
        width: 170,
        render:(text,record)=>{
          return(
            <p style={{wordWrap:'break-word',wordBreak:'normal'}}><span>{record.appName?record.appName:''}<br/>{record.appId?record.appId:''}</span></p>
          )
        }
      },
      {
        title: <div><div>订购人信息</div><div style={{color:"gray"}}>姓名|身份|ID</div></div>,
        dataIndex: 'merchantName',
        key: 'merchantName',
        width: 170,
        render:(text,record)=>{
          return(
            <p style={{wordWrap:'break-word',wordBreak:'normal'}}><span>{record.merchantName?record.merchantName:''}<br/>{record.merchantStatus?record.merchantStatus:''}<br/>{record.merchantPid?record.merchantPid:''}</span></p>
          )
        }
      },
      {
        title: <div><div>联系人信息</div><div style={{color:"gray"}}>手机号码</div></div>,
        dataIndex: 'phoneNo',
        key: 'phoneNo',
        width: 170,
        render:(text,record)=>{
          return(
            <p style={{wordWrap:'break-word',wordBreak:'normal'}}><span>{record.phoneNo?record.phoneNo:''}</span></p>
          )
        }    
      },
      {
        title: <div><div>订购信息</div><div style={{color:"gray"}}>规格|周期</div></div>,
        dataIndex: 'orderTerm',
        key: 'orderTerm',
        width: 120,
        render:(text,record)=>{
          return(
            <p style={{wordWrap:'break-word',wordBreak:'normal'}}><span>{record.specifications?record.specifications:''}<br/>{record.orderTerm?record.orderTerm:''}</span></p>
          )
        }  
      },
      {
        title: '状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width: 140,
        render:(text,record)=>{
          let orderStatus='';
          switch(text){
            case 'TO_DO':
              orderStatus='未实施';
            break;
            case 'DOING':
              orderStatus='实施中';
              break;
            case 'TO_CONFIRM':
              orderStatus='待商户确认';
              break;
            case 'DONE':
              orderStatus='已完成';
              break;
            case 'MERCHANT_REJECTED':
              orderStatus='商户已回绝';
              break;
            case 'MERCHANT_CANCELLED':
              orderStatus='商户已取消';
              break;
            case 'ISV_REJECTED':
              orderStatus='服务商已回绝';
              break;
            case 'ISV_CANCELLED':
              orderStatus='服务商已取消';
              break;
          }

          return <span>{orderStatus}</span>
        }
      },
      // {
      // title: '操作',
      // key: 'action',
      // fixed: 'right',
      // width: 120,
      //   render: (text, record) => {
      //     if(record.orderStatus == 'DOING'){
      //     return  (
      //       <div>
      //           <div style={{color:"#418CE2",cursor:"pointer",margin:"0 0 6px 0"}} >同意</div> 
      //           {/* onClick={this.onClickUpdate.bind(this, record)} */}
      //           <div style={{color:"#418CE2",cursor:"pointer"}} onClick={this.onClickCancel.bind(this, record)}>拒绝接单</div>
      //       </div>)
      //     }
      //   }
      // }
    ];

    var cs = Common.getGridMargin(this);
    var pag = {showQuickJumper: true, total:this.state.PluginOrderManageSet.totalRow, pageSize:this.state.PluginOrderManageSet.pageRow, current:this.state.PluginOrderManageSet.startPage,
      size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage,
      showTotal:this.showTotal,};
    var visible = (this.state.action === 'query') ? '' : 'none';
    var tablePage = (
        <div className='grid-page' style={{padding: cs.padding, display:visible}}>
          <div style={{margin: cs.margin}}>
            <ServiceMsg ref='mxgBox' svcList={['servicemarket_order/getservicemarketOrder']}/>
            <Filter ref='filter' />
            <div className='toolbar-table'>
              <div style={{float:'left'}}>
                <Button icon={Common.iconSearch} type="primary" title="查询" onClick={this.handleQueryClickSearch}>查询</Button>
                <Button className='btn-margin' icon={Common.iconReset}  title="重置" onClick={this.reset} key='重置' >重置</Button>
                {/* <ExportExcel module='alipayDeliverypluginOrder' filter={this.filter?this.filter.state.filterManage:{}} key="导出" />, */}
                <ExportExcel module='pluginOrder' filter={this.getFilter()}/>
              </div>
              <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
              </div>
            </div>
          </div>
          <div className='grid-body'>
            <Table  columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
          </div>
            {/* <CancelPluginOrderManagePage  ref="cancelWindow" PluginOrderManage={this.state.PluginOrderManage} /> */}
        </div>
    );

    var formPage = null;
    // if (this.state.action === 'update') {
    //   formPage = <OrderDetailPage onBack={this.onGoBack}  PluginOrderManage={this.state.PluginOrderManage}/>
    // }

    return (
        <div style={{width: '100%',height:'100%'}}>
          {tablePage}
          {formPage}
        </div>
    );
  }
});

module.exports = PluginOrderManagePage;