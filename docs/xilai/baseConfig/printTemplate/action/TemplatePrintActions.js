'use strict';

var Reflux = require('reflux');

var TemplatePrintActions = Reflux.createActions([
	'createTemplatePrint',
	'updateTemplatePrint',
	'deleteTemplatePrint',
	'getTemplatePrintAll',
]);

module.exports = TemplatePrintActions;
