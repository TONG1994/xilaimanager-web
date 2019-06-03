/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form,DatePicker } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import Common from '../../../../public/script/common';
let FormDef = require('./OperateLogForm');
const {RangePicker } = DatePicker;
import moment from 'moment';

var TransactionLogFilter = React.createClass({
  getInitialState: function () {
    return {
      // modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      operateLogInfo: {
          fromDate:'',
          toDate:''
      },
    }
  },
  
  mixins: [ModalForm('operateLogInfo')],
  
  getFilter:function () {
    if(Common.validator(this,this.state.operateLogInfo)){
      let obj = Object.assign(this.state.operateLogInfo);
      return obj;
    }
  },
  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    this.clear();
  },
  clear:function(){
    this.state.operateLogInfo.fromDate = '';
    this.state.operateLogInfo.toDate = '';
    FormDef.initFilterForm(this.state.operateLogInfo);
    Common.validator(this,this.state.operateLogInfo);
  },

    onChange:function(date,dateString){
        this.state.operateLogInfo.fromDate=dateString[0];
        this.state.operateLogInfo.toDate=dateString[1];
        this.setState({loading:false});
    },

    disabledDate:function disabledDate(current) {
        return current && current > moment().endOf('day');
    },
  
  render: function () {
    var layout = 'horizontal';

      const dateFormat='YYYY/MM/DD';
      let filter = this.state.operateLogInfo;
      let startDate = filter.fromDate===''|| filter.fromDate==undefined ? undefined:moment(this.state.operateLogInfo.fromDate, dateFormat);
      let endDate = filter.toDate===''|| filter.toDate==undefined ? undefined:moment(this.state.operateLogInfo.toDate, dateFormat);

      let  attrList = [
          {
              name:'name',
              id:'name',
              object:<RangePicker disabledDate={this.disabledDate}  value={[startDate, endDate]} onChange={this.onChange} />
          },
      ];
    let  items  = FormDef.getFilterForm(this, this.state.operateLogInfo, attrList);

      return (
        <div className='filter-wrap'>
          <Form layout={layout}>
            { items }
          </Form>
        </div>
    );
  }
});

module.exports = TransactionLogFilter;