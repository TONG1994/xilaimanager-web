'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var ManageBillStore = require('./data/ManageBillStore.js');
var ManageBillActions = require('./action/ManageBillActions');

import Filter from './components/Filter';
import ManageBillDetail from './components/ManageBillDetail';
import ExportExcel from '../../lib/Components/ExportExcel';
var pageRows = 10;

var BillManagePage = React.createClass({
  getInitialState : function() {
    return {
      ManageBillSet: {
        recordSet: [],
        startPage : 1,
        pageRow : 10,
        totalRow : 0,
        errMsg : ''
      },
      loading: false,
      action: 'query',
      ManageBill: null,
    }
  },

  mixins: [Reflux.listenTo(ManageBillStore, "onServiceComplete")],
  onServiceComplete: function(data) {
    this.setState({
      loading: false,
      ManageBillSet: data
    });
  },

  // 第一次加载
  componentDidMount : function(){
   this.handleQueryClick();

  },

  // 刷新
  handleQueryClick : function() {

    const filter=this.refs.filter.state.filter;
    /*let type = Common.getUserType();
    let orgNo=0;
    if(type==1){
      orgNo=10;
    }
    else if(type==2){
      orgNo=101;
    }
    else{
      orgNo=1011;
    }*/
    this.setState({loading: true});
    // FIXME 查询条件
    //filter.orgNo=orgNo;
    ManageBillActions.retrieveTBillPage(filter,this.state.ManageBillSet.startPage,pageRows);
  },

  onChangePage: function(pageNumber){

    this.state.ManageBillSet.startPage =pageNumber ;
    this.handleQueryClick();

  },
  onShowSizeChange: function(current, pageSize){
    pageRows = pageSize;
    this.handleQueryClick();
  },

  handleOpenCreateWindow : function(event) {
    this.setState({action: 'create'});
  },
  onClickUpdate : function(ManageBill, event){
    if(ManageBill != null){
      this.setState({ManageBill: ManageBill, action: 'update'});
    }
  },
  onGoBack: function(){
    this.setState({action: 'query'});
  },
  reset:function(){
    this.refs.filter.reset();
    this.handleQueryClick();
  },
  search:function(){
    const filter=this.refs.filter.state.filter;
    ManageBillActions.retrieveTBillPage(filter, this.state.ManageBillSet.startPage, pageRows);
  },
  getFilter:function(){
    let obj = {};
    if(this.refs.filter){
      obj = this.refs.filter.state.filter;
    }
    return obj;
  },
  showTotal:function(total) {
    return `总共 ${total} 条`;
  },
  render : function() {
    let recordSet = this.state.ManageBillSet.recordSet;

    const columns = [
      {
        title: '账单编号',
        dataIndex: 'billNo',
        key: 'billNo',
        width: 140
      },
      {
        title: '机构ID',
        dataIndex: 'orgNo',
        key: 'orgNo',
        width: 140
      },
      {
        title: '机构名称',
        dataIndex: 'orgName',
        key: 'orgName',
        width: 140
      },
      {
        title: '预计分成金额',
        dataIndex: 'profitAmount',
        key: 'profitAmount',
        width: 140
      },
      {
        title: '账单日期',
        dataIndex: 'billDate',
        key: 'billDate',
        width: 140
      },
      {
        title: '操作',
        dataIndex: 'detail',
        key: 'detail',
        width: 140,
        render:(text,record)=>(
            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='订单号'><Button>查看</Button></a>
        )
      }

    ];

    var cs = Common.getGridMargin(this);
    var pag = {showQuickJumper: true, total:this.state.ManageBillSet.totalRow, pageSize:this.state.ManageBillSet.pageRow, current:this.state.ManageBillSet.startPage,
      size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage,showTotal:this.showTotal};
    var visible = (this.state.action === 'query') ? '' : 'none';
    var tablePage = (
        <div className='grid-page' style={{padding: cs.padding, display:visible}}>
          <div style={{margin: cs.margin}}>
            <ServiceMsg ref='mxgBox' svcList={['manageBill/queryBillList']}/>
            <Filter ref='filter' />
            <div className='toolbar-table'>
              <div style={{float:'left'}}>
                <Button icon={Common.iconSearch} type="primary" title="查询" onClick={this.handleQueryClick}>查询</Button>
                <Button icon={Common.iconReset} className='btn-margin'  title="重置" onClick={this.reset} key='重置' >重置</Button>
                <ExportExcel module='billManager' filter={this.getFilter()}/>
              </div>
              <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>

              </div>
            </div>
          </div>
          <div className='grid-body'>
            <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
          </div>
        </div>
    );

    var formPage = null;
    if (this.state.action === 'update') {
      formPage = <ManageBillDetail onBack={this.onGoBack}  ManageBill={this.state.ManageBill}/>
    }

    return (
        <div style={{width: '100%',height:'100%'}}>
          {tablePage}
          {formPage}
        </div>
    );
  }
});

module.exports = BillManagePage;