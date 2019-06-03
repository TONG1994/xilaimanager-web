/**
 *   Create by Malson on 2018/9/12
 */
import React from 'react';
import { Button, Input } from 'antd';
import Reflux from 'reflux';
import Common from '../../../public/script/common';
import Utils from '../../../public/script/utils';

//person
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import StaffInfoActions from './actions/StaffInfoActions';
import StaffInfoStore from './store/StaffInfoStore';
import Filter from './components/Filter';

//table
import FormDef from './components/StaffInfoForm';
import DictTable from '../../../lib/Components/DictTable';
import FormUtil from '../../../lib/Components/FormUtil';
const tableName = 'StaffInfoPageTable';

let StaffInfoPage= React.createClass({
  getInitialState: function () {
    return {
      staffInfoSet:{
        recordSet:[],
        errMsg: '',
      },
      loading: false,
    };
  },

  mixins: [Reflux.listenTo(StaffInfoStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
    if(data.errMsg){
      this.setState({errMsg:data.errMsg});
      return;
    }
    if(data.operation === 'retrieve'){
      this.setState({
        staffInfoSet: Object.assign({},this.state.staffInfoSet,data)
      })
    }
  },

  //第一次加载
  componentDidMount: function () {
    var dataSet = this.state.staffInfoSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },

  // 查询方法
  handleQueryClick: function () {
    let obj = this.filter.getFilter();
    // console.log(obj);
    if(obj){
      this.setState({ loading: true });
     // 根据条件调方法
     StaffInfoActions.retrieveStaffInfo(obj,this.state.staffInfoSet.startPage,this.state.staffInfoSet.pageRow);
    }
  },

  onTableRefresh: function (current, pageRow) {
    this.state.staffInfoSet.startPage = current;
    this.state.staffInfoSet.pageRow = pageRow;
    this.handleQueryClick();
  },

  search: function(){
    this.state.staffInfoSet.startPage = '1';
    this.handleQueryClick();
  },

  rest: function(){
    if(this.filter){
      this.filter.clear();
    }
    this.handleQueryClick();
  },

  render: function () {
    let leftButtons=[
      <Button icon={Common.iconSearch} title="查询" type="primary"  key="查询" onClick={this.search}>查询</Button>,
      <Button icon={Common.iconReset} title="重置" onClick={this.rest} className='btn-margin' key="重置">重置</Button>,
    ];

    //表格属性
    var attrProps = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      rightButtons: null,
      operCol: null,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'StaffInfoPageTable',
      totalPage: this.state.staffInfoSet.totalRow,
      currentPage: this.state.staffInfoSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    const dataSource=this.state.staffInfoSet.recordSet;
    return (
      <div className="grid-page">
        <ServiceMsg ref='mxgBox' svcList={['staffInfo/retrieve']}/>
        <Filter key='filter' ref={(ref)=>this.filter=ref} />
        <DictTable dataSource={dataSource} loading={this.state.loading} attrs={ attrProps } />
      </div>
    );
  }
});

module.exports = StaffInfoPage;