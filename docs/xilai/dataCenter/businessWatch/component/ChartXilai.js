/**
 *   Create by Malson on 2018/6/4
 */

import React from 'react';
import {Chart, Geom, Axis, Tooltip, Coord, Label, Legend} from "bizcharts";
import {View} from '@antv/data-set';
import {Spin,Table} from 'antd';
import '../style/chartXilai.scss';
import ChartLeft from './ChartLeft'
import BusinessWatchActions from '../action/BusinessWatchActions';
import BusinessWatchStore from '../data/BusinessWatchStore';
import {GetRange} from '../BusinessCommon';
let Common = require('../../../../public/script/common');


function resizeWindow() {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, false);
  window.dispatchEvent(event);
}

class ChartXilai extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {},
            filter: {},
            changeStyle:'chart',
            num:100000,
            flag:false,
            param:{}

        }
    }

    serviceChange = (data) => {
        const {type} = this.props;
        this.setState({loading: false});
        if (!data.errMsg) {
            if (data.operation === "queryOrderQuantityStatistics" && type === 'num') {
                this.setState({data: data.recordSet, filter: data.filter});
            } else if (data.operation === 'business_monitoring_money' && type === 'amount') {
                this.setState({data: data.recordSet, filter: data.filter});
            }else if (data.operation === 'business_monitoring_moneyList') {
                this.setState({data: data.recordSet, filter: data.filter.object});
            }
        }
    };

    componentWillUnmount() {
        this.doServerModal();
    }

    doServer = (filter) => {
        const {type} = this.props;
        this.setState({loading: true, data: {}});
        if (type === 'num') {//查询数量
            BusinessWatchActions.retrieveNum(filter);
        } else if (type === 'amount') {//查询金额
            BusinessWatchActions.retrieveAmount(filter);
        }
    };
    //获取表格的数据
    doServerTable = (filter) => {
        this.setState({loading: true, data: {}});
        var object = filter;
        var object = {startPage:0,pageRow:Number(this.state.num)*10,object};
        BusinessWatchActions.retrieveTable(object);
    };

    componentDidMount(){
        this.doServerModal = BusinessWatchStore.listen(this.serviceChange);
        if(this.props.filter != '' && JSON.stringify(this.props.filter) != "{}"){
            //第一次加载搜索条件有变动
            this.search(this.props.filter);
            return;
        }else{
            this.state.changeStyle = this.props.changeStyle;
        }
        //刚进来发请求
        let loginData = Common.getLoginData() ? Common.getLoginData().staffInfo : '';
        let filter = {
            startDate: GetRange('week')[0],
            endDate: GetRange('week')[1],
            dateType: "1",
            orgNo: loginData.orgNo,
            orgType: loginData.orgType
        };
        if(this.props.changeStyle == 'table'){
            this.setState({flag:true});
            this.doServerTable(filter);

        }else{
            this.doServer(filter)
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.data === nextState.data && this.state.loading === nextState.loading) {
            return false;
        }
        return true;
    }

    search = (filter) => {
        if(filter.flagss && filter.changeStyle == 'table'){
            //没点查询前点的列表
            this.setState({flag:true,changeStyle:filter.changeStyle});
            this.doServerTable(filter)
            return;
        }
        if(filter.flagss && filter.changeStyle == 'chart'){
            //没点查询前点的图标
            this.setState({flag:false,changeStyle:filter.changeStyle});
            this.doServer(filter)
            return;
        }
        let loginData = Common.getLoginData() ? Common.getLoginData().staffInfo : '';
        let orgNo = loginData.orgNo;
        let orgType = loginData.orgType;
        if (filter.manageSelectedVal) {
            orgNo = filter.manageSelectedVal;
            // orgType = '2';
            orgType = filter.manageSelectedOrgType;
        }
        if (filter.stationSelectedval) {//有服务站
            orgNo = filter.stationSelectedval;
            orgType = '3';
        }
        let param = {
            startDate: filter.rangeDate[0],
            endDate: filter.rangeDate[1],
            dateType: filter.filterType,
            orgNo,
            orgType
        };
        this.setState({changeStyle:filter.changeStyle});
        if(filter.changeStyle == 'table'){
            this.setState({flag:true,param});
            this.doServerTable(param)
        }else{
            this.setState({flag:false});
            this.doServer(param)
        }
    };

    //获取当前过滤条件的服务站名称
    getStationName = () => {
        //let filterState = this.filter.state || {};
        let filterState = {};
        return filterState;
    };
    onScrollEvent() {
        if (this.scrollRef.scrollTop + this.scrollRef.clientHeight === this.scrollRef.scrollHeight) {
            // alert('到底了');
            // this.state.num = this.state.num++;
            // this.setState({flag:true});
            // this.doServerTable(this.state.param);
        }
    };
    marker = (x, y, r) => {
    return [
        [ 'M', x - r, y ],
        [ 'L', x + r , y ]
        ];
     }
    render() {
        const {firstLine, secondLine, type} = this.props;
        let fields = [firstLine, secondLine];
        const dv = new View();
        let data = [];
        let color = [];
        if(this.state.flag){
            data = this.state.data.businessMonitoringList || [];
        }
        if (type === 'num' && !this.state.flag) {
            color = ['city', ['#0378FB', '#69C630']];
            data = this.state.data.orderQuantityStatisticsDetailList || [];
            data = data.map(item => {
                return {
                    data: item.createDate,
                    [firstLine]: item.orderNum,
                    [secondLine]: item.successOrderNum
                }
            });
        } else if (type === 'amount' && !this.state.flag) {
            color = ['city', ['#36CFC9', '#8A5CF6']];
            data = this.state.data.amountList || [];
            data = data.map(item => {
                return {
                    data: item.billDate,
                    [firstLine]: Number(item.orderAmount),
                    [secondLine]: Number(item.profitsAmount)
                }
            });
        }
        dv.source(data).transform({
            type: 'fold',
            fields, // 展开字段集
            key: 'city', // key字段
            value: 'temperature', // value字段
        });
        const label = {
            autoRotate: false,
            formatter(text, item, index) {
                let length = data.length || 1;
                let num = Math.ceil(length / 20);
                return index % num === 0 ? text : null
            }
        };
        // const filterProps = {
        //   filterType: this.state.filterType,
        //   search: this.search
        // };
        const chartLeft = {...this.state.filter, ...this.state.data, getStationName: this.getStationName};
        let loading = this.state.loading;

        const columns = [ {
            title: '下单量(单)',
            dataIndex: 'orderNum',
            key: 'orderNum',
            className:'businessWatch',
            width:100
        }, {
            title: '成单量',
            dataIndex: 'successOrderNum',
            key: 'successOrderNum',
            className:'businessWatch',
            width:100
        }
        , {
            title: '订单金额(元)',
            dataIndex: 'orderAmount',
            key: 'orderAmount',
            className:'businessWatch',
            width:100
        }, {
            title: '预计分成金额(元)',
            dataIndex: 'profitsAmount',
            key: 'profitsAmount',
            className:'businessWatch',
            width:100
        },{
            title: '日期',
            dataIndex: 'billDate',
            key: 'billDate',
            className:'businessWatch',
            width:100
        }
        ];
        var height = window.screen.availHeight-500;
        return (
            <div style={{width: '100%', margin: '20px 0'}}>
                {/*<div className='chart-title'>*/}
                {/*{firstLine}统计<span className={type==='num'?'place-order':'place-amount'}/>{secondLine}统计<span className={type==='num'?'ok-order':'ok-amount'}/>*/}
                {/*</div>*/}
              <Spin spinning={loading}>
                <div className='chart-wrap'>
                  <div>
                      {
                          data.length ? <ChartLeft {...chartLeft} {...this.props}/> : ''
                      }
                    <div className='chart-wrap-right'>
                        {/*<ChartFilter {...filterProps} ref={ref => this.filter = ref}/>*/}
                        {
                            data.length ? (this.state.changeStyle == 'table' ?

                                <Table columns={columns} dataSource={data}  pagination={false}  showHeader={true}  scroll={{ y: 350 }}/>
                                :
                                <Chart height={400}
                                       data={dv}
                                       forceFit
                                       padding={[10, 40, 60, 60]}
                                >
                                  <Legend position='bottom'   />
                                  <Axis name="data" label={label}/>
                                  <Axis name="temperature"/>
                                  <Tooltip crosshairs={{type: "y"}}
                                           g2-tooltip={{
                                               position: 'absolute',
                                               visibility: 'hidden',
                                               border: '1px solid #efefef',
                                               backgroundColor: 'white',
                                               color: '#000',
                                               opacity: "0.8",
                                               padding: '5px 15px',
                                               'transition': 'top 200ms,left 200ms'
                                           }}/>
                                  <Geom type="line" position="data*temperature" size={2} color={color}
                                        shape={'smooth'} />
                                  <Geom type='point' position="data*temperature" size={3} shape={'circle'} color={color}
                                        style={{stroke: '#fff', lineWidth: 2}}/>
                                </Chart>): ''
                        }              </div>
                  </div>
                </div>
              </Spin>
            </div>
        )

    }
}

export default ChartXilai;