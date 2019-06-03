/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
let XilaiMenu = require('./menus');

const propTypes = {
  children: React.PropTypes.node
};

var DataCenterIndex = React.createClass({
  getInitialState: function () {
    return {
      navItems: XilaiMenu.menus().dataCenterMenus
    }
  },
  
  render: function () {
    let pathname = this.props.location.pathname||"/xilai/dataCenter/BusinessWatchPage/";
    return (
        <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
    );
  }
});

DataCenterIndex.propTypes = propTypes;
module.exports = DataCenterIndex;