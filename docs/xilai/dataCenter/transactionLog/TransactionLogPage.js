/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import {Button, Table, Icon, Modal, Input} from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import TransactionLogActions from './action/TransactionLogActions';
import TransactionLogStore from './data/TransactionLogStore';

var FormDef = require('./components/TTradingFlowForm');
const tableName = 'tradingFlowTable';
import DictTable from '../../../lib/Components/DictTable'
import FormUtil from '../../../lib/Components/FormUtil';

import Filter from './components/Filter';
import ExportExcel from '../../lib/Components/ExportExcel';

class TransactionLogPage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      tradeSet: {
        recordSet: [],
        errMsg: '',
        totalRow:0,
        startPage:1,
        pageRow:10

      },
      loading: false,
      exportFilter:{}
    }
  }
  componentDidMount(){
    this.unsubcribe=TransactionLogStore.listen(this.onServiceChange);
    if( typeof(this.refs.mxgBox) != 'undefined' ){
     this.refs.mxgBox.clear();
    }
    this.handleQueryClick();    
  }

  componentWillUnmount(){
    this.unsubcribe();
  }
  onServiceChange=(data)=>{
    if (data.operation === 'retrieveByFilter') {
      this.setState({
        loading: false,
        tradeSet: Object.assign({}, this.state.tradeSet, data)
      });
    }
  }
  handleQueryClick=(obj={})=>{
    let dataSet = this.state.tradeSet;
    let conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : Number(conf.pageRow);
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.setState({loading: true});
    TransactionLogActions.retrieveTradingFlow(obj, dataSet.startPage, dataSet.pageRow);
    
  }
  onTableRefresh=(current, pageRow)=>{
    this.state.tradeSet.startPage = current;
    this.state.tradeSet.pageRow = pageRow;
    let filterObj = this.filter.state.filter;
    this.setState({loading:true});
    TransactionLogActions.retrieveTradingFlow(filterObj, current, pageRow);
  }
  filterSearch=()=>{
    // let filterObj = this.getFilter();
      let filterObj = this.filter.state.filter;
    if(this.filter.checkValue()){
        this.setState({ loading: true, filterObj });
        filterObj.fromOrgNo = filterObj.payAccountNo;
        filterObj.fromOrgName = filterObj.payAccountNo;
        filterObj.toOrgNo = filterObj.incomeAccountNo;
        filterObj.toOrgName = filterObj.incomeAccountNo;
        this.setState({ loading: true, filterObj });
      this.handleQueryClick(filterObj);
    }
  }
  resetFilter=()=>{
    this.filter.clear();
    this.state.tradeSet.startPage=1;
    this.setState({loading:true});
    TransactionLogActions.retrieveTradingFlow({}, 1,  this.state.tradeSet.pageRow);
  }
  getFilter=()=>{
    let exportFilter = {},filter={};
    if(this.filter){
      filter=Utils.deepCopyValue(this.filter.state.filter);
      // filter = this.filter.state.filter;
      exportFilter = filter;
      // exportFilter.fromOrgNo=this.filter.state.filter.payAccountNo;
      // exportFilter.fromOrgName=this.filter.state.filter.payAccountNo;
      // exportFilter.toOrgNo=this.filter.state.filter.incomeAccountNo;
      // exportFilter.toOrgName=this.filter.state.filter.incomeAccountNo;
    }
    return exportFilter;
  }
  
  render(){
    let recordSet = this.state.tradeSet.recordSet;
    let leftButtons = [
          <Button icon={Common.iconSearch} type='primary' title="查询" onClick={this.filterSearch} key='查询'>查询</Button>,
          <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} className='btn-margin'
                  key="重置">重置</Button>,
                    <ExportExcel module='tradingFlowLog' filter={this.getFilter()}  ref='export'/>
        ],
        rightButtons = '';
    // 表格属性
    let attrs = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      rightButtons: rightButtons,
     
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: tableName,//tableForm的 tableView的一个name
      totalPage: this.state.tradeSet.totalRow,//修改state
      currentPage: this.state.tradeSet.startPage,//修改state
      onRefresh: this.onTableRefresh,
      // onRefresh: false,//不分页
    };
    return (
      <div className='grid-page'>
        <ServiceMsg ref='mxgBox' svcList={['tradingFlow/retrieveByFilter','tradingFlow/export-excel','tradingType/queryAllTradingType']}/>
        <Filter ref={ref => this.filter = ref}/>
        <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs}/>
      </div>
  );
  }
}
export default TransactionLogPage;