/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form,Col,Row,DatePicker,Input } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
import moment from 'moment';
let Filter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      filter: {

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

    this.state.loading = false;
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      this.refs.mxgBox.clear();
    }
  },
  onChange:function(date, dateString){

    //this.setState({dateRange:dateString});
    this.state.filter.queryFromTime=dateString[0];
    this.state.filter.queryToTime=dateString[1];
    this.setState({loading:false});
  },
  reset:function(){
    this.state.filter.queryFromTime='';
    this.state.filter.queryToTime='';

    this.setState({filter:{}});

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

    const dateFormat='YYYY/MM/DD';
    let filter = this.state.filter;
    let startDate = filter.queryFromTime===''|| filter.queryFromTime==undefined ? undefined:moment(this.state.filter.queryFromTime, dateFormat);
    let endDate = filter.queryToTime===''|| filter.queryToTime==undefined ? undefined:moment(this.state.filter.queryToTime, dateFormat);

    return (
        <div className='filter-wrap'>
          <Form layout={layout} style={{width:'100%'}}>
            <Row  gutter={24}>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='账单日期' >
                  <RangePicker disabledDate={this.disabledDate} value={[startDate,endDate]} onChange={this.onChange} />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
    );
  }
});

module.exports = Filter;