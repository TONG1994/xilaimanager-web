/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form,Col,Row,DatePicker,Input } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
import moment from 'moment';
import SearchLogisticsCompany from './SearchLogisticsCompany';
import OrgBranchSelect from './OrgBranchSelect';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
var type = Common.getUserType();
let Filter = React.createClass({
    getInitialState: function () {
        return {
            modal: this.props.moreFilter,
            hints: {},
            validRules: [],
            filter: {
                logisticsCompanyUuid:'',
                logisticsNo:'',
                orderStatus:'',
                organizationName:'',
                receiverName:'',
                receiverPhone:'',
                organizationNo:''
            },
            dataSource:[]
        }
    },

    mixins: [ModalForm('filter')],

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'logisticsCompanyName', desc: '快递公司', max: 50,},
            { id: 'orderStatus', desc: '签收状态', max: 3,},
            { id: 'logisticsNo', desc: '物流单号', max: 50,},
            { id: 'organizationName', desc: '机构名称', max: 100,},
            { id: 'courierName', desc: '派件员姓名', max: 50,},
            { id: 'organizationNo', desc: '机构名称', max: 50,},
            { id: 'receiverPhone', desc: '收件人电话', max:20,},
        ];
        this.clear();
        var defualtEnd = Utils.getDefualtEnd();
        var defualtStart = Utils.getDefualtStart();
        this.state.filter.beginEntryTime = defualtStart;
        this.state.filter.endEntryTime = defualtEnd;
    },
    getFilter:function () {
        if(Common.validator(this,this.state.filter)){
            let obj = Object.assign(this.state.filter);
            return obj;
        }
    },
    componentWillReceiveProps: function (newProps) {
        this.setState({
            modal: newProps.moreFilter,
        });
    },
    clear:function(){
        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
        if(type==1 || type==2){
            this.refs.orgBranch.state.value = '';
        }
        this.state.filter.organizationNo = '';
        this.state.filter.beginEntryTime='';
        this.state.filter.endEntryTime='';
        this.state.filter.logisticsCompanyUuid='';
        this.state.filter.orderStatus='';
        this.state.filter.logisticsNo='';
        this.state.filter.receiverPhone='';
        this.state.filter.courierName='';
        this.forceUpdate();
    },
    onChange:function(date, dateString){
        this.state.filter.beginEntryTime=dateString[0];
        this.state.filter.endEntryTime=dateString[1];
        this.setState({loading:false});
    },
    disabledDate:function disabledDate(current) {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    },
    handleOrganizationNo:function(organizationNo,orgType){
        this.state.filter.organizationNo = organizationNo;
        this.state.filter.orgType = orgType;
    },
    render: function () {
        let hints=this.state.hints;
        let layout='horizontal';
        let layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout=='vertical') ? null : {span: 4}),
            wrapperCol: ((layout=='vertical') ? null : {span: 20}),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        const dateFormat='YYYY-MM-DD';
        let filter = this.state.filter;
        let startDate = filter.beginEntryTime===''|| filter.beginEntryTime==undefined ? undefined:moment(this.state.filter.beginEntryTime, dateFormat);
        let endDate = filter.endEntryTime===''|| filter.endEntryTime==undefined ? undefined:moment(this.state.filter.endEntryTime, dateFormat);

        return (
            <div className='filter-wrap'>
                <Form layout={layout} style={{width:'100%'}}>
                    <Row  gutter={24}>
                        <Col className="gutter-row" span={6}>
                            <FormItem {...formItemLayout2} className={layoutItem} label='入库时间' >
                                <RangePicker disabledDate={this.disabledDate} value={[startDate, endDate]} defaultValue={[startDate,endDate]}  onChange={this.onChange} />
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <FormItem {...formItemLayout2} className={layoutItem} label='快递公司' >
                                <SearchLogisticsCompany  name="logisticsCompanyUuid" id="logisticsCompanyUuid" value={this.state.filter.logisticsCompanyUuid}    onSelect={this.handleOnSelected.bind(this, 'logisticsCompanyUuid')} />
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <FormItem {...formItemLayout2} className={layoutItem} label='签收状态'  help={hints.orderStatusHint} validateStatus={hints.orderStatusStatus}>
                                <DictSelect name='orderStatus' id='orderStatus'  value={this.state.filter.orderStatus} appName='喜来快递' optName='签收状态'  onSelect={this.handleOnSelected.bind(this, 'orderStatus')}/>
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <FormItem {...formItemLayout2} className={layoutItem} label='物流单号'  help={hints.logisticsNoHint} validateStatus={hints.logisticsNoStatus}>
                                <Input   placeholder="输入物流单号" type='text' name='logisticsNo' id='logisticsNo' value={this.state.filter.logisticsNo} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row  gutter={24}>
                        {/*<Col className="gutter-row" span={6}>*/}
                            {/*<FormItem {...formItemLayout2} className={layoutItem} label='机构名称'  help={hints.organizationNameHint} validateStatus={hints.organizationNameStatus}>*/}
                                {/*<Input placeholder="输入机构名称" type='text' name='organizationName' id='organizationName' value={this.state.filter.organizationName} onChange={this.handleOnChange} />*/}
                            {/*</FormItem>*/}
                        {/*</Col>*/}

                        {
                            type==3?'':(<Col className="gutter-row" span={6}>
                                <FormItem {...formItemLayout2} className={layoutItem} label='机构名称'  help={hints.orgNoHint} validateStatus={hints.orgNoStatus}>
                                    <OrgBranchSelect
                                        name="organizationNo"
                                        id="organizationNo"
                                        organizationNo={this.handleOrganizationNo}
                                        ref='orgBranch'
                                        value={this.state.filter.organizationNo}
                                    />
                                </FormItem >
                            </Col>)
                        }
                        <Col className="gutter-row" span={6}>
                            <FormItem {...formItemLayout2} className={layoutItem} label='派件员姓名'  help={hints.courierNameHint} validateStatus={hints.courierNameStatus}>
                                <Input placeholder="输入派件员姓名" type='text' name='courierName' id='courierName' value={this.state.filter.courierName} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <FormItem {...formItemLayout2} className={layoutItem} label='收件人电话'  help={hints.receiverPhoneHint} validateStatus={hints.receiverPhoneStatus}>
                                <Input placeholder="输入收件人电话" type='text' name='receiverPhone' id='receiverPhone' value={this.state.filter.receiverPhone} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>

                    </Row>
                </Form>
            </div>
        );
    }
});

module.exports = Filter;