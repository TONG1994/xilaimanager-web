'use strict';
import React from 'react';
var Reflux = require('reflux');
import {
    Button,
    Table,
    Icon,
    Modal,
    Input,
    message
} from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import PostmanInfoActions from './action/PostmanInfoActions';
import PostmanInfoStore from './data/PostmanInfoStore';
import Filter from './components/Filter';
import CreatePostmanInfoPage from './components/CreatePostmanInfoPage';
let pageRows = 10;
class PostmanInfoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                recordSet: [],
                startPage: 1,
                pageRow: 10,
                totalRow: 0
            },
            loading: false,
            action: 'query'
        }
    }

    componentDidMount() {
        this.unsubcribe = PostmanInfoStore.listen(this.onServiceChange);
        if (typeof(this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
        this.handleQueryClick();
    }
    componentWillUnmount() {
        this.unsubcribe();
    }
    onServiceChange = (data) => {
        let updatedData=Utils.deepCopyValue(data);
        let trData=this.transformData(updatedData);
        this.setState({ loading: false, user: trData });
        if(data.operation =="remove"){
            let user = this.state.user;
            if(user.totalRow%10 ===0){
                let newStartPage= user.totalRow/10;
                this.onChangeSearch(newStartPage, user.pageRow);
            }
        }
        if(data.operation =="update"){
           this.handleQueryClick();
        }
    }
    handleQueryClick = () => {
        let startPage = this.state.user.startPage,
            pageRow = this.state.user.pageRow;
        this.onChangeSearch(startPage, pageRow);
    }
    handleOpenCreateWindow = (event) => {
        this.createPostman.clear();
    }
    onClickUpdate = (user, event) => {
        this.createPostman.init(user, 'update');
    }
    transformData = (data) =>{
        let recordData=data.recordSet;
        for (const personData of recordData) {
           if(personData.idTag==="1"){
              personData.idTag="站长";
           }else{
              personData.idTag="员工";
           }
        }
        for (const holidayData of recordData) {
            if(holidayData.holidayFlag==="0"){
                holidayData.holidayFlag="上班";
            }else{
                holidayData.holidayFlag="休假";
            }
        }
        return data;
    }
    onClickLog = (user, event)=>{
        this.createPostman.init(user, 'view');
    }
    onClickDelete = (user, event) => {
        Modal.confirm({
            title: '删除确认',
            content: '是否删除选中的快递员【工号：' + user.userCode + ', 姓名：' + user.name + '】?',
            okText: '确定',
            cancelText: '取消',
            onOk: this
                .onClickDelete2
                .bind(this, user)
        });
    }
    onClickDelete2 = (user) => {
        this.setState({ loading: true });
        // PostmanInfoActions.deletePostmanInfo(user.uuid);
        PostmanInfoActions.deletePostmanInfo(user);
    }
    onChangePage = (pageNumber) => {
        this.state.user.startPage = pageNumber;
        this.onChangeSearch(pageNumber, pageRows);
    }
    onShowSizeChange = (current, pageSize) => {
        pageRows = pageSize;
        this.state.user.startPage = 1;
        this.state.user.pageRow = pageSize;
        this.onChangeSearch(current, pageRows);
    }
    onChangeSearch = (startPage, pageRows) => {
        let filter = this.filter.state.employee;
        if (this.filter.checkValue()) {
            this.setState({ loading: true, filter });
            PostmanInfoActions.retrievePostmanInfo(filter, startPage, pageRows);
        }
    }
    resetFilter = () => {
        this.filter.clear();
        this.filterSearch();
    }
    filterSearch = () => {
        this.state.user.startPage = 1;
        let startPage = 1,
            pageRow = this.state.user.pageRow;
        this.onChangeSearch(startPage, pageRow);
    }
    render() {
        let pag = {
            showQuickJumper: true,
            size: 'middle',
            total: this.state.user.totalRow,
            showTotal: total => `总共 ${total} 条`,
            pageSize: this.state.user.pageRow,
            current: this.state.user.startPage,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange,
            onChange: this.onChangePage
        };

        const columns = [{
            title: '服务站ID',
            dataIndex: 'orgNo',
            width: 80
        }, {
            title: '服务站名称',
            dataIndex: 'orgName',
            width: 140
        }, {
            title: '快递员ID',
            dataIndex: 'userCode',
            width: 80
        }, {
            title: '快递员姓名',
            dataIndex: 'name',
            width: 80
        }, {
            title: '联系方式',
            dataIndex: 'phone',
            width: 120
        }, {
            title: '身份证号',
            dataIndex: 'idCard',
            width: 120
        }, {
            title: '身份标签',
            dataIndex: 'idTag',
            width: 80
        },{
            title: '上班状态',
            dataIndex: 'holidayFlag',
            width: 80
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 120
        }, {
            title: '修改时间',
            dataIndex: 'editTime',
            width: 120
        }, {
            title: '操作',
            key: 'action',
            width: 220,
            render: (text, record) => ( 
            <span>
             <a href="#" onClick={this.onClickLog.bind(this, record)} title='查看快递员信息'><Button >查看</Button></a>
            <Button onClick = { this.onClickUpdate.bind(this, record) } title = '修改快递员信息' className = 'btn-opera-margin' >修改</Button> 
            <Button type = "danger" onClick = { this.onClickDelete.bind(this, record) } title = '删除快递员'  className = 'btn-opera-margin'>删除</Button> 
            </span>
            )
        }];

        var cs = Common.getGridMargin(this);
        let recordSet = this.state.user.recordSet;
        var tablePage = ( 
        <div className = 'grid-page'style = {{padding: cs.padding}} >
            <div style = {{margin: cs.margin}}>
            <ServiceMsg ref = 'mxgBox' svcList = { ['user/findCouriers', 'user/remove']}/>
            <Filter ref = { ref => this.filter = ref }/>
            <div className = 'toolbar-table'>
            <div style = {{float: 'left'}}>

            <Button type = "primary" icon = {Common.iconSearch} title = "查询" onClick = { this.filterSearch }key = '查询'>查询</Button>
            <Button icon = { Common.iconReset } title = "重置" onClick = { this.resetFilter } className = "btn-margin" key = "重置" >重置</Button>
            <Button className = "btn-margin" icon = { Common.iconAdd } title = "新增快递员" onClick = { this.handleOpenCreateWindow } >新增</Button>
            </div> 
            </div> 
            </div>
             <div className = 'grid-body'>
            <Table className = 'postmanInfoTable' columns = { columns } dataSource = { recordSet }rowKey = { record => record.uuid } loading = { this.state.loading }
            pagination = { pag } bordered = { Common.tableBorder }  size = 'middle' />
            </div> 
            <CreatePostmanInfoPage ref = { ref => this.createPostman = ref }/>
            </div>
        );

        return ( <div style = {{  width: '100%', height: '100%' }} > { tablePage } </div>
        )
    }
}
export default PostmanInfoPage;