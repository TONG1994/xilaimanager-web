/**
 *   Create by Malson on 2018/9/12
 */

import React from 'react';
import { } from 'antd';
let HistoryVersion = React.createClass({
  getInitialState: function () {
    return {
    };
  },
  render: function () {
    return (
        <div style={{width:"100%",height:"100%"}}>
            <iframe style={{border:0,width:"100%",height:"98%"}} src="/HistoryVersion.html"></iframe>
        </div>
    );
  }
});

module.exports = HistoryVersion;