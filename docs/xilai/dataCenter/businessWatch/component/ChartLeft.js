/**
 *   Create by Malson on 2048/10/23
 */
import React from 'react';
import {Icon } from 'antd';
import {GetRange,changeDate} from '../BusinessCommon';
let Common = require('../../../../public/script/common');

class ChartLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type:''
    }
  }
  leftHtmlModal = (param={})=>{
    if(!param.extra)param.extra='';
    let {firstLine,secondLine,unit} = this.props;
    return (<div>
      <div style={{fontSize:12,fontWeight:400,color:'rgba(136,136,136,1)',marginBottom:10}}>{param.extra + firstLine}({unit})：</div>
      <span className='left-num'>{param.num1}</span>
      {/*<br style={{marginTop:4}}/>*/}
      <div style={{marginTop:48,marginBottom:48,border:'0.5px solid #EAEAEA',width:140}}></div>
      <div style={{fontSize:12,fontWeight:400,color:'rgba(136,136,136,1)',marginBottom:10}}>{param.extra + secondLine}({unit})：</div>
      <span className='left-num'>{param.num2}</span>
    </div>)
  };
  leftMoreModal = (type)=>{
    const IncreaseIcon = <Icon type="caret-up"  className='chart-icon'/>,
          DecreaseIcon = <Icon type="caret-down" className='chart-icon'/>;
    let {firstLine,secondLine,unit} = this.props;
    let getHtml = (type,rate)=>{
      let weekHtml = '';
      let date = type==='week'?'上周':type==='month'?'上月':'去年';
      if(rate>0){
       // weekHtml = <div><div>比{date}同期增长：</div><span className='chart-increase'>{IncreaseIcon}{rate}</span>%</div>
          weekHtml = <div style={{fontSize:12,marginTop:10}}>比{date} <span style={{marginLeft:10}}>{rate}%</span><span className='chart-increase'>{IncreaseIcon}</span></div>

      }else if(rate===0 || rate==='0.00'){
          weekHtml = <div style={{fontSize:12,marginTop:10}}>比{date}同期持平</div>
      }else{
        //weekHtml = <div><div>比{date}同期减少：</div><span className='chart-decrease'>{DecreaseIcon}{rate}</span>%</div>
          weekHtml = <div style={{fontSize:12,marginTop:10}}>比{date}<span style={{marginLeft:10}}>{rate}%</span><span className='chart-decrease'>{DecreaseIcon}</span></div>

      }
      if(rate==null || rate==undefined || rate == Infinity || isNaN(rate)){
       // weekHtml = <div><div>比{date}同期：</div>--</
          weekHtml = <div style={{fontSize:12,marginTop:10}}>比{date}：--</div>

      }
      return weekHtml
    };
    let getRate = (cur=1,last=1)=>((Number(cur) - Number(last)) / Number(last) * 100).toFixed(2);
    let rateLastWeek,rateLastWeekSuc,rateLastMonth,rateLastMonthSuc,rateLastYear,rateLastYearSuc;
    let num,sucNum;
    
    let { lastMonthOrderNum,lastMonthSuccessOrderNum,lastWeekOrderNum,lastWeekSuccessOrderNum,
      orderNum,successOrderNum,sameMonthLastYearOrderNum,sameMonthLastYearSuccessOrderNum} = this.props;
    let { lastMonthOrderAmount,lastMonthProfitsAmount,lastWeekOrderAmount,lastWeekProfitsAmount,
      lastYearOrderAmount,lastYearProfitsAmount,orderAmount,profitsAmount} = this.props;
    if(this.props.type==='num'){
      rateLastWeek = lastWeekOrderNum?getRate(orderNum,lastWeekOrderNum):null;//上周下单增长率
      rateLastWeekSuc = lastWeekSuccessOrderNum?getRate(successOrderNum,lastWeekSuccessOrderNum):null;//上周成单增长率
      rateLastMonth = lastMonthOrderNum?getRate(orderNum,lastMonthOrderNum):null;//上月下单增长率
      rateLastMonthSuc = lastMonthSuccessOrderNum?getRate(successOrderNum,lastMonthSuccessOrderNum):null;//上月成单增长率
      rateLastYear = sameMonthLastYearOrderNum?getRate(orderNum,sameMonthLastYearOrderNum):null;//上年同月下单增长率
      rateLastYearSuc = sameMonthLastYearSuccessOrderNum?getRate(successOrderNum,sameMonthLastYearSuccessOrderNum):null;//上年同月下单增长率
      num = orderNum;
      sucNum = successOrderNum;
    }
    else if(this.props.type==='amount'){
      rateLastWeek = lastWeekOrderAmount?getRate(orderAmount,lastWeekOrderAmount):null;//上周下单增长率
      rateLastWeekSuc = lastWeekProfitsAmount?getRate(profitsAmount,lastWeekProfitsAmount):null;//上周成单增长率
      rateLastMonth = lastMonthOrderAmount?getRate(orderAmount,lastMonthOrderAmount):null;//上月下单增长率
      rateLastMonthSuc = lastMonthProfitsAmount?getRate(profitsAmount,lastMonthProfitsAmount):null;//上月成单增长率
      rateLastYear = lastYearOrderAmount?getRate(orderAmount,lastYearOrderAmount):null;//上年同月下单增长率
      rateLastYearSuc = lastYearProfitsAmount?getRate(profitsAmount,lastYearProfitsAmount):null;//上年同月下单增长率
      num = orderAmount;
      sucNum = profitsAmount;
    }

    let compareLastWeek = getHtml('week',rateLastWeek);
    let compareLastWeekSuc = getHtml('week',rateLastWeekSuc);
    let compareLastMonth = getHtml('month',rateLastMonth);
    let compareLastMonthSuc = getHtml('month',rateLastMonthSuc);
    let compareLastYear = getHtml('year',rateLastYear);
    let compareLastYearSuc = getHtml('year',rateLastYearSuc);
    
    if(type==='fullWeek'){ //完整一周
      return (<div>
        <div style={{fontSize:12,fontWeight:400,color:'rgba(136,136,136,1)',marginBottom:10}}>本周{firstLine}({unit})：</div>
        <span className='left-num'>{num}</span>
        {compareLastWeek}
        {/*<br style={{marginTop:2}}/>*/}
        <div style={{marginTop:48,marginBottom:48,border:'0.5px solid #EAEAEA',width:140}}></div>
        <div style={{fontSize:12,fontWeight:400,color:'rgba(136,136,136,1)',marginBottom:10}}>本周{secondLine}({unit})：</div>
        <span className='left-num'>{sucNum}</span>
        {compareLastWeekSuc}
      </div>)
    }
    if(type==='fullMonth'){
      return (<div>
        <div style={{fontSize:12,fontWeight:400,color:'rgba(136,136,136,1)',marginBottom:10}}>本月{firstLine}({unit})：</div>
        <span className='left-num'>{num}</span>
        {compareLastMonth}
        {/*{compareLastYear}*/}
        <div style={{marginTop:48,marginBottom:48,border:'0.5px solid #EAEAEA',width:140}}></div>
        <div style={{fontSize:12,fontWeight:400,color:'rgba(136,136,136,1)',marginBottom:10}}>本月{secondLine}({unit})：</div>
        <span className='left-num'>{sucNum}</span>
        {compareLastMonthSuc}
        {/*{compareLastYearSuc}*/}
      </div>)
    }
  };
  getLeftHtml = (type) => {
    let content='';
    let title = changeDate(this.props.startDate) + '～' + changeDate(this.props.endDate);
    let num1,num2;
    if(this.props.type==='num'){
      num1 = this.props.orderNum;
      num2 = this.props.successOrderNum;
    }else if(this.props.type==='amount'){
      num1 = this.props.orderAmount;
      num2 = this.props.profitsAmount;
    }
    switch (type) {
      case '1':
       // title = '截止到昨天为止:';
          title='';
        content = this.leftHtmlModal({extra:'本周', num1, num2});
        break;
      case '2':
        //title = '截止到上周为止:';
          title='',
        content = this.leftHtmlModal({extra:'本月', num1, num2});
        break;
      case '3':
        content = this.leftMoreModal('fullWeek');
        break;
      case '4':
        content = this.leftMoreModal('fullMonth');
        break;
      default :
        content = this.leftHtmlModal({ num1, num2});
        break;
    }
    let filterState = this.props.getStationName();
    let loginData = Common.getLoginData() ? Common.getLoginData().staffInfo : '';
    let curName = filterState.stationSelectedLabel?filterState.stationSelectedLabel:
        filterState.manageSelectedLabel?filterState.manageSelectedLabel:loginData.orgName;
    let html = <div style={{textAlign:'left',width:'100%'}}>
                  {/*<div className='chart-left-title' title={curName}>{curName}</div>*/}
                  <div style={{fontWeight:600, fontSize: 14,color:'rgba(146,146,146,1)', marginBottom: 18}}>{title}</div>
                  <div>
                    {content}
                  </div>
                </div>;
    return html;
  };
  
  componentDidMount() {
  }
  render() {
    let LeftHtml = this.getLeftHtml(this.props.dateType);
    return (
        <div className='chart-wrap-left'>
          {LeftHtml}
        </div>
    )
  }
}

export default ChartLeft;