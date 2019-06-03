/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import ReactDOM from 'react-dom'
import moment from 'moment';
let Reflux = require('reflux');
import { Form, Modal, Button, Input ,DatePicker,Tabs } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
import '../../../../lib/style/common.scss';
import DocTemplate from './DocTemplate';
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import ADDictSelect from '../components/ADDictSelect';
import OrganizationSelectPage from '../components/OrganizationSelectPage';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
let ADCommon = require('./ADCommon');
var ADManageStore = require('../data/ADManageStore');
var ADManageActions = require('../action/ADManageActions');
let FormDef = require('./ADManageForm');

import '../style/index.scss';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
// import 'braft-editor/dist/index.css'
import ADManageOnlineForm from './ADManageOnlineForm';
let uuid= '';
let ADManageWindowPage = React.createClass({
    getInitialState: function () {
        return {
            loading: false,
            hints: {},
            validRules: [],
            tabIndex: '2',
            previewVisible: false,
            previewImage: '',
            fileList: [],
            adManage:{
                type:'',
                typeID:'',
                title:'',
                state:'',
                upTime:'',
                downTime:'',
                link:'',
                picture:'',
                inputAddonAfter:'0/30',
                editorState:BraftEditor.createEditorState(null),
            },
            actionType:'retrieve',
            actionType1:'retrieve',
            typeType:'',
            selectDisabled:true,//服务站禁选
            checkFlag:false,//用来判断checkbox是否禁用
        };
    },

    mixins: [Reflux.listenTo(ADManageStore, 'onServiceComplete'), ModalForm('adManage')],
    onServiceComplete: function (data) {
        this.setState({loading: false});
        if (data.errMsg || data.errMsg === null) {
            this.setState({errMsg: data.errMsg});
            return;
        }
        if (data.operation === 'create' || data.operation === 'update') {
            let indexa;
            if(data.operation === 'update'){
                data.recordSet.map((item,index)=>{
                    if(item.uuid == uuid){
                        indexa = index;
                    }
                });
            }else if(data.operation === 'create'){
                indexa = data.recordSet.length-1;
            }

            if (data.recordSet[indexa].isExistSensitiveWord == '0' || data.recordSet[indexa].isExistSensitiveWord == null) {
                if(data.recordSet[indexa].typeID == 'axlMessCenter' || data.recordSet[indexa].typeID == 'axlCourierApp'){
                    if(data.recordSet[indexa].stateID == 1){
                        let newData = data.recordSet[indexa];
                        ADManageActions.push(newData);
                    }
                }
                this.setState({loading: false,modal: false,});
                this.goBack();
            } else if(data.recordSet[indexa].isExistSensitiveWord == '1'){
                // 失败
                let word = data.recordSet[indexa].sensetiveWord[0];
                let text1=word.politicallySensitive.length > 0? '政治敏感词：'+word.politicallySensitive+'；':'政治敏感词：无；';
                let text2=word.pornography.length > 0? '色情敏感词：'+word.pornography+'；':'色情敏感词：无；';
                let text3=word.violentTerror.length > 0? '恐怖主义敏感词：'+word.violentTerror+'。':'恐怖主义敏感词：无。';
                Modal.warning({
                    title: '广告涉及敏感词',
                    content: (
                        <div>
                            <p>{text1}</p>
                            <p>{text2}</p>
                            <p>{text3}</p>
                        </div>
                    ),
                    okText: '确认',
                });
                this.setState({
                    loading: false,
                    modal: false,
                });
            }
        }
    },

    componentDidMount: function () {
        this.initValidRules();
    },
    initValidRules:function(){
        let typeType='';
        let action = this.props.actionType;
        if(action === "add"){
            typeType = this.state.typeType?this.state.typeType:'';
        }else{
            typeType = this.state.adManage.typeID?this.state.adManage.typeID:'';
        }
        let attrList = [
            {
                name: 'picture',
                validator: this.checkPicture
            },
        ];
        this.state.validRules = FormDef.getADManageFormRule(this,attrList,typeType);
    },
    goBack:function() {
        this.clear();
        this.props.goBack()
    },
    clear: function (obj) {
        FormDef.initCreateADManageForm(this.state.adManage);
        this.state.hints = {};
        this.setState({loading: false});
    },
    addData:function() {
        FormDef.initCreateADManageForm(this.state.adManage);
    },
    initEditData: function (record) {
        this.state.adManage = Utils.deepCopyValue(record);
        uuid=record.uuid;
        this.setState({loading:false});
        if(record.picture){
            this.aDManageImageForm.setPicture(record.picture );
        }
        if(record.raw){
            try {
                record.raw = JSON.parse(record.raw);
            } catch (err) {
            }
            this.setState({
                editorState:BraftEditor.createEditorState(record.raw)
            })
        }
    },
    onTabChange(key) {
        if (key === '1') {
            this.goBack();
        } else {
            this.setState({tabIndex: key});
        }
    },
    getHtml: function(action){
        let  newAdManageData = this.getContent();
        newAdManageData.state = '未上线';
        newAdManageData.stateID = '0';
        if(newAdManageData.serviceStation==''){
            newAdManageData.serviceStation=[];
        }
        this.setState({loading: true});
        if (action === 'create') {
            delete newAdManageData.editorState;
            ADManageActions.create(newAdManageData);
        } else if (action === 'edit') {
            ADManageActions.update(newAdManageData,'edit');
        }
    },
    getContent: function(){
        let adManage = Utils.deepCopyValue(this.state.adManage);
        adManage.startTime = ADCommon.getNowFormatDate();
        let loginData = Common.getLoginData();
        let userName = loginData.staffInfo.perName;
        let htmlInfo = {
            html:this.state.editorState.toHTML(),
            title:adManage.title,
            userName,
            publishDate:adManage.upTime,
        };
        let innerHtml = DocTemplate(htmlInfo);
        let rawContent = this.state.editorState.toRAW();
        adManage.raw = JSON.stringify(rawContent);
        let textData = Utils.deepCopyValue(JSON.parse(rawContent));
        let flag=false,flag1=false;
        if(textData.blocks.length==1&&textData.blocks[0].text==""){
            flag = true;
        }
        if(JSON.stringify(textData.entityMap) == '{}'){
            flag1 = true;
        }
        if(flag==true && flag1 == true){
            adManage.text = "0";
            adManage.link = "";
        }else {
            adManage.text = "1";
        }
        adManage.content = innerHtml;
        return adManage;
    },
    onClickSave: function () {
        let adManage = Utils.deepCopyValue(this.state.adManage);
        this.state.adManage = Utils.deepCopyValue(adManage);
        this.initValidRules();
        if (Common.formValidator(this, this.state.adManage)) {
            this.getHtml(this.props.actionType);
        }
    },
    onClickOnline:function(action){
        // let adManage = Utils.deepCopyValue(this.state.adManage);
        let  newAdManageData = this.getContent();
        newAdManageData.upTime = ADCommon.getNowFormatDate();
        newAdManageData.state = '已上线';
        newAdManageData.stateID = '1';
        if(newAdManageData.typeID == 'axlCourierApp'){
            if(newAdManageData.serviceStation==''){
                newAdManageData.serviceStation = this.organizationSelectPage.getAllOrgNo();
            }
            if(this.props.axlCourierAppFlag){
                Modal.warning({
                    title: '提示',
                    content: '爱喜来首页轮播位最多只能上线10个广告。',
                    okText: '知道了',
                })
            }else{
                this.initValidRules();
                if (Common.formValidator(this,newAdManageData)) {
                    if (action === 'create') {
                        this.setState({actionType1:'create'},()=>{
                            this.refs.onlineWindow.initPage(newAdManageData);
                            this.refs.onlineWindow.toggle();
                        });
                    }else if(action === 'edit'){
                        this.setState({actionType1:'edit'},()=>{
                            this.refs.onlineWindow.initPage(newAdManageData);
                            this.refs.onlineWindow.toggle();
                        });
                    }

                }
            }
        }else if(newAdManageData.typeID == 'WebManage'){
            if(newAdManageData.serviceStation==''){
                newAdManageData.serviceStation=[];
            }
            if(this.props.WebManageFlag){
                Modal.warning({
                    title: '提示',
                    content: '云平台登录页广告位最多只能上线10个广告。',
                    okText: '知道了',
                })
            }else{
                this.initValidRules();
                if (Common.formValidator(this,newAdManageData)) {
                    if (action === 'create') {
                        this.setState({actionType1:'create'},()=>{
                            this.refs.onlineWindow.initPage(newAdManageData);
                            this.refs.onlineWindow.toggle();
                        });
                    }else if(action === 'edit'){
                        this.setState({actionType1:'edit'},()=>{
                            this.refs.onlineWindow.initPage(newAdManageData);
                            this.refs.onlineWindow.toggle();
                        });
                    }

                }
            }
        }else if(newAdManageData.typeID==="axlMessCenter"){
            if(newAdManageData.serviceStation==''){
                newAdManageData.serviceStation=[];
            }
            this.initValidRules();
            if (Common.formValidator(this,newAdManageData)) {
                if(newAdManageData.text === '0'){
                    Modal.warning({
                        title: '提示',
                        content: '广告内容未填写。',
                        okText: '知道了',
                    })
                }else if(newAdManageData.text === '1'){
                    if (action === 'create') {
                        delete newAdManageData.editorState;
                        this.setState({actionType1:'create'},()=>{
                            this.refs.onlineWindow.initPage(newAdManageData);
                            this.refs.onlineWindow.toggle();
                        });
                    } else if (action === 'edit') {
                        this.setState({actionType1:'edit'},()=>{
                            this.refs.onlineWindow.initPage(newAdManageData);
                            this.refs.onlineWindow.toggle();
                        });
                    }
                }
            }
        }
    },
    setPicture:function(value){
        let adManage = Utils.deepCopyValue(this.state.adManage);
        adManage.picture =  value;
        this.setState({adManage},()=>{Common.validator(this, this.state.adManage,'picture')});
    },
    checkPicture:function(value){
        if(value){

        }else{
            return '请上传广告图'
        }
    },
    onSelected: function (selectedType, value) {
        let typeSet = this.props.typeSet1,adManage = Utils.deepCopyValue(this.state.adManage), obj = {id:'',name:''};
        if(value){
            obj = typeSet.find(item => item.id === value);
        }
        adManage.typeID = obj.id;
        adManage.type = obj.name;
        if(value == 'axlMessCenter'){
            this.state.typeType='axlMessCenter';
            this.setState({loading:false});
        }else if(value == 'WebManage'){
            this.state.typeType='WebManage';
            this.setState({loading:false});
        }else if(value == 'axlCourierApp'){
            this.state.typeType='axlCourierApp';
            this.setState({loading:false});
        };
        this.setState({
            adManage
        },()=>{
            Common.validator(this, this.state.adManage, 'type');
        });
    },
    handleOnInputChange: function (e) {
        let adManage = this.state.adManage;
        let specialChar = /[/。……（）【】——《》￥*`~!@#$%^&*()_+<>?:|?<>"{},.\/\\;'[\]]/img;
        adManage[e.target.id] = e.target.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        Common.validator(this, adManage, e.target.id);
        adManage[e.target.id] = adManage[e.target.id].replace(specialChar, '');
        let len = adManage[e.target.id].length;
        adManage.inputAddonAfter = `${len}/30`;
    },
    handleChange:function(editorState){
        this.setState({ editorState });
    },
    uploadFn:function(param) {
        const serverURL = Utils.xilaimanagerUrl + 'advertisement/upload';
        const xhr = new XMLHttpRequest;
        const fd = new FormData();
        const successFn = (event) => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            let thisTarget = event.target;
            if(thisTarget.status===200 || thisTarget.statusText==="OK"){
                let response = thisTarget.response;
                try { response = JSON.parse(response)}catch (err){}
                if(response.errCode == null || response.errCode == '' || response.errCode == '000000'){
                    let url = response.object,
                        id = response.object.split("=")[1];
                    param.success({
                        url,
                        meta: {
                            id,
                            alt: '图片',
                        }
                    })
                }else{
                    if(response.errCode === 'AUTH11' || response.errCode === 'AUTH09'){
                        Utils.handleServer(result.errCode);
                    }else{
                        Common.warnMsg('图片上传失败[' + response.errCode + '][' + response.errDesc + ']');
                    }
                }

            }
            else{
                param.error({
                    msg: '上传错误！'
                });
            }
        };

        const progressFn = (event) => {
            // 上传进度发生变化时调用param.progress
            param.progress(event.loaded / event.total * 100)
        };

        const errorFn = (response) => {
            // 上传发生错误时调用param.error
            param.error({
                msg: '上传错误！'
            })
        };
        xhr.upload.addEventListener("progress", progressFn, false);
        xhr.addEventListener("load", successFn, false);
        xhr.addEventListener("error", errorFn, false);
        xhr.addEventListener("abort", errorFn, false);
        fd.append('file', param.file);
        xhr.open('POST', serverURL, true);
        xhr.send(fd);
    },
    buildPreviewHtml:function(){
        let adManage = Utils.deepCopyValue(this.state.adManage);
        adManage.startTime = ADCommon.getNowFormatDate();
        let loginData = Common.getLoginData();
        let userName = loginData.staffInfo.perName;
        let htmlInfo = {
            html:this.state.editorState.toHTML(),
            title:adManage.title,
            userName,
            publishDate:adManage.upTime,
        };
        return DocTemplate(htmlInfo);
    },
    preview:function(){
        if (window.previewWindow) {
            window.previewWindow.close()
        }
        window.previewWindow = window.open()
        window.previewWindow.document.write(this.buildPreviewHtml())
        window.previewWindow.document.close()

    },
    // selectServiceStation:function(value){
    //     this.state.adManage.serviceStation = value;
    //     this.setState({loading:false});
    // },
    selectServiceStation:function(value){
        if(value.length>0){
            this.setState({checkFlag :true});//checkbox禁用
        }else{
            this.setState({checkFlag :false});//checkbox可用
        }
        this.state.adManage.serviceStation = value;
        this.setState({loading:false});
    },
    onServiceStatiChange:function(e){
        if(e.target.checked){
            this.setState({selectDisabled :true});//服务站禁选
        }else{
            this.setState({selectDisabled :false});//服务站可选
        }
    },
    render: function () {
        let tabTitle = '', action = this.props.actionType,buttonShow ='',isCheckVisibles=false,checkDisabled=false;
        if(action === 'check'){
            tabTitle='查看广告';
            buttonShow ='none';
            isCheckVisibles=true;
            this.state.checkFlag=true;
            this.state.selectDisabled = true;
        }else if(action === 'edit'){
            tabTitle='编辑广告';
        }else if(action === 'create'){
            tabTitle='新建广告';
        }
        if(this.state.checkFlag){
            checkDisabled=true;//checkbox禁用
        }else{
            checkDisabled=false;//checkbox可用
        }
        let layout = 'horizontal';
        const editorProps = {
            media: {
                allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
                image: true, // 开启图片插入功能
                uploadFn: this.uploadFn, // 指定上传函数，说明见下文
            },
            controls: [
                'undo', 'redo', 'separator','split', 'font-size','separator','line-height','separator','letter-spacing','separator',
                'text-color', 'bold', 'italic', 'underline', 'separator', 'strike-through','superscript','subscript',
                'remove-styles',  'separator','text-align',  'separator','split', 'blockquote', 'split', 'link', 'split', 'media', 'hr', 'separator','clear'
            ],
        };
        const extendControls = [
            {
                key: 'custom-button',
                type: 'button',
                text: '预览',
                onClick: this.preview,
            }
        ]
        let  attrList = [
            {
                name:'type',
                id:'type',
                object: <ADDictSelect
                    name="type"
                    id="type"
                    value={this.state.adManage.typeID}
                    onSelect={this.onSelected.bind(this, 'type')}
                    opts={this.props.typeSet} disabled={isCheckVisibles}/>

            },
            {
                name:'title',
                id:'title',
                disabled: isCheckVisibles
            },
            {
                name:'picture',
                id:'picture',
                disabled: isCheckVisibles
            },
            {
                name:'content',
                id:'content',
                object: <BraftEditor
                    placeholder="请输入正文内容"
                    onChange={this.handleChange}
                    value ={this.state.editorState}
                    extendControls={extendControls}
                    {...editorProps}
                />
            },
            {
                name:'serviceStation',
                id:'serviceStation',
                object: <OrganizationSelectPage
                    onSelected={this.selectServiceStation}
                    value ={this.state.adManage.serviceStation}
                    disabled={this.state.selectDisabled}
                    ref = {ref=>this.organizationSelectPage = ref}
                />
            },
        ];
        let typeType='';
        if(action === "add"){
            typeType = this.state.typeType?this.state.typeType:'';
        }else{
            typeType = this.state.adManage.typeID?this.state.adManage.typeID:'';
        }
        let  items  = FormDef.getADManageForm(this, this.state.adManage, attrList,typeType,checkDisabled);

        let actionType1 = this.state.actionType1;
        let tabIndex = this.state.tabIndex;
        let modalProps = {
            actionType1,
            typeType,
        };
        return (
            <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                <Tabs  activeKey={tabIndex}  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
                    <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
                    </TabPane>
                    <TabPane tab={tabTitle} key="2" style={{width: '100%', height: '100%'}}>
                        <div style={{padding:'8px 0 16px 8px', height: '100%',overflowY: 'auto',width:'1080px'}}>
                            <ServiceMsg ref='mxgBox' svcList={['']}/>
                            <Form layout={layout} >
                                { items }
                                <FormItem style={{textAlign:'right',margin:'4px 0 30px 0', display:buttonShow}} >
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                    <Button key="btnOnline" type="danger" size="large" onClick={this.onClickOnline.bind(this,this.props.actionType )} loading={this.state.loading}>上线</Button>
                                </FormItem>

                            </Form>

                        </div>
                    </TabPane>
                </Tabs>
                <ADManageOnlineForm  ref="onlineWindow" {...modalProps} />
            </div>
        );
    }
});

export default ADManageWindowPage;
