import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var Common = require('../../../../public/script/common');
let TransactionLogActions=require('../action/TransactionLogActions');
let TransactionLogStore=require('../data/TransactionLogStore');

var TradingFlowTypeSelect = React.createClass({
  getInitialState: function () {
    return {
      opts: [],
      loading: false,
      optData:{
        uuid:'',
        name:''
      }
    }
  },
  showOptions: function (opts) {
    var values = opts;
    if (values === null || typeof (values) === 'undefined') {
      values = [];
    }

    this.setState({
      opts: values,
      loading: false
    });
  },
  mixins: [Reflux.listenTo(TransactionLogStore, "onServiceComplete")],
  onServiceComplete: function (data) {
    if (data.operation === 'queryAllTradingType') {
      if(data.errMsg ===''){
        this.setState({ loading: false,
        ops:data.dataSource });

        this.showOptions(data.dataSource);
      }
    }
  },
    componentDidMount: function (newProps) {
    this.setState({loading:true});
    TransactionLogActions.getTradingFlowTypeList({});
  },
  onSelect:function(value, option){
    var dataArr  = this.state.opts;
    if(value === ''){
      this.state.optData = {
        uuid:'',
        name:''
      };
    }else{
      for(var i in dataArr){
        if(value === dataArr[i].uuid){
          this.state.optData = dataArr[i];
          break;
        }
      }
    }
    if(this.props.onSelect){
      this.props.onSelect(this.state.optData);
    }
  },
  render: function () {
    const {
      required,
      onSelect,
      value,
      ...attributes,
    } = this.props;

    var recordSet = this.state.opts;
    var box;
    if (required) {
      box = <Select value={value} onSelect={this.onSelect} {...attributes}>
        {
          recordSet.map((lvl, i) => {
            return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.name}</Option>
          })
        }
      </Select>
    }
    else {
      box = <Select value={value} onSelect={this.onSelect} {...attributes}>
        <Option value=''>--</Option>
        {
          recordSet.map((lvl, i) => {
            return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.name}</Option>
          })
        }
      </Select>
    }

    return this.state.loading ? <Spin>{box}</Spin> : box;
  }
});

export default TradingFlowTypeSelect;
