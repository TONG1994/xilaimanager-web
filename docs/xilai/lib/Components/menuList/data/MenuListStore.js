var Reflux = require('reflux');
var MenuListActions = require('../action/MenuListActions');
var Utils = require('../../../../../public/script/utils');
var MsgActions = require('../../../../../lib/action/MsgActions');

var MenuListStore = Reflux.createStore({
    listenables: [MenuListActions],
    filter: {},
    recordSet: [],
    startPage : 0,
    pageRow : 0,
    totalRow : 0,

    init: function() {
    },
    getServiceUrl: function(action)
    {
        return Utils.xilaimanagerUrl+action;
    },

    fireEvent: function(operation, errMsg, self)
    {
        self.trigger({
            filter: self.filter,
            recordSet: self.recordSet,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('menu', operation, errMsg);

    },

    onGetCompany: function(filter) {
        var self = this;
        var url = this.getServiceUrl('menu/retrieve');
        Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.filter = filter;
                self.recordSet=result.object.list;
                self.fireEvent('retrieve', '', self);
            }
            else{
                Utils.handleServer(result.errCode);
                self.fireEvent('retrieve', '['+result.errCode+']处理错误，'+result.errDesc, self);
            }
        }, function(value){
            self.fireEvent('retrieve', '调用服务错误', self);
        });
    },




});

module.exports = MenuListStore;