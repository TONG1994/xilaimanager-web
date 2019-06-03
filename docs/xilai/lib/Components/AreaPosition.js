/**
 *   Create by Malson on 2018/4/28
 */

import React from 'react';
import classNames from 'classnames';
import { Cascader } from 'antd';
/**
 *  props 传入onchange接受回调
*/
import CommonActions from '../../../lib/action/CommonActions';
import CommonStore from '../../../lib/data/CommonStore';
class AreaPosition extends React.Component{
  constructor(props){
    super(props);
    this.state={
      options:[]
    }
  }
  componentDidMount(){
    this.getAddressFun = CommonStore.listen(this.getAddress);
    if(window.sessionStorage.address){
      let options=[];
      try {
        options = JSON.parse(window.sessionStorage.address);
      }catch (err){}
      this.setState({options});
      return;
    }
    CommonActions.getAddress();
  }
  getAddress = (data)=>{
    if(data.operation==='getAddress'){
      let options = data.recordSet[0];
      this.setState({options});
      window.sessionStorage.address = JSON.stringify(options);
    }
  }
  componentWillUnmount(){
    this.getAddressFun();
  }
  render(){
    let val = this.props.value?this.props.value.split(','):'';
    let changeOnSelectFlag = this.props.changeOnSelect ? true : false;
    return(
        <Cascader
            options={this.state.options}
            value={val}
            onChange={this.props.onChange}
            placeholder="请选择地址" size='large'
            disabled = {this.props.disabled}
            changeOnSelect = {changeOnSelectFlag}
        />
    )
  }
}
export default AreaPosition;