'use strict';

import React from 'react';
import { Form, Input , DatePicker } from 'antd';
import Common from '../../../../public/script/common';
import Utils from '../../../../public/script/utils';
import FormUtil from '../../../../lib/Components/FormUtil';
import moment from 'moment';
const FormItem = Form.Item;
const {RangePicker } = DatePicker;
/**
 *  component import
 */

module.exports = {
  layout: 'horizontal',
  colWidth: [6, 12, 18, 24],

  tableViews: [{
    name: 'AlipayDeliveryOrderPageTable',
    cols: ['logisticsNo', 'logisticsCompanyName', 'name', 'phone', 'orgName', 'creatorName', 'creatorTime', 'editorName', 'editorTime', 'status', 'goodsShelvesNumber', 'vercodeSendStatus' ],
    func: 'getAlipayDeliveryOrderPageTableColumns'
  }],

  initFilterForm(data){
    data.logisticsNo='',
    data.logisticsCompanyName='',
    data.orgName=''
  },

  getFilterFormRule: function (form, attrList){
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
            { id: 'logisticsNo', desc: '运单号', max: '100', ...attrMap.logisticsNo },
            { id: 'logisticsCompanyName', desc: '快递公司', max: '100', ...attrMap.logisticsCompanyName },
            { id: 'orgName', desc: '门店名称', max: '100', ...attrMap.orgName },
        ];

        return rules;
    },

    getFilterForm: function (form, data, attrList, labelWidths, layout) {
        const dateFormat='YYYY-MM-DD';
        let filterManage = form.state.filterManage;
        let startDate = filterManage.creatorTimeAfter===''|| filterManage.creatorTimeAfter==undefined ? undefined:moment(form.state.filterManage.creatorTimeAfter, dateFormat);
        let endDate = filterManage.creatorTimeBefore===''|| filterManage.creatorTimeBefore==undefined ? undefined:moment(form.state.filterManage.creatorTimeBefore, dateFormat);
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
          <FormItem {...itemLayouts[0] }label='入库时间' className={layoutItem} >
            <RangePicker disabledDate={form.disabledDate} value={[startDate, endDate]} defaultValue={[startDate,endDate]}  onChange={form.onChange} />
          </FormItem >,
          <FormItem {...itemLayouts[0] } key='logisticsCompanyName' label='快递公司'  colon={true} help={hints.logisticsCompanyNameHint} validateStatus={hints.logisticsCompanyNameStatus}  className={layoutItem} >
            <Input type='text' name='logisticsCompanyName' id='logisticsCompanyName' value={data.logisticsCompanyName} onChange={form.handleOnChange}    {...attrMap.logisticsCompanyName} placeholder='快递公司'/>
          </FormItem >,
            <FormItem {...itemLayouts[0] } key='logisticsNo' label='运单号'  colon={true} help={hints.logisticsNoHint} validateStatus={hints.logisticsNoStatus}  className={layoutItem} >
            <Input type='text' name='logisticsNo' id='logisticsNo' value={data.logisticsNo} onChange={form.handleOnChange}    {...attrMap.logisticsNo} placeholder='运单号'/>
          </FormItem >,
          <FormItem {...itemLayouts[0] } key='orgName' label='门店名称'  colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}  className={layoutItem} >
            <Input type='text' name='orgName' id='orgName' value={data.orgName} onChange={form.handleOnChange}    {...attrMap.orgName} placeholder='门店名称'/>
          </FormItem >,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },

  getAlipayDeliveryOrderPageTableColumns: function (form) {
    var columns = [{
        title: '运单号',
        dataIndex: 'logisticsNo',
        key: 'logisticsNo',
        width: 40,
      },
      {
        title: '快递公司',
        dataIndex: 'logisticsCompanyName',
        key: 'logisticsCompanyName',
        width: 40,
      },
      {
        title: '收件人',
        dataIndex: 'name',
        key: 'name',
        width: 50,
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        width: 50,
      },
      {
        title: '门店名称',
        dataIndex: 'orgName',
        key: 'orgName',
        width: 50,
      },
      {
        title: '入库员',
        dataIndex: 'creatorName',
        key: 'creatorName',
        width: 40,
      },
      {
        title: '入库时间',
        dataIndex: 'creatorTime',
        key: 'creatorTime',
        width: 60,
      },
      {
        title: '签收员',
        dataIndex: 'editorName',
        key: 'editorName',
        width: 40,
      },
      {
        title: '签收时间',
        dataIndex: 'editorTime',
        key: 'editorTime',
        width: 60,
      },
      {
        title: '快递状态',
        dataIndex: 'status',
        key: 'status',
        width: 50,
      },
      {
        title: '快递货架号',
        dataIndex: 'goodsShelvesNumber',
        key: 'goodsShelvesNumber',
        width: 50,
      },
      {
        title: '是否发送短信',
        dataIndex: 'vercodeSendStatus',
        key: 'vercodeSendStatus',
        width: 50,
      },
    ];

    return columns;
  }
};