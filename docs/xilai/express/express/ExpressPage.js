/**
 *   Create by Malson on 2018/4/19
 */
'use strict';

import React from 'react';
let Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;
const confirm = Modal.confirm;
import ServiceMsg from '../../../lib/Components/ServiceMsg';
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let ExpressStore = require('./data/ExpressStore');
let ExpressActions = require('./action/ExpressActions');
import OrderDetailPage from '../../lib/Components/orderDetail/OrderDetailPage';


//filter
import Filter from './components/Filter'
let allDeleteRecord=[];
let filterValue = '';
let pageRows=10;
let ExpressPage = React.createClass({
  getInitialState : function() {
    return {
      expressSet: {
        recordSet: [],
        startPage : 1,
        pageRow : 10,
        totalRow : 0,
        errMsg : ''
      },
      loading: false,
      selectedRowKeys:[],
      action:'query',
      selectedRows:[],
      selectRecord:{},
      deleteRecord:[],
      filter:[]
    }
  },

  mixins: [Reflux.listenTo(ExpressStore, "onServiceComplete")],
  onServiceComplete: function(data) {
    if(data.errMsg==''){
      if(data.operation=='retrieveByFilter'){
        this.setState({
          loading: false,
          expressSet: data
        });
      }
      else if(data.operation=='update'){
        allDeleteRecord=allDeleteRecord.length>0?allDeleteRecord.concat(data.deleteRecordSet):data.deleteRecordSet;
        this.setState({
          loading: false,
          expressSet: data,
          selectedRowKeys:[],
          selectedRows:[],
          deleteRecord:data.deleteRecordSet
        });
        // let filter={};
        let filter=this.refs.filter.state.filter;
        filter.orderStatus="3";
        ExpressActions.retrieveExpressPage(filter,1,pageRows);
        Common.infoMsg('发件成功');

      }
    }

  },

  // 刷新
  handleQueryClick : function(event) {
    this.setState({loading: true});
    // FIXME 查询条件

  },

  // 第一次加载
  componentDidMount : function(){
    let filter={};
    filter.orderStatus="3";
    this.setState({loading: true});
    // FIXME 查询条件
    ExpressActions.retrieveExpressPage(filter,1,pageRows);

  },
  handleOpenCreateWindow : function(data) {
    // FIXME 输入参数
    this.setState({action:'showDetail',selectRecord:data})
  },

  search:function(){
    this.setState({loading:true});
    const filter=this.refs.filter.state.filter;
    filter.orderStatus="3";
    ExpressActions.retrieveExpressPage(filter,1,pageRows);

  },

  sending:function(){
    const {selectedRowKeys,selectedRows,filter}=this.state;

    if(filter.length>0){
      confirm({
        title: '发件',
        content: '是否对选中订单进行发件',
        onOk() {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            ExpressActions.updateExpress(filter);
          }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {},
      });
    }
    else{
      Common.infoMsg('请选择需要发件的订单');
    }

  },

  isInArray:function(data,uuid){
    for(var i=0;i<data.length;i++){
      if(data[i]==uuid){
        return -1
      }
    }
    return 1;
  },
  onGoBack:function(){
    this.setState({action: 'query'});
  },
  onChangePage: function (pageNumber) {
    this.state.expressSet.startPage = pageNumber;

    this.setState({loading: true});
    let filter=this.refs.filter.state.filter;
    filter.orderStatus="3";
    ExpressActions.retrieveExpressPage(filter,pageNumber,pageRows);
  },
  onShowSizeChange: function (current, pageSize) {
    pageRows = pageSize;
    this.setState({loading: true});
    let filter=this.refs.filter.state.filter;
    filter.orderStatus="3";
    ExpressActions.retrieveExpressPage(filter,current,pageRows);
  },
  render : function() {
    let filter=[];
    const {selectedRowKeys,selectedRows}=this.state;
    let allDeleteRecordKeys=[];
    allDeleteRecord.map((item)=>{
      allDeleteRecordKeys.push(item.uuid);
    });
    selectedRowKeys.map((item)=>{
      if(this.isInArray(allDeleteRecordKeys,item)==1){
        filter.push(item);
      }
    });
    this.state.filter=filter;



    let recordSet = Common.filter(this.state.expressSet.recordSet, filterValue);
    let pag = {
      showQuickJumper: true,
      total: this.state.expressSet.totalRow,
      pageSize: this.state.expressSet.pageRow,
      current: this.state.expressSet.startPage,
      size: 'large',
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
      onChange: this.onChangePage,
    };

    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 140,
        fixed: 'left',
        render:(text,record)=>(
            <a href="#" onClick={this.handleOpenCreateWindow.bind(this, record)} title='订单号'>{text}</a>
        )
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
        width: 100,
        render: (text, record) => {
          let payStatus = '';
          if (text == '0') {
            payStatus = '未支付';
          }
          else if (text == '1') {
            payStatus = '已付款';
          }

          return <span>{payStatus}</span>
        }
      },
      {
        title: '机构ID',
        dataIndex: 'orgNo',
        key: 'orgNo',
        width: 100,
      },
      {
        title: '机构名称',
        dataIndex: 'orgName',
        key: 'orgName',
        width: 140,
      },
      {
        title: '快递员ID',
        dataIndex: 'courierNo',
        key: 'courierNo',
        width: 100,
      },
      {
        title: '快递员姓名',
        dataIndex: 'courierName',
        key: 'courierName',
        width: 100,
      },
      {
        title: '喜来单号',
        dataIndex: 'xlLogisticsNo',
        key: 'xlLogisticsNo',
        width: 140,
      },
      {
        title: '快递单号',
        dataIndex: 'logisticsNo',
        key: 'logisticsNo',
        width: 140,
      },
      {
        title: '快递公司',
        dataIndex: 'logisticsCompanyName',
        key: 'logisticsCompanyName',
        width: 100,
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width: 100,
        render:(text,record)=>{
          let status='';
          if(text=='3'){
            status='待发件'
          }
          return <span>{status}</span>
        }

      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 140,
      },
    ];
    let cs = Common.getGridMargin(this);
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(selectedRowKeys, selectedRows);
        this.setState({selectedRowKeys,selectedRows});
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      })
    };
    let visible = (this.state.action === 'query') ? '' : 'none';
    let tablePage = (
        <div className='grid-page' style={{padding: cs.padding, display:visible}}>
          <div style={{margin: cs.margin}}>
            <ServiceMsg ref='mxgBox' svcList={['sender/retrieveByFilter', 'sender/update']}/>
            <Filter ref='filter' />
          </div>
          <div className='grid-body'>
            <div className='toolbar-table' style={{padding:0}}>
              <div style={{float:'left'}}>
                <Button icon={Common.iconSearch} type="primary"  title="查询" onClick={this.search} key='查询' >查询</Button>
                <Button icon={Common.iconMail} className='btn-margin' title="发件" onClick={this.sending} key='发件'>发件</Button>

              </div>
              <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
              </div>
            </div>
            <Table  scroll={{ x: 1500 }}  rowSelection={rowSelection}  columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
            <div style={{marginTop:'-40px'}}>

              <span>共计 {this.state.expressSet.totalRow} 条，已选中{filter.length}条</span>
            </div>
          </div>
        </div>
    );
    let formPage=null;
    if(this.state.action=='showDetail'){

      formPage=<OrderDetailPage ManageOrder={this.state.selectRecord} ref="createWindow"  onBack={this.onGoBack}/>
    }


    return (
        <div style={{width: '100%',height:'100%'}}>
          {tablePage}
          {formPage}
        </div>
    );
  }
});

module.exports = ExpressPage;