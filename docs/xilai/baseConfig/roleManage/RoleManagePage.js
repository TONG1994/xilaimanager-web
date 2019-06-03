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

let RoleManageStore = require('./store/RoleManageStore.js');
let RoleManageActions = require('./action/RoleManageActions');
import CreateRoleManagePage from './components/CreateRoleManagePage';
import RoleManageLogPage from './components/CheckRoleManagePage';
import UpdateRoleManagePage from './components/UpdateRoleManagePage';


let filterValue = '';
//person
import Filter from './components/Filter';

import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';
const tableName = 'RoleManageTable';
var FormDef = require('./components/RoleManageForm');

let RoleManagePage = React.createClass({
    getInitialState: function () {
        return {
            roleManageSet: {
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

    mixins: [Reflux.listenTo(RoleManageStore, 'onServiceComplete')],
    onServiceComplete: function (data) {
        if(data.errMsg){
            this.setState({
                errMsg:data.errMsg,
                loading: false,
            });
            return;
        }
        if (data.operation === 'retrieve') {
            this.setState({
                loading: false,
                roleManageSet: Object.assign({}, this.state.roleManageSet, data)
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
    handleQueryClick: function () {
        let obj = this.filter.getFilter();
        if(obj){
            this.setState({ loading: true });
            // 根据条件调方法
            RoleManageActions.retrieveRoleManagePage(obj,this.state.roleManageSet.startPage,this.state.roleManageSet.pageRow);
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = FormDef.getFilterFormRule(this);
        var dataSet = this.state.roleManageSet;
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

        FormDef.initFilterForm(this.state.roleManage);

        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.filter.uuid = '';
        this.state.filter.filter = filter;


        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    onClickUpdate: function (RoleManage, event) {
        if (RoleManage != null) {
            this.refs.updateWindow.initPage(RoleManage);
            this.refs.updateWindow.toggle();
        }

    },

    onClickDelete: function (RoleManage, event) {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除该角色？',
            okText: '确定',
            cancelText: '取消',
            onOk: this.onClickDelete2.bind(this, RoleManage)
        });
    },

    onClickDelete2: function (RoleManage) {
        this.setState({ loading: true });
        RoleManageActions.deleteRoleManage(RoleManage);
    },

    onFilterRecord: function (e) {
        filterValue = e.target.value;
        this.setState({ loading: this.state.loading });
    },
    onTableRefresh: function (current, pageRow) {
        if(pageRow!=this.state.roleManageSet.pageRow){current=1}
        this.state.roleManageSet.startPage = current;
        this.state.roleManageSet.pageRow = pageRow;
        this.handleQueryClick();
    },
    search:function () {
        this.handleQueryClick();
    },
    reset:function () {
        this.filter.clear();
        this.handleQueryClick();
    },
    add:function () {
        this.refs.createWindow.clear();
        this.refs.createWindow.toggle();
    },
    onClickLog: function (RoleManage, event) {
        if (RoleManage != null) {
            this.refs.logWindow.initPage(RoleManage);
            this.refs.logWindow.toggle();
        }
    },
    render: function () {
        let operCol = {
                title: '操作',
                key: 'action',
                width: 140,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickLog.bind(this, record)} title='查看角色修改记录'><Button >查看</Button></a>
            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改角色信息' className='btn-margin'><Button>修改</Button></a>
            <a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除角色信息' className='btn-margin'><Button type="danger">删除</Button></a>
          </span>
                ),
            },
            leftButtons = [
                <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.search} key='查询'>查询</Button>,
                <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin' key="重置">重置</Button>,
                <Button icon={Common.iconAdd} title="新增角色" onClick={this.add} key='新增角色' className='btn-margin'>新增</Button>,
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
            defView: 'RoleManageTable',
            totalPage: this.state.roleManageSet.totalRow,
            currentPage: this.state.roleManageSet.startPage,
            onRefresh: this.onTableRefresh,
            // onRefresh:false,
            // mustPage: false,
        };
        let recordSet = Common.filter(this.state.roleManageSet.recordSet, filterValue);
        return (
            <div className="grid-page">
                <ServiceMsg ref='mxgBox' svcList={['role/retrieve','role/remove']}/>
                <Filter ref={ref => this.filter = ref}/>
                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
                <RoleManageLogPage ref="logWindow" />
                <CreateRoleManagePage ref="createWindow" />
                <UpdateRoleManagePage ref="updateWindow" />

            </div>
        );
    }
});

module.exports = RoleManagePage;
