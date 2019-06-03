/**
 *   Create by Malson on 2018/4/28
 */

import React from 'react';
import classNames from 'classnames';
import { Cascader , Popconfirm} from 'antd';
/**
 *  props 传入onchange接受回调
*/
import CommonActions from '../action/OfficialPriceActions';
import CommonStore from '../data/OfficialPriceStore';
import '../style/main2.scss';

class AreaPosition extends React.Component{
  constructor(props){
    super(props);
    this.state={
      options:[],
      newOptions:[],
      errorText:"",
      errorVisible:false,
    }
  }
  componentDidMount(){
    this.getAddressFun = CommonStore.listen(this.getAddress);
    if(window.sessionStorage.address){
      let options=[];
      try {
        options = JSON.parse(window.sessionStorage.address);
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
      // console.log(data);
      let options = data.addressData[0];
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
      window.sessionStorage.address = JSON.stringify(options);
    }
  }
  componentWillUnmount(){
    this.getAddressFun();
  }

  //气泡卡片渲染的父节点
  appendZoon=()=>{
    return document.getElementById("officePrice-editable");
  }

  onCancel=()=>{
    this.setState({
      errorVisible: false
    });
  }

  showMessage=(errorText)=>{
    this.setState({ errorVisible: true, errorText: errorText});
    let $this = this;
    setTimeout(function(){
      $this.setState({errorVisible: false });
    },3000);
  }

  render(){
    let { errorVisible,errorText } = this.state;
    let val = this.props.value.indexOf(",")!=-1?this.props.value.split(','):'';
    return(
      <Popconfirm 
          getPopupContainer={this.appendZoon}
          onCancel={this.onCancel} 
          autoAdjustOverflow={false}
          placement="top" 
          visible={errorVisible} 
          title={errorText} 
          cancelText="关闭"
      >
        <div className="AreaP">
          <Cascader
              showSearch
              options={this.state.newOptions}
              value={val}
              onChange={this.props.onChange}
              placeholder="请选择地址" size='large'
              notFoundContent="无匹配结果"
              disabled = {this.props.disabled}
          />
        </div>
      </Popconfirm>
    )
  }
}
export default AreaPosition;