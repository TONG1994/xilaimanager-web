'use strict';

import React from 'react';
import { Form, Input, Row, Col,Checkbox} from 'antd';
const FormItem = Form.Item;
import FormUtil from '../../../../lib/Components/FormUtil';
import ADManageImageForm from './ADManageImageForm';

module.exports = {
    layout: 'horizontal',
    colWidth: [6, 12, 18, 24],

    tableViews: [
        { name: 'ADManageTable', cols: ['type','title','startTime','upTime','downTime','state'], func: 'getADManageTableColumns' }
    ],

    getADManageTableColumns: function (form) {
        var columns = [
            {
                title: '广告位',
                dataIndex: 'type',
                key: 'type',
                fixed: 'left',
                width: 150
            },
            {
                title: '活动标题',
                dataIndex: 'title',
                key: 'title',
                width: 180
            },
            {
                title: '创建时间',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 150
            },
            {
                title: '上线时间',
                dataIndex: 'upTime',
                key: 'upTime',
                width: 150
            },
            {
                title: '下线时间',
                dataIndex: 'downTime',
                key: 'downTime',
                width: 150
            },
            {
                title: '发布状态',
                dataIndex: 'state',
                key: 'state',
                width: 80,
            },
        ];
        return columns;
    },
    initCreateADManageForm(data){
		data.type = "";
        data.typeID = "";
      	data.title = '';
      	data.picture='';
        data.serviceStation='';
	},

	getADManageFormRule: function (form, attrList,typeType){
		var attrMap = {};
		attrList = typeType != 'axlMessCenter'?attrList:null;

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
            { id: 'type', desc: '广告位',required:true,   ...attrMap.type },
            { id: 'title', desc: '活动标题',required:true, max: '30', ...attrMap.title },
            (typeType != 'axlMessCenter'?{ id: 'picture', desc: '上传图片', uploadPictureRequired:true,...attrMap.picture }:''),
		];

		return rules;
    },
    getADManageForm: function (form, data, attrList,typeType, checkDisabled, labelWidths, layout) {
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
            <FormItem {...itemLayouts[3] } newLine={true}  key='type' label='广告位' required  colon={true} help={hints.typeHint} validateStatus={hints.typeStatus}  className={layoutItem} >
                {attr.objMap.type}
            </FormItem>,
            <FormItem {...itemLayouts[3] } newLine={true}  key='title' label='活动标题' required colon={true} help={hints.titleHint} validateStatus={hints.titleStatus}  className={layoutItem} >
                <Input type='text' name='title' id='title' value={data.title} onChange={form.handleOnInputChange}    placeholder='请输入不超过30个字符' {...attrMap.title} addonAfter={data.inputAddonAfter}/>
            </FormItem>,
            (typeType== 'WebManage'?
                    <span>
                    <FormItem {...itemLayouts[3] } newLine={true}   key='picture' label='广告图' required={true} colon={true} help={hints.pictureHint} validateStatus={hints.pictureStatus}  className={layoutItem}  >
                        <ADManageImageForm   ref={ ref=> form.aDManageImageForm = ref} {...attrMap.picture} setPicture={form.setPicture}/>
                        <span style={{textAlign:'bottom',position:'relative'}}>图片规格建议：云平台登录页广告位：700*480；<span style={{position:'absolute',left:96,top:12}}>爱喜来首页轮播图：375*246；</span></span>
                    </FormItem>
                    <FormItem {...itemLayouts[3] } newLine={true}   key='content' label='广告内容' colon={true} help={hints.contentHint} validateStatus={hints.contentStatus}  className={layoutItem}>{attr.objMap.content}</FormItem>
                    </span>
                    :
                    typeType== 'axlMessCenter'?
                    <div>
                        <FormItem {...itemLayouts[3] } newLine={true}   key='content' label='广告内容' colon={true} help={hints.contentHint} validateStatus={hints.contentStatus}  className={layoutItem}  >{attr.objMap.content}</FormItem>
                    </div>
                    :
                    <span>
                        <FormItem {...itemLayouts[3] } newLine={true}  key='serviceStation' label='服务站' colon={true} help={hints.serviceStationHint} validateStatus={hints.serviceStationStatus}  className={layoutItem} >
                            <Row>
                                  <Col span={4}>
                                    <Checkbox onChange={form.onServiceStatiChange} defaultChecked disabled={checkDisabled}>无限制</Checkbox>
                                  </Col>
                                  <Col span={20}>
                                    {attr.objMap.serviceStation}
                                  </Col>
                             </Row>
                        </FormItem>
                        <FormItem {...itemLayouts[3] } newLine={true}   key='picture' label='广告图' required={true} colon={true} help={hints.pictureHint} validateStatus={hints.pictureStatus}  className={layoutItem}  >
                            <ADManageImageForm   ref={ ref=> form.aDManageImageForm = ref} {...attrMap.picture} setPicture={form.setPicture}/>
                            <span style={{textAlign:'bottom',position:'relative'}}>图片规格建议：云平台登录页广告位：700*480；<span style={{position:'absolute',left:96,top:12}}>爱喜来首页轮播图：375*246；</span></span>
                         </FormItem>
                        <FormItem {...itemLayouts[3] } newLine={true}   key='content' label='广告内容' colon={true} help={hints.contentHint} validateStatus={hints.contentStatus}  className={layoutItem}>{attr.objMap.content}</FormItem>
                    </span>

            ),
        ];

        return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
    },

    initFilterForm(data){
		data.type = '';
		data.state = '';
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
			<FormItem {...itemLayouts[0] } key='type' label='广告位' newLine={false}  colon={true} help={hints.typeHint} validateStatus={hints.typeStatus}  className={layoutItem} >
		    {attr.objMap.type}
        	</FormItem>,
			<FormItem {...itemLayouts[0] } key='state' label='发布状态' newLine={false}  colon={true} help={hints.stateHint} validateStatus={hints.stateStatus}  className={layoutItem} >
			{attr.objMap.state}
		</FormItem>,

		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},
};

