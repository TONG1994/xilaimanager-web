import { Icon, Input, AutoComplete } from 'antd';
import React from 'react';
var Reflux = require('reflux');
import PostmanInfoStore from '../data/PostmanInfoStore';
import PostmanInfoActions from '../action/PostmanInfoActions';
var Common = require('../../../../public/script/common');
let orgType = Common.getUserType();
var OrgBranchSelect= React.createClass({
  getInitialState : function() {
    return {
      dataArr:[],
      dataSource: [],
      orgData:{
        orgName:'',
        orgNo:''
      },
      value:''
    };
  },
  mixins: [Reflux.listenTo(PostmanInfoStore, 'onServiceComplete')],
  onServiceComplete: function(data) {
    if(data.operation === 'getByOrgName'){
      this.setState({
        dataSource:data.dataSource.length ? data.dataSource :['未找到相关记录'],
        dataArr:data.dataArr.length ? data.dataArr:['未找到相关记录']
      });
    }
  },
  clear:function(){
         this.setState({
          dataArr:[],
          dataSource: [],
          orgData:{
            orgName:'',
            orgNo:''
          },
          value:'',
         });
  },
  setValue:function(value){
           this.setState({value});
  },
  handleSearch : function(value) {
    if(value){
      this.setState({
        value:value.replace(/^\s\s*/, '').replace(/\s\s*$/, ''),
      });
      if(orgType === '1'){
        PostmanInfoActions.getBranchList({orgName:value,orgType:'3'});// 查询总部下的服务站
      }else if(orgType === '2'){
        PostmanInfoActions.getBranchList({orgName:value,orgType:'3', parentflag:'1'});// 查询经营中心下的服务站
      }
    }else{
      this.setState({
        dataSource:[],
        orgData:{
          orgName:'',
          orgNo:''
        },
        value:value,
      },()=>{
        if(this.props.onHandleSearch){
          this.props.onHandleSearch(this.state.value);
        }
      });
    }

  },

  onSelect:function(value){
    var dataArr  = this.state.dataArr;
    if(dataArr.length==1 && dataArr[0]==='未找到相关记录'){
      this.state.orgData={
        orgName:'',
        orgNo:''
      };
      this.setState({
        value:''
      });
    }else{
      for(var i in dataArr){
        if(value === dataArr[i].orgName){
          this.state.orgData = dataArr[i];
        }
      }
      this.setState({
        value:value
      });
    }
   
    if(this.props.onSelected){
      this.props.onSelected(this.state.orgData);
    }
  },
  onBlur:function(){
    var dataArr  = this.state.dataSource;
    if(dataArr.length==1 && dataArr[0]==='未找到相关记录'){
      this.setState({
        dataArr:[],
        dataSource: [],
        orgData:{
          orgName:'',
          orgNo:''
        },
      value:''
      });
    }else{
      let value = this.state.value;
      let index = dataArr.findIndex(item=>item==value);
      if(index === -1){
        this.setState({
          dataArr:[],
          dataSource: [],
          orgData:{
            orgName:'',
            orgNo:''
          },
        value:''
        });
      }
    }

  },
  render:function() {
    const { dataSource, value } = this.state;
    return (
      <div className="certain-category-search-wrapper custom-autocomplete">
            <AutoComplete
                dataSource={dataSource}
                onSelect={this.onSelect}
                onSearch={this.handleSearch}
                placeholder="建议从模糊查询搜索列表中选择所属服务站"
                value={this.state.value}
                onBlur={this.onBlur}
                >
        <Input suffix={<Icon type="search" className="certain-category-icon" />} />
      </AutoComplete>
      </div>
    );
  }
}
);
module.exports = OrgBranchSelect;
