/**
 *   Create by Chenhui on 2018/4/19
 */
'use strict';
import React from 'react';
var Reflux = require('reflux');
import {Button, Input} from 'antd';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var DiscountManageStore = require('./store/DiscountManageStore');
var DiscountManageActions = require('./action/DiscountManageActions');

//table
var FormDef = require('./components/DiscountManagePageForm');
const tableName = 'discountManageTable';
import DictTable from '../../../lib/Components/DictTable'
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import FormUtil from "../../../lib/Components/FormUtil";
//filter
import Filter from './components/Filter'
import DiscountManageModal from './components/DiscountManageModal';

var filterValue = '';
let DiscountManagePage= React.createClass({
    getInitialState : function() {
        return {
            DiscountManageSet: {
                recordSet: '',
                errMsg : '',
                startPage: 1,
                pageRow: 10,
            },
            loading: false,
            DiscountManage:{},
            actionType: 'retrieve',
            activeKey: '2'
        }
    },
    mixins: [Reflux.listenTo(DiscountManageStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        console.log(data);
        if(data.errMsg){
            this.setState({loading: false});
            return;
        }
        if(data.operation === 'searchVoucherList'){
            this.setState({
                loading: false,
                DiscountManageSet: Object.assign({}, this.state.DiscountManageSet, data)
            });
        }
    },
    // 刷新
    handleQueryClick: function () {
        let obj = this.filter?this.filter.getFilter():{};
        if(obj){
            this.setState({ loading: true });
            // 根据条件调方法
            DiscountManageActions.retrieveDiscountManage(obj,this.state.DiscountManageSet.startPage,this.state.DiscountManageSet.pageRow);
        }
    },
    // 第一次加载
    componentDidMount : function(){
        if (this.mxgBox) {
            this.mxgBox.clear();
        }
        var dataSet = this.state.DiscountManageSet;
        var conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
        dataSet.startPage = (conf.page !== true) ? 0 : 1;
        this.handleQueryClick();
    },

    filterSearch:function () {
        // FIXME 查询条件
        this.state.DiscountManageSet.startPage = 1;
        this.state.DiscountManageSet.pageRow = 10;
        this.handleQueryClick();

    },
    resetFilter:function () {
        this.filter.clear();
        let obj = this.filter.getFilter();
        if(obj){
            this.handleQueryClick(obj);
        }
    },
    //返回
    goBack() {
        this.setState({ actionType: 'retrieve' });
        this.handleQueryClick();
    },
    onTableRefresh: function (current, pageRow) {
        if(pageRow!=this.state.DiscountManageSet.pageRow){current=1}
        this.state.DiscountManageSet.startPage = current;
        this.state.DiscountManageSet.pageRow = pageRow;
        this.handleQueryClick();
    },
    //新增
    add: function () {
        this.setState({ actionType: 'add' }, () => {
            this.DiscountManageModal.addData();
        });
    },
    onCheck:function(record){
        this.setState({ actionType: 'check' }, () => {
            this.DiscountManageModal.initEditData(record);
        });
    },
    render: function () {
        let recordSet = Common.filter(this.state.DiscountManageSet.recordSet, filterValue);
        let leftButtons = [
            <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.filterSearch} key='查询'>查询</Button>,
            <Button icon={Common.iconAdd} title="新建"  onClick={this.add} className='btn-margin' key='新建'>新建</Button>,
            <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} className='btn-margin' key="重置">重置</Button>,
        ];
        let operCol = {
                title: '操作',
                key: 'action',
                width: 140,
                render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onCheck.bind(this, record)} title='查看'><Button >查看</Button></a>
                    </span>
                ),
            };
        // 表格属性
        let attrs = {
            self: this,
            tableName: tableName,
            // primaryKey: 'uuid',
            fixedTool: false,    // 固定按钮，不滚动
            buttons: leftButtons,
            btnPosition: 'top',
            // rightButtons: rightButtons,
            operCol: operCol,
            tableForm: FormDef,
            editCol: false,
            editTable: false,
            defView: 'discountManageTable',//tableForm的 tableView的一个name
            totalPage: this.state.DiscountManageSet.totalRow,//修改state
            currentPage: this.state.DiscountManageSet.startPage,//修改state
            onRefresh: this.onTableRefresh,
            //onRefresh: false,//不分页
        };

        //modal
        let actionType = this.state.actionType;
        let modalProps = {
            actionType,
            goBack: this.goBack
        };
        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['value_voucher/searchVoucherList']}/>
                {
                    actionType === 'retrieve' ? (
                            <div>
                                <div style={{ margin: "0px 20px" }}>
                                    <p style={{ color: "#999999", lineHeight: "50px", fontSize: '20px' }}>优惠券管理</p>
                                    <hr />
                                </div>
                                <Filter ref={ref => this.filter = ref} />
                                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
                            </div>
                        ) :
                        <div>
                            <DiscountManageModal ref={ref => this.DiscountManageModal = ref}  {...modalProps} />
                        </div>
                }
            </div>
        );
    }
});

module.exports = DiscountManagePage;
