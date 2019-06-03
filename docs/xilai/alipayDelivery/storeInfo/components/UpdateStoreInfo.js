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
let FormDef = require('./StoreInfoForm');
var StoreInfoStore = require('../store/StoreInfoStore');
var StoreInfoActions = require('../action/StoreInfoActions');
import AreaPosition from '../../../lib/Components/AreaPosition';

let UpdateStoreInfo = React.createClass({
    getInitialState : function() {
        return {
            StoreInfoSet: {},
            loading: false,
            StoreInfo: {
                orgUuid:'',
                orgName:'',
                businessCategory:'',
                merchantName:'',
                phone:'',
                provinces:'',
                storeAddress:'',
                provincesCode:'',
            },
            hints: {},
            data:{},
        }
    },

    mixins: [Reflux.listenTo(StoreInfoStore, "onServiceComplete"), ModalForm('StoreInfo')],
    onServiceComplete: function(data) {

        this.setState({loading: false});
        if (data.errMsg) {
            this.setState({errMsg: data.errMsg});
            return;
        }
        if (data.operation === "findByorgUuid") {
            var address = data.object.provinces;
            if(!address){
                return '';
            }
            let addT = address.split('-');
            let addressList=[],zhAddress='';
            try {
                addressList = JSON.parse(window.sessionStorage.address)
            } catch (err) {}
            let sheng = addressList.find(item => item.label === addT[0]); //获取省
            zhAddress += sheng.value+',';
            if(sheng.children){
                let shi = sheng.children.find(item => item.label === addT[1]); //获取市
                zhAddress += shi.value+',';
                if(shi.children){
                    let xian = shi.children.find(item => item.label === addT[2]); //获取县
                    zhAddress += xian.value;
                }
            }
            data.object.provincesCode = zhAddress;
            let StoreInfo = data.object || [];
            this.setState({StoreInfo});
        }
    },

    // 第一次加载
    componentDidMount : function(){
        // this.setState({loading:true});
        // const filter=this.props.StoreInfo.orgUuid;
        // StoreInfoActions.getStoreInfoDetail(filter);
        // this.state.validRules = FormDef.getFilterFormRule(this);
        this.state.validRules = [
            { id: 'orgUuid', desc: 'APPID', max: 20,dataType:'number', required:true},
            { id: 'orgName', desc: '门店名称', max: 25,required:true},
            { id: 'merchantName', desc: '门店负责人', max: 20 ,required:true},
            { id: 'phone', desc: '联系方式', max: 20,dataType:'mobile',required:true},
            { id: 'provinces', desc: '省市区', max: 50,required:true},
            { id: 'storeAddress', desc: '详细地址', max: 50,required:true}
        ];
    },
    initEditData: function (orgUuid) {
        this.setState({loading: true});
        StoreInfoActions.getStoreInfoDetail(orgUuid);
    },
    goBack:function(){
        this.props.onBack();
    },

    onTabChange:function(activeKey){
        if(activeKey === '1'){
            this.props.onBack();
        }
    },

    //地区选择回调
    areaPosition:function (val) {
        this.handleOnSelected('provincesCode',val.toString());
        this.setState({loading:this.state.loading});
        let address,d='';
        try {
            address = JSON.parse(window.sessionStorage.address)
        } catch (err) {}
        if(val.length){
            if (address) {
                let sheng = address.find(item => item.value === val[0]); //获取省
                d += sheng.label+'-';
                if(sheng.children){
                    let shi = sheng.children.find(item => item.value === val[1]); //获取市
                    d += shi.label+'-';
                    if(shi.children){
                        let xian = shi.children.find(item => item.value === val[2]); //获取县
                        d += xian.label;
                    }
                }
            }
        }
        this.state.StoreInfo.provinces = d;
        Common.validator(this,this.state.StoreInfo,'provinces');
        return d;
    },

    onClickSave: function () {
        let data=this.state.StoreInfo;
        if (Common.validator(this, this.state.StoreInfo)) {
            let sendData = Utils.deepCopyValue(this.state.StoreInfo);
            this.setState({ loading: true });
            StoreInfoActions.updateStoreInfo(this.state.StoreInfo);
        }
    },

    sendtypeChange: function (value) {

        this.state.StoreInfo.businessCategory = value;
        this.setState({loading:false});
    },

    render : function() {
        let hints=this.state.hints;
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        let table=(
            <Form layout={layout} style={{width:800,marginTop:20}}>
                <Row gutter={24}>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} key='orgUuid' className={layoutItem} label='APPID'>
                            <Input placeholder="APPID" type='text' name='orgUuid' id='orgUuid' value={this.state.StoreInfo.orgUuid} disabled="disabled"/>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout}  key='orgName' className={layoutItem} label='门店名称' help={hints.orgNameHint} validateStatus={hints.orgNameStatus}>
                            <Input placeholder="门店名称" type='text' name='orgName' id='orgName' value={this.state.StoreInfo.orgName}  onChange={this.handleOnChange}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} key='businessCategory' className={layoutItem} label='经营品类'>
                            <Select value={this.state.StoreInfo.businessCategory} onChange={this.sendtypeChange}>

                                <Option value='0'>快递驿站</Option>
                                <Option value='1'>超市便利站</Option>
                                <Option value='2'>美食店</Option>
                                <Option value='3'>其他</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout} key='merchantName' className={layoutItem} label='商家姓名' help={hints.merchantNameHint} validateStatus={hints.merchantNameStatus}>
                            <Input placeholder="商家姓名" type='text' name='merchantName' id='merchantName' value={this.state.StoreInfo.merchantName}  onChange={this.handleOnChange}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col className="gutter-row" span={12}>
                        <FormItem {...formItemLayout}  key='phone' className={layoutItem} label='联系电话' help={hints.phoneHint} validateStatus={hints.phoneStatus}>
                            <Input placeholder="联系电话" type='text' name='phone' id='phone' value={this.state.StoreInfo.phone} onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" span={12}>
                            <FormItem {...formItemLayout} key='provinces' className={layoutItem} label='省市区' help={hints.provincesHint} validateStatus={hints.provincesStatus}>
                                {/*<Input placeholder="省市区" type='text' name='provinces' id='provinces' value={this.state.StoreInfo.provinces} onChange={this.handleOnChange}/>*/}
                                <AreaPosition
                                    name='provinces'
                                    id='provinces'
                                    onChange={this.areaPosition}
                                    value={this.state.StoreInfo.provincesCode}
                                />
                            </FormItem>
                        </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} key='storeAddress' className={layoutItem} label='详细地址' help={hints.storeAddressHint} validateStatus={hints.storeAddressStatus} >
                            <Input placeholder="详细地址" type='text' name='storeAddress' id='storeAddress' value={this.state.StoreInfo.storeAddress}  onChange={this.handleOnChange} />
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24} style={{ display: 'block', textAlign: 'right',marginTop:40 }}>
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                    </Col>
                </Row>
            </Form>
        );
        return (
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <ServiceMsg ref='mxgBox' svcList={['storeInfo/updateDetails']}/>
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

export default UpdateStoreInfo;