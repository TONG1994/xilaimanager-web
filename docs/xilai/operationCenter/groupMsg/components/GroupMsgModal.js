import React from 'react';
let Reflux = require('reflux');
import moment from 'moment';
import { Form, Tabs, Select, Input, DatePicker, Checkbox, Button } from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
let Common = require('../../../../public/script/common');
let GroupMsgActions = require('../action/GroupMsgActions');
let GroupMsgStore = require('../store/GroupMsgStore.js');
let Utils = require('../../../../public/script/utils');

const plainOptions = ['快递员', '管理员', '用户'];
const defaultCheckedList = [];
//let timeFormat = 'YYYY年MM月DD日HH时mm分ss秒';
let timeFormat = 'YYYY-MM-DD HH:mm:ss';


let GroupMsgModal = React.createClass({
  getInitialState: function () {
    return {
      tabIndex: '2',
      hints: {},
      validRules: [],
      msg: {
        messageType: 'versions-update',
        textkey: '',
        sendtime: '',
        numbernum: '0',
        notifyobject: '',
      },
      staffNum: '0',//快递员人数
      managerNum: '0',//管理员人数
      consumerNum: '0',//用户人数
      checkedList: defaultCheckedList,
      checkAll: false,
      userType: '',
      staffSelectDisabled:false,//是否禁用选择员工对象
      userList:'',//查询的员工列表
      sendUserUuids:[],//传给后台的员工uuid
      userShowList:[]//显示选择框内的员工信息
    };
  },
  mixins: [Reflux.listenTo(GroupMsgStore, 'onServiceComplete')],
  onServiceComplete: function (data) {
    this.setState({
      loading: false,
    });
    if (data.operation == 'retrieveNum') {
      if (this.state.userType == 'STAFF') {
        this.state.staffNum = data.recordSet;
        this.managerNum();
      } else if (this.state.userType == 'MANAGER') {
        this.state.managerNum = data.recordSet;
        this.consumerNum();
      } else if (this.state.userType == 'CONSUMER') {
        this.state.consumerNum = data.recordSet;
      }
    }
    if(data.operation == 'getSendMsgableUserList'){
      this.state.userList = data.recordSetStaff;
      let userList = this.state.userList;
      let sendUserUuids = this.state.sendUserUuids; //传的用户uuid
      let staffArr = [];
        sendUserUuids.map((item)=>{
          userList.map(jtem=>{
            if(jtem.uuid === item){
                staffArr.push(jtem.uuid+jtem.name+jtem.phone);
            }
          })
        });
        this.state.userShowList = staffArr;

    }

    switch (data.operation) {
      case 'create':
      case 'update':
        this.setState({ loading: false });
        this.goBack();
        break;
      default:
        break;
    }
  },
  //第一次加载
  componentDidMount: function () {
    this.staffNum();
    let attrList = [{
      name: 'sendtime',
      validator: this.checkSendTime
    }, {
      name: 'textkey',
      validator: this.checkTextKey
    }];

    this.state.validRules = this.getFormRule(this, attrList);
    // let obj = {};
      // GroupMsgActions.getSendMsgableUserList(obj);
  },
  //查询快递员人数
  staffNum: function () {
    this.setState({ userType: 'STAFF' }, () => {
      GroupMsgActions.retrieveNum({ 'userType': 'STAFF' });
    });

  },
  //查询管理员人数
  managerNum: function () {
    this.setState({ userType: 'MANAGER' }, () => {
      GroupMsgActions.retrieveNum({ 'userType': 'MANAGER' });
    });


  },
  //查询用户人数
  consumerNum: function () {
    this.setState({ userType: 'CONSUMER' }, () => {
      GroupMsgActions.retrieveNum({ 'userType': 'CONSUMER' });
    });
  },
  //保存
  onClickSave: function () {
    // if (!this.state.msg.sendtime) {
    //   Common.infoMsg('请选择短信发送时间！');
    //   return;
    // }
    // if (!this.state.msg.textkey) {
    //   Common.infoMsg('请选择短信内容的起止时间！');
    //   return;
    // }
    // if (!this.state.msg.notifyobject) {
    //   Common.infoMsg('请选择短信通知对象！');
    //   return;
    // }
    if (Common.formValidator(this, this.state.msg)) {

      let obj = {};
      obj.messageType = this.state.msg.messageType;
      obj.sendtime = this.state.msg.sendtime;
      obj.textkey = this.state.msg.textkey;
      obj.notifyobject = this.state.msg.notifyobject;
      obj.numbernum = this.state.msg.numbernum;
      if(this.state.msg.notifyobject == 'OTHER'){
          obj.sendUserUuids = this.state.sendUserUuids;
      }
      if (this.props.actionType === 'edit') {
        obj.uuid = this.state.msg.uuid;
        obj.createTime = this.state.msg.createTime;
        GroupMsgActions.editMsg(obj);
      } else if (this.props.actionType === 'add') {
        GroupMsgActions.addMsg(obj);
      }
    }


  },
  //初始化
  initEditData: function (record) {
    this.state.msg = Utils.deepCopyValue(record);
    this.setState({ loading: false });
    let notifyobject = this.state.msg.notifyobject === '' || this.state.msg.notifyobject == undefined ? undefined : this.state.msg.notifyobject;


    if (notifyobject == '') {
      this.setState({ checkedList: [] });
    } else if (notifyobject == 'STAFF') {
      this.setState({ checkedList: ['快递员'] });
    } else if (notifyobject == 'MANAGER') {
      this.setState({ checkedList: ['管理员'] });
    } else if (notifyobject == 'CONSUMER') {
      this.setState({ checkedList: ['用户'] });
    } else if (notifyobject == 'STAFF,MANAGER') {
      this.setState({ checkedList: ['快递员', '管理员'] });
    } else if (notifyobject == 'STAFF,CONSUMER') {
      this.setState({ checkedList: ['快递员', '用户'] });
    } else if (notifyobject == 'MANAGER,CONSUMER') {
      this.setState({ checkedList: ['管理员', '用户'] });
    } else if (notifyobject == 'STAFF,MANAGER,CONSUMER') {
      this.setState({ checkAll: true, checkedList: ['快递员', '管理员', '用户'] });
    } else if(notifyobject == 'OTHER'){
        this.state.sendUserUuids = record.sendUserUuids;
    }
  },
  tabsChange: function (key) {
    if (key == '1') {
      this.goBack();
    } else {
      this.setState({ tabIndex: key });
    }
  },
  goBack: function () {
    this.clear();
    this.props.goBack()
  },
  getFormRule: function (form, attrList) {
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
      { id: 'messageType', desc: '短信类型', required: true, ...attrMap.messageType },
      { id: 'sendtime', desc: '发送时间', required: true, max: '30', ...attrMap.sendtime },
      { id: 'textkey', desc: '短信内容', required: true, ...attrMap.textkey },
      { id: 'notifyobject', desc: '选择通知对象', required: true, ...attrMap.notifyobject },

    ];

    return rules;
  },
  clear: function () {
    //FormDef.initNewsManageForm(this.state.newsManage);
    // FIXME 输入参数，对象初始化
    //this.state.hints = {};
    //this.setState({loading: false, wrapLoading: false});
  },
  //短信内容时间
  sendTimeonChange: function (value, dateString) {
    if (dateString == ',') {
      this.state.msg.textkey = '';
    } else {
      var startHour=dateString.toString().slice(0,13).replace("-","年").replace("-","月").replace(" ","日")+'时' ;
      var endHour=dateString.toString().slice(20,33).replace("-","年").replace("-","月").replace(" ","日")+'时';

      this.state.msg.textkey = startHour+','+endHour;
    }
    this.setState({ loading: false }, () => { Common.validator(this, this.state.msg, 'textkey') });
  },
  //校验发送时间是否10分钟后
  checkSendTime: function (value) {
    let endTime = new Date(value);
    let startTime = new Date();

    let minDiff = (endTime - startTime) / 1000 / 60;
    if (minDiff <= 10) {
      return '请选择10分钟以后的时间';
    }

  },
  //校验维护开始时间是否在发送时间1分钟后
  checkTextKey: function (value, dateString) {
    let sendtime = this.state.msg.sendtime;
    let startTime = new Date(sendtime); // 开始时间
    let endTime = new Date(value.split(",")[0]); // 结束时间
    let secDiff = (endTime - startTime) / 1000 / 60;
    if (secDiff < 1) {
      return '维护开始时间必须晚于发送时间，至少间隔一分钟';
    }
  },
  //禁止选择今天之前的日期
  disabledUpDate: function (current) {
    return current && current < moment(Date.now()).add(-1, 'd');
  },
  //不可选分秒
  disabledRangeTime: function (value, type) {
    let hour;
    let hour2;
    if (value) {
      if (value.length) {
        hour = moment(value[0]).format('HH').toString();
        hour2 = moment(value[1]).format('HH').toString();
      }
    }
    return {
      disabledHours: () => {
        const result = [];
        return result;
      },
      disabledMinutes: () => {
        const result = [];
        for (let i = 1; i < 60; i++) {
          result.push(i);
        }
        return result;
      },
      disabledSeconds: () => {
        const result = [];
        for (let i = 1; i < 60; i++) {
          result.push(i);
        }
        return result;
      },
    };
  },
  //选择发送时间
  DatePickeronChange: function (value, dateString) {
    this.setState({ loading: false }, () => { Common.validator(this, this.state.msg, 'sendtime') });
    this.state.msg.sendtime = dateString;
  },
  //发送对象
  onCheckAllChange: function (e) {
    this.state.checkedList = e.target.checked ? plainOptions : [];
    this.state.checkAll = e.target.checked;
    this.setState({ loading: false });

    this.checkboxNum();
  },
  onCheckboxChange: function (checkedList) {
    this.state.msg.numbernum = '0';
    this.state.checkedList = checkedList;
    this.state.checkAll = checkedList.length === plainOptions.length;
    this.setState({ loading: false });

    this.checkboxNum();
  },
  onStaffSelect:function(value){
      this.setState({ loading: false }, () => { Common.validator(this, this.state.msg, 'notifyobject') });
      this.state.userShowList = value;
      this.state.msg.numbernum = value.length;
      let staffValue = value;
      if(staffValue.length > 0){
          this.state.msg.notifyobject = 'OTHER';
          let userList = [];
          staffValue.map((item)=>{
              userList.push(item.substring(0,16));
          });
          this.setState({ sendUserUuids: userList });
      }else{
          this.setState({ sendUserUuids: [] });
          this.state.msg.notifyobject = '';
      }
  },
  checkboxNum: function () {
    this.setState({ loading: false }, () => { Common.validator(this, this.state.msg, 'notifyobject') });

    if (this.state.checkedList == '') {
      this.state.msg.numbernum = '0';
      this.state.msg.notifyobject = ''
    } else if (this.state.checkedList == '快递员') {
      this.state.msg.numbernum = this.state.staffNum;
      this.state.msg.notifyobject = 'STAFF'
    } else if (this.state.checkedList == '管理员') {
      this.state.msg.numbernum = this.state.managerNum;
      this.state.msg.notifyobject = 'MANAGER'
    } else if (this.state.checkedList == '用户') {
      this.state.msg.numbernum = this.state.consumerNum;
      this.state.msg.notifyobject = 'CONSUMER'
    } else if (this.state.checkedList == '快递员,管理员' || this.state.checkedList == '管理员,快递员') {
      this.state.msg.numbernum = Number(this.state.staffNum) + Number(this.state.managerNum);
      this.state.msg.notifyobject = 'STAFF,MANAGER'
    } else if (this.state.checkedList == '快递员,用户' || this.state.checkedList == '用户,快递员') {
      this.state.msg.numbernum = Number(this.state.staffNum) + Number(this.state.consumerNum);
      this.state.msg.notifyobject = 'STAFF,CONSUMER'
    } else if (this.state.checkedList == '管理员,用户' || this.state.checkedList == '用户,管理员') {
      this.state.msg.numbernum = Number(this.state.managerNum) + Number(this.state.consumerNum);
      this.state.msg.notifyobject = 'MANAGER,CONSUMER'
    } else if (this.state.checkedList == '快递员,管理员,用户' || this.state.checkedList == '快递员,用户,管理员' || this.state.checkedList == '管理员,快递员,用户' || this.state.checkedList == '管理员,用户,快递员' || this.state.checkedList == '用户,快递员,管理员' || this.state.checkedList == '用户,管理员,快递员') {
      this.state.msg.numbernum = Number(this.state.staffNum) + Number(this.state.managerNum) + Number(this.state.consumerNum);
      this.state.msg.notifyobject = 'STAFF,MANAGER,CONSUMER'
    }
  },
  render: function () {
    let tabIndex = this.state.tabIndex;
    let title = this.props.actionType === 'add' ? '新建短信' : this.props.actionType === 'edit' ? '编辑短信' : this.props.actionType === 'check' ? '查看短信' : '模态框';
    let formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      className: 'form-item-horizontal',
    };
    const { hints, } = this.state;
    let sendtime = this.state.msg.sendtime === '' || this.state.msg.sendtime == undefined ? undefined : moment(this.state.msg.sendtime, timeFormat);
    let textkey = this.state.msg.textkey === '' || this.state.msg.textkey == undefined ? undefined : [moment(this.state.msg.textkey.split(",")[0], timeFormat), moment(this.state.msg.textkey.split(",")[1], timeFormat)];
    let isCheckVisible = '', isCheckVisibles = false,isCheckBoxVisibles = false,isCheckUserVisibles = false;
    if (this.props.actionType === 'check') {
      isCheckVisible = 'none';
      isCheckVisibles = true;
      isCheckBoxVisibles = true;
      isCheckUserVisibles = true;
    }
    if(this.state.userShowList.length > 0){
        isCheckBoxVisibles = true;
    }else if(this.state.checkedList.length > 0){
        isCheckUserVisibles = true;
    }
    const children = [];
    let userList = this.state.userList||[];
      userList.map((item)=>{
          children.push(<Option key={item.uuid+item.name+item.phone}>{item.name+item.phone}</Option>);
      });
    return (
      <div style={{ paddingLeft: '20px' }}>
        <Tabs activeKey={tabIndex} onChange={this.tabsChange}>
          <TabPane tab="返回" key="1"></TabPane>
          <TabPane tab={title} key="2">
            <Form layout='horizontal' style={{ width: '800px' }}>
              <FormItem {...formLayout} required key='messageType' label='短信类型' colon={true}
                help={hints.messageTypeHint} validateStatus={hints.messageTypeStatus}>
                <Select defaultValue='版本更新通知' disabled={isCheckVisibles}>
                  <Option value='versions-update'>版本更新通知</Option>
                </Select>
              </FormItem>
              <FormItem {...formLayout} required key='sendtime' label='发送时间' colon={true}
                help={hints.sendtimeHint} validateStatus={hints.sendtimeStatus}>
                <DatePicker
                  showTime
                  showTime={{ hideDisabledOptions: true }}
                  format={timeFormat}
                  onChange={this.DatePickeronChange}
                  value={sendtime}
                  disabled={isCheckVisibles}
                  disabledDate={this.disabledUpDate}
                  placeholder="请选择发送时间"
                  showToday={false}
                  size='default'
                  />
              </FormItem>
              <FormItem style={{ marginTop: '-10px' }} {...formLayout} required key='textkey' label='短信内容' colon={true}
                help={hints.textkeyHint} validateStatus={hints.textkeyStatus}>
                <p style={{ lineHeight: '16px' }}>
                  为了给您提供更优质的服务，我们将于
                  <RangePicker
                    showTime
                    showTime={{ hideDisabledOptions: true,defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')] }}
                    format={timeFormat}
                    onChange={this.sendTimeonChange}
                    value={textkey}
                    disabled={isCheckVisibles}
                    disabledDate={this.disabledUpDate}
                    disabledTime={this.disabledRangeTime}
                    placeholder={['开始时间', '结束时间']}
                    showToday={false}
                    style={{margin:'0 10px'}}
                    size='default'
                  />
                  对系统升级维护，系统升级期间正常使用，由此给您带来的不便敬请谅解。
                </p>
              </FormItem>
              <FormItem style={{ marginTop: '-10px' }} {...formLayout} required key='notifyobject' label='选择通知对象' colon={true}
                help={hints.notifyobjectHint} validateStatus={hints.notifyobjectStatus}>
                <p>(共有<span style={{ color: 'red' }}>{this.state.msg.numbernum}</span>人接收短信)</p>
                <div style={{ marginTop: '-8px' }}>
                  <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                    <Checkbox
                      onChange={this.onCheckAllChange}
                      checked={this.state.checkAll}
                      disabled={isCheckBoxVisibles}
                    >
                      所有人
                    </Checkbox>
                  </div>
                  <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onCheckboxChange} disabled={isCheckBoxVisibles} />
                </div>
                {/*<div style={{marginTop:'10px'}}>*/}
                  {/*<p>请选择通知对象</p>*/}
                    {/*<Select*/}
                        {/*mode="multiple"*/}
                        {/*style={{ width: '100%' }}*/}
                        {/*placeholder="请选择通知对象"*/}
                        {/*onChange={this.onStaffSelect}*/}
                        {/*disabled={isCheckUserVisibles}*/}
                        {/*value={this.state.userShowList}*/}
                    {/*>*/}
                        {/*{children}*/}
                    {/*</Select>*/}
                {/*</div>*/}
              </FormItem>
              <div style={{ textAlign: 'right', display: isCheckVisible }}>
                <Button type='primary' loading={this.state.loading} onClick={this.onClickSave}>保存</Button>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    );
  }
});

module.exports = GroupMsgModal;