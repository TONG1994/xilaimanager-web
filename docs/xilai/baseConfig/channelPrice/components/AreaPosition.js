/**
 *   Create by Malson on 2018/4/28
 */

import React from 'react';
import classNames from 'classnames';
import { Cascader } from 'antd';
/**
 *  props 传入onchange接受回调
*/
import CommonActions from '../action/ChannelPriceActions';
import CommonStore from '../data/ChannelPriceStore';
class AreaPosition extends React.Component{
  constructor(props){
    super(props);
    this.state={
      options:[],
      newOptions:[],
    }
  }
  componentDidMount(){
    this.getAddressFun = CommonStore.listen(this.getAddress);
    if(window.sessionStorage.newaddress){
      let options=[];
      try {
        options = JSON.parse(window.sessionStorage.newaddress);
      }catch (err){}
        var newOptions = [];
        options.map((item,index)=>{
            if(item.children!==null){
                newOptions.push(item);
            }
        });
        newOptions.map((item,index)=>{
        if(item.children){
            item.children.map((data)=>{
                if(data.children){
                    delete data.children;
                }
            });
        }
      });
      this.setState({newOptions});
      return;
    }
    CommonActions.getAddress();
  }
  getAddress = (data)=>{
    if(data.operation==='getAddress'){
      let options = data.recordSet[0];
        var newOptions = [];
        options.map((item,index)=>{
            if(item.children!==null){
                newOptions.push(item);
            }
        });
        newOptions.map((item,index)=>{
          if(item.children){
              item.children.map((data)=>{
                  if(data.children){
                      delete data.children;
                  }
              });
          }
      });
      this.setState({newOptions});
      window.sessionStorage.newaddress = JSON.stringify(options);
    }
  }
  componentWillUnmount(){
    this.getAddressFun();
  }
  render(){
    let val = this.props.value?this.props.value.split(','):'';
    return(
        <Cascader
            options={this.state.newOptions}
            value={val}
            onChange={this.props.onChange}
            placeholder="请选择地址" size='large'
            disabled = {this.props.disabled}
        />
    )
  }
}
export default AreaPosition;