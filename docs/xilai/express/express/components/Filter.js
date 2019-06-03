/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form,Col,Row,DatePicker } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
import moment from 'moment';
import LogisticsCompanySelect from '../../../lib/Components/logisticsCompany/LogisticsCompanySelect';
let ExpressFilter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      filter: {
        logisticsCompanyUuid:''
      },
    }
  },

  mixins: [ModalForm('filter', true)],
  componentWillReceiveProps: function (newProps) {
    this.setState({
      modal: newProps.moreFilter,
    });
  },

  // 第一次加载
  componentDidMount: function () {
    this.clear();
  },
  clear:function(){
    this.forceUpdate();
  },
  onChange:function(date, dateString){

    this.state.filter.createTimeFrom=dateString[0];
    this.state.filter.createTimeTo=dateString[1];
    //this.state.filter.orderStatus=4;
    this.setState({loading:false});
  },
  disabledDate:function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
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
    return (
        <div className='filter-wrap'>
          <Form layout={layout} style={{width:'100%'}}>
            <Row  gutter={24}>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='下单时间' >
                  <RangePicker disabledDate={this.disabledDate}  onChange={this.onChange} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='快递公司' >
                  <LogisticsCompanySelect style={{width:'100%'}} name="logisticsCompanyUuid" id="logisticsCompanyUuid" value={this.state.filter.logisticsCompanyUuid}    onSelect={this.handleOnSelected.bind(this, 'logisticsCompanyUuid')} />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
  );
  }
});

module.exports = ExpressFilter;