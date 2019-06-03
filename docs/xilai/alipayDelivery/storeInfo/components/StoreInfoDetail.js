'use strict';

import React from 'react';
var Reflux = require('reflux');
import { Form, Button, Input, Select, Tabs, Row, Col,Divider,Spin,Tooltip} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var StoreInfoStore = require('../store/StoreInfoStore');
var StoreInfoActions = require('../action/StoreInfoActions');

let StoreInfoDetail = React.createClass({
    getInitialState : function() {
        return {
            StoreInfoSet: {},
            loading: false,
            StoreInfo: {},
            hints: {},
            data:{},
        }
    },

    mixins: [Reflux.listenTo(StoreInfoStore, "onServiceComplete"), ModalForm('StoreInfo')],
    onServiceComplete: function(data) {
        if(data.operation === 'findByorgUuid'){
            if( data.errMsg === ''){
                // 成功，关闭窗口
                this.setState({
                    loading: false,
                    isLoaded:true,
                    StoreInfo:data.object,
                })
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    StoreInfoSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading:true});
        const filter=this.props.StoreInfo.orgUuid;
        StoreInfoActions.getStoreInfoDetail(filter);

    },

    goBack:function(){
        this.props.onBack();
    },

    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },


    render : function() {
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        let table=(
            <Form layout={layout} style={{width:800,marginTop:20}}>
                <Row gutter={24} style={{marginTop:20}}>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} className={layoutItem} label='APPID'>
                            <Input placeholder="APPID" type='text' name='orgUuid' id='orgUuid' value={this.state.StoreInfo.orgUuid} disabled="disabled" />
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} className={layoutItem} label='门店名称'>
                            <Input placeholder="门店名称" type='text' name='orgName' id='orgName' value={this.state.StoreInfo.orgName} disabled="disabled" />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} className={layoutItem} label='经营品类'>
                            <Select value={this.state.StoreInfo.businessCategory} onChange={this.sendtypeChange} disabled="disabled">
                                <Option value=''>-请选择-</Option>
                                <Option value='0'>快递驿站</Option>
                                <Option value='1'>超市便利站</Option>
                                <Option value='2'>美食店</Option>
                                <Option value='3'>其他</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} className={layoutItem} label='商家姓名'>
                            <Input placeholder="商家姓名" type='text' name='merchantName' id='merchantName' value={this.state.StoreInfo.merchantName} disabled="disabled" />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} className={layoutItem} label='联系电话'>
                            <Input placeholder="联系电话" type='text' name='phone' id='phone' value={this.state.StoreInfo.phone} disabled="disabled" />
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} className={layoutItem} label='省市区'>
                            <Input placeholder="省市区" type='text' name='provinces' id='provinces' value={this.state.StoreInfo.provinces} disabled="disabled" />
                        </FormItem>
                    </Col>
                </Row>
              <Row gutter={24}>
                <Col span={12}>
                    <FormItem {...formItemLayout} className={layoutItem} label='详细地址' >
                        <Input placeholder="详细地址" type='text' name='storeAddress' id='storeAddress' value={this.state.StoreInfo.storeAddress} disabled="disabled"  />
                    </FormItem>
                </Col>
              </Row>
            </Form>
        );
        var hints=this.state.hints;
        return (
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>

                <Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab="蚁派门店信息" key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:"8px 0 16px 8px", height: '100%',overflowY: 'auto'}}>
                            <ServiceMsg ref='mxgBox' svcList={['manageOrder/queryOrderDetail']}/>
                            {
                                this.state.loading ?
                                    <Spin tip="正在努力加载数据..."><div style={{minHeight: '200px'}}></div></Spin>
                                    :
                                    <div>{table}</div>
                            }
                            {/*<div>{table}</div>*/}
                        </div>
                    </TabPane>
                </Tabs>

            </div>
        );
    }
});

export default StoreInfoDetail;