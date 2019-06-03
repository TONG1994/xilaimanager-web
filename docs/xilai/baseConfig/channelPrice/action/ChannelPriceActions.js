'use strict';

var Reflux = require('reflux');

var channelPriceActions = Reflux.createActions([
    'retrievechannelPrice',
    'initchannelPrice',
    'getAddress',
]);

module.exports = channelPriceActions;
