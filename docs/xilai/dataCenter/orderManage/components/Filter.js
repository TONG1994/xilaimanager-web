/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form,Col,Row,DatePicker,Input } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
import moment from 'moment';
import LogisticsCompanySelect from '../../../lib/Components/logisticsCompany/LogisticsCompanySelect';
import OrgBranchSelect from './OrgBranchSelect';
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
        logisticsCompanyUuid:'',
        orderSource:'',
        orderStatus:'',
        createTimeFrom:'',
        createTimeTo:'',
        payStatus:'',
        senderPhone:'',
        organizationNo:'',
          orgType:''
      },
      //rangePicker:[undefined,undefined]
    }
  },

  mixins: [ModalForm('filter', true)],

  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = [
      { id: 'orderNo', desc: '订单号', max: 50,},
      { id: 'orgNo', desc: '机构ID', max: 50,},
      { id: 'orgName', desc: '机构名称', max: 100,},
      { id: 'organizationNo', desc: '机构名称', max: 100,},
      { id: 'courierNo', desc: '快递员ID', max: 50,},
      { id: 'courierName', desc: '快递员姓名', max: 50,},
      { id: 'xlLogisticsNo', desc: '喜来单号', max: 50,},
      { id: 'logisticsNo', desc: '快递单号', max: 50,},
      { id: 'logisticsCompanyName', desc: '快递公司', max: 50,},
      { id: 'orderStatus', desc: '运单状态', max: 3,},
      { id: 'payStatus', desc: '支付状态', max: 3,},
      { id: 'senderPhone', desc: '发件人电话', max: 11,dataType:'mobile',},
    ];
      this.clear();
      var defualtEnd = Utils.getDefualtEnd();
      var defualtStart = Utils.getDefualtStart();
      this.state.filter.createTimeFrom = defualtStart;
      this.state.filter.createTimeTo = defualtEnd;
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
    this.state.filter.createTimeFrom=dateString[0];
    this.state.filter.createTimeTo=dateString[1];
    this.setState({loading:false});
  },
  reset:function(){
    this.state.filter.createTimeFrom='';
    this.state.filter.createTimeTo='';
    this.state.filter.organizationNo='';
    if(type==1 || type==2){
        this.refs.orgBranch.state.value = '';
    }
    this.setState({filter:{}});
  },
  disabledDate:function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  },
  handleOrganizationNo:function(organizationNo,orgType){
      this.state.filter.organizationNo = organizationNo;
      this.state.filter.orgType = orgType;
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
    let startDate = filter.createTimeFrom===''|| filter.createTimeFrom==undefined ? undefined:moment(this.state.filter.createTimeFrom, dateFormat);
    let endDate = filter.createTimeTo===''|| filter.createTimeTo==undefined ? undefined:moment(this.state.filter.createTimeTo, dateFormat);
    return (
        <div className='filter-wrap'>
          <Form layout={layout} style={{width:'100%'}}>
            <Row  gutter={24}>
              <Col className="gutter-row" span={6}>
               {/* <FormItem {...formItemLayout2} className={layoutItem} label='时间类型' >
                  <DictSelect name='queryTimeType' id='queryTimeType'  value={this.state.filter.queryTimeType} appName='喜来快递' optName='查询时间类型'  onSelect={this.handleOnSelected.bind(this, 'queryTimeType')}/>
                </FormItem>*/}
                <FormItem {...formItemLayout2} className={layoutItem} label='订单来源' >
                <DictSelect name='orderSource' id='orderSource'  value={this.state.filter.orderSource} appName='喜来快递' optName='订单来源'  onSelect={this.handleOnSelected.bind(this, 'orderSource')}/>
                </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='下单时间' >
                  <RangePicker disabledDate={this.disabledDate} value={[startDate, endDate]} defaultValue={[startDate,endDate]}  onChange={this.onChange} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                  <FormItem {...formItemLayout2} className={layoutItem} label='快递单号'  help={hints.logisticsNoHint} validateStatus={hints.logisticsNoStatus}>
                      <Input placeholder="输入快递单号" type='text' name='logisticsNoLike' id='logisticsNoLike' value={this.state.filter.logisticsNoLike} onChange={this.handleOnChange} />
                  </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='快递员'  help={hints.orgLikeNameHint} validateStatus={hints.orgLikeStatus}>
                  <Input placeholder="输入快递员姓名" type='text' name='courierLike' id='courierLike' value={this.state.filter.courierLike} onChange={this.handleOnChange} />
                </FormItem>
              </Col>
            </Row>
            <Row  gutter={24}>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='订单状态'  help={hints.orderStatusHint} validateStatus={hints.orderStatusStatus}>
                  <DictSelect name='orderStatus' id='orderStatus'  value={this.state.filter.orderStatus} appName='喜来快递' optName='订单状态'  onSelect={this.handleOnSelected.bind(this, 'orderStatus')}/>
                </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='快递公司' >
                  <LogisticsCompanySelect  name="logisticsCompanyUuid" id="logisticsCompanyUuid" value={this.state.filter.logisticsCompanyUuid}    onSelect={this.handleOnSelected.bind(this, 'logisticsCompanyUuid')} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='喜来单号'  help={hints.xlLogisticsNoHint} validateStatus={hints.xlLogisticsNoStatus}>
                  <Input  placeholder="输入喜来单号" type='text' name='xlLogisticsNoLike' id='xlLogisticsNoLike' value={this.state.filter.xlLogisticsNoLike} onChange={this.handleOnChange} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='订单号'  help={hints.orderNoHint} validateStatus={hints.orderNoStatus}>
                  <Input   placeholder="输入订单号" type='text' name='orderNoLike' id='orderNoLike' value={this.state.filter.orderNoLike} onChange={this.handleOnChange} />
                </FormItem>
              </Col>
            </Row>
            <Row  gutter={24}>
              {
                // Common.getUserType()==3?'':(<Col className="gutter-row" span={6}>
                //   <FormItem {...formItemLayout2} className={layoutItem} label='机构名称'  help={hints.orgLikeHint} validateStatus={hints.orgLikeStatus}>
                //       <Input placeholder="输入机构名称" type='text' name='orgLike' id='orgLike' value={this.state.filter.orgLike} onChange={this.handleOnChange} />
                //   </FormItem>
                // </Col>)
                  Common.getUserType()==3?'':(<Col className="gutter-row" span={6}>
                      <FormItem {...formItemLayout2} className={layoutItem} label='机构名称'  help={hints.organizationNoHint} validateStatus={hints.organizationNoStatus}>
                          <OrgBranchSelect
                              name="organizationNo"
                              id="organizationNo"
                              organizationNo={this.handleOrganizationNo}
                              ref='orgBranch'
                              value={this.state.filter.organizationNo}
                          />
                      </FormItem >
                  </Col>)
              }
              <Col className="gutter-row" span={6}>
                  <FormItem {...formItemLayout2} className={layoutItem} label='支付状态'  help={hints.payStatusHint} validateStatus={hints.payStatusStatus}>
                      <DictSelect name='payStatus' id='payStatus'  value={this.state.filter.payStatus} appName='喜来快递' optName='支付状态'  onSelect={this.handleOnSelected.bind(this, 'payStatus')}/>
                  </FormItem>
              </Col>
            <Col className="gutter-row" span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='发件人电话'  help={hints.senderPhoneHint} validateStatus={hints.senderPhoneStatus}>
                    <Input placeholder="输入发件人电话" type='text' name='senderPhone' id='senderPhone' value={this.state.filter.senderPhone} onChange={this.handleOnChange} />
                </FormItem>
            </Col>
            </Row>
          </Form>
        </div>
    );
  }
});

module.exports = Filter;