'use strict';

var Reflux = require('reflux');

var ServiceManagementActions = Reflux.createActions([
	'create',
	'delete',
	'retrieve',
	'getCustomerName',
	'update',
]);

module.exports = ServiceManagementActions;
