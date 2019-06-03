'use strict';

var Reflux = require('reflux');

var OrganizationInfoActions = Reflux.createActions([
	'createOrganizationInfo',
	'deleteOrganizationInfo',
	'retrieveOrganizationInfo',
	'getOrganizationInfo',
	'update',
	'updateDisableAndEnable'
]);

module.exports = OrganizationInfoActions;
