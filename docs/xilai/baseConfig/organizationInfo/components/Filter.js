/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form } from 'antd';
const FormItem = Form.Item;
import ModalForm from '../../../../lib/Components/ModalForm';
import Common from '../../../../public/script/common';
// import AreaPosition from '../../../lib/Components/AreaPosition';
import FormUtil from '../../../../lib/Components/FormUtil';
const propTypes = {
  moreFilter: React.PropTypes.bool,
};

let FormDef = require('./OrganizationForm');
let TYPE = Common.getUserType();
var OrganizationInfoFilter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      organizationInfo: {
      
      },
    }
  },
  
  mixins: [ModalForm('organizationInfo')],
  componentWillReceiveProps: function (newProps) {
    this.setState({
      modal: newProps.moreFilter,
    });
  },
  getFilter:function () {
    if(Common.validator(this,this.state.organizationInfo)){
      if(TYPE!='1'){
        this.state.organizationInfo.orgType = '';
      }
      if(this.refs.adress){
        this.state.organizationInfo.orgAddress = this.refs.adress.getAddressFilter();
      }else{
        this.state.organizationInfo.orgAddress =' , , ,';
      }
      return Object.assign(this.state.organizationInfo)
    }
  },
  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getFilterFormRule(this);
    this.clear();
  },
  clear:function(){
    FormDef.initFilterForm(this.state.organizationInfo);
    Common.validator(this,this.state.organizationInfo);
    this.refs.adress.clear();
  },
  //地区选择回调
  areaPosition:function (val) {
    this.handleOnSelected('orgAddress',val.toString());
  },
  render: function () {
    // if (!this.state.modal) {
    //   return null;
    // }
    var layout = 'horizontal';
    let  attrList = [
      {
        name:'orgType',
        id:'orgType',
        visible:TYPE=="1"?'':'hidden',
      },
      // {
      //   name:'orgAddress',
      //   id:'orgAddress',
      //   visible:TYPE=="1"?'':'hidden',
      //   ref:'adress',
      //   object:<AreaPosition
      //       name='orgAddress'
      //       id='orgAddress'
      //       // onChange={this.areaPosition}
      //       // value={this.state.organizationInfo['orgAddress']}
      //       // changeOnSelect={true}
           
      //   />
      // },
    ];
    let  items  = FormDef.getFilterForm(this, this.state.organizationInfo, attrList);
    return (
        <div className='filter-wrap'>
          <Form layout={layout}>
            { items }
          </Form>
        </div>
    );
  }
});

OrganizationInfoFilter.propTypes = propTypes;
module.exports = OrganizationInfoFilter;