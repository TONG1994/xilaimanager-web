import React from 'react';
import Reflux from 'reflux';
import { Form, Modal, Button, Row, Col ,Tabs , Steps , Divider , message} from 'antd';
const TabPane = Tabs.TabPane;
const Step = Steps.Step;
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
import CloseWorkSheetModal from './CloseWorkSheetModal';
import ForwardWorkSheetModal from './ForwardWorkSheetModal';
import DetailsModal from './DetailsModal';
let worksheetManagementStore = require('../store/WorksheetManagementStore');
let worksheetManagementActions = require('../action/WorksheetManagementActions.js');
let FormDef = require('./WorksheetManagementForm');

let leftItems;
let worksheetManagementModal = React.createClass({
  getInitialState: function () {
    return {
      worksheetManagemen: {},
      loading: false,
      modal: false,
      hints: {},
      validRules: [],
      tabIndex:'2',
      leftData:{},
      rightData: {},
      buttonType: '',
      disStyle: '',
      current: '',
      inputClass:'',
      imgStyle:'',
    };
  },

  mixins: [Reflux.listenTo(worksheetManagementStore, 'onServiceComplete'), ModalForm('worksheetManagemen')],
  onServiceComplete: function (data) {
    this.setState({loading:false});
    if(data.errMsg){
      if(data.operation === 'resolve'){
        if(data.errCode==="90018"){
          this.setState({errMsg:data.errMsg});
          this.ErrConfirm("该用户已被删除，请重新登录");
        }
      }else if( data.operation === 'activate' ){
        message.error("该受理人已被删除，激活失败");
      }
        this.setState({loading:false});
        return;
    }
  },

  ErrConfirm: function (content) {
    Modal.error({
        title: '错误',
        content: content,
        onOk: this.reload
    });  
},

reload: function(){
  window.sessionStorage.removeItem('loginData');
  window.location.reload();
},

componentDidMount: function(){
  let attrs=[
    {
      name: 'userPhone',
      dataType:'mobile',
    },
    {
      name: 'userMail',
      dataType:'email',
      allowed: true
    }
  ];
  this.state.validRules=FormDef.getLeftFormRule(this);
  this.state.validRules=this.state.validRules.concat(FormDef.getRightFormRule(this,attrs));
},

  initComponenetData: function(recordData){
    let attrList = null;
    let disStyle=recordData.status==="1"?false:true;
    this.setState({
      worksheetManagemen: recordData,
      buttonType: recordData.status,
      disStyle : disStyle,
    })
  },

  clear: function(){
    FormDef.initLeftForm(this.state.worksheetManagemen);
    FormDef.initRightForm(this.state.worksheetManagemen);
    this.state.hints = {};
    this.state.loading = false;
    if (typeof(this.refs.mxgBox) !== 'undefined') {
        this.refs.mxgBox.clear();
    }
  },

  onClickUpdate: function(type){
    if (Common.formValidator(this, this.state.worksheetManagemen)) {
      let worksheetManagemen=this.state.worksheetManagemen;
      let loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
      if(!loginData.staffInfo){
          Common.infoMsg("请重新登陆");
          return;
      }
      if(type==="resolve"){
          if( loginData.staffInfo.userUuid!==worksheetManagemen.acceptMan){
            Common.infoMsg("您不是受理人,不能做此次操作");
            return;
          }
          let obj=Object.assign({},{
            finalAnswerMan : loginData.staffInfo.userUuid , 
            editor : loginData.staffInfo.userUuid,
            finalAnswerContent : worksheetManagemen.finalAnswerContent,
            uuid : worksheetManagemen.uuid,
            code:worksheetManagemen.code
          });
          this.setState({ loading: true });
          worksheetManagementActions.resolve(obj);
      }else if(type==="active"){
          let obj=Object.assign({},{
            editor:loginData.staffInfo.userUuid,
            uuid:worksheetManagemen.uuid,
            code:worksheetManagemen.code
          });
          this.setState({ loading: true });
          worksheetManagementActions.reActive(obj);
      }
    }
  },

  //关闭工单
  makeCloseWookSheet: function(){
    let worksheetManagemen = this.state.worksheetManagemen;
    let loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
    if(!loginData.staffInfo){
      Common.infoMsg("请重新登陆");
      return;
    }
    if( loginData.staffInfo.userUuid!==worksheetManagemen.creator){
      Common.infoMsg("您不是发起人,不能做此次操作");
      return;
    }
    if(this.CloseWorkSheet){
      this.CloseWorkSheet.showModal();
      this.CloseWorkSheet.clear();
      this.CloseWorkSheet.initEditData(worksheetManagemen);
    }
  },

  //转派工单
  makeForwardWookSheet: function(){
    let worksheetManagemen = this.state.worksheetManagemen;
    let loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
    if(!loginData.staffInfo){
      Common.infoMsg("请重新登陆");
      return;
    }
    if( loginData.staffInfo.userUuid!==worksheetManagemen.acceptMan){
      Common.infoMsg("您不是受理人,不能做此次操作");
      return;
    }
    if(this.ForwardWorkSheet){
      this.ForwardWorkSheet.showModal();
      this.ForwardWorkSheet.clear();
      this.ForwardWorkSheet.initEditData(worksheetManagemen);
    }
  },

  // 查看详情
  openDetailModal: function(){
    let worksheetManagemen = this.state.worksheetManagemen;
    let loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
    if(!loginData.staffInfo){
      Common.infoMsg("请重新登陆");
      return;
    }
    if(this.DetailsModal){
      let obj={ code: worksheetManagemen.code };
      worksheetManagementActions.retrieveDetails(obj);
    }
  },

  doConfirm: function () {
    let worksheetManagemen=this.state.worksheetManagemen;
    let loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
    if(!loginData.staffInfo){
      Common.infoMsg("请重新登陆");
      return;
    }
    if( loginData.staffInfo.userUuid!==worksheetManagemen.creator){
      Common.infoMsg("您不是发起人,不能做此次操作");
      return;
    }
    let content=`是否确定重新激活此工单 并指定 ${worksheetManagemen.acceptManName} 为受理人`;
    Modal.confirm({
        title: '激活工单',
        content: content,
        okText: '确定',
        cancelText: '取消',
        onOk: this.onClickUpdate.bind(this, "active")
    });
  },

  goBack: function(){
    this.clear();
    this.props.goBack();
  },

  onTabChange:function(key){
    if(key==="1"){
      this.goBack();
    }else{
      this.setState({
        tabIndex: key
      })
    }
  },

  render: function () {
    let attrList = null , tabIndex = this.state.tabIndex;
    let worksheetManagemen = this.state.worksheetManagemen;
    let title = this.props.actionType === 'create'?'创建工单': this.props.actionType ==='update'?'工单详情':'模态框';
    leftItems = FormDef.getLeftForm(this,this.state.worksheetManagemen, attrList);
    let rightItems = FormDef.getRightForm(this,this.state.worksheetManagemen, attrList);
    let StepsComponenet = (
        <div className="lifeCycle" style={{height:"100%",width:"100%",backgroundColor:"rgba(0,0,0,0)", margin:"25px 0px",marginLeft:"15px"}}>
            <div style={{width:"85%",display:"inline-block"}}>
            <Steps current={ worksheetManagemen.status==="1" ?1:worksheetManagemen.status==="2"?2:3} >
              <Step title="提交" description={worksheetManagemen.createTime} />
              <Step title="处理" description={worksheetManagemen.status==="1"?"":worksheetManagemen.finalAnswerTime} />
              <Step title="关闭" description={worksheetManagemen.status==="3"?worksheetManagemen.finalAnswerTime:""} />
            </Steps>
            </div>
            <div style={{display:"inline-block",marginLeft:25}} onClick={this.openDetailModal}><a href="#" style={{textDecoration:"none"}}>查看流转详情</a></div>
        </div>
    );

    return (
      <div className="deal-content" style={{overflow:'hidden', height:'100%', paddingLeft: '0px'}}>
        <Tabs  activeKey={tabIndex}  onChange={this.onTabChange} tabBarStyle={{paddingLeft: '16px', margin: '-36px 0 0'}} style={{width: '100%', height: '100%', padding: '36px 0 0'}}>
            <TabPane tab="返回" key="1" style={{width: '100%', height: '100%'}}> <Divider type="vertical" /></TabPane>

            <TabPane tab={title} key="2" style={{width: '100%', height: '100%'}}>
              <div style={{marginLeft:"20px"}}>
                <Row>
                  <Col span={16}>
                    {/* 生命周期 */}
                    {StepsComponenet}
                    {/* 左边工单信息form */}
                    <div className="leftForm" style={{padding:'8px 0 16px 0px', height: '100%',width:'100%'}}>
                          {/* 标题 */}
                          <div className="left-form-label" style={{marginLeft:"15px",marginBottom:"10px"}}>
                            <div style={{display:"inline-block",height:"11px",width:"2px",backgroundColor:"#108ee9"}} />
                            <div style={{fontSize:"14px",fontWeight:"bold",display:"inline-block",marginLeft:"3px",color:"black"}}>工单信息</div>
                          </div>
                          <Form layout='horizontal'>
                          
                            { leftItems }

                          {this.state.buttonType==="1"?
                          <div style={{marginTop:20,textAlign:"left",marginLeft:"15px"}}>
                            <Button type="primary" size="large" onClick={this.onClickUpdate.bind(this,"resolve")} loading={this.state.loading} disabled={this.state.loading}>提交</Button>
                            <Button size="large" style={{marginLeft:10} } onClick={this.makeForwardWookSheet.bind(this,"goto")}>转派工单</Button>
                          </div>
                          :this.state.buttonType==="2"?
                          <div style={{marginTop:20,textAlign:"left",marginLeft:"15px"}}>
                            <Button type="primary" size="large" onClick={this.makeCloseWookSheet.bind(this,"close")}>关闭工单</Button>
                          </div>
                          :
                          (<div style={{marginTop:20,textAlign:"left",marginLeft:"15px"}}>
                            <Button type="primary" size="large" onClick={this.doConfirm} loading={this.state.loading} disabled={this.state.loading}>重新激活</Button>
                          </div>)
                          }
                          </Form>
                    </div>
                  </Col>
                  {/* 竖线 */}
                  <Col span={1} >
                    <div style={{ height: "600px",borderRight:"1px solid 	RGB(216,216,216)"}}></div>
                  </Col>
                  {/* 右边用户信息form */}
                  <Col span={7}>
                    <div className="rightForm" style={{ marginTop:20,marginLeft:"10px",padding:'8px 0 16px 0px', height: '100%'}}>
                        <div className="left-form-label" style={{marginLeft:"15px",marginBottom:"10px"}}>
                          <div style={{display:"inline-block",height:"11px",width:"2px",backgroundColor:"#108ee9"}} />
                          <div style={{fontSize:"14px",fontWeight:"bold",display:"inline-block",marginLeft:"3px",color:"black"}}>用户信息</div>
                        </div>
                        <Form layout='horizontal'>
                          { rightItems }
                        </Form>
                    </div>
                  </Col>
                </Row>
              </div>
              <CloseWorkSheetModal ref={ref=>this.CloseWorkSheet=ref} goBack={this.props.goBack} />
              <ForwardWorkSheetModal ref={ref=>this.ForwardWorkSheet=ref} goBack={this.props.goBack} />
              <DetailsModal ref={ref=>this.DetailsModal=ref} />
            </TabPane>
        </Tabs>
      </div>
      
    );
  }
});
export default worksheetManagementModal;