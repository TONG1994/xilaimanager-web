import React from 'react';
import { Form } from 'antd';
import Common from '../../../../public/script/common';
import WorksheetStatusSelect from './WorksheetStatusSelect';
import SearchByPrioritySelect from './SearchByPrioritySelect';
import AsssigneeSelect from './AsssigneeSelect';
let FormDef = require('./WorksheetManagementForm');
var AddressFilter = React.createClass({
  getInitialState: function () {
    return {
      hints: {},
      validRules: [],
      filterInfo: {
      },
    }
  },
  
  getFilter:function () {
    if(Common.validator(this,this.state.filterInfo)){
      let obj = Object.assign(this.state.filterInfo);
      return obj;
    }
  },
  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    this.clear();
  },

  clear:function(){
    FormDef.initFilterForm(this.state.filterInfo);
    Common.validator(this,this.state.filterInfo);
    if(this.WorksheetStatusSelect){
      this.WorksheetStatusSelect.clear();
    }
    if(this.SearchByPrioritySelect){
      this.SearchByPrioritySelect.clear();
    }
    if(this.AsssigneeSelect){
      this.AsssigneeSelect.clear();
    }
  },
  
  handleChange:function(value){
    this.state.filterInfo.status=value;
    Common.validator(this,this.state.filterInfo);
    this.setState({ loading : false})
  },
  getPriorityVal:function(value){
    this.state.filterInfo.level=value;
    Common.validator(this,this.state.filterInfo);
    this.setState({ loading : false})
  },
  getAcceptMan:function(value){
    this.state.filterInfo.acceptMan=value;
    Common.validator(this,this.state.filterInfo);
    this.setState({ loading : false})
  },

  render: function () {
    var layout = 'horizontal';
    let allowClearFlag = this.state.filterInfo.acceptMan ? true : false;
    let  attrList = [
      {
        id:'status',
        name:'status',
        object: <WorksheetStatusSelect 
            ref={ref=>this.WorksheetStatusSelect=ref}
            id="status"
            name="status"
            onChange={this.handleChange}
          />
      },
      {
        id:'level',
        name:'level',
        object: <SearchByPrioritySelect 
            ref={ref=>this.SearchByPrioritySelect=ref}
            id="level"
            name="level"
            onChange={this.getPriorityVal}
          />
      },
      {
        id:'acceptMan',
        name:'acceptMan',
        object: <AsssigneeSelect
            ref={ref=>this.AsssigneeSelect=ref}
            id="acceptMan"
            name="acceptMan"
            onChange={this.getAcceptMan}
            allowClear={allowClearFlag}
          />
      }
    ];
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

module.exports = AddressFilter;