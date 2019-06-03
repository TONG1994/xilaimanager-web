/**
 *   Create by Malson on 2018/4/25
 */

var Reflux = require('reflux');

var worksheetManagementActions = Reflux.createActions([
  'retrieveWorksheet',
  'findAssignee',
  'createWorksheet',
  'resolve',
  'finish',
  'reActive',
  'forward',
  'findAccepMan',
  'retrieveDetails'
]);

module.exports = worksheetManagementActions;
