import React from 'react';
let Utils = require('../../../../public/script/utils');
let Common = require('../../../../public/script/common');
import { Table,Modal,Button,Icon, Upload,Input} from 'antd';


var ADManageImageForm = React.createClass({
    getInitialState : function() {
        return {
            fileList:[],
            previewImage:'',
            previewVisible: false,
            fileId:''
        };
    },
    setPicture:function(picture){
       this.setState({
           fileList:[ {uid: '1',url: picture}]
       });
    },
    onPreviewImage: function(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    },
    handleCancel: function (){
        this.setState({ previewVisible: false })
    },
    onRemoveImage:function(file){
        if(this.props.disabled){
            return false;
        }
        this.props.setPicture("");
        if(length===5){
            length=length-2;
        }
        else{
            length--;
        }
        return true;
    },


    beforeUpload: function(file) {
        const isImage = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif' || file.type === 'image/png'||file.type==='image/bmp');
        if(!isImage){
            Common.warnMsg('请选择图片文件');
            return false;
        }
        if(file.size/1024/1024>10){
            Common.warnMsg('请选择小于10M的图片文件');
            return false;
        }
        this.setState({fileName:file.name});
        return true;
    },
    upload:function(info){
        let fileId = '';
        for(let i=0;i<info.fileList.length;i++){
            info.fileList[i].name = '';
            if(typeof info.fileList[i].response=='object'){
                let result=info.fileList[i].response, errCode = result.errCode;
                if(result.errCode == null || result.errCode == '' || result.errCode == '000000'){
                    fileId = result.object ? result.object : '';
                    this.props.setPicture(fileId);
                }else{
                    if(errCode === 'AUTH11' || errCode === 'AUTH09'){
                        Utils.handleServer(result.errCode);
                     }else{
                         Common.warnMsg('图片上传失败[' + result.errCode + '][' + result.errDesc + ']');
                     }
                }
            }
        }
        const isImage = (info.file.type === 'image/jpeg' || info.file.type === 'image/jpg' || info.file.type === 'image/gif' || info.file.type === 'image/png'||info.file.type==='image/bmp');
        if(!isImage && info.file.status!='removed'){
            return false;
        }
        if(info.file.size/1024/1024>10 && info.file.status!='removed'){
            return false;
        }
        this.setState({fileList:info.fileList,fileId});
    },
    render: function () {
        let $this = this;
        var actionUrl =Utils.xilaimanagerUrl+'advertisement/upload';
        var fileList=this.state.fileList;
        const { previewVisible, previewImage } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );

        const uploadBox = (
            <span>
            <Upload
                name="file"
                listType="picture-card"
                fileList={fileList}
                action={actionUrl}
                beforeUpload={this.beforeUpload}
                onRemove={this.onRemoveImage}
                onPreview={this.onPreviewImage}
                onChange={this.upload}
                accept="image/*"
                disabled={this.props.disabled}
            >
                {fileList.length >= 1? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} className='modal-noTitle'>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal></span>
        );
        return uploadBox
    }
});

module.exports = ADManageImageForm;
