import React from 'react';
import { Form,Col,Row,DatePicker,Input } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
import TradingFlowTypeSelect from './TradingFlowTypeSelect';
const {RangePicker } = DatePicker;
import moment from 'moment';
const FormItem = Form.Item;
let Filter = React.createClass({
  getInitialState: function () {
    return {
      hints: {},
      validRules: [],
      filter: {
        tradeFlowType:'',
        tradingTypeUuid:'',
        queryToTime:'',
        queryFromTime:'',
        payAccountNo:'',
        incomeAccountNo:''
      },
    }
  },

  mixins: [ModalForm('filter')],
  componentWillReceiveProps: function (newProps) {
   
  },
  componentDidMount: function () {
    this.state.validRules = [
      // { id: 'createDate', desc: '创建时间', required:false},
      { id: 'tradeFlowType', desc: '流水分类',required:false},
      { id: 'payAccountNo', desc: '支出ID或账户', max: 50,required:false},
      { id: 'incomeAccountNo', desc: '收入ID或账户', max: 50,required:false},
    ];
    this.clear();
  },
  
  clear:function(){
    this.state.hints = {};
    this.setState({filter:{
      tradeFlowType:'',
      tradingTypeUuid:'',
      queryToTime:'',
      queryFromTime:'',
      payAccountNo:'',
      incomeAccountNo:''
    }});
  },
  onChange:function(date, dateString){
    this.state.filter.queryToTime=dateString[1];
    this.state.filter.queryFromTime=dateString[0];
    this.setState({loading:false});
  },
  checkValue:function(){
    if(Common.validator(this,this.state.filter)){
      return true;
    }
    else{
      this.setState({
        loading:false
      });
      return false;
    }
  },
  handleOnTradeTypeSelected:function(data){
    this.setState({
      loading:false
    });
    this.state.filter.tradingTypeUuid = data.uuid==null ? '':data.uuid;
    this.state.filter.tradeFlowType=data.name==null ? '': data.name
  },
  disabledDate:function disabledDate(current) {
    return current && current > moment().endOf('day');
  },
  render: function () {
    let hints=this.state.hints;
    let layout='horizontal';
    let layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 8}),
      wrapperCol: ((layout=='vertical') ? null : {span: 16}),
    };
    const dateFormat='YYYY/MM/DD';
    let filter = this.state.filter;
    let startDate = filter.queryFromTime===''|| filter.queryFromTime==undefined ? undefined:moment(this.state.filter.queryFromTime, dateFormat);
    let endDate = filter.queryToTime===''|| filter.queryToTime==undefined ? undefined:moment(this.state.filter.queryToTime, dateFormat);
    return (
        <div className='filter-wrap'>
        <Form layout={layout} style={{width:'100%'}}>
  <Row  gutter={24}>
        <Col className="gutter-row" span={6}>
        <FormItem {...formItemLayout} className={layoutItem} label='创建时间' >
        <RangePicker name="createDate" id="createDate" onChange={this.onChange} value={[startDate, endDate]} disabledDate={this.disabledDate} />
    </FormItem>
    </Col>
    
    <Col className="gutter-row" span={6}>
        <FormItem {...formItemLayout} className={layoutItem} label='流水分类' >
        <TradingFlowTypeSelect   name="tradeFlowType" id="tradeFlowType" value={this.state.filter.tradeFlowType}  onSelect={this.handleOnTradeTypeSelected} />
    </FormItem>
    </Col>
    <Col className="gutter-row" span={6}>
        <FormItem {...formItemLayout} className={layoutItem} label='收入方'  required={false} colon={true} help={hints.incomeAccountNoHint} validateStatus={hints.incomeAccountNoStatus} >
        <Input type='text' placeholder='输入收入方机构ID或名称' id="incomeAccountNo" name="incomeAccountNo" value={this.state.filter.incomeAccountNo} onChange={this.handleOnChange}  />
    </FormItem>
    </Col>
        <Col className="gutter-row" span={6}>
        <FormItem {...formItemLayout} className={layoutItem} label='支出方' required={false} colon={true} help={hints.payAccountNoHint} validateStatus={hints.payAccountNoStatus} >
        <Input type='text'  placeholder="输入支出方机构ID或名称"  id="payAccountNo" name="payAccountNo" name="incomeAccountNo" value={this.state.filter.payAccountNo} onChange={this.handleOnChange} />
    </FormItem>
    </Col>
   
    </Row>
   
    </Form>
    </div>
  );
  }
});

module.exports = Filter;