/**
 * Excel上传组件
 * @params module callback
 * @creator gypsy
 * @date 2018/4/28
 */
import React from 'react';
import ReactMixin from 'react-mixin';
import { Upload, Button, Modal,Icon,  } from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import XlsTempFile from '../../lib/Components/XlsTempFile';
import XLSUtil from '../XLSUtil';



var UploadExcel = React.createClass({

    

    getInitialState: function () {
        return {
            file: '',
            loading:false,
            btnLoading:false,
            modalLoading:false
        }
    },
    mixins: [XlsTempFile(this), XLSUtil()],
    setVisible: function () {
        this.setState({ visible: !this.state.visible });
    },

    uploadComplete: function (errMsg) {
        if (errMsg !== '') {
            Common.errMsg(errMsg);
        } else {
            let callback = this.props.callback;
            Modal.success({
                okText: '知道了',
                title: '导入成功!',
                onOk: () => {
                    if (callback != null) {
                        callback();
                    }
                }
            })
        }
    },

    // 上传前会调用的钩子函数，返回false实现手动上传
    beforeUpload: function (file) {
        let filename = file.name;
        if (filename.indexOf('xls') == -1 && filename.indexOf('xlsx') == -1) {
            Common.errMsg('请上传Excel文件!');
            return false;
        }
        this.setState({ file });
        this.checkData(file);
        return false;
    },

    // 检查Excel数据合法性
    checkData: function (file) {
        this.setState({btnLoading:true,modalLoading:true});
        // 获取模块名
        let module = this.props.module;

        // 获取url，当前操作为数据检查，action为'check'
        let url = this.getActionUrl(module, 'check');

        // 有可能module不存在取不到url
        if (url == null || url === '') {
            Common.errMsg('数据统计错误,参数Url缺失!');
            return;
        }


        // 用户参数
        let data = {};

        // 在分成设置在需要通过allocationType字段为区分直营型还是加盟型
        if (module === 'profitSharing') {
            let allocationType = this.props.allocationType;
            if (allocationType == null) {
                Common.errMsg('数据统计错误,参数allocationType缺失!');
                return;
            }
            data.allocationType = allocationType;
        }
        // 获取检查的字段，当前操作为数据检查，action为'check'
        let fields = this.getFields(module, 'check',data.allocationType);

        // 数据检查
        this.uploadXlsFile(url, data, fields, file, this.getDataCheckInfo);
    },

    // 数据检查回调函数
    getDataCheckInfo: function (errMsg, data) {
        this.setState({btnLoading:false,modalLoading:false});
        // 如果errMsg的内容不为空，说明数据统计发生错误
        if (errMsg !== '') {
            Common.errMsg('[数据检查异常]' + errMsg);
            return;
        }

        if (data != null) {
            if(data.excelNum === '0'){
                Common.errMsg(`当前导入的Excel文件数据为空,请重新导入!`);
                return;
            }
            if (data.isOrigin === 'false') {
                Common.errMsg(`始发地与所在地信息不一致，共${data.countOrigin}条，请重新导入!`);
                return;
            }
            if (data.isLegal === 'false') {
                Common.errMsg(`当前导入的Excel文件列数与该模块不符，请查看导入数据是否有误!`);
                return;
            }
            const { file } = this.state;
            Modal.confirm({
                title: '导入数据',
                content: `已有数据${data.databaseNum}条，导入数据${data.excelNum}条，是否全部覆盖？`,
                okText: '确定',
                cancelText: '取消',
                onOk: this.uploadExcel.bind(this, file)
            });

        } else {
            Common.errMsg('数据检查异常!');
        }
    },

    // 上传Excel文件
    uploadExcel: function (file) {
        // 获取当前调用的模块名
        let module = this.props.module;
        // 上传地址
        let url = this.getActionUrl(module, 'upload');

        if (url === '' || url == null) {
            Common.errMsg('上传Excel文件错误,参数url缺失!');
            return;
        }
        
        // 用户参数
        let data = {};

        // 在数据检查中已经检查allocationType是否存在
        // 在分成设置在需要通过allocationType字段为区分直营型还是加盟型
        let allocationType = this.props.allocationType;
        data.allocationType = allocationType;
  
        // 获取Excel表头字段
        let fields = this.getFields(module, 'upload',data.allocationType);
      
        this.setState({btnLoading:true,modalLoading:true});
        // 调用XlsTempFile中的上传方法
        this.uploadXlsFile(url, data, fields, file, this.uploadComplete,this);
    },

    clear: function () {
        this.setState({ file: ''});
    },

    componentDidMount: function () {
        this.clear();
    },

    render: function () {
        const { visible } = this.props;
        return (
            <div style={{ display: visible ? 'inline-flex' : 'none' }} className='btn-margin'>
                <Upload name="file" action="/upload/" beforeUpload={this.beforeUpload} showUploadList={false} style={{ display: 'inline-block' }} >
                    <Button icon={Common.iconImport} loading={this.state.btnLoading} title="导入">导入</Button>
                </Upload>
                <Modal
                    visible={this.state.modalLoading}
                    closable={false}
                    footer={null}
                    width='140px'
                >
                    <div style={{margin:'0 auto',userSelect:'none'}}>
                        <Icon type="loading" style={{marginRight:8}}/> 导入中,请等待...
                    </div>
                    
                </Modal>
            </div>
        )
    }
});

module.exports = UploadExcel;