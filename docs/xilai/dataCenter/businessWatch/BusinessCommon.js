/**
 *   Create by Malson on 2018/10/25
 */

//获取本周日期 week  获取本月日期month
export function GetRange(type){
  let range = [];
  function getMonth(data) {
    let month = data.getMonth() + 1;
    return month<10?'0'+month:month
  }
  function getDate(data) {
    let day = data.getDate();
    return day<10?'0'+day:day
  }
  if(type==='week'){
    let week = (new Date()).getDay();
    let startData = new Date();
    startData.setDate(startData.getDate()-(week-1));
    let endData = new Date();
    if(week == 1){
       //今天是周一
        endData.setDate(endData.getDate());
    }else{
        endData.setDate(endData.getDate()-1);
    }
    range[0] = startData.getFullYear() + '-' + getMonth(startData) + '-' + getDate(startData);
    range[1] = endData.getFullYear() + '-' + getMonth(endData) + '-' + getDate(endData);
  }else if(type==='month'){
    let startData = new Date();
    let endData = new Date();
    if(endData.getDate()!==1){
      endData.setDate(endData.getDate()-1);
    }
    range[0] = startData.getFullYear() + '-' + getMonth(startData) + '-' + '01';
    range[1] = endData.getFullYear() + '-' + getMonth(endData) + '-' + getDate(endData);
  }
  return range;
}

//将2018-10-10转换成  2018年10月10日

export function changeDate(date='') {
  let newDate = date.replace(/\//g,'-');
  newDate = newDate.split('-');
  if(newDate.length!==3) return date;
  return newDate[0]+'-'+newDate[1]+'-'+ parseInt(newDate[2]);
}