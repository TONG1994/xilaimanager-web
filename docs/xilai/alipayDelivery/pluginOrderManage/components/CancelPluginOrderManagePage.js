/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import ReactDOM from 'react-dom'
let Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col ,Radio} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
var PluginOrderManageStore = require('../data/PluginOrderManageStore.js');
var PluginOrderManageActions = require('../action/PluginOrderManageActions');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');

let CancelPluginOrderManagePage = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
    //   value:'运费不符合客户要求'
    };
  },
  
  mixins: [Reflux.listenTo(PluginOrderManageStore, 'onServiceComplete'), ModalForm('orderManage')],
  onServiceComplete: function (data) {
      if(this.state.modal && data.operation === 'cancel'){
          if( data.errMsg === ''){
              // 成功，关闭窗口
              this.setState({
                  modal: false,
                  loading:false
              });
          }
          else{
              // 失败
              this.setState({
                  loading: false,
              });
          }
      }
  },
    // 第一次加载
  componentDidMount: function () {
  },
    onChange:function(e) {
        this.setState({
            value: e.target.value,
        });
    },
    // beforeClose:function () {
    //     this.setState({value:'运费不符合客户要求'});
    // },
  onClickSave: function () {
      //保存
      this.setState({loading:true});
      var obj = {uuid:this.props.PluginOrderManage.uuid,commodityOrderId:this.props.PluginOrderManage.commodityOrderId,appId:this.props.PluginOrderManage.appId,rejectReason:this.state.value};
      console.log(obj)
      PluginOrderManageActions.cancelPluginOrderManage(obj);
  },
  render: function () {
    let layout = 'horizontal';
      const radioStyle = {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
      };
      const formItemLayout2 = {
          labelCol: ((layout == 'vertical') ? null : { span: 4}),
          wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
      };
    return (
        <Modal
            bodyStyle = {{height:177,overflow:'auto'}}
            visible={this.state.modal}
            width="540px" title="拒绝接单"
            className='organization-class'
            maskClosable={false}
            onOk={this.onClickSave}
            onCancel={this.toggle}
            footer={[
              <div key="footerDiv" className='organization-alert' style={{ display: 'block', textAlign: 'right' }}>
                <ServiceMsg ref="mxgBox" svcList={['servicemarket_order/rejectServicemarketOrder']} />
                <Button
                    key="btnOK" type="primary" size="large" onClick={this.onClickSave}
                    loading={this.state.loading}
                >保存</Button>
                <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
              </div>
            ]}
        >
          <Form ref={ref=>this.formList=ref} layout={layout} >
              <FormItem label='拒绝接单原因' {...formItemLayout2} >
                  {/* <RadioGroup onChange={this.onChange} value={this.state.value}>
                      <Radio style={radioStyle} value='运费不符合客户要求'>运费不符合客户要求</Radio>
                      <Radio style={radioStyle} value='快递员开单错误'>快递员开单错误</Radio>
                      <Radio style={radioStyle} value='用户取消邮寄'>用户取消邮寄</Radio>
                      <Radio style={radioStyle} value='其他原因'>其他原因</Radio>
                  </RadioGroup> */}
                  <TextArea defaultValue="请输入拒绝原因" rows={4} onChange={this.onChange} value={this.state.value}/>
              </FormItem>
          </Form>
        </Modal>
    );
  }
});

export default CancelPluginOrderManagePage;
