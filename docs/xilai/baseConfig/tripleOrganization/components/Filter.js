/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import Common from '../../../../public/script/common';
let FormDef = require('./TripleOrganizationForm');
var Filter = React.createClass({
  getInitialState: function () {
    return {
      // modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      filterInfo: {},
      dataSource:[]
    }
  },
  
  mixins: [ModalForm('filterInfo')],
  
  getFilter:function () {
    if(Common.validator(this,this.state.filterInfo)){
      let obj = Object.assign(this.state.filterInfo);
      return obj;
    }
  },
  setDataSource:function (dataSource) {
    this.setState({dataSource});
  },
  // 第一次加载
  componentDidMount: function () {
    this.tripleNames.doServer();
    this.state.validRules = FormDef.getFilterFormRule(this);
    this.clear();
  },
  clear:function(){
    FormDef.initFilterForm(this.state.filterInfo);
    if(this.OrgNamesFilter){
      this.OrgNamesFilter.setState({dataSource:[],value:''})
    }
    Common.validator(this,this.state.filterInfo);
  },
  
  render: function () {
    var layout = 'horizontal';
    let  attrList = null;
    let  items  = FormDef.getFilterForm(this, this.state.filterInfo, attrList);
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