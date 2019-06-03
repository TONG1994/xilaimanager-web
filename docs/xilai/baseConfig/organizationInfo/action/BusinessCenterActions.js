/**
 *   Create by Malson on 2018/5/10
 */
'use strict';

var Reflux = require('reflux');

var BusinessCenterActions = Reflux.createActions([
  'getBusinessCenter',
  'getBusinessCenterByNo'
]);

module.exports = BusinessCenterActions;