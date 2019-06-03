
import React from 'react';
import ReactMixin from 'react-mixin';
import { Upload, Button ,Modal,Icon } from 'antd';

var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

import XLSUtil from '../../../lib/XLSUtil';

var ExportExcel = React.createClass({
  getInitialState:function(){
      return{
        loading:false
      }
  },
    mixins: [XLSUtil()],

    // 导出数据异常的处理函数
    getErrMsg: function (resolve) {
        this.setState({loading:false});
        if (resolve.errCode && resolve.errCode === '70025') {
            Common.warnMsg(`没有可以导出的信息!`);
            return;
        }
        Common.errMsg(`[${resolve.errCode}]导出Excel文件异常,${resolve.errDesc}`);
    },

    // 导出Excel方法
    onExcelExport: function () {
        // 当前模块名
        let module = this.props.module;

        // 获取url地址，当前操作为导出
        let url = Utils.baomimanagerUrl+'servicemarket_order/exportXls';

        if (url === '' || url == null) {
            Common.errMsg('导出Excel文件错误,参数url缺失!');
            return;
        }

        // 查询条件
        let filter = this.props.filter == null ? {} : this.props.filter;
        console.log(filter);

        // 通过隐藏Form的方式进行文件下载
        this.setState({loading:true});
        // 通过fetch的方式进行文件下载(发生错误时，可以通过Modal框提示)
        this.downloadExcelFile2(url, filter, null, this.getErrMsg,this);

    },

    render: function () {
        return (
            
            <Button icon={Common.iconExport} loading={this.state.loading} onClick={this.onExcelExport} className='btn-margin' title="导出">
              导出
              <Modal
                  visible={this.state.loading}
                  closable={false}
                  footer={null}
                  width='140px'
              >
                <div style={{margin:'0 auto',userSelect:'none'}}>
                  <Icon type="loading" style={{marginRight:8}}/> 导出中,请等待...
                </div>
  
              </Modal>
            </Button>
        )
    }
});

module.exports = ExportExcel;