/**
 *   Create by Malson on 2018/9/12
 */

import React from 'react';
var Reflux = require('reflux');
import { Button ,Input } from 'antd';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var StoreInfoStore = require('./store/StoreInfoStore');
var StoreInfoActions = require('./action/StoreInfoActions');
import StoreInfoDetail from './components/StoreInfoDetail';
import UpdateStoreInfo from './components/UpdateStoreInfo';
import ExportExcel from "./components/ExportExcel";

//table
var FormDef = require('./components/StoreInfoForm');
const tableName = 'StoreInfoTable';
import DictTable from '../../../lib/Components/DictTable';

//filter
import Filter from './components/Filter';
// import ExportExcel from "../../lib/Components/ExportExcel";
import UpdateRoleManagePage from "../../baseConfig/roleManage/components/UpdateRoleManagePage";
import FormUtil from "../../../lib/Components/FormUtil";

var filterValue = '';
var pageRows = 10;
let StoreInfoPage= React.createClass({
  getInitialState: function () {
    return {
        StoreInfoSet: {
            recordSet: '',
            errMsg : ''
        },
        loading: false,
        action: 'query',
        StoreInfo:{}
    };
  },

    mixins: [Reflux.listenTo(StoreInfoStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.errMsg){
            this.setState({loading: false});
            return;
        }
        if (data.operation === 'updateDetails') {
            Common.succMsg('蚁派门店信息修改成功！');
            this.handleQueryClick();
        }
        this.setState({
            loading: false,
            StoreInfoSet: data
        })
    },

    // 刷新
    handleQueryClick: function () {
        let obj = this.refs.filter.getFilter();
        if(obj){
            this.setState({ loading: true });
            // 根据条件调方法
            StoreInfoActions.retrieveStoreInfo(obj,this.state.StoreInfoSet.startPage,this.state.StoreInfoSet.pageRow);
        }
    },

    // 第一次加载
    componentDidMount : function(){
        var dataSet = this.state.StoreInfoSet;
        var conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
        dataSet.startPage = (conf.page !== true) ? 0 : 1;
        this.handleQueryClick();


        // this.setState({loading: true});
        //         // var filter = {};
        //         // this.handleQueryClick();
        // StoreInfoActions.retrieveStoreInfo(filter,this.state.StoreInfoSet.startPage, pageRows);
    },

    onTableRefresh: function (current, pageRow) {
        if(pageRow!=this.state.StoreInfoSet.pageRow){current=1}
        this.state.StoreInfoSet.startPage = current;
        this.state.StoreInfoSet.pageRow = pageRow;
        // console.log(this.state.StoreInfoSet.pageRow);
        this.handleQueryClick();
    },

    resetFilter:function () {
        this.refs.filter.clear();
        this.setState({loading: true});
        this.handleQueryClick();
        // StoreInfoActions.retrieveStoreInfo({}, this.state.StoreInfoSet.startPage, pageRows);
    },

    filterSearch:function () {
        // FIXME 查询条件
        const filter=this.refs.filter.state.filter;
        // console.log(pageRows);
        this.state.StoreInfoSet.startPage = '1';
        this.setState({loading: true});
        this.handleQueryClick();
        // StoreInfoActions.retrieveStoreInfo(filter, 1, pageRows);
    },

    getFilter:function(){
        let obj = {};

        if(this.refs.filter){
            let filter=Utils.deepCopyValue(this.refs.filter.state.filter);
            filter.pageRow=pageRows;
            filter.startPage=this.state.StoreInfoSet.startPage;
            filter.totalRow=this.state.StoreInfoSet.totalRow;
            obj = filter;
        }
        return obj;
    },

    onClickUpdate : function(StoreInfo, event){
        if(StoreInfo != null){
            this.setState({StoreInfo: StoreInfo, action: 'update'},()=>{
                this.refs.updateWindow.initEditData(StoreInfo.orgUuid);
            })
        }
    },

    onClickLog : function(StoreInfo, event){
        if(StoreInfo != null){
            this.setState({StoreInfo: StoreInfo, action: 'log'});
        }
    },

    onGoBack: function(){
        this.setState({action: 'query'});
    },

    //地区选择回调
    areaPosition:function (val) {
        this.handleOnSelected('orgAddress',val.toString());
    },




  render: function () {
      let recordSet = Common.filter(this.state.StoreInfoSet.recordSet, filterValue);

      let leftButtons = [
          <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.filterSearch} key='查询'>查询</Button>,
          <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} className='btn-margin' key="重置">重置</Button>,
          <ExportExcel module='StoreInfo' filter={this.getFilter()} key="导出"/>
      ];
      let operCol = {
          title: '操作',
          key: 'action',
          width: 100,
          render: (text, record) => {
              return (
                  <span>
                      <a href="#" onClick={this.onClickLog.bind(this, record)} title='查看' ><Button> 查看</Button></a>
                      <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='编辑' className='btn-margin'><Button>编辑</Button></a>
                  </span>
              )
          }
      };

      // 表格属性
      let attrs = {
          self: this,
          tableName: tableName,
          primaryKey: 'uuid',
          fixedTool: false,    // 固定按钮，不滚动
          buttons: leftButtons,
          btnPosition: 'top',
          rightButtons: null,
          operCol: operCol,
          tableForm: FormDef,
          editCol: false,
          editTable: false,
          defView: 'StoreInfoTable',
          totalPage: this.state.StoreInfoSet.totalRow,
          currentPage: this.state.StoreInfoSet.startPage,
          onRefresh: this.onTableRefresh,
      };

      var visible = (this.state.action === 'query') ? '' : 'none';
      var tablePage = (
          <div className='grid-page' style={{display:visible}}>
              <ServiceMsg ref='mxgBox' svcList={['storeInfo/retrieve']}/>
              <Filter ref='filter' />
              <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
          </div>
      );

      var formPage = null;
      if (this.state.action === 'log') {
          formPage = <StoreInfoDetail onBack={this.onGoBack}  StoreInfo={this.state.StoreInfo}/>
      }

      var UpdPage = null;
      if (this.state.action === 'update') {
          UpdPage = <UpdateStoreInfo onBack={this.onGoBack}  StoreInfo={this.state.StoreInfo} ref="updateWindow" />
      }


    return (
        <div style={{width: '100%',height:'100%'}}>
            {tablePage}
            {formPage}
            {UpdPage}
        </div>

    );
  }
});

module.exports = StoreInfoPage;