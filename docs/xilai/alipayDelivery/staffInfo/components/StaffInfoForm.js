'use strict';

import React from 'react';
import { Form, Input } from 'antd';
import Common from '../../../../public/script/common';
import Utils from '../../../../public/script/utils';
import FormUtil from '../../../../lib/Components/FormUtil';
const FormItem = Form.Item;
/**
 *  component import
 */

module.exports = {
  layout: 'horizontal',
  colWidth: [6, 12, 18, 24],

  tableViews: [{
    name: 'StaffInfoPageTable',
    cols: ['orgUuid', 'userId', 'nickName', 'name', 'phone', 'orgName'],
    func: 'getStoreInfoPageTableColumns'
  }],

  initFilterForm(data){
    data.orgName='',
    data.name=''
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
            { id: 'orgName', desc: '店铺名称', max: '100', ...attrMap.orgName },
            { id: 'name', desc: '员工姓名', max: '100', ...attrMap.name },
        ];

        return rules;
    },

    getFilterForm: function (form, data, attrList, labelWidths, layout) {
      
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
          <FormItem {...itemLayouts[0] } key='orgName' label='店铺名称'  colon={true} help={hints.orgNameHint} validateStatus={hints.orgNameStatus}  className={layoutItem} >
            <Input type='text' name='orgName' id='orgName' value={data.orgName} onChange={form.handleOnChange}    {...attrMap.orgName} placeholder='店铺名称'/>
          </FormItem >,
          <FormItem {...itemLayouts[0] } key='name' label='员工姓名'  colon={true} help={hints.nameHint} validateStatus={hints.nameStatus}  className={layoutItem} >
            <Input type='text' name='name' id='name' value={data.name} onChange={form.handleOnChange}    {...attrMap.name} placeholder='员工姓名'/>
          </FormItem >,
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },

    getStoreInfoPageTableColumns: function (form) {
    var columns = [{
        title: 'APPID',
        dataIndex: 'orgUuid',
        key: 'orgUuid',
        width: 40,
      },
      {
        title: '支付宝ID',
        dataIndex: 'userId',
        key: 'userId',
        width: 40,
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
        width: 50,
      },
      {
        title: '员工姓名',
        dataIndex: 'name',
        key: 'name',
        width: 40,
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        width: 40,
      },
      {
        title: '店铺名称',
        dataIndex: 'orgName',
        key: 'orgName',
        width: 60,
      },
    ];

    return columns;
  }
};