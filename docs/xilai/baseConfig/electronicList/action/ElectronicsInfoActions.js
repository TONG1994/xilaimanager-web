'use strict';

var Reflux = require('reflux');

var ElectronicsInfoActions = Reflux.createActions([
    'createElectronicsInfo',
    'updateElectronicsInfo',
    'deleteElectronicsInfo',
    'getElectronicsInfo'
]);

module.exports = ElectronicsInfoActions;
