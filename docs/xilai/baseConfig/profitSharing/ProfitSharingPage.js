/**
 *   Create by Chenhui on 2018/4/19
 */
'use strict';

import React from 'react';
var Reflux = require('reflux');
import {Button, Input} from 'antd';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ProfitSharingStore = require('./data/ProfitSharingStore');
var ProfitSharingActions = require('./action/ProfitSharingActions');

//table
var FormDef = require('./components/ProfitAllocationForm');
var tableName = 'profitSharingTable';
var tablesName = 'profitSharingTables';
import DictTable from '../../../lib/Components/DictTable'
import ServiceMsg from '../../../lib/Components/ServiceMsg';

//filter
import Filter from './components/Filter'
import UploadExcel from '../../lib/Components/UploadExcel'
import ExportExcel from '../../lib/Components/ExportExcel'

var filterValue = '';
var filterValues = '';
var type = Common.getUserType();
var ProfitSharingPage = React.createClass({
    getInitialState : function() {
        return {
            ProfitSharingSet: {
                recordSet: '',
                errMsg : ''
            },
            ProfitSharingSets: {
                recordSet: '',
                errMsg : ''
            },
            loading: false,
            loadings: false,
            ProfitSharing:{}
        }
    },

    mixins: [Reflux.listenTo(ProfitSharingStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        const arrayData = this.state.ProfitSharingSet,arraysData = this.state.ProfitSharingSets;
        arrayData.recordSet = [],arraysData.recordSet = [];
        const dataArray = data.object;
        if(dataArray != null){
        dataArray.map(item=>{
            if(item.allocationType == '1'){
                var thirdpartyProfit = item.thirdpartyProfit;
                var headquartersProfit = item.headquartersProfit;
                item.extraProfit = ((1- thirdpartyProfit-headquartersProfit)*100).toFixed(0)+"%";
                item.thirdpartyProfit = (thirdpartyProfit*100).toFixed(0)+"%";
                item.headquartersProfit = (headquartersProfit*100).toFixed(0)+"%";
                item.businessCenterProfit = (item.businessCenterProfit*100).toFixed(0)+"%";
                item.branchProfit = (item.branchProfit*100).toFixed(0)+"%";
                arrayData.recordSet.push(item);
            }else{
                item.thirdpartyProfit = (item.thirdpartyProfit*100).toFixed(0)+"%";
                item.businessCenterProfit = (item.businessCenterProfit*100).toFixed(0)+"%";
                item.branchProfit = (item.branchProfit*100).toFixed(0)+"%";
                arraysData.recordSet.push(item);
            }
        })
        }
        this.setState({
            loading: false,
            ProfitSharingSet: arrayData,
            loadings: false,
            ProfitSharingSets: arraysData
        });
    },

    // 刷新
    handleQueryClick : function(event) {
        this.setState({loading: true,loadings:true});
        //FIXME 查询条件
        ProfitSharingActions.getprofitSharing({});
    },

    // 第一次加载
    componentDidMount : function(){
        this.handleQueryClick();
    },
    filterSearch:function () {
        let filterObj = this.filter.state.ProfitSharing;
        this.setState({loadings: true});
         ProfitSharingActions.getprofitSharing(filterObj);
    },
    resetFilter:function () {
        this.filter.clear();
        this.handleQueryClick();
    },
    handleCallBack:function(){
        if(type != '2'){
            this.filter.clear();
        }
        this.handleQueryClick();
    },
    getFilter:function(){
        let obj = {};
        if(this.filter){
            obj = this.filter.state.ProfitSharing;
        }
        return obj;
    },

    handleDownload:function(flag){
        //flag:1：总部直营2：经营中心加盟3：经营中心直营
        if(flag == '1'){
            window.open('/resources/总部直营型分成设置模板.xlsx');
        }else if(flag == '2'){
            window.open('/resources/经营加盟型分成设置模板.xlsx');
        }else if(flag == '3'){
            window.open('/resources/经营直营型分成设置模板.xlsx');
        }
    },
    render : function() {
        let fiter = <Filter ref={ref=>this.filter = ref}/> ,
            button =  <a href='/resources/总部直营型分成设置模板.xlsx'><Button icon={Common.iconDownload} title="模板下载"  className='btn-margin' key="模板下载">模板下载</Button></a>,
        rightButtons = [
            <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.filterSearch} key='查询'>查询</Button>,
            <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} className='btn-margin' key="重置">重置</Button>,
            <ExportExcel module='profitSharing' filter={this.getFilter()} allocationType = '2'/>
        ];
        if(type == '2'){
            fiter = '';
            // button =  <a href='/resources/经营直营型分成设置模板.xlsx'><Button icon={Common.iconDownload} title="模板下载"  className='btn-margin' key="模板下载">模板下载</Button></a>,
            button = '';
            rightButtons = [
                <UploadExcel module='profitSharing' callback={this.handleCallBack} className='btn-margin' allocationType = '2' visible={true} />,
                <ExportExcel module='profitSharing' filter={this.getFilter()} allocationType = '2'/>,
                <a href='/resources/经营加盟型分成设置模板.xlsx'><Button icon={Common.iconDownload} title="模板下载" className='btn-margin' key="模板下载">模板下载</Button></a>
            ];
            tableName = 'profitSharingsTable';
            tablesName = 'profitSharingsTables';

        }
        let recordSet = Common.filter(this.state.ProfitSharingSet.recordSet, filterValue);
        let recordSets = Common.filter(this.state.ProfitSharingSets.recordSet, filterValues);

        let leftButtons = [
                <UploadExcel module='profitSharing' callback={this.handleCallBack} className='btn-margin' allocationType = '1' visible={true} />,
                <ExportExcel module='profitSharing'  allocationType = '1'/>,
                 button
            ];
        if(type== '2'){
            leftButtons = '';
        }
        // 表格属性
        let attrs = {
            self: this,
            tableName: tableName,
            primaryKey: 'uuid',
            fixedTool: false,    // 固定按钮，不滚动
            buttons: leftButtons,
            btnPosition: 'top',
            //rightButtons: rightButtons,
            // operCol: operCol,
            tableForm: FormDef,
            editCol: false,
            editTable: false,
            defView: tableName,//tableForm的 tableView的一个name
            // onRefresh: this.onTableRefresh,
            onRefresh: false,//不分页
        };
        let attrss = {
            self: this,
            tableName: tablesName,
            primaryKey: 'uuid',
            fixedTool: false,    // 固定按钮，不滚动
            buttons: rightButtons,
            btnPosition: 'top',
           // rightButtons: rightButtons,
            // operCol: operCol,
            tableForm: FormDef,
            editCol: false,
            editTable: false,
            defView: tablesName,//tableForm的 tableView的一个name
            // onRefresh: this.onTableRefresh,
            onRefresh: false,//不分页
        };
        let table = ( <span><div style={{borderBottom:'1px solid rgb(217, 217, 217)',height:43,fontSize:20,marginLeft:20,paddingTop:7,marginBottom:10}}>直营型</div>
                      <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
                      <div style={{borderBottom:'1px solid rgb(217, 217, 217)',height:43,fontSize:20,marginLeft:20,paddingTop:7,marginTop:80,marginBottom:10}}>加盟型</div>
                      {fiter}
                      <DictTable dataSource={recordSets} loading={this.state.loadings} attrs={attrss}  style={{marginBottom:80}}/></span>);
        if(type == '2'){
            table = (<span>
                     <div style={{borderBottom:'1px solid rgb(217, 217, 217)',height:43,fontSize:20,marginLeft:20,paddingTop:7,marginBottom:10}}>加盟型</div>
                     {fiter}
                     <DictTable dataSource={recordSets} loading={this.state.loadings} attrs={attrss}/>
                     <div style={{borderBottom:'1px solid rgb(217, 217, 217)',height:43,fontSize:20,marginLeft:20,paddingTop:7,marginTop:80,marginBottom:10}}>直营型</div>
                     <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs}   style={{marginBottom:80}}/></span>);
        };

        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['profit_allocation/get']}/>
                {table}
            </div>
        );
    }
});

module.exports = ProfitSharingPage;