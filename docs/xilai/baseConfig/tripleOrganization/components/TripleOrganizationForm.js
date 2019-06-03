'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input ,Tooltip,Icon} from 'antd';
const FormItem = Form.Item;

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import FormUtil from '../../../../lib/Components/FormUtil';
import DictSelect from '../../../../lib/Components/DictSelect';

/**
 *  component import
*/
import TripleNames from './TripleNames';
import OrgNamesFilter from './OrgNamesFilter';

module.exports = {
  layout: 'horizontal',
  colWidth: [6, 12, 18, 24],
  
  tableViews: [
    { name: 'TripleOrganizationTable', cols: ['agentCode','serviceType','orgName','logisticsCompanyName','createTime','editTime','code','active'], func: 'getTripleOrganizationTableColumns' }
  ],
  
  initFilterForm(data){
    data.logisticsCompanyUuid = '';
    data.orgNo = '';
    data.agentCode = '';
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
      { id: 'logisticsCompanyUuid', desc: '三方公司', ...attrMap.logisticsCompanyUuid },
      { id: 'orgNo', desc: '喜来服务站',max:100, ...attrMap.orgNo },
      { id: 'agentCode', desc: 'ID',max:100, ...attrMap.orgNo },
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
		<FormItem {...itemLayouts[0] } key='orgNo' label='喜来服务站'  colon={true} help={hints.orgNoHint} validateStatus={hints.orgNoStatus}  className={layoutItem} >
          <OrgNamesFilter name='orgNo' id='orgNo'
                    value={form.state.filterInfo.orgNo}
                    $this={form}
                    ref={ref=>form.OrgNamesFilter=ref}
                    setDataSource = {form.setDataSource}
                    dataSource = {form.state.dataSource}
          />
		</FormItem >,
      <FormItem {...itemLayouts[0] } key='agentCode' label='ID'  colon={true} help={hints.agentCodeHint} validateStatus={hints.agentCodeStatus}  className={layoutItem} >
        <Input type='text' name='agentCode' id='agentCode' value={data.agentCode} onChange={form.handleOnChange}    {...attrMap.agentCode} placeholder='输入ID'/>
      </FormItem >,
		<FormItem {...itemLayouts[0] } key='logisticsCompanyUuid' label='三方公司'  colon={true} help={hints.logisticsCompanyUuidHint} validateStatus={hints.logisticsCompanyUuidStatus}  className={layoutItem} >
          <TripleNames
              name='logisticsCompanyUuid'
              id='logisticsCompanyUuid'
              value={form.state.filterInfo.logisticsCompanyUuid}
              ref={ref=>form.tripleNames=ref}
              $this={form}
          />
        </FormItem >,
    ];
    
    return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
  },
  
  getTripleOrganizationTableColumns: function (form) {
    var columns = [
      {
        title: 'ID',
        dataIndex: 'agentCode',
        key: 'agentCode',
        width: 70,
      },
      {
        title: '类型',
        dataIndex: 'serviceType',
        key: 'serviceType',
        width: 80,
        render:function (text,record) {
            if(text==1){
                return '收件';
            }else if(text==2){
                return '派件';
            }
        }
      },
      {
        title: '喜来服务站名称',
        dataIndex: 'orgName',
        key: 'orgName',
        width: 140
      },
      {
        title: '三方公司',
        dataIndex: 'logisticsCompanyName',
        key: 'logisticsCompanyName',
        width: 80
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 140
      },
      {
        title: '修改时间',
        dataIndex: 'editTime',
        key: 'editTime',
        width: 140,
        render:function (text,record) {
          if(!text){
            return '--';
          }
          return text;
        }
      },
      {
        title: <div>
          骑士团邀请码
          <Tooltip placement="topLeft" title='线下建立派件合作时，需向韵达网点出示骑士团邀请码'>
            <Icon type="exclamation-circle-o" style={{marginLeft:10}} />
          </Tooltip>
        </div>,
        dataIndex: 'code',
        key: 'code',
        width: 120,
        render:function (text,record) {
          let code = record.orgInfo.invite_code;
          return code?code:'--'
      }},
      {
        title: '状态',
        dataIndex: 'active',
        key: 'active',
        width: 60,
        render:function (text,record) {
          if(text==0){
            return '禁用';
          }else if(text==1){
            return '启用';
          }
        }
      },
    ];
    
    return columns;
  }
};

