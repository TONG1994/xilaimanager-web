'use strict';

import React from 'react';
import { Form ,Input,Radio,DatePicker} from 'antd';
import moment from 'moment';
import FormUtil from "../../../../lib/Components/FormUtil";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {RangePicker } = DatePicker;

module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [
        { name: 'discountManageTable', cols: ['voucherName','createtime','creator','grantTimes','usingTimes'], func: 'getDiscountManageTableColumns' }
    ],
    initCreateModalForm(data){
        data.voucherName = "";
        data.voucherTypeUuid = 'CONDITION_DECREASE';
        data.conditionDecreasePrice = '';
        data.satisfyConditionPrice='';
        data.instantDecreasePrice='';
        data.ruleInfo='';
        data.timeTypeUuid='SECTION_TIMES';
        data.timeSectionStart='';
        data.timeSectionEnd='';
        data.timeFixed='';
        data.validDate='';
    },
    getModalFormRule: function (form, attrList)
    {
        var attrMap = {};
        if (attrList) {
            var count = attrList.length;
            for (var x = 0; x < count; x++) {
                var {
                    name,
                    ...attrs
                } = attrList[x];

                if (attrs) attrMap[name] = attrs;
            }
        }

        var rules = [
            { id: 'voucherName', desc: '优惠券名称', required: true, max: '20', ...attrMap.voucherName },
            // { id: 'voucherTypeUuid', desc: '优惠类型', required: true, ...attrMap.voucherTypeUuid },
            { id: 'satisfyConditionPrice', desc: '满', required: true, max: '20', ...attrMap.satisfyConditionPrice },
            { id: 'conditionDecreasePrice', desc: '减', required: true, max: '20', ...attrMap.conditionDecreasePrice },
            { id: 'instantDecreasePrice', desc: '立减设置', required: true, max: '20', ...attrMap.instantDecreasePrice },
            { id: 'ruleInfo', desc: '限制规则', required: true, max: '20', ...attrMap.ruleInfo },
            // { id: 'timeTypeUuid', desc: '时间类型', required: true, ...attrMap.timeTypeUuid },
            { id: 'timeSectionStart', desc: '有效开始日期', required: true, max: '20', ...attrMap.timeSectionStart },
            { id: 'timeSectionEnd', desc: '有效结束日期', required: true, max: '20', ...attrMap.timeSectionEnd },
            { id: 'timeFixed', desc: '有效时间', required: true, max: '20', ...attrMap.timeFixed },
        ];

        return rules;
    },
    getModalForm: function (form, data, attrList,voucherNewType,timeNewType, disabled,labelWidths, layout) {
        if (!labelWidths) {
            labelWidths = [16, 8, 6, 4];
        }

        var attr = FormUtil.getParam(form, attrList);
        var attrMap = attr.attrMap;

        if (!layout) {
            layout = this.layout;
        }

        var layoutItem = 'form-item-' + layout;
        var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);

        var hints = form.state.hints;
        const dateFormat='YYYY-MM-DD';
        let timeSectionStart = data.timeSectionStart===''|| data.timeSectionStart==undefined ? undefined:moment(data.timeSectionStart, dateFormat);
        let timeSectionEnd = data.timeSectionEnd===''|| data.timeSectionEnd==undefined ? undefined:moment(data.timeSectionEnd, dateFormat);
        var items = [
            <FormItem {...itemLayouts[3]} required key='voucherName' label='优惠券名称' colon={true} help={hints.voucherNameHint} validateStatus={hints.voucherNameStatus} className={layoutItem}>
                <Input type='text' name='voucherName' id='voucherName' value={data.voucherName}  {...attrMap.voucherName} onChange={form.handleOnChange} placeholder="输入优惠券名称" disabled={disabled}/>
            </FormItem>,
            <FormItem {...itemLayouts[3]} required key='voucherTypeUuid' label='优惠类型' colon={true} help={hints.voucherTypeUuidHint} validateStatus={hints.voucherTypeUuidStatus} className={layoutItem}>
                <RadioGroup onChange={form.onVoucherTypeChange} value={data.voucherTypeUuid} id='voucherType' disabled={disabled}>
                    <Radio value='CONDITION_DECREASE'>满减</Radio>
                    <Radio value='CONDITION_INCREASE'>立减</Radio>
                </RadioGroup>
            </FormItem>,
            (voucherNewType== 'CONDITION_DECREASE'?
                <FormItem {...itemLayouts[3]} required className={layoutItem} label='满减设置'>
                <Input type='text' addonBefore="满" style={{ width: 200 }} addonAfter="元" name='satisfyConditionPrice' id='satisfyConditionPrice' value={data.satisfyConditionPrice} onChange={form.handleOnChange} placeholder='输入金额' disabled={disabled}/>
                <Input type='text' addonBefore="减" style={{ width: 200 }} addonAfter="元" name='conditionDecreasePrice' id='conditionDecreasePrice' value={data.conditionDecreasePrice} onChange={form.handleOnChange} placeholder='输入金额' disabled={disabled}/>
            </FormItem>: <FormItem {...itemLayouts[3]} required key='instantDecreasePrice' label='立减设置' colon={true} help={hints.instantDecreasePricePriceHint} validateStatus={hints.instantDecreasePricePriceStatus} className={layoutItem}>
                <Input type='text' addonBefore="减" style={{ width: 200 }} addonAfter="元" name='instantDecreasePrice' id='instantDecreasePrice' value={data.instantDecreasePrice} onChange={form.handleOnChange}    placeholder='输入金额' disabled={disabled}/>
            </FormItem>),
            <FormItem {...itemLayouts[3]} required key='ruleInfo' label='限制规则' colon={true} help={hints.ruleInfoHint} validateStatus={hints.ruleInfoStatus} className={layoutItem} >
                <Input type='textarea' style={{height:"130px"}} name='ruleInfo' id='ruleInfo' value={data.ruleInfo} onChange={form.handleOnChange}    {...attrMap.ruleInfo} placeholder='请输入限制规则' disabled={disabled}/>
            </FormItem>,
            <FormItem {...itemLayouts[3]} required key='timeTypeUuid' label='时间类型' colon={true} help={hints.timeTypeUuidHint} validateStatus={hints.timeTypeUuidStatus} newLine={true} className={layoutItem} >
                <RadioGroup value={data.timeTypeUuid}  onChange={form.onTimeTypeChange} disabled={disabled}>
                    <Radio value='SECTION_TIMES'>固定日期</Radio>
                    <Radio value='FIXED_TIMES'>固定天数</Radio>
                </RadioGroup>
            </FormItem>,
            (timeNewType=='SECTION_TIMES'?
                <FormItem {...itemLayouts[3]} required key='validDate' label='有效日期' required={true} colon={true} help={hints.validDateHint} validateStatus={hints.validDateStatus}  className={layoutItem} >
                <RangePicker
                    showTime
                    onChange={form.timeChange}
                    disabledDate={form.disabledUpDate}
                    disabledTime={form.disabledRangeTime}
                    // value={data.validDate}
                    value={[timeSectionStart, timeSectionEnd]}
                    showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')]
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    showToday={false}
                    size='default'
                />
            </FormItem>:<FormItem {...itemLayouts[3]} required key='timeFixed' label='有效时间' colon={true} help={hints.timeFixedHint} validateStatus={hints.timeFixedStatus}  className={layoutItem} >
                <Input type='text' required={true} addonAfter="天" style={{ width: 200 }} name='timeFixed' id='timeFixed' value={data.timeFixed} onChange={form.handleOnChange}    placeholder='输入天数' {...attrMap.timeFixed} disabled={disabled}/>
            </FormItem>)
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    getDiscountManageTableColumns: function (form) {
        var columns = [
            {
                title: '优惠劵名称',
                dataIndex: 'voucherName',
                key: 'voucherName',
                width: 50,
            },
            {
                title: '创建时间',
                dataIndex: 'createtime',
                key: 'createtime',
                width: 50,
            },
            {
                title: '创建人',
                dataIndex: 'creator',
                key: 'creator',
                width: 50,
            },
            {
                title: '已发放次数',
                dataIndex: 'grantTimes',
                key: 'grantTimes',
                width: 50,
            },
            {
                title: '已使用次数',
                dataIndex: 'usingTimes',
                key: 'usingTimes',
                width: 50,
            },
        ];

        return columns;
    }
};

