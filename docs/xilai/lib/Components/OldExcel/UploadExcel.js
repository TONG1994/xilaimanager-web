/**
 * Excel上传组件
 * @params module callback
 * @creator gypsy
 * @date 2018/4/28
 */
import React from 'react';
import ReactMixin from 'react-mixin';
import { Upload, Button, Modal } from 'antd';
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import XlsTempFile from '../../lib/Components/XlsTempFile';
import XLSConfig from '../XLSConfig';



var UploadExcel = React.createClass({

    mixins: [XlsTempFile()],

    getInitialState: function () {
        return {
            file: '',
        }
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

        let module = this.props.module;

        let url = this.getUrl(module, true);
        let fields = this.getFields(module);
        let data = {};

        // 在分成设置在需要通过allocationType字段为区分直营型还是加盟型
        if (module === XLSConfig.modules.ProfitSharing) {
            let allocationType = this.props.allocationType;
            if (allocationType == null) {
                Common.errMsg('参数allocationType缺失!');
                return;
            }
            data.allocationType = allocationType;
        }

        // 数据统计
        this.uploadXlsFile(url, data, fields, file, this.getMsgInfo);
        return false;
    },

    // 上传Excel文件
    uploadExcel: function (file) {
        // 获取当前调用的模块名
        let module = this.props.module;
        // 上传地址
        let url = this.getUrl(module, false);
        // Excel表头字段
        let fields = this.getFields(module);
        // 用户参数
        //let data = { creator: window.loginData.staffInfo.perName, fromWhere: window.loginData.staffInfo.organizationUuid };
        let data = {};

        // 在分成设置在需要通过allocationType字段为区分直营型还是加盟型
        if (module === XLSConfig.modules.ProfitSharing) {
            let allocationType = this.props.allocationType;
            if (allocationType == null) {
                Common.errMsg('参数allocationType缺失!');
                return;
            }
            data.allocationType = allocationType;
        }

        this.uploadXlsFile(url, data, fields, file, this.uploadComplete);
    },

    // 数据统计回调函数
    getMsgInfo: function (errMsg, data) {
        // 如果errMsg的内容不为空，说明数据统计发生错误
        if (errMsg !== '') {
            Common.errMsg('[数据统计异常]' + errMsg);
            return;
        }

        if (data != null) {
            const { file } = this.state;
            Modal.confirm({
                title: '导入数据',
                content: `已有数据${data.databaseNum}条，导入数据${data.excelNum}条，是否全部覆盖？`,
                okText: '确定',
                cancelText: '取消',
                onOk: this.uploadExcel.bind(this, file)
            });
        } else {
            Common.errMsg('数据统计异常!');
        }
    },

    getServiceUrl: function (action) {
        return Utils.xilaimanagerUrl + action;
    },

    // 根据父组件的模块名来获得上传路径
    getUrl: function (module, validate) {
        // validate判断是否需要数据统计
        let suffix = validate === true ? '/upload-xls-inspect' : '/upload-xls';

        if (module === XLSConfig.modules.OfficialPrice) {
            return this.getServiceUrl('logistics_price' + suffix);
        } else if (module === XLSConfig.modules.ChannelPrice) {
            return this.getServiceUrl('channel_price' + suffix);
        } else if (module === XLSConfig.modules.profitSharing) {
            return this.getServiceUrl('profit_allocation' + suffix);
        }
    },


    // 从配置文件获取Excel表格的字段
    getFields: function (module) {
        if (module === XLSConfig.modules.OfficialPrice) {
            return XLSConfig.upload.officialPriceFields;
        } else if (module === XLSConfig.modules.profitSharing) {
            let type =
            return XLSConfig.upload.profitSharingFields;
        } else {
            return [];
        }
    },

    clear: function () {
        this.state.file = '';
    },

    componentDidMount: function () {
        this.clear();
    },

    render: function () {
        return (
            <div style={{ display: 'inline-flex' }} className='btn-margin'>
                <Upload name="file" action="/upload/" beforeUpload={this.beforeUpload} style={{ display: 'inline-block' }}>
                    <Button icon={Common.iconImport}>导入</Button>
                </Upload>
            </div>
        )
    }
});

module.exports = UploadExcel;