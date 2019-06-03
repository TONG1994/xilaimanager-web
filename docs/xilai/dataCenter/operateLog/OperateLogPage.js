/**
 *   Create by Malson on 2018/4/19
 */


import React from 'react';
var $ = require('jquery');
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Button, Table, Icon, Modal, Input } from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');

let OperateLogStore = require('./store/OperateLogStore.js');
let OperateLogActions = require('./action/OperateLogActions');
import CreateOperateLogPage from './components/CreateOperateLogPage';
import UpdateOperateLogPage from './components/UpdateOperateLogPage';

let filterValue = '';
//person
import Filter from './components/Filter';
import ExportExcel from '../../lib/Components/ExportExcel';
import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'operateLogTable';
var FormDef = require('./components/OperateLogForm');

let OperateLogPage = React.createClass({
  getInitialState: function () {
    return {
      operateLogSet: {
        recordSet: [],
        errMsg: '',
      },
      loading: false,
    };
  },
  
  mixins: [Reflux.listenTo(OperateLogStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({
      loading: false,
      operateLogSet:  Object.assign({}, this.state.operateLogSet, data)
    });
  },
  
  // 刷新
  handleQueryClick: function (obj={}) {
      let dataSet = this.state.operateLogSet;
      let conf = FormUtil.getTableConf(tableName);
      dataSet.pageRow = (conf.page !== true) ? 0 : Number(conf.pageRow);
      dataSet.startPage = (conf.page !== true) ? 0 : 1;
      OperateLogActions.retrieveOperateLogPage(obj, dataSet.startPage, dataSet.pageRow);
      this.setState({loading: true});
  },
  // 第一次加载
  componentDidMount: function () {
    this.handleQueryClick();
  },
  clear: function (filter) {
    FormDef.initFilterForm(this.state.OperateLog);
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
      let filterObj = this.filter.state.operateLogInfo;
      // this.state.operateLogSet.startPage = current;
      // this.state.operateLogSet.pageRow = pageRow;


      if(pageRow!=this.state.operateLogSet.pageRow){current=1}
      this.state.operateLogSet.startPage = current;
      this.state.operateLogSet.pageRow = pageRow;
      this.setState({loading:true});
      OperateLogActions.retrieveOperateLogPage(filterObj, current, pageRow);


  },
  search:function () {
      let obj = this.filter.getFilter();
      if(obj){
          this.handleQueryClick(obj);
      }
  },
  reset:function () {
      this.filter.clear();
      let obj = this.filter.getFilter();
      if(obj){
          this.handleQueryClick(obj);
      }
  },

  getFilter:function(){
    let obj = {};
    if(this.refs.filter){
      obj = this.refs.filter.state.filter;
    }
    return obj;
  },
  changeLog:function(e,record){
    let $dom = e.target;
    let $domparent = $dom.parentNode.parentNode;
    let type = $dom.getAttribute('class');
    if(type.indexOf('plus-square-o') != -1){
        $dom.setAttribute('title','折叠');
        $dom.setAttribute('class','anticon anticon-minus-square-o');
        let data = record.differData || [];
        let htm =  '';
        data.map((item,index)=>{
            if(item.label == '菜单权限') {
                htm += '<span>' + (index + 1) + '. 【' + item.label + '】<br/>修改前:' + item.oldValue + '<br/>修改后:' + item.value + '</span></br>'
            }else{
                htm += '<span>' + (index + 1) + '. 【' + item.label + '】:修改前:' + item.oldValue + ',修改后:' + item.value + '</span></br>'
            }
        });
        $domparent.getElementsByTagName("span")[0].innerHTML = htm;
    }else{
        $dom.setAttribute('title','展开');
        $dom.setAttribute('class','anticon anticon-plus-square-o');
        $domparent.getElementsByTagName("span")[0].innerHTML  = '<span>【'+record.differData[0].label+'】:修改前:'+record.differData[0].oldValue+'，修改后:'+record.differData[0].value+'</span>';
    }
   },
  render: function () {
    let operCol = {
      title: '操作行为',
      key: 'action',
      width: 400,
      render: (text, record) => {
          if(record.operation == '登录'){
             return <span>登录系统</span>
          }else if(record.operation == '修改'){

              let data = record.differData || [];
              let datas =[];
              data.map((item,index)=>{
                  if(item.oldValue != item.value){
                      datas.push(item);
                  }
              });
              record.differData = datas;
              if(record.differData.length == 1){
                  if(record.differData[0].label == '菜单权限'){
                      return <span>【{record.differData[0].label}】 修改前：{record.differData[0].oldValue.indexOf("&lt;") !=-1?record.differData[0].oldValue.replace(/&lt;/g,"<"):record.differData[0].oldValue}，修改后：{record.differData[0].value.indexOf("&lt;") !=-1?record.differData[0].value.replace(/&lt;/g,"<"):record.differData[0].value}</span>
                  }
                  return <span>【{record.differData[0].label}】 修改前：{record.differData[0].oldValue.indexOf("&lt;") !=-1?record.differData[0].oldValue.replace(/&lt;/g,"<"):record.differData[0].oldValue}，修改后：{record.differData[0].value.indexOf("&lt;") !=-1?record.differData[0].value.replace(/&lt;/g,"<"):record.differData[0].value}</span>
              }else if(record.differData.length == 0){
                  return '';
              }
              return (<div>
                     <div style={{width:'20px',float:'left'}}><Icon type="plus-square-o" style={{marginRight: 8, cursor: 'pointer'}}
                                                           title="展开"
                           onClick={(e)=>{this.changeLog(e,record)}}/></div><span style={{display:'inline-block'}}>【{record.differData[0].label}】 修改前：{record.differData[0].oldValue.indexOf("&lt;") !=-1?record.differData[0].oldValue.replace(/&lt;/g,"<"):record.differData[0].oldValue}，修改后：{record.differData[0].value.indexOf("&lt;") !=-1?record.differData[0].value.replace(/&lt;/g,"<"):record.differData[0].value}</span>
                   </div>)

          }else if(record.operation == '导入'){
              return <span>导入数据成功<br/>文件名是:{record.importFilePath}</span>
          } else{
              return <span>{record.operation}数据成功</span>
          }
      }
    },
    leftButtons = [
      <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.search} key='查询'>查询</Button>,
      <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin' key="重置">重置</Button>,
    ];
    // 表格属性
    var attrs = {
      self: this,
      tableName: tableName,
      primaryKey: 'id',
      fixedTool: false,    // 固定按钮，不滚动
      buttons: leftButtons,
      btnPosition: 'top',
      rightButtons: '',
      operCol: operCol,
      tableForm: FormDef,
      editCol: false,
      editTable: false,
      defView: tableName,
      totalPage: this.state.operateLogSet.totalRow,
      currentPage: this.state.operateLogSet.startPage,
      onRefresh: this.onTableRefresh,
      // onRefresh:false,
      // mustPage: false,
    };
    let recordSet = this.state.operateLogSet.recordSet;
    return (
        <div className="grid-page">
          <ServiceMsg ref='mxgBox' svcList={['accessLog/retrieve']}/>
          <Filter ref={ref => this.filter = ref}/>
          <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
          {/*<CreateOperateLogPage ref="createWindow" />*/}
          {/*<UpdateOperateLogPage ref="updateWindow" />*/}
        </div>
    );
  }
});

module.exports = OperateLogPage;
