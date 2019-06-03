import React from 'react';
import TopBar from '../lib/Components/TopBar';
let Common = require('../public/script/common');
let XilaiMenu = require('./main/menus');
import utils from '../public/script/utils';


let XilaiLayout = React.createClass({
  getInitialState: function () {
    return {
	      navItems: XilaiMenu.menus().moduleMenus
	    };
  },

  render: function () {
    //old  activeNode = Common.xilaiHome is set by config.js
    let pathname = this.props.location.pathname;
    let type = pathname.replace(/^(\/{1}\w+)(\/{1}\w+\/{1})([\s\S]*)/ig,"$1$2");
    let data = utils.deepCopyValue(this.state.navItems);
    data.map(item=>{
      if(item.path===type){
        type = item.to
      }
    });
    return <TopBar navItems={this.state.navItems} activeNode={type} home="@/index.html?from=xilai" children={this.props.children} />;
  }
});

module.exports = XilaiLayout;
