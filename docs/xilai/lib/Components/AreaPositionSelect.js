import React from 'react';

import { Select } from 'antd';
const Option = Select.Option;
/**
 *  props 传入onchange接受回调
*/
import CommonActions from '../../../lib/action/CommonActions';
import CommonStore from '../../../lib/data/CommonStore';
import Utils from '../../../public/script/utils';
class AreaPosition extends React.Component{
  constructor(props){
    super(props);
    this.state={
      provinceArr:[],
      cityArr:[],
      townArr:[],
      province:'',
      city:'',
      town:'',
    }
  }
  componentDidMount(){
    this.getAddressFun = CommonStore.listen(this.getAddress);
    if(window.sessionStorage.address){
      let provinceArr=[];
      try {
        provinceArr = JSON.parse(window.sessionStorage.address);
      }catch (err){}
      this.setState({provinceArr});
      return;
    }
    CommonActions.getAddress();
  }
  getAddress = (data)=>{
    if(data.operation==='getAddress'){
      let provinceArr = data.recordSet[0];
      this.setState({provinceArr});
      window.sessionStorage.address = JSON.stringify(provinceArr);
    }
  }
  componentWillUnmount(){
    this.getAddressFun();
  }
  handleProvince=(value)=>{
    let provinceArr = this.state.provinceArr, cityArr=[];
    let obj = provinceArr ?  provinceArr.find(item => item.value === value) : {};
    cityArr = obj &&  obj.children ? obj.children :[];
    this.setState({ 
      province: value,
      cityArr,
      townArr:[],
      city:'',
      town:'',
    });
  }
  handleCity=(value)=>{
    let cityArr = this.state.cityArr, townArr=[];
    let obj = cityArr ?  cityArr.find(item => item.value === value) :{};
    townArr = obj && obj.children ? obj.children :[];
    this.setState({ 
      city: value,
      townArr,
      town:'' ,
     });
  }
 
  handleTown=(value)=>{
    this.setState({ 
      town: value,
     });
  }
  getAddressFilter=()=>{
    let str = '',arr=[], province = this.state.province,city = this.state.city, town = this.state.town;
    arr.push(province);
    arr.push(city);
    arr.push(town);
    str = arr.join(',');
    return str;
  }
  clear=()=>{
    this.setState({
      cityArr:[],
      townArr:[],
      province:'',
      city:'',
      town:'',
    });
  }
  render(){
    const {
      ...attributes,
    } = this.props;
   let array1 = this.state.provinceArr,
    array2 = this.state.cityArr,
    array3 = this.state.townArr;
    return(
      <div>
        <Select {...this.props} name='province' value={this.state.province} style={{ width: 130, }} onChange={this.handleProvince}>
          <Select.Option value=''>--请选择省--</Select.Option>
          {
            array1.map((lvl, i) => {
              return <Select.Option key={lvl.value} value={lvl.value}>{lvl.label}</Select.Option>
            })
          }
        </Select>
        <Select {...this.props} className='btn-margin' name='city' value={this.state.city} style={{ width: 120, }} onChange={this.handleCity}>
          <Select.Option value=''>--请选择市--</Select.Option>
          {
            array2.map((lvl, i) => {
              return <Select.Option key={lvl.value} value={lvl.value}>{lvl.label}</Select.Option>
            })
          }
        </Select>
        <Select {...this.props} className='btn-margin' name="town" value={this.state.town} style={{ width: 120, }} onChange={this.handleTown}>
          <Select.Option value=''>--请选择区--</Select.Option>
          {
            array3.map((lvl, i) => {
              return <Select.Option key={lvl.value} value={lvl.value}>{lvl.label}</Select.Option>
            })
          }
        </Select>
      </div>
     
       
    )
  }
}
export default AreaPosition;