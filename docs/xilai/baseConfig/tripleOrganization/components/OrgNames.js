/**
 *   Create by Malson on 2018/6/20
 */

import React from 'react';
import { AutoComplete,Input ,Icon} from 'antd';

import TripleOrganizationActions from '../action/TripleOrganizationActions';
import TripleOrganizationStore from '../store/TripleOrganizationStore';




class OrgNames extends React.Component{
  constructor(props){
    super(props);
    this.state={
      dataSource:[],
      value:''
    }
  }
  onStatuChange = (data)=>{
    if(data.errMsg) return;
    if(data.operation==="searchSitesByFilter"){
      let stateData = [];
      data.recordSet.map(item=>{
        let obj = {};
        obj.value = item.orgNo;
        obj.text = item.orgName;
        obj.key = item.orgNo;
        stateData.push(obj);
      });
      this.setState({dataSource:stateData});
    }else if(data.operation==="getNeedParams"){
      this.props.setParams(data.recordSet)
    }
  };
  componentDidMount(){
    this.func = TripleOrganizationStore.listen(this.onStatuChange);
  }
  componentWillUnmount(){
    this.func();
  }
  handleSearch = (val)=>{
    val = val.length>100?val.substring(0,100):val;
    this.props.clearTripleName();
    this.setState({value:val});
    let logisticsCompanyUuid = this.props.tripleName,
        serviceType = this.props.serviceType;
    let obj = {
      logisticsCompanyUuid,
      keyword:val,
      serviceType
    };
    TripleOrganizationActions.searchSitesByFilter(obj);
  };
  onSelect = (val)=>{
    let id = this.props.id;
    let logisticsCompanyUuid = this.props.tripleName;
    let obj = this.state.dataSource.filter(item=>item.value===val);
    this.props.changeOrgNames(obj[0]);
    if(!logisticsCompanyUuid){
      this.props.checkComp()
    }else{
      TripleOrganizationActions.getNeedParams({
        logisticsCompanyUuid,
        orgNo:val,
        serviceType:this.props.serviceType
      });
    }
  };
  render(){
    let value = this.props.value?this.props.value:this.state.value;
    return(
        <AutoComplete
            value = {value}
            dataSource={this.state.dataSource}
            onSelect={this.onSelect}
            onSearch={this.handleSearch}
            placeholder="搜索选择喜来服务站"
            size='large'
        >
          <Input suffix={<Icon type="search" />} />
        </AutoComplete>
    )
  }
}
export default OrgNames;