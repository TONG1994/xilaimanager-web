/**
 *   Create by Chenhui on 2018/4/19
 */
'use strict';

import React from 'react';
var Reflux = require('reflux');
import {Button, Input} from 'antd';
import moment from 'moment';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var InvestmentRateStore = require('./data/InvestmentRateStore');
var InvestmentRateActions = require('./action/InvestmentRateActions');

//table
var FormDef = require('./components/InvestmentRateForm');
const tableName = 'investmentRateTable';
import DictTable from '../../../lib/Components/DictTable'
import ServiceMsg from '../../../lib/Components/ServiceMsg';

//filter
import Filter from './components/Filter'
import ExportExcel from '../../lib/Components/ExportExcel'

var filterValue = '';
var pageRows = 10;
var InvestmentRatePage = React.createClass({
    getInitialState : function() {
        return {
            InvestRateSet: {
                recordSet: '',
                errMsg : '',
                startPage: 1,
                pageRow: 10,
            },
            loading: false,
            InvestmentRate:{}
        }
    },

    mixins: [Reflux.listenTo(InvestmentRateStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.errMsg){
            this.setState({loading: false});
            return;
        }
        if(data.operation === 'managementGetRate'){
            this.setState({
                loading: false,
                InvestRateSet: Object.assign({}, this.state.InvestRateSet, data)
            });
        }
    },

    // 刷新
    handleQueryClick: function () {
        let obj = this.refs.filter.getFilter();
        if(obj){
            this.setState({ loading: true });
            // 根据条件调方法
            InvestmentRateActions.retrieveInvestRate(obj,this.state.InvestRateSet.startPage,this.state.InvestRateSet.pageRow);
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        var filter = {};
        var defualtEnd = Utils.getYesterday();
        var defualtStart = Utils.getYesterday();
        filter.beginEntryTime = defualtStart;
        filter.endEntryTime = defualtEnd;
        // FIXME 查询条件
        InvestmentRateActions.retrieveInvestRate(filter,this.state.InvestRateSet.startPage, pageRows);
    },
    onTableRefresh: function (current, pageRow) {
        if(pageRow!=this.state.InvestRateSet.pageRow){current=1}
        this.state.InvestRateSet.startPage = current;
        this.state.InvestRateSet.pageRow = pageRow;
        this.handleQueryClick();
    },
    filterSearch:function () {
        // FIXME 查询条件
        // const filter=this.refs.filter.state.filter;
        // this.setState({loading: true});
        // this.handleQueryClick(filter);
        this.state.InvestRateSet.startPage = 1;
        this.handleQueryClick();
    },
    resetFilter:function () {
        this.refs.filter.clear();
        this.setState({loading: true});
        InvestmentRateActions.retrieveInvestRate({}, this.state.InvestRateSet.startPage, pageRows);
    },
    getFilter:function(){
        let obj = {};

        if(this.refs.filter){
            let filter=Utils.deepCopyValue(this.refs.filter.state.filter);
            filter.pageRow=pageRows;
            filter.startPage=this.state.InvestRateSet.startPage;
            filter.totalRow=this.state.InvestRateSet.totalRow;
            obj = filter;
        }
        return obj;
    },
    render : function() {
        let recordSet = Common.filter(this.state.InvestRateSet.recordSet, filterValue);
        let leftButtons = [
                <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.filterSearch} key='查询'>查询</Button>,
                <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} className='btn-margin' key="重置">重置</Button>,
                <ExportExcel module='investmentRate' filter={this.getFilter()}/>
            ];
        // 表格属性
        let attrs = {
            self: this,
            tableName: tableName,
            // primaryKey: 'uuid',
            fixedTool: false,    // 固定按钮，不滚动
            buttons: leftButtons,
            btnPosition: 'top',
            // rightButtons: rightButtons,
            // operCol: operCol,
            tableForm: FormDef,
            editCol: false,
            editTable: false,
            defView: 'investmentRateTable',//tableForm的 tableView的一个name
            totalPage: this.state.InvestRateSet.totalRow,//修改state
            currentPage: this.state.InvestRateSet.startPage,//修改state
            onRefresh: this.onTableRefresh,
            //onRefresh: false,//不分页
        };
        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['order/managementGetRate']}/>
                <Filter ref='filter' />
                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
            </div>
        );
    }
});

module.exports = InvestmentRatePage;