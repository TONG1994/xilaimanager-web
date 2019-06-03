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

var ElectronicsInfoStore = require('../data/ElectronicsInfoStore');
var ElectronicsInfoActions = require('../action/ElectronicsInfoActions');
var FormDef = require('./ElectronicsForm');
var CreateElectronicsInfoPage = React.createClass({
    getInitialState: function() {
        return {
            electronicsInfoSet: {},
            loading: false,
            modal: false,
            electronicsInfo: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(ElectronicsInfoStore, "onServiceComplete"), ModalForm('electronicsInfo')],
    onServiceComplete: function(data) {
        if (this.state.modal && data.operation === 'create') {
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

    clear: function() {
        FormDef.initElectronicsForm(this.state.electronicsInfo);
        // FIXME 输入参数，对象初始化
        this.state.hints = {};
        this.state.electronicsInfo.uuid = '';
        this.state.electronicsInfo.logisticsCompanyUuid = '';
        this.state.loading = false;
        if (!this.state.modal && typeof(this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function() {
        var electronicsInfo = this.state.electronicsInfo;
        electronicsInfo.logisticsCompanyId = electronicsInfo.logisticsCompanyUuid;
        if (Common.formValidator(this, this.state.electronicsInfo)) {
            this.setState({ loading: true });
            var newName = this.refs.SelectCompany.getOrdNameNode(electronicsInfo.logisticsCompanyUuid);
            let newValue = Utils.deepCopyValue(this.state.electronicsInfo);
            newValue.logisticsCompanyName =  Object.keys(newName).length  ? newName : '未获取到';
            ElectronicsInfoActions.createElectronicsInfo(newValue);
        }
    },

    render : function(){
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
            <Modal visible={this.state.modal} width='540px' title="增加电子面单" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                   footer={[
                       <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                           <ServiceMsg ref='mxgBox' svcList={['electronics_form/create']}/>
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

export default CreateElectronicsInfoPage;