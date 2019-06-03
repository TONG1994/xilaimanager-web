import React from 'react';
let Reflux = require('reflux');
import WorksheetManagementStore from '../store/WorksheetManagementStore';
import WorksheetManagementActions from '../action/WorksheetManagementActions';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import Common from '../../../../public/script/common';
import { Select } from 'antd';
const Option = Select.Option;

let AsssigneeSelect = React.createClass({
  getInitialState: function () {
    return {
      errMsg:'',    	
      originalData:[],
      loading: false,
      childrenOption:[],
      value:'',
      oldValue:''
    }
  },
  
  mixins: [Reflux.listenTo(WorksheetManagementStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
      if (data.operation === 'findAccepMan') {
        let optionData=this.setOptionVal(data.recordSet);
        this.setState({ 
          childrenOption: optionData,
          originalData: data
         });
      }
  },

  setOptionVal: function(data){
    let len=data.length;
    let Options=[];
    for (let i=0;i<len;i++) {
      Options.push(<Option key={data[i].uuid} value={data[i].uuid}>{data[i].name}</Option>);
    }
    return Options;
  },

  componentDidMount: function(){
    if (typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
    this.handleQueryClick();
  },

  handleQueryClick: function(){
    this.setState({ loading:true });
    let obj={name:""};
    WorksheetManagementActions.findAccepMan(obj);
  },

  clear: function(){
    this.setState({
      errMsg:'',
      value:'',
    })
  },
  
  handleSelect: function(val){
    if(val===undefined){
      this.setState({
        value: ""
      })
      this.props.onChange("");
    }else{
      this.setState({
        value: val
      });
      this.props.onChange(val);
    }
  
  },

  // 在结果集里模糊匹配
  filterOption: function(input, option){
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  },

  // onSearch: function(value){
  //   value=value.substring(0,50);
  //   retu
  // },

  render:function(){
    let data=this.state.childrenOption;
    const {onChange,...attrs}=this.props;
    return (
      <div>
        <ServiceMsg ref='mxgBox' svcList={['worksheetManagement/getUserListForWorksheetCreate']}/>
        <Select
          showSearch={true}
          optionFilterProp="children"
          onChange={this.handleSelect}
          filterOption={this.filterOption}
          value={this.state.value}
          // onSearch={this.onSearch}
          {...attrs}
        >
          <Option value="" key="">-请选择-</Option>
          {data}
        </Select>
      </div>
    );
  },
});
module.exports=AsssigneeSelect;