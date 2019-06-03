var Reflux = require('reflux');

var TBillActions = Reflux.createActions([
  'createTBill',
  'deleteTBill',
  'updateTBill',
  'retrieveTBill',
  'retrieveTBillPage',
  'initTBill',
  'getBillDetail',
  'getBillDetailPage'
]);

module.exports = TBillActions;