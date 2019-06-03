'use strict';

var Reflux = require('reflux');

var DeliveryActions = Reflux.createActions([
    'retrieveInvestRate',
    'initDelivery',
    'searchSitesByFilter',
]);

module.exports = DeliveryActions;
