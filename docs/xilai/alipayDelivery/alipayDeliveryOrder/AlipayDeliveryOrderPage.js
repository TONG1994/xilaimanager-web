/**
 *   Create by Malson on 2018/9/12
 */

import React from 'react';
import { Button, Input } from 'antd';
import Reflux from 'reflux';
import Common from '../../../public/script/common';
import Utils from '../../../public/script/utils';

import AlipayDeliveryOrderActions from './action/AlipayDeliveryOrderActions';
import AlipayDeliveryOrderStore from './store/AlipayDeliveryOrderStore';
import ServiceMsg from '../../../lib/Components/ServiceMsg';

//peson
import Filter from './components/Filter';
// import ExportExcel from '../../lib/Components/ExportExcel';
import ExportExcel from './components/ExportExcel';

//table
import FormDef from './components/AlipayDeliveryOrderForm';
import DictTable from '../../../lib/Components/DictTable';
import FormUtil from '../../../lib/Components/FormUtil';
const tableName = 'AlipayDeliveryOrderPageTable';

let AlipayDeliveryOrderPage= React.createClass({
  getInitialState: function () {
    return {
      alipayDeliveryOrderSet:{
        recordSet:[],
        errMsg: '',
      },
      alipayDeliveryOrder: {},
      loading: false
    };
  },

  mixins: [Reflux.listenTo(AlipayDeliveryOrderStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
    if(data.errMsg){
      this.setState({errMsg:data.errMsg});
      return;
    }
    if(data.operation === 'retrieve'){
      this.setState({
        alipayDeliveryOrderSet: Object.assign({},this.state.alipayDeliveryOrderSet,data)
      })
    }
  },

  //第一次加载
  componentDidMount: function () {
    var dataSet = this.state.alipayDeliveryOrderSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },

  // 查询方法
  handleQueryClick: function () {
    let obj = this.filter.getFilter();
    if(obj){
      this.setState({ loading: true });
     // 根据条件调方法
     AlipayDeliveryOrderActions.retrieveAlipayDeliveryOrder(obj,this.state.alipayDeliveryOrderSet.startPage,this.state.alipayDeliveryOrderSet.pageRow);
    }
  },

  onTableRefresh: function (current, pageRow) {
    this.state.alipayDeliveryOrderSet.startPage = current;
    this.state.alipayDeliveryOrderSet.pageRow = pageRow;
    this.handleQueryClick();
  },

  search: function(e){
    this.state.alipayDeliveryOrderSet.startPage = '1';
    this.handleQueryClick();
  },

  rest: function(){
    if(this.filter){
      this.filter.clear();
    }
    this.handleQueryClick();
  },

  render: function () {
    let operCol;
    let leftButtons=[
      <Button icon={Common.iconSearch} title="查询" type="primary"  key="查询" onClick={this.search}>查询</Button>,
      <Button icon={Common.iconReset} title="重置" onClick={this.rest} className='btn-margin' key="重置">重置</Button>,
      <ExportExcel module='alipayDeliveryOrder' filter={this.filter?this.filter.state.filterManage:{}} key="导出" />,
    ];
    //表格属性
    var attrProps = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'AlipayDeliveryOrderPageTable',
      totalPage: this.state.alipayDeliveryOrderSet.totalRow,
      currentPage: this.state.alipayDeliveryOrderSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    const dataSource=this.state.alipayDeliveryOrderSet.recordSet;
    return (
      <div className="grid-page">
        <ServiceMsg ref='mxgBox' svcList={['alipayDeliveryOrder/retrieve']}/>
        <Filter key='filter' ref={(ref)=>this.filter=ref} />
        <DictTable dataSource={dataSource} loading={this.state.loading} attrs={ attrProps } locale={{emptyText:'未检索到相关信息'}}/>
      </div>
    );
  }
});

module.exports = AlipayDeliveryOrderPage;