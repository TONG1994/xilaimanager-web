/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import LogisticsCompanySelect from '../../../lib/Components/logisticsCompany/LogisticsCompanySelect';
import OrgBranchSelect from '../../../lib/Components/orgBranchSelect/OrgBranchSelect';
import AreaPosition from '../components/AreaPosition';
var Common = require('../../../../public/script/common');

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

let FormDef = require('./LogisticsPriceForm');
let type = Common.getUserType();
var OfficialPriceFilter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      OfficialPrice: {
          logisticsCompanyUuid:'',
          origin:'',
          destination:''
      },
    }
  },
  
  mixins: [ModalForm('OfficialPrice', true)],
  componentWillReceiveProps: function (newProps) {
    this.setState({
      modal: newProps.moreFilter,
    });
  },
  
  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getOfficialPriceFormRule(this);
    this.clear();
  },
  getFilter:function () {
        if(Common.validator(this,this.state.OfficialPrice)){
            return Object.assign(this.state.OfficialPrice)
        }
    },
  clear:function(){
    FormDef.initOfficialPriceForm(this.state.OfficialPrice);
    this.forceUpdate();
    this.state.OfficialPrice.logisticsCompanyUuid = '';
      if(type == '1') {
          this.refs.orgBranch.state.value = '';
      }
  },
    handleFromWhere:function(fromWhereValue){
        this.state.OfficialPrice.fromWhere = fromWhereValue;
    },
    //地区选择回调
    originAreaPosition:function (val) {
      this.handleOnSelected('origin',val.toString());
    },
    //地区选择回调
    destinationAreaPosition:function (val) {
        this.handleOnSelected('destination',val.toString());
    },
  render: function () {

    var layout = 'horizontal';
      let  attrList = [
          {
              name:'logisticsCompanyName',
              id:'logisticsCompanyName',
              object:<LogisticsCompanySelect
                                             name="logisticsCompanyUuid"
                                             id="logisticsCompanyUuid"
                                             value={this.state.OfficialPrice['logisticsCompanyUuid']}
                                             onSelect={this.handleOnSelected.bind(this, 'logisticsCompanyUuid')} />
          },
          {
              name:'fromWhere',
              id:'fromWhere',
              object:<OrgBranchSelect
                                             name="fromWhere"
                                             id="fromWhere"
                                             fromWhere={this.handleFromWhere}
                                             ref='orgBranch'
                                             />
          },
          {
              name:'origin',
              id:'origin',
              object:<AreaPosition
                  name='origin'
                  id='origin'
                  onChange={this.originAreaPosition}
                  value={this.state.OfficialPrice['origin']}
              />
          },
          {
              name:'destination',
              id:'destination',
              object:<AreaPosition
                  name='destination'
                  id='destination'
                  onChange={this.destinationAreaPosition}
                  value={this.state.OfficialPrice['destination']}
              />
          },
      ];
      let  items;
      if(type == '1'){
          items  = FormDef.getOfficialPriceForm(this, this.state.OfficialPrice, attrList);
      }else {
          items  = FormDef.getOfficialPricesForm(this, this.state.OfficialPrice, attrList);
      }

  
    return (
        <div className='filter-wrap'>
          <Form layout={layout}>
            { items }
          </Form>
        </div>
    );
  }
});

OfficialPriceFilter.propTypes = propTypes;
module.exports = OfficialPriceFilter;