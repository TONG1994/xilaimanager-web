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
    if(data.operation==="searchSitesByFilter1"){
      let stateData = [];
      data.recordSet.map(item=>{
        let obj = {};
        obj.value = item.orgNo;
        obj.text = item.orgName;
        obj.key = item.orgNo;
        stateData.push(obj);
      });
      this.props.setDataSource(stateData);
  }}
  componentDidMount(){
    this.func = TripleOrganizationStore.listen(this.onStatuChange);
  }
  componentWillUnmount(){
    this.func();
  }
  handleSearch = (val)=>{
    val = val.length>100?val.substring(0,100):val;
    let $this = this.props.$this;
    $this.state.filterInfo.orgNo = '';
    $this.forceUpdate();
    this.setState({value:val});
    let logisticsCompanyUuid = this.props.tripleName;
    let obj = {
      logisticsCompanyUuid,
      keyword:val
    };
    TripleOrganizationActions.searchSitesByFilter1(obj);
  };
  onSelect = (val)=>{
    let $this = this.props.$this;
    $this.state.filterInfo.orgNo = val;
    $this.forceUpdate();
  };
  render(){
    let value = this.props.value?this.props.value:this.state.value;
    let dataSource = this.props.dataSource;
    return(
        <AutoComplete
            value = {value}
            dataSource={dataSource}
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