import React from 'react';
import { Form } from 'antd';
import ModalForm from '../../../../lib/Components/ModalForm';
import Common from '../../../../public/script/common';
import Utils from '../../../../public/script/utils';
import FormDef from './StaffInfoForm';

var Filter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      filterManage: {},
    }
  },
  
  mixins: [ModalForm('filterManage')],
  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    this.clear();
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

  clear:function(){
    let filterData=this.state.filterManage;
    //清楚所有条件
    FormDef.initFilterForm(filterData);
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