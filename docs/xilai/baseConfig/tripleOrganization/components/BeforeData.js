/**
 *   Create by Malson on 2018/6/21
 */


export default {
  //新增 & 编辑
  getBeforeData(data,params){
    let beforeData = [
      {prop:'orgName', label:'机构名称', value:data.orgName},
      {prop:'logisticsCompanyName', label:'快递公司名称', value:data.logisticsCompanyName},
    ];
    params.map(item=>{
      beforeData.push({prop:item.param,label:item.name,value:item.defaultValue})
    });
    return beforeData;
  },
  //禁用
  getActiveBeforeData(data){
    let beforeData = [
      {prop:'active', label:'是否启用', value:data.active},
    ];
    return beforeData;
  }
}