/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form,Col,Row,DatePicker,Input,Select } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
var type = Common.getUserType();
let Filter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      filter: {
        orderStatus:'',
        merchantMsg:'',
        startTime:'',
        endTime:'',
        phoneNo:'',
      },
      //rangePicker:[undefined,undefined]
    }
  },

  mixins: [ModalForm('filter', true)],

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = [
      { id: 'orderStatus', desc: '订单状态', max: 7,},
      { id: 'merchantMsg', desc: '订购人信息', max: 20,},
      { id: 'phoneNo', desc: '联系人电话', max: 11,dataType:'mobile',},
    ];
      this.clear();
      var defualtEnd = Utils.getDefualtEnd();
      var defualtStart = Utils.getDefualtStart();
      this.state.filter.startTime = defualtStart;
      this.state.filter.endTime = defualtEnd;
    },
    componentWillReceiveProps: function (newProps) {
        this.setState({
            modal: newProps.moreFilter,
        });
    },

  clear:function(){
    this.state.loading = false;
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
  },
  onChange:function(date, dateString){
    this.state.filter.startTime=dateString[0];
    this.state.filter.endTime=dateString[1];
    this.setState({loading:false});
  },
  reset:function(){
    this.state.filter.startTime='';
    this.state.filter.endTime='';
    this.state.filter.orderStatus="";

    this.setState({filter:{}});
  },
  disabledDate:function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  },
  handleChange:function(value) {
    this.state.filter.orderStatus = value;
    let filter=this.state.filter;
    this.setState({
      filter:filter
    })
  },

  render: function () {
    let hints=this.state.hints;
    let layout='horizontal';
    let layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };
    const formItemLayout2 = {
      labelCol: ((layout == 'vertical') ? null : { span: 8 }),
      wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
    };
    const dateFormat='YYYY/MM/DD';
    let filter = this.state.filter;
    let startDate = filter.startTime===''|| filter.startTime==undefined ? undefined:moment(this.state.filter.startTime, dateFormat);
    let endDate = filter.endTime===''|| filter.endTime==undefined ? undefined:moment(this.state.filter.endTime, dateFormat);
    return (
        <div className='filter-wrap'>
          <Form layout={layout} style={{width:'100%'}}>
            <Row  gutter={24}>
              <Col className="gutter-row" span={6}>

                <FormItem {...formItemLayout2} className={layoutItem} label='订单状态'  help={hints.orderStatusHint} validateStatus={hints.orderStatusStatus}>
                  <Select
                    value={this.state.filter.orderStatus}
                    style={{ width: 200 }}
                    placeholder="--"
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value="">--</Option>
                    <Option value="TO_DO">未实施</Option>
                    <Option value="DOING">实施中</Option>
                    <Option value="TO_CONFIRM">待商户确认</Option>
                    <Option value="DONE">已完成</Option>
                    <Option value="MERCHANT_REJECTED">商户已回绝</Option>
                    <Option value="MERCHANT_CANCELLED">商户已取消</Option>
                    <Option value="ISV_REJECTED">服务商已回绝</Option>
                    <Option value="ISV_CANCELLED">服务商已取消</Option>
                </Select>
                </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='订购人信息'  help={hints.merchantMsgHint} validateStatus={hints.merchantMsgStatus}>
                  <Input placeholder="输入订购人信息" type='text' name='' id='merchantMsg' value={this.state.filter.merchantMsg} onChange={this.handleOnChange} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='订购时间' >
                  <RangePicker disabledDate={this.disabledDate} value={[startDate, endDate]} defaultValue={[startDate,endDate]}  onChange={this.onChange} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                  <FormItem {...formItemLayout2} className={layoutItem} label='联系人电话'  help={hints.phoneNoHint} validateStatus={hints.phoneNoStatus}>
                      <Input placeholder="输入联系人电话" type='text' name='phoneNo' id='phoneNo' value={this.state.filter.phoneNo} onChange={this.handleOnChange} />
                  </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
    );
  }
});

module.exports = Filter;