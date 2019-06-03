/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
let XilaiMenu = require('./menus');

const propTypes = {
  children: React.PropTypes.node
};

var AlipayDeliveryIndex = React.createClass({
  getInitialState: function () {
    return {
      navItems: XilaiMenu.menus().alipayDeliveryMenus
    }
  },
  
  render: function () {
    let pathname = this.props.location.pathname||"/xilai/alipayDelivery/AlipayDeliveryOrderPage/";
    return (
        <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
    );
  }
});

AlipayDeliveryIndex.propTypes = propTypes;
module.exports = AlipayDeliveryIndex;