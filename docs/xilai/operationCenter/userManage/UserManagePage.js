/**
 *   Create by Malson on 2018/9/12
 */

import React from 'react';
import { Button, Input } from 'antd';
import Reflux from 'reflux';
import Common from '../../../public/script/common';

//person
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import UserManageActions from './action/UserManageActions';
import UserManageStore from './store/UserManageStore';
import Filter from './components/Filter';

//table
import FormDef from './components/UserManageForm';
import DictTable from '../../../lib/Components/DictTable';
import FormUtil from '../../../lib/Components/FormUtil';
const tableName = 'UserManageTable';


var filterValue = '';
var pageRows = 10;
let UserManagePage= React.createClass({
    getInitialState: function () {
        return {
            userManageSet:{
                recordSet:[],
                errMsg: '',
            },
            loading: false,
            UserManage:{}
        };
    },
    mixins: [Reflux.listenTo(UserManageStore, 'onServiceComplete')],
    onServiceComplete: function (data) {
        this.setState({loading:false});
        if(data.errMsg){
            this.setState({errMsg:data.errMsg});
            return;
        }
        this.setState({
            loading: false,
            userManageSet: data
        })
    },
    //第一次加载
    componentDidMount: function () {
        var dataSet = this.state.userManageSet;
        var conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
        dataSet.startPage = (conf.page !== true) ? 0 : 1;
        this.handleQueryClick();
    },
    // 查询方法
    handleQueryClick: function () {
        let obj = this.filter.getFilter();
        if(obj){
            this.setState({ loading: true });
            // 根据条件调方法
            UserManageActions.retrieveUserManage(obj,this.state.userManageSet.startPage,this.state.userManageSet.pageRow);
        }
    },
    onTableRefresh: function (current, pageRow) {
        if(pageRow!=this.state.userManageSet.pageRow){current=1}
        this.state.userManageSet.startPage = current;
        this.state.userManageSet.pageRow = pageRow;
        this.handleQueryClick();
    },
    search: function(){
        this.state.userManageSet.startPage = '1';
        this.handleQueryClick();
    },

    rest:function () {
        this.state.userManageSet.startPage = '1';
        this.filter.clear();
        this.handleQueryClick();
    },



    render: function () {
        let leftButtons=[
            <Button icon={Common.iconSearch} title="查询" type="primary"  key="查询" onClick={this.search}>查询</Button>,
            <Button icon={Common.iconReset} title="重置" onClick={this.rest} className='btn-margin' key="重置">重置</Button>,
        ];
        //表格属性
        var attrProps = {
            self: this,
            tableName: tableName,
            primaryKey: 'userUuid',
            fixedTool: false,    // 固定按钮，不滚动
            buttons: leftButtons,
            btnPosition: 'top',
            rightButtons: null,
            operCol: null,
            tableForm: FormDef,
            editCol: false,
            editTable: false,
            defView: 'UserManageTable',
            totalPage: this.state.userManageSet.totalRow,
            currentPage: this.state.userManageSet.startPage,
            onRefresh: this.onTableRefresh,
        };
        let recordSet=this.state.userManageSet.recordSet;
        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['userManage/getMember']}/>
                <Filter ref='filter'  ref={(ref)=>this.filter=ref} />
                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrProps} />
            </div>
        );
    }
});

module.exports = UserManagePage;
