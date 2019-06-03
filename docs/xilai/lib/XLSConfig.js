'use strict';

/**
 * XLS配置文件
 * 格式为 'moduleName':{uploadUrl:'', downloadUrl:'', option:{}, uploadFields:[], downloadFields:[]}
 * moduleName为调用模块名，即父组件的名字
 * uploadUrl为上传地址
 * downloadUrl为导出地址
 * uploadFields为上传Excel文件的字段，一般要与服务端的字段保持一致，需要跟后台人员商量
 * downloadFields为导出Excel文件的字段，同上
 * option为扩展参数，目前只支持dataCheckUrl属性，该属性是指定检查Excel文件数据接口地址
 * 数据统计说明：在导入Excel之前，需要提示用户当前数据库中有多少条数据，Excel中有多少条数据，是否导入
 * 
 * 数据统计只在导入时才会进行
 * 始发地检查只有导入官方价格时生效
 * Excel数据检查返回的数据格式为{excelNum:"", databaseNum:"", isOrigin:"", countOrigin:""}
 * 
 * excelNum：当前Excel文件中的信息数量，如果为0，需要提示用户重新选择Excel文件
 * databaseNum：当前数据库中存在的信息数量
 * isOrigin：当前导入信息的始发地是否与当前机构所在地一直，值有两种，"true"和"false"，均为string类型
 * countOrigin：只有当isOrigin为"false"才有效，表示当前Excel一共有多少条事发地与当前所在地不一致的信息
 * */
module.exports = {
    // 官方价格
    officialPrice: {
        uploadUrl: 'logistics_price/upload-xls',
        downloadUrl: 'logistics_price/export-excel',
        option: {
            // 数据检查地址
            dataCheckUrl: 'logistics_price/upload-xls-inspect'
        },
        uploadFields: [
          {"id":"A","name":"logisticsCompanyUuid","title":"快递公司","opts":"jjjj","width":"10"},
          {"id":"B","name":"transportTypeUuid","title":"运输方式","opts":"bbbbb","width":"10"},
          {"id":"C","name":"origin","title":"始发地","opts":"bbbbb","width":"10"},
          {"id":"D","name":"destination","title":"目的地","opts":"bbbbb","width":"10"},
          {"id":"E","name":"fromWhere","title":"数据来源","opts":"bbbbb","width":"10"},
          {"id":"F","name":"section1","title":"总重区间1","opts":"bbbbb","width":"10"},
          {"id":"G","name":"firstWeightPrice1","title":"首重价格1","opts":"bbbbb","width":"10"},
          {"id":"H","name":"firstWeight1","title":"首重重量1","opts":"bbbbb","width":"10"},
          {"id":"I","name":"furtherWeightPrice1","title":"续重价格1","opts":"bbbbb","width":"10"},
          {"id":"J","name":"section2","title":"总重区间2","opts":"bbbbb","width":"10"},
          {"id":"K","name":"firstWeightPrice2","title":"首重价格2","opts":"bbbbb","width":"10"},
          {"id":"L","name":"firstWeight2","title":"首重重量2","opts":"bbbbb","width":"10"},
          {"id":"M","name":"furtherWeightPrice2","title":"续重价格2","opts":"bbbbb","width":"10"},
          {"id":"N","name":"section3","title":"总重区间3","opts":"bbbbb","width":"10"},
          {"id":"O","name":"firstWeightPrice3","title":"首重价格3","opts":"bbbbb","width":"10"},
          {"id":"P","name":"firstWeight3","title":"首重重量3","opts":"bbbbb","width":"10"},
          {"id":"Q","name":"furtherWeightPrice3","title":"续重价格3","opts":"bbbbb","width":"10"},
          {"id":"R","name":"creator","title":"创建者","opts":"bbbbb","width":"10"},
          {"id":"S","name":"createTime","title":"创建日期","opts":"bbbbb","width":"10"},
          {"id":"T","name":"active","title":"有效性","opts":"bbbbb","width":"10"}
        ],
        downloadFields: [
            { "id": "A", "name": "logisticsCompanyName", "title": "快递公司", "width": "15" },
            { "id": "B", "name": "transportTypeName", "title": "运输方式", "width": "15" },
            { "id": "C", "name": "origin", "title": "始发地", "width": "15" },
            { "id": "D", "name": "destination", "title": "目的地", "width": "15" },
            { "id": "E", "name": "orgName", "title": "数据来源", "width": "20" },
            { "id": "F", "name": "section1", "title": "总重区间1", "width": "15" },
            { "id": "G", "name": "firstWeightPrice1", "title": "首重价格1", "width": "15" },
            { "id": "H", "name": "firstWeight1", "title": "首重重量1", "width": "15" },
            { "id": "I", "name": "furtherWeightPrice1", "title": "续重价格1", "width": "15" },
            { "id": "J", "name": "section2", "title": "总重区间2", "width": "15" },
            { "id": "K", "name": "firstWeightPrice2", "title": "首重价格2", "width": "15" },
            { "id": "L", "name": "firstWeight2", "title": "首重重量2", "width": "15" },
            { "id": "M", "name": "furtherWeightPrice2", "title": "续重价格2", "width": "15" },
            { "id": "N", "name": "section3", "title": "总重区间3", "width": "15" },
            { "id": "O", "name": "firstWeightPrice3", "title": "首重价格3", "width": "15" },
            { "id": "P", "name": "firstWeight3", "title": "首重重量3", "width": "15" },
            { "id": "Q", "name": "furtherWeightPrice3", "title": "续重价格3", "width": "15" },
            { "id": "R", "name": "creator", "title": "创建者", "width": "15" },
            { "id": "S", "name": "createTime", "title": "创建日期", "width": "25" },
            { "id": "T", "name": "active", "title": "有效性", "width": "15" }
        ]
    }
    ,

    // 渠道价格
    channelPrice: {
        uploadUrl: 'channel_price/upload-xls',
        downloadUrl: 'channel_price/export-excel',
        uploadFields: [],
        downloadFields: [
            { "id": "A", "name": "logisticsCompanyName", "title": "快递公司", "width": "15" },
            { "id": "B", "name": "transportTypeName", "title": "运输方式", "width": "15" },
            { "id": "C", "name": "origin", "title": "始发地", "width": "15" },
            { "id": "D", "name": "destination", "title": "目的地", "width": "15" },
            { "id": "E", "name": "orgName", "title": "数据来源", "width": "20" },
            { "id": "F", "name": "section1", "title": "总重区间1", "width": "15" },
            { "id": "G", "name": "firstWeightPrice1", "title": "首重价格1", "width": "15" },
            { "id": "H", "name": "firstWeight1", "title": "首重重量1", "width": "15" },
            { "id": "I", "name": "furtherWeightPrice1", "title": "续重价格1", "width": "15" },
            { "id": "J", "name": "section2", "title": "总重区间2", "width": "15" },
            { "id": "K", "name": "firstWeightPrice2", "title": "首重价格2", "width": "15" },
            { "id": "L", "name": "firstWeight2", "title": "首重重量2", "width": "15" },
            { "id": "M", "name": "furtherWeightPrice2", "title": "续重价格2", "width": "15" },
            { "id": "N", "name": "section3", "title": "总重区间3", "width": "15" },
            { "id": "O", "name": "firstWeightPrice3", "title": "首重价格3", "width": "15" },
            { "id": "P", "name": "firstWeight3", "title": "首重重量3", "width": "15" },
            { "id": "Q", "name": "furtherWeightPrice3", "title": "续重价格3", "width": "15" },
            { "id": "R", "name": "creator", "title": "创建者", "width": "15" },
            { "id": "S", "name": "createTime", "title": "创建日期", "width": "25" },
            { "id": "T", "name": "active", "title": "有效性", "width": "15" }
        ]
    },

    // 利润设置
    profitSharing: {
        uploadUrl: 'profit_allocation/upload-xls',
        downloadUrl: 'profit_allocation/export-excel',
        option: {
            // 检查数据的地址
            dataCheckUrl: 'profit_allocation/upload-excel-inspect'
        },
        uploadFields: [
            {"id":"A","name":"logisticsCompanyUuid","title":"快递公司","width":"15"},
            {"id":"B","name":"transportTypeUuid","title":"运输方式","width":"15"},
            {"id":"C","name":"fromWhere","title":"数据来源","width":"25"},
            {"id":"D","name":"thirdpartyProfit","title":"三方分成比例","width":"25"},
            {"id":"E","name":"headquartersProfit","title":"总部分成比例","width":"25"},
            {"id":"F","name":"lastProfit","title":"经营中心加服务站比例","width":"25"}
        ],
        // 加盟型导入
        operateJoinUpload: [
            { "id": "A", "name": "logisticsCompanyUuid", "title": "快递公司", "width": "15" },
            { "id": "B", "name": "transportTypeUuid", "title": "运输方式", "width": "15" },
            { "id": "C", "name": "thirdpartyProfit", "title": "三方分成比例", "width": "25" },
            {"id" : "D", "name": "businessCenterProfit","title":"经营中心分成比例","width":"25"},
            {"id" : "E", "name": "branchProfit","title":"服务站分成比例","width":"25"}
        ],
        //直营型导入
        directBusinessUpload: [
            {"id":"A","name":"logisticsCompanyUuid","title":"快递公司","width":"15"},
            {"id":"B","name":"transportTypeUuid","title":"运输方式","width":"15"},
            {"id":"C","name":"businessCenterProfit","title":"经营中心分成比例","width":"25"},
            {"id":"D","name":"branchProfit","title":"服务站分成比例","width":"25"}
        ],
        //总部账号的直营
        downloadFields: [{"id":"A","name":"logisticsCompanyName","title":"快递公司","width":"15"},{"id":"B","name":"transportTypeName","title":"运输方式","width":"15"},{"id":"C","name":"fromWhere","title":"数据来源","width":"25"},{"id":"D","name":"thirdpartyProfit","title":"三方分成比例","width":"25"},{"id":"E","name":"headquartersProfit","title":"总部分成比例","width":"25"},{"id":"F","name":"lastProfit","title":"经营中心加服务站比例","width":"25"}],
        //总部账号的加盟
        headquartersJoin:[{"id":"A","name":"fromWhere","title":"数据来源","width":"15"},{"id":"B","name":"logisticsCompanyName","title":"快递公司","width":"15"},{"id":"C","name":"transportTypeName","title":"运输方式","width":"25"},{"id":"D","name":"thirdpartyProfit","title":"三方分成比例","width":"25"},{"id":"E","name":"businessCenterProfit","title":"经营中心分成比例","width":"25"},{"id":"F","name":"branchProfit","title":"服务站分成比例","width":"25"}],
        //经营中心的直营
        directBusiness:[{"id":"A","name":"logisticsCompanyName","title":"快递公司","width":"15"},{"id":"B","name":"transportTypeName","title":"运输方式","width":"15"},
        {"id":"C","name":"businessCenterProfit","title":"经营中心分成比例","width":"25"},
        {"id":"D","name":"branchProfit","title":"服务站分成比例","width":"25"}
        ],
        //经营中心加盟
       operateJoin:[{"id":"A","name":"logisticsCompanyName","title":"快递公司","width":"15"},{"id":"B","name":"transportTypeName","title":"运输方式","width":"15"},
        {"id":"C","name":"thirdpartyProfit","title":"三方分成比例","width":"25"},{"id":"D","name":"businessCenterProfit","title":"经营中心分成比例","width":"25"},
        {"id":"E","name":"branchProfit","title":"服务站分成比例","width":"25"}
      ]
    },

    // 交易流水
    tradingFlowLog:{
        downloadUrl:'tradingFlow/export-excel',
        downloadFields:[
            { "id": "A", "name": "tradingNo", "title": "流水编号", "width": "15" },
            { "id": "B", "name": "orderNo", "title": "订单编号", "width": "25" },
            { "id": "C", "name": "orderOrginalName", "title": "订单来源", "width": "25" },
            { "id": "D", "name": "logisticsCompanyName", "title": "快递公司", "width": "15" },
            { "id": "E", "name": "fromOrgName", "title": "支出方", "width": "25" },
            { "id": "F", "name": "toOrgName", "title": "收入方", "width": "25" },
            { "id": "G", "name": "tradingTypeName", "title": "流水分类", "width": "25" },
            { "id": "H", "name": "tradingAmount", "title": "金额(元)", "width": "15" },
            { "id": "I", "name": "createTime", "title": "流水创建时间", "width": "25" },
        ]
    },

    // 账单管理
    billManager:{
        downloadUrl:'manageBill/export-excel-bill',
        downloadFields:[
            {"id":"A", "name":"billNo", "title":"账单编号", "width":"30"},
            {"id":"B", "name":"orgNo", "title":"机构编号", "width":"30"},
            {"id":"C", "name":"orgName", "title":"机构名称", "width":"25"},
            {"id":"D", "name":"profitAmount", "title":"分成金额(元)", "width":"25"},
            {"id":"E", "name":"billDate", "title":"账单日期", "width":"25"}
        ]
    },

    // 账单明细
    billDetail:{
        downloadUrl:'/manageBill/export-excel-billDetail',
        downloadFields:[
            {"id":"A", "name":"orderNo", "title":"关联订单号", "wdith":"30"},
            {"id":"B", "name":"logisticsCompanyName", "title":"快递公司", "wdith":"25"},
            {"id":"C", "name":"courierNo", "title":"快递员ID", "wdith":"30"},
            {"id":"D", "name":"courierName", "title":"快递员姓名", "wdith":"25"},
            {"id":"E", "name":"orderAmount", "title":"订单金额(元)", "wdith":"20"},
            {"id":"F", "name":"branchProfitsAmount", "title":"服务站预计分成金额", "wdith":"25"},
            {"id":"G", "name":"xilaiProfitsAmount", "title":"总部预计分成金额", "wdith":"25"},
            {"id":"H", "name":"logisticsProfitsAmount", "title":"快递预计分成金额", "wdith":"25"},
            {"id":"I", "name":"managementProfitsAmount", "title":"经营中心预计分成金额", "wdith":"25"},
        ]
    },

    // 订单管理
    orderManger:{
        downloadUrl:'manageOrder/export-excel',
        downloadFields:
            [
            {"id":"A","name":"orderNo","title":"订单号","width":"30"},
                {"id":"B","name":"orderSource","title":"订单来源","width":"30"},
                {"id":"C","name":"orgNo","title":"机构ID","width":"30"},
                {"id":"D","name":"orgName","title":"机构名称","width":"25"},
                {"id":"E","name":"courierNo","title":"快递员ID","width":"25"},
                {"id":"F","name":"courierName","title":"快递员姓名","width":"25"},
                {"id":"G","name":"xlLogisticsNo","title":"喜来单号","width":"30"},
                {"id":"H","name":"logisticsNo","title":"快递单号","width":"30"},
                {"id":"I","name":"logisticsCompanyName","title":"快递公司","width":"25"},
                {"id":"J","name":"orderStatus","title":"订单状态","width":"15"},
                {"id":"K","name":"payStatus","title":"支付状态","width":"20"},
                {"id":"L","name":"createTime","title":"下单时间","width":"20"},
                {"id":"M","name":"printTime","title":"打印时间","width":"20"},
                {"id":"N","name":"deliveryTime","title":"发件时间","width":"20"},
                {"id":"O","name":"signatureTime","title":"签收时间","width":"20"}]
    },

    // 地址簿
    address:{
        downloadUrl:'addressBook/exportFromManage',
        downloadFields:[
          {"id":"A","name":"addrType","title":"地址类型","width":"20"},
          {"id":"B","name":"name","title":"姓名","width":"20"},
          {"id":"C","name":"phone","title":"联系方式","width":"20"},
          {"id":"D","name":"proviceCityRegionTxt","title":"省市区","width":"30"},
          {"id":"E","name":"addrDetail","title":"详细地址","width":"40"},
          {"id":"F","name":"addUserName","title":"添加人姓名","width":"20"},
          {"id":"G","name":"addUserType","title":"添加人角色","width":"20"},
          {"id":"H","name":"editTime","title":"最近修改时间","width":"20"}
          ]
    },

    // 派件订单
    delivery:{
        downloadUrl:'order/managementOrdersExport',
        // downloadFields:[
        //     {"id":"A","name":"logisticsNo","title":"物流单号","width":"20"},
        //     {"id":"B","name":"logisticsCompanyName","title":"快递公司","width":"20"},
        //     {"id":"C","name":"organizationName","title":"机构名称","width":"30"},
        //     {"id":"D","name":"courierName","title":"派件人姓名","width":"40"},
        //     {"id":"E","name":"receiverName","title":"收件人姓名","width":"20"},
        //     {"id":"F","name":"receiverPhone","title":"收件人电话","width":"20"},
        //     {"id":"G","name":"shelfNumber","title":"货架号","width":"20"},
        //     {"id":"H","name":"entryTime","title":"入库时间","width":"25"},
        //     {"id":"I","name":"signatureTime","title":"签收时间","width":"15"},
        //     {"id":"J","name":"orderStatus","title":"喜来签收状态","width":"20"},
        //     {"id":"K","name":"thirdOrderStatus","title":"三方签收状态","width":"20"},
        //     {"id":"L","name":"signRemark","title":"备注","width":"20"},
        // ]
    },
    // 派件妥投率
    investmentRate:{
        downloadUrl:'order/managementRateExport',
    },
     // 机构信息
     organizationInfo:{
        downloadUrl:'organization/export-excel',
        downloadFields:[
            { "id": "A", "name": "orgNo", "title": "机构编号", "width": "20" },
            { "id": "B", "name": "orgType", "title": "机构类型", "width": "20" },
            { "id": "C", "name": "orgName", "title": "机构名称", "width": "25" },
            { "id": "D", "name": "userCode", "title": "主管理员工号", "width": "20" },
            { "id": "E", "name": "createTime", "title": "创建时间", "width": "25" },
            { "id": "F", "name": "editTime", "title": "编辑时间", "width": "25" },
            { "id": "G", "name": "isEnabled", "title": "状态", "width": "20" },
        ]
    },
}