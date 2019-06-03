'use strict';
/**
 * Excel配置文件
 * 在使用Excel导出组件时，需要使用module字段来告知当前调用的模块名
 * @creator: gypsylu
 * @date: 2018/05/09 
 */
module.exports = {
    // 模块名定义（方便后期维护）
    "modules": {
        'OfficialPrice': 'officialPrice',
        'ChannelPrice': 'channelPrice',
        'ProfitSharing': 'profitSharing'
    },

    // 导入字段（因为后台给的导入导出字段不一样，所以定义两套字段）
    upload:{
        "officialPriceFields": [
            { "id": "A", "name": "logisticsCompanyUuid", "title": "快递公司"},
            { "id": "B", "name": "transportTypeUuid", "title": "运输方式"},
            { "id": "C", "name": "origin", "title": "始发地"},
            { "id": "D", "name": "originCode", "title": "始发地编码"},
            { "id": "E", "name": "destination", "title": "目的地"},
            { "id": "F", "name": "destinationCode", "title": "目的地编码"},
            { "id": "G", "name": "fromWhere", "title": "数据来源"},
            { "id": "H", "name": "section1", "title": "总重区间1"},
            { "id": "I", "name": "firstWeightPrice1", "title": "首重价格1"},
            { "id": "J", "name": "firstWeight1", "title": "首重重量1"},
            { "id": "K", "name": "furtherWeightPrice1", "title": "续重价格1"},
            { "id": "L", "name": "section2", "title": "总重区间2"},
            { "id": "M", "name": "firstWeightPrice2", "title": "首重价格2"},
            { "id": "N", "name": "firstWeight2", "title": "首重重量2"},
            { "id": "O", "name": "furtherWeightPrice2", "title": "续重价格2"},
            { "id": "P", "name": "section3", "title": "总重区间3"},
            { "id": "Q", "name": "firstWeightPrice3", "title": "首重价格3"},
            { "id": "R", "name": "firstWeight3", "title": "首重重量3"},
            { "id": "S", "name": "furtherWeightPrice3", "title": "续重价格3"},
        ],
    
        "channelPriceFields": [
            { "id": "A", "name": "logisticsCompanyUuid", "title": "快递公司" },
            { "id": "B", "name": "transportTypeUuid", "title": "运输方式" },
            { "id": "C", "name": "origin", "title": "始发地" },
            { "id": "D", "name": "originCode", "title": "始发地编码" },
            { "id": "E", "name": "destination", "title": "目的地" },
            { "id": "F", "name": "destinationCode", "title": "目的地编码" },
            { "id": "G", "name": "fromWhere", "title": "数据来源" },
            { "id": "H", "name": "section1", "title": "总重区间1" },
            { "id": "I", "name": "firstWeightPrice1", "title": "首重价格1" },
            { "id": "J", "name": "firstWeight1", "title": "首重重量1" },
            { "id": "K", "name": "furtherWeightPrice1", "title": "续重价格1" },
            { "id": "L", "name": "section2", "title": "总重区间2" },
            { "id": "M", "name": "firstWeightPrice2", "title": "首重价格2" },
            { "id": "N", "name": "firstWeight2", "title": "首重重量2" },
            { "id": "O", "name": "furtherWeightPrice2", "title": "续重价格2" },
            { "id": "P", "name": "section3", "title": "总重区间3" },
            { "id": "Q", "name": "firstWeightPrice3", "title": "首重价格3" },
            { "id": "R", "name": "firstWeight3", "title": "首重重量3" },
            { "id": "S", "name": "furtherWeightPrice3", "title": "续重价格3" },
        ],
    
        "profitSharingFields": [
            { "id": "A", "name": "logisticsCompanyUuid", "title": "快递公司"},
            { "id": "B", "name": "transportTypeUuid", "title": "运输方式"},
            { "id": "C", "name": "fromWhere", "title": "上传数据机构"},
            { "id": "D", "name": "thirdpartyProfit", "title": "三方分成比例"},
            { "id": "E", "name": "headquartersProfit", "title": "总部分成比例"},
            { "id": "F", "name": "businessCenterProfit", "title": "经营中心分成比例"},
            { "id": "G", "name": "branchProfit", "title": "服务站分成比例"},
            { "id": "H", "name": "createTime", "title": "创建时间"},
            { "id": "I", "name": "editTime", "title": "编辑时间"},
        ],
    },

    // 导出字段
    export:{
        "officialPriceFields": [
            { "id": "A", "name": "logisticsCompanyName", "title": "快递公司", "width": "15" },
            { "id": "B", "name": "transportTypeName", "title": "运输方式", "width": "15" },
            { "id": "C", "name": "origin", "title": "始发地", "width": "15" },
            { "id": "D", "name": "destination", "title": "目的地", "width": "15" },
            { "id": "E", "name": "orgName", "title": "数据来源", "width": "20" },
            { "id": "F", "name": "section1", "title": "区间1", "width": "15" },
            { "id": "G", "name": "firstWeightPrice1", "title": "首重价格1", "width": "15" },
            { "id": "H", "name": "firstWeight1", "title": "首重重量1", "width": "15" },
            { "id": "I", "name": "furtherWeightPrice1", "title": "续重价格1", "width": "15" },
            { "id": "J", "name": "section2", "title": "区间2", "width": "15" },
            { "id": "K", "name": "firstWeightPrice2", "title": "首重价格2", "width": "15" },
            { "id": "L", "name": "firstWeight2", "title": "首重重量2", "width": "15" },
            { "id": "M", "name": "furtherWeightPrice2", "title": "续重价格2", "width": "15" },
            { "id": "N", "name": "section3", "title": "区间3", "width": "15" },
            { "id": "O", "name": "firstWeightPrice3", "title": "首重价格3", "width": "15" },
            { "id": "P", "name": "firstWeight3", "title": "首重重量3", "width": "15" },
            { "id": "Q", "name": "furtherWeightPrice3", "title": "续重价格3", "width": "15" },
            { "id": "R", "name": "creator", "title": "创建者", "width": "15" },
            { "id": "S", "name": "createTime", "title": "创建日期", "width": "25" },
            { "id": "T", "name": "active", "title": "有效性", "width": "15" }
        ],
    
        "channelPriceFields": [
            { "id": "A", "name": "logisticsCompanyName", "title": "快递公司", "width": "15" },
            { "id": "B", "name": "transportTypeName", "title": "运输方式", "width": "15" },
            { "id": "C", "name": "origin", "title": "始发地", "width": "15" },
            { "id": "D", "name": "destination", "title": "目的地", "width": "15" },
            { "id": "E", "name": "orgName", "title": "数据来源", "width": "20" },
            { "id": "F", "name": "section1", "title": "区间1", "width": "15" },
            { "id": "G", "name": "firstWeightPrice1", "title": "首重价格1", "width": "15" },
            { "id": "H", "name": "firstWeight1", "title": "首重重量1", "width": "15" },
            { "id": "I", "name": "furtherWeightPrice1", "title": "续重价格1", "width": "15" },
            { "id": "J", "name": "section2", "title": "区间2", "width": "15" },
            { "id": "K", "name": "firstWeightPrice2", "title": "首重价格2", "width": "15" },
            { "id": "L", "name": "firstWeight2", "title": "首重重量2", "width": "15" },
            { "id": "M", "name": "furtherWeightPrice2", "title": "续重价格2", "width": "15" },
            { "id": "N", "name": "section3", "title": "区间3", "width": "15" },
            { "id": "O", "name": "firstWeightPrice3", "title": "首重价格3", "width": "15" },
            { "id": "P", "name": "firstWeight3", "title": "首重重量3", "width": "15" },
            { "id": "Q", "name": "furtherWeightPrice3", "title": "续重价格3", "width": "15" },
            { "id": "R", "name": "creator", "title": "创建者", "width": "15" },
            { "id": "S", "name": "createTime", "title": "创建日期", "width": "25" },
            { "id": "T", "name": "active", "title": "有效性", "width": "15" }
        ],
    
        "profitSharingFields": [
            { "id": "A", "name": "logisticsCompanyUuid", "title": "快递公司", "width": "15"},
            { "id": "B", "name": "transportTypeUuid", "title": "运输方式", "width": "15"},
            { "id": "C", "name": "fromWhere", "title": "上传数据机构", "width": "25"},
            { "id": "D", "name": "thirdpartyProfit", "title": "三方分成比例", "width": "25"},
            { "id": "E", "name": "headquartersProfit", "title": "总部分成比例", "width": "25"},
            { "id": "F", "name": "businessCenterProfit", "title": "经营中心分成比例", "width": "25"},
            { "id": "G", "name": "branchProfit", "title": "服务站分成比例", "width": "25"},
            { "id": "H", "name": "createTime", "title": "创建时间", "width": "25"},
            { "id": "I", "name": "editTime", "title": "编辑时间", "width": "25"},
        ],
    }
}