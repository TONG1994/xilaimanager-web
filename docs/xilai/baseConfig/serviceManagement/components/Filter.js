import React from 'react';
import { Form } from 'antd';
const FormItem = Form.Item;
import ModalForm from '../../../../lib/Components/ModalForm';
import Common from '../../../../public/script/common';
import Utils from '../../../../public/script/utils';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};
let FormDef = require('./ServiceForm');
var CustomerFilter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      customerInfo: {
        customerName:'',
        customerId:''
      },
    }
  },
  
  mixins: [ModalForm('customerInfo')],
  componentWillReceiveProps: function (newProps) {
    this.setState({
      modal: newProps.moreFilter,
    });
  },
  getFilter:function () {
    if(Common.validator(this,this.state.customerInfo)){
      let customerInfo = Utils.deepCopyValue(this.state.customerInfo);
      let obj = {
        name:customerInfo.customerName,
        userCode:customerInfo.customerId
      };
      return Object.assign(obj);
    }
  },
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    this.clear();
  },
  clear:function(){
    this.state.hints={};
    FormDef.initFilterForm(this.state.customerInfo);
  },
  handleOnInputChange: function (e) {
    if (typeof(this.refs.mxgBox) !== 'undefined') {
        this.refs.mxgBox.clear();
    }
    let customerInfo = this.state.customerInfo;
    // let specialChar = /[/。……（）【】——《》￥*`~!@#$%^&*()_+<>?:|?<>"{},.\/\\;'[\]]/img;
    let specialChar = /[/*`~!@#$%^&*()_+<>?:|?<>"{},.\/\\;'[\]]/img;
    customerInfo[e.target.id] = e.target.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    if(Common.validator(this, customerInfo, e.target.id)){
      this.props.initStartPage();
    }
     customerInfo[e.target.id] = customerInfo[e.target.id].replace(specialChar, '');
  },
  render: function () {
    var layout = 'horizontal';
    let  items  = FormDef.getFilterForm(this, this.state.customerInfo);
    return (
        <div className='filter-wrap'>
          <Form layout={layout}>
            { items }
          </Form>
        </div>
    );
  }
});

CustomerFilter.propTypes = propTypes;
module.exports = CustomerFilter;