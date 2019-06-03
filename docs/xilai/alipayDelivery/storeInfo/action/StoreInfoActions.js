'use strict';

var Reflux = require('reflux');

var StoreInfoActions = Reflux.createActions([
    'retrieveStoreInfo',
    'updateStoreInfo',
    'getStoreInfoDetail'
]);

module.exports = StoreInfoActions;
