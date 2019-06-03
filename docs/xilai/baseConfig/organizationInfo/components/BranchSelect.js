/**
 *   Create by Malson on 2018/4/27
 */

import React from 'react';
import { Select,Cascader } from 'antd';
const Option = Select.Option;
var Validator = require('../../../../public/script/common');
import utils from '../../../../public/script/utils';

import CommonActions from '../../../../lib/action/CommonActions';
import CommonStore from '../../../../lib/data/CommonStore';
let lastCities = {};
class BranchSelect extends React.Component{
  constructor(props){
    super(props);
    this.state={
      options:[],
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
    if(this.getAddressFun){
      this.getAddressFun();
    }
  }
  mutilSelect = (val)=>{
    this.props.onChange('2',val.toString());
  }
  cityChange = (val)=>{
    this.props.onChange('1',val.toString());
  }
  render(){
    let allOptions = utils.deepCopyValue(this.state.options);
    let manageCity = this.props.manageCity,
        manageCounty = this.props.manageCounty;
    //新增的时候有省   回来的数据没有省  需要自己遍历数据
    if(manageCity.indexOf(',')!==-1){
      manageCity = manageCity.split(',')[0]?manageCity.split(","):[];
    }
    let options = allOptions.map(item=>{
      if(item.children){
        item.children.map(jtem=>{
          if(jtem.children){
            lastCities[jtem.value] = jtem.children.slice(0);
            if(jtem.value===manageCity){
              manageCity = [item.value,jtem.value]
            }
            jtem.children = null;
          }
        })
      }
      return item;
    });
    manageCounty = manageCounty.split(",")[0]?manageCounty.split(","):[];
    let manageCityArr = manageCity[0]&&lastCities[manageCity[1]]?lastCities[manageCity[1]]:[];
    let opt = manageCityArr.map(item=><Option key={item.value}>{item.label}</Option>);
    let disable = this.props.disabled;
    return(
        <div>
          <Cascader
              options={options}
              value={manageCity}
              onChange={this.cityChange}
              placeholder="请选择省市地址"
              size='large'
              disabled = {disable}
          />
          <Select
              size='large'
              mode="multiple"
              style={{ marginTop : 10}}
              placeholder="请选择区域（可多选）"
              onChange={this.mutilSelect}
              value={manageCounty}
              disabled = {disable}
          >
            {opt}
          </Select>
        </div>
    )
  }
}
export default BranchSelect;