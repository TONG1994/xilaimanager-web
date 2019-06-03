/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form,Col,Row,DatePicker,Input } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
import moment from 'moment';
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
                organizationName:'',
                receiverName:'',
                organizationNo:''
            },
            dataSource:[]
        }
    },

    mixins: [ModalForm('filter')],

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'organizationName', desc: '机构名称', max: 100,},
            { id: 'courierName', desc: '快递员', max: 50,},
            { id: 'organizationNo', desc: '机构名称', max: 50,},
        ];
        this.clear();
        var defualtEnd = Utils.getYesterday();
        var defualtStart = Utils.getYesterday();
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
                            <FormItem {...formItemLayout2} className={layoutItem} label='快递员'  help={hints.courierNameHint} validateStatus={hints.courierNameStatus}>
                                <Input placeholder="输入快递员" type='text' name='courierName' id='courierName' value={this.state.filter.courierName} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <FormItem {...formItemLayout2} className={layoutItem} label='日期' >
                                <RangePicker disabledDate={this.disabledDate} value={[startDate, endDate]} defaultValue={[startDate,endDate]}  onChange={this.onChange} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
});

module.exports = Filter;