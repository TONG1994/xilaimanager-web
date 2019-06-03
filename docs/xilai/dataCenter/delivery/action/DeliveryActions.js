'use strict';

var Reflux = require('reflux');

var DeliveryActions = Reflux.createActions([
    'retrieveDelivery',
    'initDelivery',
    'searchSitesByFilter',
    'getCompany',
]);

module.exports = DeliveryActions;
