import React from 'react';
import { Form } from 'antd';
import ModalForm from '../../../../lib/Components/ModalForm';
import Common from '../../../../public/script/common';
import Utils from '../../../../public/script/utils';
import FormDef from './AlipayDeliveryOrderForm';
import moment from 'moment';

var Filter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      filterManage: {

      },
      loading:false
    }
  },
  
  mixins: [ModalForm('filterManage')],
  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    this.clear();
    var defualtEnd = Utils.getDefualtEnd();
    var defualtStart = Utils.getDefualtStart();
    this.state.filterManage.creatorTimeAfter = defualtStart;
    this.state.filterManage.creatorTimeBefore = defualtEnd;
  },

  getFilter:function () {
    if(Common.validator(this,this.state.filterManage)){
      let obj = Object.assign({},this.state.filterManage);
      return obj;
    }
  },

  componentWillReceiveProps: function (newProps) {
    this.setState({
        modal: newProps.moreFilter,
    });
  },

  onChange:function(date, dateString){
    this.state.filterManage.creatorTimeAfter=dateString[0];
    this.state.filterManage.creatorTimeBefore=dateString[1];
    this.setState({loading:false});
  },

  disabledDate:function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  },

  clear:function(){
    let filterData=this.state.filterManage;
    //清楚所有条件
    FormDef.initFilterForm(filterData);
    filterData.creatorTimeAfter='';
    filterData.creatorTimeBefore='';
    // 检测输出
    Common.validator(this,this.state.filterManage);
  },
  
  render: function () {
    var  layout = 'horizontal';
    let  attrList = null
    let  items  = FormDef.getFilterForm(this, this.state.filterManage, attrList);
    return (
        <div className='filter-wrap'>
          <Form layout={layout}>
            { items }
          </Form>
        </div>
    );
  }
});

module.exports = Filter;