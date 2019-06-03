/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import LogisticsCompanySelect from '../../../lib/Components/logisticsCompany/LogisticsCompanySelect';
import OrgBranchSelect from '../../../lib/Components/orgBranchSelect/OrgBranchSelect';

const propTypes = {
  moreFilter: React.PropTypes.bool,
};

let FormDef = require('./ProfitAllocationForm');
var ProfitSharingFilter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      ProfitSharing: {
          logisticsCompanyUuid:''
      },
    }
  },
  
  mixins: [ModalForm('ProfitSharing', true)],
  componentWillReceiveProps: function (newProps) {
    this.setState({
      modal: newProps.moreFilter,
    });
  },
  
  // 第一次加载
  componentDidMount: function () {
    this.state.validRules = FormDef.getProfitSharingFormRule(this);
    this.clear();
  },
  clear:function(){
    FormDef.initProfitSharingForm(this.state.ProfitSharing);
    this.forceUpdate();
    this.state.ProfitSharing.logisticsCompanyUuid = '';
    this.refs.orgBranch.state.value = '';
  },
    handleFromWhere:function(fromWhereValue){
        this.state.ProfitSharing.fromWhere = fromWhereValue;
    },
  render: function () {

    var layout = 'horizontal';
      let  attrList = [
          {
              name:'logisticsCompanyName',
              id:'logisticsCompanyName',
              object:<LogisticsCompanySelect style={{width:'100%'}}
                                             name="logisticsCompanyUuid"
                                             id="logisticsCompanyUuid"
                                             value={this.state.ProfitSharing['logisticsCompanyUuid']}
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
          }
      ];
    let  items  = FormDef.getProfitSharingForm(this, this.state.ProfitSharing, attrList);
  
    return (
        <div className='filter-wrap'>
          <Form layout={layout} style={{width:'50%'}}>
            { items }
          </Form>
        </div>
    );
  }
});

ProfitSharingFilter.propTypes = propTypes;
module.exports = ProfitSharingFilter;