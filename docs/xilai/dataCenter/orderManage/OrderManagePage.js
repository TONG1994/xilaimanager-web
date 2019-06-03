'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal,Tooltip, Input} from 'antd';
const Search = Input.Search;
import moment from 'moment';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
import ServiceMsg from '../../../lib/Components/ServiceMsg';

var ManageOrderStore = require('./data/ManageOrderStore.js');
var ManageOrderActions = require('./action/ManageOrderActions');
import OrderDetailPage from '../../lib/Components/orderDetail/OrderDetailPage';
import DeleteOrderManagePage from './components/DeleteOrderManagePage';
import Filter from './components/Filter';

import ExportExcel from '../../lib/Components/ExportExcel';

var pageRows = 10;
var ManageOrderPage = React.createClass({
  getInitialState : function() {
    return {
      ManageOrderSet: {
        recordSet: [],
        startPage : 1,
        pageRow : 10,
        totalRow : 0,
        errMsg : '',
      },
      loading: false,
      action: 'query',
      ManageOrder: null,
    }
  },

  mixins: [Reflux.listenTo(ManageOrderStore, "onServiceComplete")],
  onServiceComplete: function(data) {
      if(data.operation=='queryBySearchFilter'){
          data.recordSet.map(item=>{
              item.threeStatus = '无';
          });
          this.setState({
              loading: false,
              ManageOrderSet: data
          });
      data.recordSet.map(item=>{
          ManageOrderActions.retrieveStatus(item.uuid);
          });

      }
      if(data.operation=='queryStatus' || data.operation=='remove'){
          this.setState({loading:false});
      }
  },

  // 第一次加载
  componentDidMount : function(){
    this.setState({loading: true});
    var filter = {};
    var defualtEnd = Utils.getDefualtEnd();
    var defualtStart = Utils.getDefualtStart();
    filter.createTimeFrom = defualtStart;
    filter.createTimeTo = defualtEnd;

    // FIXME 查询条件
    // ManageOrderActions.initManageOrder(filter);
      ManageOrderActions.retrieveManageOrderPage(filter, this.state.ManageOrderSet.startPage, pageRows);
  },
  // 刷新
  handleQueryClick : function() {
    const filter=this.refs.filter.state.filter;
    this.setState({loading: true});
    // FIXME 查询条件
    ManageOrderActions.retrieveManageOrderPage(filter, this.state.ManageOrderSet.startPage, pageRows);
  },
  // 刷新
  handleQueryClickSearch : function() {
    const filter=this.refs.filter.state.filter;
    this.setState({loading: true});
    // FIXME 查询条件
    ManageOrderActions.retrieveManageOrderPage(filter, 1, pageRows);
  },

  onChangePage: function(pageNumber){
    this.state.ManageOrderSet.startPage = pageNumber;
    this.handleQueryClick();
  },
  onShowSizeChange: function(current, pageSize){
    this.state.ManageOrderSet.startPage = 1;
    pageRows = pageSize;
    this.handleQueryClick();
  },

  handleOpenCreateWindow : function(event) {
    this.setState({action: 'create'});
  },
  onClickUpdate : function(ManageOrder, event){
    if(ManageOrder != null){
      this.setState({ManageOrder: ManageOrder, action: 'update'});
    }
  },
    onClickDelete:function(ManageOrder){
        if(ManageOrder != null){
            this.setState({ManageOrder: ManageOrder},()=>{this.refs.deleteWindow.toggle();});
        }
    },
  onGoBack: function(){
     this.setState({action: 'query',loading: true});
      const filter=this.refs.filter.state.filter;
      ManageOrderActions.retrieveManageOrderPage(filter, this.state.ManageOrderSet.startPage, pageRows);
  },
  reset:function(){
    this.refs.filter.reset();
    this.setState({loading: true});
    ManageOrderActions.retrieveManageOrderPage({}, this.state.ManageOrderSet.startPage, pageRows);
  },

  getFilter:function(){
    let obj = {};
    if(this.refs.filter){
      let filter=Utils.deepCopyValue(this.refs.filter.state.filter);
      filter.pageRow=pageRows;
      filter.startPage=this.state.ManageOrderSet.startPage;
      filter.totalRow=this.state.ManageOrderSet.totalRow;
      obj = filter;
    }
    return obj;
  },
  showTotal:function(total) {
    return `总共 ${total} 条`;
  },
  render : function() {
    var recordSet = this.state.ManageOrderSet.recordSet;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 140,
        fixed: 'left',
        render:(text,record)=>(
            <a href="#" onClick={this.onClickUpdate.bind(this, record)} title='订单号'>{text}</a>
        )
      },
      {
        title: '订单来源',
        dataIndex: 'orderSource',
        key: 'orderSource',
        width: 160,
        render:(text,record)=>{
          let orderSource='';
            switch(text){
                case '0':
                    orderSource='快递通-微信小程序';
                    break;
                case '1':
                    orderSource='爱喜来-App';
                    break;
                case '2':
                    orderSource='支付宝-我的快递';
                    break;
                case '3':
                    orderSource='快递通-支付宝小程序';
                    break;
                case '4':
                    orderSource='快递通-App';
                    break;
            }
          return <span>{orderSource}</span>
        }
      },
      {
          title: '上级机构',
          dataIndex: 'parentOrgName',
          key: 'parentOrgName',
          width: 200,
      },
      {
        title: '机构ID',
        dataIndex: 'orgNo',
        key: 'orgNo',
        width: 140,
      },
      {
        title: '机构名称',
        dataIndex: 'orgName',
        key: 'orgName',
        width: 200,
        render:(text,record)=>{
            if(record.orgName==null ||record.orgName===''){
                return(
                    <div style={{cursor:'pointer'}}>
                        <Tooltip placement="bottomLeft" title='不存在'>
                            {text}
                        </Tooltip>
                    </div>
                )
            }else{
                let info = (
                    <p style={{wordWrap:'break-word',wordBreak:'normal'}}><span>机构类型：{record.orgInfo.orgTypeName?record.orgInfo.orgTypeName:''}<br/>机构名称：{record.orgInfo.orgName?record.orgInfo.orgName:''}<br/>机构地址：{record.orgInfo.detailAddress?record.orgInfo.detailAddress:''}<br/>机构负责人：{record.orgInfo.headName?record.orgInfo.headName:''}<br/>联系方式：{record.orgInfo.headTelephone?record.orgInfo.headTelephone:''}</span></p>
                );
                return(
                    <div style={{cursor:'pointer'}}>
                        <Tooltip placement="bottomLeft" title={info}>
                            {text}
                        </Tooltip>
                    </div>
                )
            }
        }
      },
      {
        title: '快递员ID',
        dataIndex: 'courierNo',
        key: 'courierNo',
        width: 140,
      },
      {
        title: '快递员姓名',
        dataIndex: 'courierName',
        key: 'courierName',
        width: 140,
      },
      {
        title: '发件人电话',
        dataIndex: 'senderPhone',
        key: 'senderPhone',
        width: 140,
      },
      {
        title: '物品类型',
        dataIndex: 'goodsType',
        key: 'goodsType',
        width: 140,
        render:(text,record)=>{
              let goodsType='';
              switch(text){
                  case '0':
                      goodsType='其它';

                      break;
                  case '1':
                      goodsType='日用品';
                      break;
                  case '2':
                      goodsType='数码产品';
                      break;
                  case '3':
                      goodsType='衣服';
                      break;
                  case '4':
                      goodsType='食物';
                      break;
                  case '5':
                      goodsType='文件';
                      break;
              }
              return <span>{goodsType}</span>
        }
      },
      {
        title: '物品重量(kg)',
        dataIndex: 'goodsWeight',
        key: 'goodsWeight',
        width: 140,
      },
      {
        title: '喜来单号',
        dataIndex: 'xlLogisticsNo',
        key: 'xlLogisticsNo',
        width: 140,
      },
      {
        title: '快递单号',
        dataIndex: 'logisticsNo',
        key: 'logisticsNo',
        width: 200,
      },
      {
        title: '快递公司',
        dataIndex: 'logisticsCompanyName',
        key: 'logisticsCompanyName',
        width: 140,
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width: 140,
        render:(text,record)=>{
          let orderStatus='';
          switch(text){
            case '0':
              orderStatus='待接单';
            break;
            case '1':
              orderStatus='待取件';
              break;
            case '2':
              orderStatus='已取件';
              break;
            case '3':
              orderStatus='待发件';
              break;
            case '4':
              orderStatus='待签收';
              break;
            case '6':
              orderStatus='已取消';
              break;
            case '5':
              orderStatus='已签收';
              break;
          }

          return <span>{orderStatus}</span>
        }
      },
        {
            title: '三方订单状态',
            dataIndex: 'threeStatus',
            key: 'threeStatus',
            width: 140,
        },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
        width: 140,
        render:(text,record)=>{
          let payStatus='';
          if(text==0){
            payStatus='未支付';
          }
          else if(text==1){
            payStatus='已支付';
          }
          return <span>{payStatus}</span>
        }
      },
      {
          title: '订单金额（元）',
          dataIndex: 'orderAmount',

          key: 'orderAmount',
          width: 200,
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
      },
      {
        title: '打印时间',
        dataIndex: 'printTime',
        key: 'printTime',
        width: 200,
      },
      {
        title: '发件时间',
        dataIndex: 'deliveryTime',
        key: 'deliveryTime',
        width: 200,
      },
      {
        title: '签收时间',
        dataIndex: 'signatureTime',
        key: 'signatureTime',
        width: 200,
      },
       {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            render: (text, record) => {
                if(record.orderStatus == '0' ||record.orderStatus == '1'||record.orderStatus == '2'){
                    if(record.orderStatus == '0' ||record.orderStatus == '1'){
                        return  (<span>
                                     <Button className='btn-margin' title="修改" onClick={this.onClickUpdate.bind(this, record)} key='修改'>修改</Button>
                                     <Button type='danger' className='btn-margin' title="取消"  key='取消' onClick={this.onClickDelete.bind(this, record)}>取消</Button>
                                 </span>)

                    }else{
                        return  <Button type='danger' className='btn-margin' title="取消"  key='取消' onClick={this.onClickDelete.bind(this, record)}>取消</Button>
                    }
                }

            }
       }
    ];

    var cs = Common.getGridMargin(this);
    var pag = {showQuickJumper: true, total:this.state.ManageOrderSet.totalRow, pageSize:this.state.ManageOrderSet.pageRow, current:this.state.ManageOrderSet.startPage,
      size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage,
      showTotal:this.showTotal,};
    var visible = (this.state.action === 'query') ? '' : 'none';
    var tablePage = (
        <div className='grid-page' style={{padding: cs.padding, display:visible}}>
          <div style={{margin: cs.margin}}>
            <ServiceMsg ref='mxgBox' svcList={['manageOrder/queryBySearchFilter', 'manageOrder/queryOrderDetail']}/>
            <Filter ref='filter' />
            <div className='toolbar-table'>
              <div style={{float:'left'}}>
                <Button icon={Common.iconSearch} type="primary" title="查询" onClick={this.handleQueryClickSearch}>查询</Button>
                <Button className='btn-margin' icon={Common.iconReset}  title="重置" onClick={this.reset} key='重置' >重置</Button>
                <ExportExcel module='orderManger' filter={this.getFilter()}/>
              </div>
              <div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
              </div>
            </div>
          </div>
          <div className='grid-body'>
            <Table scroll={{ x: 3500 }} columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
          </div>
            <DeleteOrderManagePage  ref="deleteWindow" ManageOrder={this.state.ManageOrder} />
        </div>
    );

    var formPage = null;
    if (this.state.action === 'update') {
      formPage = <OrderDetailPage onBack={this.onGoBack}  ManageOrder={this.state.ManageOrder}/>
    }

    return (
        <div style={{width: '100%',height:'100%'}} id={'orderManagePage'}>
          {tablePage}
          {formPage}
        </div>
    );
  }
});

module.exports = ManageOrderPage;