'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, DatePicker } from 'antd';
const FormItem = Form.Item;


var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import DictSelect from '../../../../lib/Components/DictSelect';

module.exports = {
  layout: 'horizontal',
  colWidth: [6, 12, 12, 12, 12, 12, 12],
  
  tableViews: [
    { name: 'operateLogTable', cols: ['dataIndex','userCode','orgName','ip','createTime','moduleName','operation','logicCode'], func: 'getOperateLogTableColumns' }
  ],
  
  initFilterForm(data){
    data.name = '';
    data.userCode = '';
    data.moduleName = '';
    data.operation = '';
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
      { id: 'name', desc: '操作日期', ...attrMap.name },
      { id: 'userCode', desc: '账号', ...attrMap.userCode },
      { id: 'moduleName', desc: '操作模块', ...attrMap.moduleName },
      { id: 'operation', desc: '动作', ...attrMap.operation },
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
      <FormItem {...itemLayouts[0] } key='name' label='操作日期'  colon={true} help={hints.nameHint} validateStatus={hints.nameStatus}  className={layoutItem} >
          {attr.objMap.name}
      </FormItem >,
      <FormItem {...itemLayouts[0] } key='userCode' label='账号'  colon={true} help={hints.userCodeHint} validateStatus={hints.userCodeStatus}  className={layoutItem} >
        <Input type='text' name='userCode' id='userCode' value={data.userCode} onChange={form.handleOnChange}    {...attrMap.userCode} placeholder='输入账号'/>
      </FormItem >,
      <FormItem {...itemLayouts[0] } key='moduleName' label='操作模块'  colon={true} help={hints.moduleNameHint} validateStatus={hints.moduleNameStatus}  className={layoutItem} >
        <Input type='text' name='moduleName' id='moduleName' value={data.moduleName} onChange={form.handleOnChange}    {...attrMap.moduleName} placeholder='输入操作'/>
      </FormItem >,
      <FormItem {...itemLayouts[0] } key='operation' label='动作'  colon={true} help={hints.operationHint} validateStatus={hints.operationStatus}  className={layoutItem} >
        <Input type='text' name='operation' id='operation' value={data.operation} onChange={form.handleOnChange}    {...attrMap.operation} placeholder='输入动作'/>
      </FormItem >,
    ];
    
    return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
  },
    //cols: ['dataIndex','userCode','orgName','ip','createTime','moduleName','operation']
  getOperateLogTableColumns: function (form) {
    var columns = [
      {
        title: '序号',
        dataIndex: 'dataIndex',
        key: 'dataIndex',
        width: 50,
      },
      {
        title: '账号',
        dataIndex: 'userCode',
        key: 'userCode',
        width: 80
      },
      {
        title: '机构',
        dataIndex: 'orgName',
        key: 'orgName',
        width: 140
      },
      {
          title: 'IP地址',
          dataIndex: 'ip',
          key: 'ip',
          width: 100
      },
      {
          title: '操作时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 140
      },
      {
          title: '操作模块',
          dataIndex: 'moduleName',
          key: 'moduleName',
          width: 80
      },
      {
          title: '动作',
          dataIndex: 'operation',
          key: 'operation',
          width: 80
      },
        {
            title: 'ID',
            dataIndex: 'logicCode',
            key: 'logicCode',
            width: 100,
            render:function (text) {
              if(!text){
                return '--'
              }
              return text
            }
        },
    ];
    
    return columns;
  }
};

