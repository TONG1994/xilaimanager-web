let Reflux = require('reflux');
var Utils = require('../../../public/script/utils');
var MsgActions = require('../../../lib/action/MsgActions');
let path = require('path');
import HelpcenterActions from '../action/HelpCenterActions';


var HelpCenterStore = Reflux.createStore({
    listenables: [HelpcenterActions],

    filter: {},
    recordSet: [],
    startPage: 0,
    pageRow: 0,
    totalRow: 0,
 
    init: function() { },

    getServerUrl: function(action){
      return Utils.xilaimanagerUrl+action;
    },

    fireEvent: function(operation, errMsg, self){
      self.trigger({
          filter: self.filter,
          recordSet: self.recordSet,
          startPage: self.startPage,
          pageRow: self.pageRow,
          totalRow: self.totalRow,
          operation: operation,
          errMsg: errMsg
      });

      MsgActions.showError('helpCenter', operation, errMsg);
    },

    onRetrieveData: function(filter){
      var self = this;
      var url = this.getServerUrl('helpCenter/getHelpCenterDatas');
      Utils.doGetRecordService(url, filter).then(function(result) {
        if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
          self.recordSet = result.object || [];
          self.filter = filter;
          self.fireEvent('getHelpCenterDatas', '', self);
        }
        else{
          Utils.handleServer(result.errCode);
          self.fireEvent('getHelpCenterDatas', '['+result.errCode+']处理错误，'+result.errDesc, self);
        }
      }, function(value){
        self.fireEvent('getHelpCenterDatas', '调用服务错误', self);
      });
    },


});
module.exports = HelpCenterStore;