import {  Select ,Input } from 'antd';
import React from 'react';
var Common = require('../../../../public/script/common');

var OrgIdTagSelect= React.createClass({

  getInitialState : function() {
    return {
      value: "",
      type:'',
      inValue:''
    };
  },

  setValue: function(upValue,type){
    this.setState({
      type:type,
      value:upValue
    })
  },

  handleChange: function(value) {
    this.setState({ value:value });
    if(value !== '0'){
      if(this.props.onSelected){
        this.props.onSelected(value);
      }
     }else{
      if(this.props.onSelected){
        this.props.onSelected(null);
      }
     }  
  },


  render:function(){
    const Option = Select.Option;

    let Inpu = (this.state.type!=="view"? 
        <Select
            showSearch
            onChange={this.handleChange}
            size='large'
            value={this.state.value}
        >
            <Option value="0">-请选择-</Option>
            <Option value="1">站长</Option>
            <Option value="2">员工</Option>
        </Select>
        :
        <Input type='text' name="orgName" id="orgName" value={this.state.value} disabled />
    );
    return(
      <div>
        {Inpu}
      </div>
    );
  }

});
module.exports = OrgIdTagSelect;