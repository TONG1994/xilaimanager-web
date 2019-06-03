import React from 'react';
import {Select} from 'antd';
const Option=Select.Option;

class WorksheetStatusSelect extends React.Component{
  constructor(){
    super();
    this.state={
      loading:false,
      value: ""
    }
  }

  handleChange=(value)=>{
    this.setState({ value:value });
    if(this.props.onChange){
      this.props.onChange(value);
    }
  }

  clear=()=>{
    this.setState({ value:'' })
  }

  render(){
    const {onChange,...attrs}=this.props;
    let selectBox=<Select
                onChange={this.handleChange}
                value={this.state.value}
                {...attrs}
            >
                <Option value="">-请选择-</Option>
                <Option value="1">受理中</Option>
                <Option value="2">已处理</Option>
                <Option value="3">已关闭</Option>
            </Select>
      return (
        <div>
          {selectBox}
        </div>
      )
    }
}
export default WorksheetStatusSelect;