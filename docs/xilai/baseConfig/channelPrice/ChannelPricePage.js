/**
 *   Create by Chenhui on 2018/4/19
 */
'use strict';

import React from 'react';
var Reflux = require('reflux');
import {Button, Input} from 'antd';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ChannelPriceStore = require('./data/ChannelPriceStore');
var ChannelPriceActions = require('./action/ChannelPriceActions');

//table
var FormDef = require('./components/ChannelPriceForm');
const tableName = 'channelPriceTable';
import DictTable from '../../../lib/Components/DictTable'
import FormUtil from '../../../lib/Components/FormUtil';
import ServiceMsg from '../../../lib/Components/ServiceMsg';

//filter
import Filter from './components/Filter'
import UploadExcel from '../../lib/Components/UploadExcel'
import ExportExcel from '../../lib/Components/ExportExcel'

var filterValue = '';

var ChannelPricePage = React.createClass({
    getInitialState : function() {
        return {
            ChannelPriceSet: {
                recordSet: '',
                errMsg : '',
            },
            loading: false,
            ChannelPrice:{}
        }
    },

    mixins: [Reflux.listenTo(ChannelPriceStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.operation=='retrieveByFilter') {
            this.setState({
                loading: false,
                ChannelPriceSet: Object.assign({}, this.state.ChannelPriceSet, data)
            });
        }
    },

    // 刷新
    handleQueryClick: function (obj={}) {
        let dataSet = this.state.ChannelPriceSet;
        let conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : Number(conf.pageRow);
        dataSet.startPage = (conf.page !== true) ? 0 : 1;

        ChannelPriceActions.retrievechannelPrice(obj, dataSet.startPage, dataSet.pageRow);
        this.setState({loading: true});
    },

    // 第一次加载
    componentDidMount : function(){
       this.handleQueryClick();
    },
    onTableRefresh: function (current, pageRow) {
        let filterObj = this.filter.state.ChannelPrice;
        this.state.ChannelPriceSet.startPage = current;
        this.state.ChannelPriceSet.pageRow = pageRow;
        this.setState({loading:true});
        ChannelPriceActions.retrievechannelPrice(filterObj, current, pageRow);
    },
    filterSearch:function () {
        let obj = this.filter.getFilter();
        if(obj){
            this.handleQueryClick(obj);
        }
    },
    resetFilter:function () {
        this.filter.clear();
        let obj = this.filter.getFilter();
        if(obj){
            this.handleQueryClick(obj);
        }
    },
    getFilter:function(){
        let obj = {};
        if(this.filter){
            obj = this.filter.state.ChannelPrice;
        }
        return obj;
    },
    render : function() {
        let recordSet = Common.filter(this.state.ChannelPriceSet.recordSet, filterValue);
        let leftButtons = [
              <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.filterSearch} key='查询'>查询</Button>,
              <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} className='btn-margin' key="重置">重置</Button>,
              <ExportExcel module='channelPrice' filter={this.getFilter()}/>
            ],
            rightButtons = [
                <Button icon={Common.iconSearch}  title="查询" onClick={this.filterSearch} key='查询'>查询</Button>,
                <Button icon={Common.iconReset}   title="重置" onClick={this.resetFilter} className='btn-margin' key="重置" >重置</Button>
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
            defView: 'channelPriceTable',//tableForm的 tableView的一个name
            totalPage: this.state.ChannelPriceSet.totalRow,//修改state
            currentPage: this.state.ChannelPriceSet.startPage,//修改state
            onRefresh: this.onTableRefresh,
            //onRefresh: false,//不分页
        };
        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['channel_price/retrieveByFilter']}/>
                <Filter ref={ref=>this.filter = ref} />
                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
            </div>
        );
    }
});

module.exports = ChannelPricePage;