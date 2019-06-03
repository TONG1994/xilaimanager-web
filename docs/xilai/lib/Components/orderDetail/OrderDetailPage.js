import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import '../../../../lib/style/common.scss';
import { Form, Button, Input, Select, Tabs, Row, Col,Divider,Spin,Tooltip,Icon,Upload,Modal,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');
import AreaPosition from '../AreaPosition';

var ManageOrderStore = require('../../../dataCenter/orderManage/data/ManageOrderStore.js');
var ManageOrderActions = require('../../../dataCenter/orderManage/action/ManageOrderActions');
import TimeLine from './TimeLine';
var orderOld = [];
let OrderDetailPage = React.createClass({
  getInitialState : function() {
    return {
      ManageOrderSet: {},
      loading: false,
      ManageOrder: {},
      hints: {},
      validRules: [],
      data:{},
      selectValue:'',
      senderName:'',
      receiverName:'',
      senderPhone:'',
      receiverPhone:'',
      senderAddressDetail:'',
      receiverAddressDetail:'',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      flag:true
    }
  },

  mixins: [Reflux.listenTo(ManageOrderStore, "onServiceComplete"), ModalForm('ManageOrder')],
  onServiceComplete: function(data) {
      if(data.operation === 'update'){
          if( data.errMsg === ''){
             // this.setState({ ManageOrder:data.object});
              this.state[this.state.selectValue] = '';
              this.setState({loading:false});
          }else{
              var ManageOrder = Utils.deepCopyValue(this.state.ManageOrder);
              ManageOrder[this.state.selectValue] = this.state[this.state.selectValue];
              this.state[this.state.selectValue] = '';
              this.setState({ManageOrder});
              message.destroy();
              message.warn('该订单已修改，不可更改！');
          }
      }
    if(data.operation === 'queryOrderDetail'){
      if( data.errMsg === ''){
            //图片的处理
          var fileList = [];
          if(data.orderDetail.photo != null && data.orderDetail.photo != ''){
              var img = data.orderDetail.photo.split(',')
              img.map(item=>{
                  var obj = {uid:item,status: 'done',url: Common.fileAddress+'/gridfs/find?fileId='+item};
                  fileList.push(obj)
              })
          }
          var flag  = false;
         if(data.orderDetail.orderStatus  == '0' || data.orderDetail.orderStatus  == '1'){
             flag = true;
         }
        // 成功，关闭窗口
        this.setState({
          loading: false,
          isLoaded:true,
          ManageOrder:data.orderDetail,
          courier:data.orderDetail.courierInfo?data.orderDetail.courierInfo:{},
          data:data.orderDetail.routeInfo?data.orderDetail.routeInfo:{},
          fileList,
          flag
        })
      }
      else{
        // 失败
        this.setState({
          loading: false,
          ManageOrderSet: data
        });
      }
    }
  },
  // 第一次加载
  componentDidMount : function(){
    this.setState({loading:true});
    const filter=this.props.ManageOrder.uuid;

    ManageOrderActions.getManageOrderDetail(filter);
      let attrList=[{
          name: 'senderPhone',
          validator: this.checkPhone,
      },
          {
              name: 'receiverPhone',
              validator: this.checkPhone,
          }
      ];
      this.state.validRules = this.getFormRule(attrList);
  },
    getFormRule: function (attrList)
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
            { id: 'senderName', desc: '寄件人姓名', required: true,max:10},
            { id: 'receiverName', desc: '收件人姓名', required: true,max:10},
            { id: 'senderPhone', desc: '寄件人联系方式', required: true,   ...attrMap.senderPhone},
            { id: 'receiverPhone', desc: '收件人联系方式', required: true,  ...attrMap.receiverPhone},
            { id: 'senderAddressDetail', desc: '寄件人地址', required: true,},
            { id: 'receiverAddressDetail', desc: '收件人地址', required: true,},
        ];
        return rules;
    },
    checkPhone:function(value){
        let test=/^(([0,2-9]\d{3,11})|(0\d{2,3}-\d{7,8})|(1\d{10}))$/;
        let testValue=test.test(value);
        if (!testValue) {
            return '请输入正确的联系方式';
        }
    },
  goBack:function(){
    this.props.onBack();
  },

  onTabChange:function(activeKey){
    if(activeKey === '1'){
      this.props.onBack();
    }
  },
  handleOrderSource:function(data){
    switch(data){
      case '0':
        return '快递通-微信小程序';
        break;
      case '1':
        return '爱喜来-App';
        break;
      case '2':
        return '支付宝-我的快递';
        break;
      case '3':
        return '快递通-支付宝小程序';
        break;
      case '4':
        return '快递通-App';
        break;

    }
  },
  handleOrderStatus:function(data){
    switch(data){
      case '0':
       return '待接单';

        break;
      case '1':
        return '待取件';
        break;
      case '2':
        return '已取件';
        break;
      case '3':
        return '待发件';
        break;
      case '4':
        return '待签收';
        break;
      case '6':
        return '已取消';
        break;
      case '5':
        return '已签收';
        break;
    }
  },
  handleGoodsType:function(data){
      if (data == '1') {
          return '日用品'
      } else if (data == '2') {
          return '数码产品'
      } else if (data == '3') {
          return '衣物'
      } else if (data == '4') {
          return '食物'
      } else if (data == '5') {
          return '文件'
      } else{
          var goodsRemark = this.state.ManageOrder.goodsRemark;
          return goodsRemark;
      }
  },
onClickAlter:function (name) {
    //修改图标的点击
    this.state[name]=this.state.ManageOrder[name];
    this.setState({loading:false});
  },
    onBlurAlter:function(val,value){
      if(val != 'check' && val != 'close'){
          return;
      }
        let object={};
        object[value]=this.state.ManageOrder[value];
      if (Common.validator(this,object, value)) {
          if(val == 'check'){
              var obj={uuid:this.state.ManageOrder.uuid};
              obj[value] = this.state.ManageOrder[value];
              ManageOrderActions.updateManageOrder(obj);
              this.state.selectValue = value;
          }else{
              var ManageOrder = Utils.deepCopyValue(this.state.ManageOrder);
              ManageOrder[value] = this.state[value];
              this.state[value] = '';
              this.setState({ManageOrder});
          }
      }
    },
    // 图片显示的
    handlePreview :function(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    },
    handleCancel:function(){
        this.setState({ previewVisible: false })
    },
    render : function() {
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 6}),
      wrapperCol: ((layout=='vertical') ? null : {span: 18}),
    };
    const formItemLayout2 = {
      labelCol: ((layout == 'vertical') ? null : { span: 5 }),
      wrapperCol: ((layout == 'vertical') ? null : { span: 17 }),
    };
    var hints = this.state.hints;
    var info = (
            <p style={{wordWrap:'break-word',wordBreak:'normal'}}><span>快递员工号：{this.state.ManageOrder.courierNo}<br/>姓名：{this.state.ManageOrder.courierName}<br/>联系方式：{this.state.ManageOrder.courierTelephone}<br/>所属服务站：{this.state.ManageOrder.orgName}</span></p>
        );
    console.log(this.state.ManageOrder);
    let table=(
          <Form layout={layout} style={{width:'99%'}}>
            <Row gutter={24}>
              <Col span={12}>
                <p style={{fontSize:16,color:'#108ee9'}}>订单详情</p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='订单号' >
                  {this.state.ManageOrder.orderNo}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='订单来源' >
                  {this.handleOrderSource(this.state.ManageOrder.orderSource)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='支付方式' >
                  {this.state.ManageOrder.payStatus=='0'?'未付款':'已付款'}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout2} className={layoutItem} label='运单状态' >
                  {this.handleOrderStatus(this.state.ManageOrder.orderStatus)}
                </FormItem>
              </Col>
            </Row>
            {/*<div style={{width:'100%',height:'1px',background:'#d0cdc7'}}></div>*/}
            <Row gutter={24}>
              <Col span={12}>
              <p style={{fontSize:16,color:'#108ee9'}}>客户信息</p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout2} className={layoutItem} label='寄件人姓名'  help={hints.senderNameHint} validateStatus={hints.senderNameStatus}>
                    { this.state.senderName == '' ? <span>{this.state.ManageOrder.senderName} {this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"senderName")} title='修改'/> :''}</span>:
                        <span><Input  type='text'  id = 'senderName' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.senderName}/><Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','senderName')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','senderName')} title='取消'/></span>
                        }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout2} className={layoutItem} label='收件人姓名' help={hints.receiverNameHint} validateStatus={hints.receiverNameStatus} >
                    {this.state.receiverName  == '' ?<span>{this.state.ManageOrder.receiverName}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"receiverName")} title='修改'/> :''}</span>:
                       <span> <Input  type='text'  id = 'receiverName' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.receiverName} onBlur={this.onBlurAlter}/><Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','receiverName')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','receiverName')} title='取消'/></span>}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout2} className={layoutItem} label='寄件人联系方式'   help={hints.senderPhoneHint} validateStatus={hints.senderPhoneStatus}>
                    {this.state.senderPhone == '' ?<span>{this.state.ManageOrder.senderPhone}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"senderPhone")} title='修改'/> :''}</span>:
                        <span><Input  type='text'  id = 'senderPhone' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.senderPhone} onBlur={this.onBlurAlter} maxLength={12}/><Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','senderPhone')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','senderPhone')} title='取消'/></span>}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout2} className={layoutItem} label='收件人联系方式'   help={hints.receiverPhoneHint} validateStatus={hints.receiverPhoneStatus}>
                    {this.state.receiverPhone == '' ?<span>{this.state.ManageOrder.receiverPhone}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"receiverPhone")} title='修改'/> :''}</span>:
                        <span><Input  type='text'  id = 'receiverPhone' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.receiverPhone} onBlur={this.onBlurAlter} maxLength={12}/><Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','receiverPhone')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','receiverPhone')} title='取消'/></span>}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout2} className={layoutItem} label='寄件人地址'  help={hints.senderAddressDetailHint} validateStatus={hints.senderAddressDetailStatus}>
                    {this.state.senderAddressDetail == '' ?<span>{this.state.ManageOrder.senderProvinceCityCountyName+' '+this.state.ManageOrder.senderAddressDetail}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"senderAddressDetail")} title='修改'/> :''}</span>:
                        <span>
                           {this.state.ManageOrder.senderProvinceCityCountyName}
                            <Input  type='text'  id = 'senderAddressDetail' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.senderAddressDetail} onBlur={this.onBlurAlter}/>
                            <Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','senderAddressDetail')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','senderAddressDetail')} title='取消'/>
                        </span>}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout2} className={layoutItem} label='收件人地址'  help={hints.receiverAddressDetailHint} validateStatus={hints.receiverAddressDetailStatus}>
                    {this.state.receiverAddressDetail == '' ?<span>{this.state.ManageOrder.receiverProvinceCityCountyName+' '+this.state.ManageOrder.receiverAddressDetail}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"receiverAddressDetail")} title='修改'/> :''}</span>:
                        <span>
                           {this.state.ManageOrder.receiverProvinceCityCountyName}
                            <Input  type='text'  id = 'receiverAddressDetail' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.receiverAddressDetail} onBlur={this.onBlurAlter}/>
                            <Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','receiverAddressDetail')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','receiverAddressDetail')} title='取消'/>
                        </span>}
                </FormItem>
              </Col>
            </Row>
            {/*<div style={{width:'100%',height:'1px',background:'#d0cdc7'}}></div>*/}
            <Row gutter={24}>
              <Col span={12}>
                <p style={{fontSize:16,color:'#108ee9'}}>运单信息</p>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout2} className={layoutItem} label='订单金额(元)' >
                    {this.state.ManageOrder.orderAmount}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='下单时间' >
                    {this.state.ManageOrder.createTime}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='打印时间' >
                    {this.state.ManageOrder.printTime}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='发件时间' >
                    {this.state.ManageOrder.deliveryTime}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='签收时间' >
                    {this.state.ManageOrder.signatureTime}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='揽收快递员'  style={{cursor:'pointer',color:'#1890FF'}}>
                  <Tooltip placement="bottomLeft" title={info}>
                      {this.state.ManageOrder.courierName}
                  </Tooltip>
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='喜来单号' >
                    {this.state.ManageOrder.xlLogisticsNo}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='快递公司' >
                    {this.state.ManageOrder.logisticsCompanyName}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='运输方式' >
                    {this.state.ManageOrder.transportTypeName}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='快递单号' >
                    {this.state.ManageOrder.logisticsNo}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='物品类型' >
                    {this.handleGoodsType(this.state.ManageOrder.goodsType)}
                </FormItem>
                <FormItem {...formItemLayout2} className={layoutItem} label='物品重量(kg)' >
                    {this.state.ManageOrder.goodsWeight}
                </FormItem>
              </Col>
              <Col span={12}>

                <TimeLine  data={this.state.data}/>

              </Col>
            </Row>
              {(this.state.ManageOrder.photo != null&&this.state.ManageOrder.photo != '' )? <span>
                    <div style={{width:'100%',height:'1px',background:'#d0cdc7'}}></div>
                        <Row gutter={24}>
                          <Col span={12}>
                            <p style={{fontSize:16,color:'#108ee9'}}>留证信息</p>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={24} >
                              <span className='orderImage'>
                            <Upload
                                listType="picture-card"
                                fileList={this.state.fileList}
                                onPreview={this.handlePreview}
                            >
                            </Upload>
                            <Modal visible={this.state.previewVisible} footer={null}  onCancel={this.handleCancel} className='modal-noTitle'>
                              <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                            </Modal>
                              </span>
                          </Col>
                        </Row>
              </span>:''}
          </Form>
       );
     let tables=(
         <Form layout={layout} style={{width:'98%',fontSize:12}}>
             <Row gutter={24} style={{marginLeft:28,marginTop:30,paddingTop:12,paddingBottom:12,backgroundColor:'#FAFAFA'}}>
                 <Col span={6}>
                     订单号:  {this.state.ManageOrder.orderNo}
                     {/*<FormItem {...formItemLayout2} className={layoutItem} label='订单号' >*/}
                         {/*{this.state.ManageOrder.orderNo}*/}
                     {/*</FormItem>*/}
                 </Col>
                 <Col span={6}>
                     订单来源:  {this.handleOrderSource(this.state.ManageOrder.orderSource)}
                     {/*<FormItem {...formItemLayout2} className={layoutItem} label='订单来源' >*/}
                         {/*{this.handleOrderSource(this.state.ManageOrder.orderSource)}*/}
                     {/*</FormItem>*/}
                 </Col>
                 <Col span={6}>
                     支付方式:  {this.state.ManageOrder.payStatus=='0'?'未付款':'已付款'}
                     {/*<FormItem {...formItemLayout2} className={layoutItem} label='支付方式' >*/}
                         {/*{this.state.ManageOrder.payStatus=='0'?'未付款':'已付款'}*/}
                     {/*</FormItem>*/}
                 </Col>
                 <Col span={6}>
                     运单状态:  {this.handleOrderStatus(this.state.ManageOrder.orderStatus)}
                     {/*<FormItem {...formItemLayout2} className={layoutItem} label='运单状态' >*/}
                         {/*{this.handleOrderStatus(this.state.ManageOrder.orderStatus)}*/}
                     {/*</FormItem>*/}
                 </Col>
             </Row>
             {/*<div style={{width:'100%',height:'1px',background:'#d0cdc7'}}></div>*/}
             <Row gutter={24} style={{marginLeft:28,marginTop:30,paddingTop:12,paddingBottom:12}}>
                 <Col span={12}>
                     <p style={{fontSize:12,color:'#000',fontWeight:600}}>客户信息</p>
                 </Col>
             </Row>
             <Row gutter={24} style={{paddingLeft:38}}>
                 <Col span={12}>
                     <FormItem {...formItemLayout2} className={layoutItem} label='寄件人姓名'  help={hints.senderNameHint} validateStatus={hints.senderNameStatus}>
                         { this.state.senderName == '' ? <span>{this.state.ManageOrder.senderName} {this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"senderName")} title='修改'/> :''}</span>:
                             <span><Input  type='text'  id = 'senderName' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.senderName}/><Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','senderName')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','senderName')} title='取消'/></span>
                         }
                     </FormItem>
                 </Col>
                 <Col span={12}>
                     <FormItem {...formItemLayout2} className={layoutItem} label='收件人姓名' help={hints.receiverNameHint} validateStatus={hints.receiverNameStatus} >
                         {this.state.receiverName  == '' ?<span>{this.state.ManageOrder.receiverName}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"receiverName")} title='修改'/> :''}</span>:
                             <span> <Input  type='text'  id = 'receiverName' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.receiverName} onBlur={this.onBlurAlter}/><Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','receiverName')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','receiverName')} title='取消'/></span>}
                     </FormItem>
                 </Col>
             </Row>
             <Row gutter={24} style={{paddingLeft:38}}>
                 <Col span={12}>
                     <FormItem {...formItemLayout2} className={layoutItem} label='寄件人联系方式'   help={hints.senderPhoneHint} validateStatus={hints.senderPhoneStatus}>
                         {this.state.senderPhone == '' ?<span>{this.state.ManageOrder.senderPhone}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"senderPhone")} title='修改'/> :''}</span>:
                             <span><Input  type='text'  id = 'senderPhone' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.senderPhone} onBlur={this.onBlurAlter} maxLength={12}/><Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','senderPhone')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','senderPhone')} title='取消'/></span>}
                     </FormItem>
                 </Col>
                 <Col span={12}>
                     <FormItem {...formItemLayout2} className={layoutItem} label='收件人联系方式'   help={hints.receiverPhoneHint} validateStatus={hints.receiverPhoneStatus}>
                         {this.state.receiverPhone == '' ?<span>{this.state.ManageOrder.receiverPhone}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"receiverPhone")} title='修改'/> :''}</span>:
                             <span><Input  type='text'  id = 'receiverPhone' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.receiverPhone} onBlur={this.onBlurAlter} maxLength={12}/><Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','receiverPhone')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','receiverPhone')} title='取消'/></span>}
                     </FormItem>
                 </Col>
             </Row>
             <Row gutter={24} style={{paddingLeft:38}}>
                 <Col span={12}>
                     <FormItem {...formItemLayout2} className={layoutItem} label='寄件人地址'  help={hints.senderAddressDetailHint} validateStatus={hints.senderAddressDetailStatus}>
                         {this.state.senderAddressDetail == '' ?<span>{this.state.ManageOrder.senderProvinceCityCountyName+' '+this.state.ManageOrder.senderAddressDetail}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"senderAddressDetail")} title='修改'/> :''}</span>:
                             <span>
                           {this.state.ManageOrder.senderProvinceCityCountyName}
                                 <Input  type='text'  id = 'senderAddressDetail' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.senderAddressDetail} onBlur={this.onBlurAlter}/>
                            <Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','senderAddressDetail')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','senderAddressDetail')} title='取消'/>
                        </span>}
                     </FormItem>
                 </Col>
                 <Col span={12}>
                     <FormItem {...formItemLayout2} className={layoutItem} label='收件人地址'  help={hints.receiverAddressDetailHint} validateStatus={hints.receiverAddressDetailStatus}>
                         {this.state.receiverAddressDetail == '' ?<span>{this.state.ManageOrder.receiverProvinceCityCountyName+' '+this.state.ManageOrder.receiverAddressDetail}{this.state.flag ? <Icon type="edit"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onClickAlter.bind(this,"receiverAddressDetail")} title='修改'/> :''}</span>:
                             <span>
                           {this.state.ManageOrder.receiverProvinceCityCountyName}
                                 <Input  type='text'  id = 'receiverAddressDetail' onChange={this.handleOnChange} style={{width:'50%'}} value={this.state.ManageOrder.receiverAddressDetail} onBlur={this.onBlurAlter}/>
                            <Icon type="check"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'check','receiverAddressDetail')} title='确认'/> <Icon type="close"  style={{marginLeft:10,cursor:'pointer'}} onClick={this.onBlurAlter.bind(this,'close','receiverAddressDetail')} title='取消'/>
                        </span>}
                     </FormItem>
                 </Col>
             </Row>
             {/*<div style={{width:'100%',height:'1px',background:'#d0cdc7'}}></div>*/}
             <Row gutter={24} style={{marginLeft:28,marginTop:30,paddingTop:12,paddingBottom:12}}>
                 <Col span={12}>
                     <p style={{fontSize:12,color:'#000',fontWeight:600}}>运单信息</p>
                 </Col>
             </Row>
             <Row gutter={24} style={{paddingLeft:38}}>
                 <Col span={12}>
                     <FormItem {...formItemLayout2} className={layoutItem} label='订单金额(元)' >
                         {this.state.ManageOrder.orderAmount}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='下单时间' >
                         {this.state.ManageOrder.createTime}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='打印时间' >
                         {this.state.ManageOrder.printTime}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='发件时间' >
                         {this.state.ManageOrder.deliveryTime}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='签收时间' >
                         {this.state.ManageOrder.signatureTime}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='揽收快递员'  style={{cursor:'pointer'}}>
                         <span style={{color:'#1890FF'}}>
                         <Tooltip placement="bottomLeft" title={info}>
                             {this.state.ManageOrder.courierName}
                         </Tooltip>
                         </span>
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='喜来单号' >
                         {this.state.ManageOrder.xlLogisticsNo}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='快递公司' >
                         {this.state.ManageOrder.logisticsCompanyName}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='运输方式' >
                         {this.state.ManageOrder.transportTypeName}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='快递单号' >
                         {this.state.ManageOrder.logisticsNo}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='物品类型' >
                         {this.handleGoodsType(this.state.ManageOrder.goodsType)}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='物品重量(kg)' >
                         {this.state.ManageOrder.goodsWeight}
                     </FormItem>
                     <FormItem {...formItemLayout2} className={layoutItem} label='计价重量(kg)' >
                         {this.state.ManageOrder.billingWeight}
                     </FormItem>
                 </Col>
                 <Col span={12}>
                     <TimeLine  data={this.state.data}/>
                 </Col>
             </Row>
             {(this.state.ManageOrder.photo != null&&this.state.ManageOrder.photo != '' )? <span>
                    {/*<div style={{width:'100%',height:'1px',background:'#d0cdc7'}}></div>*/}
                        <Row gutter={24} style={{marginLeft:28,marginTop:30,paddingTop:12,paddingBottom:12}}>
                          <Col span={12}>
                            <p style={{fontSize:12,color:'#000',fontWeight:600}}>留证信息</p>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={24} >
                              <span className='orderImage'>
                            <Upload
                                listType="picture-card"
                                fileList={this.state.fileList}
                                onPreview={this.handlePreview}
                            >
                            </Upload>
                            <Modal visible={this.state.previewVisible} footer={null}  onCancel={this.handleCancel} className='modal-noTitle'>
                              <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                            </Modal>
                              </span>
                          </Col>
                        </Row>
              </span>:''}
         </Form>
     );
    return (
        <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>

          <Tabs defaultActiveKey="2"  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
            <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}>
            </TabPane>
            <TabPane tab="订单详情" key="2" style={{width: '100%', height: '100%'}}>
              <div style={{padding:"8px 0 35px 8px", height: '100%',overflowY: 'auto'}}>
                <ServiceMsg ref='mxgBox' svcList={['manageOrder/queryOrderDetail']}/>
                {
                  this.state.loading ?
                      <Spin tip="正在努力加载数据..."><div style={{minHeight: '200px'}}></div></Spin>
                      :
                      <div className="demo">{tables}</div>
                }
              </div>
            </TabPane>
          </Tabs>

        </div>
    );
  }
});

export default OrderDetailPage;