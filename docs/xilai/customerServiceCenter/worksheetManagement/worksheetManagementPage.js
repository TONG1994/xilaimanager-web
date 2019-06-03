import React from 'react';
import ReactMixin from 'react-mixin';
let Reflux = require('reflux');
import { Button , message} from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');
let WorksheetManagementStore = require('./store/WorksheetManagementStore');
let WorksheetManagementActions = require('./action/WorksheetManagementActions.js');
import FormUtil from '../../../lib/Components/FormUtil';
import DictTable from '../../../lib/Components/DictTable';

//person
import Filter from './components/Filter';
import WorksheetManagementModal from './components/WorksheetManagementModal';
import DealWith from './components//DealWith';
const tableName = 'worksheetManagementTable';
var FormDef = require('./components/WorksheetManagementForm.js');

let worksheetManagementPage = React.createClass({
  getInitialState: function () {
    return {
      worksheetManagementSet: {
        recordSet: [],
        errMsg: '',
      },
      loading: false,
      filter:{},
      actionType:'retrieve',
    };
  },
  
  mixins: [Reflux.listenTo(WorksheetManagementStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    let originalData=Utils.deepCopyValue(data);
    let changeData=this.transform(originalData);
    if(data.errMsg){
      if(data.operation === 'findList'){
        if(data.errCode==="90018"){
          this.setState({errMsg:data.errMsg});
          this.doConfirm("该用户已被删除，请重新登录");
        }
      }
      this.setState({loading: false});
      return;
    }
    if (data.operation === 'findList') {
      this.setState({
        loading: false,
        worksheetManagementSet: changeData
      });
    }else if(data.operation === 'create' || data.operation === 'resolve' || data.operation === 'forward' || data.operation === 'close' || data.operation === 'activate'){
      let msgContent=data.operation === 'create'?"新增成功":data.operation === 'resolve'?"提交成功":data.operation === 'forward'?"转派成功":data.operation === 'close'?"关闭成功":data.operation === 'activate'?"激活成功":"";
      // console.log(msgContent);
      message.success(msgContent,3);
      this.setState({
        actionType:"retrieve"
      },()=>{
        this.handleQueryClick();
      })
    }
  },

  doConfirm: function (content) {
      Modal.error({
          title: '错误',
          content: content,
          onOk: this.reload
      });  
  },

  reload: function(){
    window.sessionStorage.removeItem('loginData');
    window.location.reload();
  },

  transform: function(originalData){
    let recordData=originalData.recordSet;
    for (const wookSheet of recordData) {
        if(wookSheet.status==="1"){
          wookSheet.chStatus="受理中";
        }else if(wookSheet.status==="2"){
          wookSheet.chStatus="已处理";
        }else{
          wookSheet.chStatus="已关闭";
        }
    }
    return originalData;
  },

  // 刷新
  handleQueryClick: function () {
    let obj = this.filter.getFilter();
    if(obj){

      this.setState({ loading:true});
      // 根据条件调方法
      WorksheetManagementActions.retrieveWorksheet(obj,this.state.worksheetManagementSet.startPage,this.state.worksheetManagementSet.pageRow);
    }
  },

  // 第一次加载
  componentDidMount: function () {
    let dataSet = this.state.worksheetManagementSet;
    let conf = FormUtil.getTableConf(tableName);
    dataSet.pageRow = (conf.page !== true) ? 0 : conf.pageRow;
    dataSet.startPage = (conf.page !== true)? 0 : 1;
    this.handleQueryClick();

  },

  clear: function (filter) {
    FormDef.initFilterForm(this.state.worksheetManagement);
    // FIXME 输入参数，对象初始化
    this.state.hints = {};
    this.state.filter.uuid = '';
    this.state.filter.filter = filter;
    this.state.loading = false;
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  onTableRefresh: function (current, pageRow) {
    this.state.worksheetManagementSet.startPage=current;
    this.state.worksheetManagementSet.pageRow=pageRow;
    this.handleQueryClick();
  },
  search:function () {
    this.state.worksheetManagementSet.startPage=1;
    this.handleQueryClick();
  },
  reset:function () {
    if(this.filter){
      this.filter.clear();
    }
    this.handleQueryClick();
  },
  dealWith:function(record){
    let CopyValue = Utils.deepCopyValue(record);
    FormDef.getLeftForm(this,CopyValue, null);
    FormDef.getRightForm(this,CopyValue, null);
    this.setState({
      actionType: "update"
    },()=>{
      this.DealWith.initComponenetData(CopyValue);
    });
  },
  goBack: function(){
    this.setState({
      actionType:"retrieve",
    },()=>{this.handleQueryClick()}
    )
  },
  handleOpenWindow: function (record) {
    this.setState({ actionType:'create'});
  },
  render: function () {
    let operCol = {
      title: '操作',
      key: 'action',
      width: 130,
      render: (text,record)=>{
        return(
        <span>
          <a href='#' title="操作" onClick={this.dealWith.bind(this,record) } className='btn-icon-margin'>{record.status==="1"?<Button >去处理</Button>:record.status==="2"?<Button>去关闭</Button>:<Button>去激活</Button>} </a>
        </span>
        )}
    },
    leftButtons = [
      <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.search} key='查询'>查询</Button>,
      <Button icon={Common.iconAdd} title="新增" onClick={this.handleOpenWindow} className='btn-margin' key="新增">新增</Button>,
      <Button icon={Common.iconReset} title="重置" onClick={this.reset} className='btn-margin' key="重置">重置</Button>,
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
      defView: tableName,
      totalPage: this.state.worksheetManagementSet.totalRow,
      currentPage: this.state.worksheetManagementSet.startPage,
      onRefresh: this.onTableRefresh,
    };
    let recordSet=this.state.worksheetManagementSet.recordSet,
    modalProps = {
      actionType:this.state.actionType,
      goBack:this.goBack
    };
    return (
      <div className='grid-page'>
        {
          this.state.actionType==="retrieve"?(
          <div className="content-wrap">
              <Filter ref={ref=>this.filter=ref} />
              <DictTable dataSource={recordSet} loading={this.state.loading} attrs={attrs} locale={{emptyText:'暂无数据'}} />
          </div>
          ):
          this.state.actionType==="create"?
          <div style = {{paddingLeft:20}}>
            <WorksheetManagementModal ref={ref=>this.worksheetManagementModal=ref} {...modalProps}/>
          </div>
          :
          <div style = {{paddingLeft:20}}>
            <DealWith ref={ref=>this.DealWith=ref} {...modalProps}/>
          </div>
        }
      </div>
    );
  }
});

module.exports = worksheetManagementPage;
