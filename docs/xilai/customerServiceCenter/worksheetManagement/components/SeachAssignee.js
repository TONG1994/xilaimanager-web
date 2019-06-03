import React from 'react';
let Reflux = require('reflux');
import WorksheetManagementStore from '../store/WorksheetManagementStore';
import WorksheetManagementActions from '../action/WorksheetManagementActions';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
let Utils = require('../../../../public/script/utils');
import { Icon, Button, Input, AutoComplete , Spin } from 'antd';

let Filter = React.createClass({
  getInitialState: function () {
    return {
      dataSource: [],
      errMsg:'',    	
      dataArr:[],
      value:'',
      loading: false
    }
  },
  
  mixins: [Reflux.listenTo(WorksheetManagementStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
        this.setState({errMsg:data.errMsg});
        return;
      }
      if (data.operation === 'findAssignee') {
        this.setState({
          dataSource:data.dataSource.length ? data.dataSource :['未找到相关记录'],
          dataArr:data.dataArr.length ? data.dataArr:['未找到相关记录']
        })
      }
  },

  componentDidMount: function(){
    if (typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  showModal: function () {
    this.setState({
      modal: true
    });
  },

  fillInitData: function(initData){
    if(!initData){
      this.setState({
        dataSource:[],
        errMsg:'',
        value:'',
        dataArr:[]
      })
    }else{
      this.setState({ value: initData })
    }
  },

  handleSearch : function(value){
    // let value2=value.replace(/[/*`~!@#$%^&*()_+<>?:|?<>"{},.\/\\;'[\]]/im,'');
    if(value){
      let makeVal = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      this.setState({
        value : makeVal,
      });
      let obj={ "name":makeVal };
      WorksheetManagementActions.findAssignee(obj);
    }else{
      this.setState({
        dataSource:[],
        value:value,
      },()=>{
        if(this.props.onHandleSearch){
          this.props.onHandleSearch(this.state.value);
        }
      });
    }
  },

  handleSelect: function(value){
    let accptManUuid="";
    var dataArr  = this.state.dataArr;
    if(dataArr.length==1 && dataArr[0]==='未找到相关记录'){
      this.setState({
        value:''
      });
    }else{
      for(var i in dataArr){
        if(value === dataArr[i].name){
          accptManUuid = dataArr[i].uuid;
        }
      }
      this.setState({
        value:value
      });
    }
   
    if(this.props.onSelected){
      this.props.onSelected(accptManUuid);
    }
  },

  onBlur: function(value){
    var dataArr  = this.state.dataSource;
    if(dataArr.length==1 && dataArr[0]==='未找到相关记录'){
      this.setState({
        dataArr:[],
        dataSource: [],
        value:''
      });
    }else{
      let value = this.state.value;
      let index = dataArr.findIndex(item=>item==value);
      if(index === -1){
        this.setState({
          dataArr:[],
          dataSource: [],
          value:''
        });
      }
    }
  },

  clear: function(){
    this.setState({
      errMsg:'',
      originalData:'',
      value:'',
      dataArr:[],
    })
  },

  render:function(){
    const { dataSource } = this.state;
    return (
      <div>
        <ServiceMsg ref='mxgBox' svcList={['worksheetManagement/getUserListForWorksheetCreate']}/>
          <AutoComplete
            size="large"
            style={{ width: '100%'}}
            dataSource={dataSource}
            onSelect={this.handleSelect}
            onSearch={this.handleSearch}
            placeholder="请选择受理人"
            value={this.state.value}
            onBlur={this.onBlur}
          >
            <Input
              suffix={(
                <Icon type="search" />
              )}
            />
          </AutoComplete>
      </div>
    );
  },
});
module.exports=Filter;