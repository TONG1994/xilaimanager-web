import React from 'react';
import {Radio } from 'antd';
const RadioGroup = Radio.Group;

class PrioritySelect extends React.Component{
  constructor(){
    super();
    this.state={
      value: 1,
    }
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
    if(this.props.onChange){
      this.props.onChange(e.target.value);
    }
  }

  render(){
    const {onChange,...attrs} = this.props;
    return (
      <RadioGroup onChange={this.onChange} value={this.state.value} {...attrs}>
        <Radio value="3">一般</Radio>
        <Radio value="2">紧急</Radio>
        <Radio value="1">非常紧急</Radio>
      </RadioGroup>
    )
    }

}
export default PrioritySelect;