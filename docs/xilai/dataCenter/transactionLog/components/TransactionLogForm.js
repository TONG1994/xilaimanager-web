'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import DictSelect from '../../../../lib/Components/DictSelect';

module.exports = {
  layout: 'horizontal',
  colWidth: [6, 12, 18, 24],
  
  tableViews: [
    { name: 'TripleOrganizationTable', cols: ['name','age','phone',], func: 'getTripleOrganizationTableColumns' }
  ],
  
  initFilterForm(data){
    // data.addUserType = '';
    data.name = '';
    data.phone = '';
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
      { id: 'name', desc: '姓名', max: '50', ...attrMap.name },
      { id: 'phone', desc: '联系方式', max: '11',dataType:'number', ...attrMap.phone },
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
		<FormItem {...itemLayouts[0] } key='phone' label='喜来网点'  colon={true} help={hints.phoneHint} validateStatus={hints.phoneStatus}  className={layoutItem} >
			<Input type='text' name='phone' id='phone' value={data.phone} onChange={form.handleOnChange}    {...attrMap.phone} placeholder='输入喜来网点'/>
		</FormItem >,
		<FormItem {...itemLayouts[0] } key='name' label='三方公司'  colon={true} help={hints.nameHint} validateStatus={hints.nameStatus}  className={layoutItem} >
			<Input type='text' name='name' id='name' value={data.name} onChange={form.handleOnChange}    {...attrMap.name} placeholder='输入三方公司'/>
		</FormItem >,
    ];
    
    return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
  },
  initTripleOrganizationForm(data){
    // data.addUserType = '';
    data.sanfang = '';
    data.name = '';
  },
  
  getTripleOrganizationFormRule: function (form, attrList)
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
      { id: 'sanfang', desc: '三方公司名称', max: '50', ...attrMap.sanfang },
      { id: 'name', desc: '喜来服务站名称', max: '20', ...attrMap.name },
    ];
    
    return rules;
  },
  
  getTripleOrganizationForm: function (form, data, attrList, labelWidths, layout) {
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
    var items = [
      <div style={{color:'#ccc'}} key='基本信息'>基本信息</div>,
      <FormItem {...itemLayouts[3] } key='sanfang' label='sanfang'  colon={true} help={hints.sanfangHint} validateStatus={hints.sanfangStatus}  className={layoutItem} >
        <Input type='text' name='sanfang' id='sanfang' value={data.sanfang} onChange={form.handleOnChange}    {...attrMap.sanfang} placeholder='sanfang'/>
      </FormItem >,
      <FormItem {...itemLayouts[3] } key='name' label='姓名'  colon={true} help={hints.nameHint} validateStatus={hints.nameStatus}  className={layoutItem} >
        <Input type='text' name='name' id='name' value={data.name} onChange={form.handleOnChange}    {...attrMap.name} placeholder='输入姓名'/>
      </FormItem >,
    ];
    
    return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
  },
  getTripleOrganizationTableColumns: function (form) {
    var columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 140,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 140
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
        width: 140
      },
    ];
    
    return columns;
  }
};

