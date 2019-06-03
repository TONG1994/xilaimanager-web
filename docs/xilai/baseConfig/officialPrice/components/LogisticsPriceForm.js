'use strict';

import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import EditableCell from './EditableCell';
import '../style/main2.scss';
import AreaPosition from '../components/AreaPosition';
import FYSelect from './newSelect/FYSelect';

var type = Common.getUserType();
module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [
        { name: 'officialPriceTable', cols: ['code','logisticsCompanyName','transportTypeName','origin','destination','orgName','section1','firstWeightPrice1','firstWeight1','furtherWeightPrice1','section2','firstWeightPrice2','firstWeight2','furtherWeightPrice2','section3','firstWeightPrice3','firstWeight3','furtherWeightPrice3'], func: 'getOfficialPriceTableColumns' }
    ],

    initOfficialPriceForm(data){
        data.fromWhere = '';
        data.logisticsCompanyName = '';
        data.origin = '';
        data.destination = '';
    },

    getOfficialPriceFormRule: function (form, attrList)
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
            { id: 'fromWhere', desc: '数据来源', ...attrMap.fromWhere },
            { id: 'logisticsCompanyName', desc: '快递公司', ...attrMap.logisticsCompanyName },
        ];

        return rules;
    },

    getOfficialPriceForm: function (form, data, attrList, labelWidths, layout) {
        if (!labelWidths) {
            labelWidths = [8, 8, 6, 4];
        }

        var attr = FormUtil.getParam(form, attrList);
        var attrMap = attr.attrMap;

        if (!layout) {
            layout = this.layout;
        }

        var layoutItem = 'form-item-' + layout;
        var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);

        var hints = form.state.hints;
        var items = [
            <FormItem {...itemLayouts[0] } key='fromWhere' label='数据来源'  colon={true} help={hints.fromWhereHint} validateStatus={hints.fromWhereStatus}  className={layoutItem} >
                {attr.objMap.fromWhere}
            </FormItem>,
            <FormItem {...itemLayouts[0] } key='logisticsCompanyName' label='快递公司'  colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus}  className={layoutItem} >
                {attr.objMap.logisticsCompanyName}
            </FormItem>,
            <FormItem {...itemLayouts[0] } key='origin' label='始发地' colon={true} help={hints.originHint} validateStatus={hints.originStatus} className={layoutItem} >
                {attr.objMap.origin}
            </FormItem>,
            <FormItem {...itemLayouts[0] } key='destination' label='目的地' colon={true} help={hints.destinationHint} validateStatus={hints.destinationStatus} className={layoutItem} >
                {attr.objMap.destination}
            </FormItem>,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },
    initOfficialPricesForm(data){
        data.logisticsCompanyName = '';
        data.origin = '';
        data.destination = '';
    },

    getOfficialPricesFormRule: function (form, attrList)
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
            { id: 'logisticsCompanyName', desc: '快递公司', ...attrMap.logisticsCompanyName },
        ];

        return rules;
    },

    getOfficialPricesForm: function (form, data, attrList, labelWidths, layout) {
        if (!labelWidths) {
            labelWidths = [8, 8, 6, 4];
        }

        var attr = FormUtil.getParam(form, attrList);
        var attrMap = attr.attrMap;

        if (!layout) {
            layout = this.layout;
        }

        var layoutItem = 'form-item-' + layout;
        var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);

        var hints = form.state.hints;
        var items = [
            <FormItem {...itemLayouts[0] } key='logisticsCompanyName' label='快递公司'  colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus}  className={layoutItem} >
                {attr.objMap.logisticsCompanyName}
            </FormItem>,
            <FormItem {...itemLayouts[0] } key='destination' label='目的地' colon={true} help={hints.destinationHint} validateStatus={hints.destinationStatus} className={layoutItem} >
                {attr.objMap.destination}
            </FormItem>,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },

    getRule: function (form, attrList)
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
			{ id: 'logisticsCompanyUuid', desc: '快递公司', max: '60',allowed: true, required: true ,...attrMap.logisticsCompanyUuid },
			{ id: 'transportTypeUuid', desc: '运输方式', max: '60',allowed: true,  required: true , ...attrMap.transportTypeUuid },
			{ id: 'originCode', desc: '始发地', max: '50',allowed: true,  required: true , ...attrMap.originCode },
			{ id: 'destinationCode', desc: '目的地', max: '50',allowed: true,  required: true , ...attrMap.destinationCode },
			{ id: 'section1', desc: '总重区间1', max: '20',allowed: true, required: true, ...attrMap.section1 },
			{ id: 'firstWeightPrice1', desc: '首重价格1',allowed: true, required: true, max: '8', ...attrMap.firstWeightPrice1 },
            { id: 'firstWeight1', desc: '首重重量1',allowed: true, required: true, max: '8', ...attrMap.firstWeight1},
            { id: 'furtherWeightPrice1', desc: '续重价格1',allowed: true, required: true, max: '8', ...attrMap.furtherWeightPrice1},
            { id: 'section2', desc: '总重区间2', max: '20',allowed: true, ...attrMap.section2},
            { id: 'firstWeightPrice2', desc: '首重价格2',allowed: true, max: '8', ...attrMap.firstWeightPrice2},
            { id: 'firstWeight2', desc: '首重重量2',allowed: true, max: '8', ...attrMap.firstWeight2},
            { id: 'furtherWeightPrice2', desc: '续重价格2',allowed: true, max: '8', ...attrMap.furtherWeightPrice2},
            { id: 'section3', desc: '总重区间3', max: '20',allowed: true, ...attrMap.section3},
            { id: 'firstWeightPrice3', desc: '首重价格3',allowed: true, max: '8', ...attrMap.firstWeightPrice3},
            { id: 'firstWeight3', desc: '首重重量3',allowed: true, max: '8', ...attrMap.firstWeight3},
            { id: 'furtherWeightPrice3', desc: '续重价格3',allowed: true, max: '8', ...attrMap.furtherWeightPrice3},

		];

		return rules;
	},

    getOfficialPriceTableColumns: function (form) {
        var columns = [
            {
                title: '官方价格ID',
                dataIndex: 'code',
                key: 'code',
                fixed: 'left',
                width: 140,
            },
            {
                title: '快递公司',
                dataIndex: 'logisticsCompanyName',
                key: 'logisticsCompanyName',
                width: 140,
                render:(text,record)=>{
                    let content = record.recordType==="add"?(
                        <FYSelect 
                            style={{width:"120px"}}
                            size="large"
                            ref={ref=>form.FYSelect1=ref}
                            name="logisticsCompanyUuid"
                            id="logisticsCompanyUuid"
                            showSearch
                            data={form.state.logisticsMessage}
                            useLevel="1"
                            firstLevelValue={record['logisticsCompanyUuid']}
                            onSelect={form.OnLogisticsCompanySelectedValue.bind(form, 'logisticsCompanyUuid',record)}
                        />
                    )
                    :text;
                    return content;
                },
            },
            {
                title: '运输方式',
                dataIndex: 'transportTypeName',
                key: 'transportTypeName',
                width: 140,
                render:(text,record)=>{
                    let content = record.recordType==="add"?(
                        <FYSelect 
                            style={{width:"120px"}}
                            size="large"
                            ref={ref=>form.FYSelect2=ref}
                            name="transportTypeUuid"
                            id="transportTypeUuid"
                            showSearch
                            data={form.state.logisticsMessage}
                            useLevel="2"
                            firstLevelValue={record['logisticsCompanyUuid']}
                            secondLevelValue={record['transportTypeUuid']}
                            onSelect={form.OnTransportTypeSelectedValue.bind(form, 'transportTypeUuid',record)}
                        />
                    )
                    :text;
                    return content;
                },
            },
            {
                title: '始发地',
                dataIndex: 'origin',
                key: 'origin',
                width: 140,
                render:(text,record)=>{
                    let content = record.recordType==="add"?(type==="1"?(
                        <AreaPosition 
                            style={{width:"120px"}}
                            name="originCode"
                            id="originCode"
                            ref={ref=>form.AreaPosition1=ref}
                            value={record['originCode']}
                            onChange={form.originAreaPosition.bind(form, 'originCode',record)}
                        />
                    ):text)
                    :text;
                    return content;
                },
            },
            {
                title: '目的地',
                dataIndex: 'destination',
                key: 'destination',
                width: 140,
                render:(text,record)=>{
                    let content = record.recordType==="add"?(
                        <AreaPosition 
                            style={{width:"120px"}}
                            name="destinationCode"
                            id="destinationCode"
                            ref={ref=>form.AreaPosition2=ref}
                            value={record['destinationCode']}
                            onChange={form.destinationAreaPosition.bind(form, 'destinationCode',record)}
                        />
                    )
                    :text;
                    return content;
                },
            },
            {
                title: '数据来源',
                dataIndex: 'orgName',
                key: 'orgName',
                width: 140,
            },
            {
                title: '总重区间1',
                dataIndex: 'section1',
                key: 'section1',
                width: 140,
                render:(text,record)=>{
                   let content =record.recordType==="add" || record.recordType==="edit"?(
                    <EditableCell 
                        value={text}
                        cellName="section1"
                        ref={ref=>form.EditableCell1=ref}
                        onChange={form.onCellChange.bind(form , 'section1',record)}
                        onCheck={form.onCellCheck.bind(form , 'section1',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '首重价格1',
                dataIndex: 'firstWeightPrice1',
                key: 'firstWeightPrice1',
                width: 140,
                render:(text,record)=>{
                   let content = record.recordType==="add" || record.recordType==="edit"?(
                    <EditableCell 
                        value={text}
                        cellName="firstWeightPrice"
                        ref={ref=>form.EditableCell2=ref}
                        onChange={form.onCellChange.bind(form , 'firstWeightPrice1',record)}
                        onCheck={form.onCellCheck.bind(form , 'firstWeightPrice1',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '首重重量1',
                dataIndex: 'firstWeight1',
                key: 'firstWeight1',
                width: 140,
                render:(text,record)=>{
                   let content = record.recordType==="add" || record.recordType==="edit"?(
                    <EditableCell 
                        value={text}
                        cellName="firstWeight"
                        ref={ref=>form.EditableCell3=ref}
                        onChange={form.onCellChange.bind(form , 'firstWeight1',record)}
                        onCheck={form.onCellCheck.bind(form , 'firstWeight1',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '续重价格1',
                dataIndex: 'furtherWeightPrice1',
                key: 'furtherWeightPrice1',
                width: 140,
                render:(text,record)=>{
                   let content = record.recordType==="add" || record.recordType==="edit"?(
                    <EditableCell 
                        value={text}
                        cellName="furtherWeightPrice"
                        ref={ref=>form.EditableCell4=ref}
                        onChange={form.onCellChange.bind(form , 'furtherWeightPrice1',record)}
                        onCheck={form.onCellCheck.bind(form , 'furtherWeightPrice1',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '总重区间2',
                dataIndex: 'section2',
                key: 'section2',
                width: 140,
                render:(text,record)=>{
                   let content = record.recordType==="add" || record.recordType==="edit"?(
                    <EditableCell 
                        value={text}
                        cellName="section2"
                        ref={ref=>form.EditableCell5=ref}
                        onChange={form.onCellChange.bind(form , 'section2',record)}
                        onCheck={form.onCellCheck.bind(form , 'section2',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '首重价格2',
                dataIndex: 'firstWeightPrice2',
                key: 'firstWeightPrice2',
                width: 140,
                render:(text,record)=>{
                   let content = (record.recordType==="add" || record.recordType==="edit") && record.section2?(
                    <EditableCell 
                        value={text}
                        cellName="firstWeightPrice"
                        ref={ref=>form.EditableCell6=ref}
                        onChange={form.onCellChange.bind(form , 'firstWeightPrice2',record)}
                        onCheck={form.onCellCheck.bind(form , 'firstWeightPrice2',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '首重重量2',
                dataIndex: 'firstWeight2',
                key: 'firstWeight2',
                width: 140,
                render:(text,record)=>{
                   let content = (record.recordType==="add" || record.recordType==="edit") && record.section2?(
                    <EditableCell 
                        value={text}
                        cellName="firstWeight"
                        ref={ref=>form.EditableCell7=ref}
                        onChange={form.onCellChange.bind(form , 'firstWeight2',record)}
                        onCheck={form.onCellCheck.bind(form , 'firstWeight2',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '续重价格2',
                dataIndex: 'furtherWeightPrice2',
                key: 'furtherWeightPrice2',
                width: 140,
                render:(text,record)=>{
                   let content = (record.recordType==="add" || record.recordType==="edit") && record.section2?(
                    <EditableCell 
                        value={text}
                        cellName="furtherWeightPrice"
                        ref={ref=>form.EditableCell8=ref}
                        onChange={form.onCellChange.bind(form , 'furtherWeightPrice2',record)}
                        onCheck={form.onCellCheck.bind(form , 'furtherWeightPrice2',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '总重区间3',
                dataIndex: 'section3',
                key: 'section3',
                width: 140,
                render:(text,record)=>{
                   let content = record.recordType==="add" || record.recordType==="edit"?(
                    <EditableCell
                        value={text}
                        cellName="section3"
                        ref={ref=>form.EditableCell9=ref}
                        onChange={form.onCellChange.bind(form , 'section3',record)}
                        onCheck={form.onCellCheck.bind(form , 'section3',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '首重价格3',
                dataIndex: 'firstWeightPrice3',
                key: 'firstWeightPrice3',
                width: 140,
                render:(text,record)=>{
                   let content = (record.recordType==="add" || record.recordType==="edit") && record.section3?(
                    <EditableCell 
                        value={text}
                        cellName="firstWeightPrice"
                        ref={ref=>form.EditableCell10=ref}
                        onChange={form.onCellChange.bind(form , 'firstWeightPrice3',record)}
                        onCheck={form.onCellCheck.bind(form , 'firstWeightPrice3',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '首重重量3',
                dataIndex: 'firstWeight3',
                key: 'firstWeight3',
                width: 140,
                render:(text,record)=>{
                   let content = (record.recordType==="add" || record.recordType==="edit") && record.section3?(
                    <EditableCell 
                        value={text}
                        cellName="firstWeight"
                        ref={ref=>form.EditableCell11=ref}
                        onChange={form.onCellChange.bind(form , 'firstWeight3',record)}
                        onCheck={form.onCellCheck.bind(form , 'firstWeight3',record)}
                    />)
                    :text;
                    return content;
                },
            },
            {
                title: '续重价格3',
                dataIndex: 'furtherWeightPrice3',
                key: 'furtherWeightPrice3',
                width: 140,
                render:(text,record)=>{
                   let content = (record.recordType==="add" || record.recordType==="edit") && record.section3?(
                    <EditableCell 
                        value={text}
                        cellName="furtherWeightPrice"
                        ref={ref=>form.EditableCell12=ref}
                        onChange={form.onCellChange.bind(form , 'furtherWeightPrice3',record)}
                        onCheck={form.onCellCheck.bind(form , 'furtherWeightPrice3',record)}
                    />)
                    :text;
                    return content;
                },
            }
        ];

        return columns;
    }
};

