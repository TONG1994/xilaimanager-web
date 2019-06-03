'use strict';

var Reflux = require('reflux');

var OfficialPriceActions = Reflux.createActions([
    'retrieveofficialPrice',
    'initofficialPrice',
    'getAddress',
    'addOfficialPrice',
    'updateOfficialPrice',
    'getCompany',
    'getByCompanyUuid',
    'getOrgCodebyOrgType',
    'newGetCompany'
]);

module.exports = OfficialPriceActions;
