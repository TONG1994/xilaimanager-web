import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Select, Spin } from 'antd';
const Option = Select.Option;

var Common = require('../../../../public/script/common');
let logisticsCompanyActions=require('./action/logisticsCompanyActions');
let logisticsCompanyStore=require('./data/logisticsCompanyStore');

var LogisticsCompanySelect = React.createClass({
  getInitialState: function () {
    return {
      logisticsCompanySet: {
        recordSet: [],
        errMsg: '',
      },
      loading: false,
      projUuid: ''
    }
  },

  mixins: [Reflux.listenTo(logisticsCompanyStore, "onServiceComplete")],
  onServiceComplete: function (data) {
    if (data.operation === 'getCompany') {
      this.state.logisticsCompanySet = data;
      this.setState({ loading: false });
    }
  },
  getOrdNameNode: function (value) {
    if (typeof (value) === 'undefined') {
      value = this.props.value;
    }

    if (value === null || value === '' || typeof (value) === 'undefined') {
      return {};
    }

    var nodes = this.state.logisticsCompanySet.recordSet;
    var len = nodes.length;
    for (var i = 0; i < len; i++) {
      if (nodes[i].uuid=== value) {
        return nodes[i].logisticsCompanyName;
      }
    }
    return {};
  },

  // 第一次加载
    componentDidMount: function (newProps) {
    // if (newProps.projUuid === this.state.projUuid) {
    //   return;
    // }

    this.state.projInfoSet = {
      recordSet: [],
      errMsg: '',
    };


    var filter = {};
    logisticsCompanyActions.getCompany(filter);
  },

  render: function () {
    const {
      required,
      ...attributes,
    } = this.props;

    var recordSet = this.state.logisticsCompanySet.recordSet;
    var box;
    if (required) {
      box = <Select {...this.props}>
        {
          recordSet.map((lvl, i) => {
            return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.logisticsCompanyName}</Option>
          })
        }
      </Select>
    }
    else {
      box = <Select {...this.props}>
        <Option value=''>--</Option>
        {
          recordSet.map((lvl, i) => {
            return <Option key={lvl.uuid} value={lvl.uuid}>{lvl.logisticsCompanyName}</Option>
          })
        }
      </Select>
    }

    return this.state.loading ? <Spin>{box}</Spin> : box;
  }
});

export default LogisticsCompanySelect;
