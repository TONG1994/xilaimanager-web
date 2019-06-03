/**
 *   Create by Malson on 2018/5/3
 */

import React from 'react';
import classNames from 'classnames';

import { TimePicker ,message } from 'antd';
import moment from 'moment';

const format = 'HH:mm';


class BusinessTime extends React.Component{
  constructor(props){
    super(props);
    this.state={
      start:'',
      end:''
    }
  }
  componentDidMount(){
  }
  setTime = (type,val)=>{
    let time = '';
    let {start,end} = this.state,
        valNum = Number(val.replace(':','.'));
    if(!start && !end && this.props.type==='update'){
      start = this.props.value.split(',')[0];
      end = this.props.value.split(',')[1];
    }
    if(type==='1'){
      if(end){
        let endNum = Number(end.replace(':','.'));
        if(valNum>=endNum){
          message.destroy();
          message.warning('开始时间应小于结束时间');
          return;
        }
      }
      this.setState({start:val});
      time = val +','+ end;
    }else if(type==="2"){
      if(start){
        let startNum = Number(start.replace(':','.'));
        if(startNum>=valNum){
          message.destroy();
          message.warning('开始时间应小于结束时间');
          return;
        }
      }
      this.setState({end:val});
      time = start +','+ val;
    }
    this.props.onChange(time);
  }
  clear=()=>{
    this.setState({start:'', end:''});
  }
  render(){
    let value = this.props.value;
    let start,end,disable;
    if(value){
        start = value.split(',')[0]?moment(value.split(',')[0], format):moment('00:00', format),
        end = value.split(',')[1]?moment(value.split(',')[1], format):moment('00:00', format),
        disable = this.props.disabled;
    }
    return(
        <div>
          <TimePicker format={format} onChange={(time,val)=>{this.setTime('1',val)}} value={start} disabled={disable} />
          <span style={{margin:'0 10px'}}>~</span>
          <TimePicker format={format} onChange={(time,val)=>{this.setTime('2',val)}} value={end} disabled={disable} />
        </div>
    )
  }
}
export default BusinessTime;