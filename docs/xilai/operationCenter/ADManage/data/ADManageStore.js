'use strict';

let Reflux = require('reflux');
import React from 'react';
import {Modal} from 'antd';
let ADManageActions = require('../action/ADManageActions');
let Utils = require('../../../../public/script/utils');
let MsgActions = require('../../../../lib/action/MsgActions');

let ADManageStore = Reflux.createStore({
    listenables: [ADManageActions],
    filter: {},
    recordSet: [],
    object: {},
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    getOrgsByCitys:[],
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
            object: self.object,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            operation: operation,
            errMsg: errMsg,
            getOrgsByCitys: self.getOrgsByCitys,
        });

        MsgActions.showError('advertisement', operation, errMsg);
    },
    onRetrieve: function (filter, startPage, pageRow) {
        let  $this = this;
        let url = this.getServiceUrl('advertisement/queryDevThree');
        Utils.doRetrieveService(url, filter, startPage, pageRow, $this.totalRow).then(
            (result)=>{
              if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                $this.recordSet = result.object.list;
                $this.startPage = result.object.startPage;
                $this.pageRow = result.object.pageRow;
                $this.totalRow = result.object.totalRow;
                $this.filter = filter;
                $this.fireEvent('queryDevThree', '', $this);
              } else {
                Utils.handleServer(result.errCode);
                $this.fireEvent('queryDevThree', '[' + result.errCode + ']处理错误，' + result.errDesc, $this);
              }
            }, () => {
              $this.fireEvent('queryDevThree', '调用服务错误', $this);
            }
        );
    },
    onWebManageRetrieve: function (filter, startPage) {
        let  $this = this;
        let url = this.getServiceUrl('advertisement/queryDevThree');
        Utils.doRetrieveService(url, filter, startPage,$this.totalRow).then(
            (result)=>{
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    $this.recordSet = result.object.list;
                    $this.startPage = result.object.startPage;
                    $this.totalRow = result.object.totalRow;
                    $this.filter = filter;
                    $this.fireEvent('queryDevThreeWebManage', '', $this);
                } else {
                    Utils.handleServer(result.errCode);
                    $this.fireEvent('queryDevThreeWebManage', '[' + result.errCode + ']处理错误，' + result.errDesc, $this);
                }
            }, () => {
                $this.fireEvent('queryDevThreeWebManage', '调用服务错误', $this);
            }
        );
    },
    onGetSelectOptions: function() {
        var self = this;
        var url = this.getServiceUrl('advertisement/query_tab');
        Utils.doRetrieveService(url).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.recordSet=result.object;
                self.fireEvent('query_tab', '', self);
            }
            else{
                self.fireEvent('query_tab', '['+result.errCode+']处理错误，'+result.errDesc, self);
            }
        }, function(value){
            self.fireEvent('query_tab', '调用服务错误', self);
        });
    },

    onDelete:function(uuid) {
        let url = this.getServiceUrl('advertisement/remove');
        Utils.recordDelete(this, uuid, url);
    },
    onCreate: function(data) {
        // let $this = this,
        let url = this.getServiceUrl('advertisement/create');
        Utils.recordCreate(this, data, url)
    },
    onPush: function(data) {
        // let $this = this,
        let url = this.getServiceUrl('advertisement/notification');
        Utils.recordCreate(this, data, url);
    },
    onUpdate(data, type) {
        let $this = this, updata = {};
        let url = this.getServiceUrl('advertisement/update');
            let sendData = Utils.deepCopyValue(data);
            updata = Utils.deepCopyValue(sendData);
        Utils.recordUpdate(this, updata, url)
    },

    resuleReturn(errCode) {
        if (errCode === null || errCode === '' || errCode === '000000') {
            return true;
        } else {
            return false;
        }
    },

    onGetOrgsByCitys: function() {
        var self = this;
        var url = this.getServiceUrl('organization/getOrgsByCitys');
        Utils.doRetrieveService(url).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                self.getOrgsByCitys=result.object;
                self.fireEvent('getOrgsByCitys', '', self);
            }
            else{
                self.fireEvent('getOrgsByCitys', '['+result.errCode+']处理错误，'+result.errDesc, self);
            }
        }, function(value){
            self.fireEvent('getOrgsByCitys', '调用服务错误', self);
        });
    },
});

module.exports = ADManageStore;