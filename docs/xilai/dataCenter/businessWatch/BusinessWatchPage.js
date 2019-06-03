/**
 *   Create by Malson on 2018/10/24
 */
/**
 *   Create by Malson on 2018/5/29
 */
import React from 'react';
import './style/chartXilai.scss';
import {Card, Button, Col, Row, Icon, Spin,message,Alert,Tabs} from 'antd';
const TabPane = Tabs.TabPane;
import ChartXilai from './component/ChartXilai';
import ChartFilter from './component/ChartFilter';

import BusinessWatchActions from './action/BusinessWatchActions'
import BusinessWatchStore from './data/BusinessWatchStore';
let Common = require('../../../public/script/common');
let Utils = require('../../../public/script/utils');



class ChartsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      businessWatch:[],
      errMsg:'',
      type:'num'
    }
  }
  
  componentDidMount() {
    //请求
    this.unsubscribe = BusinessWatchStore.listen(this.onStatusChange);
    let loginData = Common.getLoginData() || '';
    const filter = loginData ? loginData.staffInfo.organizationUuid : '';
    BusinessWatchActions.retrieveBusinessWatch(filter);
  }
  componentWillUnmount(){
    this.unsubscribe()
  }
  onStatusChange = (data)=>{
    if(data.errMsg){
      this.setState({loading:false,errMsg:data.errMsg});
      // message.destroy();
      // message.error(data.errMsg,1500);
      // return;
    }else{
      this.setState({errMsg:''});
      if(data.operation==="business_monitoring"){
        this.setState({businessWatch:data.businessWatch,loading:false});
      }
    }
  };

    callback=(key)=>{
      if(this.chartFilter.state.changeStyle == 'table'){
        //列表之间的切换
          this.chartFilter.search(this.chartFilter.state.changeStyle,key,'');
      }else{
          this.chartFilter.search(this.chartFilter.state.changeStyle,key);
      }

    };

  render() {
    const ChartXilaiProps = {
      firstLine: '下单量',
      secondLine: '成单量',
      unit: '单',
      type:'num',
      filter:this.chartFilter?this.chartFilter.state.filterData:'',
      changeStyle:this.chartFilter?this.chartFilter.state.changeStyle:''
    };
    const ChartXilaiProps2 = {
      firstLine: '订单金额',
      secondLine: '预计分成金额',
      unit: '元',
      type:'amount',
      filter:this.chartFilter?this.chartFilter.state.filterData:'',
      changeStyle:this.chartFilter?this.chartFilter.state.changeStyle:'',
    };
    const {loading,businessWatch,errMsg} = this.state;
    //搜索框
    const filterProps = {
        search: this.chartXilai?this.chartXilai.search:'',
        search2: this.chartXilai2?this.chartXilai2.search:'',
    };
      const operations = <ChartFilter   {...filterProps} ref={ref => this.chartFilter = ref}/>;
    return (
        <div style={{paddingLeft:20,paddingRight:24,minWidth:1100}}>
          {
            errMsg?<Alert message={errMsg} type="error" showIcon />:''
          }
          <div style={{marginTop: 24}}>

            <Spin spinning={loading} >
              <div style={{border:'1px solid #e9e9e9',height:166}}>
                <Row style={{borderLeft:'2px solid #1890FF',marginLeft:20,paddingLeft:6,height:20,marginTop:28,fontWeight:600,
                    color:'rgba(0,0,0,0.85)',fontSize:14
                    }}>昨日数据</Row>
              <Row >
                <Col span={6} className='chart-card-mini'>
                    <div className='card-wrap'>
                      <div style={{margin:'0 auto'}}>
                        <img src='/images/orderNum.svg' style={{float:'left',marginTop:20}}/>
                      <div className='chart-right'>
                        <div className='title'>下单量(单)</div>
                        <div><span title={businessWatch['orderNum']}>{businessWatch['orderNum']}</span></div>
                      </div>
                      </div>
                    </div>
                </Col>
                <Col span={6} className='chart-card-mini'>
                    <div className='card-wrap'>
                      <div style={{margin:'0 auto'}}>
                        <img src='/images/completeNum.svg' style={{float:'left',marginTop:20}}/>
                      <div className='chart-right'>
                        <div className='title'>成单量(单)</div>
                        <div><span title={businessWatch['completeNum']}>{businessWatch['completeNum']}</span></div>
                      </div>
                      </div>
                    </div>
                </Col>
                <Col span={6} className='chart-card-mini'>
                    <div className='card-wrap'>
                        <div style={{margin:'0 auto'}}>
                          <img src='/images/orderAmount.svg' style={{float:'left',marginTop:20}}/>
                          <div className='chart-right'>
                            <div className='title'>订单金额(元)</div>
                            <div><span title={businessWatch['orderAmount']}>{businessWatch['orderAmount']}</span></div>
                          </div>
                        </div>
                    </div>
                </Col>
                <Col span={6} className='chart-card-mini'>
                    <div className='card-wrap'>
                      <div style={{margin:'0 auto'}}>
                        <img src='/images/profitsAmount.svg' style={{float:'left',marginTop:20}}/>
                        <div className='chart-right'>
                          <div className='title'>预计分成金额(元)</div>
                          <div><span title={businessWatch['profitsAmount']}>{businessWatch['profitsAmount']}</span></div>
                        </div>
                      </div>
                    </div>
                </Col>
              </Row>
              </div>
            </Spin>
            <div style={{border:'1px solid #e9e9e9',marginTop:24,marginBottom:10}} className={'card-container'}>
            <Tabs defaultActiveKey="1"  onChange={this.callback}  style={{padding:10,paddingLeft:20}} animated={false} tabBarExtraContent={operations}>
              <TabPane tab="单量统计" key="1">
                  <ChartXilai {...ChartXilaiProps}  ref={ref => this.chartXilai = ref}/>
              </TabPane>
              <TabPane tab="金额统计" key="2" forceRender={true}>
                <ChartXilai {...ChartXilaiProps2} ref={ref => this.chartXilai2 = ref}/>
              </TabPane>
            </Tabs>
            </div>
          </div>
        </div>
    )
  }
}
module.exports = ChartsPage