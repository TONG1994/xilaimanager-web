'use strict';

var Reflux = require('reflux');

var ADManageActions = Reflux.createActions([
    'retrieve',
    'webManageRetrieve',
    'create',
    'update',
    'delete',
    'offline',
    'getSelectOptions',
    'push',
    'getOrgsByCitys'
]);

module.exports = ADManageActions;
