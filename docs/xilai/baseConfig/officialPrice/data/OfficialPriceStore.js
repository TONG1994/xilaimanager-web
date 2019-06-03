'use strict';

var Reflux = require('reflux');
var officialPriceActions = require('../action/OfficialPriceActions');
var Utils = require('../../../../public/script/utils');
var MsgActions = require('../../../../lib/action/MsgActions');

var officialPriceStore = Reflux.createStore({
    listenables: [officialPriceActions],

    filter: {},
    recordSet: [],
    object: {},
    startPage : 0,
    pageRow : 0,
    totalRow : 0,
    transportType:[],
    addressData:[],
    OrgCodeByOrgType:"",
    logisticsMessage:[],

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
            addressData: self.addressData,
            startPage: self.startPage,
            pageRow: self.pageRow,
            totalRow: self.totalRow,
            transportType: self.transportType,
            OrgCodeByOrgType: self.OrgCodeByOrgType,
            logisticsMessage: self.logisticsMessage,
            operation: operation,
            errMsg: errMsg
        });

        MsgActions.showError('logistics_price', operation, errMsg);
    },

    // 根据条件查询价格表内容
    onRetrieveofficialPrice: function(filter, startPage, pageRow) {
        var self = this;
        var url = this.getServiceUrl('logistics_price/retrieveByFilter');
        Utils.doRetrieveService(url, filter, startPage, pageRow, self.totalRow).then((result) => {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                let arrObj=result.object.list;
                if(arrObj !== null){
                    for (const obj of arrObj) {
                        obj.recordType="retrieve";
                    }
                }
                self.recordSet = arrObj;
                self.startPage = result.object.startPage;
                self.pageRow = result.object.pageRow;
                self.totalRow = result.object.totalRow;
                self.filter = filter;
                self.fireEvent('retrieveByFilter', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('retrieveByFilter', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        }, (value) => {
            self.fireEvent('retrieveByFilter', '调用服务错误', self);
        });
    },

    //新增数据处理
    buildAddData: function(makedata,oldData){
        let data={};
        data.uuid = makedata.uuid;
        data.logicCode = makedata.logicCode;
        data.logisticsCompanyUuid = makedata.logisticsCompanyUuid;
        data.logisticsCompanyName = makedata.logisticsCompanyName;
        data.transportTypeUuid = makedata.transportTypeUuid;
        data.transportTypeName = makedata.transportTypeName;
        data.originCode = makedata.originCode;
        data.origin = makedata.origin;
        data.destinationCode = makedata.destinationCode;
        data.destination = makedata.destination;
        data.section1 = makedata.section1;
        data.firstWeightPrice1 = makedata.firstWeightPrice1;
        data.firstWeight1 = makedata.firstWeight1;
        data.furtherWeightPrice1 = makedata.furtherWeightPrice1;
        data.section2 = makedata.section2;
        data.firstWeightPrice2 = makedata.firstWeightPrice2;
        data.firstWeight2 = makedata.firstWeight2;
        data.furtherWeightPrice2 = makedata.furtherWeightPrice2;
        data.section3 = makedata.section3;
        data.firstWeightPrice3 = makedata.firstWeightPrice3;
        data.firstWeight3 = makedata.firstWeight3;
        data.furtherWeightPrice3 = makedata.furtherWeightPrice3;
        data.beforeData=[
            {
                "prop": "logisticsCompanyName",
                "label": "快递公司",
                "value": oldData.logisticsCompanyName
            },{
                "prop": "logicCode",
                "label": "ID",
                "value": oldData.logicCode
            },{
                "prop": "transportTypeName",
                "label": "运输方式",
                "value": oldData.transportTypeName
            },{
                "prop": "origin",
                "label": "始发地",
                "value": oldData.origin
            },{
                "prop": "destination",
                "label": "目的地",
                "value": oldData.destination
            },{
                "prop": "section1",
                "label": "总重区间1",
                "value": oldData.section1
            },{
                "prop": "firstWeightPrice1",
                "label": "首重价格1",
                "value": oldData.firstWeightPrice1
            },{
                "prop": "firstWeight1",
                "label": "首重重量1",
                "value": oldData.firstWeight1
            },{
                "prop": "furtherWeightPrice1",
                "label": "续重价格1",
                "value": oldData.furtherWeightPrice1
            },{
                "prop": "section2",
                "label": "总重区间2",
                "value": oldData.section2
            },{
                "prop": "firstWeightPrice2",
                "label": "首重价格2",
                "value": oldData.firstWeightPrice2
            },{
                "prop": "firstWeight2",
                "label": "首重重量2",
                "value": oldData.firstWeight2
            },{
                "prop": "furtherWeightPrice2",
                "label": "续重价格2",
                "value": oldData.furtherWeightPrice2
            },{
                "prop": "section3",
                "label": "总重区间3",
                "value": oldData.section3
            },{
                "prop": "firstWeightPrice3",
                "label": "首重价格2",
                "value": oldData.firstWeightPrice3
            },{
                "prop": "firstWeight2",
                "label": "首重重量2",
                "value": oldData.firstWeight2
            },{
                "prop": "furtherWeightPrice2",
                "label": "续重价格2",
                "value": oldData.furtherWeightPrice2
            }
        ];
        return data;

    },

    buildUpdateData: function(makedata,oldData){
        let data={};
        data.uuid = makedata.uuid;
        data.logicCode = makedata.logicCode;
        data.section1 = makedata.section1;
        data.firstWeightPrice1 = makedata.firstWeightPrice1;
        data.firstWeight1 = makedata.firstWeight1;
        data.furtherWeightPrice1 = makedata.furtherWeightPrice1;
        data.section2 = makedata.section2;
        data.firstWeightPrice2 = makedata.firstWeightPrice2;
        data.firstWeight2 = makedata.firstWeight2;
        data.furtherWeightPrice2 = makedata.furtherWeightPrice2;
        data.section3 = makedata.section3;
        data.firstWeightPrice3 = makedata.firstWeightPrice3;
        data.firstWeight3 = makedata.firstWeight3;
        data.furtherWeightPrice3 = makedata.furtherWeightPrice3;
        data.beforeData=[
            {
                "prop": "section1",
                "label": "总重区间1",
                "value": oldData.section1
            },{
                "prop": "logicCode",
                "label": "ID",
                "value": makedata.logicCode
            },{
                "prop": "firstWeightPrice1",
                "label": "首重价格1",
                "value": oldData.firstWeightPrice1
            },{
                "prop": "firstWeight1",
                "label": "首重重量1",
                "value": oldData.firstWeight1
            },{
                "prop": "furtherWeightPrice1",
                "label": "续重价格1",
                "value": oldData.furtherWeightPrice1
            },{
                "prop": "section2",
                "label": "总重区间2",
                "value": oldData.section2
            },{
                "prop": "firstWeightPrice2",
                "label": "首重价格2",
                "value": oldData.firstWeightPrice2
            },{
                "prop": "firstWeight2",
                "label": "首重重量2",
                "value": oldData.firstWeight2
            },{
                "prop": "furtherWeightPrice2",
                "label": "续重价格2",
                "value": oldData.furtherWeightPrice2
            },{
                "prop": "section3",
                "label": "总重区间3",
                "value": oldData.section3
            },{
                "prop": "firstWeightPrice3",
                "label": "首重价格3",
                "value": oldData.firstWeightPrice3
            },{
                "prop": "firstWeight3",
                "label": "首重重量3",
                "value": oldData.firstWeight3
            },{
                "prop": "furtherWeightPrice3",
                "label": "续重价格3",
                "value": oldData.furtherWeightPrice3
            }
        ];
        return data;

    },

    //新增官方价格
    onAddOfficialPrice: function(form,record){
        let oldRecord=  Utils.deepCopyValue(record);
        //数据处理
        if(typeof(oldRecord.originCode.split(',')[1]) !== "undefined"){
            oldRecord.originCode=oldRecord.originCode.split(',')[1];
        }else{
            oldRecord.originCode=oldRecord.originCode.split(',')[0];
        }
        //数据处理
        if(typeof(oldRecord.destinationCode.split(',')[1]) !== "undefined"){
            oldRecord.destinationCode=oldRecord.destinationCode.split(',')[1];
        }else{
            oldRecord.destinationCode=oldRecord.destinationCode.split(',')[0];
        }
        let data=this.buildAddData(oldRecord,oldRecord);
        var url = this.getServiceUrl('logistics_price/create');
        Utils.recordCreate(this, data, url);
    },

    // 对数值位做补零操作
    increaseNum: function(item){
        if(item===null){
            item=item;
        }else if(item===""){
            item=null;
        }else{
            item=parseFloat(item).toFixed(2);
        }
        return item;
    },

     //修改官方价格
    onUpdateOfficialPrice: function(form,record,oldRecord){
        var self = this;
        var url = this.getServiceUrl('logistics_price/update');
        //对新数值值做补零操作
        record.firstWeightPrice1=this.increaseNum(record.firstWeightPrice1);
        record.firstWeight1=this.increaseNum(record.firstWeight1);
        record.furtherWeightPrice1=this.increaseNum(record.furtherWeightPrice1);
        record.firstWeightPrice2=this.increaseNum(record.firstWeightPrice2);
        record.firstWeight2=this.increaseNum(record.firstWeight2);
        record.furtherWeightPrice2=this.increaseNum(record.furtherWeightPrice2);
        record.firstWeightPrice3=this.increaseNum(record.firstWeightPrice3);
        record.firstWeight3=this.increaseNum(record.firstWeight3);
        record.furtherWeightPrice3=this.increaseNum(record.furtherWeightPrice3);
        // 比较新值与旧值是否发生变化
        let newArr=[],oldArr=[],flag=true;
        newArr.push( record.section1,record.section2,record.section3,record.firstWeightPrice1, record.firstWeight1,record.furtherWeightPrice1,record.firstWeightPrice2, record.firstWeight2,record.furtherWeightPrice2,record.firstWeightPrice3, record.firstWeight3,record.furtherWeightPrice3);
        oldArr.push( oldRecord.section1,oldRecord.section2,oldRecord.section3,oldRecord.firstWeightPrice1, oldRecord.firstWeight1,oldRecord.furtherWeightPrice1,oldRecord.firstWeightPrice2, oldRecord.firstWeight2,oldRecord.furtherWeightPrice2,oldRecord.firstWeightPrice3, oldRecord.firstWeight3,oldRecord.furtherWeightPrice3);
        for (let i = 0; i < newArr.length; i++) {
            if(newArr[i] !== oldArr[i] ){
                flag = false;
                break;
            }
        }
        if(flag){
            self.fireEvent("update","",self);
        }else{
            let data=this.buildUpdateData(record,oldRecord);
            Utils.recordUpdate(this, data, url);
        }
    },

    //获取地址
    onGetAddress: function(organization) {
        var url = this.getServiceUrl('provinceCityRegion/getAllProvinceCityRegion');
        var self = this;
        Utils.doCreate(url, organization).then(function (result) {
            // 修改下面的程序
            self.addressData = [];
            self.addressData.push(result);
            self.fireEvent('getAddress', '', self);
        }, function(errMsg){
            self.fireEvent('getAddress', errMsg, self);
        });
    },

    //获取快递公司
    onGetCompany: function(filter) {
            var self = this;
            var url = this.getServiceUrl('logistics_price/getCompanyInfoByType');
            Utils.doRetrieveService(url, filter, self.startPage, self.pageRow, self.totalRow).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
                let logisticsCompanySet={
                    filter: filter,
                    recordSet: result.object,
                    operation: "getCompany",
                    errMsg: ''
                };
                window.sessionStorage.setItem("logisticsCompanySet",JSON.stringify(logisticsCompanySet));
            }
            else{
                let logisticsCompanySet={
                    filter: filter,
                    recordSet: result.object,
                    operation: "getCompany",
                    errMsg: '[' + result.errCode + ']处理错误，' + result.errDesc
                };
                window.sessionStorage.setItem("logisticsCompanySet",JSON.stringify(logisticsCompanySet));
            }
            }, function(value){
                self.fireEvent('getCompany', '调用服务错误', self);
            });
    },

    //获取快递公司与运输方式
    onNewGetCompany: function(filter) {
        var self = this;
        var url = this.getServiceUrl('logistics_price/getCompanyInfoByTypeEnhance');
        Utils.doCreate(url, filter).then(function(result) {
            if(result.errCode==null || result.errCode=='' || result.errCode=='000000'){
               self.filter  = filter;
               self.logisticsMessage = result;
               self.fireEvent("getCompanyInfoByTypeEnhance","",self);
            }else{
                Utils.handleServer(result.errCode);
                self.fireEvent('getCompanyInfoByTypeEnhance', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        }, function(value){
            self.fireEvent('getCompanyInfoByTypeEnhance', '调用服务错误', self);
        });
    },

    //获取运输方式
    onGetByCompanyUuid: function(filter){
        let self = this;
        var url = self.getServiceUrl('transport_type/get-by-companyUuid');
        Utils.doRetrieveService(url, filter).then(function(result){
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.transportType = result.object;
                window.sessionStorage.setItem("snapTransportType",JSON.stringify(result.object));
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('get-by-companyUuid', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
                window.sessionStorage.setItem("snapTransportType",JSON.stringify(result.object));
            }
        },function(value){
            self.fireEvent('get-by-companyUuid', '调用服务错误', self);
        });
    },

    //根据登陆类型查找机构地址
    onGetOrgCodebyOrgType: function(filter){
        let self = this;
        var url = self.getServiceUrl('organization/get-by-uuid');
        Utils.doGetRecordService(url, filter).then(function(result){
           if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.OrgCodeByOrgType = result.object;
                self.filter = filter;
                self.fireEvent('get-by-uuid', '', self);
            } else {
                Utils.handleServer(result.errCode);
                self.fireEvent('get-by-uuid', '[' + result.errCode + ']处理错误，' + result.errDesc, self);
            }
        },function(value){
            self.fireEvent('get-by-uuid', '调用服务错误', self);
        }); 

    },
    
    });

module.exports = officialPriceStore;
