/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
let CustomerServiceMenu = require('./menus');

const propTypes = {
  children: React.PropTypes.node
};

var customerServiceCenterIndex = React.createClass({
  getInitialState: function () {
    return {
      navItems: CustomerServiceMenu.menus().customerServiceCenterMenus
    }
  },
  
  render: function () {
    let pathname = this.props.location.pathname||"/xilai/customerServiceCenter/worksheetManagementPage/";
    return (
        <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
    );
  }
});

customerServiceCenterIndex.propTypes = propTypes;
module.exports = customerServiceCenterIndex;