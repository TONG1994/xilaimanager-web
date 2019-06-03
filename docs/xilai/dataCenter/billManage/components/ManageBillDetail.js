import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col,Divider,Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import ExportExcel from '../../../lib/Components/ExportExcel'
let arr=[];
for(let i=0;i<12;i++){
  arr.push({uuid:i*10,billNo:i});
}
var ManageBillStore = require('../data/ManageBillStore');
var ManageBillActions = require('../action/ManageBillActions');
import TableInfo from './TableInfo';
import MiddleInfo from './MiddleInfo';
let type = Common.getUserType();
var pageRows = 10;
var UpdateManageOrderPage = React.createClass({
  getInitialState : function() {
    return {
      ManageBillDetailSet: {
        resBillDetailList:{
          list:[],
          startPage : 1,
          pageRow : 10,
          totalRow : 0,
          errMsg : ''
        },

      },
      loading: false,
      ManageBill: {},
      hints: {},
      validRules: [],
      data:[],
      billDetail:[],
      orderNumber:{
        center:[{title:'服务站预计分成金额（元）',content:''},{title:'经营中心预计分成金额（元）',content:''},{title:'手续费预计金额（元）',content:''},{title:'全部订单数量',content:''},{title:'承担手续费订单数量',content:''}],
        headQuarters:[{title:'服务站预计分成金额（元）',content:''},{title:'经营中心预计分成金额（元）',content:''},{title:'快递公司预计分成金额（元）',content:''},{title:'总部预计分成金额（元）',content:''},{title:'手续费预计金额（元）',content:''},{title:'全部订单数量',content:''},{title:'承担手续费订单数量',content:''}],
        dot:[{title:'预计分成金额（元）',content:''},{title:'全部订单数量',content:''}]
      },
      profit:''
    }
  },

  mixins: [Reflux.listenTo(ManageBillStore, "onServiceComplete"), ModalForm('ManageBill')],
  onServiceComplete: function(data) {
    let profit=[];
    let orderNumber=this.state.orderNumber;
    let centerArr=[data.billDetail.branchProfitAmount,data.billDetail.businesscenterProfitAmount,data.billDetail.chargeProfitAmount,data.billDetail.totalOrderNum,data.billDetail.totalChargeNum];
    let headQuartersArr=[data.billDetail.branchProfitAmount,data.billDetail.businesscenterProfitAmount,data.billDetail.thirdpartyProfitAmount,data.billDetail.headProfitAmount,data.billDetail.chargeProfitAmount,data.billDetail.totalOrderNum,data.billDetail.totalChargeNum];
    let dotArr=[data.billDetail.branchProfitAmount,data.billDetail.totalOrderNum];
    if(data.operation === 'retrieve'){
      if( data.errMsg === ''){
        // 成功，关闭窗口

        if(type==1){
          profit=orderNumber.headQuarters;
          for(let i=0;i<headQuartersArr.length;i++){
            profit[i].content=headQuartersArr[i];
          }
        }
        else if(type==2){
          profit=orderNumber.center;
          for(let i=0;i<centerArr.length;i++){
            profit[i].content=centerArr[i];
          }
        }
        else{
          profit=orderNumber.dot;
          for(let i=0;i<dotArr.length;i++){
              profit[i].content=dotArr[i];
          }
        }



        this.setState({
          ManageBillDetailSet:data.billDetail,
          profit,
          loading:false
        })
      }
      else{
        // 失败
        this.setState({
          loading: false,
          ManageOrderSet: data
        });
      }
    }
  },
  componentWillMount:function(){
    let orderNumber=this.state.orderNumber;
    let profit=this.state.profit;
    if(type==1){
      profit=orderNumber.headQuarters;
    }
    else if(type==2){
      profit=orderNumber.center;
    }
    else{
      profit=orderNumber.dot;
    }

    this.setState({profit});
  },
  // 第一次加载
  componentDidMount : function(){
    const ManageBill=this.props.ManageBill;
    let titleArr=['机构编号：','机构名称：','账单编号：','生成日期：'];
    let content=[ManageBill.orgNo,ManageBill.orgName,ManageBill.billNo,ManageBill.billDate];
    let billDetail=[];
    for(let i=0;i<4;i++){
      billDetail.push({title:titleArr[i],content:content[i]})
    }

    this.setState({billDetail});
    this.handleQueryClick();

  },

  handleQueryClick : function() {
    const ManageBill=this.props.ManageBill;
    let filter={};
    filter.billUuid=ManageBill.uuid;
    this.setState({loading:true});
    ManageBillActions.getBillDetailPage(filter,this.state.ManageBillDetailSet.resBillDetailList.startPage,pageRows);
  },


  goBack:function(){
    this.props.onBack();
  },

  onTabChange:function(activeKey){
    if(activeKey === '1'){
      this.props.onBack();
    }
  },
  getFilter:function(){
    let obj = {};
    obj.billUuid=this.props.ManageBill.uuid;
    return obj;
  },
  onShowSizeChange: function(current, pageSize){
    pageRows = pageSize;
    this.handleQueryClick();
  },
  onChangePage: function(pageNumber){
    this.state.ManageBillDetailSet.resBillDetailList.startPage = pageNumber;
    this.handleQueryClick();
  },
  showTotal:function(total) {
    return `总共 ${total} 条`;
  },
  render : function() {
    let recordSet = this.state.ManageBillDetailSet.resBillDetailList.list;
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };
    const formItemLayout2 = {
      labelCol: ((layout == 'vertical') ? null : { span: 8 }),
      wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
    };
    let columns=[];
    if(type==1){
      columns = [
        {
          title: '关联订单号',
          dataIndex: 'orderNo',
          key: 'orderNo',
          width: 180
        },
        {
          title: '快递公司',
          dataIndex: 'logisticsCompanyName',
          key: 'logisticsCompanyName',
          width: 100
        },
        {
          title: '快递员ID',
          dataIndex: 'courierNo',
          key: 'courierNo',
          width: 100
        },
        {
          title: '快递员姓名',
          dataIndex: 'courierName',
          key: 'courierName',
          width: 100
        },
        {
          title: '订单金额',
          dataIndex: 'orderAmount',
          key: 'orderAmount',
          width: 100
        },
        {
          title: '服务站预计分成金额',
          dataIndex: 'branchProfitAmount',
          key: 'branchProfitAmount',
          width: 180,
        },
        {
          title: '经营中心预计分成金额',
          dataIndex: 'businesscenterProfitAmount',
          key: 'businesscenterProfitAmount',
          width: 180,
        },
        {
          title: '快递公司预计分成金额',
          dataIndex: 'thirdpartyProfitAmount',
          key: 'thirdpartyProfitAmount',
          width: 180,
        },
        {
          title: '总部预计分成金额',
          dataIndex: 'headProfitAmount',
          key: 'headProfitAmount',
          width: 180,
        },
        {
            title: '手续费预计金额',
            dataIndex: 'chargeProfitAmount',
            key: 'chargeProfitAmount',
            width: 180,
        }
      ];
    }
    else if(type==2){
      columns = [
        {
          title: '关联订单号',
          dataIndex: 'orderNo',
          key: 'orderNo',
          width: 180
        },
        {
          title: '快递公司',
          dataIndex: 'logisticsCompanyName',
          key: 'logisticsCompanyName',
          width: 100
        },
        {
          title: '快递员ID',
          dataIndex: 'courierNo',
          key: 'courierNo',
          width: 100
        },
        {
          title: '快递员姓名',
          dataIndex: 'courierName',
          key: 'courierName',
          width: 100
        },
        {
          title: '订单金额',
          dataIndex: 'orderAmount',
          key: 'orderAmount',
          width: 100
        },
        {
          title: '服务站预计分成金额',
          dataIndex: 'branchProfitAmount',
          key: 'branchProfitAmount',
          width: 180,
        },
        {
          title: '总部预计分成金额',
          dataIndex: 'headProfitAmount',
          key: 'headProfitAmount',
          width: 180,

        },
        {
          title: '快递公司预计分成金额',
          dataIndex: 'thirdpartyProfitAmount',
          key: 'thirdpartyProfitAmount',
          width: 180,
        },
        {
          title: '经营中心预计分成金额',
          dataIndex: 'businesscenterProfitAmount',
          key: 'businesscenterProfitAmount',
          width: 180,
        },
        {
            title: '手续费预计金额',
            dataIndex: 'chargeProfitAmount',
            key: 'chargeProfitAmount',
            width: 180,
        }
      ];
    }
    else if(type==3){
      columns = [
        {
          title: '关联订单号',
          dataIndex: 'orderNo',
          key: 'orderNo',
          width: 180
        },
        {
          title: '快递公司',
          dataIndex: 'logisticsCompanyName',
          key: 'logisticsCompanyName',
          width: 100
        },
        {
          title: '快递员ID',
          dataIndex: 'courierNo',
          key: 'courierNo',
          width: 100
        },
        {
          title: '快递员姓名',
          dataIndex: 'courierName',
          key: 'courierName',
          width: 100
        },
        {
          title: '订单金额',
          dataIndex: 'orderAmount',
          key: 'orderAmount',
          width: 100
        },
        {
          title: '服务站预计分成金额',
          dataIndex: 'branchProfitAmount',
          key: 'branchProfitAmount',
          width: 180,

        },
      ];
    }
    let pag = {showQuickJumper: true, total:this.state.ManageBillDetailSet.resBillDetailList.totalRow, pageSize:this.state.ManageBillDetailSet.resBillDetailList.pageRow, current:this.state.ManageBillDetailSet.resBillDetailList.startPage,
      size:'large', showSizeChanger:true, onShowSizeChange:this.onShowSizeChange, onChange: this.onChangePage,showTotal:this.showTotal};
    var hints=this.state.hints;
      var cs = Common.getGridMargin(this);
    return (
      <div className='grid-page' style={{padding: cs.padding}}>
        <div style={{margin: cs.margin}}>
          <Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
            <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
            </TabPane>
            <TabPane tab="账单详情" key="2" style={{width: '100%', height: '100%'}}>
              <div style={{padding:"24px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                <ServiceMsg ref='mxgBox' svcList={['manageOrder/queryOrderDetail']}/>
                <Form layout={layout} style={{width:'98%'}}>
                  <Row gutter={24} style={{marginLeft:12}}>
                    <Col span={24}>
                      <FormItem {...formItemLayout} key='orgType' label=''  className={layoutItem} >
                      <TableInfo data={this.state.billDetail}  color={true}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={24} style={{marginLeft:12}}>
                    <Col span={24}>
                      <FormItem {...formItemLayout} key='orgType' label=''  className={layoutItem} >
                      <MiddleInfo data={this.state.profit} color={false}/>
                      </FormItem>
                    </Col>
                  </Row>
                  <div className='toolbar-table'>
                    <div style={{float:'left'}}>
                      <ExportExcel module='billDetail' filter={this.getFilter()}/>
                    </div>
                  </div>
                </Form>
                <div className='grid-body'>
                  <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={pag} size="middle" bordered={Common.tableBorder}/>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
});

export default UpdateManageOrderPage;