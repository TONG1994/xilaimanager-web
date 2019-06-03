/**
 * Create by FYSW on 2018/4/19
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var TemplatePrintStore = require('./data/TemplatePrintStore.js');
var TemplatePrintActions = require('./action/TemplatePrintActions');
import CreatePrintTemplatePage from './components/CreatePrintTemplatePage';
import UpdatePrintTemplatePage from './components/UpdatePrintTemplatePage';

//table
let  FormDef = require('./components/PrintTemplateForm');
const tableName = 'printTemplateTable';
import DictTable from '../../../lib/Components/DictTable'
import FormUtil from '../../../lib/Components/FormUtil';


var filterValue = '';

var PrintTemplatePage = React.createClass({
    getInitialState : function() {
        return {
            PrintTemplateSet: {
                recordSet:[],
                errMsg : ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(TemplatePrintStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if (data.operation === 'getAll') {
            this.setState({
              loading: false,
              PrintTemplateSet: Object.assign({}, this.state.PrintTemplateSet, data)
            });
        }else if(data.operation === 'create'){
            this.handleQueryClick();
            data.mySelf.beforeClose();
        }else if(data.operation === 'update'){
            this.handleQueryClick();
        }else if(data.operation === 'remove'){
            this.handleQueryClick();
        }
    },
    
    // 刷新
    handleQueryClick : function(event) {
        let dataSet = this.state.PrintTemplateSet;
        let conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
        dataSet.startPage = (conf.page !== true) ? 0 : 1;


        this.setState({loading: true});
        // FIXME 查询条件
        TemplatePrintActions.getTemplatePrintAll({},dataSet.startPage,dataSet.pageRow);
    },

    // 第一次加载
    componentDidMount : function(){

        this.handleQueryClick();
    },

    handleOpenCreateWindow : function(event) {
        // FIXME 输入参数
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
        this.refs.createWindow.beforeClose();
    },

    onClickUpdate : function(printTemplate, event){
        if(printTemplate != null){
            this.refs.updateWindow.initPage(printTemplate);
            this.refs.updateWindow.toggle();
            this.refs.updateWindow.beforeClose();
        }
    },

    // onClickSearch : function(printTemplate, event){
    //     if(printTemplate != null){
    //         this.refs.viewWindow.initData(printTemplate);
    //     }
    // },

    onClickDelete : function(printTemplate, event){
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的发件 【'+printTemplate.logisticsCompanyName+'】',
            cancelText: '取消',
            okText: '确定',
            onOk: this.onClickDelete2.bind(this, printTemplate)
        });
    },

    onClickDelete2 : function(printTemplate)
    {
        this.setState({loading: true});
        TemplatePrintActions.deleteTemplatePrint( printTemplate.uuid );
    },
    onFilterRecord: function(e){
        filterValue = e.target.value;
        this.setState({loading: this.state.loading});
    },

    onTableRefresh: function (current, pageRow) {
        this.state.PrintTemplateSet.startPage = current;
        this.state.PrintTemplateSet.pageRow = pageRow;
        this.handleQueryClick();
    },
    
    render : function() {
        let recordSet=this.state.PrintTemplateSet.recordSet;
        let leftButtons = [
                <Button icon={Common.iconAdd}  title="增加数据" key='增加数据' type='primary' onClick={this.handleOpenCreateWindow} >增加</Button>,
                <Button icon={Common.iconRefresh} title="刷新数据" key="刷新数据" onClick={this.handleQueryClick} className='btn-margin'>刷新</Button>
            ],
            operCol = {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, record) => (
                    <span>
                        <Button onClick={this.onClickUpdate.bind(this, record)} title='编辑信息' className='btn-opera-margin'>编辑</Button>
                        <Button type="danger" onClick={this.onClickDelete.bind(this, record)} title='删除信息' className='btn-opera-margin'>删除</Button>
                    </span>
                ),
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
                defView: 'printTemplateTable',//tableForm的 tableView的一个name
                totalPage: this.state.PrintTemplateSet.totalRow,//修改state
                currentPage: this.state.PrintTemplateSet.startPage,//修改state
                // onRefresh: this.onTableRefresh,
                onRefresh: false,//不分页
            };
        return (
            <div className='grid-page' style={{paddingTop:'10px'}}>
                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
                <CreatePrintTemplatePage ref="createWindow" Action="create"/>
                <UpdatePrintTemplatePage ref="updateWindow" Action="update"/>
            </div>
        );
    }
});

module.exports = PrintTemplatePage;