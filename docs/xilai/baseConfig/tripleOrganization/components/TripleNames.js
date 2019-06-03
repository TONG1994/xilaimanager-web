/**
 *   Create by Malson on 2018/6/20
 */

import React from 'react';
import { Select } from 'antd';
import common from '../../../../public/script/common';
const Option = Select.Option;


import TripleOrganizationActions from '../action/TripleOrganizationActions';
import TripleOrganizationStore from '../store/TripleOrganizationStore';


class TripleNames extends React.Component{
  constructor(props){
    super(props);
    this.state={
      data:[],
      type:''
    }
  }
  handleChange = (val)=>{
    let $this = this.props.$this;
    let id = this.props.id;
    if($this){
      $this.state.filterInfo[id]= val;
      $this.forceUpdate();
      return;
    }
    let obj = this.state.data.filter(item=>val===item.uuid)
    this.props.changeTripleNames(obj[0]);
  };
  onStatusChange = (data)=>{
    if(data.errMsg) return;
    if(data.operation==="queryLogisticsCompanys"&&!this.state.type){
      let setData = data.recordSet;
      this.setState({data:setData});
    }if(data.operation==="queryLogisticsCompanysRetrieve"){
      let setData = data.recordSet;
      this.setState({data:setData});
    }
  };
  doServer = ()=>{
    this.setState({type:'retrieve'});
    TripleOrganizationActions.queryLogisticsCompanysRetrieve(""); 
  };
  getCompanyArr = (serviceType)=>{
    this.setState({data:[]});
    TripleOrganizationActions.queryLogisticsCompanys(serviceType);
  };
  componentDidMount(){
    this.unsubscribe = TripleOrganizationStore.listen(this.onStatusChange);
    // TripleOrganizationActions.queryLogisticsCompanys();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render(){
    let { value } = this.props;
    let options = this.state.data.map(item=>{
      return (
          <Option value={item.uuid} key={item.uuid}>{item.logisticsCompanyName}</Option>
      )
    });
    return(
        <Select value ={value} onChange={this.handleChange} size='large'>
          <Option value="" key='--'> -- </Option>
          {options}
        </Select>
    )
  }
}
export default TripleNames;