'use strict';

import React from 'react';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ElectronicsInfoStore = require('./data/ElectronicsInfoStore');
var ElectronicsInfoActions = require('./action/ElectronicsInfoActions');
import CreateElectronicsInfoPage from './Components/CreateElectronicsInfoPage';
import UpdateElectronicsInfoPage from './Components/UpdateElectronicsInfoPage';

let FormDef = require('./Components/ElectronicsForm');
import DictTable from '../../../lib/Components/DictTable';
import FormUtil from '../../../lib/Components/FormUtil';
const  tableName = 'ElectronicsTable';

var filterValue = '';
var type = Common.getUserType();//登录类型
var ElectronicListaPage = React.createClass({
    getInitialState : function() {
        return {
            electronicsInfoSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(ElectronicsInfoStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if (data.operation === 'select') {
            this.setState({
                loading: false,
                electronicsInfoSet: Object.assign({}, this.state.electronicsInfoSet, data)
            });
        }else if(data.operation === 'create'){
            this.handleQueryClick();
        }else if(data.operation === 'update'){
            this.handleQueryClick();
        }else if(data.operation === 'remove'){
            this.handleQueryClick();
        }
    },

    // 刷新
    handleQueryClick : function() {

        let dataSet = this.state.electronicsInfoSet;
        var conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
        dataSet.startPage = (conf.page !== true) ? 0 : 1;
        // FIXME 查询条件
        ElectronicsInfoActions.getElectronicsInfo({}, dataSet.startPage, dataSet.pageRow);
        this.setState({loading: true});

    },

    // 第一次加载
    componentDidMount : function(){
        this.handleQueryClick();

        // this.setState({loading: true});
        // FIXME 查询条件
        // ElectronicsInfoActions.getElectronicsInfo();
    },

    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },

    onClickUpdate : function(electronicsInfo, event)
    {
        if(electronicsInfo != null){
            this.refs.updateWindow.initPage(electronicsInfo);
            this.refs.updateWindow.toggle();
        }
    },

    onClickDelete : function(electronicsInfo, event)
    {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的电子面单',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, electronicsInfo)
        });
    },

    onClickDelete2 : function(electronicsInfo)
    {
        this.setState({loading: true});
        ElectronicsInfoActions.deleteElectronicsInfo(electronicsInfo);
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },
    onTableRefresh: function (current, pageRow) {
        this.state.electronicsInfoSet.startPage = current;
        this.state.electronicsInfoSet.pageRow = pageRow;
        this.setState({loading:true});
        ElectronicsInfoActions.getElectronicsInfo({},current, pageRow);
    },

    render : function() {
        var recordSet = Common.filter(this.state.electronicsInfoSet.recordSet, filterValue);
        let disableds = [];
        var type = Common.getUserType();
        for(var i = 0;i<recordSet.length;i++){

            var uuidItem = recordSet[i].uuid;
            var obj = {};
            if (recordSet[i].display){
                obj = {"display":"inline-block"};
            }else {
                obj = {"display":"none"};
            }
            disableds[uuidItem]=obj;
        }
        let leftButtons = [
                <Button icon={Common.iconAdd} title="新增" onClick={this.handleOpenCreateWindow} key='新增' type='primary'>新增</Button>,
                <Button icon={Common.iconRefresh} title="刷新" onClick={this.handleQueryClick} className='btn-margin'
                        key="刷新">刷新</Button>
            ],
                operCol = {
                title: '操作',
                key: 'action',
                width: 140,
                render: (text, record) => (
                    <span>
                        <Button onClick={this.onClickUpdate.bind(this, record)} title='编辑信息' className='btn-opera-margin' style={disableds[record.uuid]}>编辑</Button>
                        <Button type="danger" onClick={this.onClickDelete.bind(this, record)} title='删除电子面单' className='btn-opera-margin' style={disableds[record.uuid]}>删除</Button>
                    </span>
                ),
            },
            rightButtons = '';
        if(type == '1' || type == '3'){
            leftButtons='',
                operCol = '';
        }
        // 表格属性
        var attrs = {
            self: this,
            tableName: tableName,
            primaryKey: 'uuid',
            fixedTool: false,    // 固定按钮，不滚动
            buttons: leftButtons,  //可为空
            btnPosition: 'top',
            rightButtons: rightButtons,//可为空
            operCol: operCol,
            tableForm: FormDef,
            editCol: false,
            editTable: false,
            defView: 'ElectronicsTable',//在7090配置时的table名称
            totalPage: this.state.electronicsInfoSet.totalRow,
            currentPage: this.state.electronicsInfoSet.startPage,
            onRefresh: this.onTableRefresh,//不要分页传false
        };

        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['electronics_form/select']}/>
                <div style={{marginTop:'10px'}}>
                    <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs}/>
                </div>
                <CreateElectronicsInfoPage ref="createWindow"/>
                <UpdateElectronicsInfoPage ref="updateWindow"/>
            </div>
        );
    }
});

module.exports = ElectronicListaPage;