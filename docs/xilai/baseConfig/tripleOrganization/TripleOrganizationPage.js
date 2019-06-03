/**
 *   Create by Malson on 2018/4/19
 */


import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;
const confirm = Modal.confirm;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let TripleOrganizationStore = require('./store/TripleOrganizationStore.js');
let TripleOrganizationActions = require('./action/TripleOrganizationActions');
import CreateTripleOrganizationPage from './components/CreateTripleOrganizationPage';
import UpdateTripleOrganizationPage from './components/UpdateTripleOrganizationPage';
import CheckTripleOrganizationPage from './components/CheckTripleOrganizationPage';

let filterValue = '';
//person
import Filter from './components/Filter';
import BeforeData from './components/BeforeData';


import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'TripleOrganizationTable';
var FormDef = require('./components/TripleOrganizationForm');

let TripleOrganizationPage = React.createClass({
  getInitialState: function () {
    return {
      tripleOrganizationSet: {
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
  
  mixins: [Reflux.listenTo(TripleOrganizationStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    if(data.errMsg) {
      this.setState({loading:false});
      return;
    }
    if(data.operation==="findByWhere"){
      this.setState({
        loading: false,
        tripleOrganizationSet: data
      });
    }else if(data.operation==='updateActive'||data.operation==="create"||data.operation==="update"){
      this.handleQueryClick();
    }else if(data.operation==="getUpdateRecord"){
      this.refs.updateWindow.initParams(data.recordSet.orgInfo);
    }else if(data.operation==="check"){
      this.refs.checkWindow.initParams(data.recordSet);
    }
  },
  
  // 刷新
  handleQueryClick: function (type) {
    let obj = this.filter.getFilter();
    if(obj){
      this.setState({ loading: true });
      // 根据条件调方法
      TripleOrganizationActions.retrieveTripleOrganizationPage(obj,this.state.tripleOrganizationSet.startPage,this.state.tripleOrganizationSet.pageRow);
    }
  },
  
  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    var dataSet = this.state.tripleOrganizationSet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },
  clear: function (filter) {
    
    FormDef.initFilterForm(this.state.TripleOrganization);
    
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.filter.uuid = '';
    this.state.filter.filter = filter;
    
    
    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onClickUpdate: function (record) {
    TripleOrganizationActions.getUpdateNeedParams({
      active:0,
      orgNo:record.orgNo,
      logisticsCompanyUuid:record.logisticsCompanyUuid,
      serviceType:record.serviceType
    });
    this.refs.updateWindow.initPage(record);
  },
  onFilterRecord: function (e) {
    filterValue = e.target.value;
    this.setState({ loading: this.state.loading });
  },
  onTableRefresh: function (current, pageRow) {
    if(pageRow!=this.state.tripleOrganizationSet.pageRow){current=1}
    this.state.tripleOrganizationSet.startPage = current;
    this.state.tripleOrganizationSet.pageRow = pageRow;
    this.handleQueryClick();
  },
  search:function () {
    this.handleQueryClick();
  },
  reset:function () {
    this.filter.clear();
    this.handleQueryClick();
  },
  onClickStop:function (record) {
    confirm({
      title: '禁用确认',
      content: '是否确认禁用【'+record.orgName+'】和【'+record.logisticsCompanyName+'】的合作？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let beforeData = BeforeData.getActiveBeforeData(record);
        TripleOrganizationActions.updateActive({
          beforeData,
          active:0,
          orgNo:record.orgNo,
          logisticsCompanyUuid:record.logisticsCompanyUuid,
          serviceType:record.serviceType
        })
      },
      onCancel() {
      },
    });
  },
  onClickStart:function (record) {
    confirm({
      title: '启用确认',
      content: '是否确认启用【'+record.orgName+'】和【'+record.logisticsCompanyName+'】的合作？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let beforeData = BeforeData.getActiveBeforeData(record);
        TripleOrganizationActions.updateActive({
          beforeData,
          active:1,
          orgNo:record.orgNo,
          logisticsCompanyUuid:record.logisticsCompanyUuid,
          serviceType:record.serviceType
        })
      },
      onCancel() {
      },
    });
  },
  add:function () {
    this.refs.createWindow.clear();
    this.refs.createWindow.toggle();
  },
  onClickCheck:function (record) {
    TripleOrganizationActions.check({
      active:0,
      orgNo:record.orgNo,
      logisticsCompanyUuid:record.logisticsCompanyUuid,
      serviceType:record.serviceType
    });
    this.refs.checkWindow.initPage(record);
  },
  render: function () {
    let operCol = {
      title: '操作',
      key: 'action',
      width: 200,
      render: (text, record) => {
        let returnHtml;
        if(record.active==1){
          returnHtml = (
            <span>
                <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改' className='btn-margin'><Button>修改</Button></a>
                <a href="#" onClick={this.onClickStop.bind(this, record)} title='禁用' className='btn-margin'><Button type='danger'>禁用</Button></a>
            </span>
          )
        }else{
          returnHtml = <a href="#" onClick={this.onClickStart.bind(this, record)} title='启用' className='btn-margin'><Button>启用</Button></a>;
        }
        return (
          <span>
            <a href="#" onClick={this.onClickCheck.bind(this, record)} title='查看' ><Button>查看</Button></a>
            { returnHtml }
          </span>
        )
      }
    },
    leftButtons = [
      <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.search} key='查询'>查询</Button>,
      <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin' key="重置">重置</Button>,
      <Button icon={Common.iconAdd} title="新增" onClick={this.add} key='新增' className='btn-margin'>新增</Button>
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
      defView: 'TripleOrganizationTable',
      totalPage: this.state.tripleOrganizationSet.totalRow,
      currentPage: this.state.tripleOrganizationSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let recordSet = this.state.tripleOrganizationSet.recordSet;
    
    return (
        <div className="grid-page">
          <ServiceMsg ref='mxgBox' svcList={['agent/findByWhere',
            'agent/check',
            'agent/getUpdateRecord',
            'agent/updateActive',
             ]}/>
          <Filter ref={ref => this.filter = ref}/>
          <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
          <CreateTripleOrganizationPage ref="createWindow" />
          <UpdateTripleOrganizationPage ref="updateWindow" />
          <CheckTripleOrganizationPage ref="checkWindow" />
        </div>
    );
  }
});

module.exports = TripleOrganizationPage;
