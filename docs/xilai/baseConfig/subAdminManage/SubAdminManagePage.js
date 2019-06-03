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

let SubAdminManageStore = require('./data/SubAdminManageStore.js');
let SubAdminManageActions = require('./action/SubAdminManageActions');

import CreateSubAdminManagePage from './components/CreateSubAdminManagePage';
import UpdateSubAdminManagePage from './components/UpdateSubAdminManagePage';
import SubAdminManageLogPage from './components/CheckSubAdminManagePage';

let filterValue = '';
//person
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'subAdminManageTable';
var FormDef = require('./components/SubAdminManageForm');

let SubAdminManagePage = React.createClass({
    getInitialState: function () {
        return {
            subAdminManageSet: {
                recordSet: [],
                errMsg: '',
                // startPage: 1,
                // pageRow: 10,
                // totalRow: 0,
            },
            loading: false,
            filter:{}
        };
    },

    mixins: [Reflux.listenTo(SubAdminManageStore, 'onServiceComplete')],
    onServiceComplete: function (data) {
        if (data.operation === 'findManagerList') {
            this.setState({
                loading: false,
                subAdminManageSet: Object.assign({}, this.state.subAdminManageSet, data)
            });
        }else if(data.operation === 'createManager'){
            this.handleQueryClick();
        }else if(data.operation === 'updateManager'){
            this.handleQueryClick();
        }else if(data.operation === 'remove'){
            this.handleQueryClick();
        }
    },

    // 刷新
    handleQueryClick: function () {
        let obj = this.filter.getFilter();
        if(obj){
            this.setState({ loading: true });
            // 根据条件调方法
            SubAdminManageActions.retrieveSubAdminManagePage(obj,this.state.subAdminManageSet.startPage,this.state.subAdminManageSet.pageRow);
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = FormDef.getFilterFormRule(this);
        var dataSet = this.state.subAdminManageSet;
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
        FormDef.initFilterForm(this.state.subAdminManage);
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.filter.uuid = '';
        this.state.filter.filter = filter;
        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    onClickUpdate: function (subAdminManage, event) {
        if (subAdminManage != null) {
            this.refs.updateWindow.initPage(subAdminManage);
            this.refs.updateWindow.toggle();
        }
    },
    onClickLog: function (subAdminManage, event) {
        if (subAdminManage != null) {
            this.refs.logWindow.initPage(subAdminManage);
            this.refs.logWindow.toggle();
        }
    },

    onClickDelete: function (subAdminManage, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除该条数据?',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, subAdminManage)
        });
    },

    onClickDelete2: function (subAdminManage) {
        this.setState({ loading: true });
        SubAdminManageActions.deleteSubAdminManage(subAdminManage);
    },
    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },
    onTableRefresh: function (current, pageRow) {
        if(pageRow!=this.state.subAdminManageSet.pageRow){current=1}
        this.state.subAdminManageSet.startPage = current;
        this.state.subAdminManageSet.pageRow = pageRow;
        this.handleQueryClick();
    },
    add:function () {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },
    search:function () {
        this.state.subAdminManageSet.startPage = 1;
        this.handleQueryClick();
    },
    reset:function () {
        this.filter.clear();
        this.state.subAdminManageSet.startPage = 1;
        this.handleQueryClick();
    },
    render: function () {
        let operCol =
            {
                title: '操作',
                key: 'action',
                width: 250,
                render: (text, record) => (
                        record.mandatoryFlag==1?<span>
             <a href="#" onClick={this.onClickLog.bind(this, record)} title='查看账号修改记录'><Button >查看</Button></a>
            </span>:<span>
            <a href="#" onClick={this.onClickLog.bind(this, record)} title='查看账号修改记录'><Button >查看</Button></a>
            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改账号信息' className='btn-margin'><Button>修改</Button></a>
            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除账号信息' className='btn-margin'><Button type="danger">删除</Button></a>
          </span>
                ),
            },
            leftButtons = [
                <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.search} key='查询'>查询</Button>,
                <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin' key="重置">重置</Button>,
                <Button icon={Common.iconAdd} title="新增账号" onClick={this.add} key='新增账号' className='btn-margin'>新增</Button>,
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
            defView: 'SubAdminManageTable',
            totalPage: this.state.subAdminManageSet.totalRow,
            currentPage: this.state.subAdminManageSet.startPage,
            onRefresh: this.onTableRefresh,
            // onRefresh:false,
            // mustPage: false,
        };
        let recordSet = Common.filter(this.state.subAdminManageSet.recordSet, filterValue);
        return (
            <div className="grid-page">
                <ServiceMsg ref='mxgBox' svcList={['user/findManagerList','user/remove']}/>
                <Filter ref={ref => this.filter = ref}/>
                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
                <CreateSubAdminManagePage ref="createWindow" />
                <UpdateSubAdminManagePage ref="updateWindow" />
                <SubAdminManageLogPage ref="logWindow" />
            </div>
        );
    }
});

module.exports = SubAdminManagePage;
