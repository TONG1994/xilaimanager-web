import React from 'react';
import { Select, Spin } from 'antd';
const Option = Select.Option;

var ADDictSelect = React.createClass({
  getInitialState: function () {
    return {
      opts: [],
      loading: false,
      optData:{
        id:'',
        name:'',
      }
    };
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
  componentWillMount: function () {
    const {opts} = this.props;
    this.showOptions(opts);
  },
  render: function () {
    const {
            showCode,
            required,
            onSelect,
            mode,
            value,
            ...attributes
        } = this.props;

    var opts;
    if (showCode) {
      opts = this.state.opts.map((item, i) => {
        return <Option key={item.id} value={item.id}>{item.id}-{item.name}</Option>;
      });
    }
    else {
      opts = this.state.opts.map((item, i) => {
        return <Option key={item.id} value={item.id}>{item.name}</Option>;
      });
    }

    var obj;
    if (mode === 'multiple') {
      var list = value ? value.split(',') : [];
      obj =
                <Select mode="multiple" value={list} onSelect={this.selectMultiValue} onDeselect={this.deselectMultiValue} {...attributes}>
                    {opts}
                </Select>;
    }
    else {
      if (required) {
        obj = <Select value={value} onSelect={onSelect} {...attributes}>
                    {opts}
                </Select>;
      }
      else {
        obj = <Select value={value} onSelect={onSelect} {...attributes}>
                    <Option value=''>-请选择-</Option>
                    {opts}
                </Select>;
      }
    }

    return this.state.loading ? <Spin>{obj}</Spin> : obj;
  }
});

export default ADDictSelect;
