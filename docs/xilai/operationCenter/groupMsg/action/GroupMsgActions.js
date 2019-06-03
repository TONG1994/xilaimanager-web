var Reflux = require('reflux');

var GroupMsgActions = Reflux.createActions([
  'retrieveGroupMsgPage',
  'retrieveNum',
  'addMsg',
  'editMsg',
  'deleteMsg',
  'getSendMsgableUserList'
]);

module.exports = GroupMsgActions;