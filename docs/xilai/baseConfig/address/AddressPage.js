/**
 *   Create by Malson on 2018/4/19
 */


import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let AddressStore = require('./store/AddressStore.js');
let AddressActions = require('./action/AddressActions');
// import CreateAddressPage from './components/CreateAddressPage';
// import UpdateAddressPage from './components/UpdateAddressPage';

let filterValue = '';
//person
import ExportExcel from '../../lib/Components/ExportExcel';
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'AddressTable';
var FormDef = require('./components/AddressForm');

let AddressPage = React.createClass({
  getInitialState: function () {
    return {
      addressSet: {
        recordSet: [],
        errMsg: '',
        startPage: 1,
        pageRow: 10,
        totalRow: 0,
      },
      loading: false,
      filter:{}
    };
  },

  mixins: [Reflux.listenTo(AddressStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    // console.log(data);
    this.setState({
      loading: false,
      addressSet: data
    });
  },

  // 刷新
  handleQueryClick: function (type) {
    let obj = this.filter.getFilter();
    if(obj){
      this.setState({ loading: true });
      // let belongsOrgNo = Common.getLoginData()?Common.getLoginData().staffInfo.orgNo:'';
      let {name,phone,belongsOrgNo} = obj;
      // 根据条件调方法
      AddressActions.retrieveAddressPage({name,phone,belongsOrgNo},this.state.addressSet.startPage,this.state.addressSet.pageRow);
    }
  },

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    var dataSet = this.state.addressSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },

  handleOpenCreateWindow: function (event) {
    // FIXME 输入参数
    this.refs.createWindow.clear();
    this.refs.createWindow.toggle();
  },
  clear: function (filter) {

    FormDef.initFilterForm(this.state.address);

    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.filter.uuid = '';
    this.state.filter.filter = filter;


    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickUpdate: function (address, event) {
    if (address != null) {
      this.refs.updateWindow.initPage(address);
      this.refs.updateWindow.toggle();
    }
  },

  onClickDelete: function (address, event) {
    Modal.confirm({
      title: '删除确认',
      content: '是否删除选中的门店管理 【】',
      okText: '确定',
      cancelText: '取消',
      onOk: this.onClickDelete2.bind(this, address)
    });
  },

  onClickDelete2: function (address) {
    this.setState({ loading: true });
    AddressActions.deleteAddress(address.uuid);
  },
  onFilterRecord: function (e) {
    filterValue = e.target.value;
    this.setState({ loading: this.state.loading });
  },
  onTableRefresh: function (current, pageRow) {
    if(pageRow!=this.state.addressSet.pageRow){current=1}
    this.state.addressSet.startPage = current;
    this.state.addressSet.pageRow = pageRow;
    this.handleQueryClick();
  },
  search:function () {
    this.state.addressSet.startPage = 1;
    this.handleQueryClick();
  },
  reset:function () {
    this.filter.clear();
    this.state.addressSet.startPage = 1;
    this.handleQueryClick();
  },
  export:function () {
    //是否需要带分页
    // console.log(this.filter.state.addressInfo);
    // console.log(this.state.addressSet.startPage);
    // console.log(this.state.addressSet.pageRow);
  },
  dataFilter:function (data) {
   let d = Utils.deepCopyValue(data);
   if(data.length){
     let rD = d.map(item=>{
       let add = item.proviceCityRegionTxt.split('-');
       item.sheng = add[0];
       item.shi = add[1];
       item.qu = add[2];
       return item;
     });
     return rD;
   }
   return data;
  },
  render: function () {
    let operCol = '';
    var leftButtons = [
          <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.search} key='查询'>查询</Button>,
          <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin'
                  key="重置">重置</Button>,
          <ExportExcel module='address' filter={this.filter?this.filter.state.addressInfo:{}} key="导出" />,
        ];
    // 表格属性
    var attrs = {
      self: this,
      tableName: tableName,
      primaryKey: 'uuid',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      rightButtons: '',
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: 'AddressTable',
      totalPage: this.state.addressSet.totalRow,
      currentPage: this.state.addressSet.startPage,
      onRefresh: this.onTableRefresh,
      // onRefresh:false,
      // mustPage: false,
    };
    let recordSet = this.dataFilter(this.state.addressSet.recordSet);

    return (
      <div className="grid-page">
        <ServiceMsg ref='mxgBox' svcList={['address/retrieve']}/>
        <Filter ref={ref => this.filter = ref}/>
        <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
        {/*<CreateAddressPage ref="createWindow" />*/}
        {/*<UpdateAddressPage ref="updateWindow" />*/}
      </div>
    );
  }
});

module.exports = AddressPage;
