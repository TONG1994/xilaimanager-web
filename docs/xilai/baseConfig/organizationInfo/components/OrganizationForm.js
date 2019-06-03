'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import DictSelect from '../../../../lib/Components/DictSelect';
import {Modal} from "antd/lib/index";
import AreaPosition from '../../../lib/Components/AreaPositionSelect';
import '../../../../lib/style/common.scss';
module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	
	tableViews: [
		{ name: 'organizationInfoTable', cols: ['orgNo','orgType','orgAddress','orgName','userCode','headName','createTime','editTime','isEnabled'], func: 'getOrganizationInfoTableColumns' }
	],
	
	initFilterForm(data){
		data.orgType = '';
		data.orgName = '';
        data.headName = '';
		data.orgAddress='';
	},

	getFilterFormRule: function (form, attrList)
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
			{ id: 'orgType', desc: '机构类型', max: '10', ...attrMap.orgType },
			{ id: 'orgName', desc: '机构名称', max: '50', ...attrMap.orgName },
            { id: 'headName', desc: '负责人姓名', max: '15', ...attrMap.headName },
			{ id: 'orgAddress', desc: '所在地区', max: '50', ...attrMap.orgAddress },
		];

		return rules;
	},
	
	getFilterForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [8, 8, 6, 8];
		}
		
		var attr = FormUtil.getParam(form, attrList);
		var attrMap = attr.attrMap;

		if (!layout) {
			layout = this.layout;
		}

		var layoutItem = 'form-item-' + layout;
		var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);
		var orgAddressItem = layoutItem +  ' org-address-item';
		var hints = form.state.hints;
		var items = [
			<FormItem {...itemLayouts[0]} key='orgType' label='机构类型'  colon={true} help={hints.orgTypeHint} validateStatus={hints.orgTypeStatus}  className={layoutItem} >
				<DictSelect name='orgType' id='orgType'  value={data.orgType} appName='喜来快递' optName='机构类型'  onSelect={form.handleOnSelected.bind(form, 'orgType')}     {...attrMap.orgType}/>
			</FormItem>,
			<FormItem {...itemLayouts[0] } key='orgName' label='机构名称'  colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}  className={layoutItem} >
				<Input type='text' name='orgName' id='orgName' value={data.orgName} onChange={form.handleOnChange}    placeholder='输入机构名称' {...attrMap.orgName}/>
			</FormItem>,
            <FormItem {...itemLayouts[0] } key='headName' label='负责人姓名'  colon={true} help={hints.headNameHint} validateStatus={hints.headNameStatus}  className={layoutItem} >
                <Input type='text' name='headName' id='headName' value={data.headName} onChange={form.handleOnChange}    placeholder='输入负责人姓名' {...attrMap.headName}/>
            </FormItem>,
			<FormItem  {...itemLayouts[1] } key='orgAddress' label='所在地区'  colon={true} help={hints.orgAddressHint} validateStatus={hints.orgAddressStatus}  className={orgAddressItem} >
			{/* {attr.objMap.orgAddress} */}
			<AreaPosition  name='orgAddress'   id='orgAddress' ref='adress' />
		    </FormItem>,

		];
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
	initCreateForm(data){
		data.orgType = '2';
		data.parentOrgNo = '';
		data.orgName = '';
		data.orgAddress = '';
		data.detailAddress = '';
		data.businessHours = '';
		data.manageCity = '';
		data.headName = '';
		data.headTelephone = '';
		data.accountName = '';
		data.bankName = '';
		data.branchbankName = '';
		data.bankCardno = '';
		data.payNo = '';
      	data.orgLocation= '';
	},

	getCreateFormRule: function (form, attrList)
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
			{ id: 'orgType', desc: '机构类型', required: true, max: '10', ...attrMap.orgType },
			{ id: 'parentOrgNo', desc: '所属经营中心', required: true, max: '20', ...attrMap.parentOrgNo },
			{ id: 'orgName', desc: '机构名称', required: true, max: '50', ...attrMap.orgName },
			{ id: 'orgAddress', desc: '所在区域', required: true, max: '50', ...attrMap.orgAddress },
			{ id: 'detailAddress', desc: '详细地址', required: true, max: '255', ...attrMap.detailAddress },
			{ id: 'businessHours', desc: '营业时间', required: true, max: '20', ...attrMap.businessHours },
			{ id: 'manageCity', desc: '经营范围', required: true, max: '20', ...attrMap.manageCity },
			{ id: 'headName', desc: '负责人姓名', required: true, max: '20', ...attrMap.headName },
			{ id: 'headTelephone', desc: '负责人电话', required: true, max: '20', ...attrMap.headTelephone },
			{ id: 'accountName', desc: '开户名称', required: true, max: '20', ...attrMap.accountName },
			{ id: 'bankName', desc: '开户银行', required: true, max: '20', ...attrMap.bankName },
			{ id: 'branchbankName', desc: '开户支行', required: true, max: '50', ...attrMap.branchbankName },
			{ id: 'bankCardno', desc: '银行卡号', required: true, max: '20', ...attrMap.bankCardno },
			{ id: 'payNo', desc: '支付宝账号', required: true, max: '20', ...attrMap.payNo },
          	{ id: 'orgLocation', desc: '经纬度', required: true, ...attrMap.orgLocation },
		    { id: 'area', desc: '收件范围', required: true, ...attrMap.area}
		];

		return rules;
	},
	
	getCreateForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [16, 8, 6, 5];
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
			<div style={{color:'#ccc'}}>基本信息</div>,
			<FormItem {...itemLayouts[3]} key='orgType' label='机构类型' required={true} colon={true} help={hints.orgTypeHint} validateStatus={hints.orgTypeStatus} newLine={true} className={layoutItem} >
				<DictSelect name='orgType' id='orgType'  value={data.orgType} appName='喜来快递' optName='机构类型'  onSelect={form.handleOnSelected.bind(form, 'orgType')} required={true}    {...attrMap.orgType}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='parentOrgNo' label='所属经营中心' required={true} colon={true} help={hints.parentOrgNoHint} validateStatus={hints.parentOrgNoStatus}  className={layoutItem} >
			    {attr.objMap.parentOrgNo}
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='orgName' label='机构名称' required={true} colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='orgName' id='orgName' value={data.orgName} onChange={form.handleOnChange}    placeholder='输入机构名称' {...attrMap.orgName}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='orgAddress' label='所在区域' required={true} colon={true} help={hints.orgAddressHint} validateStatus={hints.orgAddressStatus} newLine={true} className={layoutItem} >
			    {attr.objMap.orgAddress}
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='detailAddress' label='详细地址' required={true} colon={true} help={hints.detailAddressHint} validateStatus={hints.detailAddressStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='detailAddress' id='detailAddress' value={data.detailAddress} onChange={form.handleOnChange}    placeholder='输入详细信息' {...attrMap.detailAddress}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='orgLocation' label='经纬度' required={true} colon={true} help={hints.orgLocationHint} validateStatus={hints.orgLocationStatus} newLine={true} className={layoutItem} >
              	{attr.objMap.orgLocation}
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='businessHours' label='营业时间' required={true} colon={true} help={hints.businessHoursHint} validateStatus={hints.businessHoursStatus} newLine={true} className={layoutItem} >
			    {attr.objMap.businessHours}
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='manageCity' label='经营范围' required={true} colon={true} help={hints.manageCityHint} validateStatus={hints.manageCityStatus} newLine={true} className={layoutItem} >
			    {attr.objMap.manageCity}
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='area' label='收件范围' required={true} colon={true} help={hints.areaHint} validateStatus={hints.areaStatus} newLine={true} className={layoutItem} >
				<Input type='text' addonAfter={'公里以内'} name='area' id='area' value={data.area} onChange={form.handleOnChange}    placeholder='输入收件范围' {...attrMap.area}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='headName' label='负责人姓名' required={true} colon={true} help={hints.headNameHint} validateStatus={hints.headNameStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='headName' id='headName' value={data.headName} onChange={form.handleOnChange}    placeholder='输入负责人姓名' {...attrMap.headName}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='headTelephone' label='负责人电话' required={true} colon={true} help={hints.headTelephoneHint} validateStatus={hints.headTelephoneStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='headTelephone' id='headTelephone' value={data.headTelephone} onChange={form.handleOnChange}    placeholder='输入负责人手机号' {...attrMap.headTelephone}/>
			</FormItem>,
			<div style={{color:'#ccc'}} >财务信息</div>,
			<FormItem {...itemLayouts[3] } key='accountName' label='开户名称' required={true} colon={true} help={hints.accountNameHint} validateStatus={hints.accountNameStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='accountName' id='accountName' value={data.accountName} onChange={form.handleOnChange}    placeholder='输入个人姓名或企业名称' {...attrMap.accountName}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='bankName' label='开户银行' required={true} colon={true} help={hints.bankNameHint} validateStatus={hints.bankNameStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='bankName' id='bankName' value={data.bankName} onChange={form.handleOnChange}    placeholder='输入银行名称' {...attrMap.bankName}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='branchbankName' label='开户支行' required={true} colon={true} help={hints.branchbankNameHint} validateStatus={hints.branchbankNameStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='branchbankName' id='branchbankName' value={data.branchbankName} onChange={form.handleOnChange}    placeholder='输入支行名称' {...attrMap.branchbankName}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='bankCardno' label='银行卡号' required={true} colon={true} help={hints.bankCardnoHint} validateStatus={hints.bankCardnoStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='bankCardno' id='bankCardno' value={data.bankCardno} onChange={form.handleOnChange}    placeholder='输入银行卡号' {...attrMap.bankCardno}/>
			</FormItem>,
			<FormItem {...itemLayouts[3] } key='payNo' label='支付宝账号' required={true} colon={true} help={hints.payNoHint} validateStatus={hints.payNoStatus} newLine={true} className={layoutItem} >
				<Input type='text' name='payNo' id='payNo' value={data.payNo} onChange={form.handleOnChange}    placeholder='输入手机或邮箱' {...attrMap.payNo}/>
			</FormItem>

		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

	getOrganizationInfoTableColumns: function (form) {
		var columns = [
			{
				title: '机构编号',
				dataIndex: 'orgNo',
				key: 'orgNo',
				width: 70
			},
			{
				title: '机构类型',
				dataIndex: 'orgType',
				key: 'orgType',
				width: 80
			},
            {
                title: '省市区',
                dataIndex: 'orgAddress',
                key: 'orgAddress',
                width: 140,
                render:function (text,record) {
                    let orgAddress = record.orgAddress.split(',');
                    let address,d=[],str;
                    try {
                        address = JSON.parse(window.sessionStorage.address)
                    } catch (err) {}

                    if (address) {
                        let sheng = address.find(item => item.value === orgAddress[0]); //获取省
                        d.push(sheng.label);
                        if(sheng.children){
                            let shi = sheng.children.find(item => item.value === orgAddress[1])||''; //获取市
                            d.push(shi.label);
                            if(shi.children){
                                let xian = shi.children.find(item => item.value === orgAddress[2])||''; //获取县
                                d.push(xian.label);
                            }
                        }
                        str = d.join('/');
                        return str;
                    }
                  return str;
                }
            },
			{
				title: '机构名称',
				dataIndex: 'orgName',
				key: 'orgName',
				width: 140
			},
		  	{
				title: '主管理员工号',
				dataIndex: 'userCode',
				key: 'userCode',
				width: 80
		  	},
            {
                title: '负责人姓名',
                dataIndex: 'headName',
                key: 'headName',
                width: 120
            },
			{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: 120
			},
			{
				title: '编辑时间',
				dataIndex: 'editTime',
				key: 'editTime',
				width: 120
			},
		    {
				title: '状态',
				dataIndex: 'isEnabled',
				key: 'isEnabled',
				width: 80,
			  	render:function (text,record) {
				  return record.isEnabled==2?'禁用':'启用'
                }
			}
		];

		return columns;
	}
};

