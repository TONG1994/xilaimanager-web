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
let QRCode = require('qrcode.react');
let OperationActivityStore = require('./store/OperationActivityStore.js');
let OperationActivityActions = require('./action/OperationActivityActions');

let filterValue = '';

import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'OperationActivityTable';
var FormDef = require('./components/OperationActivityForm');

let OperationActivityPage = React.createClass({
  getInitialState: function () {
    return {
        operationActivitySet: {
        recordSet: '',
        errMsg: '',
        startPage: 1,
        pageRow: 10,
        totalRow: 0,
      },
      loading: false,
      filter:{},
      value:'',
      canvasSize:'750',
      operationActivity:{}
    };
  },

  mixins: [Reflux.listenTo(OperationActivityStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({
      loading: false,
      operationActivitySet: data
    });
  },

  // 刷新
  handleQueryClick: function () {
    let obj = this.filter.getFilter();
    if(obj){
      this.setState({ loading: true });
      // 根据条件调方法
        OperationActivityActions.retrieveOperationActivityPage(obj,this.state.operationActivitySet.startPage,this.state.operationActivitySet.pageRow);
    }
  },

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    var dataSet = this.state.operationActivitySet;
    var conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true) ? 0 : 1;
    this.handleQueryClick();
  },

  clear: function (filter) {

    FormDef.initFilterForm(this.state.operationActivity);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.filter.uuid = '';
    this.state.filter.filter = filter;
    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },
  onFilterRecord: function (e) {
    filterValue = e.target.value;
    this.setState({ loading: this.state.loading });
  },
  onTableRefresh: function (current, pageRow) {
    if(pageRow!=this.state.operationActivitySet.pageRow){current=1}
    this.state.operationActivitySet.startPage = current;
    this.state.operationActivitySet.pageRow = pageRow;
    this.handleQueryClick();
  },
  search:function () {
    this.state.operationActivitySet.startPage=1;
    this.handleQueryClick();
  },
  reset:function () {
    this.filter.clear();
    this.handleQueryClick();
  },
  handleSize:function (record,val) {
    record.size = val;
  },
  download:function (record) {
    let base = 28.4;
    let canvasSize = record.size?Number(record.size)*base:30*base;
    let value = `https://render.alipay.com/p/f/jghjosq5/pages/receive-redpacket/index.html?shareUserId=2088131038522984&sceneCode=CommerceService&partnerId=${record.orgNo}&shareChannel=QRCode`;
    this.setState({value,canvasSize},function () {
      let QRCanvas = document.querySelector('#QRCanvas');
      let _fixType = function(type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        let r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
      };
      let type = 'png';
      let imgData = QRCanvas.toDataURL(type);
      imgData = imgData.replace(_fixType(type),'image/octet-stream');
      let a = document.createElement('a');
      let name = record.orgName || '服务站';
      a.href = imgData;
      a.download = name+'-拉新二维码' +'.'+type;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    });
  },
  openLink:function(record){
      let canvasSize = 750;
      let value = `https://render.alipay.com/p/f/jghjosq5/pages/receive-redpacket/index.html?shareUserId=2088131038522984&sceneCode=CommerceService&partnerId=${record.orgNo}&shareChannel=QRCode`;
      this.setState({value,canvasSize},function () {
          let QRCanvas = document.querySelector('#QRCanvas');
          let type = 'png';
          let imgData = QRCanvas.toDataURL(type);
          let name = record.orgName || '服务站';
          window.sessionStorage.orgName = name;
          window.sessionStorage.qrCode = imgData;
          window.open(window.location.origin +'/QRcode.html');
      });

  },
  render: function () {
      let type = Common.getUserType();
      let operCol = {
          title: '下载链接',
          key: 'action',
          width: 140,
          render: (text, record) => {
              return (
                  <span>
                      {/*<a href="#" title='下载' onClick={this.download.bind(this,record)}>下载</a>*/}
                      <a href="#" title='下载' onClick={this.openLink.bind(this,record)}><Button>查看</Button></a>
                  </span>
              )
          }
      };
      var leftButtons;
        if(type ==3){
            leftButtons ="";
        }else{
            leftButtons = [
                <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.search} key='查询'>查询</Button>,
                <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin'
                        key="重置">重置</Button>,
            ];
        }
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
      defView: 'OperationActivityTable',
      totalPage: this.state.operationActivitySet.totalRow,
      currentPage: this.state.operationActivitySet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let recordSet = Common.filter(this.state.operationActivitySet.recordSet);

    return (
      <div className="grid-page">
        <QRCode
            value={this.state.value}
            id='QRCanvas'
            size={this.state.canvasSize}
            level='H'
            style={{display:'none'}}
        />
        <ServiceMsg ref='mxgBox' svcList={['marketCampaign/retrieveOrgBaseInfo']}/>
        <Filter ref={ref => this.filter = ref}/>
        <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
      </div>
    );
  }
});

module.exports = OperationActivityPage;
