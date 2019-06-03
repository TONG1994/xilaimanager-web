'use strict';
var  Reflux = require('reflux');
var TransactionLogActions = Reflux.createActions([
    'retrieveTradingFlow',
    
    'getTradingFlowTypeList',
    'getIncomeAndExpandNameOrId',

]);
module.exports=TransactionLogActions;