'use strict';
import React from 'react';
import { Tree, Modal,Checkbox} from 'antd';
const TreeNode = Tree.TreeNode;
var $ = require('jquery');

var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

module.exports = {

  ErrModal: function(content,name,from){
    Modal.error({
      title: '错误',
      content: content,
      okText: '重试',
      cancelText: '取消',
    });
  }
}