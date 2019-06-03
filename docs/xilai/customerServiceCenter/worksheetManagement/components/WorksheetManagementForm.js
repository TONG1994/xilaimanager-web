'use strict';
import React from 'react';
import { Form, Input , Badge , Row, Col} from 'antd';
const FormItem = Form.Item;
import FormUtil from '../../../../lib/Components/FormUtil';
import '../style/main.scss';
import ing from '../style/Info.png';
const { TextArea } = Input;

module.exports = {
	layout: 'horizontal',
	colWidth: [6, 12, 18, 24],
	leftPreData:"",
	rightPreData:"",
	
	tableViews: [
		{ name: 'worksheetManagementTable', cols: ['code','title','level','chStatus','creatorName','acceptManName','createTime'], func: 'getWorksheetManagementTableColumns' }
	],

	getWorksheetManagementTableColumns: function (form) {
		let loginData=JSON.parse(window.sessionStorage.getItem("loginData"));
		var columns = [
			{
				title: '工单号',
				dataIndex: 'code',
				key: 'code',
				width: 80,
				render: (text,record)=>{
					return(
					<span>
						<a href='#' title="操作" onClick={form.dealWith.bind(null,record) }>{text}</a>
					</span>
					)
				}
			},
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				width: 160
			},
			{
				title: '优先级',
				dataIndex: 'level',
				key: 'level',
				width: 60,
				render: (text,record)=>{
					let content ;
					if(text==="1"){
						content="非常紧急";
					}else if(text==="2"){
						content="紧急";
					}else if(text==="3"){
						content="一般";
					}
					return(
						<span>
							{content}
						</span>
					)
				}
			},
			{
				title: '状态',
				dataIndex: 'chStatus',
				key: 'chStatus',
				width: 60,
				render:(text,record)=>{
					let badgeStatus;
					if(text==="受理中"){
						badgeStatus="processing";
					}else if(text==="已处理"){
						badgeStatus="success";
					}else{
						badgeStatus="default";
					}
					return(
						<div>
							<Badge status={badgeStatus} text={text} />
						</div>
					)
				}
			},
			{
				title: '发起人',
				dataIndex: 'creatorName',
				key: 'creatorName',
				width: 80,
				render:(text,record)=>{
					let content=record.creator===loginData.staffInfo.userUuid?text+"  (我)  ":text;
					return (
						<span>
							{content}
						</span>
					)
				}
			},
			{
				title: '受理人',
				dataIndex: 'acceptManName',
				key: 'acceptManName',
				width: 80,
				render:(text,record)=>{
					let content=record.acceptMan===loginData.staffInfo.userUuid?text+"  (我)  ":text;
					return (
						<span>
							{content}
						</span>
					)
				}
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',
				width: 130
			},
		];

		return columns;
	},
	
	//新增
	initWorksheetManagemenForm(data){
		data.title = '';
		data.content = '';
		data.level = '';
		data.acceptMan = '';
		data.userName = '';
		data.userPhone = '';
		data.userMail = '';
	},

	getWorksheetManagemenFormRule: function (form, attrList)
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
			{ id: 'title', desc: '工单标题', max: '60', required: true ,...attrMap.title },
			{ id: 'content', desc: '工单内容', max: '400',  required: true , ...attrMap.content },
			{ id: 'level', desc: '工单优先级', max: '50',  required: true , ...attrMap.level },
			{ id: 'acceptMan', desc: '工单受理人', max: '50',  required: true , ...attrMap.acceptMan },
			{ id: 'userName', desc: '用户姓名', min:2 , max: '20', ...attrMap.userName },
			{ id: 'userPhone', desc: '用户手机号', max: '11', ...attrMap.userPhone },
			{ id: 'userMail', desc: '用户邮箱', max: '50', ...attrMap.userMail},
		];

		return rules;
	},
	
	getWorksheetManagemenForm: function (form, data, attrList, labelWidths, layout) {
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
		// autosize这是调节文本框大小的属性，可自行选择
		var items = [
			<FormItem {...itemLayouts[3] } key='title' label='工单标题' required='true' colon={true} help={hints.titleHint} validateStatus={hints.titleStatus}  className={layoutItem} >
				<Input type='text' name='title' id='title' value={data.title} onChange={form.handleOnChange}    {...attrMap.title} placeholder='请输入标题'/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='content' label='工单内容' required='true' colon={true} help={hints.contentHint} validateStatus={hints.contentStatus}  className={layoutItem} >
				<Input type='textarea' style={{height:"130px"}} name='content' id='content' value={data.content} onChange={form.handleOnChange}    {...attrMap.content} placeholder='请输入具体内容'/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='level' label='工单优先级' required='true' colon={true} help={hints.levelHint} validateStatus={hints.levelStatus}  className={layoutItem} >
				{attr.objMap.level}
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='acceptMan' label='工单受理人' required='true'  colon={true} help={hints.acceptManHint} validateStatus={hints.acceptManStatus}  className={layoutItem} >
				{attr.objMap.acceptMan}
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='userName' label='用户姓名'  colon={true} help={hints.userNameHint} validateStatus={hints.userNameStatus}  className={layoutItem} >
				<Input type='text' name='userName' id='userName' value={data.userName} onChange={form.handleOnChange}    {...attrMap.userName} placeholder='请输入用户姓名'/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='userPhone' label='用户手机号'  colon={true} help={hints.userPhoneHint} validateStatus={hints.userPhoneStatus}  className={layoutItem} >
				<Input type='text' name='userPhone' id='userPhone' value={data.userPhone} onChange={form.handleOnChange}    {...attrMap.userPhone} placeholder='请输入用户手机号'/>
			</FormItem >,
			<FormItem {...itemLayouts[3] } key='userMail' label='用户邮箱'  colon={true} help={hints.userMailHint} validateStatus={hints.userMailStatus}  className={layoutItem} >
				<Input type='text' name='userMail' id='userMail' value={data.userMail} onChange={form.handleOnChange}    {...attrMap.userMail} placeholder='请输入用户邮箱'/>
			</FormItem >,

		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

	//filter
	initFilterForm(data){
		data.status = '';
		data.level = '';
		data.acceptMan = ''
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
			{ id: 'status', desc: '工单状态', max: '50' ,...attrMap.status },
			{ id: 'level', desc: '工单优先级', max: '50' ,...attrMap.level },
			{ id: 'acceptMan', desc: '工单优先级', max: '50' ,...attrMap.acceptMan },
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
			<FormItem {...itemLayouts[0] } key='status' label='工单状态' colon={true} help={hints.statusHint} validateStatus={hints.statusStatus}  className={layoutItem} >
				{attr.objMap.status}
			</FormItem >,
			<FormItem {...itemLayouts[0] } key='level' label='工单优先级' colon={true} help={hints.levelHint} validateStatus={hints.levelStatus}  className={layoutItem} >
				{attr.objMap.level}
			</FormItem >,
			<FormItem {...itemLayouts[0] } key='acceptMan' label='受理人' colon={true} help={hints.acceptManHint} validateStatus={hints.acceptManStatus}  className={layoutItem} >
				{attr.objMap.acceptMan}
			</FormItem >,
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

//工单处理1
initLeftForm(data){
	data.code = '';
	data.level = '';
	data.status = '';
	data.acceptManName = '';
	data.title = '';
	data.finalAnswerContent = '';
},

getLeftFormRule: function (form, attrList)
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
		{ id: 'code', desc: '工单号',...attrMap.code },
		{ id: 'level', desc: '工单优先级' , ...attrMap.level },
		{ id: 'status', desc: '工单状态' , ...attrMap.status },
		{ id: 'acceptManName', desc: '工单受理人' , ...attrMap.acceptManName },
		{ id: 'title', desc: '工单标题', min:2 , ...attrMap.title },
		{ id: 'finalAnswerContent', desc: '回复内容', max: '400', ...attrMap.finalAnswerContent },
	];

	return rules;
},

getLeftForm: function (form, data, attrList, labelWidths, layout) {
	// console.log(data);
	if (!labelWidths) {
		labelWidths = [8, 5, 6, 3];
	}
	
	var attr = FormUtil.getParam(form, attrList);
	var attrMap = attr.attrMap;

	if (!layout) {
		layout = this.layout;
	}

	var layoutItem = 'form-item-' + layout;
	// var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);
	var hints = form.state.hints;
	let itemLayouts01={
		labelCol:{ span: 5 },
		wrapperCol:{ span: 19}
	},
	itemLayouts011={
		labelCol:{ span: 6 },
		wrapperCol:{ span: 18}
	},
	itemLayouts02={
		labelCol:{ span: 9 },
		wrapperCol:{ span: 15 }
	},
	itemLayouts03={
		labelCol:{ span: 0 },
		wrapperCol:{ span: 24 }
	};

	let worksheetTitle=<span style={{fontSize:"14px",fontWeight:"bold"}}>{data.title}</span>;
	if(data && data.uuid){
		this.leftPreData=data;
	}

	var items = [
		<div className="worksheet-form-left">
			<div className="leftForm-item-lable">
				<Row>
					<Col span={8}>
						<FormItem {...itemLayouts01 } key='code' label="工单号" colon={true} help={hints.codeHint} validateStatus={hints.codeStatus}  className={layoutItem} >
							<Input className="dis-backColor sw-input" type='text' name='code' id='code' value={data.code} onChange={form.handleOnChange}    {...attrMap.code} placeholder='输入工单号' disabled/>
						</FormItem >
					</Col>
					<Col span={12}>
						<FormItem {...itemLayouts02 } key='level' label='工单优先级' colon={true} help={hints.leveltHint} validateStatus={hints.levelStatus}  className={layoutItem} >
							<Input className={this.leftPreData.level !== "3"? "dis-backColor sw-input pic-link":"dis-backColor sw-input"} type='text' name='level' id='level' value={data.level==="1"?"非常紧急":data.level==="2"?"紧急":"一般"} onChange={form.handleOnChange}    {...attrMap.level} placeholder='选择工单优先级' disabled/>
							<img src={ing} style={this.leftPreData.level ==="1"? {display:""}:{display:"none"}}/>
						</FormItem >
					</Col>
				</Row>
				<Row>
					<Col span={8} >
						<FormItem {...itemLayouts011 } key='status' label='工单状态' colon={true} help={hints.statusHint} validateStatus={hints.statusStatus}  className={layoutItem} >
								<Input className="dis-backColor sw-input" type='text' name='status' id='status' value={data.status==="1"?"受理中":data.status==="2"?"已解决":"已关闭"} onChange={form.handleOnChange}    {...attrMap.status} placeholder='输入工单状态' disabled/>
						</FormItem >
					</Col>
					<Col span={12}>
						<FormItem {...itemLayouts02 } key='acceptManName' label='工单受理人'  colon={true} help={hints.acceptManNameHint} validateStatus={hints.acceptManNameStatus}  className={layoutItem} >
								<Input className="dis-backColor sw-input" type='text' name='acceptManName' id='acceptManName' value={data.acceptManName} onChange={form.handleOnChange}    {...attrMap.acceptManName} placeholder='输入工单受理人' disabled/>
						</FormItem >
					</Col>
				</Row>
			</div>
			<Row>
				<Col span={24}>
					<div id="leftForm-texteArea" style={{marginLeft:"15px",backgroundColor:"#FFFBE6",paddingLeft:"20px",minHeight:"100px",paddingTop:"15px"}}>
						<FormItem {...itemLayouts03 } newLine={true} wrapperLength={true} key='title' label={worksheetTitle} colon={false}  help={hints.titleHint} validateStatus={hints.titleStatus}  className={layoutItem} >
							<TextArea className="sw-input coloring-input" autosize={{ minRows: 1, maxRows: 10 }} name='title' id='title' value={data.content} onChange={form.testAreaHandleOnChange} {...attrMap.title} placeholder='输入工单标题'  disabled/>
						</FormItem >
					</div>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<div	style={{marginLeft:"15px",marginTop:"15px"}}>
					<FormItem {...itemLayouts03 } newLine={true} wrapperLength={true} label=''  key='finalAnswerContent'  colon={true} help={hints.finalAnswerContentHint} validateStatus={hints.finalAnswerContentStatus}  className={layoutItem} >
						<Input className="dis-backColor" type='textarea' style={{minHeight:150}}  name='finalAnswerContent' id='finalAnswerContent' value={data.finalAnswerContent} onChange={form.handleOnChange}    {...attrMap.finalAnswerContent} placeholder={form.state.disStyle?"":'输入回复内容'} disabled={form.state.disStyle}/>
					</FormItem >
					</div>
				</Col>
			</Row>
		</div>
	];
	
	return items;
},

//工单处理2
initRightForm(data){
	data.userName = '';
	data.userPhone = '';
	data.userMail = '';
},

getRightFormRule: function (form, attrList)
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
		{ id: 'userName', desc: '用户姓名', ...attrMap.userName },
		{ id: 'userPhone', desc: '用户手机号', ...attrMap.userPhone },
		{ id: 'userMail', desc: '用户邮箱', ...attrMap.userMail },
	];

	return rules;
	},

	getRightForm: function (form, data, attrList, labelWidths, layout) {
		if (!labelWidths) {
			labelWidths = [8, 8, 6, 4];
		}
		
		var attr = FormUtil.getParam(form, attrList);
		var attrMap = attr.attrMap;
		let inputClass ="";

		if (!layout) {
			layout = this.layout;
		}

		var layoutItem = 'form-item-' + layout;
		// var itemLayouts = FormUtil.getItemLayout(layout, labelWidths);
		let itemLayouts01={
			labelCol:{ span: 2 },
			wrapperCol:{ span: 19}
		};
		let itemLayouts02={
			labelCol:{ span: 0 },
			wrapperCol:{ span: 24}
		};

		if(data && data.uuid){
			this.rightPreData=data;
		}
		var hints = form.state.hints;
		var items = [
			<div className="worksheet-form-right">
				<div style={{marginLeft:"17px"}}>
					<FormItem {...itemLayouts02 } key='userName' label=''  colon={true} help={hints.userNameHint} validateStatus={hints.userNameStatus}  className={layoutItem} >
						<Input className={this.rightPreData.userName?"dis-input text-font text-align":"dis-input text-align"} type='text' style={{textAlign:"left"}} name='userName' id='userName' value={data.userName} onChange={form.handleOnChange} on   {...attrMap.userName} placeholder='用户未留姓名' disabled/>
					</FormItem >
				</div>
				<div style={{marginLeft:"17px"}}>
					<FormItem {...itemLayouts01 } key='userPhone' label='电话'  colon={true} help={hints.userPhoneHint} validateStatus={hints.userPhoneStatus}  className={layoutItem} >
						<Input className="dis-input" type='text' name='userPhone' id='userPhone' value={data.userPhone} onChange={form.handleOnChange}    {...attrMap.userPhone} placeholder='用户未留电话号码' disabled/>
					</FormItem >
				</div>
				<div style={{marginLeft:"17px"}}>
					<FormItem {...itemLayouts01 } key='userMail' label='邮箱'  colon={true} help={hints.userMailHint} validateStatus={hints.userMailStatus}  className={layoutItem} >
						<Input className="dis-input" type='text' name='userMail' id='userMail' value={data.userMail} onChange={form.handleOnChange}    {...attrMap.userMail} placeholder='用户未留邮箱' disabled/>
					</FormItem >
				</div>
			</div>
		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

// 工单关闭
initDealForm(data){
	data.remark = '';
},

getDealFormRule: function (form, attrList)
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
		{ id: 'remark', desc: '备注', max: '100', ...attrMap.remark },

	];

	return rules;
	},

	getDealForm: function (form, data, attrList, labelWidths, layout) {
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
			<FormItem {...itemLayouts[3] } key='remark' label='备注'  colon={true} help={hints.remarkHint} validateStatus={hints.remarkStatus}  className={layoutItem} >
				<Input type='textarea' style={{height:"100px"}} name='remark' id='remark' value={data.remark} onChange={form.handleOnChange}    {...attrMap.remark} placeholder='请输入...'/>
			</FormItem >,

		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},


// 转派工单
initForwardForm(data){
	data.acceptMan = '';
	data.description = '';
},

getForwardFormRule: function (form, attrList)
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
		{ id: 'acceptMan', desc: '受理人' , required: true , max: '100', ...attrMap.acceptMan },
		{ id: 'description', desc: '备注', max: '100', ...attrMap.description },

	];

	return rules;
	},

	getForwardForm: function (form, data, attrList, labelWidths, layout) {
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
			<FormItem {...itemLayouts[1] } key='acceptMan' label='受理人' required='true' colon={true} help={hints.acceptManHint} validateStatus={hints.acceptManStatus}  className={layoutItem} >
				{attr.objMap.acceptMan}
		</FormItem >,
			<FormItem {...itemLayouts[3] } key='description' label='备注' newLine="true"  colon={true} help={hints.descriptionHint} validateStatus={hints.descriptionStatus}  className={layoutItem} >
				<Input type='textarea' name='description' style={{height:"100px"}} id='description' value={data.description} onChange={form.handleOnChange}    {...attrMap.description} placeholder='请输入...'/>
			</FormItem >,

		];
		
		return FormUtil.adjuestForm(items, attr.showMap, this.colWidth);
	},

};

