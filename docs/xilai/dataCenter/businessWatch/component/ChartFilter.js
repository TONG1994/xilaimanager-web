/**
 *   Create by Malson on 2018/10/23
 */
import React from 'react';
import { AutoComplete,Radio,Button,DatePicker,message,Input,Icon } from 'antd';
import moment from 'moment';
import BusinessWatchActions from '../action/BusinessWatchActions';
import BusinessWatchStore from '../data/BusinessWatchStore';
import {GetRange} from '../BusinessCommon';
import $ from 'jquery';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

class ChartFilter extends React.Component{
  constructor(props){
    super(props);
    this.state={
      orgType:'',
      filterType: '1',
      manageArr:[],
      manageSelectedLabel:'',
      manageSelectedVal:'',
      manageSelectedOrgType:'',
      stationArr:[],
      stationSelectedLabel:'',
      stationSelectedval:'',
      rangeDate:[],
      flag:true, //图表和列表的切换的class
      changeStyle:'chart',
      key:1,
      filterData:{} //过滤条件

    }
  }
  filterChange = (e) => {
    let filterType = e.target.value;
    let rangeDate = [];
    if(filterType==='1'){
      let week = (new Date()).getDay();
      // if(week===1){
      //   message.destroy();
      //   message.error('本周暂无数据！');
      //   return;
      // }
      rangeDate = GetRange('week');
    }
    if(filterType==='2'){
      let date = (new Date()).getDate();
      // if(date===1){
      //   message.destroy();
      //   message.error('本月暂无数据！');
      //   return;
      // }
      rangeDate = GetRange('month');
    }
    this.setState({filterType,rangeDate});
  };
  
  rangeChange = (value, dateString)=>{
    let rangeDate = dateString[0]?dateString:GetRange('week');
    // 限制只能选3个月
    let getTime = time => (new Date(time)).getTime();
    if(getTime(rangeDate[1])-getTime(rangeDate[0])>24*60*60*1000*180){
      message.destroy();
      message.warn('时间范围不可超过6个月！');
      return;
    }
    this.setState({filterType:'0',rangeDate});
  };
  serviceChange = (data)=>{
    if(!data.errMsg){
      if(data.operation==="business_monitoring_mechanism"){
          let manageArr = data.recordSet;
          if(manageArr===this.state.manageArr) return;
          manageArr = manageArr.map(item=>{
              return {
                  text:item.orgName,
                  value:item.orgNo,
                  orgType:item.orgType
              }
          });
          this.setState({manageArr,stationArr:[]});
      }
    }
  };
  componentDidMount(){
    this.doServer = BusinessWatchStore.listen(this.serviceChange);
    let rangeDate = GetRange('week') || [];
    this.setState({rangeDate});
  }
  componentWillUnmount(){
    this.doServer();
  }
  manageChange = (manageSelectedLabel='')=>{
    let manageArr = this.state.manageArr.slice(0) || [];
    let manageSelectedVal = manageArr.filter(item=>item.value===manageSelectedLabel)[0];
    this.setState({manageSelectedVal:''});
    if(manageSelectedVal){
      manageSelectedLabel = manageSelectedVal.text;
      this.setState({manageSelectedVal:manageSelectedVal.value,manageSelectedOrgType:manageSelectedVal.orgType});
    }
    this.setState({manageSelectedLabel});
    if(this.state.stationSelectedval){ //修改经营中心的时候清除服务站信息
      this.setState({stationSelectedval:'',stationSelectedLabel:''});
    }
    let orgNo = '';
    if(Common.getUserType()==1 || Common.getUserType()==2){
      orgNo = Common.getLoginData()?Common.getLoginData().staffInfo.orgNo:'';
    }
    BusinessWatchActions.getOrg({
      orgNo,
      orgType:Common.getUserType(),
      orgName:manageSelectedLabel
    })
  };
    manageFocus=()=>{
      //获取焦点时
        let orgNo = '';
        if(Common.getUserType()==1 || Common.getUserType()==2){
            orgNo = Common.getLoginData()?Common.getLoginData().staffInfo.orgNo:'';
        }
        BusinessWatchActions.getOrg({
            orgNo,
            orgType:Common.getUserType(),
            orgName:this.state.manageSelectedLabel
        })
    }
  stationChange = (stationSelectedLabel='')=>{
    let stationArr = this.state.stationArr.slice(0) || [];
    let stationSelectedVal = stationArr.filter(item=>item.value===stationSelectedLabel)[0];
    this.setState({stationSelectedval:''});
    if(stationSelectedVal){
      stationSelectedLabel = stationSelectedVal.text;
      this.setState({stationSelectedval:stationSelectedVal.value});
    }
    let orgNo = this.state.manageSelectedVal;
    if(Common.getUserType()==2){
      orgNo = Common.getLoginData()?Common.getLoginData().staffInfo.orgNo:'';
    }
    if(!orgNo) return;
    this.setState({stationSelectedLabel});
    BusinessWatchActions.getOrg({
      orgNo,
      orgName:stationSelectedLabel
    })
  };
  disabledDate = (current)=>{
    return current > moment().endOf('day');
  };
  search = (val,key,flag)=>{
      //val = '' 是点击查询的时候
      let filterData;
      if(val=='chart'){
          this.setState({flag:true,changeStyle:val})
          filterData = this.state.filterData;
          //判断传入xilai中的过滤条件，如果是空，则没有点过查询按钮，是第一次的请求
          if(JSON.stringify(filterData) == "{}"){
              let loginData = Common.getLoginData() ? Common.getLoginData().staffInfo : '';
              filterData = {
                  startDate: GetRange('week')[0],
                  endDate: GetRange('week')[1],
                  dateType: "1",
                  orgNo: loginData.orgNo,
                  orgType: loginData.orgType,
                  flagss:true
              };
          }
      }else if(val=='table'){
        this.setState({flag:false,changeStyle:val})
        filterData = this.state.filterData;
          //判断传入xilai中的过滤条件，如果是空，则没有点过查询按钮，是第一次的请求
          if(JSON.stringify(filterData) == "{}"){
              let loginData = Common.getLoginData() ? Common.getLoginData().staffInfo : '';
              filterData = {
                  startDate: GetRange('week')[0],
                  endDate: GetRange('week')[1],
                  dateType: "1",
                  orgNo: loginData.orgNo,
                  orgType: loginData.orgType,
                  flagss:true
              };
          }
    }else if(val==''){
          filterData = Object.assign({},this.state);
          //如果是查询的时候，重新赋值搜索条件
          if(this.state.changeStyle == 'table'){
              this.setState({flag:false,filterData})
          }else{
              this.setState({flag:true,filterData})
          }
    }
     filterData.changeStyle = val == ''?this.state.changeStyle:val;
      if(key != 1 && key != 2){
          key = this.state.key;
      }else{
          this.setState({key});
      }
      if(filterData.changeStyle  == 'table' && flag == undefined){
          //点击列表的查询,
          if(this.props.search2 != ''){
              this.props.search2(filterData)
              this.props.search(filterData)
          }
      }else if(filterData.changeStyle  == 'chart'){
          if(key == 2){
              if(this.props.search2 != ''){
                  this.props.search2(filterData)
              }
          }else{
              this.props.search(filterData)
          }
      }

  };
  // reset = ()=>{
  //   let state = {
  //     orgType:'',
  //     filterType: '1',
  //     manageArr:[],
  //     manageSelectedLabel:'',
  //     manageSelectedVal:'',
  //     stationArr:[],
  //     stationSelectedLabel:'',
  //     stationSelectedval:'',
  //     rangeDate:GetRange('week')
  //   };
  //   this.setState(state);
  //   this.props.search(state)
  // };
  manageBlur = ()=>{
    if(!this.state.manageSelectedVal){
      this.setState({manageSelectedLabel:''});
    }
  };
  stationBlur = ()=>{
    if(!this.state.stationSelectedval){
      this.setState({stationSelectedLabel:''});
    }
  };
  render(){
    const {filterType,manageArr,stationArr,rangeDate,manageSelectedLabel,stationSelectedLabel,manageSelectedVal} = this.state;
    let rangeDateMoment = rangeDate[0]?[moment(rangeDate[0]),moment(rangeDate[1])]:null;
    let userType = Common.getUserType();
    let noDataArr = [<Option key='noData' value='noData' disabled>暂无数据</Option>];
    let manageArrFilter = manageArr.length?manageArr.map(item=>
      <Option key={item.value} value={item.value} title={item.text}>
        {item.text}
      </Option>):noDataArr;
    let stationArrFilter = stationArr.length?stationArr.map(item=>
        <Option key={item.value} value={item.value} title={item.text}>
          {item.text}
        </Option>):noDataArr;
    let stationDis = userType==1 && !manageSelectedVal;
    return(
        <div className='chart-filter'>
            {
                userType==1||userType==2?
              <span>
            <span>机构名称：</span>
            <AutoComplete
                dataSource={manageArrFilter}
                style={{ width: 140 }}
                placeholder="输入并选择机构名称"
                onChange={this.manageChange}
                onFocus={this.manageFocus}
                value={manageSelectedLabel}
                onBlur={this.manageBlur}
            >
              <Input suffix={<Icon type="down" className="certain-category-icon" />} />
            </AutoComplete>
          </span>:''
            }
          <RadioGroup value={ filterType } onChange={this.filterChange}>
            <RadioButton value="1" className='btn-margin' style={{borderRadius:'4px 4px 4px 4px'}}>本周</RadioButton>
            <RadioButton value="2" className='btn-margin' style={{borderRadius:'4px 4px 4px 4px'}}>本月</RadioButton>
          </RadioGroup>
          <RangePicker
              className='btn-margin'
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
              onChange={this.rangeChange}
              style={{width:220,marginRight:14}}
              value={rangeDateMoment}
              allowClear={false}
              disabledDate={this.disabledDate}
          />
          <Button type='primary' style={{marginTop:4,marginRight:14}} onClick={this.search.bind(this,'')}>查询</Button>
          {/*<Button className='btn-margin' onClick={this.reset} s>重置</Button>*/}
          <div className={!this.state.flag? 'chart-left-change':'chart-left-change in'} onClick={this.search.bind(this,'chart')}> <img src='/images/chart.svg'/></div>
          <div className={this.state.flag? 'chart-left-change':'chart-left-change in'} style={{borderRadius:'0 4px 4px 0'}} onClick={this.search.bind(this,'table')}> <img src='/images/table.svg'/></div>
        </div>
    )
  }
}
export default ChartFilter;