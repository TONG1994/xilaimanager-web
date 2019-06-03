/**
 *   Create by Chenhui on 2018/4/19
 */
'use strict';

import React from 'react';
var Reflux = require('reflux');
import {Button, Input , Spin} from 'antd';

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var OfficialPriceStore = require('./data/OfficialPriceStore');
var OfficialPriceActions = require('./action/OfficialPriceActions');

//table
const tableName = 'officialPriceTable';
import DictTable from '../../../lib/Components/DictTable'
import FormUtil from '../../../lib/Components/FormUtil';
import UploadExcel from '../../lib/Components/UploadExcel'
import ExportExcel from '../../lib/Components/ExportExcel'
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ErrorDealWith from './components/ErrorDealWith';

var FormDef = require('./components/LogisticsPriceForm');
import './style/main2.scss';
//filter
import Filter from './components/Filter'

var filterValue = '';

var OfficialPricePage = React.createClass({
    getInitialState : function() {
        return {
            OfficialPriceSet: {
                recordSet: '',
                errMsg : ''
            },
            loading: false,
            OfficialPrice:{},
            OldData: '',
            oldDataOfReset:'',
            beforeData: '',
            hints: {},
            validRules: [],
            addDisable: false,
            oldCellVal:"",
            OrgCodeByOrgType:"",
            logisticsMessage:[],
            compareValue:{
                value1:"",
                value2:"",
                value3:""
            },
            updateTurnAdd: {
                doStatus: false,
                uuid:""
            },
        }
    },

    mixins: [Reflux.listenTo(OfficialPriceStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        // console.log(data);
        if(data.errMsg){
            this.setState({
              loading: false,
            });
            return;
        }
        Utils.deepCopyValue(data.recordSet, this.state.OfficialPriceSet);
        if(data.operation=='retrieveByFilter'){
            let mydata=Utils.deepCopyValue(data);
            this.transformData(mydata);
            this.setState({
                loading: false,
                addDisable: false,
                OldData: Utils.deepCopyValue(data.recordSet),
                OfficialPriceSet: Object.assign({}, this.state.OfficialPriceSet, mydata),
            });
        }else if(data.operation=='update' || data.operation=='create'){
            this.state.updateTurnAdd.doStatus=false;
            this.state.updateTurnAdd.uuid="";
            this.setState({ loading: false,addDisable: false});
            this.handleQueryClick();
        }else if(data.operation=='get-by-uuid'){
          this.setState({
            OrgCodeByOrgType: data.OrgCodeByOrgType
          })
        }else if(data.operation === "getCompanyInfoByTypeEnhance" ){
            this.setState({
                logisticsMessage: data.logisticsMessage
            });
            window.sessionStorage.setItem("logisticsMessage",JSON.stringify(data.logisticsMessage));
        }
    },
    // 刷新
    handleQueryClick: function (obj={}) {
        let dataSet = this.state.OfficialPriceSet;
        let conf = FormUtil.getTableConf(tableName);
        dataSet.pageRow = (conf.page !== true) ? 0 : Number(conf.pageRow);
        dataSet.startPage = (conf.page !== true) ? 0 : 1;
        this.setState({loading: true});
        OfficialPriceActions.retrieveofficialPrice(obj, dataSet.startPage, dataSet.pageRow);
    },

    //检验区间
    sectionCheck: function(Field,value){
        let match=/^[0-9]+[<][=]?[x]$|^[0-9]+[<][=]?[x][<][=]?[0-9]+$/;
        if(!match.test(value)){
            if(Field==="section1"){
                return "根据实际情况填写，比如：0＜x＜1，x为用户的快递重量，单位：公斤";
            }else if(Field==="section2"){
                return "根据实际情况填写，比如：1<=x＜3，x为用户的快递重量，单位：公斤";
            }else if(Field==="section3"){
                return "根据实际情况填写，比如：3<=x＜20，x为用户的快递重量，单位：公斤";
            }
            return "输入格式错误";
        }
        // console.log(this.state.compareValue);
    },
    // 校验价格
    floatAndIntCheck: function(value){
        let match=/^[0-9]+\.[0-9]{0,2}$|^[0-9]+$/;
        if(!match.test(value)){
            return "根据实际情况填写，比如：1，单位：元，最多支持两位小数";
        }
    },
    // 检验重量
    floatAndIntCheck2: function(value){
        let match=/^[0-9]+\.[0-9]{0,2}$|^[0-9]+$/;
        if(!match.test(value)){
            return "根据实际情况填写，比如：1，单位：公斤，最多支持两位小数";
        }
    },
    // 选择组件的非空校验
    notNullCheck: function(name,value){
        let rules =this.state.validRules;
        let recordRule = rules.find((rule)=>rule.id == name);
        let isEmpty = value === '' || value === null || typeof (value) === "undefined";
        if (isEmpty) {
            return '请选择【' + recordRule.desc + '】';
        }
    },
    // 第一次加载
    componentDidMount : function(){
       let staffInfo =JSON.parse(window.sessionStorage.getItem("loginData")).staffInfo;
       let myAttrs=[
            {
                name: 'section1',
                validator: this.sectionCheck.bind(this,"section1"),
            },
            {
                name: 'firstWeightPrice1',
                validator: this.floatAndIntCheck,
            },
            {
                name: 'firstWeight1',
                validator: this.floatAndIntCheck2,
            },
            {
                name: 'furtherWeightPrice1',
                validator: this.floatAndIntCheck,
            },
            {
                name: 'section2',
                validator: this.sectionCheck.bind(this,"section2"),
            },
            {
                name: 'firstWeightPrice2',
                validator: this.floatAndIntCheck,
            },
            {
                name: 'firstWeight2',
                validator: this.floatAndIntCheck2,
            },
            {
                name: 'furtherWeightPrice2',
                validator: this.floatAndIntCheck,
            },
            {
                name: 'section3',
                validator: this.sectionCheck.bind(this,"section3"),
            },
            {
                name: 'firstWeightPrice3',
                validator: this.floatAndIntCheck,
            },
            {
                name: 'firstWeight3',
                validator: this.floatAndIntCheck2,
            },
            {
                name: 'furtherWeightPrice3',
                validator: this.floatAndIntCheck,
            }
       ];
       this.state.validRules = FormDef.getRule(this,myAttrs);
       //查询列表
       this.handleQueryClick();
       //查询新快递公司
       let filter={};
       OfficialPriceActions.newGetCompany(filter);
       //根据登录人的类型查询始发地
       if(staffInfo.orgType !== "1"){
          OfficialPriceActions.getOrgCodebyOrgType(staffInfo.organizationUuid);
       }
    
    },
    //对查询出的地址数据转换用于显示
    transformData: function(data){
        let recordSet = data.recordSet;
        let newAddress =JSON.parse(window.sessionStorage.getItem("address"));
        for (let i = 0; i < recordSet.length; i++) {
            let flage1 = false,flage2 = false;
            outer:
            for (let j = 0; j < newAddress.length; j++) {
                if(newAddress[j].children){
                    for (let k = 0; k < newAddress[j].children.length; k++) {
                        if(recordSet[i].originCode == newAddress[j].children[k].value){
                            recordSet[i].originCode = newAddress[j].value+","+newAddress[j].children[k].value;
                            flage1=true;
                        }
                        if(recordSet[i].destinationCode == newAddress[j].children[k].value){
                            recordSet[i].destinationCode = newAddress[j].value+","+newAddress[j].children[k].value;
                            flage2=true;
                        }
                        if(flage1 && flage2){
                            break outer;
                        }
                    }
                }
            }
        }
        // *******我要查出市对应的完整省市
        this.state.oldDataOfReset=Utils.deepCopyValue(recordSet);
        return data;
    },

    onTableRefresh: function (current, pageRow) {
        let filterObj = this.filter.state.OfficialPrice;
        this.state.OfficialPriceSet.startPage = current;
        this.state.OfficialPriceSet.pageRow = pageRow;
        this.setState({loading:true});
        OfficialPriceActions.retrieveofficialPrice(filterObj, current, pageRow);
    },
    filterSearch:function () {
        let obj = this.filter.getFilter();
        if(obj){
            this.handleQueryClick(obj);
        }
    },
    resetFilter:function () {
        this.filter.clear();
        let obj = this.filter.getFilter();
        if(obj){
            this.handleQueryClick(obj);
        }
    },
    handleCallBack:function(){
        this.filter.clear();
        let obj = this.filter.getFilter();
        if(obj){
            setTimeout(this.handleQueryClick(obj),3000);

        }
    },
    getFilter:function(){
        let obj = {};
        if(this.filter){
            obj = this.filter.state.OfficialPrice;
        }
        return obj;
    },

    //清理比较区间的参数
    refreshCompareVal:function(){
        this.setState({
            compareValue:{
                value1:"",
                value2:"",
                value3:""
            }
        })
    },
    

    doMakeResultValue: function(name,value){
        // let match2=/^[0-9]{0,8}$/;
        // let match1=/^[0-9]{0,8}\.[0-9]{0,2}$/;
        // if(value===""){
        //     return value;
        // }
        if(name === "firstWeightPrice1"){
            // if(!match2.test(value)){
            //    value = value.substring(0,8)+".00";
            // }else if(!match1.test(value)){
            //    let rett=value.split(".");
            //    if(rett){
            //     value = rett[0].substring(0,8)+rett[1].substring(0,2);
            //    }
            // }
            value=parseFloat(value).toFixed(2);
        }else if(name === "firstWeight1"){
            
        }else if(name === "furtherWeightPrice1"){
            
        }else if(name === "firstWeightPrice2"){
            
        }else if(name === "firstWeight2"){
            
        }else if(name === "furtherWeightPrice2"){
            
        }else if(name === "firstWeightPrice3"){
            
        }else if(name === "firstWeight3"){
            
        }else if(name === "furtherWeightPrice3"){
            
        }
        return value;
    },

    //editTableMethod
    // 监听输入框变化
    onCellChange: function(name,record,value){
        const recordSet = this.state.OfficialPriceSet.recordSet;
        const target = recordSet.find(item => item.uuid === record.uuid);
        if (target) {
            // value=this.doMakeResultValue(name,value);
            target[name] = value.toString();
            this.setState({ 
                loading:false
            });
        }
    },

    // 检测输入框
    onCellCheck: function(name,record,value) {
        this.dealWithResultData(name,record,value);
    },

    //快递公司
    OnLogisticsCompanySelectedValue:function(name,record,value){
      this.dealWithResultData(name,record,value);
      let oldDataOfReset = this.state.oldDataOfReset;
      let targetOld = oldDataOfReset.find(item => item.uuid === record.uuid); 
      let recordSet = this.state.OfficialPriceSet.recordSet;
      if(record.recordType === "add"){
        for (const item of recordSet) {
            if(item.uuid === record.uuid){
                    item.transportTypeUuid = "";
            }
        }
        this.setState({
            loading :false
        })
      }else if(record.recordType === "edit"){
        if( value === "" || value === null ){
          for (const item2 of recordSet) {
            if(item2.uuid === record.uuid){
              item2.transportTypeUuid = targetOld.transportTypeUuid;
            }
          }
          this.setState({
              loading :false
          })
        }else{
          for (const item of recordSet) {
              if(item.uuid === record.uuid){
                      item.transportTypeUuid = "";
              }
          }
          this.setState({
              loading :false
          })
        }
      }
    },

    //运输方式
    OnTransportTypeSelectedValue:function(name,record,value){
        this.dealWithResultData(name,record,value);
    },

    //地区选择回调
    originAreaPosition:function (name,record,value) {
        this.dealWithResultData(name,record,value);
    },
    //地区选择回调
    destinationAreaPosition:function (name,record,value) {
        this.dealWithResultData(name,record,value);
    },

    //jianyan 返回true是相交fale是不相交
    cuttingData:function(section1,section2,section3,num){
      //根据条件造数据
      let result1,result2,result3;
      if(num === "12"){
        result1={
          data:section1.split(""),
          len:section1.split("").length
        };
        result2={
          data:section2.split(""),
          len:section2.split("").length
        };
      }else if(num === "13"){
        result1={
          data:section1.split(""),
          len:section1.split("").length
        };
        result2={
          data:section3.split(""),
          len:section3.split("").length
        };
      }else if(num === "23"){
        result1={
          data:section2.split(""),
          len:section2.split("").length
        };
        result2={
          data:section3.split(""),
          len:section3.split("").length
        };
      }else if(num === "123"){
        result1={
          data:section1.split(""),
          len:section1.split("").length
        };
        result2={
          data:section2.split(""),
          len:section2.split("").length
        };
        result3={
          data:section3.split(""),
          len:section3.split("").length
        };
      }
      
      //判断区间错误类型
      if(num==="12" || num==="13" || num==="23"){
          if(result1.len===3 && result2.len != 0){
              return "相交";
          }else if(result1.len===5 && result2.len===3 || result1.len===5 && result2.len===5){
              if(result1.data[1]==="<" && result1.data[3]==="<" || result1.data[1]==="<=" && result1.data[3]==="<"){
                  if(result2.data[0] <= result1.data[0] ){
                    return "区间需递增";
                  }else if(result2.data[0] < result1.data[4]){
                      if(num === "12"){
                        return "区间1与区间2相交"
                      }else if(num === "13"){
                        return "区间1与区间3相交"
                      }else if(num === "24"){
                        return "区间2与区间3相交"
                      }
                  }
              }else if(result1.data[1]==="<" && result1.data[1]==="<=" || result1.data[1]==="<=" && result1.data[1]==="<="){
                if( result2.data[0] <= result1.data[0] ){
                  return "区间需递增";
                }else if(result2.data[1]==="<="){
                  if(result2.data[0] <= result1.data[4]){
                    return "相交"
                  }
                }else if(result2.data[1]==="<"){
                  if(result2.data[0] < result1.data[4]){
                    return "相交"
                  }
                }
              }
          }
      }else if(num==="123"){
          if(result2.len===3 && result3.len != 0){
              return "相交";
          }else if(result2.len===5 && result3.len===3 || result2.len===5 && result3.len===5){
              if(result2.data[1]==="<" && result2.data[3]==="<" || result2.data[1]==="<=" && result2.data[3]==="<"){
                  if(result3.data[0] <= result2.data[0] ){
                    return "区间需递增";
                  }else if(result3.data[0] < result2.data[4]){
                    return "相交"
                  }
              }else if(result2.data[1]==="<" && result2.data[1]==="<=" || result2.data[1]==="<=" && result2.data[1]==="<="){
                if( result3.data[0] <= result2.data[0] ){
                  return "区间需递增";
                }else if(result3.data[1]==="<="){
                  if(result3.data[0] <= result2.data[4]){
                    return "相交"
                  }
                }else if(result3.data[1]==="<"){
                  if(result3.data[0] < result2.data[4]){
                    return "相交"
                  }
                }
              }
          }
      }
      return "";
    },

    //校验区间是否重合
    spaceCheck: function(record){
        if(record.section1 && record.section2 && !record.section3){
        //   console.log("区间1与区间2");
          let msg=this.cuttingData(record.section1,record.section2,"","12");
          return msg;
        }else if(record.section1 && record.section3 && !record.section2){
        //   console.log("区间1与区间3");
          let msg=this.cuttingData(record.section1,record.section3,"","13");
          return msg;
        }else if(record.section2 && record.section3 && !record.section1){
        //   console.log("区间2与区间3");
          let msg=this.cuttingData(record.section2,record.section3,"","23");
          return msg;
        }else if(record.section2 && record.section3 && record.section3){
        //   console.log("区间1与区间2与区间3");
          let msg=this.cuttingData(record.section1,record.section2,record.section3,"123");
          return msg;
        }
    },

    //每个输入框确定值时的onSelect(触发的方法)
    dealWithResultData: function(name,record,value){
        // //检验区间是否重合
        // if(name==="section1" || name==="section2" || name==="section3"){
        //   let checkResult=this.spaceCheck(record);
        //   if(checkResult && name ==="section1"){
        //     this.EditableCell1.showMessage(checkResult);
        //     return;
        //   }else if(checkResult && name ==="section2"){
        //     this.EditableCell5.showMessage(checkResult);
        //     return;
        //   }else if(checkResult && name ==="section3"){
        //     this.EditableCell9.showMessage(checkResult);
        //     return;
        //   }
        // }
        let oldDataOfReset = this.state.oldDataOfReset;
        const recordSet = this.state.OfficialPriceSet.recordSet;
        const target = recordSet.find(item => item.uuid === record.uuid);
        let targetOld = oldDataOfReset.find(item => item.uuid === record.uuid);
        //给值做检验和值错误时的操作
        if(!targetOld){
            targetOld = this.getInitrecordSetData();
        }
        if (target) {
            target[name] = value===null?null:value.toString();
            this.setState({ 
                loading:false
            });
            if(Common.validator(this,target,name)){
                return;
            }else{               
                this.setState({ 
                    newloading:false
                });
            }
        }
        //报错提示语
        let content="";
        switch (name) {
            case "logisticsCompanyUuid":
                content="请选择【快递公司】";
                this.FYSelect1.showMessage(content);
                break;
            case "transportTypeUuid":
                content="请选择【运输方式】";
                this.FYSelect2.showMessage(content);
                break;
            case "originCode":
                content="请选择【始发地】";
                this.AreaPosition1.showMessage(content);
                break;
            case "destinationCode":
                content="请选择【目的地】";
                this.AreaPosition2.showMessage(content);
                break;
            case "section1":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell1.showMessage(content);
                break;
            case "firstWeightPrice1":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell2.showMessage(content);
                break;
            case "firstWeight1":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell3.showMessage(content);
                break;
            case "furtherWeightPrice1":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell4.showMessage(content);
                break;
            case "section2":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell5.showMessage(content);
                break;
            case "firstWeightPrice2":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell6.showMessage(content);
                break;
            case "firstWeight2":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell7.showMessage(content);
                break;
            case "furtherWeightPrice2":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell8.showMessage(content);
                break;
            case "section3":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell9.showMessage(content);
                break;
            case "firstWeightPrice3":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell10.showMessage(content);
                break;
            case "firstWeight3":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell11.showMessage(content);
                break;
            case "furtherWeightPrice3":
                content=this.state.hints[name+"Hint"].props.children;
                this.EditableCell12.showMessage(content);
                break;
            default:
                break;
        }
    },

    tranAddressData: function(code){
      let flage = false,codeName = "";
      let address =JSON.parse(window.sessionStorage.getItem("address"));
      outer:
      for (let j = 0; j < address.length; j++) {
        if(address[j].children){
          for (let k = 0; k < address[j].children.length; k++) {
              if(code == address[j].children[k].value){
                  codeName = address[j].children[k].label;
                  flage=true;
              }
              if(flage){
                  break outer;
              }
          }
        }
      }
      return codeName;
    },
    
    //获取初始化的字段值
    getInitrecordSetData: function(){
        const dataSource = this.state.OfficialPriceSet.recordSet;
        let loginData = JSON.parse(window.sessionStorage.getItem("loginData")).staffInfo;
        let originName = this.tranAddressData(this.state.OrgCodeByOrgType.manageCity?this.state.OrgCodeByOrgType.manageCity:"");
        let initData={
            alias1: null,
            alias2: null,
            alias3: null,
            alias4: null,
            alias5: null,
            alias6: null,
            alias7: null,
            alias8: null,
            alias9: null,
            beforeData: null,
            code:"官方价格ID",
            destination: "",
            destinationCode: "",
            firstWeight1: "",
            firstWeight2: null,
            firstWeight3: null,
            firstWeightPrice1: "",
            firstWeightPrice2: null,
            firstWeightPrice3: null,
            furtherWeightPrice1: "",
            furtherWeightPrice2: null,
            furtherWeightPrice3: null,
            logicCode: null,
            logisticsCompanyName: "",
            logisticsCompanyUuid: "",
            menuName: null,
            orgName: loginData.orgName,
            origin: loginData.orgType !== "1" ? originName : "",
            originCode: loginData.orgType !== "1" ? this.state.OrgCodeByOrgType.manageCity : "",
            recordType:"add",
            orgType: loginData.orgType,
            section1:"",
            section2: null,
            section3: null,
            transportTypeName: "",
            transportTypeUuid: "",
            uuid: dataSource.length?dataSource.length:"11",
        }
        return initData;
    },

    //新增
    handleAdd: function(){
        const dataSource = this.state.OfficialPriceSet.recordSet;
        let oldDataOfReset = this.state.oldDataOfReset;
        let updateTurnAdd = this.state.updateTurnAdd;
        if(updateTurnAdd.uuid !=="" || updateTurnAdd.doStatus !==false){
            let targetOldkey = oldDataOfReset.findIndex(item => item.uuid === updateTurnAdd.uuid);
            let oldRecordVal = oldDataOfReset.find(item => item.uuid === updateTurnAdd.uuid);    
            if(targetOldkey  || targetOldkey === 0){
                dataSource[targetOldkey] = Object.assign(dataSource[targetOldkey],oldRecordVal);
            }
        }
        for (const item of dataSource) {
            item.recordType = "retrieve";
        }
        const newData = this.getInitrecordSetData();
        dataSource.unshift(newData);
        //刷新数值
        this.state.updateTurnAdd.doStatus=false;
        this.state.updateTurnAdd.uuid="";
        this.setState({
            loading:false,
            addDisable:true,
        });
    },

    //取消
    cancleOperate: function(record){
        let recordSet = this.state.OfficialPriceSet.recordSet;
        let oldDataOfReset = this.state.oldDataOfReset;
        if(record.recordType == "add"){
            recordSet.splice(recordSet.findIndex(val => val.uuid === record.uuid), 1);
            this.setState({ addDisable: false });
        }else if(record.recordType == "edit"){
            let targetOldkey = oldDataOfReset.findIndex(item => item.uuid === record.uuid);
            let oldRecordVal = oldDataOfReset.find(item => item.uuid === record.uuid);
            if(targetOldkey  || targetOldkey === 0){
              recordSet[targetOldkey] = Object.assign(recordSet[targetOldkey],oldRecordVal);
            }
            for (const item of recordSet) {
                if(record.uuid == item.uuid ){
                    item.recordType = "retrieve";
                }
            }
            this.setState({
              loading: false
            });
        };
        this.setState({
            loading:false
        });
    },

    //修改
    updateOperate: function(record){
        let recordSet = this.state.OfficialPriceSet.recordSet;

        for (const item of recordSet) {
            if(record.uuid == item.uuid ){
                item.recordType = "edit";
            }else{
                item.recordType = "retrieve";
            }
        }
        if(recordSet.length >10){
          recordSet.splice(0, 1);
          this.setState({ addDisable:false })
        }
        this.state.updateTurnAdd.doStatus=true;
        this.state.updateTurnAdd.uuid=record.uuid;
        this.setState({ loading:false});
    },

    formatValue: function(value){
        if(value){
            let val= value.split(".");
            if(val[1]){
                let red= val[1].split("");
                if(red[0]==="0"){
                    if(red[1]==="0"){
                        value = val[0];
                    }else if(red[1] !=="0"){
                        value =value;
                    }
                }else if(red[0]!=="0"){
                    if(red[1]==="0"){
                        value = val[1]+"."+red[0];
                    }else if(red[1] !=="0"){
                        value =value;
                    }
                }
            }
        }
        return value;
    },
    makeFormatValue: function(reData){
        reData.firstWeightPrice1=this.formatValue(reData.firstWeightPrice1);
        reData.firstWeight1=this.formatValue(reData.firstWeight1);
        reData.furtherWeightPrice1=this.formatValue(reData.furtherWeightPrice1);
        reData.firstWeightPrice2=this.formatValue(reData.firstWeightPrice2);
        reData.firstWeight2=this.formatValue(reData.firstWeight2);
        reData.furtherWeightPrice2=this.formatValue(reData.furtherWeightPrice2);
        reData.firstWeightPrice3=this.formatValue(reData.firstWeightPrice3);
        reData.firstWeight3=this.formatValue(reData.firstWeight3);
        reData.furtherWeightPrice3=this.formatValue(reData.furtherWeightPrice3);
        return reData;
    },  

    //保存
    saveOperate: function(record){
        //数据处理
        let oldData = this.state.OldData;
        let logisticsMessage = this.state.logisticsMessage;
        let oldRecord = oldData.find(item=>item.uuid === record.uuid);
        let newOldRecord,newRecord;
        if(record.recordType === "edit"){
            let myOldRecord = Utils.deepCopyValue(oldRecord);
            let myRecord = Utils.deepCopyValue(record);
            newOldRecord = this.makeFormatValue(myOldRecord);
            newRecord = this.makeFormatValue(myRecord);
        }else if(record.recordType === "add"){
            newOldRecord = record;
            newRecord = record;
        }
        if(logisticsMessage){
            let company = logisticsMessage.find(item=>item.code===record.logisticsCompanyUuid);
            if(company && company.children){
                let transport = company.children.find(item=>item.code === record.transportTypeUuid);
                let code1 = record.originCode.split(",")[1];
                let code2 = record.destinationCode.split(",")[1];
                if(transport){
                    record.logicCode = transport.alias+"-"+code1+"-"+code2;
                }else{
                    record.logicCode = "无运输方式"+"-"+code1+"-"+code2;
                }
            }
        }
        //新增修改
        if(Common.validator(this,newRecord)){
            if( record.recordType === "add" ){
                this.setState({ loading:true });
                OfficialPriceActions.addOfficialPrice(this,newRecord);
            }else if(record.recordType === "edit"){
                this.setState({ loading:true });
                OfficialPriceActions.updateOfficialPrice(this,record,oldRecord);
            }
            this.setState({ addDisable: false });
        }else{
            let content=this.makeError();
            ErrorDealWith.ErrModal(<span style={{color:"red"}}>{content}未填写！</span>);
        }
    },

    //错误显示
    makeError:function(){
      let hints = this.state.hints;
    //   console.log(hints);
      let content = "";
      let logisticsCompanyUuidStatusError = hints.logisticsCompanyUuidStatus==="error"?"【快递公司】":"",
          transportTypeUuidStatusError = hints.transportTypeUuidStatus==="error"?"【运输方式】":"",
          originCodeStatusError = hints.originCodeStatus==="error"?"【始发地】":"",
          destinationCodeStatusError = hints.destinationCodeStatus==="error"?"【目的地】":"",
          section1StatusError = hints.section1Status==="error"?"【总重区间1】":"",
          firstWeightPrice1StatusError = hints.firstWeightPrice1Status==="error"?"【首重价格1】":"",
          firstWeight1StatusError = hints.firstWeight1Status==="error"?"【首重重量1】":"",
          furtherWeightPrice1StatusError = hints.furtherWeightPrice1Status==="error"?"【续重价格1】":"",
          //2
          section2StatusError = hints.section2Status==="error"?"【总重区间2】":"",
          firstWeightPrice2StatusError = hints.firstWeightPrice2Status==="error"?"【首重价格2】":"",
          firstWeight2StatusError = hints.firstWeight2Status==="error"?"【首重重量2】":"",
          furtherWeightPrice2StatusError = hints.furtherWeightPrice2Status==="error"?"【续重价格2】":"",
          //3
          section3StatusError = hints.section3Status==="error"?"【总重区间3】":"",
          firstWeightPrice3StatusError = hints.firstWeightPrice3Status==="error"?"【首重价格3】":"",
          firstWeight3StatusError = hints.firstWeight3Status==="error"?"【首重重量3】":"",
          furtherWeightPrice3StatusError = hints.furtherWeightPrice3Status==="error"?"【续重价格3】":"";

          if(logisticsCompanyUuidStatusError){
            content = logisticsCompanyUuidStatusError;
          }
          if(transportTypeUuidStatusError && logisticsCompanyUuidStatusError){
            content =content+"、"+transportTypeUuidStatusError;
          }else if(transportTypeUuidStatusError && !logisticsCompanyUuidStatusError){
            content =content+transportTypeUuidStatusError;
          }else{
            content =content;
          }
          if(originCodeStatusError && transportTypeUuidStatusError){
            content =content+"、"+originCodeStatusError;
          }else if(originCodeStatusError && !transportTypeUuidStatusError){
            content =content+originCodeStatusError;
          }else{
            content =content;
          }
          if(destinationCodeStatusError && originCodeStatusError){
            content =content+"、"+destinationCodeStatusError;
          }else if(destinationCodeStatusError && !originCodeStatusError){
            content =content+destinationCodeStatusError;
          }else{
            content =content;
          }
          if(section1StatusError && destinationCodeStatusError){
            content =content+"、"+section1StatusError;
          }else if(section1StatusError && !destinationCodeStatusError){
            content =content+section1StatusError;
          }else{
            content =content;
          }
          if(firstWeightPrice1StatusError && section1StatusError){
            content =content+"、"+firstWeightPrice1StatusError;
          }else if(firstWeightPrice1StatusError && !section1StatusError){
            content =content+firstWeightPrice1StatusError;
          }else{
            content =content;
          }
          if(firstWeight1StatusError && firstWeightPrice1StatusError){
            content =content+"、"+firstWeight1StatusError;
          }else if(firstWeight1StatusError && !firstWeightPrice1StatusError){
            content =content+firstWeight1StatusError;
          }else{
            content =content;
          }
          if(furtherWeightPrice1StatusError && firstWeight1StatusError){
            content =content+"、"+furtherWeightPrice1StatusError;
          }else if(furtherWeightPrice1StatusError && !firstWeight1StatusError){
            content =content+furtherWeightPrice1StatusError;
          }else{
            content =content;
          }
          //2
          if(section2StatusError && furtherWeightPrice2StatusError){
            content =content+"、"+section2StatusError;
          }else if(section2StatusError && !furtherWeightPrice2StatusError){
            content =content+section2StatusError;
          }else{
            content =content;
          }
          if(firstWeightPrice2StatusError && section2StatusError){
            content =content+"、"+firstWeightPrice1StatusError;
          }else if(firstWeightPrice2StatusError && !section2StatusError){
            content =content+firstWeightPrice2tatusError;
          }else{
            content =content;
          }
          if(firstWeight2StatusError && firstWeightPrice2StatusError){
            content =content+"、"+firstWeight2StatusError;
          }else if(firstWeight2StatusError && !firstWeightPrice2StatusError){
            content =content+firstWeight2StatusError;
          }else{
            content =content;
          }
          if(furtherWeightPrice2StatusError && firstWeight2StatusError){
            content =content+"、"+furtherWeightPrice2StatusError;
          }else if(furtherWeightPrice2StatusError && !firstWeight2StatusError){
            content =content+furtherWeightPrice2StatusError;
          }else{
            content =content;
          }
          //3
          if(section3StatusError && furtherWeightPrice3StatusError){
            content =content+"、"+section3StatusError;
          }else if(section3StatusError && !furtherWeightPrice3StatusError){
            content =content+section3StatusError;
          }else{
            content =content;
          }
          if(firstWeightPrice3StatusError && section3StatusError){
            content =content+"、"+firstWeightPrice3StatusError;
          }else if(firstWeightPrice3StatusError && !section3StatusError){
            content =content+firstWeightPrice3tatusError;
          }else{
            content =content;
          }
          if(firstWeight3StatusError && firstWeightPrice3StatusError){
            content =content+"、"+firstWeight3StatusError;
          }else if(firstWeight3StatusError && !firstWeightPrice3StatusError){
            content =content+firstWeight3StatusError;
          }else{
            content =content;
          }
          if(furtherWeightPrice3StatusError && firstWeight3StatusError){
            content =content+"、"+furtherWeightPrice3StatusError;
          }else if(furtherWeightPrice3StatusError && !firstWeight3StatusError){
            content =content+furtherWeightPrice3StatusError;
          }else{
            content =content;
          }
      return content;
    },

    render : function() {
        let disabled ={display:''},isShow=true;
        var type = Common.getUserType();
        if(type == '3' || type == null){
            disabled = {display:'none'};
            isShow =false;
        }
        let excelUrl = type=='1'?'/resources/官方价格表模板-总部.xlsx':'/resources/官方价格表模板.xlsx';
        let recordSet = Common.filter(this.state.OfficialPriceSet.recordSet, filterValue);
        let leftButtons = [
                <Button icon={Common.iconSearch} title="查询" type='primary' onClick={this.filterSearch} key='查询'>查询</Button>,
                <Button icon={Common.iconAdd} title="新增" onClick={this.handleAdd} className='btn-margin' key='新增' disabled={this.state.addDisable} style={disabled}>新增</Button>,
                <Button icon={Common.iconReset} title="重置" onClick={this.resetFilter} className='btn-margin' key="重置">重置</Button>,
                <UploadExcel module='officialPrice' callback={this.handleCallBack} className='btn-margin' visible={isShow}/>,
                <ExportExcel module='officialPrice' filter={this.getFilter()}/>,
                <a href={ excelUrl }><Button icon={Common.iconDownload} title="模板下载"  className='btn-margin' key="模板下载" style={disabled}>模板下载</Button></a>,
            ];
        let operCol;
        if(type=='1' || type=='2'){
            operCol = {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, record) => {
                    let viewType;
                    if((type=='1' && record.orgType == type) || (type=='2' && record.orgType == type)){
                        if(record.recordType === "add" || record.recordType === "edit"){
                            viewType=(
                                <span>
                                    <a href="#" title='取消' ><Button onClick={this.cancleOperate.bind(this,record)}>取消</Button></a>
                                    <a href="#" title='保存' className='btn-margin'><Button  onClick={this.saveOperate.bind(this,record)}  loading={this.state.loading} disabled={this.state.loading}>保存</Button></a>
                                </span>
                            )
                        }else{
                            viewType=(
                                <span>
                                    <a href="#" title='修改' onClick={this.updateOperate.bind(this,record)}><Button>修改</Button></a>
                                </span>
                            )
                        }
                    }
                    return viewType
                },
            };
        }else if(type=='3'){
            operCol=null;
        };
        
        // 表格属性
        let attrs = {
            self: this,
            tableName: tableName,
            primaryKey: 'uuid',
            fixedTool: false,    // 固定按钮，不滚动
            buttons: leftButtons,
            btnPosition: 'top',
            //rightButtons: rightButtons,
            operCol: operCol,
            tableForm: FormDef,
            editCol: false,
            editTable: false,
            defView: 'officialPriceTable',//tableForm的 tableView的一个name
            totalPage: this.state.OfficialPriceSet.totalRow,//修改state
            currentPage: this.state.OfficialPriceSet.startPage,//修改state
            onRefresh: this.onTableRefresh,//分页
           // onRefresh: false,//不分页
        };
        return (
            <div className='grid-page'>
                <ServiceMsg ref='mxgBox' svcList={['logistics_price/retrieveByFilter','logistics_price/create','logistics_price/update','logistics_price/getCompanyInfo']}/>
                <Filter ref={ref=>this.filter = ref} />
                <div className="office-table" id="officePrice-table">
                <DictTable dataSource={recordSet} className="sw" loading={this.state.loading} attrs={attrs} />
                </div>
            </div>
        );
    }
});

module.exports = OfficialPricePage;