import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col, Icon } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import LogisticsCompanySelect from '../../../lib/Components/logisticsCompany/LogisticsCompanySelect';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
// var LogisticsCompanySelect = ('../../../lib/Components/logisticsCompany/LogisticsCompanySelect')

var ElectronicsInfoStore = require('../data/ElectronicsInfoStore');
var ElectronicsInfoActions = require('../action/ElectronicsInfoActions');
var FormDef = require('./ElectronicsForm');

var UpdateElectronicsInfoPage = React.createClass({
    getInitialState: function() {
        return {
            electronicsInfoSet: {},
            loading: false,
            modal: false,
            electronicsInfo: {},
            hints: {},
            validRules: [],
            oldValue: {}
        }
    },

    mixins: [Reflux.listenTo(ElectronicsInfoStore, "onServiceComplete"), ModalForm('electronicsInfo')],
    onServiceComplete: function(data) {
        if (this.state.modal && data.operation === 'update') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            } else {
                // 失败
                this.setState({
                    loading: false,
                    electronicsInfoSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function() {
        this.state.validRules = FormDef.getElectronicsFormRule();
    },

    initPage: function(electronicsInfo) {
        electronicsInfo.logisticsCompanyUuid = electronicsInfo.logisticsCompanyId;
        FormDef.initElectronicsForm(this.state.electronicsInfo);
        this.state.hints = {};
        Utils.copyValue(electronicsInfo, this.state.electronicsInfo);
        Utils.copyValue(electronicsInfo, this.state.oldValue);
        this.state.loading = false;
        if (!this.state.modal && typeof(this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function() {
        var electronicsInfo = this.state.electronicsInfo;
        electronicsInfo.uuid = electronicsInfo.uuid;
        electronicsInfo.logisticsCompanyId = electronicsInfo.logisticsCompanyUuid;
        var newName = this.refs.SelectCompany.getOrdNameNode(electronicsInfo.logisticsCompanyUuid);
        var oldName = this.refs.SelectCompany.getOrdNameNode(this.state.oldValue.logisticsCompanyUuid || this.state.oldValue.logisticsCompanyId);
        if (Common.formValidator(this, this.state.electronicsInfo)) {
            this.setState({ loading: true });
            let newValue = Utils.deepCopyValue(this.state.electronicsInfo);
            newValue.logisticsCompanyName =  Object.keys(newName).length  ? newName : '未获取到';
            let oldValue = Utils.deepCopyValue(this.state.oldValue);
            oldValue.logisticsCompanyName =  Object.keys(oldName).length ? oldName : '未获取到';
            ElectronicsInfoActions.updateElectronicsInfo(newValue, oldValue);
        }
    },

  
    render : function() {
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        let  attrList = [
            {
                name:'logisticsCompanyId',
                id:'logisticsCompanyId',
                object:<LogisticsCompanySelect
                    name="logisticsCompanyUuid"
                    id="logisticsCompanyUuid"
                    ref="SelectCompany"
                    value={this.state.electronicsInfo['logisticsCompanyUuid']}
                    onSelect={this.handleOnSelected.bind(this, 'logisticsCompanyUuid')} />
            }
        ];
        let  items  = FormDef.getElectronicsForm(this, this.state.electronicsInfo,attrList);
        return (
            <Modal visible={this.state.modal} width='540px' title="修改电子面单" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                   footer={[
                       <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                           <ServiceMsg ref='mxgBox' svcList={['electronics_form/update']}/>
                           <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                           <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                       </div>
                   ]}
            >
                <Form layout={layout}>
                    {items}
                </Form>
                <div style={{backgroundColor:"#50BFFF",color:'white',padding:'10',width:"62%",height:'80px',marginLeft:'19%'}}>
                    <Icon type="exclamation-circle" style={{ fontSize: 20, color: '#fff',float:'left'}} />
                    <div style={{float:'right',width:"90%"}}>温馨提示：<br/>商家ID和密钥是快递服务站给您开通来获取电子面单的账号和密钥，具体咨询合作快递服务站即可。</div>
                </div>
            </Modal>
        );
    }
});

export default UpdateElectronicsInfoPage;