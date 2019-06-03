/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
let XilaiMenu = require('./menus');

const propTypes = {
  children: React.PropTypes.node
};

var OperationCenterIndex = React.createClass({
  getInitialState: function () {
    return {
      navItems: XilaiMenu.menus().operationCenterMenus
    }
  },
  
  render: function () {
    let pathname = this.props.location.pathname||"/xilai/operationCenter/OperationActivityPage/";
    return (
        <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
    );
  }
});

OperationCenterIndex.propTypes = propTypes;
module.exports = OperationCenterIndex;