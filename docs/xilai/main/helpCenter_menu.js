/**
 *   Create by Malson on 2018/4/19
 */
import React from 'react';
import ContentComponent from '../helpCenter/topComponent';
let helpCenterMenu = require('./menus');

const propTypes = {
  children: React.PropTypes.node
};

var helpCenterIndex = React.createClass({
  getInitialState: function () {
    return {
      navItems: helpCenterMenu.menus().helpCenterMenus
    }
  },
  
  render: function () {
    let pathname = this.props.location.pathname||"/xilai/helpCenter/topComponent/";
    return (
        <ContentComponent navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
    );
  }
});

helpCenterIndex.propTypes = propTypes;
module.exports = helpCenterIndex;