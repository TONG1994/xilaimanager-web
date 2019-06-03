import React from 'react';
let Reflux = require('reflux');
import { Form, Modal, Timeline , Row, Col } from 'antd';
let Common = require('../../../../public/script/common');
let Utils = require('../../../../public/script/utils');
let worksheetManagementStore = require('../store/WorksheetManagementStore');
let worksheetManagementActions = require('../action/WorksheetManagementActions.js');
import '../style/main.scss';


let DetailsModal = React.createClass({
  getInitialState: function () {
    return {
      loading: false,
      modal: false,
      detailsData: [],
      hints: {},
      title: <span style={{fontSize:"14px",fontWeight:"bold"}}>工单流转详情</span>,
      worksheetData:{}
    };
  },

  mixins: [Reflux.listenTo(worksheetManagementStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
      this.setState({loading:false});
      if(data.errMsg){
          this.setState({errMsg:data.errMsg});
          return;
      }
      if(data.operation==="findList" && data.errOperation ==="workSheetOperation"){
        this.setState({
          loading: false,
          detailsData : data.detailData,
        },()=>{
          this.showModal();
        })
      }
  },

  // 做新增和修改操作
  initEditData:function (worksheetRecord) {
    this.setState({
      title:<span style={{fontSize:"25px",fontWeight:"bold"}}>工单流转</span>,
      worksheetData: worksheetRecord
    });
  },

  //初始化
  clear: function () {
    // 初始化组件
    this.state.hints = {};
    this.setState({loading:false});
    if (!this.state.modal && typeof (this.refs.mxgBox) !== 'undefined') {
      this.refs.mxgBox.clear();
    }
  },

  
  beforeClose:function () {
    this.clear();
  },

  showModal:function () {
    this.setState({modal:true});
  },

  handleCancel: function() {
    this.setState({ modal: false });
  },

  render: function () {
    let items2=(
      <Timeline>
          {this.state.detailsData.map((item,key,arr)=>{
              return(
                <div >
                  <Timeline.Item key={key}>
                    <div className="worksheet-timeline-head">
                      <span className="timeline-item-title">{item.typeName}</span>  
                      <span className="timeline-item-name">{item.operaterName}</span>  
                      <span className="timeline-item-time">{item.operateTime}</span>
                    </div> 
                    <div className="worksheet-timeline-content">
                      <div style={{wordBreak:"break-all"}}>{item.fieldName}{item.content}</div>
                    </div>
                  </Timeline.Item>
                </div>
              )
            })
          }
      </Timeline>
    )
    return (
      <Modal title = {this.state.title} width="600px" visible = {this.state.modal}  confirmLoading = {this.state.loading}
        onCancel = {this.handleCancel}
        footer = {null}
        maskClosable = {false}
      >
        <div className="worksheet-modal-content">
          {items2}
        </div>
      </Modal>
    );
  }
});

export default DetailsModal;

