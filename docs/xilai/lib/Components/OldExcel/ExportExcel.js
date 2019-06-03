/**
 * Excel导出组件
 * @params module filter
 * @creator gypsylu
 * @date 2018/4/28
 * 
 * module为当前的模块名，在使用之前请在XLSConfig文件中定义
 * filter为表单中的查询条件
 */
import React from 'react';
import ReactMixin from 'react-mixin';
import { Upload, Button } from 'antd';

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import XLSConfig from '../XLSConfig';
import XlsTempFile from '../Components/XlsTempFile';

var $ = require('jquery');

var ExportExcel = React.createClass({

    mixins:[XlsTempFile()],

    // 导出数据异常的回掉函数
    getErrMsg: function(resolve){
        // 如果导出的数据为空时，服务端返回JSON格式的数据，并且errCode为000000
        if(resolve.errCode === '000000'){
            Common.errMsg(`导出的数据为空!`);
        }else{
            // 如果errCode不为000000时，所以服务端发生异常
            Common.errMsg(`导出Excel文件错误[${resolve.errCode}] [${resolve.errDesc}]`);
        }
    },

    getServiceUrl: function (action) {
        return Utils.xilaimanagerUrl + action;
    },

    // 通过module获得指定的服务端url
    getUrl: function (module) {
        if (module === XLSConfig.modules.OfficialPrice) {
            return this.getServiceUrl('logistics_price/export-excel');
        } else if (module === XLSConfig.modules.ChannelPrice) {
            return this.getServiceUrl('channel_price/export-excel');
        } else if (module === XLSConfig.modules.ProfitSharing ) {
            return this.getServiceUrl('profit_allocation/export-excel');
        } else {
            url = '';
        }
    },

    // 通过module从配置文件中获取要导出的字段
    getFields: function (module) {
        if (module === XLSConfig.modules.OfficialPrice) {

            return XLSConfig.export.officialPriceFields;

        } else if (module === XLSConfig.modules.ChannelPrice) {

            return XLSConfig.export.channelPriceFields;

        } else if (module === XLSConfig.modules.ProfitSharing) {

            return XLSConfig.export.profitSharingFields;

        } else {
            return [];
        }
    },

    // 通过fetch的方式下载文件，如果发生异常可以通过Modal显示
    onExcelExport: function () {
        // 当前模块名
        let module = this.props.module;
        // 制定查询条件参数，如果没有，导出全部信息
        let filter = this.props.filter == null ? {} : this.props.filter;

        // 在分成设置在需要通过allocationType字段为区分直营型还是加盟型
        if(module === XLSConfig.modules.ProfitSharing){
            let allocationType = this.props.allocationType;
            if(allocationType == null){
                Common.errMsg('参数allocationType缺失!');
                return;
            }
            filter.allocationType = allocationType;
        }

        // 根据模块名获取Excel字段
        let fields = this.getFields(module);
        let url = this.getUrl(module);
        if(url == null || url === ''){
            Common.errMsg(`模块名[${module}]不存在!`);
            return;
        }
        
        // 通过fetch的方式进行文件下载(发生错误时，可以通过Modal框提示)
        this.downloadExcelFile(url, filter, fields, this.getErrMsg);
        
        // 通过隐藏Form的方式进行文件下载
        //this.downloadExcelByForm(url, filter, fields);
    },

    render: function () {
        return (
            <Button icon={Common.iconExport} onClick={this.props.getFilter} className='btn-margin'>导出</Button>
        )
    }
});

module.exports = ExportExcel;