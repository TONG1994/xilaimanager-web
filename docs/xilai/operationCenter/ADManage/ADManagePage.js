'use strict';

import React from 'react';
var Reflux = require('reflux');
import {Button, Input,Modal} from 'antd';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var ADCommon = require('./components/ADCommon');

var ADManageStore = require('./data/ADManageStore');
var ADManageActions = require('./action/ADManageActions');

//table
var FormDef = require('./components/ADManageForm');
const tableName = 'ADManageTable';
import DictTable from '../../../lib/Components/DictTable'
import FormUtil from '../../../lib/Components/FormUtil';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ADManageWindowPage from './components/ADManageWindowPage';
//filter
import Filter from './components/Filter'


var filterValue = '';
var pageRows = 10;
var ADManagePage = React.createClass({
    getInitialState : function() {
        return {
            ADManageSet: {
                recordSet: '',
                errMsg : '',
                startPage: 1,
                pageRow: 10,
                optsObj:''
            },
            webManageADManageSet:{},
            loading: false,
            ADManage:{},
            actionType:'retrieve',
            WebManageFlag:false,
            axlCourierAppFlag:false,
            typeSet1:''
        }
    },

    mixins: [Reflux.listenTo(ADManageStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        if(data.errMsg){
            this.setState({
                errMsg:data.errMsg,
                loading: false,
            });
            return;
        }
        if (data.operation === 'queryDevThree') {
            this.setState({
                loading: false,
                ADManageSet: Object.assign({}, this.state.ADManageSet, data),
            });
        }else if(data.operation === 'query_tab') {
            let optsObjData = data.recordSet || [];
            let typeData = [];
            optsObjData.map(item=>{
                if(item.typeList){
                    typeData.push(item.typeList[0]);
                }
            });
            let typeSet1 = typeData ? typeData :[];
            this.setState({
                typeSet1,
                loading: false,
            });
        }else if(data.operation === 'create'){
            var index = data.recordSet.length-1;
            if(data.recordSet[index].isExistSensitiveWord == '0'){
                this.handleQueryClick();
            }
        }else if(data.operation === 'update'){
            this.handleQueryClick();
        }else if(data.operation === 'remove'){
            this.handleQueryClick();
        }else if(data.operation === 'queryDevThreeWebManage'){

            this.setState({
                webManageADManageSet: Object.assign({}, this.state.webManageADManageSet, data)
            },()=>{
                this.getFlag();
            });
        }
    },

    handleQueryClick: function () {
        let obj = this.filter?this.filter.getFilter():{};
        let objDate = {};
        if(obj){
            this.setState({ loading: true });
            ADManageActions.retrieve(obj,this.state.ADManageSet.startPage,this.state.ADManageSet.pageRow);
            ADManageActions.webManageRetrieve(objDate,1);
        }
    },
    getFlag:function(){
        let newData = this.state.webManageADManageSet.recordSet ||[];
        let WebManageFlagData = [],WebManageFlagDataNew=[],axlCourierAppFlagData = [],axlCourierAppFlagDataNew = [];
        newData.map(item=>{
            if(item.typeID == 'WebManage'){
                WebManageFlagData.push(item)
            }
        });
        WebManageFlagData.map(item=>{
            if(item.stateID == '1'){
                WebManageFlagDataNew.push(item);
            }
        });
        if(WebManageFlagDataNew.length < 10 ){
            this.setState({
                WebManageFlag:false
            })
        }else{
            this.setState({
                WebManageFlag:true
            })
        }
        newData.map(item=>{
            if(item.typeID == 'axlCourierApp'){
                axlCourierAppFlagData.push(item)
            }
        });
        axlCourierAppFlagData.map(item=>{
            if(item.stateID == '1'){
                axlCourierAppFlagDataNew.push(item);
            }
        });
        if(axlCourierAppFlagDataNew.length < 10 ){
            this.setState({
                axlCourierAppFlag:false
            })
        }else{
            this.setState({
                axlCourierAppFlag:true
            })
        }
    },
    componentDidMount : function(){
        if (this.mxgBox) {
            this.mxgBox.clear();
        }
        var dataSet = this.state.ADManageSet;
        var conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
        dataSet.startPage = (conf.page !== true) ? 0 : 1;
        this.handleQueryClick();
    },
    onTableRefresh: function (current, pageRow) {
        if(pageRow!=this.state.ADManageSet.pageRow){current=1}
        this.state.ADManageSet.startPage = current;
        this.state.ADManageSet.pageRow = pageRow;
        this.handleQueryClick();
    },
    filterSearch:function () {
        this.state.ADManageSet.startPage = 1;
        this.state.ADManageSet.pageRow = 10;
        this.handleQueryClick();
    },
    resetFilter:function () {
        this.filter.setState({
            filter: {
                typeID:'',
                type:'',
                stateID:'',
                state:'',
            }
        },()=>{
            this.state.ADManageSet.startPage = 1;
            this.state.ADManageSet.pageRow = 10;
            this.handleQueryClick();
        });
    },
    // getFilter:function(){
    //     let obj = {};
    //     if(this.filter){
    //         let filter=Utils.deepCopyValue(this.filter.state.filter);
    //         filter.pageRow=pageRows;
    //         filter.startPage=this.state.ADManageSet.startPage;
    //         filter.totalRow=this.state.ADManageSet.totalRow;
    //         obj = filter;
    //     }
    //     return obj;
    // },
    onClickCreate:function(){
        this.setState({actionType:'create'},()=>{
            this.newWindow.addData();
        });
    },
    onClickUpdate:function(record) {
        this.setState({actionType:'edit'},()=>{
            this.newWindow.initEditData(record);
        });
    },
    onClickCheck:function(record){
        this.setState({actionType:'check'},()=>{
            this.newWindow.initEditData(record);
        });

    },
    onClickDelete:function (record) {
        let $this = this;
        Modal.confirm({
            title: '删除确认',
            content: '是否确定删除 【'+record.title+'】？',
            okText: '确定',
            cancelText: '取消',
            onOk: function () {
                $this.setState({ loading: true });
                ADManageActions.delete(record.uuid);
            }
        });
    },
    onClickOffLine:function(record){
        let $this = this;
        Modal.confirm({
            title: '下线确认',
            content: '是否确定下线 【'+record.title+'】？',
            okText: '确定',
            cancelText: '取消',
            onOk: function () {
                $this.setState({ loading: true });
                let filter =  Utils.deepCopyValue(record);
                filter.downTime = ADCommon.getNowFormatDate();
                // filter.duration = ADCommon.getDuration(filter.upTime, filter.downTime);
                filter.state = '已失效';
                filter.stateID ='2';
                ADManageActions.update(filter, 'offline');
            }
        });
    },
    goBack(){
        this.setState({actionType:'retrieve'});
        this.handleQueryClick();
    },

    render : function() {
        let recordSet = this.state.ADManageSet.recordSet;
        let leftButtons = [
            <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.filterSearch} key='查询'>查询</Button>,
            <Button icon={Common.iconAdd} title="新建"  onClick={this.onClickCreate} className='btn-margin' key='新建'>新建</Button>,
            <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} className='btn-margin' key="重置">重置</Button>,
        ];
        let operCol = {
            title: '操作',
            key: 'action',
            width: 300,
            render: (text, record) => {
                let returnHtml;
                // 0 未上线 1 已上线 2 已失效
                return (
                    <span>
                    {
                        (record.stateID ==='0') ? <span><a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改' className='btn-margin'><Button>修改</Button></a><a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除' className='btn-margin'><Button type='danger'>删除</Button></a></span> : ''
                    }
                        {
                            (record.stateID ==='1') ? <a href="#" onClick={this.onClickCheck.bind(this, record)} title='查看'  className='btn-margin'><Button>查看</Button></a> : ''
                        }
                        {
                            (record.typeID !='axlMessCenter' && record.stateID ==='1') ? <a href="#" onClick={this.onClickOffLine.bind(this, record)} title='下线' className='btn-margin'><Button>下线</Button></a>:''
                        }
                        {
                            (record.stateID ==='2') ? <a href="#" onClick={this.onClickCheck.bind(this, record)} title='查看'  className='btn-margin'><Button>查看</Button></a> : ''
                        }
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
            // rightButtons: rightButtons,
            operCol: operCol,
            tableForm: FormDef,
            editCol: false,
            editTable: false,
            defView: 'ADManageTable',
            totalPage: this.state.ADManageSet.totalRow,
            currentPage: this.state.ADManageSet.startPage,
            onRefresh: this.onTableRefresh,
        };
        let actionType = this.state.actionType,typeSet1 = this.state.typeSet1,WebManageFlag = this.state.WebManageFlag,axlCourierAppFlag = this.state.axlCourierAppFlag,typeSet = this.filter ? this.filter.state.typeSet : [];
        let modalProps = {
            actionType,
            goBack:this.goBack,
            typeSet,
            typeSet1,
            WebManageFlag,
            axlCourierAppFlag,
        };
        return (
            <div className='grid-page'>
                <ServiceMsg ref={ref => this.mxgBox = ref} svcList={['advertisement/queryDevThree','advertisement/query_tab','advertisement/remove','advertisement/create','advertisement/update','advertisement/upload']}/>
                {
                    actionType === 'retrieve'?(
                            <div>
                                <Filter ref={ ref=> this.filter = ref}  />
                                <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} />
                            </div>
                        ):
                        <div style = {{paddingLeft:20}}>
                            <ADManageWindowPage ref={ref=>this.newWindow = ref}   {...modalProps} />
                        </div>
                }
            </div>
        );
    }
});

module.exports = ADManagePage;